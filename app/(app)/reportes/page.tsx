"use client";

import { useState } from "react";
import { Download, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import { FleetDegradationChart } from "@/components/charts/FleetDegradationChart";
import { EcoBarChart } from "@/components/charts/EcoBarChart";
import { FleetTrendChart } from "@/components/charts/FleetTrendChart";
import {
  degradacionFlota,
  ecoScorePorConductor,
  tendenciaSaludFlota,
  incidenciasPorUnidad,
  fallasEvitadas,
} from "@/lib/data";

const periodos = ["Hoy", "Semana", "Mes", "Personalizado"] as const;

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState<(typeof periodos)[number]>("Mes");

  function exportCSV() {
    const rows = [
      ["Unidad", "Incidencias", "Criticas"],
      ...incidenciasPorUnidad.map((r) => [r.unidad, r.incidencias, r.criticas]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte-incidencias-ebus.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Reportes</h2>
          <p className="text-sm text-text-muted">
            Tendencias de degradación, eco-score e incidencias
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Download className="size-4" /> CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            <FileText className="size-4" /> PDF
          </button>
        </div>
      </div>

      {/* Selector de período */}
      <div className="flex flex-wrap items-center gap-2">
        {periodos.map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              periodo === p
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-line bg-surface text-text-muted hover:text-text"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI de eficiencia */}
      <div className="card flex items-center gap-4 border-healthy/30 bg-healthy/5 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-healthy/15 text-healthy">
          <ShieldCheck className="size-6" />
        </span>
        <div>
          <p className="text-sm text-text-muted">
            Ahorro estimado por monitoreo preventivo
          </p>
          <p className="text-lg font-bold">
            {fallasEvitadas} fallas evitadas este mes
          </p>
        </div>
      </div>

      {/* Degradación por unidad */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold">Degradación de batería por unidad</h3>
        <p className="text-xs text-text-faint">Salud (SoH %) — últimos 30 días</p>
        <div className="mt-3 h-72 w-full">
          <FleetDegradationChart data={degradacionFlota} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Eco-score promedio por conductor</h3>
          <p className="text-xs text-text-faint">Últimos 7 días</p>
          <div className="mt-3 h-64 w-full">
            <EcoBarChart
              data={[...ecoScorePorConductor]}
              xKey="conductor"
              yKey="score"
            />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Salud general de la flota</h3>
              <p className="text-xs text-text-faint">Tendencia (sube = mejor)</p>
            </div>
            <TrendingUp className="size-4 text-healthy" />
          </div>
          <div className="mt-3 h-64 w-full">
            <FleetTrendChart data={tendenciaSaludFlota} />
          </div>
        </div>
      </div>

      {/* Incidencias por unidad */}
      <div className="card overflow-hidden">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">Incidencias por unidad</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-text-faint">
                <th className="px-4 py-2.5 font-medium">Unidad</th>
                <th className="px-4 py-2.5 font-medium">Incidencias (mes)</th>
                <th className="px-4 py-2.5 font-medium">Críticas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {incidenciasPorUnidad.map((r) => (
                <tr key={r.unidad} className="transition-colors hover:bg-surface-2">
                  <td className="px-4 py-2.5 font-semibold">{r.unidad}</td>
                  <td className="tnum px-4 py-2.5 text-text-muted">{r.incidencias}</td>
                  <td className="tnum px-4 py-2.5">
                    {r.criticas > 0 ? (
                      <span className="font-semibold text-critical">{r.criticas}</span>
                    ) : (
                      <span className="text-text-faint">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
