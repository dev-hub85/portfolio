"use client";

import { useRef } from "react";
import { worlds } from "@/lib/worlds";
import { worldIcons } from "@/lib/world-icons";
import { useChapterReveal } from "@/lib/reveal";

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  useChapterReveal(ref);

  return (
    <section ref={ref} id="work" className="chapter" data-stage="work" aria-labelledby="work-title">
      <div className="chapter__inner">
        <div className="chapter__copy">
          <p className="kicker" data-reveal>
            <b>IV</b> The worlds
          </p>
          <h2 id="work-title" className="display" data-split>
            Six worlds, <em>problem to product.</em>
          </h2>
          <p className="lede" data-reveal>
            Six products I built. Each one opens on the problem, shows what I built and how it turned out, then lands on
            the live product.
          </p>
        </div>

        <ul className="world-list">
          {worlds.map((w, i) => {
            const Icon = worldIcons[w.icon];
            return (
              <li key={w.slug} data-reveal style={{ "--accent": w.accent } as React.CSSProperties}>
                <a href={`#${w.slug}`}>
                  <span className="world-list__icon">
                    <Icon strokeWidth={1.8} />
                  </span>
                  <span>
                    <small>World {String(i + 1).padStart(2, "0")}</small>
                    <b>{w.name}</b>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
