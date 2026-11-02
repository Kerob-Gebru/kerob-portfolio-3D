"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { hero } from "@/data/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { onFrame } from "@/lib/scroll";

/**
 * The hero. Six layers drawn in SVG, stacked and pinned; one scroll range
 * moves each at its own rate:
 *
 *   0.00 – 0.18  a veil of dust drifts off the lens
 *   0.04 – 0.50  the orb climbs out from behind the ridgeline
 *   0.08 – 0.50  KEROB resolves between the ridges and the cliffs
 *   0.28 – 0.60  the cliffs close in around the view, the acacia and ground rise
 *   0.70 – 1.00  everything tilts away upward and the ground swallows the
 *                frame to black, which is where the page continues
 *
 * A thin telemetry HUD rides on top: scroll clock, orb elevation, coordinates.
 * No images: every layer is generated SVG, so there is nothing to download.
 */

const STAGE_VH = 440;

type LayerName = "sky" | "orb" | "far" | "frame" | "tree" | "ground";
const ORDER: LayerName[] = ["sky", "orb", "far", "frame", "tree", "ground"];

const W = 1600;
const H = 900;

/** Deterministic PRNG so server and client render identical paths. */
function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** A ridgeline: two octaves of smoothed value noise, filled down to the floor. */
function ridge(seed: number, base: number, amp: number, coarse: number) {
  const r = lcg(seed);
  const a = Array.from({ length: coarse + 1 }, () => r());
  const b = Array.from({ length: coarse * 3 + 1 }, () => r());
  const f = (arr: number[], t: number) => {
    const x = t * (arr.length - 1);
    const i = Math.min(arr.length - 2, Math.floor(x));
    const u = x - i;
    const k = u * u * (3 - 2 * u);
    return arr[i] * (1 - k) + arr[i + 1] * k;
  };
  const N = 96;
  let d = `M0 ${H} `;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = base - (f(a, t) * amp + f(b, t) * amp * 0.35);
    d += `L${(t * W).toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}L${W} ${H} Z`;
}

const FAR = ridge(7, 650, 70, 6);
const FAR_2 = ridge(23, 700, 80, 5);
const NEAR = ridge(41, 830, 60, 4);

const STARS = (() => {
  const r = lcg(97);
  return Array.from({ length: 90 }, () => ({
    x: r() * W,
    y: r() * 520,
    r: 0.5 + r() * 1.3,
    o: 0.2 + r() * 0.6,
  }));
})();

const svgProps = {
  viewBox: `0 0 ${W} ${H}`,
  preserveAspectRatio: "xMidYMax slice",
  className: "absolute inset-0 size-full",
  "aria-hidden": true,
} as const;

const ART: Record<LayerName, ReactNode> = {
  sky: (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="sky-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04060b" />
          <stop offset="0.55" stopColor="#0a1020" />
          <stop offset="0.82" stopColor="#1a1a24" />
          <stop offset="1" stopColor="#3a2a22" />
        </linearGradient>
        <radialGradient id="sky-glow" cx="0.54" cy="0.62" r="0.5">
          <stop offset="0" stopColor="#d98e4a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#d98e4a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky-g)" />
      <rect width={W} height={H} fill="url(#sky-glow)" />
      <g fill="#fff">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} opacity={s.o.toFixed(2)} />
        ))}
      </g>
    </svg>
  ),
  orb: (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="orb-body" cx="0.38" cy="0.34" r="0.8">
          <stop offset="0" stopColor="#f2e6c9" />
          <stop offset="0.35" stopColor="#d98e4a" />
          <stop offset="0.75" stopColor="#6b3a1e" />
          <stop offset="1" stopColor="#1c0f08" />
        </radialGradient>
        <radialGradient id="orb-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.72" stopColor="#35d0c0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#35d0c0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="800" cy="470" r="225" fill="url(#orb-halo)" />
      <circle cx="800" cy="470" r="165" fill="url(#orb-body)" />
      <g fill="none" stroke="#f2e6c9" strokeOpacity="0.14">
        <ellipse cx="800" cy="470" rx="165" ry="50" />
        <ellipse cx="800" cy="470" rx="165" ry="102" />
        <ellipse cx="800" cy="470" rx="62" ry="165" />
      </g>
      <circle cx="800" cy="470" r="165" fill="none" stroke="#35d0c0" strokeOpacity="0.5" strokeWidth="2" />
    </svg>
  ),
  far: (
    <svg {...svgProps}>
      <path d={FAR} fill="#0d121c" />
      <path d={FAR_2} fill="#0a0e17" />
    </svg>
  ),
  frame: (
    <svg {...svgProps}>
      <path d={`M0 0 L0 ${H} L260 ${H} C230 700 120 520 170 300 C200 180 120 60 0 0 Z`} fill="#05070b" />
      <path d={`M${W} 0 L${W} ${H} L1340 ${H} C1370 720 1480 540 1430 320 C1400 190 1480 70 ${W} 0 Z`} fill="#05070b" />
      <path d={`M0 0 H${W} V70 C1200 120 400 120 0 70 Z`} fill="#04060a" />
    </svg>
  ),
  tree: (
    <svg {...svgProps}>
      <g fill="#020406">
        <path d="M786 880 C790 800 782 750 760 700 L770 696 C786 722 800 736 806 750 C812 730 826 714 850 696 L858 702 C836 724 824 748 822 780 C820 820 822 850 828 880 Z" />
        <ellipse cx="800" cy="668" rx="125" ry="16" />
        <ellipse cx="735" cy="686" rx="62" ry="12" />
        <ellipse cx="868" cy="684" rx="66" ry="12" />
        <ellipse cx="805" cy="652" rx="78" ry="10" />
      </g>
    </svg>
  ),
  ground: (
    <svg {...svgProps}>
      <path d={NEAR} fill="#05070c" />
    </svg>
  ),
};

type Mote = { x: number; y: number; r: number; s: number; a: number };

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<Partial<Record<LayerName, HTMLDivElement>>>({});
  const veilRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);
  const elevRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  // Dust canvas size.
  useEffect(() => {
    const c = dustRef.current!;
    const sync = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = dustRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rand = lcg(11);
    const motes: Mote[] = Array.from({ length: 140 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.4 + rand() * 1.6,
      s: 0.3 + rand(),
      a: 0.2 + rand() * 0.6,
    }));
    let lastP = -1;
    let lastTime = 0;

    const set = (name: LayerName, y: number, scale = 1, opacity = 1) => {
      const el = layerRefs.current[name];
      if (!el) return;
      el.style.transform = `translate3d(0, ${y}vh, 0) scale(${scale})`;
      el.style.opacity = String(opacity);
    };

    return onFrame((time) => {
      const dt = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0) return;

      // Dust drifts every frame while it's visible.
      const veil = 1 - range(p, 0, 0.18);
      if (veil > 0.001) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = canvas.width / Math.max(1, w);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#dfe6f2";
        for (const m of motes) {
          if (!reducedRef.current) {
            m.x += 0.006 * m.s * dt;
            m.y -= 0.004 * m.s * dt;
            if (m.x > 1) m.x -= 1;
            if (m.y < 0) m.y += 1;
          }
          ctx.globalAlpha = m.a * veil;
          ctx.beginPath();
          ctx.arc(m.x * w, (m.y - p * 0.6) * h, m.r * (1 + p * 4), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const exit = range(p, 0.7, 1);
      const settle = easeOutCubic(range(p, 0, 0.5));

      // Veil clears upward.
      veilRef.current!.style.opacity = String(veil);
      veilRef.current!.style.transform = `translate3d(0, ${-range(p, 0, 0.18) * 24}vh, 0) scale(${1 + range(p, 0, 0.18) * 0.25})`;
      canvas.style.opacity = String(veil);

      // Far → near, each faster than the one behind it.
      set("sky", lerp(0, -6, p), lerp(1.14, 1, settle));
      const rise = easeOutCubic(range(p, 0.04, 0.5));
      set("orb", lerp(34, 0, rise) - exit * 12, lerp(0.92, 1, rise));
      set("far", lerp(9, 0, settle) - exit * 26);
      const rim = easeOutCubic(range(p, 0.28, 0.58));
      set("frame", -exit * 44, lerp(1.6, 1, rim), rim);
      const up = easeOutCubic(range(p, 0.36, 0.62));
      set("tree", lerp(28, 0, up) - exit * 58, 1, clamp(up * 2));
      const ground = easeOutCubic(range(p, 0.34, 0.6));
      set("ground", lerp(36, 0, ground) - exit * 78);

      // Title: resolves (tracking closes in), then yields to the cliffs.
      const tIn = easeOutCubic(range(p, 0.08, 0.24));
      const tOut = range(p, 0.42, 0.52);
      const title = titleRef.current!;
      title.style.opacity = String(tIn * (1 - tOut));
      title.style.letterSpacing = `${lerp(0.6, 0.24, tIn)}em`;
      title.style.transform = `translate3d(0, ${-p * 6}vh, 0)`;
      title.style.filter = tIn < 0.99 ? `blur(${(1 - tIn) * 10}px)` : "";

      // Telemetry.
      hudRef.current!.style.opacity = String(range(p, 0.02, 0.1) * (1 - range(p, 0.62, 0.72)));
      const secs = p * 5400;
      clockRef.current!.textContent = `T+ ${String(Math.floor(secs / 3600)).padStart(2, "0")}:${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
      elevRef.current!.textContent = `${(rise * 12.4).toFixed(1)}°`;
    });
  }, []);

  const layer = (name: LayerName) => (
    <div
      key={name}
      ref={(el) => {
        if (el) layerRefs.current[name] = el;
      }}
      className="absolute inset-0 will-change-transform"
    >
      {ART[name]}
      {/* The ground carries a black apron below it, so when it climbs it
          fills the screen and hands straight over to the page below. */}
      {name === "ground" && <div className="absolute inset-x-0 top-full h-[110vh] bg-void" />}
    </div>
  );

  return (
    <section id="top" ref={rootRef} aria-label="Introduction" className="relative" style={{ height: `${STAGE_VH}svh` }}>
      <div className="sticky top-0 h-screen-s overflow-hidden bg-void">
        {ORDER.slice(0, 3).map((n) => layer(n))}

        {/* Title sits between the ridges and the cliffs. */}
        <div ref={titleRef} className="pointer-events-none absolute inset-x-0 top-[26%] text-center md:top-[30%]" style={{ opacity: 0 }}>
          <h1 className="font-display text-hero text-white [text-shadow:0_4px_40px_rgb(0_0_0/0.5)]" style={{ marginRight: "-0.24em" }}>
            {hero.title}
          </h1>
          <p className="mt-4 font-mono text-label text-white/90 uppercase [text-shadow:0_1px_14px_rgb(0_0_0/0.9)]">{hero.kicker}</p>
        </div>

        {ORDER.slice(3).map((n) => layer(n))}

        {/* Dust on the lens. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 40%, rgba(170,184,210,0.55), transparent 70%), radial-gradient(50% 60% at 75% 60%, rgba(120,140,180,0.5), transparent 70%), radial-gradient(80% 80% at 50% 50%, rgba(20,26,40,0.85), rgba(5,7,12,0.95))",
          }}
        >
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
            <p className="font-mono text-label text-regolith/80 uppercase">{hero.kicker}</p>
            <p className="mt-3 font-display text-[0.8125rem] tracking-[0.5em] text-white/90 uppercase" style={{ marginRight: "-0.5em" }}>
              Scroll to begin
            </p>
            <span aria-hidden="true" className="mt-6 inline-block animate-bounce text-regolith/70 motion-reduce:animate-none">
              ↓
            </span>
          </div>
        </div>
        <canvas ref={dustRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />

        {/* Telemetry HUD. */}
        <div ref={hudRef} aria-hidden="true" className="pointer-events-none absolute inset-4 font-mono text-[0.625rem] tracking-[0.14em] text-regolith/75 uppercase sm:inset-6 md:text-label" style={{ opacity: 0 }}>
          <div className="brackets absolute inset-0 text-regolith/40" />
          <div className="absolute top-16 left-3 space-y-1 md:top-20 md:left-4">
            <p ref={clockRef}>T+ 00:00:00</p>
            <p className="text-regolith/50">Scroll clock</p>
          </div>
          <div className="absolute top-16 right-3 space-y-1 text-right md:top-20 md:right-4">
            <p>
              Elev <span ref={elevRef} className="text-signal">0.0°</span>
            </p>
            <p className="text-regolith/50">Above horizon</p>
          </div>
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">{hero.site}</div>
          <div className="absolute right-3 bottom-3 flex items-center gap-2 md:right-4 md:bottom-4">
            Scroll <span className="inline-block animate-bounce motion-reduce:animate-none">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
