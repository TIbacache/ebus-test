# E-Bus Control
### El monitor cardíaco de la flota eléctrica

**Prototipo funcional navegable — INACAP La Serena**

---

## En 20 segundos

|  |  |
|---|---|
| **Qué es** | Plataforma de monitoreo en tiempo real de la salud de las baterías de micros eléctricas. |
| **Qué resuelve** | El dato de salud de la batería existe. Pero rara vez llega a tiempo, y en forma accionable, a quien puede evitar la falla. |
| **Estado** | Prototipo navegable y desplegado. 10 pantallas operativas. Datos simulados. Sin telemetría real *todavía*. |
| **Qué pido** | Ni plata ni compromiso. Datos históricos de unas pocas unidades, veinte minutos, o un nombre. |

---

## 14:32

Una micro se detiene en Av. Central con San Martín. El conductor no entendió por qué: el tablero marcaba carga suficiente. El diagnóstico llega después, en el taller: **tensión de celda baja, módulo B, celda 7.** La batería venía deteriorándose hacía semanas.

Y acá está lo incómodo: **es muy probable que el dato ya existiera.** En el BMS del vehículo, en los registros del cargador, en alguna planilla. El problema no fue la falta de sensores. Fue que ese dato no llegó **a tiempo, y en un formato accionable, a la persona que podía hacer algo con él.**

Esa distancia es la que E-Bus Control se propone cerrar.

---

## El problema no es falta de datos. Es distancia.

La electromovilidad en Chile resolvió brillantemente el problema de la emisión. Dejó abierto el que viene después: **la batería de tracción representa cerca de un tercio del costo del vehículo, y su vida útil no la define el fabricante — la definen los siguientes cinco años de trato diario.**

Ese trato deja huellas medibles, y prácticamente toda flota eléctrica moderna las registra de alguna forma. Así que la pregunta no es si el dato existe. **Es cuánta distancia recorre ese dato antes de convertirse en una decisión.**

En la flota de La Serena y Coquimbo esto no es teoría: las 42 micros Foton U9 (baterías CATL de 229 kWh) ya reportan telemetría a través de Tracktec, y sus cargas en el electroterminal El Sauce corren sobre infraestructura Copec Voltex con gestión Dhemax. El Estado de Salud (SOH) de cada batería **ya se mide**. Lo que ningún sistema entrega hoy es el cálculo que viene después: cuánto impacta cada carga y cada jornada de operación en la degradación, y cuándo —con precisión— habrá que reemplazar cada pack. Cada sistema ve la mitad de la película: la telemetría ve la ruta pero no el detalle del enchufe; la gestión de carga ve el enchufe pero no la ruta. **E-Bus Control es la capa que cruza ambas mitades.**

- El estilo de conducción estresa térmicamente las celdas. ¿Esa información llega **al conductor**, en cabina, el mismo día en que todavía puede corregirla?
- Los hábitos de carga —estado de carga, temperatura del pack, horario— marcan la curva de envejecimiento. ¿Están **cruzados** con la salud de cada unidad, o viven en sistemas que no se hablan?
- El desbalance de una celda se anuncia como tendencia semanas antes de manifestarse como falla. ¿Alguien está mirando **la curva**, o solo el umbral que la dispara?

Nadie que opere una flota eléctrica hoy está a ciegas. Pero entre el sensor y la acción suele haber tres sistemas, dos planillas y una llamada telefónica. **Ese trayecto es el problema.** Y no se resuelve agregando sensores: se resuelve integrando y traduciendo lo que ya se mide.

> El dato que no llega a tiempo a quien puede accionarlo no es información. Es el registro histórico de una pérdida.

---

## La solución

**E-Bus Control es un monitor cardíaco para la flota.**

La metáfora no es decorativa: es la arquitectura del sistema. Un monitor cardíaco no cura — **vigila el pulso, detecta la arritmia antes del infarto, y avisa a quien puede actuar.**

Cuatro funciones, en ese orden:

1. **Escuchar el pulso.** Telemetría en vivo de cada unidad: voltaje, temperatura de celda, ciclos de carga, estado de salud (SoH) por batería.
2. **Detectar la arritmia.** Umbrales configurables y análisis de degradación. La falla se anuncia como *tendencia* antes de manifestarse como *evento*.
3. **Avisar a quien puede actuar.** Flujo automático: detección → Centro de Control → mecánico asignado, con ubicación exacta y ETA. Sin llamadas, sin adivinanzas.
4. **Corregir la causa.** Eco-Score por conductor y ventana óptima de recarga: cerrar el ciclo sobre las dos variables que **de verdad** determinan la vida útil de una batería.

**Hipótesis de trabajo del equipo:** intervenir sistemáticamente sobre estilo de conducción y hábitos de carga permite extender la vida útil de las baterías en torno a un **25%**. Es una meta, no un resultado medido. Validarla requiere datos reales — y ahí es donde esta conversación se pone interesante.

---

## Por qué esto le importa a quien opera la infraestructura de carga

Aquí está el punto que suele pasarse por alto:

> **La degradación de una batería no se decide en la ruta. Se decide en el enchufe.**

Estado de carga, velocidad de carga, temperatura del pack al momento de conectarse, tiempo de permanencia. Son las variables de mayor impacto sobre la vida útil de una celda — y todas ocurren **en el punto de carga**.

Usted conoce ese punto mejor que nadie, así que la pregunta se la dejo abierta, con genuina curiosidad: **¿cuánto de lo que el cargador sabe sobre el pack vuelve hoy a la operación de la flota — y cuánto de lo que la flota sabe sobre la salud de ese pack llega al cargador?**

En muchas operaciones esos dos mundos conversan poco. No por falta de tecnología ni de gente capaz, sino porque nadie construyó todavía la capa que los traduce. **Ahí es donde este proyecto se para**, y por eso el negocio que habilita es grande:

- **De vender energía a vender vida útil.** Un cargador que conoce el SoH del pack deja de ser un commodity que despacha kWh y pasa a ser un servicio que **preserva el activo más caro de su cliente**. Eso es defendible, es diferenciable, y es difícil de copiar.
- **Carga inteligente con propósito.** El módulo de carga predictiva del prototipo —horarios óptimos por tarifa y temperatura, disponibilidad de puntos, programación multiobjetivo— **no compite con la infraestructura: la alimenta.** Es la capa de inteligencia que le da sentido al fierro.
- **Datos que hoy no existen.** Un piloto en el corredor Coquimbo–La Serena generaría la primera curva real de degradación de flota eléctrica en la región. Esa data no se compra.

---

## Por qué le importa a quien opera las micros

- **Continuidad del servicio.** Una micro detenida en ruta no es una falla técnica: es una frecuencia rota, pasajeros a pie y un equipo entero reaccionando contra el reloj. El mantenimiento predictivo convierte la emergencia en agenda.
- **El activo se protege.** Extender la vida útil de la batería difiere la inversión más pesada del ciclo de vida del vehículo. Cada punto de SoH conservado es capital que no se gasta.
- **La flota se vuelve legible para todos.** Qué unidad se está degradando más rápido, qué conductor agradecería una capacitación, qué ruta castiga las celdas. Lo que hoy suele vivir en la experiencia acumulada de unas pocas personas pasa a ser un tablero compartido.

---

## Qué hace distinto a este proyecto

La apuesta no es reemplazar lo que ya existe, sino **conectarlo y hacerlo accionable.** Tres decisiones:

1. **Cierra el ciclo sobre la causa, no solo sobre el síntoma.** Un buen sistema de monitoreo muestra el problema. E-Bus Control busca además intervenir sobre las dos variables que lo originan: **cómo se maneja y cómo se carga.**
2. **Habla los tres idiomas de la operación.** Operador, mecánico y conductor ven interfaces distintas del mismo sistema — cada uno recibe exactamente lo que puede accionar, y nada más. La información que no se puede accionar es ruido.
3. **Conecta el vehículo con la infraestructura.** Es una capa que le habla al mismo tiempo a la micro y al cargador. Ahí, creemos, es donde vive el 25%.

**Alineación ODS:** **3** (Salud y Bienestar — previene fallas eléctricas con pasajeros a bordo) · **7** (Energía Asequible y No Contaminante — optimiza consumo y momentos de recarga) · **13** (Acción por el Clima — extiende la vida útil y reduce residuo electrónico).

---

## Dónde estamos, con total honestidad

**Lo que existe hoy:** un prototipo navegable y desplegado, con las 10 pantallas del sistema operativas y recorribles — dashboard de flota, mapa, detalle de unidad, **sesiones de carga con estrés de degradación por sesión (modelo v0)**, centro de alertas, panel del mecánico, módulo del conductor, reportes, configuración. Se puede usar. Se entiende en cinco minutos.

**Lo que no existe todavía:** telemetría real. Los datos del prototipo son simulados y sirven para demostrar el concepto, no para describir la flota de La Serena.

**Lo que falta es exactamente una cosa:** acceso a datos reales de una flota y de sus puntos de carga. Y el primer paso no requiere integración alguna ni instalar nada en los buses: con exportaciones históricas de telemetría y de sesiones de carga de un puñado de unidades basta para construir el primer informe de degradación real de la flota — informe que queda para el operador. Ese es el único puente entre un prototipo que se entiende y un sistema que sirve.

---

## Lo que estoy pidiendo

Voy a ser directo, porque su tiempo vale: **no estoy pidiendo financiamiento ni una decisión.**

Estoy pidiendo una de estas tres cosas, la que le resulte más fácil:

1. **Veinte minutos.** Le muestro el prototipo funcionando y usted me dice, sin filtro, dónde está mal.
2. **Un nombre.** Quién dentro de la operación de micros, del municipio o de Enel debería ver esto.
3. **Orientación.** Cuál es el camino real —piloto, innovación abierta, licitación— para que un proyecto así entre a la conversación.

Cualquiera de las tres me sirve. Las tres me ahorran meses.

> **Si este documento le hace sentido pero no es su área: reenviarlo es la ayuda más grande que me puede dar.** Está escrito para que se entienda solo.

---

## El cierre

La flota eléctrica de Coquimbo y La Serena recién empieza su vida útil. La curva de degradación de esas baterías **se está escribiendo ahora**, en los próximos meses, con cada frenada brusca y cada carga a destiempo. En cinco años esa curva ya no se corrige — solo se paga.

Todavía estamos a tiempo de actuar sobre ella.

**El pulso de esas baterías ya se está midiendo. Lo que falta es que llegue, a tiempo, a quien puede responder.**

---

**Tomás Ibacache** — E-Bus Control · INACAP La Serena
Equipo: Rafael Orrego · Benjamín Araya · Fernando Sermeño · Tomás Ibacache · Dilan Cortés

✉️ tomasibac@gmail.com · 📱 [teléfono] · 🔗 [URL del prototipo]

*Prototipo navegable disponible para demostración inmediata.*
