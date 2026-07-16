import Link from "next/link";
import { Bus } from "lucide-react";
import { estadoConfig } from "@/lib/constants";
import type { Estado, Unidad } from "@/lib/types";

const posiciones: Record<string, { top: string; left: string }> = {
  "MIC-101": { top: "20%", left: "16%" },
  "MIC-102": { top: "60%", left: "28%" },
  "MIC-103": { top: "36%", left: "54%" },
  "MIC-104": { top: "68%", left: "72%" },
  "MIC-105": { top: "16%", left: "80%" },
};

// Marcadores decorativos (parte de las 98 en recorrido).
const decorativos: { top: string; left: string; estado: Estado }[] = [
  { top: "44%", left: "10%", estado: "healthy" },
  { top: "82%", left: "48%", estado: "normal" },
  { top: "28%", left: "36%", estado: "healthy" },
  { top: "54%", left: "88%", estado: "healthy" },
  { top: "12%", left: "50%", estado: "normal" },
  { top: "86%", left: "20%", estado: "healthy" },
];

function Marker({
  estado,
  top,
  left,
  label,
}: {
  estado: Estado;
  top: string;
  left: string;
  label?: string;
}) {
  const c = estadoConfig[estado];
  const critical = estado === "critical";
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top, left }}
    >
      <div
        className={`grid size-7 place-items-center rounded-full border border-white/10 ${c.soft} ${c.text} ${
          critical ? "pulse-critical ring-2 ring-critical/50" : ""
        }`}
      >
        <Bus className="size-4" />
      </div>
      {label && (
        <span
          className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold ${c.soft} ${c.text}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export function FleetMap({
  unidades,
  enRecorrido,
}: {
  unidades: Unidad[];
  enRecorrido: number;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Mapa en tiempo real</h3>
          <p className="text-xs text-text-faint">{enRecorrido} micros en recorrido — La Serena</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-healthy" />
            OK
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-warning" />
            Advert.
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-critical" />
            Crítico
          </span>
        </div>
      </div>

      <div className="street-grid relative h-72 w-full sm:h-80">
        {/* Avenidas principales */}
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 avenida" />
        <div className="absolute inset-y-0 left-[45%] w-3 avenida" />

        {decorativos.map((d, i) => (
          <Marker key={i} estado={d.estado} top={d.top} left={d.left} />
        ))}

        {unidades.map((u) => {
          const pos = posiciones[u.id];
          if (!pos) return null;
          const critical = u.estado === "critical";
          return critical ? (
            <Link key={u.id} href={`/flota/${u.id}`}>
              <Marker estado={u.estado} top={pos.top} left={pos.left} label={u.id} />
            </Link>
          ) : (
            <Marker key={u.id} estado={u.estado} top={pos.top} left={pos.left} />
          );
        })}
      </div>
    </div>
  );
}
