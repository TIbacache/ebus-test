"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TriangleAlert,
  Check,
  ChevronsUp,
  MapPin,
  User,
  Wrench,
  Clock,
  CircleCheckBig,
} from "lucide-react";
import type { Alerta, AlertaResuelta, HitoTimelineAlerta } from "@/lib/types";
import { estadoConfig } from "@/lib/constants";
import { AlertBadge } from "@/components/ui/AlertBadge";

export function AlertasView({
  alertasIniciales,
  alertasResueltas,
  timeline,
}: {
  alertasIniciales: Alerta[];
  alertasResueltas: AlertaResuelta[];
  timeline: HitoTimelineAlerta[];
}) {
  const [activas, setActivas] = useState<Alerta[]>(alertasIniciales);
  const [escalada, setEscalada] = useState<string | null>(null);

  function resolver(id: string) {
    setActivas((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Centro de Alertas</h2>
          <p className="text-sm text-text-muted">
            {activas.length} alertas activas · ordenadas por criticidad
          </p>
        </div>
      </div>

      {/* Alertas activas */}
      <div className="flex flex-col gap-4">
        {activas.length === 0 && (
          <div className="card flex items-center gap-3 p-6 text-sm text-text-muted">
            <CircleCheckBig className="size-5 text-healthy" />
            No hay alertas activas. Toda la flota operando con normalidad.
          </div>
        )}

        {activas.map((a, idx) => {
          const c = estadoConfig[a.estadoUnidad];
          const principal = a.estadoUnidad === "critical";
          return (
            <div
              key={a.id}
              className={`card animate-slide-in overflow-hidden ${
                principal ? "border-critical/40" : ""
              }`}
              style={{ animationDelay: `${idx * 70}ms` }}
            >
              <div
                className={`flex items-start gap-3 p-4 ${
                  principal ? "bg-critical/5" : ""
                }`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-lg ${c.soft} ${c.text} ${
                    principal ? "pulse-critical" : ""
                  }`}
                >
                  <TriangleAlert className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold">{a.unidad}</span>
                    {principal ? (
                      <AlertBadge estado="critical" label="ALERTA CRÍTICA" />
                    ) : (
                      <span className={`text-xs font-medium ${c.text}`}>
                        {c.label}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-text-faint">
                      Detectada {a.detectada}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{a.titulo}</p>
                </div>
              </div>

              {/* Detalle expandido para la alerta crítica */}
              {principal && (
                <div className="border-t border-line p-4">
                  <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Campo icon={User} label="Conductor" value={a.conductor} />
                    <Campo icon={MapPin} label="Ubicación GPS" value={a.ubicacion} />
                    <Campo
                      icon={TriangleAlert}
                      label="Tipo de fallo"
                      value={a.tipoFalla}
                    />
                    <Campo icon={TriangleAlert} label="Celda afectada" value="Celda 7 — Módulo B" />
                    <Campo icon={Clock} label="Estado" value={a.estadoAlerta} />
                    <Campo icon={Wrench} label="Mecánico" value="Juan Silva · ETA 15 min" />
                  </div>

                  {/* Timeline */}
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-faint">
                      Línea de tiempo
                    </p>
                    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
                      {timeline.map((t, i) => (
                        <li
                          key={i}
                          className="relative flex flex-1 items-start gap-3 pb-4 sm:flex-col sm:pb-0"
                        >
                          <div className="flex flex-col items-center sm:w-full sm:flex-row">
                            <span
                              className={`z-10 grid size-6 shrink-0 place-items-center rounded-full text-[10px] ${
                                t.done
                                  ? "bg-primary text-bg"
                                  : "border border-line bg-surface text-text-faint"
                              } ${"active" in t && t.active ? "pulse-critical" : ""}`}
                            >
                              {t.done ? <Check className="size-3.5" /> : i + 1}
                            </span>
                            {i < timeline.length - 1 && (
                              <span
                                className={`hidden h-0.5 flex-1 sm:block ${
                                  t.done ? "bg-primary" : "bg-line"
                                }`}
                              />
                            )}
                          </div>
                          <div className="sm:mt-2">
                            <p className="text-xs font-medium">{t.label}</p>
                            <p className="text-[11px] text-text-faint">{t.hora}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
                {escalada === a.id ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-warning">
                    <ChevronsUp className="size-4" /> Alerta escalada a supervisión
                  </span>
                ) : (
                  <button
                    onClick={() => setEscalada(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text"
                  >
                    <ChevronsUp className="size-3.5" /> Escalar
                  </button>
                )}
                <button
                  onClick={() => resolver(a.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-healthy/30 bg-healthy/10 px-3 py-1.5 text-xs font-medium text-healthy transition-colors hover:bg-healthy/20"
                >
                  <Check className="size-3.5" /> Resolver
                </button>
                <Link
                  href={`/flota/${a.unidad}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <MapPin className="size-3.5" /> Ver en mapa
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historial resueltas */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold">Alertas resueltas</h3>
          <span className="text-xs text-text-faint">últimas 10</span>
        </div>
        <ul className="divide-y divide-line">
          {alertasResueltas.map((a) => {
            const c = estadoConfig[a.severidad];
            return (
              <li
                key={a.id}
                className="flex items-center gap-3 px-4 py-2.5 text-sm"
              >
                <CircleCheckBig className="size-4 shrink-0 text-healthy" />
                <span className="w-20 shrink-0 font-medium">{a.unidad}</span>
                <span className="flex-1 truncate text-text-muted">{a.tipo}</span>
                <span className={`hidden text-xs sm:block ${c.text}`}>
                  {c.label}
                </span>
                <span className="hidden w-28 shrink-0 text-right text-xs text-text-faint md:block">
                  {a.resolucion}
                </span>
                <span className="w-16 shrink-0 text-right text-xs text-text-faint">
                  {a.fecha}
                </span>
              </li>
            );
          })}
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
  icon: typeof MapPin;
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
