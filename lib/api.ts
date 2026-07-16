// ============================================================
// E-Bus Control — Capa de acceso a datos (repositorio).
// Las pantallas consumen estas funciones, nunca la fuente
// directa. Modo "demo" (default): mock de lib/data.ts. Modo
// "live": backend real de Fase 1 (Supabase + adaptadores del
// sistema de telemetría y del CMS del terminal — proveedores por
// confirmar; ver docs/analisis-integracion-la-serena.md §4).
//
// Flag: NEXT_PUBLIC_DATA_SOURCE = "demo" | "live".
//
// Fuera del contrato (importar directo de lib/data.ts): contenido
// demo puramente presentacional — tipsConduccion, modoConduccion,
// unidadLineColor y el índice de búsqueda de Soporte (helpContent).
// Fase 1 les definirá fuente real si corresponde.
// ============================================================

import * as demo from "./data";
import type {
  Alerta,
  AlertaPrevia,
  AlertaResuelta,
  EcoScoreConductor,
  EcoScoreDia,
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

export type DataSourceMode = "demo" | "live";

/** Modo activo según NEXT_PUBLIC_DATA_SOURCE (default: demo). */
export function dataSourceMode(): DataSourceMode {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === "live" ? "live" : "demo";
}

/**
 * Contrato de lectura que toda fuente (demo o live) debe cumplir.
 * Async desde ya: el modo live consulta red y las pantallas no
 * deben notar la diferencia.
 */
export interface DataSource {
  getFleetSummary(): Promise<FleetSummary>;
  getUnidades(): Promise<Unidad[]>;
  getUnidad(id: string): Promise<Unidad | undefined>;
  /** Serie SoH 30 días de una unidad. En live: SoH estimado propio, no el del BMS (H4). */
  getDegradacion30d(unidadId: string): Promise<PuntoSoH[]>;
  getDegradacionFlota(): Promise<FilaDegradacionFlota[]>;
  getTendenciaSaludFlota(): Promise<PuntoTendenciaFlota[]>;
  getAlertasActivas(): Promise<Alerta[]>;
  getAlertasResueltas(): Promise<AlertaResuelta[]>;
  getTimelineAlerta(alertaId: string): Promise<HitoTimelineAlerta[]>;
  getAlertasPrevias(unidadId: string): Promise<AlertaPrevia[]>;
  getSolicitudMecanico(): Promise<SolicitudMecanico>;
  getHistorialMecanico(): Promise<IntervencionMecanico[]>;
  getEcoScore7d(): Promise<EcoScoreDia[]>;
  getEcoScorePorConductor(): Promise<EcoScoreConductor[]>;
  getIncidenciasPorUnidad(): Promise<IncidenciasUnidad[]>;
  getFallasEvitadas(): Promise<number>;
  getUsuariosSistema(): Promise<UsuarioSistema[]>;
  /** Sesiones de carga recientes (H2). En live: CMS del electroterminal (OCPP) vía adaptador. */
  getSesionesCarga(): Promise<SesionCarga[]>;
  getResumenCargaPorUnidad(): Promise<ResumenCargaUnidad[]>;
  getResumenCargasFlota(): Promise<ResumenCargasFlota>;
}

const demoSource: DataSource = {
  getFleetSummary: async () => demo.fleetSummary,
  getUnidades: async () => demo.unidades,
  getUnidad: async (id) => demo.getUnidad(id),
  getDegradacion30d: async (unidadId) => demo.degradacion30d[unidadId] ?? [],
  getDegradacionFlota: async () => demo.degradacionFlota,
  getTendenciaSaludFlota: async () => demo.tendenciaSaludFlota,
  getAlertasActivas: async () => demo.alertasActivas,
  getAlertasResueltas: async () => demo.alertasResueltas,
  // El demo solo tiene timeline/historial para el caso activo (MIC-104).
  getTimelineAlerta: async (alertaId) =>
    demo.alertasActivas.some(
      (a) => a.id === alertaId && a.estadoUnidad === "critical",
    )
      ? demo.timelineMic104
      : [],
  getAlertasPrevias: async (unidadId) =>
    unidadId.toUpperCase() === "MIC-104" ? demo.alertasPreviasMic104 : [],
  getSolicitudMecanico: async () => demo.solicitudMecanico,
  getHistorialMecanico: async () => demo.historialMecanico,
  getEcoScore7d: async () => demo.ecoScore7d,
  getEcoScorePorConductor: async () => demo.ecoScorePorConductor,
  getIncidenciasPorUnidad: async () => demo.incidenciasPorUnidad,
  getFallasEvitadas: async () => demo.fallasEvitadas,
  getUsuariosSistema: async () => demo.usuariosSistema,
  getSesionesCarga: async () => demo.sesionesCarga,
  getResumenCargaPorUnidad: async () => demo.resumenCargaPorUnidad,
  getResumenCargasFlota: async () => demo.resumenCargasFlota,
};

function noImplementado(metodo: string): never {
  throw new Error(
    `DataSource live: ${metodo} aún no implementado — llega con el backend de Fase 1 (docs/analisis-integracion-la-serena.md §5).`,
  );
}

const liveSource: DataSource = {
  getFleetSummary: async () => noImplementado("getFleetSummary"),
  getUnidades: async () => noImplementado("getUnidades"),
  getUnidad: async () => noImplementado("getUnidad"),
  getDegradacion30d: async () => noImplementado("getDegradacion30d"),
  getDegradacionFlota: async () => noImplementado("getDegradacionFlota"),
  getTendenciaSaludFlota: async () => noImplementado("getTendenciaSaludFlota"),
  getAlertasActivas: async () => noImplementado("getAlertasActivas"),
  getAlertasResueltas: async () => noImplementado("getAlertasResueltas"),
  getTimelineAlerta: async () => noImplementado("getTimelineAlerta"),
  getAlertasPrevias: async () => noImplementado("getAlertasPrevias"),
  getSolicitudMecanico: async () => noImplementado("getSolicitudMecanico"),
  getHistorialMecanico: async () => noImplementado("getHistorialMecanico"),
  getEcoScore7d: async () => noImplementado("getEcoScore7d"),
  getEcoScorePorConductor: async () => noImplementado("getEcoScorePorConductor"),
  getIncidenciasPorUnidad: async () => noImplementado("getIncidenciasPorUnidad"),
  getFallasEvitadas: async () => noImplementado("getFallasEvitadas"),
  getUsuariosSistema: async () => noImplementado("getUsuariosSistema"),
  getSesionesCarga: async () => noImplementado("getSesionesCarga"),
  getResumenCargaPorUnidad: async () => noImplementado("getResumenCargaPorUnidad"),
  getResumenCargasFlota: async () => noImplementado("getResumenCargasFlota"),
};

/** Fuente activa según el flag. Las pantallas deben usar esto (o los atajos). */
export function getDataSource(): DataSource {
  return dataSourceMode() === "live" ? liveSource : demoSource;
}

// ---- Atajos de conveniencia (fuente activa) --------------------------------

export const getFleetSummary = () => getDataSource().getFleetSummary();
export const getUnidades = () => getDataSource().getUnidades();
export const getUnidad = (id: string) => getDataSource().getUnidad(id);
export const getDegradacion30d = (unidadId: string) =>
  getDataSource().getDegradacion30d(unidadId);
export const getDegradacionFlota = () => getDataSource().getDegradacionFlota();
export const getTendenciaSaludFlota = () =>
  getDataSource().getTendenciaSaludFlota();
export const getAlertasActivas = () => getDataSource().getAlertasActivas();
export const getAlertasResueltas = () => getDataSource().getAlertasResueltas();
export const getTimelineAlerta = (alertaId: string) =>
  getDataSource().getTimelineAlerta(alertaId);
export const getAlertasPrevias = (unidadId: string) =>
  getDataSource().getAlertasPrevias(unidadId);
export const getSolicitudMecanico = () => getDataSource().getSolicitudMecanico();
export const getHistorialMecanico = () => getDataSource().getHistorialMecanico();
export const getEcoScore7d = () => getDataSource().getEcoScore7d();
export const getEcoScorePorConductor = () =>
  getDataSource().getEcoScorePorConductor();
export const getIncidenciasPorUnidad = () =>
  getDataSource().getIncidenciasPorUnidad();
export const getFallasEvitadas = () => getDataSource().getFallasEvitadas();
export const getUsuariosSistema = () => getDataSource().getUsuariosSistema();
export const getSesionesCarga = () => getDataSource().getSesionesCarga();
export const getResumenCargaPorUnidad = () =>
  getDataSource().getResumenCargaPorUnidad();
export const getResumenCargasFlota = () =>
  getDataSource().getResumenCargasFlota();
