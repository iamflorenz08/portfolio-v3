"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = 'a, button, [role="button"], summary, label, select, [data-cursor="hover"]';
const TEXT_FIELD = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

type TrailPoint = { x: number; y: number; life: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: 0 | 1 };

/**
 * Animated cursor: a precise dot, a springy ring that morphs over interactive
 * elements, a glowing gradient trail and a spark burst on click.
 * Only active for fine pointers (mouse/trackpad) without reduced-motion.
 */
export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const canvas = canvasRef.current!;
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const ctx = canvas.getContext("2d")!;
    const root = document.documentElement;
    root.classList.add("custom-cursor");

    // Keep the cursor in the top layer and re-raise it whenever a modal dialog opens,
    // otherwise the dialog (also top layer) would cover it.
    const layer = canvas.parentElement!;
    const raise = () => {
      if (!layer.showPopover) return;
      if (layer.matches(":popover-open")) layer.hidePopover();
      layer.showPopover();
    };
    raise();
    const dialogObserver = new MutationObserver((records) => {
      if (records.some((r) => r.target instanceof HTMLDialogElement && r.target.open)) raise();
    });
    dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });

    let colors: [string, string] = ["#5eead4", "#a78bfa"];
    const readColors = () => {
      const cs = getComputedStyle(root);
      colors = [cs.getPropertyValue("--accent").trim(), cs.getPropertyValue("--accent-2").trim()];
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const schemeMq = matchMedia("(prefers-color-scheme: dark)");
    schemeMq.addEventListener("change", readColors);

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const trail: TrailPoint[] = [];
    const sparks: Spark[] = [];
    let visible = false;
    let raf = 0;

    const setState = (name: string, on: boolean) => ring.classList.toggle(name, on);

    const tick = () => {
      // Springy ring follow
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;

      ctx.clearRect(0, 0, innerWidth, innerHeight);

      // Trail: fading, tapering gradient ribbon
      for (const p of trail) p.life -= 0.045;
      while (trail[0] && trail[0].life <= 0) trail.shift();
      if (trail.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 12;
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1]!;
          const b = trail[i]!;
          const t = i / trail.length;
          const color = t > 0.5 ? colors[0] : colors[1];
          ctx.globalAlpha = b.life * 0.55;
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
          ctx.lineWidth = 1 + t * 3.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy = s.vy * 0.92 + 0.08;
        s.life -= 0.03;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = colors[s.hue];
        ctx.shadowColor = colors[s.hue];
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      const settled = Math.abs(mouse.x - ringPos.x) < 0.1 && Math.abs(mouse.y - ringPos.y) < 0.1;
      raf = settled && !trail.length && !sparks.length ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
        root.classList.add("cursor-visible");
      }
      trail.push({ x: mouse.x, y: mouse.y, life: 1 });
      if (trail.length > 28) trail.shift();

      const target = e.target as Element | null;
      const overText = !!target?.closest?.(TEXT_FIELD);
      setState("is-text", overText);
      setState("is-hover", !overText && !!target?.closest?.(INTERACTIVE));
      wake();
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setState("is-down", true);
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const speed = 2 + Math.random() * 3.5;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1.5 + Math.random() * 2,
          hue: (i % 2) as 0 | 1,
        });
      }
      wake();
    };
    const onUp = () => setState("is-down", false);
    const onLeave = () => {
      visible = false;
      root.classList.remove("cursor-visible");
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      dialogObserver.disconnect();
      if (layer.matches(":popover-open")) layer.hidePopover();
      schemeMq.removeEventListener("change", readColors);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("blur", onLeave);
      root.classList.remove("custom-cursor", "cursor-visible");
    };
  }, []);

  return (
    <div aria-hidden popover="manual" className="cursor-layer">
      <canvas ref={canvasRef} className="cursor-canvas" />
      <div ref={ringRef} className="cursor-ring">
        <span />
      </div>
      <div ref={dotRef} className="cursor-dot">
        <span />
      </div>
    </div>
  );
}
