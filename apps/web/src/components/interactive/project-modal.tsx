"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@portfolio/shared";
import { ProjectCover } from "../project-cover";
import { TagList } from "../tag-list";

/**
 * Invisible full-card button that opens an animated details modal
 * with a screenshot carousel, description, features, stack and links.
 */
export function ProjectModal({ project: p }: { project: Project }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [closing, setClosing] = useState(false);

  const shots = p.gallery?.length ? p.gallery : p.image ? [{ src: p.image, alt: `${p.title} screenshot` }] : [];
  const shot = shots[index];

  const open = () => {
    setIndex(0);
    setClosing(false);
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };

  const finishClose = useCallback(() => {
    dialogRef.current?.close();
    document.documentElement.style.overflow = "";
    setClosing(false);
  }, []);

  const close = useCallback(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) finishClose();
    else setClosing(true); // finishClose runs when the exit animation ends
  }, [finishClose]);

  const go = (delta: 1 | -1) => {
    setDir(delta);
    setIndex((i) => (i + delta + shots.length) % shots.length);
  };

  // Restore scrolling if the component unmounts while open
  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault(); // play the exit animation instead of closing instantly
      close();
    } else if (shots.length > 1 && e.key === "ArrowRight") go(1);
    else if (shots.length > 1 && e.key === "ArrowLeft") go(-1);
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`View details of ${p.title}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      <dialog
        ref={dialogRef}
        aria-labelledby={`${p.slug}-modal-title`}
        data-closing={closing || undefined}
        onKeyDown={onKeyDown}
        onCancel={(e) => e.preventDefault()}
        onClick={(e) => e.target === e.currentTarget && close()}
        onAnimationEnd={(e) => e.target === e.currentTarget && closing && finishClose()}
        className="project-modal m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-3xl border border-border bg-card p-0 text-foreground shadow-2xl"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-baseline gap-3">
              <h3 id={`${p.slug}-modal-title`} className="truncate text-lg font-semibold sm:text-xl">
                {p.title}
              </h3>
              {p.year && <span className="font-mono text-xs text-subtle">{p.year}</span>}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto">
            {/* Carousel */}
            <div className="relative aspect-[1920/990] overflow-hidden border-b border-border bg-background">
              {shot ? (
                <div key={shot.src} className={`absolute inset-0 ${dir === 1 ? "slide-from-right" : "slide-from-left"}`}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <ProjectCover slug={p.slug} />
              )}
              {shots.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous screenshot"
                    className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next screenshot"
                    className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:scale-105 hover:bg-black/80"
                  >
                    →
                  </button>
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">
                    {index + 1} / {shots.length}
                  </p>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {shots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3 sm:px-6">
                {shots.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => {
                      setDir(i >= index ? 1 : -1);
                      setIndex(i);
                    }}
                    aria-label={`Show screenshot ${i + 1}: ${s.alt}`}
                    aria-current={i === index}
                    className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:w-28 ${
                      i === index ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={s.src} alt="" fill sizes="112px" className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Details */}
            <div className="grid gap-8 p-5 sm:p-6 md:grid-cols-[1.4fr_1fr]">
              <div className="modal-stagger" style={{ "--i": 1 } as React.CSSProperties}>
                {shot && <p className="mb-3 font-mono text-xs text-accent">{shot.alt}</p>}
                <p className="leading-relaxed text-muted">{p.description}</p>
                {p.highlights?.length ? (
                  <>
                    <h4 className="mt-6 mb-3 font-mono text-xs tracking-widest text-subtle uppercase">Key features</h4>
                    <ul className="space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-linear-to-br from-accent to-accent-2" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="modal-stagger space-y-6" style={{ "--i": 2 } as React.CSSProperties}>
                <div>
                  <h4 className="mb-3 font-mono text-xs tracking-widest text-subtle uppercase">Tech stack</h4>
                  <TagList items={p.stack} label={`${p.title} tech stack`} />
                </div>
                {(p.url || p.repoUrl) && (
                  <div className="flex flex-wrap gap-3">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener" className="btn btn-primary">
                        Visit live site <span aria-hidden>↗</span>
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noopener" className="btn">
                        Source code <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
