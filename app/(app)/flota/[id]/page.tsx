import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Zap,
  Thermometer,
  Activity,
  MapPin,
  Gauge,
  TriangleAlert,
} from "lucide-react";
import {
  getUnidad,
  degradacion30d,
  alertasPreviasMic104,
  type Estado,
} from "@/lib/data";
import { estadoConfig } from "@/lib/constants";
import { AlertBadge } from "@/components/ui/AlertBadge";
import { StatusDot } from "@/components/ui/StatusDot";
import { DegradationChart } from "@/components/charts/DegradationChart";
import { AssignMechanicButton } from "@/components/flota/AssignMechanicButton";

const tokenColor: Record<Estado, string> = {
  healthy: "#22C55E",
  normal: "#84CC16",
  warning: "#FF8C00",
  critical: "#FF4444",
  offline: "#475569",
};

function Stat({
  label,
  value,
  unit,
  icon: Icon,
  tone = "text-text",
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: typeof Battery;
  tone?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-text-muted">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`tnum mt-2 text-2xl font-bold ${tone}`}>
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-text-faint">{unit}</span>}
      </p>
    </div>
  );
}

export default async function DetalleUnidadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = getUnidad(id);
  if (!u) notFound();

  const c = estadoConfig[u.estado];
  const serie = degradacion30d[u.id] ?? [];
  const esCritico = u.estado === "critical";

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/flota"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <ArrowLeft className="size-4" /> Volver a la flota
      </Link>

      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{u.id}</h2>
            {esCritico ? (
              <AlertBadge estado="critical" label="ALERTA CRÍTICA" />
            ) : (
              <span className={`flex items-center gap-1.5 text-sm font-medium ${c.text}`}>
                <StatusDot estado={u.estado} pulse={false} />
                {c.label}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-text-muted">
            {u.conductor} · {u.ruta}
          </p>
        </div>
        {esCritico && u.mecanico && u.eta != null && (
          <AssignMechanicButton unidad={u.id} mecanico={u.mecanico} eta={u.eta} />
        )}
      </div>

      {/* Banner de falla crítica */}
      {esCritico && (
        <div className="card animate-slide-in border-critical/40 bg-critical/5 p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-critical/15 text-critical pulse-critical">
              <TriangleAlert className="size-5" />
            </span>
            <div className="grid flex-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              <Info label="Tipo de falla" value={u.tipoFalla ?? "—"} strong />
              <Info label="Celda afectada" value={u.celda ?? "—"} />
              <Info label="Ubicación GPS" value={u.ubicacion ?? "—"} />
              <Info
                label="Mecánico asignado"
                value={`${u.mecanico} · ETA ${u.eta} min`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Telemetría */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Batería"
          value={u.bateria}
          unit="%"
          icon={Battery}
          tone={c.text}
        />
        <Stat label="Voltaje" value={u.voltaje ?? "—"} unit="V" icon={Zap} />
        <Stat
          label="Temp. celda"
          value={u.temperatura ?? "—"}
          unit="°C"
          icon={Thermometer}
          tone={u.temperatura && u.temperatura > 42 ? "text-warning" : "text-text"}
        />
        <Stat label="Ciclos de carga" value={u.ciclos ?? "—"} icon={Activity} />
      </div>

      {/* Gráfico + ubicación */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Degradación de batería</h3>
              <p className="text-xs text-text-faint">Salud (SoH) — últimos 30 días</p>
            </div>
            <Activity className="size-4 text-text-faint" />
          </div>
          <div className="h-64 w-full">
            <DegradationChart data={serie} color={tokenColor[u.estado]} />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-line px-4 py-3">
            <h3 className="text-sm font-semibold">Ubicación actual</h3>
          </div>
          <div className="street-grid relative h-44 w-full">
            <div className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 bg-white/[0.03]" />
            <div className="absolute inset-y-0 left-1/2 w-2.5 bg-white/[0.03]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span
                className={`grid size-7 place-items-center rounded-full ${c.soft} ${c.text} ${
                  esCritico ? "pulse-critical ring-2 ring-critical/50" : ""
                }`}
              >
                <MapPin className="size-4" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 text-sm">
            <MapPin className="size-4 shrink-0 text-text-faint" />
            <span className="text-text-muted">
              {u.ubicacion ?? `${u.ruta} — La Serena`}
            </span>
          </div>
        </div>
      </div>

      {/* Eco-score + historial */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Gauge className="size-4" />
            <span className="text-xs font-medium">Eco-score del conductor</span>
          </div>
          <p className="tnum mt-2 text-3xl font-bold">
            {u.ecoScore ?? "—"}
            <span className="text-base font-medium text-text-faint">/100</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-offset">
            <div
              className="h-full rounded-full"
              style={{
                width: `${u.ecoScore ?? 0}%`,
                backgroundColor:
                  (u.ecoScore ?? 0) >= 75
                    ? "#22C55E"
                    : (u.ecoScore ?? 0) >= 55
                      ? "#FF8C00"
                      : "#FF4444",
              }}
            />
          </div>
          <p className="mt-2 text-xs text-text-faint">
            {(u.ecoScore ?? 0) >= 75
              ? "Conducción eficiente"
              : (u.ecoScore ?? 0) >= 55
                ? "Conducción moderada"
                : "Desgaste acelerado de batería"}
          </p>
        </div>

        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-line px-4 py-3">
            <h3 className="text-sm font-semibold">Historial de alertas previas</h3>
          </div>
          {esCritico ? (
            <ul className="divide-y divide-line">
              {alertasPreviasMic104.map((a, i) => {
                const ec = estadoConfig[a.severidad];
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 text-sm"
                  >
                    <StatusDot estado={a.severidad} pulse={false} />
                    <span className="w-14 shrink-0 text-xs text-text-faint">
                      {a.fecha}
                    </span>
                    <span className="flex-1 text-text-muted">{a.tipo}</span>
                    <span className={`text-xs font-medium ${ec.text}`}>
                      {ec.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-text-faint">
              Sin alertas registradas para esta unidad.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-text-faint">
        {label}
      </p>
      <p className={`text-sm ${strong ? "font-semibold text-critical" : "text-text"}`}>
        {value}
      </p>
    </div>
  );
}
