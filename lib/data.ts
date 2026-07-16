// ============================================================
// E-Bus Control — Mock data centralizada (modo demo).
// Datos canónicos EXACTOS del prompt. Series deterministas
// (sin Math.random) para evitar mismatch de hidratación SSR/CSR.
// Tipos del dominio en lib/types.ts; acceso vía lib/api.ts.
// ============================================================

import type {
  Alerta,
  AlertaPrevia,
  AlertaResuelta,
  EcoScoreConductor,
  EcoScoreDia,
  Estado,
  FilaDegradacionFlota,
  FleetSummary,
  HitoTimelineAlerta,
  IncidenciasUnidad,
  IntervencionMecanico,
  PuntoSoH,
  PuntoTendenciaFlota,
  ResumenCargasFlota,
  ResumenCargaUnidad,
  SesionCarga,
  SolicitudMecanico,
  Unidad,
  UsuarioSistema,
} from "./types";

export type {
  Alerta,
  AlertaPrevia,
  AlertaResuelta,
  EcoScoreConductor,
  EcoScoreDia,
  Estado,
  FilaDegradacionFlota,
  FleetSummary,
  HitoTimelineAlerta,
  IncidenciasUnidad,
  IntervencionMecanico,
  PuntoSoH,
  PuntoTendenciaFlota,
  ResumenCargasFlota,
  ResumenCargaUnidad,
  SesionCarga,
  SolicitudMecanico,
  Unidad,
  UsuarioSistema,
  VentanaCarga,
} from "./types";

export const fleetSummary: FleetSummary = {
  total: 120,
  enRecorrido: 98,
  conAlerta: 3,
  fueraDeServicio: 2,
};

export const unidades: Unidad[] = [
  {
    id: "MIC-101",
    bateria: 85,
    soh: 89,
    mesesHastaUmbral: 46,
    estado: "healthy",
    conductor: "Carlos Muñoz",
    ruta: "Ruta 1",
    ultimaActualizacion: "hace 1 min",
    voltaje: 402,
    temperatura: 28,
    ciclos: 320,
    velocidad: 34,
    ecoScore: 88,
  },
  {
    id: "MIC-102",
    bateria: 62,
    soh: 80,
    mesesHastaUmbral: 34,
    estado: "normal",
    conductor: "Jorge Pérez",
    ruta: "Ruta 3",
    ultimaActualizacion: "hace 2 min",
    voltaje: 388,
    temperatura: 31,
    ciclos: 540,
    velocidad: 41,
    ecoScore: 74,
  },
  {
    id: "MIC-103",
    bateria: 35,
    soh: 66,
    mesesHastaUmbral: 0,
    estado: "warning",
    conductor: "Luis Torres",
    ruta: "Ruta 7",
    ultimaActualizacion: "hace 1 min",
    voltaje: 365,
    temperatura: 36,
    ciclos: 910,
    velocidad: 29,
    ecoScore: 61,
  },
  {
    id: "MIC-104",
    bateria: 15,
    soh: 41,
    mesesHastaUmbral: 0,
    estado: "critical",
    conductor: "Pedro Flores",
    ruta: "Ruta 5",
    ultimaActualizacion: "ahora",
    ubicacion: "Av. Central con San Martín",
    tipoFalla: "Tensión de Celda Baja (Crítico)",
    celda: "Celda 7 — Módulo B",
    mecanico: "Juan Silva",
    eta: 15,
    voltaje: 312,
    temperatura: 47,
    ciclos: 1240,
    velocidad: 0,
    ecoScore: 52,
  },
  {
    id: "MIC-105",
    bateria: 78,
    soh: 86,
    mesesHastaUmbral: 41,
    estado: "healthy",
    conductor: "Mario Díaz",
    ruta: "Ruta 2",
    ultimaActualizacion: "hace 3 min",
    voltaje: 399,
    temperatura: 27,
    ciclos: 410,
    velocidad: 37,
    ecoScore: 83,
  },
];

/** Resto de la flota representada ("y 115 unidades más"). */
export const unidadesExtra = fleetSummary.total - unidades.length;

export function getUnidad(id: string): Unidad | undefined {
  return unidades.find((u) => u.id.toLowerCase() === id.toLowerCase());
}

// ---- Series deterministas -------------------------------------------------

/** Ruido determinista (mismo valor en server y client). */
function wobble(i: number, amp: number): number {
  return (Math.sin(i * 1.7) + Math.cos(i * 0.55) * 0.5) * amp;
}

/** Serie de salud de batería (SoH %) interpolada inicio→fin con leve ruido. */
export function serieSoH(
  inicio: number,
  fin: number,
  dias = 30,
  amp = 1.2,
): PuntoSoH[] {
  return Array.from({ length: dias }, (_, i) => {
    const t = i / (dias - 1);
    const base = inicio + (fin - inicio) * t;
    return { dia: i + 1, soh: Math.round((base + wobble(i, amp)) * 10) / 10 };
  });
}

/** Degradación SoH 30 días por unidad (MIC-104 cae en picada). */
export const degradacion30d: Record<string, PuntoSoH[]> = {
  "MIC-101": serieSoH(92, 89),
  "MIC-102": serieSoH(85, 80),
  "MIC-103": serieSoH(78, 66, 30, 1.6),
  "MIC-104": serieSoH(70, 41, 30, 2.2),
  "MIC-105": serieSoH(90, 86),
};

/** Tendencia de salud general de la flota (sube = mejora por monitoreo). */
export const tendenciaSaludFlota: PuntoTendenciaFlota[] = Array.from({ length: 12 }, (_, i) => ({
  semana: `S${i + 1}`,
  salud: Math.round((78 + (91 - 78) * (i / 11) + wobble(i, 0.8)) * 10) / 10,
}));

// ---- Alertas --------------------------------------------------------------

export const alertasActivas: Alerta[] = [
  {
    id: "ALT-2041",
    unidad: "MIC-104",
    conductor: "Pedro Flores",
    estadoUnidad: "critical",
    bateria: 15,
    titulo: "Fallo crítico de batería",
    ubicacion: "Av. Central con San Martín",
    tipoFalla: "Tensión de Celda Baja (Crítico)",
    detectada: "14:32",
    estadoAlerta: "Atención Requerida",
  },
  {
    id: "ALT-2039",
    unidad: "MIC-103",
    conductor: "Luis Torres",
    estadoUnidad: "warning",
    bateria: 35,
    titulo: "Batería en nivel de advertencia",
    ubicacion: "Ruta 7 — Av. del Mar",
    tipoFalla: "Descarga acelerada",
    detectada: "14:18",
    estadoAlerta: "En atención",
  },
  {
    id: "ALT-2036",
    unidad: "MIC-112",
    conductor: "Andrés Rojas",
    estadoUnidad: "warning",
    bateria: 28,
    titulo: "Batería en nivel de advertencia",
    ubicacion: "Ruta 4 — Coquimbo Centro",
    tipoFalla: "Temperatura de celda elevada",
    detectada: "13:55",
    estadoAlerta: "Notificado",
  },
];

/** Timeline de la alerta de MIC-104. */
export const timelineMic104: HitoTimelineAlerta[] = [
  { label: "Detectada", hora: "14:32", done: true },
  { label: "Notificada a Centro de Control", hora: "14:32", done: true },
  { label: "Mecánico asignado", hora: "14:34", done: true },
  { label: "En camino", hora: "14:36", done: true, active: true },
  { label: "Resuelta", hora: "—", done: false },
];

/** Historial de alertas previas de MIC-104. */
export const alertasPreviasMic104: AlertaPrevia[] = [
  { fecha: "12 jun", tipo: "Temperatura de celda elevada", severidad: "warning" as Estado, resuelto: true },
  { fecha: "28 may", tipo: "Caída de tensión transitoria", severidad: "warning" as Estado, resuelto: true },
  { fecha: "09 may", tipo: "Desbalance de celdas", severidad: "critical" as Estado, resuelto: true },
  { fecha: "21 abr", tipo: "Ciclo de carga incompleto", severidad: "normal" as Estado, resuelto: true },
];

/** Historial de alertas resueltas (centro de alertas). */
export const alertasResueltas: AlertaResuelta[] = [
  { id: "ALT-2030", unidad: "MIC-118", tipo: "Batería baja", severidad: "warning" as Estado, fecha: "Hoy 11:20", resolucion: "Recarga programada" },
  { id: "ALT-2028", unidad: "MIC-104", tipo: "Temperatura elevada", severidad: "warning" as Estado, fecha: "Hoy 09:48", resolucion: "Enfriamiento OK" },
  { id: "ALT-2025", unidad: "MIC-107", tipo: "Desbalance de celdas", severidad: "critical" as Estado, fecha: "Ayer 18:02", resolucion: "Mantención en taller" },
  { id: "ALT-2021", unidad: "MIC-133", tipo: "Descarga acelerada", severidad: "warning" as Estado, fecha: "Ayer 16:39", resolucion: "Ruta optimizada" },
  { id: "ALT-2019", unidad: "MIC-102", tipo: "Batería baja", severidad: "warning" as Estado, fecha: "Ayer 14:10", resolucion: "Recarga" },
  { id: "ALT-2014", unidad: "MIC-145", tipo: "Tensión de celda baja", severidad: "critical" as Estado, fecha: "Ayer 10:25", resolucion: "Reemplazo módulo" },
  { id: "ALT-2011", unidad: "MIC-101", tipo: "Sobretemperatura", severidad: "warning" as Estado, fecha: "2 días", resolucion: "Enfriamiento OK" },
  { id: "ALT-2008", unidad: "MIC-129", tipo: "Batería baja", severidad: "warning" as Estado, fecha: "2 días", resolucion: "Recarga" },
  { id: "ALT-2004", unidad: "MIC-156", tipo: "Desbalance de celdas", severidad: "normal" as Estado, fecha: "3 días", resolucion: "Calibración BMS" },
  { id: "ALT-2001", unidad: "MIC-104", tipo: "Caída de tensión", severidad: "warning" as Estado, fecha: "3 días", resolucion: "Monitoreo" },
];

// ---- Mecánico -------------------------------------------------------------

export const solicitudMecanico: SolicitudMecanico = {
  unidad: "MIC-104",
  conductor: "Pedro Flores",
  ubicacion: "Av. Central con San Martín",
  tipoFalla: "Batería Crítica — Tensión de Celda Baja",
  bateria: 15,
  eta: 15,
  prioridad: "Alta",
  descripcion:
    "Unidad detenida con tensión de celda crítica. Requiere inspección del módulo B (celda 7) y evaluación de reemplazo.",
};

export const historialMecanico: IntervencionMecanico[] = [
  { unidad: "MIC-107", fecha: "Hoy 09:10", trabajo: "Reemplazo de módulo de batería", duracion: "1h 20m" },
  { unidad: "MIC-145", fecha: "Ayer 17:05", trabajo: "Calibración de BMS", duracion: "45m" },
  { unidad: "MIC-133", fecha: "Ayer 12:30", trabajo: "Diagnóstico de descarga acelerada", duracion: "1h" },
  { unidad: "MIC-118", fecha: "2 días", trabajo: "Cambio de sensor de temperatura", duracion: "35m" },
];

// ---- Conductor / Eco-score ------------------------------------------------

/** Eco-score últimos 7 días (conductor del caso activo). */
export const ecoScore7d: EcoScoreDia[] = [
  { dia: "Lun", score: 72 },
  { dia: "Mar", score: 65 },
  { dia: "Mié", score: 58 },
  { dia: "Jue", score: 61 },
  { dia: "Vie", score: 49 },
  { dia: "Sáb", score: 55 },
  { dia: "Dom", score: 52 },
];

export const tipsConduccion = [
  {
    titulo: "Aceleración progresiva",
    detalle:
      "Evita acelerones bruscos. La aceleración suave reduce el estrés térmico de las celdas y extiende su vida útil.",
  },
  {
    titulo: "Frenado regenerativo",
    detalle:
      "Anticipa las detenciones y suelta el acelerador a tiempo para recuperar energía hacia la batería.",
  },
  {
    titulo: "Velocidad constante",
    detalle:
      "Mantener velocidad estable consume menos energía que acelerar y frenar de forma repetida.",
  },
  {
    titulo: "Recarga en ventana óptima",
    detalle:
      "Carga preferentemente entre 20% y 80% y en horarios de menor temperatura para cuidar la batería.",
  },
];

// ---- Reportes -------------------------------------------------------------

export const ecoScorePorConductor: EcoScoreConductor[] = [
  { conductor: "Carlos Muñoz", score: 88 },
  { conductor: "Jorge Pérez", score: 74 },
  { conductor: "Luis Torres", score: 61 },
  { conductor: "Pedro Flores", score: 52 },
  { conductor: "Mario Díaz", score: 83 },
];

export const incidenciasPorUnidad: IncidenciasUnidad[] = [
  { unidad: "MIC-101", incidencias: 1, criticas: 0 },
  { unidad: "MIC-102", incidencias: 2, criticas: 0 },
  { unidad: "MIC-103", incidencias: 4, criticas: 1 },
  { unidad: "MIC-104", incidencias: 7, criticas: 3 },
  { unidad: "MIC-105", incidencias: 1, criticas: 0 },
];

export const fallasEvitadas = 3;

// ---- Derivados para gráficos multi-serie ----------------------------------

/** Color de línea por unidad (reportes). */
export const unidadLineColor: Record<string, string> = {
  "MIC-101": "#22C55E",
  "MIC-102": "#84CC16",
  "MIC-103": "#FF8C00",
  "MIC-104": "#FF4444",
  "MIC-105": "#00D4AA",
};

/** Degradación de toda la flota en un único dataset (multi-línea). */
export const degradacionFlota: FilaDegradacionFlota[] = degradacion30d["MIC-101"].map((_, i) => {
  const row: FilaDegradacionFlota = { dia: i + 1 };
  for (const id of Object.keys(degradacion30d)) {
    row[id] = degradacion30d[id][i].soh;
  }
  return row;
});

// ---- Conductor ------------------------------------------------------------

export const modoConduccion = "Normal";

// ---- Configuración: usuarios del sistema ----------------------------------

export const usuariosSistema: UsuarioSistema[] = [
  { nombre: "Tomás Ibacache", rol: "Administrador", estado: "Activo" },
  { nombre: "Operador 01", rol: "Operador", estado: "Activo" },
  { nombre: "Juan Silva", rol: "Mecánico", estado: "Activo" },
  { nombre: "Pedro Flores", rol: "Conductor", estado: "Activo" },
  { nombre: "Carla Núñez", rol: "Operador", estado: "Inactivo" },
];

// ---- Cargas (Electroterminal El Sauce) --------------------------------------
// Narrativa demo: pack ~229 kWh; ventana óptima 23:00–06:00 (Configuración).
// MIC-104 castiga la batería (cargas rápidas de mediodía, celda caliente,
// ciclos profundos) — consistente con su SoH 41 y sus 1.240 ciclos.

/** Sesiones de carga recientes (representativas; el resto se resume). */
export const sesionesCarga: SesionCarga[] = [
  { id: "SES-1042", unidad: "MIC-104", fecha: "Hoy", inicio: "13:05", fin: "13:52", duracionMin: 47, socInicial: 22, socFinal: 71, kwh: 112, potenciaMaxKw: 150, tempInicio: 39, cargador: "ES-04", ventana: "fuera", estres: 86 },
  { id: "SES-1038", unidad: "MIC-101", fecha: "Anoche", inicio: "23:30", fin: "02:58", duracionMin: 208, socInicial: 26, socFinal: 90, kwh: 147, potenciaMaxKw: 82, tempInicio: 24, cargador: "ES-02", ventana: "optima", estres: 22 },
  { id: "SES-1037", unidad: "MIC-102", fecha: "Anoche", inicio: "23:12", fin: "03:05", duracionMin: 233, socInicial: 20, socFinal: 88, kwh: 156, potenciaMaxKw: 88, tempInicio: 27, cargador: "ES-06", ventana: "optima", estres: 34 },
  { id: "SES-1036", unidad: "MIC-103", fecha: "Anoche", inicio: "23:58", fin: "03:40", duracionMin: 222, socInicial: 24, socFinal: 92, kwh: 156, potenciaMaxKw: 96, tempInicio: 29, cargador: "ES-09", ventana: "optima", estres: 47 },
  { id: "SES-1035", unidad: "MIC-104", fecha: "Anoche", inicio: "22:10", fin: "02:54", duracionMin: 284, socInicial: 8, socFinal: 100, kwh: 211, potenciaMaxKw: 148, tempInicio: 33, cargador: "ES-04", ventana: "fuera", estres: 74 },
  { id: "SES-1034", unidad: "MIC-105", fecha: "Anoche", inicio: "00:15", fin: "03:32", duracionMin: 197, socInicial: 29, socFinal: 91, kwh: 142, potenciaMaxKw: 79, tempInicio: 23, cargador: "ES-11", ventana: "optima", estres: 21 },
  { id: "SES-1029", unidad: "MIC-103", fecha: "Ayer", inicio: "14:20", fin: "15:22", duracionMin: 62, socInicial: 31, socFinal: 68, kwh: 85, potenciaMaxKw: 141, tempInicio: 36, cargador: "ES-01", ventana: "fuera", estres: 63 },
  { id: "SES-1026", unidad: "MIC-101", fecha: "13 jul", inicio: "23:47", fin: "03:02", duracionMin: 195, socInicial: 30, socFinal: 89, kwh: 135, potenciaMaxKw: 80, tempInicio: 22, cargador: "ES-05", ventana: "optima", estres: 24 },
  { id: "SES-1024", unidad: "MIC-104", fecha: "12 jul", inicio: "12:40", fin: "13:34", duracionMin: 54, socInicial: 15, socFinal: 64, kwh: 112, potenciaMaxKw: 149, tempInicio: 38, cargador: "ES-03", ventana: "fuera", estres: 81 },
  { id: "SES-1021", unidad: "MIC-105", fecha: "12 jul", inicio: "23:20", fin: "02:41", duracionMin: 201, socInicial: 27, socFinal: 90, kwh: 144, potenciaMaxKw: 81, tempInicio: 24, cargador: "ES-08", ventana: "optima", estres: 23 },
];

/** Resumen de carga por unidad — últimos 30 días. */
export const resumenCargaPorUnidad: ResumenCargaUnidad[] = [
  { unidad: "MIC-101", sesiones30d: 29, kwh30d: 4260, pctVentanaOptima: 97, estresPromedio: 23 },
  { unidad: "MIC-102", sesiones30d: 30, kwh30d: 4685, pctVentanaOptima: 93, estresPromedio: 31 },
  { unidad: "MIC-103", sesiones30d: 31, kwh30d: 4850, pctVentanaOptima: 74, estresPromedio: 52 },
  { unidad: "MIC-104", sesiones30d: 34, kwh30d: 5610, pctVentanaOptima: 41, estresPromedio: 79 },
  { unidad: "MIC-105", sesiones30d: 28, kwh30d: 4095, pctVentanaOptima: 96, estresPromedio: 22 },
];

/** KPIs de carga de toda la flota (anoche). */
export const resumenCargasFlota: ResumenCargasFlota = {
  sesionesAnoche: 96,
  kwhAnoche: 14352,
  pctVentanaOptima: 87,
  estresPromedio: 32,
};
