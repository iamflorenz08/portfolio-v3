import { content } from "@/content/site";

const k = "text-accent-2"; // keyword
const s = "text-accent"; // string
const p = "text-foreground"; // property
const c = "text-subtle italic"; // comment
const b = "text-amber-500"; // boolean / literal

/** Decorative editor window that renders the profile as code. */
export function CodeWindow() {
  const { profile, skills } = content;
  const stack = skills.flatMap((g) => g.items).slice(0, 4);

  const lines: React.ReactNode[] = [
    <span key="c" className={c}>{"// hello-world.ts"}</span>,
    <>
      <span className={k}>const</span> <span className={p}>engineer</span> <span className="text-subtle">=</span>{" "}
      {"{"}
    </>,
    <>
      {"  "}<span className={p}>name</span>: <span className={s}>&quot;{profile.name}&quot;</span>,
    </>,
    <>
      {"  "}<span className={p}>role</span>: <span className={s}>&quot;{profile.role}&quot;</span>,
    </>,
    ...(profile.location
      ? [
          <>
            {"  "}<span className={p}>location</span>: <span className={s}>&quot;{profile.location}&quot;</span>,
          </>,
        ]
      : []),
    <>
      {"  "}<span className={p}>stack</span>: [
    </>,
    ...stack.map((t, i) => (
      <>
        {"    "}<span className={s}>&quot;{t}&quot;</span>
        {i < stack.length - 1 ? "," : ""}
      </>
    )),
    <>{"  "}],</>,
    <>
      {"  "}<span className={p}>openToWork</span>: <span className={b}>{String(!!profile.availableForWork)}</span>,
    </>,
    <>{"};"}</>,
    <></>,
    <>
      <span className={p}>engineer</span>.<span className={k}>build</span>(
      <span className={s}>&quot;something great&quot;</span>);<span className="caret" />
    </>,
  ];

  return (
    <div className="card overflow-hidden bg-card/80 shadow-2xl shadow-accent/10 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-red-400/90" />
        <span className="size-3 rounded-full bg-amber-400/90" />
        <span className="size-3 rounded-full bg-emerald-400/90" />
        <span className="ml-3 font-mono text-xs text-subtle">~/portfolio/hello-world.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span aria-hidden className="mr-5 w-5 shrink-0 text-right text-subtle/50 select-none">
                {i + 1}
              </span>
              <span className="text-muted">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
