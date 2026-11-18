import Image from "next/image";
import { content } from "@/content/site";
import { HeroCanvas } from "./interactive/hero-canvas";
import { Typewriter } from "./interactive/typewriter";
import { TechIconSvg } from "./tech-icon";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/**
 * Centered hero: round portrait with a spinning gradient ring, centered name,
 * and a tech-stack marquee along the bottom.
 * (Alternate layouts: ./hero.tsx, ./hero-classic.tsx)
 */
export function HeroCentered() {
  const { profile, skills } = content;
  const roles = profile.roles?.length ? profile.roles : [profile.role];
  const stack = skills.flatMap((g) => g.items);

  return (
    <section aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Backdrop: spotlight cone from the top, grid, particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="absolute -top-1/4 left-1/2 h-[70%] w-[min(60rem,140%)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]" />
        <div className="blob absolute top-1/3 -left-40 size-[24rem] bg-accent-2/15" />
        <div className="blob absolute top-1/2 -right-40 size-[24rem] bg-accent/15 [animation-delay:-9s]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <HeroCanvas />
        </div>
      </div>

      <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
        <div className="container-page flex flex-1 flex-col items-center justify-center py-16 text-center">
          {/* Portrait with spinning ring */}
          <div className="enter relative">
            <div
              aria-hidden
              className="absolute -inset-1 animate-spin rounded-full bg-[conic-gradient(var(--accent),var(--accent-2),transparent_60%,var(--accent))] [animation-duration:5s] motion-reduce:animate-none"
            />
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-full bg-accent/25 blur-2xl" />
            <div className="relative size-32 overflow-hidden rounded-full border-4 border-background bg-card sm:size-36">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  preload
                  sizes="144px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="grid size-full place-items-center text-5xl font-bold">
                  <span className="text-gradient">{profile.name.charAt(0)}</span>
                </div>
              )}
            </div>
            {profile.availableForWork && (
              <span
                className="absolute -right-2 bottom-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-muted shadow-lg backdrop-blur"
                title="Available for new opportunities"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                open to work
              </span>
            )}
          </div>

          <p style={delay(100)} className="enter mt-10 font-mono text-sm text-accent">
            Hi there, I&apos;m
          </p>
          <h1
            style={delay(180)}
            className="enter mt-3 text-[clamp(3rem,9vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.035em] text-balance"
          >
            <span className="text-gradient pb-[0.06em]">{profile.name}</span>
          </h1>

          <p
            style={delay(260)}
            className="enter mt-5 min-h-[1.3em] text-xl font-semibold tracking-tight text-muted sm:text-3xl"
          >
            <Typewriter words={roles} />
          </p>

          <p style={delay(340)} className="enter mt-5 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            {profile.tagline}
            {profile.location && (
              <>
                {" "}
                Based in <span className="text-foreground">{profile.location}</span>.
              </>
            )}
          </p>

          <div style={delay(420)} className="enter mt-9 flex flex-wrap justify-center gap-3">
            <a href="#projects" className="btn btn-primary">
              View my work
              <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="btn">
              Get in touch
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn" target="_blank" rel="noopener">
                Résumé ↗
              </a>
            )}
          </div>

          {profile.socials.length > 0 && (
            <ul style={delay(500)} className="enter mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-xs">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    className="text-subtle transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tech-stack marquee */}
        {stack.length > 0 && (
          <div
            style={delay(580)}
            className="enter border-y border-border bg-card/40 py-4 backdrop-blur [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          >
            <p className="sr-only">Tech stack: {stack.join(", ")}</p>
            <div aria-hidden className="marquee flex w-max">
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0">
                  {stack.map((t) => (
                    <li key={t} className="flex items-center gap-2.5 px-6 font-mono text-sm whitespace-nowrap text-muted">
                      <TechIconSvg label={t} className="size-5" />
                      {t}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
