import Image from "next/image";
import { content } from "@/content/site";
import { HeroCanvas } from "./interactive/hero-canvas";
import { LocalTime } from "./interactive/local-time";
import { Spotlight } from "./interactive/spotlight";
import { Typewriter } from "./interactive/typewriter";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/**
 * Editorial hero: oversized stacked name, arch-framed portrait with a spinning
 * badge, and an info strip along the bottom. (Alternate layouts: ./hero-bento.tsx, ./hero-centered.tsx, ./hero-classic.tsx)
 */
export function Hero() {
  const { profile, experience } = content;
  const roles = profile.roles?.length ? profile.roles : [profile.role];
  const current = experience.find((e) => !e.end);
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");
  const topStat = profile.stats?.[0];
  const badgeText = (profile.availableForWork ? "open to work • " : `${profile.role} • `).repeat(2).toUpperCase();

  const info = [
    profile.location && { label: "Based in", value: profile.location },
    profile.timeZone && { label: "Local time", value: <LocalTime timeZone={profile.timeZone} /> },
    current && {
      label: "Currently",
      value: (
        <>
          {current.role} <span className="text-subtle">@</span> <span className="text-accent">{current.company}</span>
        </>
      ),
    },
    topStat && { label: topStat.label, value: `${topStat.value}${topStat.suffix ?? ""}` },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <section aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="blob absolute -top-40 right-1/4 size-[30rem] bg-accent/20" />
        <div className="blob absolute bottom-0 -left-40 size-[26rem] bg-accent-2/20 [animation-delay:-8s]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <HeroCanvas />
        </div>
      </div>

      <div className="container-page flex min-h-[calc(100dvh-4rem)] flex-col justify-center pt-16 pb-10">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <div className="enter flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
              {profile.availableForWork && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Available for work
                </span>
              )}
              <span className="text-accent">Hi there, I&apos;m</span>
            </div>

            <h1
              style={delay(120)}
              className="enter mt-6 text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.04em]"
            >
              <span className="block">{first}</span>
              {last && <span className="text-gradient block pb-[0.08em]">{last}</span>}
            </h1>

            <p
              style={delay(220)}
              className="enter mt-6 flex min-h-[1.3em] items-baseline gap-3 text-xl font-semibold tracking-tight text-muted sm:text-3xl"
            >
              <span aria-hidden className="font-mono text-base text-accent sm:text-xl">
                /
              </span>
              <Typewriter words={roles} />
            </p>

            <p style={delay(300)} className="enter mt-5 max-w-lg text-lg leading-relaxed text-muted">
              {profile.tagline}
            </p>

            <div style={delay(380)} className="enter mt-9 flex flex-wrap gap-3">
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

          {/* Arch portrait */}
          <div style={delay(200)} className="enter relative order-1 mx-auto w-60 sm:w-72 lg:order-2 lg:w-80">
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-full bg-linear-to-b from-accent/35 via-accent-2/20 to-transparent blur-3xl"
            />
            <Spotlight tilt className="rounded-t-full rounded-b-[2rem]">
              <div className="gradient-border rounded-t-full rounded-b-[2rem] p-[2px]! shadow-2xl">
                <div className="relative aspect-3/4 overflow-hidden rounded-t-full rounded-b-[calc(2rem-2px)] bg-card">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      fill
                      preload
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 240px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-7xl font-bold">
                      <span className="text-gradient">{profile.name.charAt(0)}</span>
                    </div>
                  )}
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
                </div>
              </div>
            </Spotlight>

            {/* Spinning circular badge */}
            <div
              aria-hidden
              className="absolute -bottom-6 -left-8 grid size-28 place-items-center rounded-full border border-border bg-card/90 shadow-xl backdrop-blur sm:size-32"
            >
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full animate-spin [animation-duration:18s] motion-reduce:animate-none"
              >
                <defs>
                  <path id="hero-badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-muted font-mono text-[8.5px] tracking-[0.18em]">
                  <textPath href="#hero-badge-circle">{badgeText}</textPath>
                </text>
              </svg>
              <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-accent to-accent-2 text-lg text-background">
                ✦
              </span>
            </div>
          </div>
        </div>

        {/* Info strip */}
        {info.length > 0 && (
          <dl
            style={delay(480)}
            className="enter mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:mt-20 lg:grid-cols-4"
          >
            {info.map((item) => (
              <div key={item.label} className="bg-background/80 px-5 py-4 backdrop-blur">
                <dt className="font-mono text-[11px] tracking-wider text-subtle uppercase">{item.label}</dt>
                <dd className="mt-1 truncate text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
