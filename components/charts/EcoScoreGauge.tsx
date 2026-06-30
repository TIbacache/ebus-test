/**
 * Velocímetro de Eco-Score (SVG custom, server-safe).
 * Semicírculo con zonas rojo / amarillo / verde y aguja apuntando al score.
 * Eco-score: mayor = mejor (verde).
 */
const CX = 110;
const CY = 112;
const R = 86;

function pt(deg: number, r = R): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}

// score 0..100 -> ángulo 180°(izq) .. 0°(der)
function angle(score: number) {
  return 180 - 1.8 * Math.max(0, Math.min(100, score));
}

function arc(fromDeg: number, toDeg: number) {
  const [x1, y1] = pt(fromDeg);
  const [x2, y2] = pt(toDeg);
  const large = fromDeg - toDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
}

export function EcoScoreGauge({ score }: { score: number }) {
  const color = score >= 75 ? "#22C55E" : score >= 55 ? "#FF8C00" : "#FF4444";
  const label =
    score >= 75 ? "Eficiente" : score >= 55 ? "Moderado" : "Desgaste acelerado";
  const [nx, ny] = pt(angle(score), R - 14);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 150" className="w-full max-w-[280px]">
        {/* Track */}
        <path
          d={arc(180, 0)}
          fill="none"
          stroke="var(--color-surface-offset)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        {/* Zonas */}
        <path d={arc(180, 81)} fill="none" stroke="#FF4444" strokeWidth={16} strokeLinecap="round" />
        <path d={arc(81, 45)} fill="none" stroke="#FF8C00" strokeWidth={16} />
        <path d={arc(45, 0)} fill="none" stroke="#22C55E" strokeWidth={16} strokeLinecap="round" />
        {/* Aguja */}
        <line
          x1={CX}
          y1={CY}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={6} fill={color} />
        {/* Valor */}
        <text
          x={CX}
          y={CY - 22}
          textAnchor="middle"
          className="fill-text"
          fontSize="34"
          fontWeight="700"
        >
          {score}
        </text>
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          className="fill-text-faint"
          fontSize="11"
        >
          / 100
        </text>
      </svg>
      <span
        className="-mt-1 rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        {label}
      </span>
    </div>
  );
}
