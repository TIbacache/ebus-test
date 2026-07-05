"use client";

import { useState } from "react";
import {
  Battery,
  Gauge,
  Route,
  TriangleAlert,
  BatteryWarning,
  ChevronDown,
  Lightbulb,
  Leaf,
} from "lucide-react";
import { EcgLogo } from "@/components/ui/EcgLogo";
import { EcoScoreGauge } from "@/components/charts/EcoScoreGauge";
import { EcoBarChart } from "@/components/charts/EcoBarChart";
import { getUnidad, ecoScore7d, tipsConduccion, modoConduccion } from "@/lib/data";

const u = getUnidad("MIC-104")!;

function Stat({
  icon: Icon,
  label,
  value,
  unit,
  tone = "text-text",
}: {
  icon: typeof Battery;
  label: string;
  value: string | number;
  unit?: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-4">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`tnum mt-2 text-xl font-bold sm:text-2xl ${tone}`}>
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-text-faint">{unit}</span>}
      </p>
    </div>
  );
}

export default function ConductorPage() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <EcgLogo size={34} />
        <div>
          <h2 className="text-lg font-semibold">Estado de tu unidad</h2>
          <p className="text-sm text-text-muted">
            {u.id} · {u.conductor}
          </p>
        </div>
      </div>

      {/* Alerta de batería en cabina */}
      <div className="card flex items-center gap-3 border-critical/40 bg-critical/5 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-critical/15 text-critical pulse-critical">
          <BatteryWarning className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-critical">
            Batería baja: {u.bateria}% — Requiere atención pronto
          </p>
          <p className="text-xs text-text-muted">
            Reduce la velocidad y dirígete al punto de recarga más cercano.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Estado + feedback */}
        <div className="card p-4 lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Battery} label="Batería" value={u.bateria} unit="%" tone="text-critical" />
            <Stat icon={Gauge} label="Velocidad" value={u.velocidad ?? 0} unit="km/h" />
            <Stat icon={Route} label="Modo" value={modoConduccion} />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-warning">
                Aceleración brusca detectada
              </p>
              <p className="text-xs text-text-muted">
                Esto acelera la degradación de tu batería. Acelera de forma
                progresiva para cuidar las celdas.
              </p>
            </div>
          </div>
        </div>

        {/* Eco-score velocímetro */}
        <div className="card flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-2 self-start text-text-muted">
            <Leaf className="size-4" />
            <span className="text-xs font-medium">Eco-Score en tiempo real</span>
          </div>
          <EcoScoreGauge score={u.ecoScore ?? 0} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Histórico 7 días */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold">Eco-score — últimos 7 días</h3>
          <div className="mt-3 h-52 w-full">
            <EcoBarChart data={[...ecoScore7d]} xKey="dia" yKey="score" />
          </div>
        </div>

        {/* Capacitación */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <Lightbulb className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Capacitación: buenas prácticas</h3>
          </div>
          <ul className="divide-y divide-line">
            {tipsConduccion.map((t, i) => {
              const open = abierto === i;
              return (
                <li key={i}>
                  <button
                    onClick={() => setAbierto(open ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-surface-2"
                  >
                    {t.titulo}
                    <ChevronDown
                      className={`size-4 shrink-0 text-text-faint transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="px-4 pb-3 text-sm text-text-muted">{t.detalle}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
