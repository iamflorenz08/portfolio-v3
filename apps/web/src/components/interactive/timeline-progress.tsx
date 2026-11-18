"use client";

import { useEffect, useRef } from "react";

/** Vertical line that fills as the timeline scrolls through the viewport. */
export function TimelineProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    const track = bar?.parentElement;
    if (!bar || !track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - rect.top) / rect.height));
      bar.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent-2"
      style={{ transform: "scaleY(0)" }}
    />
  );
}
