"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import type { Project } from "@/lib/data";

export interface ProjectDialogHandle {
  open: () => void;
}

const ProjectDialog = forwardRef<ProjectDialogHandle, { project: Project; accent: string }>(function ProjectDialog(
  { project, accent },
  ref,
) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      window.__lenis?.stop();
      dialog.current?.showModal();
    },
  }));

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      style={{ "--accent": accent } as React.CSSProperties}
      aria-labelledby={`dialog-${project.id}`}
      data-lenis-prevent
      onClose={() => window.__lenis?.start()}
      onClick={(e) => {
        if (e.target === e.currentTarget) dialog.current?.close();
      }}
    >
      <div className="project-dialog__body">
        <div className="project-dialog__head">
          <div>
            <span className="label" style={{ color: accent }}>
              {project.category}
            </span>
            <h2 id={`dialog-${project.id}`}>{project.title}</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close" onClick={() => dialog.current?.close()}>
            <X />
          </button>
        </div>
        <p>{project.longDescription}</p>
        <span className="label">Key features</span>
        <ul className="features">
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <span className="label">Built with</span>
        <ul className="chips">
          {project.technologies.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {(project.liveLink || project.githubLink) && (
          <div className="hero__actions">
            {project.liveLink && (
              <a className="button button--red" href={project.liveLink} target="_blank" rel="noopener noreferrer">
                Visit live <ArrowUpRight />
              </a>
            )}
            {project.githubLink && (
              <a className="button" href={project.githubLink} target="_blank" rel="noopener noreferrer">
                <Github /> Source
              </a>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
});

export default ProjectDialog;
