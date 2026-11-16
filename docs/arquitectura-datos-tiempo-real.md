# Arquitectura de datos: streaming, IA y gobernanza

> Análisis para la reunión con Alejandro Vásquez (agosto 2026). Responde a la pregunta: ¿cómo se implementa una arquitectura de datos en tiempo real (Kafka + Flink), con IA y los cuatro pilares de gobernanza, para el caso concreto de la flota de La Serena?
>
> **Conclusión corta:** el marco es correcto como destino; implementarlo ahora sería sobreingeniería que puede costar el piloto. La recomendación es una arquitectura de tres horizontes donde el streaming llega cuando un requisito de negocio lo exige, no antes — y demostrar en la reunión que se sabe *cuándo no* usar una herramienta, que es más valioso que saber qué es Kafka.

---

## 1. El diagnóstico: este problema tiene dos relojes

El error de diseño más caro sería aplicarle a la degradación la arquitectura que necesita la operación. Son fenómenos con escalas de tiempo distintas:

| | **Reloj rápido** — operación y seguridad | **Reloj lento** — degradación y vida útil |
|---|---|---|
| **Qué pasa** | Celda sobre temperatura, desbalance súbito, SOC bajo en ruta, falla en camino, control de carga | Pérdida de capacidad del pack, proyección de reemplazo |
| **Velocidad del fenómeno** | Segundos a minutos | **2–4% al año** en una batería LFP |
| **Latencia que aporta valor** | Segundos | Días |
| **Decisión que habilita** | Sacar la micro de ruta, enviar mecánico, cortar la carga | Planificar mantención, presupuestar reemplazo, corregir hábitos |
| **Arquitectura adecuada** | Event-driven / streaming | Series temporales + batch |

> **La latencia que importa no es la del dato: es la de la decisión.** Nadie va a tomar una decisión distinta sobre el reemplazo de un pack por haberse enterado 4 horas antes de un cambio de 0,01% en el SoH.

### El argumento técnico que cierra la discusión

El cálculo central de este proyecto —capacidad real ≈ energía entregada ÷ ΔSOC— **requiere una sesión de carga completa**. No es un flujo continuo: es un evento discreto que ocurre **una vez al día por bus**, cuando la carga termina.

- Eventos de cálculo de SoH: **42 por día** (uno por bus).
- Volumen de telemetría, a 1 registro cada 10 s: ~4,2 eventos/segundo en toda la flota; ~8 millones de filas al mes; ~1,6 GB/mes.

Kafka está diseñado para millones de eventos por segundo. **Esta flota usaría el 0,0001% de su capacidad.** Flink hace ventanas de segundos o minutos; acá la ventana relevante es de semanas. Postgres particionado absorbe este volumen sin despeinarse durante años.

Nada de esto significa que Kafka sea malo: significa que **el volumen no lo justifica**. Si algún día se justifica, será por otras razones (múltiples consumidores, desacoplamiento, replay), no por escala.

---

## 2. La premisa a corregir: no hay un "data lake de ellos"

La pregunta "¿cómo recibo su data lake?" parte de un supuesto que casi con certeza es falso. Un operador de 42 buses no tiene un lago de datos: tiene **dashboards de proveedores SaaS** que guardan los datos en la nube del proveedor. No hay un lago que consumir.

**La dirección del flujo es la inversa:** el lago lo construimos nosotros, con lo que ellos autoricen copiar. Y Kafka lo instala quien *produce* los eventos, no quien los consume — no se puede "recibir Kafka" de alguien que no lo tiene.

### Los cinco mecanismos reales de acceso, de menor a mayor fricción

| # | Mecanismo | Latencia | Qué exige de ellos | Cuándo |
|---|---|---|---|---|
| 1 | **Exportación manual** (CSV/Excel) | Días | Un correo con un archivo adjunto | **Fase 0 — ahora** |
| 2 | **API pull** (nosotros consultamos cada N minutos) | 1–5 min | Credenciales de solo lectura del proveedor | Fase 1 |
| 3 | **Webhook push** (el proveedor nos avisa) | Segundos | Que el proveedor lo soporte + endpoint nuestro | Fase 1–2 |
| 4 | **Streaming real** (Kafka, MQTT) | Milisegundos | Que el proveedor publique eventos (improbable) | Solo si existe |
| 5 | **Gateway propio en el terminal** | Milisegundos | Hardware y permisos en su infraestructura | Fase 3, si se justifica |

**El punto clave para la reunión:** el mecanismo lo decide el dueño del dato y su contrato con el proveedor, no nosotros. Por eso hay que *preguntar*, no llegar con una arquitectura cerrada.

### La carta alternativa: llevar el software al dato

Si la respuesta es "no podemos sacar datos de nuestros sistemas", existe la jugada inversa: **desplegar el análisis dentro de su infraestructura** (o de una nube que ellos controlen), y que nosotros solo veamos resultados agregados. Resuelve gobernanza, soberanía y desconfianza de una vez. Vale tenerla en el bolsillo por si aparece resistencia.

---

## 3. Arquitectura en tres horizontes

La clave es que cada horizonte **no sea una reescritura del anterior**. Eso se logra con una decisión que ya está tomada en este proyecto: el **esquema canónico + adaptadores por fuente** (`lib/types.ts` → `DataSource` → adaptadores). El resto de la arquitectura puede cambiar debajo sin tocar la aplicación.

### Horizonte 1 — Validar (hoy, semanas 1–6)

```
CSV/Excel → importador (adaptador) → Postgres
                                       ├── ingesta_cruda (bronce)
                                       ├── telemetria · sesiones_carga (plata)
                                       └── snapshots_soh (oro)
                                             ↓
                                       informe + app en modo live
```

- **Stack:** Postgres (Supabase) + jobs programados. Nada más.
- **Costo:** USD 0–25/mes.
- **Nota:** esto *ya es* un lakehouse en versión pequeña — la arquitectura medallón (bronce/plata/oro) está implementada, solo que sobre Postgres en vez de Databricks. El patrón es el mismo; el fierro es proporcional al problema.

### Horizonte 2 — Operar (si el piloto avanza, meses 2–6)

```
API/webhook del proveedor → ingesta (Vercel Cron / endpoint) → Postgres
                                                                  ├── camino caliente: reglas de alerta (segundos)
                                                                  └── camino frío: motor de degradación (nocturno)
```

- Aparece la **separación de caminos**: alertas de operación evaluadas al ingerir; degradación calculada por lote.
- Esto ya entrega "tiempo real" donde el tiempo real *importa*, sin Kafka.
- **Costo:** USD 25–100/mes.

### Horizonte 3 — Escalar (solo con un disparador real)

```
Fuentes múltiples → Kafka (bus de eventos) → Flink (procesamiento continuo)
                                               ├── alertas y control de carga
                                               └── lakehouse (Iceberg/Delta) → ML + BI
```

**Disparadores que justificarían llegar acá** (si ninguno se cumple, no se hace):

- Más de ~500 vehículos o varias flotas simultáneas.
- Tres o más consumidores distintos del mismo flujo (app, BI, control de carga, terceros).
- Requisito de negocio con latencia sub-segundo (por ejemplo, modulación de carga en respuesta a la red eléctrica).
- Necesidad de *replay*: reprocesar meses de eventos con un modelo nuevo (aunque esto ya se resuelve con `ingesta_cruda`).

---

## 4. Dónde entra la IA (y dónde no)

Acá hay que ser preciso, porque mezclar los conceptos es el error más común y el más fácil de detectar por alguien técnico.

### El cálculo de degradación NO lo hace un modelo de lenguaje

La estimación de capacidad y la proyección de vida útil son **física y estadística**: conteo de energía, regresión sobre ventanas largas, corrección por temperatura, modelo semi-empírico de envejecimiento. Un LLM no puede hacer eso de forma confiable ni auditable.

> **Regla de oro:** el número lo produce un modelo determinista y versionado (`corridas_modelo`); el LLM lo *explica*. Nunca al revés. Si el número no se puede reproducir y auditar, no sirve para decidir el reemplazo de un activo de decenas de millones de pesos.

### Dónde el LLM sí aporta valor real

| Uso | Técnica | Por qué acá sí |
|---|---|---|
| **Preguntas en lenguaje natural** ("¿qué bus se degradó más este mes?") | **NL→SQL** sobre el warehouse, con esquema y vistas restringidas | Democratiza el dato sin que Alejandro escriba SQL. Ejecutar siempre con usuario de solo lectura y validación de la consulta generada |
| **Explicación de resultados** | Prompt con los números ya calculados | Convierte una curva en una recomendación redactada en el idioma de la operación |
| **Consulta de documentación técnica** | **RAG** sobre manuales, condiciones de garantía, protocolos, historial de mantenciones | Este sí es texto no estructurado: el caso legítimo de RAG |
| **Detección de anomalías** | ML clásico (no LLM): isolation forest, detección de outliers sobre series | Más barato, más rápido y explicable |

**Precisión conceptual importante:** RAG es para *texto no estructurado*. Para datos numéricos tabulares no se usa RAG — se usa NL→SQL. Confundirlos es la señal típica de que alguien repite conceptos sin haberlos aplicado; distinguirlos es señal de lo contrario.

---

## 5. Los cuatro pilares, aplicados a este caso concreto

El objetivo es aplicarlos **de verdad y en proporción**, no como teatro de cumplimiento.

### 5.1 Gobernanza del dato

| Práctica | Cómo se implementa acá desde el día 1 |
|---|---|
| **Catálogo y diccionario** | Un documento con cada campo, su fuente, unidad y significado. Con 20 campos basta un archivo versionado |
| **Linaje** | `ingesta_cruda` guarda el payload original con `fuente`, `archivo_origen` y `recibido_en`: de cada número se puede rastrear la fila exacta de la que salió |
| **Calidad** | Validaciones a la entrada: rangos plausibles (SOC 0–100), saltos imposibles, duplicados, huecos temporales. Un reporte de calidad por carga |
| **Accesos y mínimo privilegio** | Credenciales de solo lectura hacia los proveedores; RLS por flota; roles operador/mecánico/analista |
| **Responsable del dato** | Un *Chief Data Officer* en un piloto de una persona no aplica; lo que sí aplica es dejar por escrito quién responde por los datos: el operador es dueño, nosotros somos procesadores |
| **Retención** | Definir desde el inicio cuánto se guarda y cuándo se borra |

### 5.2 Data Mesh — el pilar que hay que aplicar con criterio

**Honestidad primero:** Data Mesh resuelve el cuello de botella de un equipo central de datos en organizaciones grandes con muchos dominios. Implementarlo con una persona y una flota sería *cargo cult* — copiar la forma sin la necesidad.

**Lo que sí se toma prestado, y es útil de inmediato:**

- **Dominios con dueño claro:** telemetría (proveedor + operaciones), carga (electroterminal), taller (mantención). Cada uno tiene un responsable distinto dentro de Eserco, y eso **define a quién preguntarle qué** — sirve literalmente para ordenar la reunión.
- **Datos como producto:** lo que entregamos (SoH estimado, proyección de reemplazo) se publica con contrato explícito: qué significa, cómo se calculó, con qué versión del modelo, con qué frescura.
- **Gobernanza federada:** reglas comunes (formatos, identificadores, privacidad) aunque cada fuente sea de un dueño distinto. La metáfora de los food trucks es exacta: distintas cocinas, mismas normas sanitarias.

Si el proyecto crece a varias flotas y varios consumidores, ahí Data Mesh deja de ser vocabulario y pasa a ser arquitectura.

### 5.3 Privacidad desde el diseño

Este pilar **sí se aplica al 100% desde el primer minuto**, y en este proyecto ya empezó:

- **Minimización:** el documento de datos requeridos no pide nombres de conductores. Lo que no se pide no se protege ni se filtra.
- **Seudonimización en la ingesta, no después:** si un archivo trae nombres, se sustituyen por códigos en el momento de cargarlo; la tabla de correspondencia vive aparte y con acceso restringido.
- **Agregación:** los indicadores de conducción se informan por flota o por código, nunca ranking nominal — el punto sensible en un contexto gremial.
- **Ley 21.719:** el operador es el responsable del tratamiento y nosotros el encargado; conviene dejarlo por escrito junto con la finalidad, el plazo y la eliminación al término del piloto.
- Aprendizaje federado y privacidad diferencial son herramientas reales, pero para este volumen y este alcance son desproporcionadas. Se mencionan como camino si el proyecto llega a cruzar datos de varios operadores que compiten entre sí — ahí sí se vuelven la solución elegante.

### 5.4 Seguridad

"Multinube" describe a corporaciones que ya viven en tres nubes; acá el equivalente honesto es **higiene de seguridad bien hecha**:

- **Identidad y Zero Trust:** MFA, sin credenciales compartidas, cada acceso verificado y con expiración; nada de "red interna confiable".
- **Secretos:** variables de entorno del servidor, nunca en el repositorio ni en el cliente. Rotación al terminar el piloto.
- **Cifrado:** TLS en tránsito y cifrado en reposo (viene por defecto en Supabase/Postgres gestionado).
- **Configuración:** la mayoría de las brechas son descuidos —un bucket público, un backup expuesto—. Revisar que ningún almacenamiento sea público y que los backups estén cifrados.
- **Soberanía del dato:** *dónde* viven físicamente los datos es una pregunta legítima que van a hacer. Conviene llegar con la respuesta: región elegida y declarada (por ejemplo São Paulo para Sudamérica), y la opción de desplegar dentro de su propia infraestructura si lo prefieren.
- **Visibilidad:** logs de acceso y auditoría de consultas. Un SIEM completo es desproporcionado; registrar quién consultó qué, no.

---

## 6. Cómo presentarlo en la reunión

### El riesgo de llegar con Kafka en la primera lámina

Alejandro es jefe de asistencia técnica de una flota, no CTO de un banco. Si la propuesta abre con Kafka, Flink, Data Mesh y multinube, los tres riesgos son inmediatos:

1. **Suena caro** → "esto necesita presupuesto que no tengo".
2. **Suena lento** → "esto es un proyecto de dos años, no un piloto".
3. **Suena invasivo** → "quiere conectarse a todos mis sistemas".

Cualquiera de los tres mata una conversación que hoy está abierta y que costó meses conseguir.

### La jugada correcta: mostrar criterio, no catálogo

> Saber qué es Kafka es conocimiento. **Saber cuándo no usarlo es criterio** — y el criterio es lo que distingue a un ingeniero de alguien que repite tendencias.

La estructura recomendada para ese momento de la reunión:

1. **Partir por la decisión, no por la tecnología.** "¿Qué decisiones quieren tomar con estos datos y con qué urgencia?" Las respuestas se ordenan solas en los dos relojes.
2. **Nombrar los dos relojes explícitamente.** Deja en evidencia que se entiende el fenómeno físico, no solo la herramienta. Es el momento más fuerte de la presentación.
3. **Proponer el horizonte 1 como el paso que se ejecuta ahora**, con su costo real (prácticamente cero) y su plazo (semanas).
4. **Mostrar los horizontes 2 y 3 como mapa**, no como pedido: "si el piloto demuestra valor, así crece — y así de fácil crece, porque la arquitectura ya está preparada para eso".
5. **Cerrar con gobernanza**, que es lo que le da tranquilidad a quien entrega datos: minimización, seudonimización, solo lectura, soberanía, y la opción de que el software vaya al dato.

### La frase que resume la postura

> "La arquitectura de streaming está diseñada desde el día uno, pero no se enciende hasta que exista una decisión que la necesite. Empezar simple no es empezar mal: es dejar que el problema, y no la moda, dicte la complejidad."

---

## 7. Preguntas de arquitectura para Alejandro

Se suman a las de datos que ya están en `docs/preguntas-alejandro-vasquez.md`:

1. ¿Sus proveedores ofrecen API de consulta, webhooks o solo exportaciones? ¿Sabe si el contrato incluye acceso a los datos crudos o solo a los dashboards?
2. ¿Los datos de la flota son de Eserco o quedan en poder del proveedor? (Determina quién puede autorizar qué.)
3. ¿Hay algún requisito interno o del MTT sobre dónde deben residir estos datos?
4. ¿Existe algún proceso que hoy necesite reacción inmediata —temperatura de celda, corte de carga, falla en ruta— o todo se revisa con calma al día siguiente? (Esta respuesta define si el reloj rápido tiene valor real o es una suposición nuestra.)
5. Si más adelante hubiera que integrar sistemas en vivo, ¿con quién habría que hablar del lado técnico?

---

## 8. Resumen de recomendaciones

| Tema | Recomendación |
|---|---|
| **Kafka + Flink ahora** | No. El volumen es 0,0001% de su capacidad y el cálculo central se dispara una vez al día por bus |
| **Streaming como concepto** | Sí, pero aplicado al reloj rápido (alertas de operación), y recién en el horizonte 2 con webhooks o polling frecuente |
| **Lakehouse** | Ya está, en versión proporcional: bronce/plata/oro sobre Postgres. Migrar a Iceberg/Delta solo si el volumen lo pide |
| **IA generativa** | Sí para consulta en lenguaje natural (NL→SQL), explicación de resultados y RAG sobre documentación. **Nunca** para producir el número de degradación |
| **Gobernanza** | Sí, completa y desde el día 1 — es barata cuando se diseña temprano y carísima cuando se parcha |
| **Data Mesh** | Como vocabulario para ordenar dueños y contratos, sí. Como arquitectura, no todavía |
| **Privacidad desde el diseño** | Ya implementada en el pedido de datos; formalizar en el acuerdo con Eserco |
| **En la reunión** | Liderar con las decisiones y los dos relojes; el streaming como destino, no como requisito de entrada |
