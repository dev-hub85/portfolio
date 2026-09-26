"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { projectsData, type Project } from "@/lib/data";
import { featuredIds } from "@/lib/worlds";
import { useChapterReveal } from "@/lib/reveal";
import ProjectDialog, { type ProjectDialogHandle } from "@/components/project-dialog";

const categoryAccent: Record<string, string> = {
  Security: "#56d7ff",
  "E-commerce": "#ff7a8a",
  Gaming: "#8b7bff",
  Management: "#7cffb2",
  Portfolio: "#6f9bff",
  "AI/ML": "#e0203d",
  "Web Scraping": "#ff7ab6",
  "Developer Tools": "#ff5a67",
  "Web Application": "#56d7ff",
};

function BenchArt({ project }: { project: Project }) {
  const c = project.category;
  if (c === "Web Scraping") {
    return (
      <div className="bench__art ba-words" aria-hidden="true">
        {[...project.technologies, ...project.features.slice(0, 4).map((f) => f.split(" ")[0])].map((w, i) => (
          <span key={i} style={{ fontSize: `${0.7 + ((i * 37) % 9) / 8}rem` }}>
            {w}
          </span>
        ))}
      </div>
    );
  }
  if (c === "AI/ML") {
    return (
      <div className="bench__art ba-dots" aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
    );
  }
  if (c === "Management" || c === "E-commerce" || c === "Web Application") {
    return (
      <div className="bench__art ba-bars" aria-hidden="true">
        {project.features.slice(0, 5).map((f, i) => (
          <div key={f}>
            <span>{f.split(" ").slice(0, 2).join(" ")}</span>
            <b style={{ "--v": 0.35 + ((i * 29) % 60) / 100 } as React.CSSProperties} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="bench__art ba-code" aria-hidden="true">
      <p>
        <em>$</em> {project.technologies[0]?.toLowerCase().replace(/\s/g, "-")} run
      </p>
      {project.features.slice(0, 4).map((f, i) => (
        <p key={f}>
          <em>{String(i + 1).padStart(2, "0")}</em> {f.toLowerCase()}
        </p>
      ))}
    </div>
  );
}

function BenchItem({ project }: { project: Project }) {
  const dialog = useRef<ProjectDialogHandle>(null);
  const accent = categoryAccent[project.category] ?? "#56d7ff";
  return (
    <li data-reveal style={{ "--accent": accent } as React.CSSProperties}>
      <button type="button" onClick={() => dialog.current?.open()}>
        <BenchArt project={project} />
        <div className="bench__body">
          <span className="label">{project.category}</span>
          <h3>
            {project.title}
            <ArrowUpRight size={18} />
          </h3>
          <p>{project.description}</p>
          <ul className="chips">
            {project.technologies.slice(0, 4).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </button>
      <ProjectDialog ref={dialog} project={project} accent={accent} />
    </li>
  );
}

export default function Workshop() {
  const ref = useRef<HTMLElement>(null);
  useChapterReveal(ref);
  const bench = projectsData.filter((p) => !featuredIds.includes(p.id));

  return (
    <section ref={ref} id="workshop" className="chapter workshop" data-stage="workshop" aria-labelledby="workshop-title">
      <div className="chapter__inner">
        <p className="kicker" data-reveal>
          <b>✦</b> After hours
        </p>
        <h2 id="workshop-title" className="display" data-split>
          From the <em>workbench.</em>
        </h2>
        <p className="lede" data-reveal>
          Crawlers, classifiers, developer tools and management systems: the side projects where most of the stack got
          learned.
        </p>
        <ul className="bench">
          {bench.map((p) => (
            <BenchItem key={p.id} project={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
