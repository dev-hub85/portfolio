"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";

// The name itself is drawn by the universe in stardust (see cosmos/engine.ts);
// this chapter only reserves the stage, carries the accessible heading and
// shows a typographic fallback when WebGL is unavailable.
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(ref.current!.querySelector(".scroll-cue"), {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "20% top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="intro" className="hero-dust" data-stage="hero" aria-labelledby="hero-title">
      <span id="top" aria-hidden="true" />
      <h1 id="hero-title" className="sr-only">
        Abdul Rehman, full-stack software engineer
      </h1>
      <p className="hero__fallback" aria-hidden="true">
        Abdul
        <span className="red-text">Rehman</span>
      </p>
      <a href="#origin" className="scroll-cue label" aria-label="Scroll to the next chapter">
        Scroll to fly
        <i />
      </a>
    </section>
  );
}
