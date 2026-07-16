// ============================================================
// E-Bus Control — Capa de acceso a datos (repositorio).
// Las pantallas consumen estas funciones, nunca la fuente
// directa. Modo "demo" (default): mock de lib/data.ts. Modo
// "live": backend real de Fase 1 (Supabase + adaptadores
// Tracktec/Dhemax — ver docs/analisis-integracion-la-serena.md §4).
//
// Flag: NEXT_PUBLIC_DATA_SOURCE = "demo" | "live".
// Contenido puramente presentacional (tips, timeline del caso
// demo, colores) sigue viviendo en lib/data.ts hasta que Fase 1
// le defina fuente real.
// ============================================================

import * as demo from "./data";
import type { Alerta, FleetSummary, PuntoSoH, Unidad } from "./types";

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
  getDegradacionFlota(): Promise<typeof demo.degradacionFlota>;
  getTendenciaSaludFlota(): Promise<typeof demo.tendenciaSaludFlota>;
  getAlertasActivas(): Promise<Alerta[]>;
  getAlertasResueltas(): Promise<typeof demo.alertasResueltas>;
  getSolicitudMecanico(): Promise<typeof demo.solicitudMecanico>;
  getHistorialMecanico(): Promise<typeof demo.historialMecanico>;
  getEcoScore7d(): Promise<typeof demo.ecoScore7d>;
  getEcoScorePorConductor(): Promise<typeof demo.ecoScorePorConductor>;
  getIncidenciasPorUnidad(): Promise<typeof demo.incidenciasPorUnidad>;
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
  getSolicitudMecanico: async () => demo.solicitudMecanico,
  getHistorialMecanico: async () => demo.historialMecanico,
  getEcoScore7d: async () => demo.ecoScore7d,
  getEcoScorePorConductor: async () => demo.ecoScorePorConductor,
  getIncidenciasPorUnidad: async () => demo.incidenciasPorUnidad,
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
  getSolicitudMecanico: async () => noImplementado("getSolicitudMecanico"),
  getHistorialMecanico: async () => noImplementado("getHistorialMecanico"),
  getEcoScore7d: async () => noImplementado("getEcoScore7d"),
  getEcoScorePorConductor: async () => noImplementado("getEcoScorePorConductor"),
  getIncidenciasPorUnidad: async () => noImplementado("getIncidenciasPorUnidad"),
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
export const getSolicitudMecanico = () => getDataSource().getSolicitudMecanico();
export const getHistorialMecanico = () => getDataSource().getHistorialMecanico();
export const getEcoScore7d = () => getDataSource().getEcoScore7d();
export const getEcoScorePorConductor = () =>
  getDataSource().getEcoScorePorConductor();
export const getIncidenciasPorUnidad = () =>
  getDataSource().getIncidenciasPorUnidad();
