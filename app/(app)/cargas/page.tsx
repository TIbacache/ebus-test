import Link from "next/link";
import {
  ArrowUpRight,
  FlaskConical,
  Moon,
  PlugZap,
  Thermometer,
  Zap,
} from "lucide-react";
import { KPICard } from "@/components/ui/KPICard";
import {
  getResumenCargaPorUnidad,
  getResumenCargasFlota,
  getSesionesCarga,
} from "@/lib/api";
import { estadoConfig } from "@/lib/constants";
import type { Estado } from "@/lib/types";

/** Semáforo del estrés de carga (modelo v0 demo): <35 bajo · 35–59 medio · ≥60 alto. */
function estadoEstres(estres: number): Estado {
  return estres >= 60 ? "critical" : estres >= 35 ? "warning" : "healthy";
}

const labelEstres: Partial<Record<Estado, string>> = {
  healthy: "Bajo",
  warning: "Medio",
  critical: "Alto",
};

function EstresBadge({ estres }: { estres: number }) {
  const estado = estadoEstres(estres);
  const c = estadoConfig[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${c.soft} ${c.text}`}
    >
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      <span className="tnum">{estres}</span>
      {labelEstres[estado]}
    </span>
  );
}

/** Color del % en ventana óptima: alto = bueno. */
function toneVentana(pct: number) {
  return pct >= 90 ? "text-healthy" : pct >= 60 ? "text-warning" : "text-critical";
}

export default async function CargasPage() {
  const [sesiones, resumenUnidades, flota] = await Promise.all([
    getSesionesCarga(),
    getResumenCargaPorUnidad(),
    getResumenCargasFlota(),
  ]);
  const sesionesRestantes = flota.sesionesAnoche * 7 - sesiones.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cargas</h2>
          <p className="text-sm text-text-muted">
            Sesiones de carga — Electroterminal El Sauce
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <FlaskConical className="size-3.5" />
          Modelo v0 · datos simulados
        </span>
      </div>

      {/* KPIs de anoche */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          value={flota.sesionesAnoche}
          label="Sesiones anoche"
          icon={<PlugZap className="size-5" />}
          accent="primary"
          delay={0}
        />
        <KPICard
          value={flota.kwhAnoche}
          label="Energía entregada anoche"
          suffix=" kWh"
          icon={<Zap className="size-5" />}
          accent="muted"
          delay={0.1}
        />
        <KPICard
          value={flota.pctVentanaOptima}
          label="En ventana óptima (23:00–06:00)"
          suffix="%"
          icon={<Moon className="size-5" />}
          accent="healthy"
          trend={{ dir: "up", value: "+4%", good: true }}
          delay={0.2}
        />
        <KPICard
          value={flota.estresPromedio}
          label="Estrés de carga promedio"
          suffix="/100"
          icon={<Thermometer className="size-5" />}
          accent="warning"
          delay={0.3}
        />
      </div>

      {/* Insight del caso activo */}
      <div className="card flex flex-col gap-3 border-warning/30 bg-warning/5 p-4 sm:flex-row sm:items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
          <PlugZap className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-warning">
            MIC-104 concentra las 3 sesiones de mayor estrés de la semana
          </p>
          <p className="text-xs text-text-muted">
            Cargas rápidas de mediodía con celda caliente (36–39°C) y ciclos
            profundos 8%→100%. Patrón consistente con su degradación acelerada.
          </p>
        </div>
        <Link
          href="/flota/MIC-104"
          className="inline-flex w-fit shrink-0 items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Ver unidad <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Sesiones recientes */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">Sesiones recientes</h3>
          <span className="text-xs text-text-faint">
            estrés de carga = proxy del costo de degradación (modelo v0)
          </span>
        </div>
        <div className="overflow-x-auto scroll-x-shadow">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-text-faint">
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">SOC</th>
                <th className="px-4 py-3 font-medium">Energía</th>
                <th className="px-4 py-3 font-medium">P. máx</th>
                <th className="px-4 py-3 font-medium">T° inicio</th>
                <th className="px-4 py-3 font-medium">Ventana</th>
                <th className="px-4 py-3 font-medium">Estrés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sesiones.map((s) => {
                const fueraVentana = s.ventana === "fuera";
                return (
                  <tr
                    key={s.id}
                    className={`transition-colors hover:bg-surface-2 ${
                      s.estres >= 60 ? "bg-critical/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/flota/${s.unidad}`}
                        className="font-semibold transition-colors hover:text-primary"
                      >
                        {s.unidad}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{s.fecha}</td>
                    <td className="px-4 py-3">
                      <span className="tnum">
                        {s.inicio}–{s.fin}
                      </span>
                      <p className="text-[11px] text-text-faint">
                        {s.duracionMin} min
                      </p>
                    </td>
                    <td className="tnum px-4 py-3 text-text-muted">
                      {s.socInicial}% → {s.socFinal}%
                    </td>
                    <td className="tnum px-4 py-3">{s.kwh} kWh</td>
                    <td className="tnum px-4 py-3 text-text-muted">
                      {s.potenciaMaxKw} kW
                    </td>
                    <td
                      className={`tnum px-4 py-3 ${
                        s.tempInicio > 35 ? "font-semibold text-warning" : "text-text-muted"
                      }`}
                    >
                      {s.tempInicio}°C
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          fueraVentana ? "text-warning" : "text-healthy"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            fueraVentana ? "bg-warning" : "bg-healthy"
                          }`}
                        />
                        {fueraVentana ? "Fuera" : "Óptima"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <EstresBadge estres={s.estres} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line px-4 py-2.5 text-center text-xs text-text-faint">
          y {sesionesRestantes.toLocaleString("es-CL")} sesiones más esta semana
          en El Sauce
        </div>
      </div>

      {/* Resumen por unidad */}
      <div className="card overflow-hidden">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">
            Resumen por unidad — últimos 30 días
          </h3>
        </div>
        <div className="overflow-x-auto scroll-x-shadow">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-text-faint">
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Sesiones</th>
                <th className="px-4 py-3 font-medium">Energía</th>
                <th className="px-4 py-3 font-medium">Ventana óptima</th>
                <th className="px-4 py-3 font-medium">Estrés promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {resumenUnidades.map((r) => (
                <tr
                  key={r.unidad}
                  className={`transition-colors hover:bg-surface-2 ${
                    r.estresPromedio >= 60 ? "bg-critical/5" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/flota/${r.unidad}`}
                      className="font-semibold transition-colors hover:text-primary"
                    >
                      {r.unidad}
                    </Link>
                  </td>
                  <td className="tnum px-4 py-3 text-text-muted">
                    {r.sesiones30d}
                  </td>
                  <td className="tnum px-4 py-3">
                    {r.kwh30d.toLocaleString("es-CL")} kWh
                  </td>
                  <td className={`tnum px-4 py-3 font-semibold ${toneVentana(r.pctVentanaOptima)}`}>
                    {r.pctVentanaOptima}%
                  </td>
                  <td className="px-4 py-3">
                    <EstresBadge estres={r.estresPromedio} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-text-faint">
        La ventana óptima de carga (23:00–06:00) se define en{" "}
        <Link
          href="/configuracion"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Configuración › Carga inteligente
        </Link>
        .
      </p>
    </div>
  );
}
