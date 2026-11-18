export function TagList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
