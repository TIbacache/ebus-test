"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const tooltipStyle = {
  background: "#1a2235",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  fontSize: 12,
} as const;

function colorFor(v: number) {
  return v >= 75 ? "#22C55E" : v >= 55 ? "#FF8C00" : "#FF4444";
}

type Row = Record<string, string | number>;

/** Barras de eco-score (color por umbral). */
export function EcoBarChart({
  data,
  xKey,
  yKey,
}: {
  data: Row[];
  xKey: string;
  yKey: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[0, 100]}
          width={32}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "#94A3B8" }}
          itemStyle={{ color: "#E2E8F0" }}
          cursor={{ fill: "rgba(148,163,184,0.1)" }}
        />
        <Bar dataKey={yKey} radius={[4, 4, 0, 0]} maxBarSize={52}>
          {data.map((d, i) => (
            <Cell key={i} fill={colorFor(Number(d[yKey]))} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
