# Qué datos necesitamos para la prueba

**E-Bus Control — INACAP La Serena** · Contacto: Tomás Ibacache (tomasibac@gmail.com)

**Objetivo:** construir la curva real de degradación de las baterías de la flota, medir cuánto impacta cada carga y cada jornada de operación, y proyectar cuándo correspondería reemplazar cada pack.

**Lo que NO necesitamos:** acceso a sus sistemas, instalar nada en los buses, ni datos personales de conductores. Solo planillas de lo que sus sistemas ya registran.

---

## Regla práctica: exporten todo, sin filtrar

Si su sistema tiene un botón de "exportar" con rango de fechas, **úsenlo tal cual y mándennos el archivo completo**, con todas las columnas que traiga. No hace falta limpiar, filtrar ni ordenar nada — de eso nos encargamos nosotros.

Las tablas de abajo son para que puedan verificar qué de lo que necesitamos está disponible, **no una lista que haya que armar a mano**. Si el sistema exporta más columnas de las que pedimos, mejor: mándenlas todas.

---

## Archivo A — Telemetría de los buses

Una fila por registro de cada bus en el tiempo (idealmente cada 1–15 minutos; si solo hay resúmenes por día o por vuelta, también sirve).

| Dato | Importancia | Para qué lo usamos |
|---|---|---|
| **Identificador del bus** (patente o número interno) | 🔴 Imprescindible | Amarrar todo a cada unidad. Debe ser el mismo identificador que en el archivo de cargas |
| **Fecha y hora** del registro | 🔴 Imprescindible | Ordenar la historia y cruzarla con las cargas |
| **SOC — estado de carga (%)** | 🔴 Imprescindible | Es la base del cálculo de capacidad real (ver §"El cálculo clave") |
| **Odómetro o kilómetros recorridos** | 🔴 Imprescindible | Degradación por uso; energía por kilómetro |
| **SOH — estado de salud (%)**, si el sistema lo entrega | 🟠 Importante | Referencia para contrastar con nuestro cálculo propio |
| **Energía consumida (kWh)** o consumo acumulado | 🟠 Importante | Eficiencia real y su evolución en el tiempo |
| **Temperatura de batería** (máx/mín/promedio de celdas) | 🟠 Importante | El calor es el factor que más acelera la degradación |
| **Voltaje y corriente del pack** | 🟠 Importante | Estimar capacidad y detectar esfuerzo eléctrico |
| **Tensión máxima y mínima de celda** | 🟡 Deseable | Detectar desbalance entre celdas (anuncia fallas con semanas de anticipación) |
| **Códigos de falla o alarmas** | 🟡 Deseable | Correlacionar eventos con degradación |
| **Eventos de conducción** (aceleraciones/frenadas bruscas) | 🟡 Deseable | Medir el impacto del estilo de conducción |
| **Posición GPS** | 🟡 Deseable | Diferenciar exigencia por ruta y por pendiente |

---

## Archivo B — Sesiones de carga

Una fila por sesión de carga (esto es lo que cualquier sistema de gestión de carga entrega de forma natural).

| Dato | Importancia | Para qué lo usamos |
|---|---|---|
| **Identificador del bus que cargó** | 🔴 Imprescindible | **Es la llave de todo el análisis**: sin saber qué bus cargó en cada sesión, no se puede cruzar carga con salud. Si el sistema solo registra la tarjeta RFID o el número de bahía, mándenlo igual + la tabla que asocia esa tarjeta/bahía con cada bus |
| **Fecha y hora de inicio y término** | 🔴 Imprescindible | Ventana horaria y duración de cada carga |
| **Energía entregada (kWh)** | 🔴 Imprescindible | Junto con el SOC, es lo que permite calcular la capacidad real del pack |
| **SOC al inicio y al final de la carga (%)** | 🔴 Imprescindible | Idem. Si el sistema de carga no lo registra, lo reconstruimos desde el archivo A |
| **Potencia máxima y promedio (kW)** | 🟠 Importante | Cargas rápidas degradan más que cargas lentas |
| **Identificador de cargador / bahía** | 🟠 Importante | Detectar si algún equipo castiga más que otro |
| **Temperatura del pack al conectar**, si se registra | 🟠 Importante | Cargar con la batería caliente es de los peores hábitos para la vida útil |
| **Curva de potencia durante la sesión** | 🟡 Deseable | Precisión fina del modelo |

---

## Archivo C — Mantenciones e intervenciones (si existe)

Aunque sea una planilla informal o un cuaderno digitalizado:

| Dato | Importancia | Para qué lo usamos |
|---|---|---|
| **Bus, fecha y tipo de intervención** | 🟠 Importante | Explicar saltos en la curva |
| **Reemplazos o reparaciones de módulos de batería** | 🔴 Imprescindible *(si ocurrieron)* | Un pack cambiado reinicia la curva: sin ese dato, el análisis quedaría mal interpretado |
| **Fallas en ruta y su causa** | 🟡 Deseable | Validar si la degradación anticipaba la falla |

---

## Contexto de flota (una sola vez, no es planilla)

- Fecha de puesta en servicio de cada bus del grupo.
- Capacidad nominal del pack (entendemos que son 229 kWh en los Foton U9 — confirmar).
- Si todos los buses del grupo son del mismo modelo y año.
- Condiciones de garantía de la batería (años/km y condiciones de carga exigidas), si las tienen a mano.

---

## Parámetros de la exportación

| | |
|---|---|
| **Cuántos buses** | Entre 5 y 10. Si es posible, que incluyan contraste: alguna unidad de las que más kilómetros hace y alguna de las que menos, o alguna que ya haya dado problemas |
| **Qué período** | Mientras más historia, mejor. **Mínimo útil: 6 meses.** Ideal: desde el inicio de la operación (noviembre 2024) |
| **Formato** | CSV o Excel, tal como los exporte el sistema. Un archivo por fuente |
| **Cómo entregarlo** | Google Drive, WeTransfer o correo. Si prefieren, firmamos un acuerdo de confidencialidad antes |

---

## El cálculo clave (por qué insistimos en kWh + SOC)

La capacidad real de un pack se puede estimar así:

> **Capacidad real ≈ energía entregada en la carga ÷ (SOC final − SOC inicial) × 100**

Aplicado a las cargas nocturnas completas de varios meses, ese cálculo entrega la **curva de capacidad real de cada batería en el tiempo** — que es la degradación efectiva, calculada de forma independiente del valor que reporte el sistema del vehículo. De ahí sale la proyección de cuándo cada pack cruzará el umbral de reemplazo.

Por eso los cuatro datos marcados 🔴 en el archivo B (bus, horario, kWh y SOC inicio/fin) son los más importantes de todo el pedido: **con solo eso ya podemos entregar un primer resultado útil.**

*(La temperatura ambiente histórica de La Serena la obtenemos nosotros de fuentes meteorológicas públicas — no necesitan proporcionarla.)*

---

## Si algo de esto no está disponible

No es un problema: **mándennos lo que sí exista.** Cada dato que falte solo reduce la precisión de una parte del análisis, no lo invalida. Preferimos partir con lo que hay que esperar a tener todo.

---

## Sobre datos personales

No necesitamos nombres de conductores. Si las planillas los traen, los reemplazamos por códigos apenas los recibimos (Ley 21.719). Cualquier indicador de conducción se informa anonimizado o agregado por flota.
