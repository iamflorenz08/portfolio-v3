import Image from "next/image";
import { content } from "@/content/site";
import { CountUp } from "./interactive/count-up";
import { HeroCanvas } from "./interactive/hero-canvas";
import { LocalTime } from "./interactive/local-time";
import { Spotlight } from "./interactive/spotlight";
import { Typewriter } from "./interactive/typewriter";
import { TechIconSvg } from "./tech-icon";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

const tile = "card h-full overflow-hidden bg-card/70 backdrop-blur-sm";
const label = "font-mono text-[11px] tracking-wider text-subtle uppercase";

/**
 * Bento hero: the intro, portrait, live clock, stats, current role, stack and
 * socials laid out as a grid of glowing tiles.
 * (Alternate layouts: ./hero.tsx, ./hero-centered.tsx, ./hero-classic.tsx)
 */
export function HeroBento() {
  const { profile, experience, skills } = content;
  const roles = profile.roles?.length ? profile.roles : [profile.role];
  const current = experience.find((e) => !e.end);
  const stats = profile.stats ?? [];
  const stack = skills.flatMap((g) => g.items).slice(0, 12);

  return (
    <section aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="blob absolute -top-32 left-1/4 size-[28rem] bg-accent/15" />
        <div className="blob absolute right-0 bottom-0 size-[26rem] bg-accent-2/15 [animation-delay:-7s]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_50%,transparent)]">
          <HeroCanvas />
        </div>
      </div>

      <div className="container-page flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-12">
        <div className="grid auto-rows-auto grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Intro */}
          <Spotlight className="col-span-2 rounded-[1.25rem] lg:row-span-2">
            <div style={delay(0)} className={`enter ${tile} flex flex-col justify-between gap-10 p-6 sm:p-9`}>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                {profile.availableForWork && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                    </span>
                    Available for work
                  </span>
                )}
                <span className="text-accent">~/hello</span>
              </div>

              <div>
                <p className="font-mono text-sm text-muted">Hi there, I&apos;m</p>
                <h1 className="mt-2 text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.92] font-bold tracking-[-0.04em] text-balance">
                  <span className="text-gradient pb-[0.06em]">{profile.name}</span>
                </h1>
                <p className="mt-4 flex min-h-[1.3em] items-baseline gap-2 text-lg font-semibold tracking-tight text-muted sm:text-2xl">
                  <span aria-hidden className="font-mono text-accent">
                    $
                  </span>
                  <Typewriter words={roles} />
                </p>
                <p className="mt-5 max-w-md leading-relaxed text-muted text-pretty">{profile.tagline}</p>
              </div>

              <div className="flex flex-wrap gap-3">
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
            </div>
          </Spotlight>

          {/* Portrait */}
          <div style={delay(80)} className="enter col-span-2 sm:col-span-1 sm:row-span-2">
            <div className={`${tile} group relative min-h-80 p-0`}>
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  preload
                  quality={90}
                  // Square photo covers a tall tile, so it's drawn at the tile's height (~540px), not its width
                  sizes="(min-width: 640px) 640px, 100vw"
                  className="object-cover object-top grayscale-[35%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              ) : (
                <div className="grid size-full min-h-80 place-items-center text-7xl font-bold">
                  <span className="text-gradient">{profile.name.charAt(0)}</span>
                </div>
              )}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-white">
                <div>
                  <p className="text-sm font-semibold">{profile.name}</p>
                  <p className="font-mono text-[11px] text-white/70">{profile.role}</p>
                </div>
                <span aria-hidden className="grid size-8 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-sm text-background">
                  ✦
                </span>
              </div>
            </div>
          </div>

          {/* Local time + location */}
          {(profile.timeZone || profile.location) && (
            <div style={delay(160)} className="enter col-span-1">
              <div className={`${tile} flex flex-col justify-between gap-6 p-5`}>
                <p className={label}>Local time</p>
                <div>
                  {profile.timeZone && (
                    <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      <LocalTime timeZone={profile.timeZone} />
                    </p>
                  )}
                  {profile.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <span aria-hidden className="text-accent">
                        ◉
                      </span>
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Top stat */}
          {stats[0] && (
            <div style={delay(220)} className="enter col-span-1">
              <div className={`${tile} relative flex flex-col justify-between gap-6 p-5`}>
                <div aria-hidden className="absolute -top-10 -right-10 size-32 rounded-full bg-accent-2/25 blur-2xl" />
                <p className={label}>{stats[0].label}</p>
                <p className="text-gradient text-5xl font-bold tracking-tight">
                  <CountUp value={stats[0].value} suffix={stats[0].suffix} />
                </p>
              </div>
            </div>
          )}

          {/* Currently */}
          {current && (
            <div style={delay(280)} className="enter col-span-2">
              <div className={`${tile} flex items-center justify-between gap-4 p-5`}>
                <div className="min-w-0">
                  <p className={label}>Currently</p>
                  <p className="mt-1 truncate font-medium">
                    {current.role} <span className="text-subtle">@</span>{" "}
                    {current.companyUrl ? (
                      <a href={current.companyUrl} target="_blank" rel="noopener" className="text-accent hover:underline">
                        {current.company}
                      </a>
                    ) : (
                      <span className="text-accent">{current.company}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stack marquee */}
          {stack.length > 0 && (
            <div style={delay(340)} className="enter col-span-2 lg:col-span-1">
              <div className={`${tile} flex flex-col justify-between gap-4 py-5`}>
                <p className={`${label} px-5`}>Stack</p>
                <p className="sr-only">{stack.join(", ")}</p>
                <div
                  aria-hidden
                  className="[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
                >
                  <div className="marquee flex w-max [animation-duration:25s]">
                    {[0, 1].map((copy) => (
                      <ul key={copy} className="flex shrink-0 gap-2 pr-2">
                        {stack.map((t) => (
                          <li
                            key={t}
                            className="grid size-11 place-items-center rounded-xl border border-border bg-background/60"
                            title={t}
                          >
                            <TechIconSvg label={t} className="size-5" />
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Socials */}
          {profile.socials.length > 0 && (
            <div style={delay(400)} className="enter col-span-2 lg:col-span-1">
              <div className={`${tile} flex flex-col justify-between gap-3 p-5`}>
                <p className={label}>Find me</p>
                <ul className="flex flex-wrap gap-2">
                  {profile.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        {s.label} <span aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
