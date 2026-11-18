"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

function hexToRgb(hex: string) {
  const m = hex.trim().replace("#", "");
  const n = parseInt(m.length === 3 ? m.replace(/./g, "$&$&") : m, 16);
  return Number.isNaN(n) ? "94,234,212" : `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/** Interactive particle constellation. Particles drift, link up, and react to the cursor. */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LINK = 120;
    const MOUSE = 170;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let particles: Particle[] = [];
    let c1 = "94,234,212";
    let c2 = "167,139,250";
    const mouse = { x: -9999, y: -9999 };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      c1 = hexToRgb(s.getPropertyValue("--accent"));
      c2 = hexToRgb(s.getPropertyValue("--accent-2"));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(120, (w * h) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
      }));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (!reduce) {
          // gentle push away from the cursor
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE && d > 0) {
            const f = (1 - d / MOUSE) * 0.6;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${c1},${(1 - d / LINK) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < MOUSE) {
          ctx.strokeStyle = `rgba(${c2},${(1 - md / MOUSE) * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${md < MOUSE ? c2 : c1},0.75)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (visible && !document.hidden) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      if (reduce) draw();
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    readColors();
    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", readColors);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      mq.removeEventListener("change", readColors);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />;
}
