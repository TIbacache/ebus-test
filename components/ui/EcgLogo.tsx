/**
 * Logo E-Bus Control — emblema con línea ECG (metáfora "El Corazón del Bus").
 * Server-safe (sin hooks). La línea se anima vía la clase .ecg-line de globals.css.
 */
export function EcgLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="11"
        fill="#111827"
        stroke="#00D4AA"
        strokeOpacity="0.35"
      />
      <path
        d="M6 24 H15 l2.4 -9 l3.4 16 l3 -11 l2.3 6 H38"
        stroke="#00D4AA"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ecg-line"
      />
    </svg>
  );
}

/** Logo + wordmark horizontal. */
export function EcgWordmark({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <EcgLogo size={size} />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-text">
          E-Bus <span className="text-primary">Control</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-text-faint">
          Movilidad Inteligente
        </span>
      </span>
    </span>
  );
}
