"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type * as MatterNS from "matter-js";
import { techIcon, type TechIcon } from "@/lib/tech-icons";

export type StackGroup = { category: string; items: string[] };

type Kind = "root" | "hub" | "leaf";
type Node = {
  body: MatterNS.Body;
  kind: Kind;
  label: string;
  group: number;
  w: number;
  h: number;
  icon?: { def: TechIcon; path: Path2D };
};

const ICON = 16;
const LEAF_PAD = 12;
const ICON_GAP = 8;

/** Brand colors that vanish on the background (pure black/white) fall back to the text color. */
function iconColor(hex: string | undefined, fallback: string) {
  if (!hex) return fallback;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return l < 0.12 || l > 0.92 ? fallback : hex;
}

function IconSvg({ label, className }: { label: string; className?: string }) {
  const icon = techIcon(label);
  if (!icon) return <span aria-hidden className={`size-1.5 rounded-full bg-current ${className ?? ""}`} />;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`size-4 shrink-0 ${className ?? ""}`}
      fill={icon.stroke ? "none" : "currentColor"}
      stroke={icon.stroke ? "currentColor" : "none"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={icon.hex && iconColor(icon.hex, "") ? { color: icon.hex } : undefined}
    >
      <path d={icon.path} />
    </svg>
  );
}
type Edge = { a: Node; b: Node };

const FIXED_STEP = 1000 / 60;
const RM = "(prefers-reduced-motion: reduce)";

function subscribeRM(cb: () => void) {
  const mq = matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Force-directed tech graph powered by Matter.js: a root node links to category hubs,
 * each hub has its technologies orbiting on springs. Everything is draggable.
 */
export function TechStackEngine({ groups }: { groups: StackGroup[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rebuildRef = useRef<() => void>(() => {});
  const reduced = useSyncExternalStore(subscribeRM, () => matchMedia(RM).matches, () => false);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let disposed = false;
    let cleanup = () => {};
    import("matter-js").then((Matter) => {
      if (!disposed) cleanup = start(Matter, wrap, canvas, ctx, groups, rebuildRef);
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [groups, reduced]);

  if (reduced) {
    return (
      <dl className="mx-auto grid max-w-5xl gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <div key={g.category}>
            <dt className={`mb-2 font-mono text-xs tracking-widest uppercase ${i % 2 ? "text-accent-2" : "text-accent"}`}>
              {g.category}
            </dt>
            {g.items.map((it) => (
              <dd key={it} className="flex items-center gap-2 py-0.5 font-mono text-sm text-muted">
                <IconSvg label={it} className={i % 2 ? "text-accent-2" : "text-accent"} />
                {it}
              </dd>
            ))}
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div ref={wrapRef} className="relative h-[30rem] md:h-[26rem]">
      <dl className="sr-only">
        {groups.map((g) => (
          <div key={g.category}>
            <dt>{g.category}</dt>
            {g.items.map((it) => (
              <dd key={it}>{it}</dd>
            ))}
          </div>
        ))}
      </dl>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full touch-pan-y font-mono select-none" />
      <div className="pointer-events-none absolute top-4 left-6 font-mono text-xs text-subtle">
        <span className="text-accent">$</span> stack --graph
      </div>
      <button
        type="button"
        onClick={() => rebuildRef.current()}
        className="absolute top-3 right-4 rounded-full border border-border bg-card/80 px-3 py-1 font-mono text-xs text-muted backdrop-blur transition-colors hover:border-accent hover:text-foreground"
      >
        ↻ rebuild
      </button>
      <p className="pointer-events-none absolute bottom-3 left-6 hidden font-mono text-[11px] text-subtle md:block">
        drag the nodes
      </p>
    </div>
  );
}

function start(
  Matter: typeof MatterNS,
  wrap: HTMLDivElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  groups: StackGroup[],
  rebuildRef: React.RefObject<() => void>,
) {
  const { Engine, Bodies, Body, Composite, Constraint, Query } = Matter;

  const engine = Engine.create();
  engine.gravity.y = 0;
  const world = engine.world;

  let w = 0;
  let h = 0;
  let raf = 0;
  let visible = false;
  let started = false;
  let last = 0;
  let acc = 0;
  let time = 0;
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  let anchors: { hub: Node; c: MatterNS.Constraint }[] = [];
  let timers: number[] = [];
  let drag: MatterNS.Constraint | null = null;
  let hover: Node | null = null;

  const fontFamily = getComputedStyle(canvas).fontFamily;
  const fonts = {
    root: `600 13px ${fontFamily}`,
    hub: `600 11px ${fontFamily}`,
    leaf: `500 13px ${fontFamily}`,
  };
  let colors = readColors();

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const v = (n: string) => s.getPropertyValue(n).trim();
    return {
      bg: v("--background"),
      card: v("--card"),
      border: v("--border"),
      fg: v("--foreground"),
      muted: v("--muted"),
      subtle: v("--subtle"),
      accent: v("--accent"),
      accent2: v("--accent-2"),
    };
  }

  const tint = (g: number) => (g % 2 ? colors.accent2 : colors.accent);

  /** Where each hub wants to sit: spread on an ellipse around the center. */
  function hubTarget(i: number) {
    const n = groups.length;
    const a = -Math.PI * 0.75 + (i / n) * Math.PI * 2;
    const rx = Math.min(w * 0.3, 380);
    const ry = Math.min(h * 0.27, 150);
    return { x: w / 2 + Math.cos(a) * rx, y: h / 2 + Math.sin(a) * ry };
  }

  const leafLen = () => Math.max(62, Math.min(w / 13, 92));

  function clear() {
    timers.forEach(clearTimeout);
    timers = [];
    Composite.clear(world, false);
    nodes = [];
    edges = [];
    anchors = [];
    drag = null;
    hover = null;
  }

  function makeNode(kind: Kind, label: string, group: number, x: number, y: number): Node {
    ctx.font = fonts[kind];
    const text = kind === "hub" ? label.toUpperCase() : label;
    const tw = Math.ceil(ctx.measureText(text).width);
    const def = kind === "leaf" ? techIcon(label) : undefined;
    const hgt = kind === "root" ? 52 : kind === "hub" ? 30 : 34;
    const wid = kind === "root" ? 52 : kind === "hub" ? tw + 26 : tw + LEAF_PAD * 2 + ICON + ICON_GAP;
    const body =
      kind === "root"
        ? Bodies.circle(x, y, 26, { isStatic: true })
        : Bodies.rectangle(x, y, wid, hgt, {
            chamfer: { radius: hgt / 2 },
            frictionAir: kind === "hub" ? 0.12 : 0.06,
            inertia: Infinity, // keep labels upright
            collisionFilter: { group: -1 }, // no collisions during the burst
          });
    Composite.add(world, body);
    const node: Node = { body, kind, label: text, group, w: wid, h: hgt };
    if (def) node.icon = { def, path: new Path2D(def.path) };
    nodes.push(node);
    return node;
  }

  function spring(a: Node, b: Node, length: number, stiffness: number) {
    Composite.add(world, Constraint.create({ bodyA: a.body, bodyB: b.body, length, stiffness, damping: 0.05 }));
    edges.push({ a, b });
  }

  function build() {
    clear();
    const cx = w / 2;
    const cy = h / 2;
    const root = makeNode("root", "me", -1, cx, cy);

    groups.forEach((g, gi) => {
      const t = window.setTimeout(() => {
        const target = hubTarget(gi);
        const hub = makeNode("hub", g.category, gi, cx, cy);
        const c = Constraint.create({ pointA: target, bodyB: hub.body, length: 0, stiffness: 0.015, damping: 0.1 });
        Composite.add(world, c);
        anchors.push({ hub, c });
        edges.push({ a: root, b: hub });

        g.items.forEach((label, li) => {
          const t2 = window.setTimeout(() => {
            const leaf = makeNode("leaf", label, gi, hub.body.position.x, hub.body.position.y);
            spring(hub, leaf, leafLen(), 0.03);
            Body.setVelocity(leaf.body, { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 });
          }, 260 + li * 120);
          timers.push(t2);
        });
      }, gi * 220);
      timers.push(t);
    });

    // turn collisions on once everything has spread out
    timers.push(
      window.setTimeout(
        () => {
          for (const n of nodes) n.body.collisionFilter.group = 0;
        },
        groups.length * 220 + 1100,
      ),
    );
  }

  function forces() {
    const L = leafLen();
    for (const n of nodes) {
      if (n.kind !== "leaf" || n.body === drag?.bodyB) continue;
      const hub = edges.find((e) => e.b === n)?.a;
      if (!hub) continue;
      // tangential nudge => slow orbit around the hub
      const dx = n.body.position.x - hub.body.position.x;
      const dy = n.body.position.y - hub.body.position.y;
      const d = Math.hypot(dx, dy) || 1;
      const k = 0.000035 * n.body.mass * (n.group % 2 ? -1 : 1);
      Body.applyForce(n.body, n.body.position, { x: (-dy / d) * k, y: (dx / d) * k });
      // repel siblings so they spread evenly around the hub
      for (const m of nodes) {
        if (m === n || m.kind !== "leaf" || m.group !== n.group) continue;
        const rx = n.body.position.x - m.body.position.x;
        const ry = n.body.position.y - m.body.position.y;
        const rd = Math.hypot(rx, ry) || 1;
        if (rd < L * 1.6) {
          const f = 0.00006 * n.body.mass * (1 - rd / (L * 1.6));
          Body.applyForce(n.body, n.body.position, { x: (rx / rd) * f, y: (ry / rd) * f });
        }
      }
      // stay inside the canvas
      const m = 8;
      const hw = n.w / 2;
      const hh = n.h / 2;
      const p = n.body.position;
      const cx = Math.min(Math.max(p.x, hw + m), w - hw - m);
      const cy = Math.min(Math.max(p.y, hh + m), h - hh - m);
      if (cx !== p.x || cy !== p.y) {
        Body.setPosition(n.body, { x: cx, y: cy });
        Body.setVelocity(n.body, { x: n.body.velocity.x * -0.3, y: n.body.velocity.y * -0.3 });
      }
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const root = nodes.find((n) => n.kind === "root");
    if (root) Body.setPosition(root.body, { x: w / 2, y: h / 2 });
    anchors.forEach(({ c }, i) => (c.pointA = hubTarget(i)));
    draw();
  }

  function pill(n: Node, fill: string, stroke: string, lw: number) {
    ctx.beginPath();
    ctx.roundRect(n.body.position.x - n.w / 2, n.body.position.y - n.h / 2, n.w, n.h, n.h / 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const focus = drag ? nodes.find((n) => n.body === drag!.bodyB) ?? hover : hover;
    const focusGroup = focus && focus.kind !== "root" ? focus.group : null;

    // edges
    for (const e of edges) {
      const isRoot = e.a.kind === "root";
      const g = e.b.group;
      const lit = focusGroup === g || focus?.kind === "root";
      ctx.beginPath();
      ctx.moveTo(e.a.body.position.x, e.a.body.position.y);
      ctx.lineTo(e.b.body.position.x, e.b.body.position.y);
      ctx.lineWidth = lit ? 1.5 : 1;
      ctx.globalAlpha = focusGroup !== null && !lit ? 0.35 : 1;
      if (isRoot) {
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time / 40;
        ctx.strokeStyle = tint(g);
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = lit ? tint(g) : colors.border;
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // travelling packets on root edges
    for (const e of edges) {
      if (e.a.kind !== "root") continue;
      const t = ((time / 1600 + e.b.group * 0.25) % 1 + 1) % 1;
      const x = e.a.body.position.x + (e.b.body.position.x - e.a.body.position.x) * t;
      const y = e.a.body.position.y + (e.b.body.position.y - e.a.body.position.y) * t;
      ctx.globalAlpha = Math.sin(t * Math.PI) * (focusGroup !== null && focusGroup !== e.b.group ? 0.35 : 1);
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = tint(e.b.group);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // nodes
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const n of nodes) {
      const { x, y } = n.body.position;
      const dim = focusGroup !== null && n.group !== focusGroup && n.kind !== "root";
      ctx.globalAlpha = dim ? 0.45 : 1;
      if (n.kind === "root") {
        const pulse = 4 + Math.sin(time / 500) * 3;
        ctx.beginPath();
        ctx.arc(x, y, 26 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = colors.accent;
        ctx.globalAlpha = 0.12;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, Math.PI * 2);
        ctx.fillStyle = colors.fg;
        ctx.fill();
        ctx.font = fonts.root;
        ctx.fillStyle = colors.bg;
        ctx.fillText("</>", x, y + 1);
      } else if (n.kind === "hub") {
        const c = tint(n.group);
        pill(n, c, c, 1);
        ctx.font = fonts.hub;
        ctx.fillStyle = colors.bg;
        ctx.fillText(n.label, x, y + 1);
      } else {
        const active = focus === n || focusGroup === n.group;
        pill(n, colors.card, active ? tint(n.group) : colors.border, active ? 1.5 : 1);
        const left = x - n.w / 2 + LEAF_PAD;
        if (n.icon) {
          const { def, path } = n.icon;
          ctx.save();
          ctx.translate(left, y - ICON / 2);
          ctx.scale(ICON / 24, ICON / 24);
          if (def.stroke) {
            ctx.strokeStyle = def.hex ?? tint(n.group);
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke(path);
          } else {
            ctx.fillStyle = iconColor(def.hex, colors.fg);
            ctx.fill(path);
          }
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(left + ICON / 2, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = tint(n.group);
          ctx.fill();
        }
        ctx.font = fonts.leaf;
        ctx.textAlign = "left";
        ctx.fillStyle = active ? colors.fg : colors.muted;
        ctx.fillText(n.label, left + ICON + ICON_GAP, y + 1);
        ctx.textAlign = "center";
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop(t: number) {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) {
      last = t;
      return;
    }
    acc += Math.min(t - (last || t), 100);
    last = t;
    while (acc >= FIXED_STEP) {
      forces();
      Engine.update(engine, FIXED_STEP);
      acc -= FIXED_STEP;
      time += FIXED_STEP;
    }
    draw();
  }

  // ── pointer interaction ──
  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const draggable = () => nodes.filter((n) => n.kind !== "root").map((n) => n.body);
  const nodeAt = (p: { x: number; y: number }) => {
    const b = Query.point(
      nodes.map((n) => n.body),
      p,
    )[0];
    return nodes.find((n) => n.body === b) ?? null;
  };

  const onDown = (e: PointerEvent) => {
    const p = local(e);
    const [body] = Query.point(draggable(), p);
    if (!body) return;
    drag = Constraint.create({
      pointA: p,
      bodyB: body,
      pointB: { x: 0, y: 0 },
      stiffness: 0.2,
      damping: 0.1,
      length: 0.01,
    });
    Composite.add(world, drag);
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  };

  const onMove = (e: PointerEvent) => {
    const p = local(e);
    if (drag) {
      drag.pointA = p;
      return;
    }
    hover = nodeAt(p);
    canvas.style.cursor = hover && hover.kind !== "root" ? "grab" : "";
  };

  const onUp = (e: PointerEvent) => {
    if (drag) Composite.remove(world, drag);
    drag = null;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = hover && hover.kind !== "root" ? "grab" : "";
  };

  const onLeave = () => {
    if (!drag) hover = null;
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onLeave);

  rebuildRef.current = () => {
    started = true;
    build();
  };

  resize();
  raf = requestAnimationFrame(loop);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible && !started) {
        started = true;
        build();
      }
    },
    { threshold: 0.35 },
  );
  io.observe(wrap);

  const onTheme = () => {
    colors = readColors();
    draw();
  };
  const mo = new MutationObserver(onTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onTheme);

  return () => {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    mq.removeEventListener("change", onTheme);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    canvas.removeEventListener("pointerleave", onLeave);
    rebuildRef.current = () => {};
    Composite.clear(world, false);
    Engine.clear(engine);
  };
}
