"use client";

import { useEffect } from "react";
import { About } from "./About";
import { Footer, Header } from "./Chrome";
import { Contact } from "./Contact";
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { Stack } from "./Stack";
import { Timeline } from "./Timeline";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { startScroll } from "@/lib/scroll";

export default function Site() {
  const reduced = useReducedMotion();

  // The pinned stages depend on scroll position; always start at the top.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
