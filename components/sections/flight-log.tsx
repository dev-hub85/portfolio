"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { useChapterReveal } from "@/lib/reveal";

const USER = "dev-hub85";

interface Repo {
  name: string;
  html_url: string;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
  fork: boolean;
}

interface Telemetry {
  repos: number;
  stars: number;
  languages: { name: string; share: number }[];
  recent: Repo[];
}

const monthYear = (iso: string) => new Date(iso).toLocaleDateString("en", { month: "short", year: "numeric" });

function useTelemetry() {
  const [data, setData] = useState<Telemetry | null | "error">(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list: Repo[]) => {
        const own = list.filter((r) => !r.fork);
        const counts = new Map<string, number>();
        own.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
        const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
        setData({
          repos: own.length,
          stars: own.reduce((a, r) => a + r.stargazers_count, 0),
          languages: [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, n]) => ({ name, share: n / total })),
          recent: own.slice(0, 3),
        });
      })
      .catch((e) => {
        if (!ctrl.signal.aborted) setData("error");
        void e;
      });
    return () => ctrl.abort();
  }, []);

  return data;
}

export default function FlightLog() {
  const ref = useRef<HTMLElement>(null);
  const telemetry = useTelemetry();
  const t = telemetry && telemetry !== "error" ? telemetry : null;
  useChapterReveal(ref);

  return (
    <section ref={ref} id="log" className="chapter" data-stage="log" aria-labelledby="log-title">
      <div className="chapter__inner">
        <div className="chapter__copy">
          <p className="kicker" data-reveal>
            <b>V</b> Flight log
          </p>
          <h2 id="log-title" className="display" data-split>
            Where I’ve <em>been building.</em>
          </h2>

          <ol className="log">
            <li data-current="true" data-reveal>
              <span className="log__node">03</span>
              <div>
                <p className="log__when label">
                  <b>Now</b> Availability
                </p>
                <h3>Open for opportunities</h3>
                <p className="log__desc">
                  Freelance and full-time work: web apps, APIs, AI features and automation, with support available
                  around the clock.
                </p>
                <ul className="chips">
                  <li>Upwork</li>
                  <li>LinkedIn</li>
                  <li>Remote</li>
                </ul>
              </div>
            </li>

            {telemetry !== "error" && (
              <li data-reveal>
                <span className="log__node">02</span>
                <div>
                  <p className="log__when label">
                    <b>Latest</b> github.com/{USER}
                  </p>
                  <h3>Recent launches</h3>
                  <div className="telemetry">
                    {(t?.recent ?? Array.from({ length: 3 }, () => null)).map((r, i) =>
                      r ? (
                        <a key={r.name} className="telemetry__repo" href={r.html_url} target="_blank" rel="noopener noreferrer">
                          <b>{r.name}</b>
                          <span>{r.language ?? "Code"}</span>
                          <span>{monthYear(r.pushed_at)}</span>
                        </a>
                      ) : (
                        <span key={i} className="telemetry__repo telemetry__repo--ghost" />
                      ),
                    )}
                  </div>
                </div>
              </li>
            )}

            {telemetry !== "error" && (
              <li data-reveal>
                <span className="log__node">01</span>
                <div>
                  <p className="log__when label">
                    <b>Stack</b> {t ? `${t.repos} public repositories` : "reading telemetry"}
                  </p>
                  <h3>Most used languages</h3>
                  <div className="telemetry telemetry--bars" style={{ "--accent": "var(--red)" } as React.CSSProperties}>
                    {(t?.languages ?? []).map((l, i) => (
                      <div key={l.name} className="bar" style={{ "--v": l.share, "--i": i } as React.CSSProperties}>
                        <span>{l.name}</span>
                        <b>
                          <i />
                        </b>
                        <em>{Math.round(l.share * 100)}%</em>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            )}
          </ol>

          <a className="cert" href={`https://github.com/${USER}`} target="_blank" rel="noopener noreferrer" data-reveal>
            <Github className="cert__seal" />
            <div>
              <span className="label">Open source · GitHub</span>
              <h3>{USER}</h3>
              <p>Repositories, experiments and the code behind these worlds.</p>
            </div>
            <span className="text-link">
              View profile <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
