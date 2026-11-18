"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { OPEN_PALETTE_EVENT } from "./command-palette";
import { useIsMac } from "./use-is-mac";

/** Header nav with scroll-spy highlighting + command palette trigger. */
export function NavLinks() {
  const [active, setActive] = useState<string | null>(null);
  const isMac = useIsMac();

  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <ul className="hidden items-center gap-1 text-sm md:flex">
        {nav.map((item) => {
          const isActive = active === item.href;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-md px-3 py-2 transition-colors ${
                  isActive ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-accent to-accent-2 transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
        aria-label="Open command palette"
        className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 md:hidden" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="md:hidden">Menu</span>
        <kbd className="hidden font-mono text-xs md:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
      </button>
    </>
  );
}
