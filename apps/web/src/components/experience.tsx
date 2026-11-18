import { content } from "@/content/site";
import { formatMonth } from "@/lib/site";
import { TimelineProgress } from "./interactive/timeline-progress";
import { Spotlight } from "./interactive/spotlight";
import { Section } from "./section";
import { TagList } from "./tag-list";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title={
        <>
          Where I&apos;ve <span className="text-gradient">shipped</span> things.
        </>
      }
    >
      <div className="relative">
        {/* Track + scroll-linked fill */}
        <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px overflow-hidden bg-border md:left-[calc(12rem+7px)]">
          <TimelineProgress />
        </div>

        <ol className="space-y-10">
          {content.experience.map((job) => (
            <li
              key={`${job.company}-${job.start}`}
              data-reveal
              className="relative grid gap-3 pl-10 md:grid-cols-[12rem_1fr] md:gap-10 md:pl-0"
            >
              <p className="font-mono text-xs tracking-wider text-subtle uppercase md:pt-7 md:pr-10 md:text-right">
                <time dateTime={job.start}>{formatMonth(job.start)}</time> —{" "}
                {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : <span className="text-accent">Present</span>}
              </p>

              <span
                aria-hidden
                className="absolute top-1 left-0 grid size-[15px] place-items-center rounded-full border border-accent bg-background md:top-7 md:left-[12rem]"
              >
                <span className={`size-[7px] rounded-full bg-accent ${!job.end ? "animate-pulse" : ""}`} />
              </span>

              <Spotlight as="article" className="card p-6 md:ml-6">
                <h3 className="text-lg font-semibold">
                  {job.role}{" "}
                  <span className="text-accent">
                    @{" "}
                    {job.companyUrl ? (
                      <a href={job.companyUrl} target="_blank" rel="noopener" className="hover:underline">
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </span>
                </h3>
                {job.location && <p className="text-sm text-subtle">{job.location}</p>}
                {job.summary && <p className="mt-3 text-muted">{job.summary}</p>}
                <ul className="mt-4 space-y-2 text-muted">
                  {job.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="mt-1 text-accent">
                        ▹
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                {job.stack && (
                  <div className="mt-5">
                    <TagList items={job.stack} label={`Technologies used at ${job.company}`} />
                  </div>
                )}
              </Spotlight>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
