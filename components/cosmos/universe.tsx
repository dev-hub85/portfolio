"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/motion";
import { cosmos, type Stage } from "@/lib/cosmos-bus";
import { worlds } from "@/lib/worlds";
import { worldIcons } from "@/lib/world-icons";

const ORBIT_TOOLS = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "FastAPI",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "Tailwind CSS",
  "Scrapy",
  "OpenAI API",
  "Framer Motion",
  "Git",
  "Vercel",
];

export default function Universe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = stageRef.current!;
    const bodies = bodiesRef.current!;
    let disposed = false;
    const cleanups: (() => void)[] = [];

    const probe = document.createElement("canvas");
    const webgl = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    if (!webgl) {
      cosmos.emit("engine:progress", { value: 1 });
      cosmos.emit("engine:ready", null);
      return;
    }

    const root = getComputedStyle(document.documentElement);
    const fonts = {
      display: root.getPropertyValue("--font-display").trim() || "Arial Black, sans-serif",
      serif: root.getPropertyValue("--font-serif").trim() || "Georgia, serif",
    };
    const fontsReady = Promise.all([
      document.fonts.load(`600 120px ${fonts.display}`),
      document.fonts.load(`italic 400 120px ${fonts.serif}`),
    ]).catch(() => undefined);

    Promise.all([import("./engine"), fontsReady]).then(([{ Universe: Engine }]) => {
      if (disposed) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const engine = new Engine(container, {
        mobile: window.innerWidth < 860,
        reducedMotion: reduced,
        fonts,
      });
      document.documentElement.classList.add("webgl");
      cosmos.emit("engine:progress", { value: 1 });

      engine.registerPlanets(Array.from(bodies.querySelectorAll<HTMLElement>(".planet")));
      engine.registerTools(Array.from(bodies.querySelectorAll<HTMLElement>(".tool")));

      const zone = document.querySelector<HTMLElement>("[data-cube-zone]");
      if (zone) engine.attachCube(zone);

      // Clicking the hero fires a burst of dust from the pointer.
      const hero = document.querySelector<HTMLElement>("section[data-stage='hero']");
      const onFire = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        engine.fireAt(e.clientX, e.clientY);
      };
      hero?.addEventListener("click", onFire);
      cleanups.push(() => hero?.removeEventListener("click", onFire));

      // Bus wiring
      cleanups.push(
        cosmos.on("intro:done", () => engine.ignite()),
        cosmos.on("motion", ({ paused }) => engine.setPaused(paused)),
        cosmos.on("world:step", ({ world, step }) => engine.setWorldStep(world, step), false),
        cosmos.on("cube:scramble", () => engine.cube.scramble(), false),
        cosmos.on("cube:solve", () => engine.cube.solve(), false),
        cosmos.on("cube:reset", () => engine.cube.reset(), false),
        engine.cube.onStatus((s) => cosmos.emit("cube:status", s)),
        cosmos.on("stage", (p) => {
          document.documentElement.dataset.chapter = p.stage;
          engine.setStage(p);
        }),
      );
      cosmos.emit("cube:status", engine.cube.status);

      // One ScrollTrigger per chapter: the active one drives the universe.
      const triggers = Array.from(document.querySelectorAll<HTMLElement>("main [data-stage]")).map((el) => {
        const stage = el.dataset.stage as Stage;
        const world = el.dataset.world !== undefined ? Number(el.dataset.world) : undefined;
        return ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) cosmos.emit("stage", { stage, world, progress: self.progress });
          },
          onUpdate: (self) => {
            const cur = cosmos.peek("stage");
            if (self.isActive && cur?.stage === stage && cur.world === world) {
              cosmos.emit("stage", { stage, world, progress: self.progress });
            }
          },
        });
      });
      if (!cosmos.peek("stage")) cosmos.emit("stage", { stage: "hero", progress: 0 });
      cleanups.push(() => triggers.forEach((t) => t.kill()));

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => engine.resize(), 160);
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
      });

      requestAnimationFrame(() => {
        container.dataset.ready = "true";
        cosmos.emit("engine:ready", null);
      });

      cleanups.push(() => engine.dispose());
    });

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div ref={stageRef} className="universe" aria-hidden="true" />
      <div ref={bodiesRef} className="bodies">
        {worlds.map((w, i) => {
          const Icon = worldIcons[w.icon];
          return (
            <a
              key={w.slug}
              href={`#${w.slug}`}
              className="planet"
              style={{ "--accent": w.accent } as React.CSSProperties}
              aria-label={`World ${String(i + 1).padStart(2, "0")}: ${w.name}`}
              tabIndex={-1}
            >
              <span className="planet__orb">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span className="planet__name">{w.name}</span>
            </a>
          );
        })}
        {ORBIT_TOOLS.map((t) => (
          <span key={t} className="tool" aria-hidden="true">
            {t}
          </span>
        ))}
      </div>
    </>
  );
}
