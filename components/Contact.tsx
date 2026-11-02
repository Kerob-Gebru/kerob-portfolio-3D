"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { brand, reserve } from "@/data/content";
import { useReveals } from "@/hooks/useReveals";

type Status = "idle" | "invalid" | "sent";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Addis_Ababa",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/** Live Addis Ababa time. Null until mounted, so server and client markup match. */
function useAddisClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return { h: "--", m: "--", s: "--" };
  const [h, m, s] = fmt.format(now).split(":");
  return { h, m, s };
}

/**
 * Contact. A live local-time readout on one side, the message form on the
 * other; the form hands a drafted message to the visitor's mail app.
 */
export function Contact() {
  const ref = useReveals<HTMLElement>();
  const t = useAddisClock();
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus("invalid");
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(`${String(data.get("topic"))} — from ${String(data.get("name"))}`);
    const body = encodeURIComponent(`Name: ${String(data.get("name"))}\nEmail: ${String(data.get("email"))}\nTopic: ${String(data.get("topic"))}\n\n${String(data.get("message") ?? "")}`);
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  const units: [string, string][] = [
    ["Hrs", t.h],
    ["Min", t.m],
    ["Sec", t.s],
  ];
  const links: [string, string][] = [
    ["Email", `mailto:${brand.email}`],
    ["GitHub", brand.github],
    ["LinkedIn", brand.linkedin],
  ];

  return (
    <section ref={ref} id="reserve" aria-labelledby="reserve-title" className="relative overflow-hidden bg-void px-4 pb-28 sm:px-6 md:px-[6vw] md:pb-40">
      {/* A sliver of the orb rising at the bottom edge: the hero, bookended. */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[62vw] left-1/2 size-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(217,142,74,0.35),rgba(53,208,192,0.06)_55%,transparent_70%)]" />

      <div className="relative grid gap-12 border-t border-white/10 pt-20 md:grid-cols-2 md:gap-16 md:pt-28">
        <div data-reveal>
          <p className="font-mono text-label text-signal uppercase">{reserve.eyebrow}</p>
          <h2 id="reserve-title" className="mt-4 font-display text-display text-white">
            {reserve.heading}
          </h2>
          <p className="mt-5 max-w-[28rem] text-body text-regolith/70">{reserve.body}</p>

          <div className="mt-10">
            <p className="font-mono text-label text-regolith/50 uppercase">{reserve.clockLabel}</p>
            <div className="mt-3 flex gap-2 md:gap-3" role="timer" aria-label={`Local time in Addis Ababa: ${t.h}:${t.m}`}>
              {units.map(([label, v]) => (
                <div key={label} className="brackets min-w-[4.25rem] px-3 py-3 text-center text-white/25 md:min-w-[5.5rem]">
                  <span className="block font-display text-[1.5rem] text-white tabular-nums md:text-[2.25rem]">{v}</span>
                  <span className="mt-1 block font-mono text-[0.625rem] tracking-[0.14em] text-regolith/60 uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <ul className="mt-10 space-y-3 font-mono text-label uppercase">
            {links.map(([label, href]) => (
              <li key={label}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-white/80 transition-colors hover:text-signal">
                  {label} →
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form noValidate onSubmit={onSubmit} aria-describedby="reserve-status" className="space-y-3" data-reveal style={{ "--d": "110ms" } as CSSProperties}>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">Name</span>
            <input name="name" required autoComplete="name" placeholder="Your name" className="field" onInput={() => setStatus("idle")} />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">Email</span>
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="field" onInput={() => setStatus("idle")} />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">Topic</span>
            <select name="topic" defaultValue={reserve.topics[0]} className="field appearance-none">
              {reserve.topics.map((topic) => (
                <option key={topic} value={topic} className="bg-void">
                  {topic}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-label text-regolith/60 uppercase">Message</span>
            <textarea name="message" rows={4} placeholder="What are you building?" className="field resize-none" />
          </label>
          <button type="submit" className="mt-2 w-full rounded-[4px] bg-white px-5 py-4 font-mono text-label text-void uppercase transition-colors hover:bg-signal">
            Send message
          </button>
          <p id="reserve-status" role="status" className="min-h-[1.25rem] text-[0.8125rem] text-regolith/70">
            {status === "invalid" && "A name and a valid email, please."}
            {status === "sent" && `Your mail app should be open with the message drafted. If not: ${brand.email}.`}
          </p>
        </form>
      </div>
    </section>
  );
}
