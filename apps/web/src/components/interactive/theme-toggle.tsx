"use client";

import { toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={(e) => toggleTheme(e.clientX, e.clientY)}
      className="grid size-9 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="icon-moon size-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg aria-hidden viewBox="0 0 24 24" className="icon-sun size-4" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
