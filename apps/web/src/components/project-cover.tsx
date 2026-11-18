/** Deterministic generative "screenshot" art for a project, seeded by its slug. */

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ProjectCover({ slug }: { slug: string }) {
  const rand = mulberry32(hash(slug));
  const hue = Math.floor(rand() * 360);
  const c1 = `hsl(${hue} 80% 62%)`;
  const c2 = `hsl(${(hue + 55) % 360} 75% 52%)`;
  const c3 = `hsl(${(hue + 190) % 360} 80% 70%)`;
  const id = `cover-${slug}`;
  const variant = Math.floor(rand() * 3);

  // chart data
  const pts = Array.from({ length: 9 }, (_, i) => [108 + i * 34, 196 - (rand() * 55 + i * 4)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts.at(-1)![0]} 214 L${pts[0]![0]} 214 Z`;
  const bars = Array.from({ length: 7 }, () => 20 + rand() * 55);

  return (
    <svg viewBox="0 0 480 270" aria-hidden className="size-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} stopOpacity="0.45" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" opacity="0.25" />
        </pattern>
      </defs>

      <rect width="480" height="270" fill={`url(#${id}-bg)`} />
      <rect width="480" height="270" fill={`url(#${id}-dots)`} />
      <circle cx={380 + rand() * 60} cy={30 + rand() * 40} r="110" fill={c3} opacity="0.35" />

      {/* browser window */}
      <g className="transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <rect x="44" y="40" width="392" height="250" rx="10" fill="#ffffff" opacity="0.96" />
        <rect x="44" y="40" width="392" height="24" rx="10" fill="#f4f4f5" />
        <circle cx="58" cy="52" r="3.5" fill="#f87171" />
        <circle cx="70" cy="52" r="3.5" fill="#fbbf24" />
        <circle cx="82" cy="52" r="3.5" fill="#34d399" />
        <rect x="150" y="47" width="180" height="10" rx="5" fill="#e4e4e7" />

        {/* sidebar */}
        <rect x="56" y="76" width="36" height="6" rx="3" fill={c2} />
        {[92, 104, 116, 128, 140].map((y, i) => (
          <rect key={y} x="56" y={y} width={22 + ((i * 7) % 14)} height="5" rx="2.5" fill="#e4e4e7" />
        ))}

        {/* header */}
        <rect x="108" y="76" width="110" height="9" rx="4.5" fill="#27272a" opacity="0.85" />
        <rect x="108" y="90" width="70" height="6" rx="3" fill="#d4d4d8" />
        <rect x="376" y="76" width="46" height="16" rx="8" fill={c2} />

        {/* stat cards */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={108 + i * 106} y="106" width="96" height="40" rx="6" fill="#fafafa" stroke="#e4e4e7" />
            <rect x={116 + i * 106} y="114" width="30" height="5" rx="2.5" fill="#d4d4d8" />
            <rect x={116 + i * 106} y="126" width={30 + rand() * 30} height="10" rx="3" fill={i === 0 ? c1 : "#3f3f46"} />
          </g>
        ))}

        {/* chart */}
        {variant === 1 ? (
          bars.map((b, i) => (
            <rect key={i} x={112 + i * 44} y={214 - b} width="26" height={b} rx="4" fill={i % 2 ? c2 : c1} opacity="0.85" />
          ))
        ) : (
          <>
            <path d={area} fill={`url(#${id}-area)`} />
            <path d={line} fill="none" stroke={c2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {variant === 2 &&
              pts.map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#fff" stroke={c2} strokeWidth="2" />)}
          </>
        )}
      </g>
    </svg>
  );
}
