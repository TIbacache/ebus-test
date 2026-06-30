"use client";

import { useEffect, useState, type ReactNode } from "react";
import { animate } from "motion/react";
import { ArrowUp, ArrowDown } from "lucide-react";

type Accent = "primary" | "critical" | "healthy" | "muted";

const accentMap: Record<Accent, { text: string; soft: string }> = {
  primary: { text: "text-primary", soft: "bg-primary/10" },
  critical: { text: "text-critical", soft: "bg-critical/10" },
  healthy: { text: "text-healthy", soft: "bg-healthy/10" },
  muted: { text: "text-text-muted", soft: "bg-surface-offset" },
};

export interface KPITrend {
  dir: "up" | "down";
  value: string;
  good?: boolean;
}

/** Tarjeta KPI con counter-up (Motion) al montar. */
export function KPICard({
  value,
  label,
  icon,
  accent = "primary",
  trend,
  pulse = false,
  suffix = "",
  delay = 0,
}: {
  value: number;
  label: string;
  icon: ReactNode;
  accent?: Accent;
  trend?: KPITrend;
  pulse?: boolean;
  suffix?: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, delay]);

  const a = accentMap[accent];
  const TrendIcon = trend?.dir === "up" ? ArrowUp : ArrowDown;

  return (
    <div
      className={`card relative p-5 transition-transform duration-200 hover:-translate-y-0.5 ${
        pulse ? "border-critical/40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-lg ${a.soft} ${a.text} ${
            pulse ? "pulse-critical" : ""
          }`}
        >
          {icon}
        </span>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span
          className={`tnum text-4xl font-bold leading-none ${
            pulse ? "text-critical" : "text-text"
          }`}
        >
          {display}
          {suffix}
        </span>
        {trend && (
          <span
            className={`mb-0.5 inline-flex items-center gap-0.5 text-xs font-semibold ${
              trend.good ? "text-healthy" : "text-text-muted"
            }`}
          >
            <TrendIcon className="size-3.5" />
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
