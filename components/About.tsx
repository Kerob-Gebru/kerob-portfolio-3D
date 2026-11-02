"use client";

import type { CSSProperties } from "react";
import { about } from "@/data/content";
import { useReveals } from "@/hooks/useReveals";

export function About() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="relative bg-void px-4 py-28 sm:px-6 md:px-[6vw] md:py-40">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div data-reveal>
          <p className="font-mono text-label text-signal uppercase">{about.eyebrow}</p>
          <h2 id="about-title" className="mt-4 font-display text-display text-white">
            {about.heading}
          </h2>
        </div>
        <div className="space-y-10" data-reveal style={{ "--d": "110ms" } as CSSProperties}>
          <div className="space-y-4 text-body text-regolith/70">
            {about.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <dl className="brackets grid grid-cols-2 gap-x-6 gap-y-5 p-5 text-white/25 md:p-7">
            {about.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.625rem] tracking-[0.14em] text-regolith/50 uppercase">{k}</dt>
                <dd className="mt-1 font-mono text-[0.8125rem] text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
