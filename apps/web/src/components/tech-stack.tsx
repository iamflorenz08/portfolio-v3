import { content } from "@/content/site";
import { TechIconSvg } from "./tech-icon";

/** Technologies listed by category. */
export function TechStack() {
  const { skills } = content;

  return (
    <section aria-label="Technologies I work with" className="border-y border-border bg-card/40">
      <div className="container-page py-12 sm:py-16">
        <p data-reveal className="mb-8 font-mono text-xs text-subtle">
          <span className="text-accent">$</span> stack --list
        </p>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <div key={group.category} data-reveal style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}>
              <h3
                className={`mb-4 flex items-center gap-2 font-mono text-xs tracking-widest uppercase ${
                  i % 2 ? "text-accent-2" : "text-accent"
                }`}
              >
                <span aria-hidden className="size-1.5 rounded-full bg-current" />
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono text-sm transition-colors hover:border-accent/60"
                  >
                    <TechIconSvg label={item} className={i % 2 ? "text-accent-2" : "text-accent"} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
