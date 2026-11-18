/**
 * FD ligature mark: a shared stem, the D's bowl, and the F's crossbar
 * cutting through it. Stroked with the site's accent gradient.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
        </linearGradient>
      </defs>
      <path
        d="M9 25V7h6a9 9 0 0 1 0 18H9M9 16h8"
        stroke="url(#logo-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="16" r="1.75" fill="var(--accent-2)" />
    </svg>
  );
}
