"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { cosmos } from "@/lib/cosmos-bus";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#log", label: "Log" },
  { href: "#contact", label: "Contact" },
];

// Chapters that light up each nav item (world scenes and the workshop count as Work).
const owner: Record<string, string> = {
  about: "#about",
  skills: "#skills",
  work: "#work",
  world: "#work",
  workshop: "#work",
  log: "#log",
  contact: "#contact",
};

function Monogram() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill="currentColor"
        style={{ font: "italic 400 19px var(--serif)", letterSpacing: "-0.04em" }}
      >
        ar
      </text>
    </svg>
  );
}

export default function SiteHeader() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => cosmos.on("stage", ({ stage }) => setActive(owner[stage] ?? "")), []);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "off" : "on";
    cosmos.emit("motion", { paused });
  }, [paused]);

  const prevOpen = useRef(menuOpen);
  useEffect(() => {
    // Only react to real toggles: the intro loader owns the scroll lock on load.
    if (prevOpen.current !== menuOpen) {
      if (menuOpen) window.__lenis?.stop();
      else window.__lenis?.start();
      prevOpen.current = menuOpen;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" data-menu-open={menuOpen}>
        <a href="#top" className="brand" aria-label="Abdul Rehman, back to top">
          <Monogram />
          <span className="brand__text">
            Abdul Rehman
            <small>Full-stack engineer</small>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} aria-current={active === l.href ? "true" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            aria-label={paused ? "Resume motion" : "Pause motion"}
          >
            {paused ? <Play /> : <Pause />}
          </button>
          <a href="#contact" className="button talk">
            Let&apos;s talk <ArrowUpRight />
          </a>
          <button
            type="button"
            className="icon-button menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M5 9h14M5 15h14" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <nav id="mobile-menu" className="mobile-menu" data-open={menuOpen} aria-label="Mobile" aria-hidden={!menuOpen}>
        {links.map((l, i) => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {l.label}
          </a>
        ))}
      </nav>
    </>
  );
}
