"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { cosmos } from "@/lib/cosmos-bus";

const LINES = ["Gathering stardust", "Igniting the first star", "Calibrating the cosmos"];

export default function IntroLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState(0);
  const [done, setDone] = useState(false);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    window.__lenis?.stop();

    const counter = { value: 0 };
    let engineReady = false;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      tween.kill();
      if (countRef.current) countRef.current.textContent = "100";
      gsap
        .timeline({
          onComplete: () => {
            setDone(true);
            window.__lenis?.start();
          },
        })
        .to(root.querySelector(".intro__core"), { scale: 1.08, opacity: 0, duration: reduced ? 0.01 : 0.7, ease: "power2.in" })
        .to(root, { opacity: 0, duration: reduced ? 0.01 : 0.8, ease: "power2.out" }, "-=0.25")
        .add(() => {
          html.classList.add("choreo-ready");
          cosmos.emit("intro:done", null);
        }, "-=0.6");
    };
    finishRef.current = finish;

    const tween = gsap.to(counter, {
      value: 100,
      duration: reduced ? 0.2 : 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.value);
        if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
        setLine(v < 40 ? 0 : v < 80 ? 1 : 2);
        // Hold at 99 until the universe has rendered its first frame.
        if (v >= 99 && !engineReady) tween.pause();
      },
      onComplete: finish,
    });

    const off = cosmos.on("engine:ready", () => {
      engineReady = true;
      if (tween.paused()) tween.resume();
    });

    const failsafe = window.setTimeout(finish, 6500);

    return () => {
      off();
      tween.kill();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div ref={rootRef} className="intro" data-done={done} hidden={done} aria-live="polite">
      <div className="intro__core">
        <div className="intro__star" />
        <div ref={countRef} className="intro__count">
          000
        </div>
        <p className="intro__line">{LINES[line]}</p>
      </div>
      <button type="button" className="intro__skip" onClick={() => finishRef.current()}>
        Skip intro
      </button>
    </div>
  );
}
