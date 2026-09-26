"use client";

import { useRef } from "react";
import { skillsData } from "@/lib/data";
import { useChapterReveal } from "@/lib/reveal";

const categoryColor: Record<string, string> = {
  Languages: "#ff5a67",
  Frontend: "#56d7ff",
  Backend: "#8b7bff",
  Databases: "#7cffb2",
  "Web Scraping": "#ff7ab6",
  "AI & ML": "#e0203d",
  "DevOps & Cloud": "#6f9bff",
  "Tools & Others": "#ecebf7",
};

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  useChapterReveal(ref);

  return (
    <section ref={ref} id="skills" className="chapter" data-stage="skills" aria-labelledby="skills-title">
      <div className="chapter__inner">
        <div className="chapter__copy">
          <p className="kicker" data-reveal>
            <b>III</b> Tools in orbit
          </p>
          <h2 id="skills-title" className="display" data-split>
            What I build <em>with.</em>
          </h2>

          <ul className="legend">
            {skillsData.map((c) => (
              <li key={c.category} data-reveal style={{ "--c": categoryColor[c.category] ?? "#ecebf7" } as React.CSSProperties}>
                <h3>{c.category}</h3>
                <p>{c.skills.map((s) => s.name).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
