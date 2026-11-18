import Link from "next/link";
import { content } from "@/content/site";
import { NavLinks } from "./interactive/nav-links";
import { ThemeToggle } from "./interactive/theme-toggle";
import { LogoMark } from "./logo";

export function SiteHeader() {
  const firstName = (content.profile.name.split(" ")[0] ?? "").toLowerCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div
        aria-hidden
        className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-accent to-accent-2"
      />
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-sm font-semibold"
          aria-label={`${content.profile.name} — home`}
        >
          <LogoMark className="h-7 w-7 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
          <span>
            {firstName}
            <span className="text-accent">.</span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <NavLinks />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
