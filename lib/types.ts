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

/** Hito de la línea de tiempo de una alerta. */
export interface HitoTimelineAlerta {
  label: string;
  hora: string;
  done: boolean;
  active?: boolean;
}

/** Alerta previa en el historial corto de una unidad. */
export interface AlertaPrevia {
  fecha: string;
  tipo: string;
  severidad: Estado;
  resuelto: boolean;
}

export interface AlertaResuelta {
  id: string;
  unidad: string;
  tipo: string;
  severidad: Estado;
  fecha: string;
  resolucion: string;
}

export interface SolicitudMecanico {
  unidad: string;
  conductor: string;
  ubicacion: string;
  tipoFalla: string;
  bateria: number;
  eta: number;
  prioridad: string;
  descripcion: string;
}

export interface IntervencionMecanico {
  unidad: string;
  fecha: string;
  trabajo: string;
  duracion: string;
}

/**
 * Eco-score de un día (histórico semanal del conductor).
 * Type alias (no interface) a propósito: la index signature implícita
 * lo hace asignable al `Row` genérico de los charts.
 */
export type EcoScoreDia = { dia: string; score: number };

/** Eco-score promedio por conductor. Type alias por la misma razón. */
export type EcoScoreConductor = { conductor: string; score: number };

export interface IncidenciasUnidad {
  unidad: string;
  incidencias: number;
  criticas: number;
}

/** Punto semanal de la tendencia de salud de la flota. */
export interface PuntoTendenciaFlota {
  semana: string;
  salud: number;
}

/** Fila del dataset multi-unidad de degradación (`dia` + SoH por unidad). */
export type FilaDegradacionFlota = Record<string, number>;

export interface UsuarioSistema {
  nombre: string;
  rol: string;
  estado: "Activo" | "Inactivo";
}
