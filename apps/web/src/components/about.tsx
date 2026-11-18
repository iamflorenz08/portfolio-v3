import Image from "next/image";
import { content } from "@/content/site";
import { CountUp } from "./interactive/count-up";
import { LocalTime } from "./interactive/local-time";
import { Spotlight } from "./interactive/spotlight";
import { Section } from "./section";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/** Renders `**text**` in an about paragraph as bold. */
const withBold = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );

export function About() {
  const { profile, experience } = content;
  const current = experience.find((e) => !e.end);
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <Section
      id="about"
      index="01"
      eyebrow="About me"
      title={
        <>
          Engineering with <span className="text-gradient">purpose</span> and polish.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {/* Story */}
        <div data-reveal className="md:col-span-2 md:row-span-2">
          <Spotlight className="card h-full p-8">
            <div className="space-y-4 text-lg leading-relaxed text-muted">
              {profile.about.map((p, i) => (
                <p key={i}>{withBold(p)}</p>
              ))}
            </div>
            {current && (
              <p className="mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm">
                <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 font-mono text-xs font-bold text-background">
                  {current.company[0]}
                </span>
                <span>
                  <span className="block text-subtle">Currently</span>
                  {current.role} @ <span className="text-accent">{current.company}</span>
                </span>
              </p>
            )}
          </Spotlight>
        </div>

        {/* Avatar + location + live time */}
        <div data-reveal style={delay(100)}>
          <Spotlight className="card flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-1.5 animate-spin rounded-full bg-[conic-gradient(var(--accent),var(--accent-2),transparent,var(--accent))] [animation-duration:6s] motion-reduce:animate-none"
              />
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={160}
                  height={160}
                  className="relative size-36 rounded-full border-4 border-card object-cover"
                  sizes="144px"
                />
              ) : (
                <div className="relative grid size-28 place-items-center rounded-full border-4 border-card bg-background text-3xl font-bold">
                  <span className="text-gradient">{initials}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{profile.name}</p>
              <p className="text-sm text-subtle">{profile.role}</p>
            </div>
            {(profile.location || profile.timeZone) && (
              <div className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-xs text-muted">
                {profile.location && <p>📍 {profile.location}</p>}
                {profile.timeZone && (
                  <p className="mt-1">
                    🕒 <LocalTime timeZone={profile.timeZone} />
                  </p>
                )}
              </div>
            )}
          </Spotlight>
        </div>

        {/* Stats */}
        {profile.stats?.length ? (
          <div data-reveal style={delay(200)}>
            <Spotlight className="card grid h-full content-center gap-6 p-8">
              {profile.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-gradient text-4xl font-bold tracking-tight">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-subtle">{stat.label}</p>
                </div>
              ))}
            </Spotlight>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
