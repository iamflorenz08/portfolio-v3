import Image from "next/image";
import { content } from "@/content/site";
import { HeroCanvas } from "./interactive/hero-canvas";
import { Spotlight } from "./interactive/spotlight";
import { Typewriter } from "./interactive/typewriter";

export function HeroClassic() {
  const { profile, skills } = content;
  const roles = profile.roles?.length ? profile.roles : [profile.role];
  const [chipA, chipB] = skills.flatMap((g) => g.items);

  return (
    <section aria-label="Introduction" className="relative isolate overflow-hidden">
      {/* Backdrop: grid, glowing blobs, interactive particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="blob absolute -top-32 -left-24 size-[28rem] bg-accent/25" />
        <div className="blob absolute top-1/3 -right-32 size-[32rem] bg-accent-2/20 [animation-delay:-6s]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
          <HeroCanvas />
        </div>
      </div>

      <div className="container-page grid min-h-[calc(100dvh-4rem)] items-center gap-16 py-20 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {profile.availableForWork && (
            <p
              className="enter mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted backdrop-blur"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Available for new opportunities
            </p>
          )}
          <p style={{ "--delay": "80ms" } as React.CSSProperties} className="enter font-mono text-sm text-accent">
            Hi there, I&apos;m
          </p>
          <h1
            style={{ "--delay": "160ms" } as React.CSSProperties}
            className="enter mt-3 text-5xl font-bold tracking-tight text-balance sm:text-7xl"
          >
            <span className="text-gradient">{profile.name}</span>
          </h1>
          <p
            style={{ "--delay": "240ms" } as React.CSSProperties}
            className="enter mt-4 min-h-[1.3em] text-2xl font-semibold tracking-tight text-muted sm:text-4xl"
          >
            <Typewriter words={roles} />
          </p>
          <p
            style={{ "--delay": "320ms" } as React.CSSProperties}
            className="enter mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            {profile.tagline}
          </p>
          <div style={{ "--delay": "400ms" } as React.CSSProperties} className="enter mt-10 flex flex-wrap gap-3">
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

        <div
          style={{ "--delay": "200ms" } as React.CSSProperties}
          className="enter relative order-first mx-auto w-full max-w-72 sm:max-w-sm lg:order-0 lg:max-w-md"
        >
          {/* Soft brand glow behind the card */}
          <div
            aria-hidden
            className="absolute -inset-6 -z-10 rounded-[3rem] bg-linear-to-br from-accent/40 via-transparent to-accent-2/40 blur-3xl"
          />
          <Spotlight tilt className="rounded-4xl">
            <div className="rounded-4xl border border-border bg-card/70 p-2 shadow-2xl backdrop-blur">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    preload
                    sizes="(min-width: 1024px) 448px, (min-width: 640px) 384px, 288px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center bg-background text-6xl font-bold">
                    <span className="text-gradient">{profile.name.charAt(0)}</span>
                  </div>
                )}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/75 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-white/70">{profile.role}</p>
                  </div>
                  {profile.location && (
                    <p className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[11px] backdrop-blur">
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Spotlight>
          {chipA && (
            <div className="absolute -top-4 -right-4 hidden rounded-xl sm:block border border-border bg-card/90 px-3 py-2 font-mono text-xs shadow-xl backdrop-blur [animation:float_7s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
              <span className="text-accent">●</span> {chipA}
            </div>
          )}
          {chipB && (
            <div className="absolute bottom-24 -left-6 hidden rounded-xl sm:block border border-border bg-card/90 px-3 py-2 font-mono text-xs shadow-xl backdrop-blur [animation:float_9s_ease-in-out_infinite_alternate-reverse] motion-reduce:animate-none">
              <span className="text-accent-2">●</span> {chipB}
            </div>
          )}
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-subtle transition-colors hover:text-accent md:flex"
      >
        <span className="font-mono">scroll</span>
        <span className="flex h-8 w-5 justify-center rounded-full border border-current pt-1.5">
          <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}
