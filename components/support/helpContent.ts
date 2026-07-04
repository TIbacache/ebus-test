// ============================================================
// E-Bus Control — Contenido del Centro de Soporte (mock, sin backend).
// Reutiliza datos canónicos de lib/data.ts y lib/constants.ts.
// ============================================================

import {
  Activity,
  BarChart3,
  BellRing,
  Bug,
  Bus,
  Compass,
  Download,
  Gauge,
  HelpCircle,
  Info,
  LayoutDashboard,
  Lightbulb,
  LogIn,
  Phone,
  Search,
  Settings,
  SlidersHorizontal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { unidades } from "@/lib/data";

export type SupportSectionId =
  | "error"
  | "sugerencia"
  | "guia"
  | "buscador"
  | "faq"
  | "contacto"
  | "sistema";

// ---- Menú principal del panel ---------------------------------------------

export interface MenuSection {
  id: SupportSectionId;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const menuSections: MenuSection[] = [
  { id: "error", title: "Reportar un Error", desc: "Cuéntanos qué falló", icon: Bug },
  { id: "sugerencia", title: "Enviar Sugerencias", desc: "Ideas para mejorar", icon: Lightbulb },
  { id: "guia", title: "Guía Rápida de Navegación", desc: "Recorre las 9 pantallas", icon: Compass },
  { id: "buscador", title: "Buscador Inteligente", desc: "Encuentra pantallas y acciones", icon: Search },
  { id: "faq", title: "Preguntas Frecuentes", desc: "Respuestas rápidas", icon: HelpCircle },
  { id: "contacto", title: "Número de Contacto", desc: "Habla con Soporte", icon: Phone },
  { id: "sistema", title: "Información del Sistema", desc: "Acerca de E-Bus Control", icon: Info },
];

// ---- Guía rápida de las 9 pantallas ---------------------------------------

export interface GuideStep {
  n: number;
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
}

export const guideSteps: GuideStep[] = [
  {
    n: 1,
    title: "Login / Acceso",
    desc: "Ingreso con rol: Operador, Mecánico, Conductor o Administrador. El pulso de tu flota parte aquí.",
    href: "/login",
    icon: LogIn,
  },
  {
    n: 2,
    title: "Resumen (Dashboard)",
    desc: "KPIs de flota (120 · 98 · 3 · 2), mapa en tiempo real, estado de baterías y últimas alertas.",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    n: 3,
    title: "Flota",
    desc: "Todas las micros con semáforo de batería, filtros por estado y ordenamiento por carga.",
    href: "/flota",
    icon: Bus,
  },
  {
    n: 4,
    title: "Detalle MIC-104",
    desc: "Telemetría en vivo del caso crítico (voltaje, temperatura, ciclos) y botón para asignar mecánico.",
    href: "/flota/MIC-104",
    icon: Activity,
  },
  {
    n: 5,
    title: "Alertas",
    desc: "Centro de alertas activas con timeline y resueltas. MIC-104 al tope, con badge rojo pulsante.",
    href: "/alertas",
    icon: BellRing,
  },
  {
    n: 6,
    title: "Mecánico",
    desc: "Solicitudes de asistencia entrantes. Botón ACEPTAR e inicio de cuenta regresiva de ETA (15 min).",
    href: "/mecanico",
    icon: Wrench,
  },
  {
    n: 7,
    title: "Conductor",
    desc: "Eco-Score en cabina y consejos de conducción para extender la vida útil de la batería.",
    href: "/conductor",
    icon: Gauge,
  },
  {
    n: 8,
    title: "Reportes",
    desc: "Degradación por unidad, eco-score por conductor y tendencia de salud general de la flota.",
    href: "/reportes",
    icon: BarChart3,
  },
  {
    n: 9,
    title: "Configuración",
    desc: "Umbrales de alerta, gestión de usuarios, notificaciones y parámetros de carga inteligente.",
    href: "/configuracion",
    icon: Settings,
  },
];

// ---- Preguntas frecuentes -------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  {
    q: "¿Qué significan los colores del semáforo de batería?",
    a: "Cada micro se pinta según su carga y salud: verde = Saludable, verde-lima = Normal, naranja = Advertencia (bajo ~35%) y rojo = Alerta crítica (bajo ~20%). Los umbrales son configurables en Configuración › Umbrales de alerta.",
  },
  {
    q: "¿Por qué MIC-104 aparece con un badge rojo pulsante?",
    a: "Es el caso crítico activo: 15% de batería y falla de “Tensión de Celda Baja (Crítico)” en Av. Central con San Martín. El pulso rojo replica la metáfora del monitor cardíaco: una “arritmia” de la flota que exige atención inmediata.",
  },
  {
    q: "¿Cómo asigno un mecánico a una unidad en alerta?",
    a: "Entra al detalle de la unidad (Flota › MIC-104) y usa “Asignar mecánico”. El mecánico recibe la solicitud en su panel; al presionar ACEPTAR se inicia la cuenta regresiva de ETA (15 minutos por defecto).",
  },
  {
    q: "¿Cómo cambio los umbrales de alerta crítica y de advertencia?",
    a: "En Configuración › Umbrales de alerta puedes mover los sliders de Crítico y Advertencia. El semáforo de todas las pantallas se recalcula con esos valores.",
  },
  {
    q: "¿Qué es el Eco-Score del conductor?",
    a: "Es un puntaje de 0 a 100 que refleja cuánto acelera el estilo de conducción la degradación de la batería. Conducción suave (aceleración progresiva, frenado regenerativo) = mejor score = más vida útil.",
  },
  {
    q: "¿Con qué Objetivos de Desarrollo Sostenible se compromete E-Bus Control?",
    a: "Con el ODS 3 (Salud y Bienestar: previene accidentes por fallas eléctricas), el ODS 7 (Energía Asequible y No Contaminante: optimiza la recarga) y el ODS 13 (Acción por el Clima: extiende la vida útil de las baterías y reduce residuos electrónicos).",
  },
  {
    q: "¿Qué es la metáfora “El Corazón del Bus”?",
    a: "Es el concepto que guía el sistema: como un monitor cardíaco médico, E-Bus Control vigila el “pulso” (voltaje) de la batería, predice “arritmias” (fallas) y comunica alertas inmediatas al Centro de Control.",
  },
  {
    q: "¿Los datos que veo son reales?",
    a: "Este es un prototipo navegable con datos de demostración (120 micros, unidades MIC-101 a MIC-105). Aún no hay telemetría IoT ni backend conectados; el objetivo es evidenciar los flujos completos de la solución.",
  },
  {
    q: "¿Cómo cambio entre tema claro y oscuro?",
    a: "Con el botón de sol/luna en la barra superior. El tema claro es el predeterminado (inspirado en la infografía del proyecto) y tu preferencia se recuerda en el navegador.",
  },
];

// ---- Índice del buscador inteligente --------------------------------------

export interface SearchEntry {
  label: string;
  hint: string;
  icon: LucideIcon;
  href?: string;
  section?: SupportSectionId;
  keywords?: string[];
}

const screenEntries: SearchEntry[] = [
  { label: "Resumen (Dashboard)", hint: "KPIs, mapa y alertas", icon: LayoutDashboard, href: "/dashboard", keywords: ["dashboard", "kpi", "mapa", "resumen", "inicio"] },
  { label: "Flota", hint: "Todas las micros con semáforo", icon: Bus, href: "/flota", keywords: ["unidades", "micros", "tabla", "semaforo", "bateria"] },
  { label: "Alertas", hint: "Centro de alertas activas", icon: BellRing, href: "/alertas", keywords: ["notificaciones", "critica", "mic-104", "timeline"] },
  { label: "Mecánico", hint: "Solicitudes de asistencia y ETA", icon: Wrench, href: "/mecanico", keywords: ["asistencia", "eta", "taller", "reparacion"] },
  { label: "Conductor", hint: "Eco-Score y tips de cabina", icon: Gauge, href: "/conductor", keywords: ["eco-score", "cabina", "conduccion", "feedback"] },
  { label: "Reportes", hint: "Degradación, eco-score y salud", icon: BarChart3, href: "/reportes", keywords: ["graficos", "degradacion", "exportar", "historico"] },
  { label: "Configuración", hint: "Umbrales, usuarios y carga", icon: Settings, href: "/configuracion", keywords: ["ajustes", "umbrales", "usuarios", "notificaciones"] },
];

const actionEntries: SearchEntry[] = [
  { label: "Asignar mecánico a MIC-104", hint: "Acción · caso crítico activo", icon: Wrench, href: "/flota/MIC-104", keywords: ["asignar", "mecanico", "critico", "asistencia"] },
  { label: "Configurar umbrales de alerta", hint: "Acción · Configuración", icon: SlidersHorizontal, href: "/configuracion", keywords: ["umbral", "critico", "advertencia", "slider"] },
  { label: "Exportar reporte", hint: "Acción · Reportes", icon: Download, href: "/reportes", keywords: ["exportar", "pdf", "csv", "descargar"] },
];

const helpEntries: SearchEntry[] = [
  { label: "Reportar un error", hint: "Soporte · ticket ERR", icon: Bug, section: "error", keywords: ["bug", "falla", "problema", "reportar"] },
  { label: "Enviar una sugerencia", hint: "Soporte · ticket SUG", icon: Lightbulb, section: "sugerencia", keywords: ["idea", "mejora", "sugerencia", "feedback"] },
  { label: "Guía de navegación", hint: "Soporte · recorrido de la app", icon: Compass, section: "guia", keywords: ["guia", "tour", "ayuda", "pantallas"] },
  { label: "Preguntas frecuentes (FAQ)", hint: "Soporte · respuestas rápidas", icon: HelpCircle, section: "faq", keywords: ["faq", "preguntas", "dudas", "ayuda"] },
  { label: "Número de contacto", hint: "Soporte · click-to-call", icon: Phone, section: "contacto", keywords: ["telefono", "llamar", "contacto", "soporte"] },
  { label: "Acerca de la app", hint: "Soporte · información del sistema", icon: Info, section: "sistema", keywords: ["version", "equipo", "acerca", "sistema", "ods"] },
];

const unitEntries: SearchEntry[] = unidades.map((u) => ({
  label: `${u.id} — ${u.conductor}`,
  hint: `Unidad · ${u.ruta} · ${u.bateria}%`,
  icon: Bus,
  href: `/flota/${u.id}`,
  keywords: [u.id, u.conductor, u.ruta, u.estado, "unidad", "micro"],
}));

export const searchIndex: SearchEntry[] = [
  ...screenEntries,
  ...unitEntries,
  ...actionEntries,
  ...helpEntries,
];

/** Puntaje de subsecuencia (fuzzy): premia coincidencias contiguas. */
function subsequenceScore(query: string, target: string): number {
  let qi = 0;
  let streak = 0;
  let score = 0;
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) {
      qi++;
      streak++;
      score += streak;
    } else {
      streak = 0;
    }
  }
  return qi === query.length ? score : -1;
}

/** Búsqueda difusa en cliente sobre label + keywords del índice. */
export function searchHelp(rawQuery: string): SearchEntry[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return [];
  return searchIndex
    .map((entry) => {
      const haystacks = [entry.label, ...(entry.keywords ?? [])].map((s) =>
        s.toLowerCase(),
      );
      let best = -1;
      for (const h of haystacks) {
        const idx = h.indexOf(q);
        if (idx >= 0) best = Math.max(best, 1000 - idx);
        else best = Math.max(best, subsequenceScore(q, h));
      }
      return { entry, best };
    })
    .filter((r) => r.best >= 0)
    .sort((a, b) => b.best - a.best)
    .slice(0, 6)
    .map((r) => r.entry);
}

// ---- Contacto e info del sistema ------------------------------------------

export const contacto = {
  display: "+56 9 6969 6969",
  tel: "+56969696969",
  horario: "Lun a Vie · 08:00 – 20:00",
};

export const systemStack = [
  "Next.js 16 (App Router)",
  "React 19.2 · TypeScript",
  "Tailwind CSS v4",
  "Motion · Recharts · Lucide",
];

export const systemVersion = "Prototipo navegable · v0.1 (demo)";
