import Link from "next/link";
import {
  Bus,
  Route,
  TriangleAlert,
  Wrench,
  ChevronRight,
  HeartPulse,
} from "lucide-react";
import { KPICard } from "@/components/ui/KPICard";
import { FleetPulse } from "@/components/dashboard/FleetPulse";
import { OdsImpact } from "@/components/dashboard/OdsImpact";
import { FleetMap } from "@/components/dashboard/FleetMap";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { BatteryBar } from "@/components/ui/BatteryBar";
import { StatusDot } from "@/components/ui/StatusDot";
import {
  getAlertasActivas,
  getFallasEvitadas,
  getFleetSummary,
  getUnidades,
} from "@/lib/api";
import { estadoConfig, estadoDesdeSoH } from "@/lib/constants";

export default async function DashboardPage() {
  const [fleetSummary, unidades, alertasActivas, fallasEvitadas] =
    await Promise.all([
      getFleetSummary(),
      getUnidades(),
      getAlertasActivas(),
      getFallasEvitadas(),
    ]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold">Resumen de Flota</h2>
        <p className="text-sm text-text-muted">
          Monitoreo en tiempo real — La Serena · {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Metáfora "El Corazón del Bus" — pulso de la flota */}
      <FleetPulse fleetSummary={fleetSummary} unidades={unidades} />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          value={fleetSummary.total}
          label="Total Micros"
          icon={<Bus className="size-5" />}
          accent="primary"
          trend={{ dir: "up", value: "+2", good: true }}
          delay={0}
        />
        <KPICard
          value={fleetSummary.enRecorrido}
          label="En Recorrido"
          icon={<Route className="size-5" />}
          accent="healthy"
          trend={{ dir: "up", value: "82%", good: true }}
          delay={0.1}
        />
        <KPICard
          value={fleetSummary.conAlerta}
          label="Con Alerta"
          icon={<TriangleAlert className="size-5" />}
          accent="critical"
          pulse
          delay={0.2}
        />
        <KPICard
          value={fleetSummary.fueraDeServicio}
          label="Fuera de Servicio"
          icon={<Wrench className="size-5" />}
          accent="muted"
          delay={0.3}
        />
      </div>

      {/* Mapa + lista + alertas */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <FleetMap unidades={unidades} enRecorrido={fleetSummary.enRecorrido} />

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h3 className="text-sm font-semibold">Estado de baterías</h3>
              <Link
                href="/flota"
                className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Ver flota completa
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {unidades.map((u) => {
                const c = estadoConfig[u.estado];
                return (
                  <li key={u.id}>
                    <Link
                      href={`/flota/${u.id}`}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2"
                    >
                      <StatusDot estado={u.estado} />
                      <div className="w-20 shrink-0">
                        <span className="text-sm font-semibold">{u.id}</span>
                        <p className="truncate text-[11px] text-text-faint">
                          {u.conductor}
                        </p>
                      </div>
                      <div className="hidden w-16 shrink-0 text-xs text-text-muted sm:block">
                        {u.ruta}
                      </div>
                      <BatteryBar
                        value={u.bateria}
                        estado={u.estado}
                        className="flex-1"
                      />
                      {u.soh != null && (
                        <span
                          className={`tnum hidden w-16 shrink-0 items-center justify-end gap-1 text-xs font-semibold lg:flex ${estadoConfig[estadoDesdeSoH(u.soh)].text}`}
                          title="Salud de la batería (SoH)"
                        >
                          <HeartPulse className="size-3" />
                          {u.soh}%
                        </span>
                      )}
                      <span
                        className={`hidden w-24 shrink-0 text-right text-xs font-medium sm:block ${c.text}`}
                      >
                        {c.label}
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-text-faint" />
                    </Link>
                  </li>
                );
              })}
              <li className="px-4 py-2.5 text-center text-xs text-text-faint">
                y {fleetSummary.total - unidades.length} unidades más en operación
              </li>
            </ul>
          </div>
        </div>

        <AlertFeed alertasActivas={alertasActivas} />
      </div>

      {/* Impacto ODS 3/7/13 conectado a funcionalidades */}
      <OdsImpact fallasEvitadas={fallasEvitadas} />
    </div>
  );
}
