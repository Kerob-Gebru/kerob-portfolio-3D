"use client";

import { useState, type CSSProperties } from "react";
import { missions } from "@/data/content";
import { projects, categoryLabels, type Category } from "@/data/projects";
import { useReveals } from "@/hooks/useReveals";

const filters: ("all" | Category)[] = ["all", "full-stack", "backend", "frontend", "blockchain", "systems"];

const statusStyle: Record<string, string> = {
  "In progress": "bg-ember text-void",
  Shipped: "bg-signal text-void",
  Prototype: "ring-1 ring-white/25 text-white",
  Coursework: "ring-1 ring-white/25 text-white",
};

/** Projects as mission cards. Each carries its stack as a set of orbit rings. */
export function Projects() {
  const ref = useReveals<HTMLElement>();
  const [active, setActive] = useState<"all" | Category>("all");
  const visible = projects.filter((p) => active === "all" || p.category === active);

  return (
    <section ref={ref} id="missions" aria-labelledby="missions-title" className="relative bg-void px-4 py-28 sm:px-6 md:px-[6vw] md:py-40">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="font-mono text-label text-signal uppercase">{missions.eyebrow}</p>
          <h2 id="missions-title" className="mt-4 font-display text-display text-white">
            {missions.heading}
          </h2>
        </div>
        <p className="font-mono text-label text-regolith/50 uppercase">{missions.note}</p>
      </div>

      <div role="tablist" aria-label="Filter projects" className="mt-10 flex flex-wrap gap-2 font-mono text-label uppercase" data-reveal>
        {filters.map((f) => {
          const count = f === "all" ? projects.length : projects.filter((p) => p.category === f).length;
          const on = active === f;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(f)}
              className={`rounded-[4px] px-3.5 py-2 ring-1 transition-colors ${on ? "bg-white text-void ring-white" : "text-regolith/70 ring-white/15 hover:text-white hover:ring-white/40"}`}
            >
              {f === "all" ? "all" : categoryLabels[f]}
              <span className={`ml-2 ${on ? "text-void/60" : "text-regolith/40"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <ol className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {visible.map((p, i) => (
          <li
            key={p.id}
            data-reveal
            style={{ "--d": `${(i % 3) * 110}ms` } as CSSProperties}
            className={`group relative flex flex-col overflow-hidden rounded-[8px] p-6 ring-1 hover:-translate-y-1.5 md:p-8 ${
              p.featured ? "bg-void-2 ring-signal/60 hover:shadow-[0_30px_80px_-30px_rgb(53_208_192/0.45)] md:col-span-2 lg:col-span-3" : "bg-void-2/60 ring-white/10 hover:ring-white/25"
            }`}
          >
            {/* Orbit rings: one per technology in the stack. */}
            <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute -top-10 -right-10 size-48 text-white/10 transition-transform duration-[1.2s] group-hover:rotate-45">
              {p.stack.map((_, k) => (
                <ellipse key={k} cx="100" cy="100" rx={30 + k * 10} ry={12 + k * 5} fill="none" stroke="currentColor" transform={`rotate(${-20 + k * 12} 100 100)`} />
              ))}
              <circle cx="100" cy="100" r="7" fill="currentColor" />
            </svg>

            <div className="relative flex flex-wrap items-center gap-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase">
              <span className={`rounded-[3px] px-2 py-1 ${statusStyle[p.status]}`}>{p.featured ? `Featured · ${p.status}` : p.status}</span>
              <span className="text-regolith/50">{categoryLabels[p.category]}</span>
            </div>

            <h3 className="relative mt-5 font-display text-[1.125rem] tracking-[0.1em] text-white uppercase md:text-[1.25rem]">{p.name}</h3>
            <p className="relative mt-2 font-mono text-[0.6875rem] tracking-[0.06em] text-ember uppercase">{p.tagline}</p>
            <p className={`relative mt-4 text-[0.9375rem] leading-relaxed text-regolith/70 ${p.featured ? "max-w-3xl" : ""}`}>{p.description}</p>

            <ul className="relative mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
              {p.stack.map((t) => (
                <li key={t} className="rounded-[4px] border border-white/15 px-2.5 py-1 font-mono text-[0.6875rem] text-white/85">
                  {t}
                </li>
              ))}
            </ul>

            <div className="relative mt-auto flex flex-wrap items-center gap-4 pt-6 font-mono text-label uppercase">
              {p.links?.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-[4px] px-4 py-2.5 text-white ring-1 ring-white/25 transition-colors hover:bg-white hover:text-void">
                  {l.label} →
                </a>
              ))}
              {p.private && <span className="text-regolith/50 normal-case tracking-normal">Private repository — happy to walk through it.</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
