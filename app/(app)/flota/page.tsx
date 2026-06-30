"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, ArrowDownUp } from "lucide-react";
import { unidades, unidadesExtra, type Estado } from "@/lib/data";
import { estadoConfig } from "@/lib/constants";
import { StatusDot } from "@/components/ui/StatusDot";
import { BatteryBar } from "@/components/ui/BatteryBar";
import { AlertBadge } from "@/components/ui/AlertBadge";

const filtros: { key: Estado | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "critical", label: "Alerta" },
  { key: "warning", label: "Advertencia" },
  { key: "normal", label: "Normal" },
  { key: "healthy", label: "Saludable" },
];

export default function FlotaPage() {
  const [filtro, setFiltro] = useState<Estado | "all">("all");
  const [asc, setAsc] = useState(true);

  const filas = useMemo(() => {
    const base =
      filtro === "all" ? unidades : unidades.filter((u) => u.estado === filtro);
    return [...base].sort((a, b) =>
      asc ? a.bateria - b.bateria : b.bateria - a.bateria,
    );
  }, [filtro, asc]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Flota completa</h2>
        <p className="text-sm text-text-muted">
          {unidades.length} unidades representativas · {unidadesExtra} más en
          operación
        </p>
      </div>

      {/* Filtros + orden */}
      <div className="flex flex-wrap items-center gap-2">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filtro === f.key
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-line bg-surface text-text-muted hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setAsc((s) => !s)}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text"
        >
          <ArrowDownUp className="size-3.5" />
          Batería {asc ? "ascendente" : "descendente"}
        </button>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-text-faint">
                <th className="px-4 py-3 font-medium">Unidad</th>
                <th className="px-4 py-3 font-medium">Conductor</th>
                <th className="px-4 py-3 font-medium">Ruta</th>
                <th className="px-4 py-3 font-medium">Batería</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Actualización</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filas.map((u) => {
                const c = estadoConfig[u.estado];
                return (
                  <tr
                    key={u.id}
                    className={`transition-colors hover:bg-surface-2 ${
                      u.estado === "critical" ? "bg-critical/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold">
                        <StatusDot estado={u.estado} />
                        {u.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{u.conductor}</td>
                    <td className="px-4 py-3 text-text-muted">{u.ruta}</td>
                    <td className="px-4 py-3">
                      <BatteryBar
                        value={u.bateria}
                        estado={u.estado}
                        className="w-36"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {u.estado === "critical" ? (
                        <AlertBadge estado="critical" label="Alerta crítica" />
                      ) : (
                        <span className={`text-xs font-medium ${c.text}`}>
                          {c.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-faint">
                      {u.ultimaActualizacion}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/flota/${u.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <Eye className="size-3.5" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line px-4 py-2.5 text-center text-xs text-text-faint">
          y {unidadesExtra} unidades más en operación
        </div>
      </div>
    </div>
  );
}
