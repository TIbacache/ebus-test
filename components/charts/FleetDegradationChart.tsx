"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { unidadLineColor } from "@/lib/data";

const tooltipStyle = {
  background: "#1a2235",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  fontSize: 12,
} as const;

/** Degradación de batería por unidad (multi-línea, últimos 30 días). */
export function FleetDegradationChart({
  data,
}: {
  data: Record<string, number>[];
}) {
  const ids = Object.keys(unidadLineColor);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
        <XAxis
          dataKey="dia"
          interval={5}
          tickFormatter={(d) => `D${d}`}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
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
          labelFormatter={(d) => `Día ${d}`}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" />
        {ids.map((id) => (
          <Line
            key={id}
            type="monotone"
            dataKey={id}
            stroke={unidadLineColor[id]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
