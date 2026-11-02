export function HeroVisual({ className = "" }: { className?: string }) {
  const gridX = Array.from({ length: 13 }, (_, i) => i * 50);
  const gridY = Array.from({ length: 11 }, (_, i) => i * 50);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 600 500"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <defs>
        <linearGradient id="hero-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#14283f" stopOpacity="1" />
          <stop offset="0.35" stopColor="#14283f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-flow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f28c4f" stopOpacity="0" />
          <stop offset="0.3" stopColor="#f28c4f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f28c4f" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
        {gridX.map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2="500" />
        ))}
        {gridY.map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2="600" y2={y} />
        ))}
      </g>

      <g fill="none" stroke="#c9d3df" strokeOpacity="0.55" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M80 150 H330 a60 60 0 0 1 60 60 V470" />
        <path d="M80 220 H300 a20 20 0 0 1 20 20 V470" />
        {[120, 170, 220, 270].map((x) => (
          <line key={x} x1={x} y1="150" x2={x} y2="220" strokeOpacity="0.3" />
        ))}
        {[300, 350, 400, 450].map((y) => (
          <line key={y} x1="320" y1={y} x2="390" y2={y} strokeOpacity="0.3" />
        ))}
      </g>

      <g transform="translate(470 140)" fill="none" stroke="#c9d3df" strokeWidth="1.5">
        <circle r="78" strokeOpacity="0.5" />
        <circle r="62" strokeOpacity="0.3" />
        <circle r="14" strokeOpacity="0.6" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path
            key={a}
            d="M16 0 C 30 -12, 48 -14, 60 -6"
            transform={`rotate(${a})`}
            strokeOpacity="0.45"
          />
        ))}
      </g>

      <g fill="none" stroke="url(#hero-flow)" strokeWidth="2" strokeLinecap="round">
        <path className="airflow-line" d="M0 185 C 120 185, 200 160, 330 185 S 520 260, 600 240" />
        <path className="airflow-line" d="M0 300 C 140 280, 220 330, 360 310 S 520 350, 600 330" style={{ animationDuration: "12s" }} />
        <path className="airflow-line" d="M0 380 C 160 360, 260 410, 400 390 S 540 420, 600 410" strokeOpacity="0.6" style={{ animationDuration: "15s" }} />
      </g>

      <g fill="none" stroke="#c9d3df" strokeOpacity="0.4" strokeWidth="1.5">
        <rect x="430" y="330" width="130" height="90" rx="4" />
        {[348, 366, 384, 402].map((y) => (
          <line key={y} x1="444" y1={y} x2="546" y2={y} />
        ))}
      </g>

      <rect width="600" height="500" fill="url(#hero-fade)" />
    </svg>
  );
}
