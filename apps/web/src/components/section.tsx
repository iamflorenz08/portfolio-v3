export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="container-page py-24 sm:py-32">
      <header data-reveal className="mb-14 max-w-2xl">
        <p className="mb-3 flex items-center gap-3 font-mono text-xs tracking-widest text-accent uppercase">
          <span>{index}</span>
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-accent to-accent-2" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={`${id}-heading`} className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}
