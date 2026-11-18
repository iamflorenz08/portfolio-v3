import { techIcon } from "@/lib/tech-icons";

/** Brand colors that vanish on the background (pure black/white) fall back to the text color. */
export function iconColor(hex: string | undefined, fallback: string) {
  if (!hex) return fallback;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return l < 0.12 || l > 0.92 ? fallback : hex;
}

/** Brand icon for a technology label, or a small dot when none is known. */
export function TechIconSvg({ label, className = "" }: { label: string; className?: string }) {
  const icon = techIcon(label);
  if (!icon) return <span aria-hidden className={`size-1.5 shrink-0 rounded-full bg-current ${className}`} />;
  const color = iconColor(icon.hex, "");
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`size-4 shrink-0 ${className}`}
      fill={icon.stroke ? "none" : "currentColor"}
      stroke={icon.stroke ? "currentColor" : "none"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={color ? { color } : undefined}
    >
      <path d={icon.path} />
    </svg>
  );
}
