"use client";

import { useState, type MouseEvent } from "react";
import { brand, nav } from "@/data/content";
import { scrollToHash } from "@/lib/scroll";

function go(e: MouseEvent<HTMLAnchorElement>, then?: () => void) {
  const hash = e.currentTarget.getAttribute("href");
  if (!hash?.startsWith("#")) return;
  e.preventDefault();
  then?.();
  scrollToHash(hash);
}

/** A ring with one small body in orbit: the mark. */
function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="7" r="3" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  // React 18 has no typed `inert` prop; spread it as a plain attribute.
  const inertProps = (open ? {} : { inert: "" }) as Record<string, string>;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <div className="flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5 md:px-[3vw]">
        <a href="#top" onClick={(e) => go(e)} className="flex items-center gap-2.5" aria-label={`${brand.name} — back to top`}>
          <Mark className="size-5" />
          <span className="font-display text-[0.9375rem] tracking-[0.36em]">{brand.wordmark}</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e)} className="font-mono text-label text-white/75 uppercase transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
          <a href="#reserve" onClick={(e) => go(e)} className="rounded-[4px] bg-white px-4 py-2.5 font-mono text-label text-void uppercase transition-colors hover:bg-signal">
            Get in touch
          </a>
        </nav>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" className="font-mono text-label uppercase md:hidden">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div
        id="menu"
        {...inertProps}
        className={`fixed inset-0 -z-10 flex flex-col justify-center gap-6 bg-void/95 px-6 backdrop-blur-xl transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {nav.map((item, i) => (
          <a key={item.href} href={item.href} onClick={(e) => go(e, () => setOpen(false))} className="flex items-baseline gap-4 font-display text-[1.75rem] tracking-[0.14em] uppercase">
            <span className="font-mono text-label text-signal">0{i + 1}</span>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-void px-4 py-8 sm:px-6 md:px-[6vw]">
      <div className="flex flex-col gap-4 font-mono text-label text-regolith/50 uppercase md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-2.5 text-white/80">
          <Mark className="size-4" />
          {brand.wordmark} · portfolio
        </span>
        <span>© {new Date().getFullYear()} · Built with Next.js</span>
        <a href="#top" onClick={(e) => go(e)} className="hover:text-white">
          Back to the surface ↑
        </a>
      </div>
    </footer>
  );
}
