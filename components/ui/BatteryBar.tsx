import { estadoConfig, estadoDesdeBateria } from "@/lib/constants";
import type { Estado } from "@/lib/types";

/** Barra de batería con color semáforo según umbral. */
export function BatteryBar({
  value,
  estado,
  showLabel = true,
  className = "",
}: {
  value: number;
  estado?: Estado;
  showLabel?: boolean;
  className?: string;
}) {
  const c = estadoConfig[estado ?? estadoDesdeBateria(value)];
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="h-2 w-full min-w-16 overflow-hidden rounded-full bg-surface-offset">
        <div
          className={`h-full rounded-full ${c.bar} transition-[width] duration-700 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className={`tnum w-10 shrink-0 text-right text-sm font-semibold ${c.text}`}>
          {value}%
        </span>
      )}
    </div>
  );
}
