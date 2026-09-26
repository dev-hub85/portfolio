// Particle target shapes the stardust morphs into. Every generator returns
// `count` xyz positions in the shape's local space (roughly radius 10).

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gauss(rand: () => number) {
  return Math.sqrt(-2 * Math.log(Math.max(1e-6, rand()))) * Math.cos(2 * Math.PI * rand());
}

type Gen = (count: number, rand: () => number) => Float32Array;

function onSphere(rand: () => number, r: number): [number, number, number] {
  const t = rand() * Math.PI * 2;
  const p = Math.acos(rand() * 2 - 1);
  return [r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)];
}

/** Ringed planet: dusty sphere plus a banded ring with a Cassini gap. */
const planet: Gen = (count, rand) => {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    if (rand() < 0.42) {
      const [x, y, z] = onSphere(rand, 6.2 + gauss(rand) * 0.08);
      out.set([x, y, z], i * 3);
    } else {
      let r = 9 + rand() * 7;
      if (r > 11.6 && r < 12.3) r += 0.8;
      const a = rand() * Math.PI * 2;
      out.set([Math.cos(a) * r, gauss(rand) * 0.07, Math.sin(a) * r], i * 3);
    }
  }
  return out;
};

/** Icosahedron lattice: bright vertices, dusty edges, a glowing core. */
const crystal: Gen = (count, rand) => {
  const g = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, g, 0], [1, g, 0], [-1, -g, 0], [1, -g, 0],
    [0, -1, g], [0, 1, g], [0, -1, -g], [0, 1, -g],
    [g, 0, -1], [g, 0, 1], [-g, 0, -1], [-g, 0, 1],
  ];
  const norm = Math.hypot(1, g);
  const v = raw.map((p) => p.map((c) => (c / norm) * 9.5));
  const edges: [number, number][] = [];
  for (let a = 0; a < 12; a++)
    for (let b = a + 1; b < 12; b++) {
      const d = Math.hypot(v[a][0] - v[b][0], v[a][1] - v[b][1], v[a][2] - v[b][2]);
      if (d < 10.2) edges.push([a, b]);
    }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const k = rand();
    if (k < 0.68) {
      const [a, b] = edges[Math.floor(rand() * edges.length)];
      const t = rand();
      out.set(
        [0, 1, 2].map((c) => v[a][c] + (v[b][c] - v[a][c]) * t + gauss(rand) * 0.07),
        i * 3,
      );
    } else if (k < 0.82) {
      const p = v[Math.floor(rand() * 12)];
      out.set(p.map((c) => c + gauss(rand) * 0.35), i * 3);
    } else {
      const [x, y, z] = onSphere(rand, Math.pow(rand(), 0.6) * 3.4);
      out.set([x, y, z], i * 3);
    }
  }
  return out;
};

/** (2,3) torus knot with a dusty tube. */
const torusKnot: Gen = (count, rand) => {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = rand() * Math.PI * 2;
    const r = Math.cos(3 * t) + 2.2;
    const cx = r * Math.cos(2 * t) * 3.4;
    const cy = r * Math.sin(2 * t) * 3.4;
    const cz = -Math.sin(3 * t) * 3.4;
    const [ox, oy, oz] = onSphere(rand, Math.sqrt(rand()) * 1.15);
    out.set([cx + ox, cy + oy, cz + oz], i * 3);
  }
  return out;
};

/** Neural network: four layers of nodes wired to their neighbours. */
const neural: Gen = (count, rand) => {
  const layers = [5, 8, 8, 4];
  const xs = [-13, -4.4, 4.4, 13];
  const nodes = layers.map((n, li) =>
    Array.from({ length: n }, (_, k) => [xs[li], (k - (n - 1) / 2) * (n > 6 ? 2.4 : 3.4), Math.sin(k * 1.7 + li) * 1.6]),
  );
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    if (rand() < 0.36) {
      const layer = nodes[Math.floor(rand() * nodes.length)];
      const n = layer[Math.floor(rand() * layer.length)];
      const [x, y, z] = onSphere(rand, Math.pow(rand(), 0.5) * 0.75);
      out.set([n[0] + x, n[1] + y, n[2] + z], i * 3);
    } else {
      const li = Math.floor(rand() * (nodes.length - 1));
      const a = nodes[li][Math.floor(rand() * nodes[li].length)];
      const b = nodes[li + 1][Math.floor(rand() * nodes[li + 1].length)];
      const t = rand();
      out.set([0, 1, 2].map((c) => a[c] + (b[c] - a[c]) * t + gauss(rand) * 0.05), i * 3);
    }
  }
  return out;
};

/** Globe: meridians and parallels on a sphere, like a camera lens aperture. */
const globe: Gen = (count, rand) => {
  const out = new Float32Array(count * 3);
  const R = 8.5;
  for (let i = 0; i < count; i++) {
    const k = rand();
    let theta: number, phi: number;
    if (k < 0.38) {
      theta = (Math.floor(rand() * 14) / 14) * Math.PI * 2 + gauss(rand) * 0.008;
      phi = rand() * Math.PI;
    } else if (k < 0.72) {
      phi = ((Math.floor(rand() * 9) + 1) / 10) * Math.PI + gauss(rand) * 0.008;
      theta = rand() * Math.PI * 2;
    } else {
      theta = rand() * Math.PI * 2;
      phi = Math.acos(rand() * 2 - 1);
    }
    const r = k < 0.72 ? R : R + gauss(rand) * 0.5;
    out.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)], i * 3);
  }
  return out;
};

/** City skyline: a block of towers built from dusty edges and lit windows. */
const skyline: Gen = (count, rand) => {
  const towers: { x: number; z: number; w: number; h: number }[] = [];
  const cells = 7;
  const step = 2.7;
  for (let gx = 0; gx < cells; gx++)
    for (let gz = 0; gz < cells; gz++) {
      const cx = (gx - (cells - 1) / 2) * step;
      const cz = (gz - (cells - 1) / 2) * step;
      const center = 1 - Math.hypot(cx, cz) / 13;
      const h = 1.2 + Math.max(0, center) * 11 * (0.45 + ((gx * 7 + gz * 13) % 10) / 12);
      towers.push({ x: cx, z: cz, w: 0.85 + ((gx + gz) % 3) * 0.12, h });
    }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = towers[Math.floor(rand() * towers.length)];
    const k = rand();
    const y0 = -6;
    let x: number, y: number, z: number;
    if (k < 0.45) {
      // Vertical edges
      x = t.x + (rand() < 0.5 ? -t.w : t.w);
      z = t.z + (rand() < 0.5 ? -t.w : t.w);
      y = y0 + rand() * t.h;
    } else if (k < 0.62) {
      // Roof rim
      const s = rand() * 2 - 1;
      const side = Math.floor(rand() * 4);
      x = t.x + (side < 2 ? s * t.w : side === 2 ? t.w : -t.w);
      z = t.z + (side < 2 ? (side === 0 ? t.w : -t.w) : s * t.w);
      y = y0 + t.h;
    } else if (k < 0.92) {
      // Windows
      const floors = Math.max(1, Math.floor(t.h / 0.8));
      y = y0 + (Math.floor(rand() * floors) + 0.5) * (t.h / floors);
      const side = Math.floor(rand() * 4);
      const s = (Math.floor(rand() * 3) - 1) * t.w * 0.55;
      x = t.x + (side < 2 ? s : side === 2 ? t.w : -t.w);
      z = t.z + (side < 2 ? (side === 0 ? t.w : -t.w) : s);
    } else {
      // Ground grid
      x = (rand() * 2 - 1) * 11;
      z = (Math.round((rand() * 2 - 1) * 4) / 4) * 11;
      if (rand() < 0.5) [x, z] = [z, x];
      y = y0;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
};

/** Nebula: clumps of gas joined by wispy filaments. */
const nebula: Gen = (count, rand) => {
  const clumps = Array.from({ length: 7 }, () => [gauss(rand) * 6, gauss(rand) * 3.5, gauss(rand) * 4, 1.6 + rand() * 2.8]);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    if (rand() < 0.7) {
      const c = clumps[Math.floor(rand() * clumps.length)];
      out.set([c[0] + gauss(rand) * c[3], c[1] + gauss(rand) * c[3] * 0.7, c[2] + gauss(rand) * c[3]], i * 3);
    } else {
      const a = clumps[Math.floor(rand() * clumps.length)];
      const b = clumps[Math.floor(rand() * clumps.length)];
      const t = rand();
      const bend = Math.sin(t * Math.PI) * 3;
      out.set([a[0] + (b[0] - a[0]) * t + gauss(rand) * 0.6, a[1] + (b[1] - a[1]) * t + bend + gauss(rand) * 0.6, a[2] + (b[2] - a[2]) * t + gauss(rand) * 0.6], i * 3);
    }
  }
  return out;
};

/** Rolling wave field. */
const waves: Gen = (count, rand) => {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = (rand() * 2 - 1) * 17;
    const v = (rand() * 2 - 1) * 10;
    const snapU = rand() < 0.5;
    const x = snapU ? Math.round(u / 1.1) * 1.1 : u;
    const z = snapU ? v : Math.round(v / 1.1) * 1.1;
    const y = Math.sin(x * 0.42) * 1.8 + Math.cos(z * 0.55 + x * 0.18) * 1.3;
    out.set([x, y + gauss(rand) * 0.05, z], i * 3);
  }
  return out;
};

export const SHAPES = { planet, crystal, torusKnot, neural, globe, skyline, nebula, waves };
export type ShapeName = keyof typeof SHAPES;

const cache = new Map<string, Float32Array>();
export function shapePositions(name: ShapeName, count: number) {
  const key = `${name}:${count}`;
  let arr = cache.get(key);
  if (!arr) {
    arr = SHAPES[name](count, mulberry32(name.length * 7919 + count));
    cache.set(key, arr);
  }
  return arr;
}

// ─── Name made of dust ──────────────────────────────────────────────────────

export interface TextTargets {
  /** xyz per particle: x, y in world units on the z=0 plane; z = line index (0 or 1). */
  positions: Float32Array;
  halfWidth: number;
  centerY: number;
}

/**
 * Sample the name from a 2D canvas and map it into world units so it spans
 * `targetWidth` and sits centred at `centerY`.
 */
export function buildTextTargets(
  count: number,
  opts: { display: string; serif: string; targetWidth: number; maxHeight: number; centerY: number; stacked: boolean },
): TextTargets {
  const W = 2400;
  const H = opts.stacked ? 1500 : 1000;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const line1 = "Abdul";
  const line2 = "Rehman";
  // Fit each line into the canvas width.
  const fit = (font: (s: number) => string, text: string, maxW: number, start: number) => {
    let size = start;
    ctx.font = font(size);
    while (ctx.measureText(text).width > maxW && size > 40) {
      size -= 8;
      ctx.font = font(size);
    }
    return size;
  };
  const f1 = (s: number) => `600 ${s}px ${opts.display}`;
  const f2 = (s: number) => `italic 400 ${s}px ${opts.serif}`;
  const s1 = fit(f1, line1, W * 0.9, opts.stacked ? 520 : 470);
  const s2 = fit(f2, line2, W * 0.9, Math.round(s1 * 1.28));
  ctx.font = f1(s1);
  ctx.fillText(line1, W / 2, H * (opts.stacked ? 0.42 : 0.44));
  ctx.font = f2(s2);
  ctx.fillText(line2, W / 2, H * (opts.stacked ? 0.86 : 0.9));

  const data = ctx.getImageData(0, 0, W, H).data;
  const splitY = H * (opts.stacked ? 0.52 : 0.54);
  const pts: number[] = [];
  let minX = W, maxX = 0, minY = H, maxY = 0;
  const stride = 2;
  for (let y = 0; y < H; y += stride)
    for (let x = 0; x < W; x += stride) {
      if (data[(y * W + x) * 4 + 3] > 110) {
        pts.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

  const pw = Math.max(1, maxX - minX);
  const ph = Math.max(1, maxY - minY);
  const scale = Math.min(opts.targetWidth / pw, opts.maxHeight / ph);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const rand = mulberry32(4242);
  const positions = new Float32Array(count * 3);
  const n = pts.length / 2;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(rand() * n) * 2;
    const px = pts[k] + (rand() - 0.5) * stride;
    const py = pts[k + 1] + (rand() - 0.5) * stride;
    positions[i * 3] = (px - cx) * scale;
    positions[i * 3 + 1] = -(py - cy) * scale + opts.centerY;
    positions[i * 3 + 2] = pts[k + 1] > splitY ? 1 : 0;
  }
  return { positions, halfWidth: (pw * scale) / 2, centerY: opts.centerY };
}
