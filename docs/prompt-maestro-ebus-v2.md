# FASE 1 — DEEP SUMMARY CRÍTICO DEL PROYECTO: E-BUS CONTROL

---

## A. CONTEXTO DEL PROYECTO

**Equipo:** Rafael Orrego, Benjamín Araya, Fernando Sermeño, Tomás Ibacache, Dilan Cortés — INACAP La Serena

**Desafío central redefinido (exacto):**
> "¿Cómo podríamos aumentar la vida útil de las baterías de los buses eléctricos de La Serena en un 25% para optimizar su operación?"

**Meta cuantificable:** +25% de vida útil | Reducción de fallos inesperados | Continuidad del servicio urbano | Optimización de recursos

**Metáfora del sistema — "El Corazón del Bus":**
> Como un monitor cardíaco médico, el sistema vigila el "pulso" (voltaje) de la batería, predice arritmias (fallas) y comunica alertas inmediatas al centro de control.

Atributos funcionales derivados de la metáfora:
1. Detección en tiempo real del estado de todos los componentes críticos (especialmente la batería) y predicción de degradación antes de que se convierta en problema.
2. Comunicación bidireccional instantánea entre el bus y el Centro de Control — telemetría de ida, instrucciones de vuelta.
3. Modificación de rutas, velocidades o paradas en tiempo real según estado de batería y componentes.
4. Alertas prioritarias para pasajeros, conductores y centro de control, con protocolos automáticos de emergencia según nivel de degradación.

**ODS vinculados y relación funcional con la app:**

| ODS | Nombre | Relación con E-Bus Control |
|-----|--------|-----------------------------|
| 3 | Salud y Bienestar | Previene accidentes por fallas eléctricas en buses en operación, protegiendo a pasajeros y conductores |
| 7 | Energía Asequible y No Contaminante | Optimiza uso y momentos de recarga de batería; reduce consumo energético innecesario |
| 13 | Acción por el Clima | Monitoreo evita degradación prematura de componentes; reduce residuos electrónicos al extender vida útil |

---

## B. ARQUITECTURA FUNCIONAL DE LA APP (E-Bus Control)

### 1. Splash / Login
- Pantalla de acceso con identidad de marca E-Bus Control
- Roles de acceso: Operador, Mecánico, Conductor, Administrador

### 2. Dashboard / Resumen de Flota
KPIs principales en tiempo real:
- **Total Micros:** 120
- **En Recorrido:** 98
- **Con Alerta:** 3
- **Fuera de Servicio:** 2

Componentes:
- Contador animado de KPIs
- Mapa en tiempo real con geolocalización de buses (vista general)
- Panel de alertas activas (highlight: MIC-104)
- Resumen de estado de baterías por unidad

### 3. Mapa en Tiempo Real
- Geolocalización en vivo de cada bus en ruta
- Íconos diferenciados por estado: verde (>60%), amarillo/naranja (30-59%), rojo (<30% — alerta crítica)
- Click en bus → detalle rápido (unidad, batería %, conductor, última ubicación exacta)
- Ícono pulsante animado para unidades con alerta activa

### 4. Panel de Estado de Baterías por Unidad
Tabla/grilla con semáforo por color:
| Unidad | Batería % | Estado |
|--------|-----------|--------|
| MIC-101 | 85% | 🟢 Verde |
| MIC-102 | 62% | 🟡 Amarillo-Verde |
| MIC-103 | 35% | 🟠 Naranja |
| MIC-104 | 15% | 🔴 ALERTA CRÍTICA |
| MIC-105 | 78% | 🟢 Verde |

### 5. Sistema de Alertas Automáticas
- Umbrales configurables (ej: crítico <20%, advertencia <35%)
- Flujo automático: detección → notificación → asignación
- Destinatarios: Operadores (Centro de Control) + Mecánicos asignados
- Detalle de alerta: Unidad, %, Ubicación GPS exacta, Tipo de falla, Estado, Mecánico asignado

Alerta activa de referencia:
```
Unidad: MIC-104
Batería: 15%
Ubicación: Av. Central con San Martín
Tipo de falla: Tensión de Celda Baja (Crítico)
Estado: Notificado
Mecánico: Asignando...
```

### 6. Módulo de Conductores (Feedback Cabina)
- Eco-Score visual en tiempo real: indica si estilo de conducción acelera degradación de batería
- Módulo de eco-conducción con indicador simple (verde/amarillo/rojo) tipo semáforo
- Alertas en cabina cuando batería entra en rangos críticos
- Score de maltrato de batería histórico por conductor
- Capacitación integrada: módulo de consejos y buenas prácticas

### 7. Centro de Operaciones
- Recepción de alertas con prioridad de atención
- Verificación de ubicación exacta del bus en el mapa
- Activación de protocolo: contacto con mecánico, notificación al conductor
- Panel de alertas recibidas con estado: pendiente / en atención / resuelto

### 8. Panel del Mecánico
- Solicitudes de asistencia entrantes
- Detalle: Unidad, falla, ubicación exacta, ETA estimado
- Botón ACEPTAR → confirmación de asistencia → inicio de conteo de ETA (15 min default)
- Historial de intervenciones previas por unidad

### 9. Módulo de Mantenimiento Predictivo (IA)
- Análisis de degradación de celdas por unidad
- Salud del bus: porcentaje de vida útil restante
- Predicción de fallas próximas
- Motor de reglas de asociación: correlación entre estilo de conducción, condiciones de ruta y degradación

### 10. Reportes y Visualización Histórica
- Tendencias de degradación de batería por unidad a lo largo del tiempo
- Hábitos de conducción por conductor (score histórico)
- Dashboard de "Riesgo de degradación por viaje" (ruta, hora, temperatura, pendiente, tipo de carga)
- Índice de "salud del sistema eléctrico de transporte" para la flota completa
- Exportación de datos

### 11. Módulo de Carga Inteligente
- Sistema predictivo de horarios óptimos de carga según tarifas y temperatura ambiente
- Algoritmo de programación de carga multiobjetivo
- Gestión del proceso y método de carga
- Estatus de disponibilidad de puntos de carga en el sector

### 12. Configuración del Sistema
- Gestión de usuarios y roles
- Configuración de umbrales de alerta
- Ajuste de parámetros de notificaciones

---

## C. REQUERIMIENTOS TÉCNICOS CRÍTICOS

### Prioridad Alta (Matriz de Priorización PPT — Cuadrante "Alta Factibilidad & Originalidad"):

1. **Monitoreo IoT & Telemetría en Tiempo Real** — App centralizada para evaluar celdas, degradación y salud del bus junto con comunicación inmediata ante fallas
   - Brainstorming #89: Aplicación para monitorear batería
   - Brainstorming #72: Aplicación de estado de la micro
   - Brainstorming #64: Aplicación para estado de batería en tiempo real

2. **Capacitación integrada sobre cuidado de batería**
   - Brainstorming #93: Capacitación sobre cuidado de batería
   - Brainstorming #76: Capacitación de uso de micros eléctricas
   - Brainstorming #86: Capacitación choferes

3. **Modificador de ruta según carga**
   - Brainstorming #70: Modificador de ruta según carga
   - Brainstorming #27: Mejorar rutas para minimizar consumo y optimizar rendimiento

4. **Comunicación inmediata ante fallas**
   - Brainstorming #65: Mejora en comunicación en caso de falla
   - Brainstorming #73: Comunicación en tiempo real
   - Brainstorming #15: Alertas automáticas al conductor cuando batería entra en rangos críticos

5. **Dashboard de salud — operador y usuario** (ítem #46 del brainstorming)
   - Plataforma de visualización de salud de baterías (operador + usuario)

### Prioridad Media:

6. **Mantenimiento predictivo mediante IA** — Brainstorming #40
7. **Eco-conducción con feedback en cabina** — Brainstorming #45
8. **Score de maltrato de batería** — Brainstorming #41
9. **Sistema predictivo de carga** (horarios, tarifas, temperatura) — Brainstorming #14
10. **Red de mecánicos distribuidos** — Brainstorming #39
11. **Mapa en tiempo real de micros disponibles** — Brainstorming #92
12. **Panel de información para choferes** más explícito — Brainstorming #37

### Requerimientos de la Tabla (Insights → Requerimientos):

| Insight | Requerimiento |
|---------|---------------|
| Estabilidad | Batería eficiente, funcionamiento óptimo, normativas de seguridad |
| Visualización de datos | Estado de batería + nivel de carga para conductor y punto de control |
| Carga eléctrica | Optimizar método y manejo de carga |
| Chofer | Capacitación sobre correcto uso y proceso de carga |
| Repuestos | Disponibilidad y accesibilidad de repuestos a nivel regional |
| Impacto ambiental | Sostenibilidad en reciclaje/manejo de residuos electrónicos al fin de vida útil |

---

## D. FLUJOS UX CRÍTICOS

### Flujo 1: Conductor — Operación Normal → Detección de Batería Baja
1. Conductor maneja micro eléctrica normalmente por la ciudad con batería en buen estado
2. Sistema IoT monitorea voltaje y % de batería en tiempo real
3. Batería desciende a umbral de advertencia (35%) → alerta amarilla en cabina
4. Batería desciende a umbral crítico (15-20%) → alerta roja pulsante en cabina
5. Conductor recibe notificación: "Alerta de Batería MIC-104 — Batería baja: 15% — Requiere atención pronto"
6. Conductor continúa operando con aviso visible en tablero

### Flujo 2: Sistema Detecta Umbral Crítico → Notificación Automática
1. Sistema detecta MIC-104 en 15% de batería (umbral crítico configurado)
2. Dashboard de flota actualiza estado: MIC-104 cambia a ROJO + badge pulsante "ALERTA"
3. Sistema genera automáticamente: "ALERTA DE FALLO CRÍTICO DE BATERÍA — Unidad 405 (Pedro Flores)"
4. Notificación push enviada simultáneamente a: Operadores (Centro de Control) + Mecánicos asignados
5. Panel de alertas registra: Unidad, Ubicación GPS, Tipo falla, Estado: Notificado, Mecánico: Asignando...

### Flujo 3: Centro de Operaciones Recibe Alerta → Activa Protocolo
1. Centro de operaciones recibe alerta en pantalla principal: "Alerta crítica de batería en Unidad — Acaba de reportar un fallo grave. Iniciando protocolo."
2. Operador verifica en mapa la ubicación exacta del bus (Av. Central con San Martín)
3. Operador confirma alerta: estado cambia a "En Atención"
4. Sistema activa protocolo: contacta mecánico disponible más cercano
5. Operador puede ver ETA del mecánico en tiempo real

### Flujo 4: Mecánico Recibe Asignación → Confirma → ETA
1. Mecánico recibe notificación en móvil: "Nueva Asistencia — MIC-104 — Fallo en batería"
2. Detalle visible: Unidad, Descripción, Ubicación, ETA estimado, Tipo de falla
3. Mecánico presiona "ACEPTAR" → Mensaje: "¡Perfecto! Mensaje recibido. Voy en camino. Llego en 15 minutos."
4. Sistema actualiza estado en Centro de Operaciones: Mecánico confirmado, ETA 15 minutos
5. Conductor recibe confirmación: asistencia en camino

### Flujo 5: Operador Monitorea Flota Completa desde Dashboard
1. Operador accede a E-Bus Control → Dashboard principal
2. Vista global: **120 micros totales | 98 en recorrido | 3 con alerta | 2 fuera de servicio**
3. Panel lateral muestra baterías de todas las unidades con código de color semáforo
4. MIC-104 aparece destacada con badge rojo "ALERTA" pulsante
5. Mapa muestra posición en tiempo real de las 98 unidades en recorrido
6. Operador puede filtrar por estado, ruta, nivel de batería

---

## E. IDENTIDAD VISUAL DEL PRODUCTO

**Nombre oficial:** E-Bus Control

**Subtítulo:** "Dashboard de Baterías de Flota — En Tiempo Real"

**Paleta cromática observada en mockups (Infografías):**
- **Fondo principal:** Oscuro, tipo #0A0E1A o similar (azul noche)
- **Superficies:** Gris oscuro #111827
- **Acento principal (saludable):** Verde-teal #00D4AA — usado en buses con buena carga, KPIs positivos
- **Alerta crítica:** Rojo #FF4444 — badges pulsantes, unidades en emergencia
- **Alerta media:** Naranja #FF8C00 — unidades en advertencia
- **Estado saludable:** Verde #22C55E — unidades sin problemas

**Iconografía identificada en mockups:**
- Ícono de bus con indicador de batería (estilo Material/Lucide)
- Badges de nivel de batería con colores semáforo
- Ícono de alerta triangular (⚠️) para estados críticos
- Mapa con pins geolocalizados por estado
- Barras de progreso horizontales para nivel de batería

**Componentes UI identificados:**
- Cards con título de módulo + listado de unidades + barras de batería
- Header "ALERTAS DE FLOTA" con campo: Unidad, Conductor, Ubicación, Tipo de fallo, Celdas, Estado, Mecánico
- Sidebar de navegación: Resumen, Mapa, Micros, Alertas, Mantenimiento, Reportes, Configuración
- Panel "Resumen de Flota" con 4 KPI cards: Total Micros, En recorrido, Con alerta, Fuera de servicio
- Estado de baterías listado: nombre unidad + % + barra de color
- Vista de detalles de una unidad individual con toda la telemetría

**Tipografía inferida:**
- Display sans-serif bold para métricas (números grandes de KPIs)
- Sans-serif técnica limpia para cuerpo (similar a Inter, Geist o General Sans)
- Estilo "mission control" — futurista, oscuro, denso pero legible

---

## F. CRITERIOS DE EVALUACIÓN A SATISFACER (Semana 10)

Los ítems evaluables según la rúbrica que el mockup debe evidenciar visualmente:

| Código | Criterio | Puntos | Evidencia en Mockup |
|--------|----------|--------|---------------------|
| 2.1.2.1 | Analiza al menos 3 casos existentes coherentes con detección de necesidades | 5 pts | Sección de referentes/inspiración en presentación |
| 2.1.2.2 | Reconoce aciertos y aspectos a mejorar de los casos analizados | 5 pts | Tabla comparativa de referentes con aciertos/mejoras |
| 2.1.2.3 | Tendencias y patrones de los referentes | 5 pts | Patrones identificados: IoT, tiempo real, alertas push |
| 2.1.3.4 | Establece requerimientos coherentes para todos los insights | 5 pts | Tabla de requerimientos visible y completa |
| 2.1.3.5 | Organiza en categorías los requerimientos de la solución | 5 pts | Categorización: Monitoreo, Alertas, Conducción, Carga, Sostenibilidad |
| 2.1.4.6 | Establece ejes para priorizar necesidades (2 ejes) | 5 pts | Matriz de priorización con ejes Factibilidad vs. Originalidad |
| 2.1.1.7 | Propone al menos 20 ideas innovadoras y sostenibles | 10 pts | Brainstorming visible con 100 ideas enumeradas |
| 2.1.1.8 | Clasifica ideas por factibilidad y originalidad | 5 pts | Mapa de clasificación de ideas (cuadrantes) |
| 2.1.1.9 | Argumenta selección de idea basada en sostenibilidad y factibilidad | 5 pts | Justificación de E-Bus Control como idea seleccionada |
| 2.1.1.10 | Conceptualiza idea con metáfora y atributos | 10 pts | Metáfora "El Corazón del Bus" + 4 atributos funcionales |
| 2.1.5.11 | Evidencia de mejora continua en el proyecto | Variable | Mostrar iteraciones: PPT → Infografías → Mockup navegable |

**Para calificación DESTACADO (máximo puntaje), el mockup debe:**
- Evidenciar TODOS los módulos identificados en el proceso de diseño
- Mostrar flujos completos end-to-end (no solo pantallas estáticas)
- Conectar visualmente los 3 ODS (3, 7, 13) con funcionalidades específicas de la app
- Demostrar coherencia entre la metáfora "Corazón del Bus" y el diseño de alertas/monitoreo
- Presentar datos de prueba reales (exactamente los de la infografía: 120 micros, MIC-101 a MIC-105)

---
---

# FASE 2 — PROMPT MAESTRO PARA VS CODE / CLAUDE OPUS (MODO AGENTE)

> INSTRUCCIÓN DE USO: Copia todo el bloque desde [PROMPT MAESTRO INICIO] hasta [PROMPT MAESTRO FIN] y pégalo directamente en Claude Opus en modo agente dentro de VS Code. Adjunta junto a este prompt los archivos: Infografia1.jpeg, Infografia2.jpeg, Tabla-de-Requerimientos.pdf, Buses-Electricos-Movilidad-Inteligente.pptx

---

[PROMPT MAESTRO INICIO]

## [ROL]

Eres un arquitecto senior de UI/UX y desarrollador frontend especializado en aplicaciones de transporte inteligente IoT y sistemas de "mission control" para movilidad urbana. Tienes experiencia en dashboards de telemetría en tiempo real, design systems oscuros de alta densidad informacional, y navegación SPA vanilla. Tu estética de referencia es Tesla Dashboard, Linear App y Vercel — pero adaptada a movilidad urbana chilena con identidad propia.

---

## [CONTEXTO DEL PROYECTO]

**Proyecto:** E-Bus Control — Sistema de Monitoreo Inteligente de Baterías para Flotas de Buses Eléctricos  
**Institución:** INACAP La Serena  
**Equipo:** Rafael Orrego, Benjamín Araya, Fernando Sermeño, Tomás Ibacache, Dilan Cortés  
**Título de página:** "E-Bus Control — Movilidad Inteligente La Serena"

### Desafío Central
> "¿Cómo podríamos aumentar la vida útil de las baterías de los buses eléctricos de La Serena en un 25% para optimizar su operación?"

### Metáfora del Sistema: "El Corazón del Bus"
Como un monitor cardíaco médico, el sistema vigila el "pulso" (voltaje) de la batería, predice arritmias (fallas) y comunica alertas inmediatas al centro de control. Atributos funcionales:
1. Detección en tiempo real del estado de todos los componentes críticos
2. Comunicación bidireccional instantánea entre bus y Centro de Control
3. Modificación de rutas y velocidades en tiempo real según estado de batería
4. Alertas prioritarias con protocolos automáticos de emergencia

### ODS Vinculados (funcionalidad específica por ODS)
- **ODS 3 — Salud y Bienestar:** Previene accidentes por fallas eléctricas; protege pasajeros y conductores
- **ODS 7 — Energía Asequible y No Contaminante:** Optimiza momentos y método de recarga; reduce consumo innecesario
- **ODS 13 — Acción por el Clima:** Extiende vida útil de baterías; reduce residuos electrónicos por reemplazo prematuro

### Datos de Flota (usar EXACTAMENTE estos en toda la app)
- **Total Micros:** 120  
- **En Recorrido:** 98  
- **Con Alerta:** 3  
- **Fuera de Servicio:** 2  

| Unidad | Batería % | Estado | Color |
|--------|-----------|--------|-------|
| MIC-101 | 85% | Saludable | Verde #22C55E |
| MIC-102 | 62% | Normal | Verde-amarillo |
| MIC-103 | 35% | Advertencia | Naranja #FF8C00 |
| MIC-104 | 15% | ALERTA CRÍTICA | Rojo #FF4444 |
| MIC-105 | 78% | Saludable | Verde #22C55E |

**Alerta activa prioritaria:**
- Unidad: MIC-104
- Batería: 15%
- Ubicación: Av. Central con San Martín
- Tipo de falla: Tensión de Celda Baja (Crítico)
- Conductor: Pedro Flores
- Estado: Atención Requerida
- Mecánico asignado: ETA 15 minutos

---

## [TAREA]

Construye un mockup navegable completo de **E-Bus Control** en un único archivo `ebus-control.html`. El archivo debe ser completamente funcional con las siguientes 9 pantallas/secciones:

### Pantalla 1: Login / Splash Screen
- Logo SVG de E-Bus Control (diseña uno: estilización de bus eléctrico con pulso cardíaco / electrocardiograma integrado)
- Tagline: "El pulso de tu flota, en tiempo real"
- Campos: usuario, contraseña, selector de rol (Operador / Mecánico / Conductor / Administrador)
- Botón de acceso con animación de carga
- Indicadores de ODS 3, 7, 13 en footer de pantalla
- Identidad: INACAP La Serena

### Pantalla 2: Dashboard Principal
- Header con logo, nombre de usuario logueado, notificaciones (badge con "3"), selector de tema
- Sidebar colapsable con íconos Lucide: Resumen, Mapa, Micros, Alertas, Mantenimiento, Reportes, Configuración
- 4 KPI Cards con counter-up animado: Total Micros (120), En Recorrido (98), Con Alerta (3 — en rojo pulsante), Fuera de Servicio (2)
- Mapa simulado (CSS grid con íconos de buses posicionados en calles de una ciudad genérica) con MIC-104 en rojo pulsante
- Lista de las 5 unidades con barras de batería a color semáforo
- Panel de últimas alertas (MIC-104 destacada)

### Pantalla 3: Vista de Flota Completa
- Tabla o grilla con TODAS las unidades (MIC-101 a MIC-105 como representativas, + indicación "y 115 unidades más")
- Columnas: ID Unidad, Conductor, Ruta, Batería %, Estado, Última actualización, Acciones
- Filtros: Por estado (Todas / Alerta / Advertencia / Normal / Fuera de servicio)
- Badge semáforo animado para MIC-104 (pulso rojo)
- Ordenamiento por nivel de batería (ascendente muestra MIC-104 primero)

### Pantalla 4: Detalle de Unidad Individual (MIC-104 — caso activo)
- Header: "MIC-104 — ALERTA CRÍTICA" con badge pulsante
- Indicadores telemetría en tiempo real: Batería 15%, Voltaje, Temperatura celda, Ciclos de carga
- Línea temporal de degradación de batería (gráfico Chart.js — últimos 30 días)
- Eco-score del conductor (score de conducción)
- Historial de alertas previas de esta unidad
- Ubicación actual en mapa (pin rojo pulsante sobre grid de calles)
- Botón "Asignar mecánico" → abre flujo de asignación

### Pantalla 5: Centro de Alertas
- Panel principal: lista de alertas activas ordenadas por criticidad
- Alerta de MIC-104 en el tope, expandida, con todos los datos:
  - Unidad, Conductor, Ubicación GPS, Tipo de fallo, Celda afectada, Estado, Mecánico asignado
- Timeline de la alerta: Detectada → Notificada → Mecánico asignado → En camino
- Botones de acción: Escalar / Resolver / Ver en mapa
- Historial de alertas resueltas (últimas 10)
- Badge de notificaciones en header actualizado

### Pantalla 6: Panel del Mecánico
- Vista de solicitudes de asistencia entrantes
- Tarjeta destacada: "Nueva Asistencia — MIC-104 — Fallo en batería — Llegada estimada en 15 minutos"
- Detalle completo: Unidad, Conductor Pedro Flores, Descripción Av. Central con San Martín, Tipo falla Batería Crítica, ETA
- Botón "ACEPTAR" grande (verde) → al presionar: animación de confirmación + mensaje "¡En camino! ETA: 15 min"
- Contador regresivo de ETA visible (simulado)
- Historial de intervenciones completadas

### Pantalla 7: Vista del Conductor (Feedback Cabina / Eco-Score)
- Panel de "Estado de tu unidad" en tiempo real: batería %, velocidad actual, modo de conducción
- Eco-Score visual tipo velocímetro: zona verde (conducción eficiente), amarillo (moderado), rojo (desgaste acelerado)
- Feedback inmediato: "⚠️ Aceleración brusca detectada — Esto acelera la degradación de tu batería"
- Histórico de eco-score de los últimos 7 días (mini gráfico de barras)
- Módulo de capacitación: tips y buenas prácticas de conducción (carrusel o acordeón)
- Alertas de batería baja visibles en cabina

### Pantalla 8: Módulo de Reportes
- Selector de período: Hoy / Semana / Mes / Personalizado
- Gráfico de líneas: Degradación de batería por unidad (Chart.js — MIC-101 a MIC-105 con colores diferenciados)
- Gráfico de barras: Eco-score promedio por conductor (últimos 7 días)
- Tabla: Incidencias por unidad (conteo de alertas por mes)
- KPI de eficiencia: "Ahorro estimado por monitoreo preventivo: 3 fallas evitadas este mes"
- Gráfico de área: Tendencia de salud general de la flota (subiendo = bien)
- Exportar como PDF / CSV (botones con función de descarga via blob)

### Pantalla 9: Configuración
- Sección: Umbrales de alerta (sliders: crítico <X%, advertencia <Y%)
- Sección: Gestión de usuarios (tabla con roles activos)
- Sección: Notificaciones (toggle: email / push / SMS por tipo de alerta)
- Sección: Parámetros de carga inteligente (horario óptimo, temperatura máxima de carga)
- Sección: Integraciones (API keys — campos con tipo password)
- Botón guardar con feedback visual de éxito

---

## [DISEÑO — REGLAS NO NEGOCIABLES]

### Estética General
- **Concepto:** "Mission Control" futurista para movilidad urbana chilena — oscuro, denso, informacional, profesional
- **NO:** fondos blancos, cards con borde izquierdo de color, grilla de 3 features con ícono en círculo, hero centrado con gradiente, orbs decorativos, gradientes púrpura/violeta/azul
- **SÍ:** Glassmorphism sutil en overlays, badges animados, micro-animaciones funcionales, tablas densas bien tipografiadas

### Paleta de Colores (OBLIGATORIA — no cambiar)
```css
/* Fondos */
--color-bg: #0A0E1A;           /* Azul noche profundo */
--color-surface: #111827;       /* Superficie principal */
--color-surface-2: #1a2235;     /* Superficie secundaria */
--color-surface-offset: #1f2d40; /* Cards elevadas */
--color-border: rgba(255,255,255,0.08);

/* Texto */
--color-text: #E2E8F0;
--color-text-muted: #94A3B8;
--color-text-faint: #475569;

/* Semáforo de batería */
--color-healthy: #22C55E;       /* Verde — batería saludable */
--color-warning: #FF8C00;       /* Naranja — advertencia */
--color-critical: #FF4444;      /* Rojo — alerta crítica */
--color-primary: #00D4AA;       /* Teal eléctrico — acento principal */

/* Interactivos */
--color-primary-hover: #00B894;
--color-success: #22C55E;
```

### Tipografía
```html
<!-- Cargar desde Fontshare -->
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
```
- **Display/Métricas grandes:** `font-family: 'General Sans', sans-serif; font-weight: 700`
- **Cuerpo/labels:** `font-family: 'General Sans', sans-serif; font-weight: 400-500`
- `font-variant-numeric: tabular-nums` en todos los KPIs y datos numéricos

### Sidebar
- Ancho expandido: 240px | Colapsado: 64px
- Toggle con animación suave 200ms
- Ítems con ícono Lucide + label (colapsado: solo ícono + tooltip)
- Ícono activo con acento teal, fondo levemente iluminado

### Componentes Específicos
- **Badge semáforo animado:** `@keyframes pulse` para unidades en alerta crítica
- **KPI Cards:** Número grande bold + label muted + mini tendencia (flecha o sparkline)
- **Barras de batería:** `<progress>` o div con width% y color dinámico según umbral
- **Gráficos:** Chart.js desde CDN — líneas para degradación, barras para eco-score, área para tendencia
- **Mapa simulado:** Grid CSS con calles y buses representados como íconos posicionados — NO Leaflet (complejidad innecesaria para mockup)
- **Cards:** `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.3)`
- **Glassmorphism (solo overlays y modales):** `backdrop-filter: blur(12px); background: rgba(17,24,39,0.8)`

### Animaciones
- Pulso en badges de alerta crítica: `animation: pulse 2s infinite`
- Counter-up en KPIs al cargar el dashboard: animación de 1.5s desde 0 al valor final
- Transiciones de navegación: `transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1)`
- Hover en cards: `transform: translateY(-2px); box-shadow` más pronunciado
- Entrada de alertas: `animation: slideInFromRight 300ms`

### Responsive
- **Mobile (375px):** Sidebar se convierte en bottom navigation (5 ítems principales); cards en stack vertical; KPIs 2×2 grid
- **Tablet (768px):** Sidebar colapsado por defecto; cards en 2 columnas
- **Desktop (1440px):** Sidebar expandido; dashboard en grid de 12 columnas

---

## [ARQUITECTURA TÉCNICA DEL ARCHIVO]

### Stack tecnológico — Next.js + React

```bash
# Inicialización del proyecto
npx create-next-app@latest ebus-control \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*"

# Dependencias adicionales (el agente puede añadir más según criterio)
npm install framer-motion lucide-react recharts
# O si prefiere Chart.js:
# npm install framer-motion lucide-react react-chartjs-2 chart.js
```

### Arquitectura de componentes React (App Router)

```
app/
├── layout.tsx          ← RootLayout: sidebar + header (extrae interactividad a Client Components)
├── page.tsx            ← redirect a /dashboard
├── login/page.tsx      ← "use client" — estado de formulario local
├── dashboard/page.tsx  ← "use client" — KPIs con counter-up Framer Motion
├── flota/
│   ├── page.tsx        ← tabla de flota con filtros (useState)
│   └── [id]/page.tsx   ← detalle dinámico (params.id = 'MIC-104')
├── alertas/page.tsx
├── mecanico/page.tsx
├── conductor/page.tsx
├── reportes/page.tsx
└── configuracion/page.tsx

components/
├── layout/
│   ├── Sidebar.tsx     ← "use client" — colapso con Framer Motion (motion.div)
│   ├── Header.tsx      ← badge de notificaciones, nombre de usuario
│   └── MobileNav.tsx   ← bottom navigation para 375px
├── ui/
│   ├── KPICard.tsx     ← counter-up con useMotionValue de Framer Motion
│   ├── BatteryBar.tsx  ← barra con color dinámico por umbral
│   ├── AlertBadge.tsx  ← badge con pulse keyframe CSS o Framer
│   └── StatusDot.tsx   ← indicador semáforo
├── dashboard/
│   ├── FleetMap.tsx    ← mapa simulado CSS Grid + Tailwind con buses posicionados
│   └── AlertFeed.tsx   ← feed de alertas activas
└── charts/
    ├── DegradationChart.tsx    ← Recharts <LineChart>
    ├── EcoScoreGauge.tsx       ← Recharts <RadialBarChart> o SVG custom
    └── FleetTrendChart.tsx     ← Recharts <AreaChart>

lib/
├── data.ts             ← TODA la mock data centralizada
└── constants.ts        ← colores semáforo, umbrales de alerta, nav items
```

### Mock data de referencia (`lib/data.ts`)
```typescript
export const fleetSummary = { total: 120, enRecorrido: 98, conAlerta: 3, fueraDeServicio: 2 };

export const unidades = [
  { id: 'MIC-101', bateria: 85, estado: 'healthy',  conductor: 'Carlos Muñoz', ruta: 'Ruta 1' },
  { id: 'MIC-102', bateria: 62, estado: 'normal',   conductor: 'Jorge Pérez',  ruta: 'Ruta 3' },
  { id: 'MIC-103', bateria: 35, estado: 'warning',  conductor: 'Luis Torres',  ruta: 'Ruta 7' },
  { id: 'MIC-104', bateria: 15, estado: 'critical', conductor: 'Pedro Flores',
    ubicacion: 'Av. Central con San Martín', tipoFalla: 'Tensión de Celda Baja (Crítico)',
    mecanico: 'Juan Silva', eta: 15 },
  { id: 'MIC-105', bateria: 78, estado: 'healthy',  conductor: 'Mario Díaz',   ruta: 'Ruta 2' },
];
```

### Tipografía con next/font o Fontshare
```typescript
// globals.css — si General Sans no está disponible en next/font:
// @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');
// En app/layout.tsx usar className con la variable de fuente
```

---

## [OUTPUT ESPERADO]

- **Proyecto Next.js (App Router)** con TypeScript, Tailwind CSS, y estructura de carpetas estándar
- **Navegación con next/link y useRouter** — todas las 9 rutas navegables sin recarga
- **Estado React** (useState, useEffect) — todos los estados: normal, advertencia, alerta crítica, fuera de servicio
- **Mock data centralizada** en `/lib/data.ts` o `/constants/fleet.ts` — sin backend, sin base de datos
- **Gráficos con Recharts o react-chartjs-2** — el agente elige según compatibilidad con App Router
- **Animaciones con Framer Motion** — counter-up en KPIs, pulso en alertas, transiciones de página
- **Login funcional:** cualquier usuario/contraseña pasa al dashboard (sin autenticación real)
- **Metadata via Next.js Metadata API:** "E-Bus Control — Movilidad Inteligente La Serena"
- **Desplegable en Vercel** con `vercel --prod` — `npm run build` sin errores
- **Mobile-first responsive:** funcional en 375px y 1440px

### Stack recomendado base (el agente puede añadir lo que considere óptimo):
```bash
npx create-next-app@latest ebus-control --typescript --tailwind --app
npm install framer-motion lucide-react recharts
```

### Estructura de proyecto sugerida:
```
ebus-control/
├── app/
│   ├── layout.tsx            ← RootLayout: sidebar + header
│   ├── page.tsx              ← redirect → /dashboard
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── flota/page.tsx
│   ├── flota/[id]/page.tsx   ← detalle dinámico (MIC-104)
│   ├── alertas/page.tsx
│   ├── mecanico/page.tsx
│   ├── conductor/page.tsx
│   ├── reportes/page.tsx
│   └── configuracion/page.tsx
├── components/
│   ├── layout/               ← Sidebar.tsx, Header.tsx, MobileNav.tsx
│   ├── ui/                   ← KPICard, BatteryBar, AlertBadge, StatusDot
│   ├── dashboard/            ← FleetMap, AlertFeed
│   └── charts/               ← DegradationChart, EcoScoreGauge, FleetTrendChart
└── lib/
    ├── data.ts               ← toda la mock data (flota, alertas, conductores)
    └── constants.ts          ← colores, umbrales, rutas de navegación
```

### Nota crítica para App Router:
- Componentes con hooks → directiva **`"use client"`** al inicio del archivo
- Gráficos con Recharts/Chart.js → usar `dynamic(() => import(...), { ssr: false })` para evitar errores de hidratación

### Verificación final antes de entregar:
- [ ] `npm run dev` sin errores — app corre en localhost:3000
- [ ] Todas las 9 rutas navegables con next/link
- [ ] MIC-104 aparece en ALERTA CRÍTICA con badge rojo pulsante en todas las vistas relevantes
- [ ] KPIs muestran exactamente: 120 / 98 / 3 / 2 con animación counter-up (Framer Motion)
- [ ] Gráficos renderizan correctamente con `"use client"` donde corresponda
- [ ] Sidebar colapsa/expande con animación Framer Motion
- [ ] No hay errores de hidratación SSR/CSR en consola
- [ ] Responsive funciona en 375px (testar con DevTools)
- [ ] Los ODS 3, 7, 13 son visibles en algún punto de la app
- [ ] La metáfora "El Corazón del Bus" / pulso cardíaco está presente (logo SVG o línea ECG)
- [ ] `npm run build` pasa sin errores — listo para `vercel --prod`

[PROMPT MAESTRO FIN]

---

## NOTAS DE USO DEL PROMPT MAESTRO

1. **Adjuntar en VS Code junto al prompt:**
   - `Infografia1.jpeg` — flujo narrativo versión oscura (referencia visual)
   - `Infografia2.jpeg` — flujo narrativo versión ilustrada (referencia visual)
   - `Tabla-de-Requerimientos.pdf` — para validar requerimientos implementados
   - `Buses-Electricos-Movilidad-Inteligente.pptx` — para validar datos y metáfora

2. **Si Claude Opus pide clarificaciones**, responder:
   - Para el mapa: "Usa un mapa simulado con CSS grid, no Leaflet"
   - Para los datos: "Usa exactamente los datos de los [DATOS DE PRUEBA]"
   - Para la paleta: "Usa exactamente la paleta especificada, no la cambies"

3. **Si el archivo resulta muy largo (>4000 líneas)**, pedir a Claude que divida en 2 entregas y las concatene.

