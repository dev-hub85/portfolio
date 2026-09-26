"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger and the
// universe share one frame clock. Also owns the top progress bar and the
// html[data-scroll-dir] flag the header uses to hide on scroll down.
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduced, anchors: false });
    window.__lenis = lenis;

    const progress = document.querySelector<HTMLElement>(".progress");
    const root = document.documentElement;

    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      if (progress) progress.style.transform = `scaleX(${e.progress || 0})`;
      if (e.direction) root.dataset.scrollDir = e.direction > 0 && e.scroll > 120 ? "down" : "up";
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!;
      if (id === "#") return;
      const target = id === "#top" ? 0 : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      history.replaceState(null, "", id === "#top" ? " " : id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <div className="progress" aria-hidden="true" />;
}
