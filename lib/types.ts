// ============================================================
// E-Bus Control — Tipos canónicos del dominio.
// Contrato compartido entre el modo demo (lib/data.ts) y el
// futuro modo live (backend Fase 1). Diseño completo en
// docs/analisis-integracion-la-serena.md.
// ============================================================

export type Estado = "healthy" | "normal" | "warning" | "critical" | "offline";

export interface Unidad {
  id: string;
  /**
   * SOC — Estado de Carga actual (%): el "estanque" del día.
   * NO es la salud de la batería (eso es `soh`); nunca fundir
   * ambos conceptos (hallazgo H1 del análisis de integración).
   */
  bateria: number;
  /** SoH — Estado de Salud (%): capacidad restante vs. nominal, largo plazo. */
  soh?: number;
  estado: Estado;
  conductor: string;
  ruta: string;
  ultimaActualizacion: string;
  // Telemetría / caso activo (MIC-104)
  ubicacion?: string;
  tipoFalla?: string;
  /** En telemetría real: celda con tensión mínima y su posición (hallazgo H3). */
  celda?: string;
  mecanico?: string;
  eta?: number;
  voltaje?: number; // V
  temperatura?: number; // °C celda
  ciclos?: number; // ciclos de carga
  velocidad?: number; // km/h
  ecoScore?: number; // 0-100
}

export interface FleetSummary {
  total: number;
  enRecorrido: number;
  conAlerta: number;
  fueraDeServicio: number;
}

/** Punto de una serie de salud de batería (SoH %). */
export interface PuntoSoH {
  dia: number;
  soh: number;
}

export interface Alerta {
  id: string;
  unidad: string;
  conductor: string;
  estadoUnidad: Estado;
  bateria: number;
  titulo: string;
  ubicacion: string;
  tipoFalla: string;
  detectada: string; // hora
  estadoAlerta: "Atención Requerida" | "En atención" | "Notificado";
}
