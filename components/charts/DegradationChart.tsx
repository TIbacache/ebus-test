"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  background: "#1a2235",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  fontSize: 12,
} as const;

/** Línea de degradación de batería (SoH %) — últimos 30 días. */
export function DegradationChart({
  data,
  color = "#FF4444",
  umbral,
}: {
  data: { dia: number; soh: number }[];
  color?: string;
  /** Umbral de reemplazo (EOL) — dibuja una línea de referencia punteada. */
  umbral?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
        <XAxis
          dataKey="dia"
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={5}
          tickFormatter={(d) => `D${d}`}
        />
        <YAxis
          domain={[0, 100]}
          width={40}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#94A3B8" }}
          itemStyle={{ color: "#E2E8F0" }}
          labelFormatter={(d) => `Día ${d}`}
          formatter={(v) => [`${v}%`, "Salud"]}
        />
        {umbral != null && (
          <ReferenceLine
            y={umbral}
            stroke="#FF8C00"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `Umbral de reemplazo (${umbral}%)`,
              fill: "#FF8C00",
              fontSize: 10,
              position: "insideBottomLeft",
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="soh"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
