"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { cosmos, type CubeStatus } from "@/lib/cosmos-bus";
import { useChapterReveal } from "@/lib/reveal";

const disciplines = [
  {
    title: "Frontend development",
    text: "Responsive, interactive interfaces in React and Next.js, translated pixel-perfect from Figma.",
    tags: "React / Next.js / Tailwind",
  },
  {
    title: "Backend development",
    text: "Robust APIs on Node.js, Express and FastAPI over MongoDB, PostgreSQL and MySQL.",
    tags: "Node.js / FastAPI / SQL",
  },
  {
    title: "AI & machine learning",
    text: "Models and LLM APIs wired into real features, from YOLOv5 vision to scikit-learn.",
    tags: "PyTorch / OpenAI / Pandas",
  },
  {
    title: "Mobile-first design",
    text: "Layouts and touch targets that feel native on phones and tablets.",
    tags: "Responsive / Flutter",
  },
  {
    title: "Performance",
    text: "Lazy loading, code splitting and caching for faster loads and better Core Web Vitals.",
    tags: "SEO / Web Vitals",
  },
  {
    title: "DevOps & deployment",
    text: "CI/CD, cloud deploys and production environments on Vercel, Firebase and custom servers.",
    tags: "GitHub Actions / Vercel / Linux",
  },
];

function CubeHud() {
  const [status, setStatus] = useState<CubeStatus>({ moves: 0, solved: true, busy: false });

  useEffect(() => cosmos.on("cube:status", setStatus), []);

  return (
    <div className="cube-hud">
      <div className="cube-hud__actions">
        <button type="button" className="button button--small" onClick={() => cosmos.emit("cube:scramble", null)}>
          <Shuffle /> Scramble
        </button>
        <button
          type="button"
          className="button button--red button--small"
          onClick={() => cosmos.emit(status.solved ? "cube:reset" : "cube:solve", null)}
          disabled={status.busy}
        >
          {status.solved ? <Sparkles /> : <RotateCcw />}
          {status.solved ? "Solved" : "Solve"}
        </button>
      </div>
      <p className="cube-hud__meta" aria-live="polite">
        <b>{status.moves}</b> moves
        <span className="cube-hud__hint">
          {" "}
          · drag a face to twist · drag space to orbit
          <br />
          keys U D L R F B · shift reverses
        </span>
      </p>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  useChapterReveal(ref);

  return (
    <section ref={ref} id="about" className="chapter" data-stage="about" aria-labelledby="about-title">
      <div className="cube-stage">
        <div className="cube-stage__view">
          <div
            className="cube-zone"
            data-cube-zone
            tabIndex={0}
            role="application"
            aria-label="Stardust Rubik's cube. Drag a face to twist it, drag empty space to orbit, or use the keys U, D, L, R, F and B."
          />
          <CubeHud />
        </div>
      </div>

      <div className="chapter__inner">
        <div className="chapter__copy">
          <p className="kicker" data-reveal>
            <b>II</b> Stardust
          </p>
          <h2 id="about-title" className="display" data-split>
            Made of stardust <em>and stack traces.</em>
          </h2>
          <p className="lede" data-reveal>
            I’m Abdul, a full-stack software engineer crafting scalable web applications, automation workflows and
            AI-powered tools focused on solving real-world problems.
          </p>
          <div className="prose" data-reveal>
            <p>
              Over the years I’ve worked on diverse projects and collaborated with talented teams, delivering
              solutions that make a real impact: storefronts with their own admin panels, security platforms, games
              portals, crawlers and computer-vision pipelines.
            </p>
            <p>The cube is made of the same stardust. Give it a twist.</p>
          </div>

          <div className="disciplines">
            {disciplines.map((d, i) => (
              <article key={d.title} className="discipline" data-reveal>
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
                <span className="label">{d.tags}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
