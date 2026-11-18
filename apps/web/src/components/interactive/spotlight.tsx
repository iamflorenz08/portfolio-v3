"use client";

import { useRef } from "react";

/**
 * Wraps content in a card that glows under the cursor and (optionally) tilts in 3D.
 */
export function Spotlight({
  children,
  className = "",
  tilt = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const rx = (y / rect.height - 0.5) * -7;
      const ry = (x / rect.width - 0.5) * 7;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
  };

  const onLeave = () => {
    if (ref.current && tilt) ref.current.style.transform = "";
  };

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spotlight transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </Tag>
  );
}
