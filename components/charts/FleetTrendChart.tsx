"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  background: "#1a2235",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  fontSize: 12,
} as const;

/** Tendencia de salud general de la flota (área, sube = mejora). */
export function FleetTrendChart({
  data,
}: {
  data: { semana: string; salud: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="saludGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
        <XAxis
          dataKey="semana"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[60, 100]}
          width={40}
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#94A3B8" }}
          itemStyle={{ color: "#E2E8F0" }}
          formatter={(v) => [`${v}%`, "Salud"]}
        />
        <Area
          type="monotone"
          dataKey="salud"
          stroke="#00D4AA"
          strokeWidth={2}
          fill="url(#saludGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
