import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { alertasActivas } from "@/lib/data";
import { estadoConfig } from "@/lib/constants";
import { StatusDot } from "@/components/ui/StatusDot";

export function AlertFeed() {
  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold">Últimas alertas</h3>
        <Link
          href="/alertas"
          className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Ver todas
        </Link>
      </div>
      <ul className="divide-y divide-line">
        {alertasActivas.map((a, i) => {
          const c = estadoConfig[a.estadoUnidad];
          return (
            <li
              key={a.id}
              className="animate-slide-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Link
                href={`/flota/${a.unidad}`}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2 ${
                  a.estadoUnidad === "critical" ? "bg-critical/5" : ""
                }`}
              >
                <StatusDot estado={a.estadoUnidad} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{a.unidad}</span>
                    <span className={`tnum text-xs font-semibold ${c.text}`}>
                      {a.bateria}%
                    </span>
                  </div>
                  <p className="truncate text-xs text-text-muted">{a.titulo}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-text-faint">
                    <MapPin className="size-3 shrink-0" /> {a.ubicacion}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-text-faint" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
