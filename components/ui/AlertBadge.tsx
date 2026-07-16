import { TriangleAlert } from "lucide-react";
import { estadoConfig } from "@/lib/constants";
import type { Estado } from "@/lib/types";

/** Badge semáforo. Pulsa (anillo rojo) cuando es crítico. */
export function AlertBadge({
  estado = "critical",
  label,
  icon = true,
  pulse,
  className = "",
}: {
  estado?: Estado;
  label?: string;
  icon?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  const c = estadoConfig[estado];
  const doPulse = pulse ?? estado === "critical";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${c.soft} ${c.text} ${c.border} ${
        doPulse ? "pulse-critical" : ""
      } ${className}`}
    >
      {icon && <TriangleAlert className="size-3.5" />}
      {label ?? c.label}
    </span>
  );
}
