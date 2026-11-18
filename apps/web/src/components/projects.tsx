import Image from "next/image";
import { content } from "@/content/site";
import { ProjectCover } from "./project-cover";
import { ProjectModal } from "./interactive/project-modal";
import { Spotlight } from "./interactive/spotlight";
import { Section } from "./section";
import { TagList } from "./tag-list";

export function Projects() {
  const projects = [...content.projects].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || (b.year ?? 0) - (a.year ?? 0),
  );

  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Selected work"
      title={
        <>
          Things I&apos;ve <span className="text-gradient">built</span>.
        </>
      }
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          return (
            <li key={p.slug} data-reveal style={{ "--delay": `${(i % 2) * 120}ms` } as React.CSSProperties}>
              <Spotlight as="article" tilt className="card group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={`${p.title} screenshot`}
                      fill
                      // First row (2 cols on md+) can be the LCP element
                      loading={i < 2 ? "eager" : "lazy"}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ProjectCover slug={p.slug} />
                  )}
                  {(p.gallery?.length ?? 0) > 1 && (
                    <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur">
                      {p.gallery!.length} screenshots
                    </span>
                  )}
                  {p.featured && (
                    <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white uppercase backdrop-blur">
                      ★ Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold transition-colors group-hover:text-accent">{p.title}</h3>
                    {p.year && <span className="font-mono text-xs text-subtle">{p.year}</span>}
                  </div>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{p.description}</p>
                  <div className="mt-5">
                    <TagList items={p.stack} label={`${p.title} tech stack`} />
                  </div>
                  <p className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-subtle transition-colors group-hover:text-accent">
                    View details
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
                <ProjectModal project={p} />
              </Spotlight>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
