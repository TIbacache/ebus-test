import { estadoConfig } from "@/lib/constants";
import type { Estado } from "@/lib/types";

/** Punto indicador semáforo. Pulsa si es crítico. */
export function StatusDot({
  estado,
  pulse = true,
  className = "",
}: {
  estado: Estado;
  pulse?: boolean;
  className?: string;
}) {
  const c = estadoConfig[estado];
  return (
    <span
      className={`inline-block size-2.5 shrink-0 rounded-full ${c.dot} ${
        pulse && estado === "critical" ? "pulse-dot" : ""
      } ${className}`}
    />
  );
}
