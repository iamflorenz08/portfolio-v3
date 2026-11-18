"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SocialLink } from "@portfolio/shared";
import { nav } from "@/lib/site";
import { toggleTheme } from "@/lib/theme";

type Item = { id: string; label: string; group: string; hint?: string; run: () => void };

export const OPEN_PALETTE_EVENT = "open-command-palette";

const scrollTo = (selector: string) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", selector === "body" ? location.pathname : selector);
};

/** ⌘K / Ctrl+K quick navigation and actions. */
export function CommandPalette({ socials, email }: { socials: SocialLink[]; email?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(
    () => [
      { id: "top", label: "Home", group: "Navigate", hint: "↑", run: () => scrollTo("body") },
      ...nav.map((n) => ({ id: n.href, label: n.label, group: "Navigate", hint: n.href, run: () => scrollTo(n.href) })),
      { id: "theme", label: "Toggle theme", group: "Actions", hint: "◐", run: () => toggleTheme() },
      ...(email
        ? [
            { id: "copy", label: "Copy email address", group: "Actions", hint: email, run: () => navigator.clipboard?.writeText(email) },
            { id: "mail", label: "Send an email", group: "Actions", hint: "mailto", run: () => (location.href = `mailto:${email}`) },
          ]
        : []),
      ...socials.map((s) => ({
        id: s.url,
        label: `Open ${s.label}`,
        group: "Links",
        hint: s.handle ?? "↗",
        run: () => window.open(s.url, "_blank", "noopener"),
      })),
    ],
    [socials, email],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.group} ${i.hint ?? ""}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setQuery("");
    setActive(0);
    d.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const run = (item?: Item) => {
    if (!item) return;
    close();
    // let the dialog close before scrolling / theme transition
    requestAnimationFrame(() => item.run());
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    addEventListener("keydown", onKey);
    addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, [open, close]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  let lastGroup = "";

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClick={(e) => e.target === dialogRef.current && close()}
      className="palette m-auto mt-[12vh] w-[min(92vw,36rem)] overflow-hidden rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-subtle" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          placeholder="Type a command or search…"
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={filtered[active] ? `palette-item-${active}` : undefined}
          className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle focus-visible:outline-none"
        />
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle">ESC</kbd>
      </div>
      <ul ref={listRef} id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
        {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-subtle">No results found.</li>}
        {filtered.map((item, i) => {
          const header = item.group !== lastGroup ? item.group : null;
          lastGroup = item.group;
          return (
            <li key={item.id} role="presentation">
              {header && (
                <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-wider text-subtle uppercase">{header}</p>
              )}
              <div
                id={`palette-item-${i}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => run(item)}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                  i === active ? "bg-accent-soft/60 text-foreground" : "text-muted"
                }`}
              >
                <span>{item.label}</span>
                {item.hint && <span className="max-w-[50%] truncate font-mono text-xs text-subtle">{item.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex gap-4 border-t border-border px-4 py-2.5 font-mono text-[10px] text-subtle">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>esc close</span>
      </div>
    </dialog>
  );
}
