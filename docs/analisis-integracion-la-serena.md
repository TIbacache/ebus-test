# Análisis de integración — E-Bus Control × flota eléctrica La Serena–Coquimbo

> Investigación y diseño (julio 2026) para conectar el prototipo a las micros reales, los talleres y las bahías de carga de La Serena–Coquimbo. Complementa `resumen-ejecutivo-ebus-control.md` (documento para reenviar) y `pitch-3min-ebus.md` (guion del video).
>
> **Origen:** respuesta del encargado de las micros eléctricas — "miden el SOH (Tracktec, Copec a través de Dhemax), pero solo como dato; ninguno alcanza cálculos exactos del impacto de las cargas o la degradación por operación" — y su oferta de hacer pruebas con los buses de La Serena, sujeta a Alejandro Vásquez (jefe de A.T.).

---

## 1. El ecosistema real (verificado)

| Pieza | Realidad |
|---|---|
| **Flota** | 42 buses **Foton U9**: motor 245 kW, batería **CATL LFP de 229 kWh**, ~280 km de autonomía. Servicios **E-01** (El Sauce–El Romero) y **E-02** (La Pampilla–Av. Viña del Mar, extendido a El Sauce en abril 2025). ~26 km por trayecto, ~8.000 pasajeros/día, 326 salidas en día laboral. Operando desde el **29 de noviembre de 2024** |
| **Operador** | **Eserco** (Empresa de Electromovilidad La Serena Coquimbo), creada por **Liserco** (asociación gremial de dueños de microbuses). 25 conductoras mujeres en la operación |
| **Bahías de carga** | Electroterminal **El Sauce** (Coquimbo): 11 cargadores duales que cargan hasta **22 buses en paralelo**, potencia mínima 1,35 MW. **Propiedad y operación de Liserco/Eserco** (inversión propia ~US$2M en terrenos de Liserco, 25 personas); la **infraestructura eléctrica la construyó Enel** ("con ellos firmé" — presidente de Liserco en prensa) y el empalme lo autorizó **CGE**. **Quién gestiona la carga (CMS) está por confirmar**: el encargado menciona "Copec a través de Dhemax", consistente con un rol de software/medición, no de propiedad |
| **Telemetría del bus** | **Tracktec** (Suite con módulos de monitoreo de flota, telemetría mecánica, gestión de fallas y transporte público; +350 eBuses servidos en Chile). Integración vía web services — las specs no son públicas, se solicitan por su mesa de soporte |
| **Gestión de carga** | **Dhemax** (socio tecnológico de Copec Voltex): CMS bajo **OCPP 1.6**, gestiona +1.200 eBuses/día y 60.000 cargas/mes en Latam y Europa. Ya se integran con terceros (ej. Optibus para planes de carga) — abrir datos a integradores es parte de su modelo. **Ojo:** su rol específico en El Sauce no está confirmado por prensa, solo por la mención del encargado (preguntas 6–7) |
| **El fabricante** | Los buses chinos nacen con T-Box bajo la norma **GB/T 32960** (reporta cada pocos segundos: SOC, tensión/corriente total, tensiones máx/mín de celda con su posición, temperaturas por sonda, alarmas). En unidades exportadas ese flujo suele apuntar al fabricante/distribuidor (**Andes Motor**) o estar inactivo — fuente potencial que nadie está usando; hay que preguntar |
| **Contexto de crecimiento** | Licitaciones 2025–2026: ~895 buses eléctricos regionales nuevos, con 14 electroterminales adjudicados a Copec Voltex (~70% de los puntos nuevos). El diseño multi-flota no es teórico: el mercado regional se está multiplicando ahora |

### La lectura competitiva

Tracktec mantiene desde 2023 un **estudio de degradación de baterías con DICTUC (UC)**, midiendo SOC/SOH para "anticipar degradación anormal" y programar reemplazos. Que en 2026 el encargado diga que el SOH llega "solo como dato" confirma dos cosas: **el problema es difícil, y sigue abierto**.

La ventaja de E-Bus Control **no** es tener el dato (nunca lo tendremos mejor que Tracktec):

1. **El cruce ruta × enchufe.** Tracktec ve la operación (no ve el detalle de la carga); el CMS del terminal —Dhemax, según la operación— ve la carga (no ve la ruta). Cada uno tiene la mitad de la vida de la batería. El cálculo que falta —cuánto degrada cada sesión de carga y cada jornada de operación— sale de cruzar ambos, y ninguno puede hacerlo solo.
2. **La capa de acción.** Alertas → mecánico con ETA, eco-feedback al conductor, ventana óptima de carga: interfaces por rol que ninguno de los dos ofrece.
3. **Foco local.** Un equipo en La Serena iterando con la flota de La Serena.

**Riesgo honesto:** cualquiera de los dos podría construir el cruce. Por eso el piloto local rápido vale más que la perfección técnica.

---

## 2. Análisis crítico del sistema actual (7 hallazgos)

Auditoría del prototipo (spec `prompt-maestro-ebus-v2.md` + código) contra el ecosistema real:

### H1 — SOC y SoH están fundidos en un solo campo (el hallazgo más importante)
`Unidad.bateria: 15%` dispara `estado: critical` y todo el relato de salud. Pero son cosas distintas: un U9 con **15% de carga (SOC)** al final del día es una micro normal llegando a El Sauce; un U9 con **85% de salud (SoH)** al año de uso es una emergencia silenciosa. El semáforo actual es de SOC (operación del día); la tesis del proyecto es de SoH (degradación). El modelo de datos real necesita **ambos campos** y el dashboard necesita **las dos vistas** (operación / salud).

### H2 — La entidad "sesión de carga" no existe
Ni en `lib/data.ts` ni en ninguna de las 9 pantallas (al momento del diagnóstico). El pitch dice "la degradación se decide en el enchufe" y el encargado pidió exactamente "impacto de las cargas energéticas"… y la app no tiene dónde mostrar una carga. Falta la tabla y falta la pantalla: sesiones de El Sauce con kWh, SOC inicial→final, potencia, temperatura y **costo de degradación estimado por sesión**. Es la pantalla que se le vende a Alejandro.

> **Resuelto (jul 2026):** pantalla **Cargas** construida en modo demo — sesiones con SOC/kWh/potencia/temperatura/ventana óptima y **estrés de carga por sesión (modelo v0, proxy del costo de degradación)**, etiquetada "datos simulados". La entidad `SesionCarga` ya existe en el contrato (`lib/types.ts` + `DataSource`); queda el punto de aterrizaje listo para los datos reales de Dhemax en Fase 1.

### H3 — El nivel de celda prometido excede el dato disponible
"Celda 7 — Módulo B" es granularidad de diagnóstico OEM en taller. Lo que fluye por telemetría estándar es **tensión máxima y mínima de celda con su posición** y temperaturas por sonda. Alcanza para detectar desbalance (lo que importa), no para un mapa completo del pack. Ajustar la promesa.

### H4 — La curva de degradación del demo es físicamente imposible
MIC-104 cae 70%→41% de SoH en 30 días; una LFP real pierde ~2–4% **al año**. Como dramatización de pitch funciona, pero la consecuencia de diseño es seria: con curvas reales casi planas, el SoH que reporta el BMS es **ruidoso y escalonado** (peor en LFP: curva de voltaje plana → las estimaciones derivan). El motor no puede "leer" SoH — debe **estimarlo** (ver §4, motor de análisis). Ese estimador propio es el producto.

### H5 — "Modificación de rutas en tiempo real" choca con la regulación
E-01/E-02 son recorridos licitados fijos supervisados por el MTT. Reencuadrar el atributo 3 de la metáfora como **recomendación operacional**: qué unidad sale, cuál entra a cargar, cuál va a taller — que es lo que un jefe de flota sí puede accionar.

### H6 — Identidad y escala de demo
120 micros "MIC-1xx" con conductores ficticios vs **42 U9 con patentes reales y 25 conductoras de un gremio**. El backend debe ser agnóstico al tamaño (KPIs siempre derivados, nunca hardcodeados) y el **modo demo se conserva** tal cual (pitches, demos offline, fixtures). Además: el Eco-Score con nombre y apellido es **dato personal** (Ley 21.719) en contexto gremial → en el piloto va anonimizado o agregado por flota, propuesto de entrada.

### H7 — Infraestructura pendiente conocida
Auth real por roles, mapa real (el GPS de Tracktec se pinta con MapLibre/OSM, gratis), multi-tenant. La buena noticia: los ~19 componentes consumen todo desde `lib/data.ts`, así que el contrato TypeScript ya existe y el swap a API es limpio (ver paso 0 en §5).

---

## 3. Mapa de conexión (las 3 superficies)

```
LA MICRO (42× Foton U9)                LA BAHÍA (El Sauce — Eserco; obra Enel)
  │ CAN + GPS (hardware Tracktec)        │ OCPP 1.6
  ▼                                      ▼
TRACKTEC Suite                         CMS DEL TERMINAL (¿Dhemax?)
SOC, SoH BMS, km, eventos de           sesiones: kWh, curva de potencia,
conducción, códigos de falla           SOC inicio/fin, horarios
  │ web services / exports               │ API / exports (por confirmar)
  └────────────────┬────────────────────┘
                   ▼
     BACKEND E-BUS CONTROL (adaptadores → crudo → canónico)
     motor propio: SoH estimado + costo de degradación por sesión
                   ▼
     app Next.js actual (modo demo | modo live)
                   ▲
EL TALLER (Eserco) ┘ ← aquí NO hay integración: hoy probablemente es
                       planilla/WhatsApp. El módulo mecánico de la app
                       ES el sistema → órdenes de trabajo, causas y
                       tiempos se vuelven data propia que nadie más tiene
```

**Reglas del piloto:**
- **Cero hardware propio en los buses** (garantía CATL/Foton, contrato con el MTT, y no hace falta: el dato ya fluye).
- No conectarse "al bus": conectarse a los sistemas que ya lo escuchan.
- La cuarta fuente (T-Box de fábrica vía Andes Motor) se explora en Fase 2 solo si falta granularidad.

---

## 4. Diseño del backend

### Principios (lo que lo hace escalable y compatible)

1. **Esquema canónico + adaptadores.** El backend define UN formato interno (evolución de los tipos de `lib/types.ts`). Cada fuente externa se traduce en un adaptador aislado: `TracktecAdapter`, `DhemaxAdapter`, `CsvAdapter` (Fase 0), `FotonAdapter` (futuro). Sumar la flota N+1 con otro proveedor = escribir un archivo, no tocar el núcleo.
2. **Crudo primero.** Todo payload se guarda íntegro en `ingesta_cruda` (JSONB) antes de normalizar. Los modelos de degradación van a iterar; hay que poder recorrer el histórico completo con el modelo v2, v3, v7. La data cruda es el activo; los modelos son versionables.
3. **La sesión de carga como entidad estrella.** El cruce `sesiones_carga` × `telemetria` ES el cálculo que el encargado dice que no existe.
4. **Multi-tenant desde el día 1.** Todo cuelga de `flota_id`/`operador_id` (con RLS). Probar con La Serena se convierte rápido en mostrar a otra flota.

### Modelo de datos mínimo

```
flotas · unidades (patente, modelo, capacidad_kwh_nominal)
conductores (con alias anonimizable — Ley 21.719)
ingesta_cruda   (fuente, recibido_en, payload JSONB)
telemetria      (unidad_id, ts, soc, soh_bms, voltaje, temp_celda_max/min,
                 v_celda_max/min, gps, km, fuente)      ← particionada por mes
sesiones_carga  (unidad_id, cargador_id, inicio, fin, kwh, soc_ini, soc_fin,
                 potencia_max, temp_inicio, fuente)
snapshots_soh   (unidad_id, fecha, soh_estimado, version_modelo)
eventos_alerta  (unidad_id, tipo, severidad, ts, estado)
ordenes_trabajo (unidad_id, falla, causa, mecanico, inicio, fin)  ← del taller
corridas_modelo (version, ejecutada_en, parametros)     ← trazabilidad
```

Volumen de calibración: 42 micros × 1 frame/30 s ≈ **120 mil filas/día** (~3,6 M/mes). Postgres particionado lo maneja sin drama; "escalable" significa fronteras bien puestas (adaptadores, crudo, canónico), no Kafka el día 1.

### El motor de análisis (el diferenciador)

El SoH del BMS no se lee, se **estima**:

- **Punto de calibración:** cargas completas nocturnas con balanceo (energía entregada entre dos SOC confiables → capacidad real del pack). Conteo de energía/coulombs por sesión.
- **Suavizado:** regresión por ventanas largas (semanas/meses) con corrección por temperatura; el SoH BMS queda como señal secundaria.
- **Costo de degradación por sesión/jornada:** modelo semi-empírico LFP (C-rate, temperatura, SOC medio de reposo, profundidad de descarga), **versionado** en `corridas_modelo` para recalcular todo el histórico con cada mejora.
- **Salidas:** `snapshots_soh`, proyección de vida útil (fecha estimada de EOL 80%/70%), ranking de prácticas que degradan (ej. carga rápida en día caluroso — el caso que el propio estudio Tracktec–DICTUC menciona).

### Stack concreto

- **Supabase**: Postgres + RLS (multi-tenant), Auth por roles (operador/mecánico/conductor/admin — calzan con `usuariosSistema`), Realtime para alertas en vivo. Plan gratis alcanza para el piloto.
- **Ingesta**: route handlers `app/api/ingesta/[fuente]/` en el mismo repo, gatillados por **Vercel Cron** cada 1–5 min (polling a Tracktec/Dhemax). Bearer token; credenciales solo en env del servidor. Idempotente: upsert por `fuente + id_externo + ts`.
- **Jobs de análisis**: nocturnos (Vercel Cron o `pg_cron`). Si los modelos migran a Python, un worker chico lee el mismo Postgres.
- **Graduación**: solo si aparece hardware propio con MQTT de alta frecuencia se agrega worker dedicado + cola (Fly.io/Railway). El diseño lo permite como agregado, no como reescritura.
- Todo en el flujo actual: GitHub → PR → Preview → merge a `main`.

### Cómo se enchufa el frontend (paso 0 — ya ejecutable)

1. Tipos canónicos a `lib/types.ts`, separando **SOC** (`bateria`) de **SoH** (`soh`) — hallazgo H1.
2. Capa repositorio `lib/api.ts`: `getFleetSummary()`, `getUnidades()`, `getUnidad(id)`, `getAlertasActivas()`… detrás de un flag `NEXT_PUBLIC_DATA_SOURCE = demo | live`. Hoy devuelve el mock; en Fase 1 consulta Supabase.
3. Las pantallas consumen las mismas formas — el modo demo no se bota nunca.

---

## 5. Plan por fases

### Fase 0 — El informe que abre puertas (2–4 semanas, sin integración)
Con el visto bueno de Alejandro: **exports históricos** de Tracktec (SOC/SoH/km/eventos por bus) y Dhemax (sesiones de carga) para 5–10 micros. Hay ~20 meses de operación acumulada. Se construye: importador CSV (primer adaptador) + esquema canónico + estimador SoH v1 + **informe "Primera curva real de degradación de la flota E-01/E-02 y costo de degradación por sesión de carga"**. Ese papel convierte "un par de pruebas" en piloto formal. Cero riesgo y cero costo para Eserco; el informe queda para ellos.

### Fase 1 — Piloto vivo (1–2 meses después)
Credenciales read-only (web services Tracktec + API/export del CMS del terminal, sea Dhemax u otro), polling con Vercel Cron, app en modo `live` con las 42 unidades, alertas reales, mapa real, pantalla nueva de **Cargas**, auth por roles para el jefe de flota y la A.T.

### Fase 2 — Profundidad (según resultados)
Eco-feedback al conductor en cabina (los eventos ya vienen de Tracktec), módulo taller en uso real (órdenes de trabajo = data propia), modelo v2 con más historia, y recién ahí evaluar el T-Box Foton vía Andes Motor.

---

## 6. Preguntas para Alejandro Vásquez

> **Versión lista para enviar** (sin notas internas de estrategia): `docs/preguntas-alejandro-vasquez.md`. Esta versión es la interna, con el porqué de cada pregunta.

**Gobernanza (define todo lo demás):**
1. ¿Quién es la contraparte dueña de los datos: Eserco, Liserco, o pasan por la DTPR/MTT? ¿Qué rol juega la Asistencia Técnica en ese acceso? ¿Necesitamos NDA o convenio (p. ej. vía INACAP)?
2. ¿Cuántas micros y cuánta historia podríamos usar para la prueba? ¿Desde noviembre 2024?

**Tracktec (el lado del vehículo):**
3. ¿Qué módulos de la Suite contrató Eserco y qué variables entregan por bus: SOC, SoH, tensiones máx/mín de celda, temperaturas, códigos de falla, eventos de conducción (aceleración/frenado)? ¿Cada cuántos segundos?
4. ¿Tienen habilitados los web services de la Suite o solo dashboard/exports? ¿Quién administra las credenciales?
5. ¿La flota participa del estudio de degradación Tracktec–DICTUC? ¿Les han entregado resultados?

**La carga en El Sauce (el lado del enchufe):**
6. ¿Quién gestiona hoy la carga del terminal y con qué plataforma: ¿Dhemax/Copec (como menciona el encargado), Enel X (que construyó la infraestructura eléctrica), o software del fabricante de los cargadores? ¿Qué entrega por sesión: kWh, curva de potencia, SOC inicial/final, duración, horario? ¿Se registra también la **temperatura del pack** al conectar (o esa solo la ve Tracktec)? ¿Por API o reporte?
7. ¿Cómo se identifica **qué bus cargó en cada sesión** (RFID/idTag, bahía asignada por unidad, registro manual)? — Es la **llave del cruce** carga ↔ telemetría: sin identificación bus↔sesión confiable, el análisis del impacto de las cargas pierde su fundamento. Pregunta crítica.
8. ¿Cómo se programa hoy la carga (ventanas nocturnas, Smart Charging activo, carga de oportunidad diurna)? ¿Quién decide qué bus carga cuándo?

**Foton / Andes Motor / CATL:**
9. ¿Condiciones de la garantía de batería (años/km y ventanas de operación de carga)? — el monitoreo sirve también para *demostrar compliance* de garantía, argumento directo para Eserco.
10. ¿Andes Motor ofrece plataforma de monitoreo del fabricante o informes de SoH de posventa? ¿El T-Box GB/T 32960 está activo y reportando a alguien?

**Taller y operación:**
11. ¿Cómo registran hoy las mantenciones y fallas: sistema, planilla, WhatsApp? ¿Cuántos mecánicos y qué protocolo ante falla en ruta?
12. ¿Qué pregunta les gustaría responder primero con datos? (ej.: ¿cuánto degrada una carga rápida en día caluroso vs nocturna?) ¿Qué KPI le importa al directorio: costo/km, disponibilidad, fecha de reemplazo de packs?

**Datos personales:**
13. Proponer de entrada: Eco-Score anonimizado/agregado en el piloto (Ley 21.719 + contexto gremial). ¿Hay que conversarlo con el sindicato/asociación?

---

## 7. Riesgos y resguardos

| Riesgo | Resguardo |
|---|---|
| Tracktec, Dhemax o Enel X construyen el cruce antes | Velocidad del piloto local; posicionarse como capa neutral que los complementa (a todos les sirve un cliente más contento) |
| Acceso a datos se traba en burocracia | Fase 0 pide solo exports históricos (esfuerzo mínimo para Eserco); convenio académico INACAP como paraguas |
| Datos de conductores (gremio, Ley 21.719) | Anonimización/agregación propuesta de entrada, no cuando la objeten |
| SoH BMS ruidoso invalida conclusiones | Estimador propio calibrado en cargas completas; ventanas largas; versionado de modelos |
| Garantía CATL/Foton restringe experimentos de carga | El piloto es observacional (no cambia la operación); el monitoreo además ayuda a demostrar compliance de garantía |
| Dependencia de proveedores externos | Crudo-primero: todo lo ingerido queda en `ingesta_cruda` y es re-procesable aunque cambie el proveedor |

---

## Fuentes

- [Foton/Andes Motor — inicio de operación de los 42 buses](https://foton.cl/w/foton-y-eserco-inician-operacion-de-42-buses-electricos-en-coquimbo-y-la-serena)
- [Revista Electricidad — especificaciones U9/CATL 229 kWh](https://www.revistaei.cl/inician-la-operacion-de-42-buses-electricos-en-coquimbo-y-la-serena/)
- [Wikipedia — Red Coquimbo-La Serena de Movilidad](https://es.wikipedia.org/wiki/Red_Coquimbo-La_Serena_de_Movilidad)
- [DPR Coquimbo — terminal El Sauce, 22 máquinas en paralelo](https://dprcoquimbo.dpr.gob.cl/2024/06/06/terminal-de-buses-electricos-en-coquimbo-podra-cargar-hasta-22-maquinas-de-forma-paralela/)
- [DPR Coquimbo — inicio de operación de los 42 buses](https://dprcoquimbo.dpr.gob.cl/2024/11/29/inicia-operacion-de-42-buses-electricos-para-conurbacion-coquimbo-la-serena/)
- [Mobility Portal — estudio de degradación Tracktec–DICTUC](https://mobilityportal.lat/tracktec-estudio-baterias-bus/)
- [Tracktec — Suite y módulos](https://tracktec.cl/plataforma-tracktec)
- [Dhemax — plataforma de gestión de carga OCPP](https://www.dhemax.com/plataforma-de-gestion-de-carga-para-redes-de-cargadores/)
- [Dhemax — 1.200 eBuses y 60.000 cargas/mes](https://mobilityportal.es/dhemax-ebuses-soluciones-tecnologicas/)
- [Optibus × Dhemax — integración con terceros](https://blog.optibus.com/es-es/nuevo-en-optibus-integracion-con-dhemax-smart-charging-para-mejorar-los-planes-de-carga-de-vehiculos-electricos)
- [Mobility Portal — licitaciones 2025–2026](https://mobilityportal.lat/chile-buses-electricos-2025-2026/)
- [Semanario Tiempo — Liserco firma con Enel la construcción de la infraestructura eléctrica](https://www.semanariotiempo.cl/liserco-adelanta-conversaciones-con-enel-kaufmann-y-andes-motor-para-implementar-buses-electricos-entre-la-serena-y-coquimbo/)
- [Semanario Tiempo — Liserco invierte ~US$2M en el centro de carga de El Sauce (11 cargadores, 25 personas)](https://www.semanariotiempo.cl/liserco-destinara-us2-millones-para-centro-de-carga-de-buses-electricos/)
