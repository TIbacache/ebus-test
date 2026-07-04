"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { HeartPulse, Activity, TriangleAlert } from "lucide-react";
import { fleetSummary, unidades } from "@/lib/data";

// Trace ECG de 4 latidos (baseline y=24). Se estira a lo ancho del banner.
const ECG_PATH =
  "M0 24 H30 l4 -14 l6 26 l5 -18 l4 6 H90 l4 -14 l6 26 l5 -18 l4 6 H150 l4 -14 l6 26 l5 -18 l4 6 H210 l4 -14 l6 26 l5 -18 l4 6 H240";

export function FleetPulse() {
  const reduce = useReducedMotion();
  const critica = unidades.find((u) => u.estado === "critical");
  const [bpm, setBpm] = useState(72);

  // Latido "vivo": leve fluctuación del pulso tras montar (hidratación-safe).
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setBpm(70 + Math.floor(Math.random() * 6));
    }, 1800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6">
        {/* Metáfora */}
        <div className="shrink-0 md:w-2/5">
          <div className="flex items-center gap-2.5">
            <motion.span
              className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"
              animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <HeartPulse className="size-5" />
            </motion.span>
            <div>
              <h3 className="text-sm font-semibold">El Corazón de la Flota</h3>
              <p className="text-[11px] text-text-faint">
                Pulso de batería en tiempo real
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Como un monitor cardíaco, vigilamos el{" "}
            <span className="font-semibold text-text">pulso</span> (voltaje) de
            cada batería, predecimos{" "}
            <span className="font-semibold text-text">arritmias</span> (fallas) y
            alertamos al instante al Centro de Control.
          </p>
        </div>

        {/* Monitor ECG */}
        <div className="min-w-0 flex-1">
          <div className="relative h-16 w-full overflow-hidden rounded-lg bg-surface-2/50">
            <svg
              className="absolute inset-0 h-full w-full text-primary"
              viewBox="0 0 240 48"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Traza base (histórico tenue) */}
              <path
                d={ECG_PATH}
                stroke="currentColor"
                strokeOpacity="0.28"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Pulso que fluye */}
              <path
                d={ECG_PATH}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="ecg-line"
              />
            </svg>

            {/* Lectura BPM */}
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-baseline gap-1 rounded-md bg-surface/70 px-2 py-1 backdrop-blur-sm">
              <Activity className="size-3.5 self-center text-primary" />
              <span className="tnum text-lg font-bold leading-none">{bpm}</span>
              <span className="text-[10px] font-medium text-text-faint">lpm</span>
            </div>
          </div>

          {/* Estado del pulso */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-healthy/10 px-2.5 py-1 text-xs font-medium text-healthy">
              <span className="size-1.5 rounded-full bg-healthy" />
              {fleetSummary.enRecorrido} en recorrido · latido estable
            </span>
            {critica && (
              <Link
                href={`/flota/${critica.id}`}
                className="pulse-critical inline-flex items-center gap-1.5 rounded-full bg-critical/10 px-2.5 py-1 text-xs font-semibold text-critical transition-colors hover:bg-critical/15"
              >
                <TriangleAlert className="size-3.5" />
                {critica.id} · arritmia crítica
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
