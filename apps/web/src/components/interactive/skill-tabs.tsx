"use client";

import { useState } from "react";
import type { SkillGroup } from "@portfolio/shared";

/** Tabbed skill explorer. All panels are rendered (inactive ones hidden) so every skill stays in the HTML. */
export function SkillTabs({ groups }: { groups: SkillGroup[] }) {
  const [active, setActive] = useState(0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`skill-tab-${next}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {groups.map((g, i) => (
          <button
            key={g.category}
            id={`skill-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`skill-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              active === i
                ? "bg-foreground text-background shadow-lg"
                : "border border-border text-muted hover:border-accent hover:text-foreground"
            }`}
          >
            {g.category}
          </button>
        ))}
      </div>
      {groups.map((g, i) => (
        <ul
          key={g.category}
          id={`skill-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`skill-tab-${i}`}
          hidden={active !== i}
          className="mt-6 flex flex-wrap gap-3"
        >
          {g.items.map((item, j) => (
            <li
              key={`${active}-${item}`}
              style={{ animationDelay: `${j * 60}ms` }}
              className="chip-in flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-gradient-to-br from-accent to-accent-2" />
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
