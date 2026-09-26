"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { useChapterReveal } from "@/lib/reveal";

// Plain text is split into words; [bracketed] phrases render as red <mark>s.
const MANIFESTO =
  "Every product has a side [nobody sees:] the APIs, the scrapers, the data and the models that keep it running. That’s the side I build, [end to end,] so the part people touch [just works.]";

type Token = { text: string; mark: boolean };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  src.split(/(\[[^\]]+\])/).forEach((part) => {
    if (!part) return;
    if (part.startsWith("[")) out.push({ text: part.slice(1, -1), mark: true });
    else part.split(/\s+/).filter(Boolean).forEach((w) => out.push({ text: w, mark: false }));
  });
  return out;
}

const tokens = tokenize(MANIFESTO);

const signals = [
  { label: "20+ shipped", title: "Projects completed", text: "Web apps, crawlers, AI tools and dashboards, from first commit to deploy." },
  { label: "2+ years", title: "Across the stack", text: "From interface to infrastructure: React and Next.js up front, Node.js, FastAPI and databases behind." },
  { label: "10+ clients", title: "Happy clients", text: "Freelance and product work, with support around the clock when it matters." },
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useChapterReveal(ref);

  useGSAP(
    () => {
      const text = ref.current!.querySelector<HTMLElement>(".manifesto__text")!;
      gsap.to(text, {
        "--read": 1,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 70%", end: "60% 40%", scrub: 0.5 },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="origin" className="chapter manifesto" data-stage="origin" aria-labelledby="origin-title">
      <div className="chapter__inner">
        <p className="kicker" id="origin-title" data-reveal>
          <b>I</b> The signal
        </p>
        <p className="manifesto__text" style={{ "--n": tokens.length } as React.CSSProperties}>
          {tokens.map((t, i) => {
            const style = { "--i": i } as React.CSSProperties;
            return t.mark ? (
              <mark key={i} style={style}>
                {t.text}{" "}
              </mark>
            ) : (
              <span key={i} style={style}>
                {t.text}{" "}
              </span>
            );
          })}
        </p>

        <ul className="signals">
          {signals.map((s) => (
            <li key={s.label} data-reveal>
              <span className="label">{s.label}</span>
              <p>
                <strong>{s.title}</strong>
                {s.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
