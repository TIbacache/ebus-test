"use client";

import { useEffect, useState } from "react";
import {
  Wrench,
  User,
  MapPin,
  TriangleAlert,
  Clock,
  Check,
  BatteryWarning,
  CircleCheckBig,
} from "lucide-react";
import { solicitudMecanico, historialMecanico } from "@/lib/data";
import { AlertBadge } from "@/components/ui/AlertBadge";

function fmt(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MecanicoPage() {
  const s = solicitudMecanico;
  const [aceptada, setAceptada] = useState(false);
  const [segundos, setSegundos] = useState(s.eta * 60);

  useEffect(() => {
    if (!aceptada) return;
    const t = setInterval(
      () => setSegundos((v) => (v > 0 ? v - 1 : 0)),
      1000,
    );
    return () => clearInterval(t);
  }, [aceptada]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold">Panel del Mecánico</h2>
        <p className="text-sm text-text-muted">
          Solicitudes de asistencia entrantes
        </p>
      </div>

      {/* Solicitud destacada */}
      <div className="card animate-slide-in overflow-hidden border-critical/40">
        <div className="flex items-center gap-3 border-b border-line bg-critical/5 px-4 py-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-critical/15 text-critical pulse-critical">
            <BatteryWarning className="size-5" />
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold">Nueva Asistencia</h3>
              <AlertBadge estado="critical" label={`${s.unidad}`} icon={false} />
            </div>
            <p className="text-sm text-text-muted">
              Fallo en batería · prioridad {s.prioridad}
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <Campo icon={Wrench} label="Unidad" value={s.unidad} />
            <Campo icon={User} label="Conductor" value={s.conductor} />
            <Campo icon={MapPin} label="Ubicación" value={s.ubicacion} />
            <Campo icon={TriangleAlert} label="Tipo de falla" value={s.tipoFalla} />
          </div>
          <p className="mt-4 rounded-lg border border-line bg-surface p-3 text-sm text-text-muted">
            {s.descripcion}
          </p>

          {!aceptada ? (
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Clock className="size-4 text-text-faint" />
                Llegada estimada en{" "}
                <span className="font-semibold text-text">{s.eta} minutos</span>
              </span>
              <button
                onClick={() => setAceptada(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-success px-6 py-3 text-base font-bold text-bg transition-transform hover:-translate-y-0.5 hover:bg-healthy sm:w-auto"
              >
                <Check className="size-5" />
                ACEPTAR
              </button>
            </div>
          ) : (
            <div className="mt-5 flex flex-col items-center gap-3 rounded-lg border border-healthy/30 bg-healthy/10 p-4 text-center animate-slide-in">
              <span className="grid size-12 place-items-center rounded-full bg-healthy/20 text-healthy">
                <Check className="size-6" />
              </span>
              <p className="text-lg font-bold text-healthy">¡En camino!</p>
              <p className="text-sm text-text-muted">
                Confirmaste la asistencia a {s.unidad}. El conductor fue notificado.
              </p>
              <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2">
                <Clock className="size-4 text-primary" />
                <span className="tnum text-xl font-bold text-primary">
                  {fmt(segundos)}
                </span>
                <span className="text-xs text-text-faint">ETA restante</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="card overflow-hidden">
        <div className="border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">Intervenciones completadas</h3>
        </div>
        <ul className="divide-y divide-line">
          {historialMecanico.map((h, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
              <CircleCheckBig className="size-4 shrink-0 text-healthy" />
              <span className="w-20 shrink-0 font-semibold">{h.unidad}</span>
              <span className="flex-1 text-text-muted">{h.trabajo}</span>
              <span className="hidden w-24 text-right text-xs text-text-faint sm:block">
                {h.duracion}
              </span>
              <span className="w-20 shrink-0 text-right text-xs text-text-faint">
                {h.fecha}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Campo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wrench;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-text-faint" />
      <div>
        <p className="text-[11px] uppercase tracking-wide text-text-faint">
          {label}
        </p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
