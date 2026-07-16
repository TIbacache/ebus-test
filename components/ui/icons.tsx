import {
  LayoutDashboard,
  Bus,
  BatteryCharging,
  BellRing,
  Wrench,
  Gauge,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { NavIcon } from "@/lib/constants";

/** Mapa nombre→componente Lucide para la navegación. */
export const navIcon: Record<NavIcon, LucideIcon> = {
  resumen: LayoutDashboard,
  flota: Bus,
  cargas: BatteryCharging,
  alertas: BellRing,
  mecanico: Wrench,
  conductor: Gauge,
  reportes: BarChart3,
  config: Settings,
};
