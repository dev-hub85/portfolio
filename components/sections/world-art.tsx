"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  Boxes,
  Braces,
  Camera,
  CheckCircle2,
  CreditCard,
  Database,
  FileText,
  Film,
  Gamepad2,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  Music,
  Package,
  RefreshCw,
  ScanEye,
  Server,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Trophy,
  Upload,
  Users,
} from "lucide-react";
import type { World } from "@/lib/worlds";

type Pos = { x?: number; y?: number; r?: number; s?: number };

/**
 * One actor in a scene. `act` lists the steps (0 problem, 1 build, 2 result,
 * 3 live) it is visible in; `at` gives its position per step in cqw units.
 */
function A({
  act,
  at,
  d = 0,
  float = false,
  children,
}: {
  act: string;
  at: Pos[];
  d?: number;
  float?: boolean;
  children: ReactNode;
}) {
  const style: Record<string, string> = { "--d": `${d}s` };
  at.forEach((p, i) => {
    if (p.x !== undefined) style[`--x${i}`] = `${p.x}cqw`;
    if (p.y !== undefined) style[`--y${i}`] = `${p.y}cqw`;
    if (p.r !== undefined) style[`--r${i}`] = `${p.r}deg`;
    if (p.s !== undefined) style[`--s${i}`] = String(p.s);
  });
  return (
    <div className={float ? "a float" : "a"} data-act={act} style={style as React.CSSProperties}>
      {float ? <div>{children}</div> : children}
    </div>
  );
}

function Chip({ icon, tone, children }: { icon?: ReactNode; tone?: "warn" | "ok" | "live"; children: ReactNode }) {
  return (
    <span className="chip" data-tone={tone}>
      {icon}
      {children}
    </span>
  );
}

function Card({ icon, title, sub, dim }: { icon: ReactNode; title: string; sub?: string; dim?: boolean }) {
  return (
    <div className={dim ? "card card--dim" : "card"}>
      {icon}
      <div>
        <b>{title}</b>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}

function Panel({ title, tag, children, width = "24em" }: { title: string; tag?: string; children: ReactNode; width?: string }) {
  return (
    <div className="panel" style={{ width }}>
      <div className="panel__bar">
        <i />
        <i />
        <i />
        <b>{title}</b>
        {tag && <span>{tag}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ state, i, children }: { state: "ok" | "busy" | "wait"; i: number; children: ReactNode }) {
  return (
    <div className="row" data-state={state} style={{ "--i": i } as React.CSSProperties}>
      <i />
      {children}
    </div>
  );
}

function Bar({ label, v, i, value }: { label: string; v: number; i: number; value: string }) {
  return (
    <div className="bar" style={{ "--v": v, "--i": i } as React.CSSProperties}>
      <span>{label}</span>
      <b>
        <i />
      </b>
      <em>{value}</em>
    </div>
  );
}

function Node({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="node">
      <span className="node__orb">{icon}</span>
      <span className="node__label">{label}</span>
    </div>
  );
}

function Flow({ width }: { width: string }) {
  return (
    <div className="flow" style={{ width }}>
      <i />
    </div>
  );
}

function Shot({ src, alt, url, phone, i }: { src: string; alt: string; url: string; phone?: boolean; i: number }) {
  return (
    <figure className={phone ? "shot shot--phone" : "shot"} style={{ "--i": i } as React.CSSProperties}>
      {!phone && (
        <figcaption>
          <i />
          <i />
          <i />
          <span>{url}</span>
        </figcaption>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </figure>
  );
}

function LiveShots({ slug, host, phone = true }: { slug: string; host: string; phone?: boolean }) {
  return (
    <div className="a shots" data-act="3">
      <Shot src={`/worlds/${slug}-1.jpg`} alt={`${host} home page`} url={host} i={0} />
      <Shot src={`/worlds/${slug}-2.jpg`} alt={`${host} further down the page`} url={host} i={1} />
      {phone && <Shot src={`/worlds/${slug}-m.jpg`} alt={`${host} on a phone`} url={host} phone i={2} />}
    </div>
  );
}

function Chart({ title, tag, children, width = "17em" }: { title: string; tag: string; children: ReactNode; width?: string }) {
  return (
    <div className="panel chart" style={{ width }}>
      <div className="panel__bar">
        <b>{title}</b>
        <span>{tag}</span>
      </div>
      {children}
    </div>
  );
}

/** Evaluation charts for the detector: loss, precision–recall, per-class counts, confusion. */
function DetectionCharts() {
  const classes = ["person", "car", "dog", "bicycle", "bus"];
  return (
    <>
      <A act="3" at={[{}, {}, {}, { x: -17, y: -17, r: -2 }]} d={0.05}>
        <Chart title="Training loss" tag="epochs">
          <svg className="chart__svg" viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
            <g className="chart__grid">
              {[20, 45, 70, 95].map((y) => (
                <line key={y} x1="0" x2="200" y1={y} y2={y} />
              ))}
            </g>
            <path className="chart__line" d="M0,12 C20,40 35,62 60,74 S110,90 140,94 S185,98 200,99" />
            <path className="chart__line chart__line--ghost" d="M0,18 C22,48 40,66 64,78 S112,88 142,90 S186,92 200,93" />
          </svg>
          <div className="chart__legend">
            <span>train</span>
            <span>val</span>
          </div>
        </Chart>
      </A>
      <A act="3" at={[{}, {}, {}, { x: 19, y: -19, r: 2 }]} d={0.15}>
        <Chart title="Precision / recall" tag="curve">
          <svg className="chart__svg" viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
            <g className="chart__grid">
              {[50, 100, 150].map((x) => (
                <line key={x} x1={x} x2={x} y1="0" y2="110" />
              ))}
            </g>
            <path className="chart__area" d="M0,8 L60,10 C100,14 130,22 150,40 S185,90 200,108 L200,110 L0,110 Z" />
            <path className="chart__line" d="M0,8 L60,10 C100,14 130,22 150,40 S185,90 200,108" />
          </svg>
        </Chart>
      </A>
      <A act="3" at={[{}, {}, {}, { x: -15, y: 19, r: 1 }]} d={0.25}>
        <Chart title="Detections by class" tag="sample batch" width="18em">
          {classes.map((c, i) => (
            <div key={c} className="bar" style={{ "--v": [0.92, 0.74, 0.46, 0.33, 0.21][i], "--i": i } as React.CSSProperties}>
              <span>{c}</span>
              <b>
                <i />
              </b>
              <em>{["▲", "▲", "—", "—", "▼"][i]}</em>
            </div>
          ))}
        </Chart>
      </A>
      <A act="3" at={[{}, {}, {}, { x: 21, y: 18, r: -2 }]} d={0.35}>
        <Chart title="Confusion matrix" tag="classes" width="14em">
          <div className="matrix-heat" aria-hidden="true">
            {Array.from({ length: 25 }, (_, k) => {
              const row = Math.floor(k / 5);
              const col = k % 5;
              const v = row === col ? 0.75 + ((row * 7) % 4) * 0.06 : ((row * 3 + col * 5) % 7) / 40;
              return <i key={k} style={{ "--v": v, "--i": k } as React.CSSProperties} />;
            })}
          </div>
        </Chart>
      </A>
    </>
  );
}

// ─── Per-world art ──────────────────────────────────────────────────────────

function Vulnerability() {
  return (
    <>
      <A act="0" at={[{ x: -24, y: -22, r: -6 }]} float>
        <Chip icon={<AlertTriangle />} tone="warn">
          XSS
        </Chip>
      </A>
      <A act="0" at={[{ x: 18, y: -28, r: 4 }]} d={0.08} float>
        <Chip icon={<AlertTriangle />} tone="warn">
          SQL injection
        </Chip>
      </A>
      <A act="0" at={[{ x: 26, y: 8, r: 6 }]} d={0.16} float>
        <Chip icon={<AlertTriangle />} tone="warn">
          Weak auth
        </Chip>
      </A>
      <A act="0" at={[{ x: -28, y: 16, r: -4 }]} d={0.24} float>
        <Card icon={<FileText />} title="spreadsheet.xlsx" sub="notes, somewhere" dim />
      </A>
      <A act="0" at={[{ x: 0, y: -2 }]} d={0.1}>
        <span className="ask">?</span>
      </A>
      <A act="0" at={[{ x: 6, y: 28, r: -3 }]} d={0.3} float>
        <Chip icon={<AlertTriangle />} tone="warn">
          Open redirect
        </Chip>
      </A>

      <A act="1 2" at={[{}, { x: -6, y: -2 }, { x: -18, y: -10, s: 0.9 }]}>
        <Panel title="Benchmark" tag="live sync" width="26em">
          <Row state="ok" i={0}>
            Sync data sources
          </Row>
          <Row state="ok" i={1}>
            Score severity
          </Row>
          <Row state="busy" i={2}>
            Link CVE references
          </Row>
          <Row state="wait" i={3}>
            Export report
          </Row>
          <div className="code">
            <em>GET</em>/api/vulnerabilities<span>200</span>
          </div>
        </Panel>
      </A>
      <A act="1" at={[{}, { x: 30, y: -24, r: 5 }]} d={0.3} float>
        <Chip icon={<Lock />}>Role-based access</Chip>
      </A>
      <A act="1" at={[{}, { x: 28, y: 24, r: -4 }]} d={0.4} float>
        <Chip icon={<ShieldCheck />} tone="ok">
          Auth
        </Chip>
      </A>
      <A act="2" at={[{}, {}, { x: 18, y: 18, r: 3 }]} d={0.25}>
        <Panel title="Severity" tag="report" width="21em">
          <Bar label="Critical" v={0.86} i={0} value="▲" />
          <Bar label="High" v={0.64} i={1} value="▲" />
          <Bar label="Medium" v={0.42} i={2} value="—" />
          <Bar label="Low" v={0.2} i={3} value="▼" />
        </Panel>
      </A>
      <A act="2" at={[{}, {}, { x: 30, y: -30, r: 4 }]} d={0.45} float>
        <Chip icon={<FileText />} tone="live">
          Export ready
        </Chip>
      </A>
      <LiveShots slug="vulnerability-benchmark" host="vulnersbench.com" />
    </>
  );
}

function Daniels() {
  return (
    <>
      {[
        { t: "Products", x: -26, y: -24, r: -5, i: <Package /> },
        { t: "Inventory", x: 22, y: -20, r: 5, i: <Boxes /> },
        { t: "Orders", x: -20, y: 20, r: 4, i: <ShoppingBag /> },
        { t: "Promotions", x: 24, y: 22, r: -6, i: <Sparkles /> },
      ].map((c, k) => (
        <A key={c.t} act="0" at={[{ x: c.x, y: c.y, r: c.r }]} d={k * 0.08} float>
          <Chip icon={c.i}>{c.t}</Chip>
        </A>
      ))}
      <A act="0" at={[{ x: 0, y: 0 }]} d={0.1}>
        <Card icon={<Users />} title="One small team" sub="running everything by hand" />
      </A>

      <A act="1 2" at={[{}, { x: -26, y: -6 }, { x: -30, y: -22, s: 0.85 }]}>
        <Node icon={<Store />} label="Storefront · Next.js" />
      </A>
      <A act="1 2" at={[{}, { x: 26, y: -6 }, { x: 30, y: -22, s: 0.85 }]} d={0.1}>
        <Node icon={<LayoutDashboard />} label="Admin · Vue.js" />
      </A>
      <A act="1" at={[{}, { x: -13, y: -8 }]} d={0.2}>
        <Flow width="12cqw" />
      </A>
      <A act="1" at={[{}, { x: 13, y: -8 }]} d={0.2}>
        <Flow width="12cqw" />
      </A>
      <A act="1" at={[{}, { x: 0, y: -8 }]} d={0.15}>
        <Chip icon={<RefreshCw />} tone="live">
          Real-time sync
        </Chip>
      </A>
      <A act="1" at={[{}, { x: 0, y: 20 }]} d={0.3}>
        <Card icon={<Database />} title="One dataset" sub="products · stock · orders · customers" />
      </A>

      <A act="2" at={[{}, {}, { x: 0, y: 8 }]} d={0.2}>
        <div className="timeline" style={{ width: "30em" }}>
          {["Cart", "Paid", "Packed", "Shipped"].map((s, i) => (
            <div key={s}>
              <i style={{ "--i": i } as React.CSSProperties} />
              <small>{s}</small>
            </div>
          ))}
        </div>
      </A>
      <A act="2" at={[{}, {}, { x: 0, y: 28 }]} d={0.5} float>
        <Chip icon={<CheckCircle2 />} tone="ok">
          Stock updated in both apps
        </Chip>
      </A>
      <LiveShots slug="daniels-believe" host="danielsbelieve.de" />
    </>
  );
}

function NeoGames() {
  const games = ["2048 & Merge", "Arkanoid", "Bejeweled", "Mahjong"];
  return (
    <>
      {["▲", "●", "■", "✕"].map((g, k) => (
        <A key={g} act="0" at={[{ x: [-26, 24, -18, 22][k], y: [-22, -26, 22, 18][k], r: [-8, 6, 4, -6][k] }]} d={k * 0.07} float>
          <span className="glyph">{g}</span>
        </A>
      ))}
      <A act="0" at={[{ x: -2, y: -8 }]} d={0.1}>
        <Chip icon={<AlertTriangle />} tone="warn">
          Progress lost on refresh
        </Chip>
      </A>
      <A act="0" at={[{ x: 4, y: 8 }]} d={0.2}>
        <Chip icon={<AlertTriangle />} tone="warn">
          No reason to come back
        </Chip>
      </A>

      <A act="1" at={[{}, { x: 0, y: 0 }]}>
        <div className="rings">
          {[0, 1].map((r) => (
            <div key={r} className="ring" style={{ "--r": r } as React.CSSProperties}>
              {(r === 0 ? ["Profiles", "Auto-save", "Leaderboards"] : ["Achievements", "Badges", "Responsive"]).map(
                (w, k) => (
                  <span key={w} className="ring__word" style={{ "--k": k % 2, top: `${[50, 8, 92][k]}%` } as React.CSSProperties}>
                    {w}
                  </span>
                ),
              )}
            </div>
          ))}
          <div className="core">
            <Gamepad2 />
            <b>NeoGames</b>
          </div>
        </div>
      </A>

      <A act="2" at={[{}, {}, { x: -10, y: -4 }]} d={0.1}>
        <Panel title="Top categories" tag="leaderboard" width="25em">
          {games.map((g, i) => (
            <Bar key={g} label={g} v={0.92 - i * 0.17} i={i} value={`#${i + 1}`} />
          ))}
        </Panel>
      </A>
      <A act="2" at={[{}, {}, { x: 26, y: -26, r: 5 }]} d={0.35} float>
        <Chip icon={<Trophy />} tone="live">
          Achievement unlocked
        </Chip>
      </A>
      <LiveShots slug="neogames" host="neogames.space" phone={false} />
    </>
  );
}

function ObjectDetection() {
  return (
    <>
      <A act="0" at={[{ x: 0, y: -6 }]}>
        <div className="feeds">
          {["cam_01.mp4", "street.jpg", "batch_07"].map((f) => (
            <div key={f} className="feed">
              <small>{f}</small>
            </div>
          ))}
        </div>
      </A>
      <A act="0" at={[{ x: -22, y: 20, r: -4 }]} d={0.15} float>
        <Card icon={<Braces />} title="notebook.ipynb" sub="works on one machine" dim />
      </A>
      <A act="0" at={[{ x: 22, y: 22 }]} d={0.25}>
        <span className="ask">?</span>
      </A>

      <A act="1" at={[{}, { x: -30, y: -6 }]}>
        <Node icon={<Upload />} label="Upload · React" />
      </A>
      <A act="1" at={[{}, { x: -15, y: -8 }]} d={0.15}>
        <Flow width="10cqw" />
      </A>
      <A act="1" at={[{}, { x: 0, y: -6 }]} d={0.1}>
        <Node icon={<Server />} label="Inference · FastAPI" />
      </A>
      <A act="1" at={[{}, { x: 15, y: -8 }]} d={0.25}>
        <Flow width="10cqw" />
      </A>
      <A act="1" at={[{}, { x: 30, y: -6 }]} d={0.2}>
        <Node icon={<ScanEye />} label="YOLOv5 · PyTorch" />
      </A>
      <A act="1" at={[{}, { x: 0, y: 20 }]} d={0.35}>
        <div className="code" style={{ width: "22em" }}>
          <em>POST</em>/detect · batch<span>json</span>
        </div>
      </A>

      <A act="2" at={[{}, {}, { x: 0, y: -8 }]} d={0.1}>
        <div className="feeds">
          {[
            { f: "cam_01.mp4", b: [{ l: "36%", t: "30%", w: "22%", h: "52%", n: "person" }] },
            { f: "street.jpg", b: [{ l: "14%", t: "46%", w: "40%", h: "34%", n: "car" }, { l: "64%", t: "30%", w: "16%", h: "50%", n: "person" }] },
            { f: "batch_07", b: [{ l: "30%", t: "40%", w: "30%", h: "36%", n: "dog" }] },
          ].map((feed, fi) => (
            <div key={feed.f} className="feed">
              <small>{feed.f}</small>
              {feed.b.map((b, bi) => (
                <div
                  key={bi}
                  className="feed__box"
                  style={{ "--l": b.l, "--t": b.t, "--w": b.w, "--h": b.h, "--i": fi + bi } as React.CSSProperties}
                >
                  <b>{b.n}</b>
                </div>
              ))}
            </div>
          ))}
        </div>
      </A>
      <A act="2" at={[{}, {}, { x: -18, y: 20, r: -3 }]} d={0.4} float>
        <Chip icon={<Camera />} tone="live">
          Confidence overlay
        </Chip>
      </A>
      <A act="2" at={[{}, {}, { x: 20, y: 22, r: 3 }]} d={0.5} float>
        <Chip icon={<Layers />}>Batch jobs</Chip>
      </A>
      <DetectionCharts />
    </>
  );
}

function StockMedia() {
  return (
    <>
      <A act="0" at={[{ x: -24, y: -20, r: -6 }]} float>
        <Chip icon={<ImageIcon />}>Photos</Chip>
      </A>
      <A act="0" at={[{ x: 22, y: -24, r: 5 }]} d={0.08} float>
        <Chip icon={<Film />}>Videos</Chip>
      </A>
      <A act="0" at={[{ x: 26, y: 16, r: -4 }]} d={0.16} float>
        <Chip icon={<Music />}>Audio</Chip>
      </A>
      <A act="0" at={[{ x: -6, y: 4 }]} d={0.1}>
        <Card icon={<Lock />} title="Who holds the license?" sub="and can I preview first?" />
      </A>

      <A act="1" at={[{}, { x: 0, y: -2 }]}>
        <div className="pipeline" style={{ width: "34em" }}>
          {["Search", "Preview", "Cart", "License"].map((c) => (
            <div key={c} className="pipeline__col">
              <small>{c}</small>
              <span />
              <span />
            </div>
          ))}
        </div>
      </A>
      <A act="1" at={[{}, { x: 24, y: 24, r: 4 }]} d={0.3} float>
        <Chip icon={<CreditCard />} tone="ok">
          Secure payments
        </Chip>
      </A>

      <A act="2" at={[{}, {}, { x: -12, y: -6 }]} d={0.1}>
        <Panel title="Creator dashboard" tag="catalogue" width="24em">
          <Row state="ok" i={0}>
            License attached to download
          </Row>
          <Row state="ok" i={1}>
            Preview watermark
          </Row>
          <Row state="ok" i={2}>
            Wishlist saved
          </Row>
        </Panel>
      </A>
      <A act="2" at={[{}, {}, { x: 24, y: 20, r: 4 }]} d={0.35} float>
        <Chip icon={<CheckCircle2 />} tone="live">
          Download ready
        </Chip>
      </A>
      <LiveShots slug="stock-media" host="archvio.com" />
    </>
  );
}

function NasCreative() {
  return (
    <>
      {[
        { t: "Projects", x: -24, y: -22, r: -5 },
        { t: "Services", x: 24, y: -18, r: 5 },
        { t: "Team", x: -26, y: 18, r: 4 },
        { t: "Testimonials", x: 22, y: 22, r: -5 },
      ].map((c, k) => (
        <A key={c.t} act="0" at={[{ x: c.x, y: c.y, r: c.r }]} d={k * 0.08} float>
          <Chip>{c.t}</Chip>
        </A>
      ))}
      <A act="0" at={[{ x: 0, y: 0 }]} d={0.12}>
        <span className="ask">?</span>
      </A>

      <A act="1 2" at={[{}, { x: 0, y: -2 }, { x: -16, y: -6, s: 0.85, r: -3 }]}>
        <div className="compare">
          <div>
            <small>Before</small>
          </div>
          <div>
            <small>After</small>
          </div>
          <i />
        </div>
      </A>
      <A act="1" at={[{}, { x: 30, y: -22, r: 5 }]} d={0.3} float>
        <Chip icon={<ImageIcon />}>Galleries</Chip>
      </A>
      <A act="1" at={[{}, { x: -30, y: 24, r: -4 }]} d={0.4} float>
        <Chip icon={<Sparkles />}>Framer Motion</Chip>
      </A>

      <A act="2" at={[{}, {}, { x: 24, y: 14 }]} d={0.25}>
        <Card icon={<Mail />} title="New enquiry" sub="contact form → notification" />
      </A>
      <A act="2" at={[{}, {}, { x: 26, y: -22, r: 4 }]} d={0.4} float>
        <Chip icon={<CheckCircle2 />} tone="live">
          Supabase
        </Chip>
      </A>
      <LiveShots slug="nas-creative" host="nas-crt.com" />
    </>
  );
}

const ART: Record<string, () => ReactNode> = {
  "vulnerability-benchmark": Vulnerability,
  "daniels-believe": Daniels,
  neogames: NeoGames,
  "object-detection": ObjectDetection,
  "stock-media": StockMedia,
  "nas-creative": NasCreative,
};

export default function WorldArt({ world }: { world: World }) {
  const Art = ART[world.slug];
  return (
    <div className="art" aria-hidden="true">
      {Art ? <Art /> : null}
    </div>
  );
}
