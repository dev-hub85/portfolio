"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/motion";

/**
 * Scroll reveals for a chapter: [data-split] headings rise line by line from a
 * mask, [data-reveal] blocks fade up. Pass `immediate` for content already in
 * view on load (the hero), which then plays when the intro hands over instead.
 */
export function useChapterReveal(scope: RefObject<HTMLElement | null>, opts: { immediate?: () => Promise<void> } = {}) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const splits: SplitText[] = [];
      let cancelled = false;

      const build = () => {
        if (cancelled) return;
        const heads = gsap.utils.toArray<HTMLElement>("[data-split]", root);
        const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);

        if (reduced) {
          gsap.set([...heads, ...blocks], { opacity: 1 });
          return;
        }

        const tweens: gsap.core.Tween[] = [];
        heads.forEach((el) => {
          gsap.set(el, { opacity: 1 });
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          splits.push(split);
          tweens.push(
            gsap.from(split.lines, {
              yPercent: 115,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.09,
              paused: !!opts.immediate,
              scrollTrigger: opts.immediate ? undefined : { trigger: el, start: "top 88%", once: true },
            }),
          );
        });
        blocks.forEach((el, i) => {
          tweens.push(
            gsap.fromTo(
              el,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: "expo.out",
                delay: opts.immediate ? 0.15 + i * 0.08 : 0,
                paused: !!opts.immediate,
                scrollTrigger: opts.immediate ? undefined : { trigger: el, start: "top 90%", once: true },
              },
            ),
          );
        });

        opts.immediate?.().then(() => tweens.forEach((t) => t.play()));
        ScrollTrigger.refresh();
      };

      document.fonts.ready.then(build);

      return () => {
        cancelled = true;
        splits.forEach((s) => s.revert());
      };
    },
    { scope },
  );
}

/** Resolves when the intro loader has handed over to the page. */
export function introDone(): Promise<void> {
  return new Promise((resolve) => {
    if (document.documentElement.classList.contains("choreo-ready")) return resolve();
    import("@/lib/cosmos-bus").then(({ cosmos }) => {
      const off = cosmos.on("intro:done", () => {
        queueMicrotask(() => off());
        resolve();
      });
    });
  });
}
