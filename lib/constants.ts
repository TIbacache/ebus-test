import type { Estado } from "./data";

/** Umbrales de alerta de batería (configurables en pantalla 9). */
export const umbrales = { critico: 20, advertencia: 35 } as const;

/**
 * Config por estado → etiqueta + clases Tailwind (tokens del design system).
 * Las clases se escriben completas para que el scanner de Tailwind v4 las detecte.
 */
export const estadoConfig: Record<
  Estado,
  { label: string; text: string; bar: string; dot: string; soft: string; border: string }
> = {
  healthy: {
    label: "Saludable",
    text: "text-healthy",
    bar: "bg-healthy",
    dot: "bg-healthy",
    soft: "bg-healthy/10",
    border: "border-healthy/30",
  },
  normal: {
    label: "Normal",
    text: "text-normal",
    bar: "bg-normal",
    dot: "bg-normal",
    soft: "bg-normal/10",
    border: "border-normal/30",
  },
  warning: {
    label: "Advertencia",
    text: "text-warning",
    bar: "bg-warning",
    dot: "bg-warning",
    soft: "bg-warning/10",
    border: "border-warning/30",
  },
  critical: {
    label: "Alerta crítica",
    text: "text-critical",
    bar: "bg-critical",
    dot: "bg-critical",
    soft: "bg-critical/10",
    border: "border-critical/40",
  },
  offline: {
    label: "Fuera de servicio",
    text: "text-text-faint",
    bar: "bg-text-faint",
    dot: "bg-text-faint",
    soft: "bg-text-faint/10",
    border: "border-text-faint/30",
  },
};

/** Deriva estado desde el % de batería (para barras genéricas). */
export function estadoDesdeBateria(pct: number): Estado {
  if (pct < umbrales.critico) return "critical";
  if (pct < umbrales.advertencia) return "warning";
  if (pct < 65) return "normal";
  return "healthy";
}

/** Umbral de fin de vida útil de un pack de tracción (EOL industria: 70–80%). */
export const umbralEolSoH = 70;

/**
 * Semáforo de SALUD (SoH) — deliberadamente distinto del semáforo de carga:
 * 15% de carga al final del turno es normal; 66% de salud es zona de reemplazo.
 */
export function estadoDesdeSoH(soh: number): Estado {
  if (soh < 55) return "critical";
  if (soh < umbralEolSoH) return "warning";
  if (soh < 85) return "normal";
  return "healthy";
}

export type NavIcon =
  | "resumen"
  | "flota"
  | "cargas"
  | "alertas"
  | "mecanico"
  | "conductor"
  | "reportes"
  | "config";

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
  badge?: number;
}

/** Navegación principal (sidebar). */
export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Resumen", icon: "resumen" },
  { href: "/flota", label: "Flota", icon: "flota" },
  { href: "/cargas", label: "Cargas", icon: "cargas" },
  { href: "/alertas", label: "Alertas", icon: "alertas", badge: 3 },
  { href: "/mecanico", label: "Mecánico", icon: "mecanico" },
  { href: "/conductor", label: "Conductor", icon: "conductor" },
  { href: "/reportes", label: "Reportes", icon: "reportes" },
  { href: "/configuracion", label: "Configuración", icon: "config" },
];

/** Bottom navigation (mobile): 5 ítems principales (Cargas entra; Conductor queda vía Soporte/links). */
export const mobileNavIcons: NavIcon[] = [
  "resumen",
  "flota",
  "cargas",
  "alertas",
  "mecanico",
];

/** Roles de acceso (login). */
export const roles = ["Operador", "Mecánico", "Conductor", "Administrador"] as const;

/** ODS vinculados (colores oficiales ONU) + funcionalidad de la app que los concreta. */
export const ods = [
  {
    num: 3,
    nombre: "Salud y Bienestar",
    detalle: "Previene accidentes por fallas eléctricas; protege a pasajeros y conductores.",
    color: "#4C9F38",
    accion: "Ver alertas en tiempo real",
    href: "/alertas",
  },
  {
    num: 7,
    nombre: "Energía Asequible y No Contaminante",
    detalle: "Optimiza momentos y método de recarga; reduce consumo innecesario.",
    color: "#FCC30B",
    accion: "Ajustar carga inteligente",
    href: "/configuracion",
  },
  {
    num: 13,
    nombre: "Acción por el Clima",
    detalle: "Extiende la vida útil de baterías; reduce residuos electrónicos.",
    color: "#3F7E44",
    accion: "Ver salud y degradación",
    href: "/reportes",
  },
];

export const equipo = [
  "Rafael Orrego",
  "Benjamín Araya",
  "Fernando Sermeño",
  "Tomás Ibacache",
  "Dilan Cortés",
];

export const institucion = "INACAP La Serena";
export const tagline = "El pulso de tu flota, en tiempo real";
