import { content } from "@/content/site";
import { CopyEmail } from "./interactive/copy-email";

export function Contact() {
  const { profile } = content;
  return (
    <section id="contact" aria-labelledby="contact-heading" className="container-page py-24 sm:py-32">
      <div data-reveal className="gradient-border">
        <div className="relative isolate overflow-hidden rounded-[calc(1.5rem-1px)] bg-card px-6 py-16 text-center sm:px-16 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="bg-grid absolute inset-0 opacity-50" />
            <div className="blob absolute -bottom-40 left-1/2 size-[30rem] -translate-x-1/2 bg-accent/20" />
          </div>
          <p className="font-mono text-xs tracking-widest text-accent uppercase">04 — What&apos;s next?</p>
          <h2 id="contact-heading" className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Let&apos;s build something <span className="text-gradient">great</span> together.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Whether you have a role, a project, or just want to say hi — my inbox is always open.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {profile.email && (
              <>
                <a href={`mailto:${profile.email}`} className="btn btn-primary">
                  Say hello <span aria-hidden>👋</span>
                </a>
                <CopyEmail email={profile.email} />
              </>
            )}
          </div>
          {profile.socials.length > 0 && (
            <ul className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              {profile.socials.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener me" className="text-muted transition-colors hover:text-accent">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
