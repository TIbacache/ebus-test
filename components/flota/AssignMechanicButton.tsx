"use client";

import { useState } from "react";
import { Wrench, X, Check, Clock } from "lucide-react";

export function AssignMechanicButton({
  unidad,
  mecanico,
  eta,
}: {
  unidad: string;
  mecanico: string;
  eta: number;
}) {
  const [open, setOpen] = useState(false);
  const [assigned, setAssigned] = useState(false);

  function close() {
    setOpen(false);
    // reset al cerrar para poder volver a demostrar el flujo
    setTimeout(() => setAssigned(false), 200);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary-hover"
      >
        <Wrench className="size-4" />
        Asignar mecánico
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button
            aria-label="Cerrar"
            onClick={close}
            className="absolute inset-0 bg-black/60"
          />
          <div className="glass animate-slide-in relative w-full max-w-md rounded-xl border border-line p-6 shadow-2xl">
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              <X className="size-4" />
            </button>

            {!assigned ? (
              <>
                <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">Asignar mecánico</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Se enviará una solicitud de asistencia para la unidad{" "}
                  <span className="font-semibold text-text">{unidad}</span>.
                </p>
                <div className="mt-4 rounded-lg border border-line bg-surface p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Mecánico sugerido</span>
                    <span className="font-semibold">{mecanico}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-text-muted">ETA estimado</span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <Clock className="size-3.5" /> {eta} min
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setAssigned(true)}
                  className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-primary-hover"
                >
                  Confirmar asignación
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <span className="grid size-14 place-items-center rounded-full bg-healthy/15 text-healthy">
                  <Check className="size-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">¡Mecánico en camino!</h3>
                <p className="mt-1 text-sm text-text-muted">
                  <span className="font-semibold text-text">{mecanico}</span> fue
                  asignado a {unidad}.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                  <Clock className="size-4" /> ETA: {eta} minutos
                </p>
                <button
                  onClick={close}
                  className="mt-5 w-full rounded-lg border border-line bg-surface py-2.5 text-sm font-semibold transition-colors hover:bg-surface-2"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
