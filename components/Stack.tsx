"use client";

import { useEffect, useRef, useState } from "react";
import { trajectory } from "@/data/content";
import { clamp, easeOutCubic, pinProgress, range } from "@/lib/math";
import { onFrame } from "@/lib/scroll";

/**
 * SOURCE → PRODUCTION, drawn as you scroll. The section pins while the four
 * legs of the flight ink themselves one after another, a capsule riding the
 * leg being drawn; the stack counter ticks up as each leg is flown.
 */

const SECTION_VH = 380;
const WINDOW = [0.06, 0.92] as const;

const SRC = { cx: 230, cy: 320, r: 92 };
const DEST = { cx: 985, cy: 300, r: 46 };

const LEGS = [
  // Orbit around the source: a lap and a bit.
  `M${SRC.cx} ${SRC.cy - 128} a128 128 0 1 1 -0.1 0 a128 128 0 0 1 106 57`,
  // The coast.
  `M${SRC.cx + 106} ${SRC.cy - 71} C 520 40, 820 70, ${DEST.cx - 20} ${DEST.cy - 84}`,
  // Capture into orbit around production.
  `M${DEST.cx - 20} ${DEST.cy - 84} a86 86 0 1 1 -0.1 0.2 a86 86 0 0 1 20 1`,
  // Landing.
  `M${DEST.cx} ${DEST.cy - 86} Q ${DEST.cx + 40} ${DEST.cy - 70} ${DEST.cx + 30} ${DEST.cy - 36}`,
];

const TOTAL = trajectory.legs.reduce((n, l) => n + l.items.length, 0);

export function Stack() {
  const rootRef = useRef<HTMLElement>(null);
  const legRefs = useRef<SVGPathElement[]>([]);
  const capsuleRef = useRef<SVGGElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [leg, setLeg] = useState(0);

  useEffect(() => {
    let lastP = -1;
    let current = 0;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const { p, rect, vh } = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const prog = range(p, ...WINDOW);
      const u = prog * LEGS.length;
      const s = clamp(Math.floor(u), 0, LEGS.length - 1);
      if (s !== current) {
        current = s;
        setLeg(s);
      }
      legRefs.current.forEach((path, i) => {
        const k = easeOutCubic(clamp(u - i));
        path.style.strokeDashoffset = String(1 - k);
        if (i === s) {
          const pt = path.getPointAtLength(path.getTotalLength() * k);
          capsuleRef.current!.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        }
      });
      countRef.current!.textContent = String(Math.round(prog * TOTAL));
    });
  }, []);

  const current = trajectory.legs[leg];

  return (
    <section ref={rootRef} id="trajectory" aria-labelledby="trajectory-title" className="relative bg-void" style={{ height: `${SECTION_VH}svh` }}>
      <div className="sticky top-0 flex h-screen-s flex-col overflow-hidden px-4 pt-20 pb-8 sm:px-6 md:px-[6vw] md:pt-24">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-label text-signal uppercase">{trajectory.eyebrow}</p>
            <h2 id="trajectory-title" className="mt-3 max-w-[22ch] font-display text-display text-white">
              {trajectory.heading}
            </h2>
          </div>
          <p className="font-mono text-label text-regolith/60 uppercase" aria-live="off">
            Stack flown{" "}
            <span ref={countRef} className="text-white tabular-nums">
              0
            </span>{" "}
            / {TOTAL}
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center">
          <svg viewBox="0 0 1200 600" className="h-auto max-h-full w-full" role="img" aria-label="The flight path from source to production, drawn in four legs: languages, frameworks, data and messaging, delivery.">
            <defs>
              <radialGradient id="src-shade" cx="35%" cy="35%" r="75%">
                <stop offset="0" stopColor="#f2e6c9" />
                <stop offset="0.45" stopColor="#d98e4a" />
                <stop offset="1" stopColor="#2a160a" />
              </radialGradient>
              <radialGradient id="dest-shade" cx="35%" cy="35%" r="75%">
                <stop offset="0" stopColor="#bff5ee" />
                <stop offset="0.5" stopColor="#35d0c0" />
                <stop offset="1" stopColor="#08201f" />
              </radialGradient>
              <radialGradient id="src-glow">
                <stop offset="0.8" stopColor="#d98e4a" stopOpacity="0.3" />
                <stop offset="1" stopColor="#d98e4a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Faint star field. */}
            <g fill="#fff">
              {Array.from({ length: 70 }, (_, i) => (
                <circle key={i} cx={(i * 173) % 1200} cy={(i * 97) % 600} r={i % 7 === 0 ? 1.4 : 0.7} opacity={0.15 + ((i * 37) % 50) / 100} />
              ))}
            </g>

            <circle cx={SRC.cx} cy={SRC.cy} r={SRC.r * 1.18} fill="url(#src-glow)" />
            <circle cx={SRC.cx} cy={SRC.cy} r={SRC.r} fill="url(#src-shade)" />
            <circle cx={DEST.cx} cy={DEST.cy} r={DEST.r} fill="url(#dest-shade)" />
            <g fill="none" stroke="#f2e6c9" strokeOpacity="0.16">
              <ellipse cx={SRC.cx} cy={SRC.cy} rx={SRC.r} ry="30" />
              <ellipse cx={DEST.cx} cy={DEST.cy} rx={DEST.r} ry="15" />
            </g>

            {/* Ghost of the full route, then the inked legs over it. */}
            {LEGS.map((d, i) => (
              <path key={`g${i}`} d={d} fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="3 6" />
            ))}
            {LEGS.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  if (el) legRefs.current[i] = el;
                }}
                d={d}
                pathLength={1}
                fill="none"
                stroke={i === 1 ? "#35d0c0" : "#f2e6c9"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 1"
                strokeDashoffset="1"
              />
            ))}

            <g ref={capsuleRef} transform={`translate(${SRC.cx} ${SRC.cy - 128})`}>
              <circle r="11" fill="#35d0c0" opacity="0.25" />
              <circle r="4.5" fill="#fff" />
            </g>

            <g className="font-mono" fontSize="20" letterSpacing="3" fill="#8b909b">
              <text x={SRC.cx} y={SRC.cy + SRC.r + 58} textAnchor="middle">
                {trajectory.start}
              </text>
              <text x={DEST.cx} y={DEST.cy + DEST.r + 70} textAnchor="middle">
                {trajectory.end}
              </text>
            </g>
          </svg>
        </div>

        {/* Current leg. */}
        <div className="grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10">
          <p className="font-mono text-label text-signal uppercase">
            {current.day} · Leg {leg + 1}/{trajectory.legs.length}
          </p>
          <div key={leg} className="animate-leg-in" aria-live="polite">
            <h3 className="font-display text-[1.125rem] tracking-[0.08em] text-white uppercase md:text-[1.375rem]">{current.title}</h3>
            <p className="mt-1.5 max-w-[40rem] text-body text-regolith/70 max-md:hidden">{current.body}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {current.items.map((item) => (
                <li key={item} className="rounded-[4px] border border-white/15 px-2.5 py-1 font-mono text-[0.6875rem] text-white/90">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            {trajectory.legs.map((_, i) => (
              <span key={i} className={`h-1 w-8 rounded-full transition-colors duration-500 ${i <= leg ? "bg-signal" : "bg-white/15"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
