"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { cosmos } from "@/lib/cosmos-bus";
import { worlds, worldProject, type World } from "@/lib/worlds";
import { worldIcons } from "@/lib/world-icons";
import WorldArt from "@/components/sections/world-art";
import ProjectDialog, { type ProjectDialogHandle } from "@/components/project-dialog";

const STEPS = ["Problem", "Build", "Result", "Live"];

export default function WorldScene({ world, index }: { world: World; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const dialog = useRef<ProjectDialogHandle>(null);
  const [step, setStep] = useState(0);
  const project = worldProject(world);
  const Icon = worldIcons[world.icon];
  const n = String(index + 1).padStart(2, "0");
  const total = String(worlds.length).padStart(2, "0");

  useGSAP(
    () => {
      const root = ref.current!;
      const fills = Array.from(root.querySelectorAll<HTMLElement>(".stepper button"));
      let current = -1;

      const near = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (root.dataset.near = String(self.isActive)),
      });

      const steps = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress * 3;
          fills.forEach((b, k) => b.style.setProperty("--fill", `${Math.min(1, Math.max(0, p - k + 1)) * 100}%`));
          const s = Math.min(3, Math.floor(p + 0.35));
          if (s !== current) {
            current = s;
            root.dataset.step = String(s);
            setStep(s);
            cosmos.emit("world:step", { world: index, step: s });
          }
        },
      });

      return () => {
        near.kill();
        steps.kill();
      };
    },
    { scope: ref },
  );

  const goTo = (k: number) => {
    const root = ref.current!;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const span = root.offsetHeight - window.innerHeight;
    const target = top + (span * k) / 3 + (k === 0 ? 0 : 2);
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const pos = (k: number) => (k < step ? "before" : k === step ? "current" : "after");

  return (
    <section
      ref={ref}
      id={world.slug}
      className="scene"
      data-stage="world"
      data-world={index}
      data-accent={world.accent}
      data-step={step}
      style={{ "--accent": world.accent } as React.CSSProperties}
      aria-labelledby={`${world.slug}-title`}
    >
      <div className="scene__pin">
        <div className="chapter__inner">
          <div className="scene__copy">
            <p className="scene__meta">
              <span className="scene__icon">
                <Icon strokeWidth={1.8} />
              </span>
              <b>
                World {n} of {total}
              </b>
              <span>{world.area}</span>
            </p>
            <h2 id={`${world.slug}-title`} className="scene__name">
              {world.name}
            </h2>
            <p className="scene__title">{world.tagline}</p>
            <p className="scene__role">{world.role}</p>

            <div className="steps">
              <div className="step" data-pos={pos(0)} aria-hidden={step !== 0}>
                <p className="step__label">
                  <b>01</b> The problem
                </p>
                <p>{world.problem}</p>
              </div>

              <div className="step" data-pos={pos(1)} aria-hidden={step !== 1}>
                <p className="step__label">
                  <b>02</b> What I built
                </p>
                <ul className="chips">
                  {world.build.chips.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p>{world.build.text}</p>
              </div>

              <div className="step" data-pos={pos(2)} aria-hidden={step !== 2}>
                <p className="step__label">
                  <b>03</b> The result
                </p>
                <p>{world.result.text}</p>
                <p className="stat-line">
                  <b>{world.result.stat.value}</b>
                  {world.result.stat.label}
                </p>
              </div>

              <div className="step" data-pos={pos(3)} aria-hidden={step !== 3}>
                <p className="step__label">
                  <b>04</b> Live product
                </p>
                <ul className="chips">
                  {project.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="hero__actions" style={{ marginTop: 0 }}>
                  {world.live.url ? (
                    <a
                      className="button button--small"
                      href={world.live.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={step === 3 ? 0 : -1}
                    >
                      Visit {world.name} <ArrowUpRight />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => dialog.current?.open()}
                    tabIndex={step === 3 ? 0 : -1}
                  >
                    Read the details
                  </button>
                </div>
                <p className="step__note">{world.live.note}</p>
              </div>
            </div>

            <ol className="stepper">
              {STEPS.map((s, k) => (
                <li key={s}>
                  <button type="button" aria-current={step === k ? "step" : undefined} onClick={() => goTo(k)}>
                    {s}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <WorldArt world={world} />
      </div>

      <ProjectDialog ref={dialog} project={project} accent={world.accent} />
    </section>
  );
}
