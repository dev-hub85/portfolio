// The universe: one fixed three.js canvas behind every chapter. A single
// stardust cloud morphs between the hero name, a spiral galaxy, the Rubik's
// cube, a black hole's accretion disk and a set of other forms (planet,
// crystal, knot, neural net, globe, skyline, nebula, waves). GSAP tweens
// every change; two ping-pong "shape slots" let any form flow into another.

import * as THREE from "three";
import gsap from "gsap";
import type { Stage, StagePayload } from "@/lib/cosmos-bus";
import { RubikCube, buildStardustCube, CUBE_SLOTS, ROOT_SLOT } from "./rubik";
import { buildTextTargets, gauss, mulberry32, shapePositions, type ShapeName } from "./shapes";
import { Sparks } from "./sparks";

// ─── Particle generation ────────────────────────────────────────────────────

const GALAXY_RADIUS = 26;

function srgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const CORE = srgb("#ffe4e8");
const WARM = srgb("#ff5a6e");
const PINK = srgb("#ff6fa8");
const VIOLET = srgb("#8b6bff");
const BLUE = srgb("#4f7dff");

function galaxyColor(t: number, rand: () => number, out: THREE.Vector3) {
  if (t < 0.12) out.copy(CORE).lerp(WARM, t / 0.12);
  else if (t < 0.45) out.copy(WARM).lerp(PINK, (t - 0.12) / 0.33);
  else if (t < 0.75) out.copy(PINK).lerp(VIOLET, (t - 0.45) / 0.3);
  else out.copy(VIOLET).lerp(BLUE, Math.min(1, (t - 0.75) / 0.25));
  const r = rand();
  if (r < 0.05) out.lerp(BLUE, 0.7);
  else if (r < 0.08) out.set(1, 1, 1);
  return out;
}

interface ParticleData {
  count: number;
  position: Float32Array;
  color: Float32Array;
  meta: Float32Array;
  hole: Float32Array;
  cube: ReturnType<typeof buildStardustCube>;
}

function buildParticles(count: number): ParticleData {
  const rand = mulberry32(20260925);
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const meta = new Float32Array(count * 4);
  const hole = new Float32Array(count * 3);
  const cube = buildStardustCube(count, 11);
  const c = new THREE.Vector3();
  const ARMS = 2;
  const SPIN = 0.32;

  for (let i = 0; i < count; i++) {
    const kind = rand();
    let x: number, y: number, z: number, t: number;

    if (kind < 0.1) {
      const r = Math.abs(gauss(rand)) * 2.4;
      const a = rand() * Math.PI * 2;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
      y = gauss(rand) * 0.9 * Math.max(0.2, 1 - r / 5);
      t = r / GALAXY_RADIUS;
    } else if (kind < 0.86) {
      const r = 1.5 + Math.pow(rand(), 1.25) * GALAXY_RADIUS;
      const arm = Math.floor(rand() * ARMS);
      const spread = Math.pow(rand(), 2.6) * (0.5 + r * 0.045) * (rand() < 0.5 ? -1 : 1);
      const a = (arm / ARMS) * Math.PI * 2 + r * SPIN * 0.56 + spread * 0.55;
      x = Math.cos(a) * r + gauss(rand) * (0.2 + r * 0.028);
      z = Math.sin(a) * r + gauss(rand) * (0.2 + r * 0.028);
      y = gauss(rand) * 0.35 * (1.2 - r / GALAXY_RADIUS);
      t = r / GALAXY_RADIUS;
    } else {
      const r = Math.pow(rand(), 0.8) * GALAXY_RADIUS * 1.15;
      const a = rand() * Math.PI * 2;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
      y = gauss(rand) * 0.9;
      t = Math.min(1, 0.5 + (r / GALAXY_RADIUS) * 0.5);
    }

    position.set([x, y, z], i * 3);
    galaxyColor(t, rand, c);
    const dim = kind >= 0.86 ? 0.5 : 1;
    color.set([c.x * dim, c.y * dim, c.z * dim], i * 3);
    const scale = rand() < 0.04 ? 2.4 + rand() * 2.8 : 0.7 + rand() * 1.25;
    meta.set([scale, rand(), cube.cubie[i], cube.kind[i]], i * 4);
    const hr = 5.4 + Math.pow(rand(), 1.9) * 15;
    hole.set([hr, rand() * Math.PI * 2, gauss(rand) * 0.1 * (hr / 8)], i * 3);
  }

  return { count, position, color, meta, hole, cube };
}

function buildStars(count: number) {
  const rand = mulberry32(77);
  const position = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const scale = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const r = 150 + rand() * 120;
    position.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta) - 60], i * 3);
    seed[i] = rand();
    scale[i] = rand() < 0.06 ? 2 + rand() * 2 : 0.6 + rand();
  }
  return { position, seed, scale };
}

function glowTexture(inner: string, outer: string) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.18, inner);
  g.addColorStop(0.45, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function cloudTexture(seedValue: number) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(seedValue);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 70; i++) {
    const x = size / 2 + gauss(rand) * size * 0.16;
    const y = size / 2 + gauss(rand) * size * 0.12;
    const r = 18 + rand() * 50;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${0.05 + rand() * 0.07})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── Shaders ────────────────────────────────────────────────────────────────

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uIntro;
  uniform float uOpacity;
  uniform float uTintAmt;
  uniform vec3 uTint;
  uniform float uCube;
  uniform float uHole;
  uniform float uText;
  uniform float uAltA;
  uniform float uAltB;
  uniform float uBurst;
  uniform mat4 uCubies[${CUBE_SLOTS}];
  uniform mat4 uHoleMatrix;
  uniform mat4 uAltMatA;
  uniform mat4 uAltMatB;
  uniform vec3 uIntroOrigin;
  uniform vec2 uMouse;
  uniform float uMouseForce;
  uniform vec3 uFire;
  uniform float uTextHalf;

  attribute vec3 aColor;
  attribute vec4 aMeta;
  attribute vec3 aHole;
  attribute vec3 aCube;
  attribute vec3 aCubeColor;
  attribute vec3 aText;
  attribute vec3 aAltA;
  attribute vec3 aAltB;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 hash3(float s) {
    return fract(sin(vec3(s * 12.9898, s * 78.233, s * 37.719)) * 43758.5453) * 2.0 - 1.0;
  }

  float phase(float v, float seed) {
    float t = clamp(v * 1.75 - seed * 0.75, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float scale = aMeta.x;
    float seed = aMeta.y;
    float kind = aMeta.w;

    // Galaxy with differential rotation (local → world via modelMatrix)
    vec3 g = position;
    float r = length(g.xz);
    float ang = uTime * 0.05 / (0.35 + r * 0.045);
    float c = cos(ang), s = sin(ang);
    g.xz = mat2(c, -s, s, c) * g.xz;
    vec3 world = (modelMatrix * vec4(g, 1.0)).xyz;

    vec3 altA = (uAltMatA * vec4(aAltA, 1.0)).xyz;
    vec3 altB = (uAltMatB * vec4(aAltB, 1.0)).xyz;

    mat4 cm = uCubies[int(aMeta.z + 0.5)];
    vec3 cube = (cm * vec4(aCube, 1.0)).xyz;
    vec3 cubeCenter = uCubies[${ROOT_SLOT}][3].xyz;
    cube += (cube - cubeCenter) * uBurst * (0.25 + seed * 0.9);
    cube += hash3(seed * 31.0) * 0.012 * sin(uTime * 3.0 + seed * 60.0);

    float hr = aHole.x;
    float ha = aHole.y + uTime * (2.4 / sqrt(hr));
    vec3 hole = (uHoleMatrix * vec4(cos(ha) * hr, aHole.z, sin(ha) * hr, 1.0)).xyz;

    vec3 text = vec3(aText.xy, hash3(seed * 7.7).z * 0.3);
    text.xy += hash3(seed * 3.3).xy * 0.03 * sin(uTime * 1.5 + seed * 40.0);

    float ta = phase(uAltA, seed);
    float tb = phase(uAltB, seed);
    float tc = phase(uCube, seed);
    float th = phase(uHole, seed);
    float tt = phase(uText, seed);
    world = mix(world, altA, ta);
    world = mix(world, altB, tb);
    world = mix(world, cube, tc);
    world = mix(world, hole, th);
    world = mix(world, text, tt);
    float flight = sin(ta * 3.14159) + sin(tb * 3.14159) + sin(tc * 3.14159) + sin(th * 3.14159) + sin(tt * 3.14159);
    world += hash3(seed * 91.7) * flight * 5.0;

    // The name parts around the pointer
    vec2 md = world.xy - uMouse;
    float mdist = length(md);
    float push = uMouseForce * tt * smoothstep(6.5, 0.0, mdist);
    world.xy += (md / max(mdist, 0.001)) * push * 3.4;
    world.z += push * (3.0 + seed * 6.0);

    // Click: a shockwave of dust from the fire point
    float glow = 0.0;
    if (uFire.z < 3.0) {
      float ft = uFire.z;
      float env = ft < 0.1 ? ft / 0.1 : exp(-(ft - 0.1) * 1.8);
      vec2 fd = world.xy - uFire.xy;
      float amp = env * exp(-length(fd) / 11.0) * (0.35 + tt * 0.65);
      vec3 dir = normalize(vec3(fd, 0.0) + hash3(seed * 17.3) * 1.1 + vec3(0.0, 0.0, 0.8));
      world += dir * amp * (5.0 + seed * 16.0);
      glow = amp;
    }

    // Ignition: everything flies out of the loader's first star
    float ti = clamp(uIntro * 1.4 - seed * 0.4, 0.0, 1.0);
    ti = ti * ti * (3.0 - 2.0 * ti);
    world = mix(uIntroOrigin + hash3(seed * 5.1) * 0.25, world, ti);

    vec4 mv = viewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;

    float luma = dot(aColor, vec3(0.3, 0.59, 0.11));
    vec3 col = mix(aColor, uTint * (0.35 + luma * 1.25), uTintAmt);
    col = mix(col, aCubeColor * 1.1, tc);
    vec3 holeCol = mix(vec3(1.0, 0.88, 0.9), mix(vec3(1.0, 0.3, 0.38), vec3(0.58, 0.44, 1.0), smoothstep(8.0, 17.0, hr)), smoothstep(5.4, 8.5, hr));
    col = mix(col, holeCol, th);
    float gx = clamp(aText.x / (2.0 * uTextHalf) + 0.5, 0.0, 1.0);
    vec3 white = mix(vec3(0.95, 0.94, 1.0), vec3(0.74, 0.7, 1.0), step(0.85, fract(seed * 13.7)));
    vec3 red = mix(vec3(1.0, 0.82, 0.84), vec3(0.95, 0.16, 0.26), gx);
    vec3 textCol = (aText.z < 0.5 ? white : red) * 1.3;
    col = mix(col, textCol, tt);
    col += glow * vec3(1.0, 0.38, 0.45) * 0.8 + push * vec3(0.5, 0.45, 1.0) * 0.25;

    float kindSize = kind < 0.5 ? 1.05 : (kind < 1.5 ? 0.7 : 0.85);
    float size = mix(scale, min(scale, 1.4), max(tc, tt)) * mix(1.0, kindSize, tc) * mix(1.0, 0.85, th) * mix(1.0, 0.74, tt);
    gl_PointSize = min(uSize * size * uPixelRatio * (150.0 / -mv.z) * (1.0 + glow), 28.0 * uPixelRatio);

    float twinkle = 0.62 + 0.38 * sin(uTime * (0.8 + seed * 2.2) + seed * 50.0);
    vAlpha = mix(twinkle, 0.9 + 0.1 * twinkle, max(tt, tc)) * uOpacity * mix(1.0, 1.2, tc) * mix(1.0, 1.35, tt);
    vColor = col;
  }
`;

const dustFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = core * core * vAlpha;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio;
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.4 + aSeed * 1.6) + aSeed * 90.0));
    vColor = mix(vec3(0.85, 0.9, 1.0), vec3(1.0, 0.84, 0.86), step(0.7, aSeed));
  }
`;

const starFragment = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vAlpha * uOpacity;
    gl_FragColor = vec4(vColor, a);
  }
`;

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float ring = exp(-pow((r - 0.42) / 0.018, 2.0));
    float halo = exp(-pow((r - 0.44) / 0.12, 2.0)) * 0.45;
    float outer = exp(-pow((r - 0.5) / 0.35, 2.0)) * 0.12;
    float flicker = 0.92 + 0.08 * sin(uTime * 2.0 + atan(p.y, p.x) * 3.0);
    vec3 col = mix(vec3(1.0, 0.88, 0.9), vec3(1.0, 0.42, 0.48), smoothstep(0.4, 0.7, r));
    float a = (ring + halo + outer) * flicker * uOpacity;
    gl_FragColor = vec4(col * a, a);
  }
`;

// ─── Stage looks ────────────────────────────────────────────────────────────

interface Preset {
  gx: number;
  gy: number;
  gz: number;
  tilt: number;
  roll: number;
  bank: number;
  scale: number;
  galaxy: number;
  cube: number;
  hole: number;
  name: number;
  planets: number;
  tools: number;
  orbitRing: number;
  stars: number;
  // Anchor for the shape slots
  ax: number;
  ay: number;
  az: number;
  arx: number;
  ary: number;
  arz: number;
  as: number;
  // Black hole and cube placement
  hx: number;
  hy: number;
  hs: number;
  cbx: number;
  cby: number;
  cbs: number;
}

/** Free area beside a chapter's text, in world units on the z=0 plane. */
interface Frame {
  cx: number;
  cy: number;
  r: number;
}

interface StageLook {
  preset: Preset;
  shape: ShapeName | null;
  tint: string | null;
  tintAmt: number;
}

// How each form moves: continuous spin (rad/s) or a gentle sway around a fixed facing.
const SHAPE_MOTION: Record<ShapeName, { spin: number; sway: number }> = {
  planet: { spin: 0.08, sway: 0 },
  crystal: { spin: 0.14, sway: 0 },
  torusKnot: { spin: 0.12, sway: 0 },
  neural: { spin: 0, sway: 0.28 },
  globe: { spin: 0.14, sway: 0 },
  skyline: { spin: 0.06, sway: 0 },
  nebula: { spin: 0.04, sway: 0 },
  waves: { spin: 0, sway: 0.3 },
};

const BASE: Preset = {
  gx: 16,
  gy: 2,
  gz: 0,
  tilt: 0.42,
  roll: 0.12,
  bank: -0.1,
  scale: 1,
  galaxy: 1,
  cube: 0,
  hole: 0,
  name: 0,
  planets: 0,
  tools: 0,
  orbitRing: 0,
  stars: 1,
  ax: 18,
  ay: 0,
  az: 0,
  arx: 0.3,
  ary: 0,
  arz: 0,
  as: 1,
  hx: 19,
  hy: 0,
  hs: 1,
  cbx: 19,
  cby: 1,
  cbs: 5.1,
};

// Form per world (index in lib/worlds); null keeps the galaxy for NeoGames.
const WORLD_SHAPES: (ShapeName | null)[] = ["crystal", "torusKnot", null, "neural", "globe", "skyline"];

// On-screen radius of each form at scale 1, used to fit it to its chapter's free area.
const SHAPE_RADIUS: Record<ShapeName, number> = {
  planet: 16.5,
  crystal: 11.5,
  torusKnot: 12.5,
  neural: 13.5,
  globe: 9.5,
  skyline: 15,
  nebula: 12,
  waves: 17,
};
const GALAXY_FIT_RADIUS = 27;
const HOLE_FIT_RADIUS = 21;

const none = { shape: null, tint: null, tintAmt: 0 } as const;

function lookFor(stage: Stage, f: Frame, mobile: boolean, world = 0, step = 0, accent?: string): StageLook {
  const fit = (radius: number, k = 1) => (f.r / radius) * k;
  const at = { gx: f.cx, gy: f.cy, ax: f.cx, ay: f.cy, hx: f.cx, hy: f.cy };
  switch (stage) {
    case "hero":
      return { preset: { ...BASE, ...at, name: 1, galaxy: 0 }, ...none };
    case "origin":
      return {
        preset: { ...BASE, ...at, tilt: 0.5, roll: 0.2, bank: -0.1, scale: fit(GALAXY_FIT_RADIUS, 0.86), planets: 1, orbitRing: 1 },
        ...none,
      };
    case "about":
      return { preset: { ...BASE, ...at, tilt: 0.9, scale: fit(GALAXY_FIT_RADIUS, 0.6), galaxy: 0.6, cube: 1 }, ...none };
    case "skills":
      return {
        preset: { ...BASE, ...at, galaxy: 0, arx: 0.42, arz: -0.28, as: fit(SHAPE_RADIUS.planet), tools: mobile ? 0 : 1 },
        shape: "planet",
        tint: "#ff5a67",
        tintAmt: 0.35,
      };
    case "work":
      return { preset: { ...BASE, ...at, tilt: 1.32, roll: 0.5, scale: fit(GALAXY_FIT_RADIUS) }, ...none };
    case "world": {
      const shape = WORLD_SHAPES[world] ?? null;
      const zoom = [0.94, 1, 1.04, 0.86][step] ?? 1;
      const lift = [0, 0.1, 0.2, -0.25][step] ?? 0;
      if (!shape) {
        const tilts = [0.42, 0.62, 1.0, 0.95, 0.7, 1.2];
        return {
          preset: {
            ...BASE,
            ...at,
            tilt: tilts[world % tilts.length] + lift,
            roll: 0.1 + world * 0.25 + step * 0.12,
            scale: fit(GALAXY_FIT_RADIUS, zoom),
            galaxy: step === 3 ? 0.55 : 1,
          },
          shape: null,
          tint: accent ?? null,
          tintAmt: 0.88,
        };
      }
      return {
        preset: {
          ...BASE,
          ...at,
          galaxy: 0,
          arx: shape === "neural" ? 0.12 + lift * 0.5 : 0.35 + lift,
          ary: shape === "neural" ? -0.45 + step * 0.12 : step * 0.6,
          arz: shape === "neural" ? 0.04 : -0.15 + world * 0.08,
          as: fit(SHAPE_RADIUS[shape], zoom),
        },
        shape,
        tint: accent ?? null,
        tintAmt: 0.85,
      };
    }
    case "workshop":
      return {
        preset: { ...BASE, ...at, galaxy: 0, az: -6, arx: 0.2, as: fit(SHAPE_RADIUS.nebula) },
        shape: "nebula",
        tint: "#8b7bff",
        tintAmt: 0.45,
      };
    case "log":
      return {
        preset: { ...BASE, ...at, galaxy: 0, arx: 0.5, arz: -0.12, as: fit(SHAPE_RADIUS.waves) },
        shape: "waves",
        tint: "#56d7ff",
        tintAmt: 0.4,
      };
    case "contact":
      return { preset: { ...BASE, ...at, tilt: 0.8, galaxy: 0.4, hole: 1, hs: fit(HOLE_FIT_RADIUS), stars: 0.8 }, ...none };
  }
}

// ─── Engine ─────────────────────────────────────────────────────────────────

export interface UniverseOptions {
  mobile: boolean;
  reducedMotion: boolean;
  fonts: { display: string; serif: string };
}

interface Slot {
  attr: THREE.BufferAttribute;
  shape: ShapeName | null;
  weight: { value: number };
  matrix: THREE.Matrix4;
  spin: number;
  sway: number;
  acc: number;
}

export class Universe {
  readonly cube = new RubikCube();
  readonly camera: THREE.PerspectiveCamera;
  readonly canvas: HTMLCanvasElement;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private galaxy = new THREE.Group();
  private dust: THREE.Points;
  private dustMat: THREE.ShaderMaterial;
  private stars: THREE.Points;
  private starMat: THREE.ShaderMaterial;
  private coreGlow: THREE.Sprite;
  private orbitLine: THREE.LineLoop;
  private hole = new THREE.Group();
  private holeRing: THREE.Mesh;
  private holeClouds: THREE.Sprite[] = [];
  private holeDiskFrame = new THREE.Object3D();
  private sparks = new Sparks();
  private slots: Slot[];
  private altQuat = new THREE.Quaternion();
  private altEuler = new THREE.Euler();
  private altScale = new THREE.Vector3();
  private count: number;
  private fonts: UniverseOptions["fonts"];

  private params: Preset = { ...BASE };
  private tint = { r: 1, g: 1, b: 1, amt: 0 };
  private cameraDrift = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0, moved: 0 };
  private mouseWorld = new THREE.Vector2(999, 999);
  private mouseForce = 0;
  private fire = { x: 0, y: 0, t: 99 };
  private stage: StagePayload = { stage: "hero", progress: 0 };
  private worldStep = 0;
  private time = 0;
  private paused = false;
  private mobile: boolean;
  private reduced: boolean;
  private width = 1;
  private height = 1;
  private planets: HTMLElement[] = [];
  private tools: { el: HTMLElement; ring: number; angle: number }[] = [];
  private tickFn: () => void;
  private cubeWasSolved = true;
  private disposers: (() => void)[] = [];
  private intro = { value: 0 };
  private scrambledOnce = false;
  private tmp = new THREE.Vector3();
  private center = new THREE.Vector3();
  private ray = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  constructor(container: HTMLElement, opts: UniverseOptions) {
    this.mobile = opts.mobile;
    this.reduced = opts.reducedMotion;
    this.fonts = opts.fonts;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    container.appendChild(this.canvas);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 600);
    this.camera.position.set(0, 0, 60);

    // Background stars
    const starData = buildStars(this.mobile ? 1400 : 2600);
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starData.position, 3));
    starGeo.setAttribute("aSeed", new THREE.BufferAttribute(starData.seed, 1));
    starGeo.setAttribute("aScale", new THREE.BufferAttribute(starData.scale, 1));
    this.starMat = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uOpacity: { value: 1 } },
    });
    this.stars = new THREE.Points(starGeo, this.starMat);
    this.scene.add(this.stars);

    // Stardust
    this.count = this.mobile ? 24000 : 56000;
    const data = buildParticles(this.count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.position, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(data.color, 3));
    geo.setAttribute("aMeta", new THREE.BufferAttribute(data.meta, 4));
    geo.setAttribute("aHole", new THREE.BufferAttribute(data.hole, 3));
    geo.setAttribute("aCube", new THREE.BufferAttribute(data.cube.local, 3));
    geo.setAttribute("aCubeColor", new THREE.BufferAttribute(data.cube.color, 3));
    geo.setAttribute("aText", new THREE.BufferAttribute(new Float32Array(this.count * 3), 3));
    const altA = new THREE.BufferAttribute(new Float32Array(this.count * 3), 3);
    const altB = new THREE.BufferAttribute(new Float32Array(this.count * 3), 3);
    geo.setAttribute("aAltA", altA);
    geo.setAttribute("aAltB", altB);
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 400);

    this.dustMat = new THREE.ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uSize: { value: this.mobile ? 1.1 : 1.02 },
        uIntro: { value: 0 },
        uOpacity: { value: 1 },
        uTintAmt: { value: 0 },
        uTint: { value: new THREE.Vector3(1, 1, 1) },
        uCube: { value: 0 },
        uHole: { value: 0 },
        uText: { value: 1 },
        uAltA: { value: 0 },
        uAltB: { value: 0 },
        uBurst: { value: 0 },
        uCubies: { value: Array.from({ length: CUBE_SLOTS }, () => new THREE.Matrix4()) },
        uHoleMatrix: { value: new THREE.Matrix4() },
        uAltMatA: { value: new THREE.Matrix4() },
        uAltMatB: { value: new THREE.Matrix4() },
        uIntroOrigin: { value: new THREE.Vector3(0, 0, 0) },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uMouseForce: { value: 0 },
        uFire: { value: new THREE.Vector3(0, 0, 99) },
        uTextHalf: { value: 20 },
      },
    });
    this.dust = new THREE.Points(geo, this.dustMat);
    this.dust.frustumCulled = false;
    this.galaxy.add(this.dust);

    const slot = (attr: THREE.BufferAttribute, weight: string, matrix: string): Slot => ({
      attr,
      shape: null,
      weight: this.dustMat.uniforms[weight] as { value: number },
      matrix: this.dustMat.uniforms[matrix].value as THREE.Matrix4,
      spin: 0,
      sway: 0,
      acc: 0,
    });
    this.slots = [slot(altA, "uAltA", "uAltMatA"), slot(altB, "uAltB", "uAltMatB")];

    this.coreGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(255,232,236,1)", "rgba(255,80,100,0.3)"),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    );
    this.coreGlow.scale.setScalar(16);
    this.galaxy.add(this.coreGlow);

    const orbitPts: THREE.Vector3[] = [];
    for (let i = 0; i < 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(a) * 24, 0, Math.sin(a) * 24));
    }
    this.orbitLine = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: 0xffb3ba, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.galaxy.add(this.orbitLine);
    this.scene.add(this.galaxy);

    // Black hole
    const shadow = new THREE.Mesh(new THREE.SphereGeometry(4.2, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    this.hole.add(shadow);
    this.holeRing = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      }),
    );
    this.hole.add(this.holeRing);
    const cloudMap = cloudTexture(9);
    for (let i = 0; i < 7; i++) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: cloudMap,
          color: i % 3 === 0 ? 0xc9a0ff : 0xff8a95,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const a = (i / 7) * Math.PI * 2;
      sprite.position.set(Math.cos(a) * 3.5, (i % 2 ? 1 : -1) * (3 + (i % 3)), Math.sin(a) * 2);
      sprite.scale.setScalar(12 + (i % 3) * 4);
      sprite.material.rotation = a;
      this.hole.add(sprite);
      this.holeClouds.push(sprite);
    }
    this.hole.add(this.holeDiskFrame);
    this.holeDiskFrame.rotation.set(0.1, 0, -0.05);
    this.hole.visible = false;
    this.scene.add(this.hole);

    this.scene.add(this.cube.group);
    this.scene.add(this.sparks.points);

    this.resize();
    this.applyLook(0.01);

    this.onPointer = this.onPointer.bind(this);
    window.addEventListener("pointermove", this.onPointer, { passive: true });

    this.cube.onStatus((s) => {
      if (s.solved && !this.cubeWasSolved && !s.busy) this.burst();
      this.cubeWasSolved = s.solved;
    });

    this.tickFn = () => this.frame(gsap.ticker.deltaRatio(60) / 60);
    gsap.ticker.add(this.tickFn);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /** Dust streams out of the loader's first star into the name. */
  ignite() {
    gsap.to(this.intro, { value: 1, duration: this.reduced ? 0.01 : 3, ease: "power2.out" });
  }

  setStage(p: StagePayload) {
    const changed = p.stage !== this.stage.stage || p.world !== this.stage.world;
    this.stage = p;
    if (changed) {
      if (p.stage !== "world") this.worldStep = 0;
      this.applyLook();
    }
  }

  setWorldStep(world: number, step: number) {
    if (this.stage.stage !== "world" || this.stage.world !== world) return;
    if (step === this.worldStep) return;
    this.worldStep = step;
    this.applyLook(1.4);
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  registerPlanets(els: HTMLElement[]) {
    this.planets = els;
  }

  registerTools(els: HTMLElement[]) {
    this.tools = els.map((el, i) => ({ el, ring: i % 3, angle: (i / els.length) * Math.PI * 2 * 3 }));
  }

  attachCube(zone: HTMLElement) {
    const off = this.cube.attach(zone, this.camera, this.canvas);
    this.disposers.push(off);
    return off;
  }

  /** Fire a burst of dust from a viewport point (clicks on the hero name). */
  fireAt(clientX: number, clientY: number) {
    const p = this.toPlane(clientX, clientY);
    if (!p) return;
    this.fire = { x: p.x, y: p.y, t: 0 };
    this.sparks.fire(new THREE.Vector3(p.x, p.y, 1), this.mobile ? 320 : 560);
  }

  resize() {
    const w = window.innerWidth;
    const h = this.canvas.parentElement?.clientHeight || window.innerHeight;
    this.width = w;
    this.height = h;
    const mobile = w < 860 || (w < 1100 && h > w);
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.camera.aspect = w / h;
    this.camera.position.z = this.camera.aspect < 0.8 ? 78 : 60;
    this.camera.updateProjectionMatrix();
    this.dustMat.uniforms.uPixelRatio.value = dpr;
    this.starMat.uniforms.uPixelRatio.value = dpr;
    this.sparks.setPixelRatio(dpr);
    this.buildText();
    this.mobile = mobile;
    this.applyLook(0.6);
  }

  dispose() {
    gsap.ticker.remove(this.tickFn);
    window.removeEventListener("pointermove", this.onPointer);
    this.disposers.forEach((d) => d());
    gsap.killTweensOf([this.params, this.tint, this.intro, this.dustMat.uniforms.uBurst, ...this.slots.map((s) => s.weight)]);
    this.cube.dispose();
    this.sparks.dispose();
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => {
        (m as THREE.SpriteMaterial).map?.dispose();
        m.dispose();
      });
    });
    this.renderer.dispose();
    this.canvas.remove();
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  private visibleSize() {
    const h = 2 * this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    return { w: h * this.camera.aspect, h };
  }

  private buildText() {
    const { w, h } = this.visibleSize();
    const stacked = this.camera.aspect < 1.1;
    const t = buildTextTargets(this.count, {
      display: this.fonts.display,
      serif: this.fonts.serif,
      targetWidth: w * (stacked ? 0.86 : 0.7),
      maxHeight: h * (stacked ? 0.46 : 0.6),
      centerY: h * 0.01,
      stacked,
    });
    const attr = this.dust.geometry.getAttribute("aText") as THREE.BufferAttribute;
    (attr.array as Float32Array).set(t.positions);
    attr.needsUpdate = true;
    this.dustMat.uniforms.uTextHalf.value = t.halfWidth;
    (this.dustMat.uniforms.uIntroOrigin.value as THREE.Vector3).set(0, t.centerY, 0);
  }

  private toPlane(clientX: number, clientY: number) {
    const ndc = new THREE.Vector2((clientX / this.width) * 2 - 1, -(clientY / this.height) * 2 + 1);
    this.ray.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    return this.ray.ray.intersectPlane(this.plane, hit) ? hit : null;
  }

  private onPointer(e: PointerEvent) {
    this.pointer.x = (e.clientX / this.width) * 2 - 1;
    this.pointer.y = (e.clientY / this.height) * 2 - 1;
    this.pointer.moved = 1;
    const p = this.toPlane(e.clientX, e.clientY);
    if (p) this.mouseWorld.set(p.x, p.y);
  }

  /** Load a form into the free slot and cross-fade to it (null fades both out). */
  private showShape(shape: ShapeName | null, d: number) {
    const [a, b] = this.slots;
    const active = a.weight.value >= b.weight.value ? a : b;
    const other = active === a ? b : a;
    const ease = "power2.inOut";
    if (!shape) {
      this.slots.forEach((s) => gsap.to(s.weight, { value: 0, duration: d, ease, overwrite: "auto" }));
      return;
    }
    if (active.shape === shape) {
      gsap.to(active.weight, { value: 1, duration: d, ease, overwrite: "auto" });
      gsap.to(other.weight, { value: 0, duration: d, ease, overwrite: "auto" });
      return;
    }
    gsap.killTweensOf(other.weight);
    other.weight.value = 0;
    (other.attr.array as Float32Array).set(shapePositions(shape, this.count));
    other.attr.needsUpdate = true;
    other.shape = shape;
    other.spin = SHAPE_MOTION[shape].spin;
    other.sway = SHAPE_MOTION[shape].sway;
    other.acc = 0;
    gsap.to(other.weight, { value: 1, duration: d * 1.15, ease, overwrite: "auto" });
    gsap.to(active.weight, { value: 0, duration: d, ease, overwrite: "auto" });
  }

  private pxToWorld() {
    return this.visibleSize().w / this.width;
  }

  /** The largest circle beside the active chapter's text, so forms never cover the copy. */
  private measureFrame(stage: Stage, world: number): Frame {
    const W = this.width;
    const H = this.height;
    const k = this.pxToWorld();
    const toWorld = (x: number, y: number, r: number): Frame => ({ cx: (x - W / 2) * k, cy: (H / 2 - y) * k, r: r * k });
    const header = this.mobile ? 66 : 76;

    // Phones: the forms sit in the band above the text.
    if (this.mobile) return toWorld(W / 2, header + H * 0.2, Math.min(W * 0.44, H * 0.19));

    const section =
      stage === "world"
        ? document.querySelector<HTMLElement>(`section[data-stage='world'][data-world='${world}']`)
        : document.querySelector<HTMLElement>(`main section[data-stage='${stage}']`);

    const gutter = Math.min(64, Math.max(20, W * 0.042));
    const rightEdge = W - gutter * 0.5;
    const top = header + 12;
    const bottom = H - 12;

    // World scenes: centre on the art stage the floating cards use, and grow
    // into all the free space between the copy and the screen edge.
    const art = section?.querySelector<HTMLElement>(".art");
    const pin = section?.querySelector<HTMLElement>(".scene__pin");
    if (art && pin) {
      const a = art.getBoundingClientRect();
      const p = pin.getBoundingClientRect();
      const copyRight = section?.querySelector<HTMLElement>(".scene__copy")?.getBoundingClientRect().right ?? a.left;
      const cx = a.left + a.width / 2;
      const cy = a.top - p.top + a.height / 2;
      const r = Math.min(cx - (copyRight + 40), rightEdge - cx, cy - top, bottom - cy);
      return toWorld(cx, cy, Math.max(r, Math.min(a.width, a.height) / 2) * 0.95);
    }

    // Other chapters: everything to the right of the widest text block.
    let right = 0;
    const inner = section?.querySelector<HTMLElement>(".chapter__inner");
    if (inner) {
      const innerW = inner.getBoundingClientRect().width;
      inner.querySelectorAll<HTMLElement>(":scope > *").forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.width < innerW * 0.8) right = Math.max(right, b.right);
      });
    }
    const left = right ? right + 40 : W * 0.5;
    const freeW = rightEdge - left;
    if (freeW < 320) return toWorld(W * 0.75, (top + bottom) / 2, W * 0.2);
    return toWorld((left + rightEdge) / 2, (top + bottom) / 2, Math.min(freeW / 2, (bottom - top) / 2) * 0.95);
  }

  /** Centre the cube over its Scramble/Solve controls and size it to the space above them. */
  private measureCube(): Pick<Preset, "cbx" | "cby" | "cbs"> {
    if (this.mobile) return { cbx: 0, cby: 13.5, cbs: 3.6 };
    const zone = document.querySelector<HTMLElement>("[data-cube-zone]");
    if (!zone) return { cbx: BASE.cbx, cby: BASE.cby, cbs: BASE.cbs };
    const W = this.width;
    const H = this.height;
    const k = this.pxToWorld();
    const z = zone.getBoundingClientRect();
    const hud = document.querySelector<HTMLElement>(".cube-hud")?.getBoundingClientRect().height ?? 90;
    const top = 76 + 10;
    const bottom = H - H * 0.07 - hud - 20;
    const r = Math.min((z.width / 2) * 0.9, (bottom - top) / 2) * k;
    return { cbx: (z.left + z.width / 2 - W / 2) * k, cby: (H / 2 - (top + bottom) / 2) * k, cbs: Math.min(6, r / 2.5) };
  }

  private applyLook(duration = 1.9) {
    const { stage, world = 0 } = this.stage;
    const accent =
      stage === "world" ? document.querySelector<HTMLElement>(`section[data-stage='world'][data-world='${world}']`)?.dataset.accent : undefined;
    const look = lookFor(stage, this.measureFrame(stage, world), this.mobile, world, this.worldStep, accent);
    Object.assign(look.preset, this.measureCube());
    const d = this.reduced ? 0.01 : duration;

    gsap.to(this.params, { ...look.preset, duration: d, ease: "power3.inOut", overwrite: "auto" });
    this.showShape(look.shape, d);

    if (look.tint) {
      const c = srgb(look.tint);
      gsap.to(this.tint, { r: c.x, g: c.y, b: c.z, amt: look.tintAmt, duration: d, ease: "power2.inOut", overwrite: "auto" });
    } else {
      gsap.to(this.tint, { amt: 0, duration: d, ease: "power2.inOut", overwrite: "auto" });
    }

    if (stage === "about" && !this.scrambledOnce) {
      this.scrambledOnce = true;
      gsap.delayedCall(this.reduced ? 0.2 : 2.6, () => {
        if (this.stage.stage === "about" && this.cube.status.solved && !this.cube.status.busy) this.cube.scramble(18);
      });
    }
  }

  private burst() {
    const u = this.dustMat.uniforms.uBurst;
    gsap.fromTo(u, { value: 0 }, { value: 1, duration: 0.45, ease: "power2.out", yoyo: true, repeat: 1, repeatDelay: 0.05 });
  }

  private project(v: THREE.Vector3) {
    v.project(this.camera);
    return { x: ((v.x + 1) / 2) * this.width, y: ((1 - v.y) / 2) * this.height, z: v.z };
  }

  private frame(dt: number) {
    if (document.hidden) return;
    const raw = Math.min(dt, 0.05);
    const delta = this.paused ? 0 : raw;
    this.time += delta;
    const p = this.params;
    const u = this.dustMat.uniforms;

    // Galaxy: ZXY = spin in the disk plane (y), tilt toward camera (x), bank on screen (z)
    const progress = this.stage.progress || 0;
    this.galaxy.position.set(p.gx, p.gy, p.gz);
    this.galaxy.rotation.set(p.tilt, p.roll + progress * 0.35, p.bank, "ZXY");
    this.galaxy.scale.setScalar(p.scale);

    // Shape slots share the anchor position; each keeps its own spin or sway
    this.tmp.set(p.ax, p.ay, p.az);
    this.altScale.setScalar(p.as);
    for (const slot of this.slots) {
      slot.acc += delta * slot.spin;
      const sway = Math.sin(this.time * 0.25) * slot.sway;
      this.altEuler.set(p.arx, p.ary + slot.acc + sway + progress * 0.4, p.arz, "ZXY");
      this.altQuat.setFromEuler(this.altEuler);
      slot.matrix.compose(this.tmp, this.altQuat, this.altScale);
    }

    // Camera: gentle parallax toward the pointer
    this.cameraDrift.x += (this.pointer.x * 1.6 - this.cameraDrift.x) * 0.03;
    this.cameraDrift.y += (-this.pointer.y * 1.0 - this.cameraDrift.y) * 0.03;
    this.camera.position.x = this.cameraDrift.x;
    this.camera.position.y = this.cameraDrift.y;
    this.camera.lookAt(this.cameraDrift.x * 0.4, this.cameraDrift.y * 0.4, 0);

    // Cube
    this.cube.group.position.set(p.cbx, p.cby, 0);
    this.cube.group.scale.setScalar(p.cbs * (0.6 + 0.4 * p.cube));
    this.cube.update(delta);
    this.cube.group.updateMatrixWorld(true);
    const cubies = u.uCubies.value as THREE.Matrix4[];
    for (let i = 0; i < CUBE_SLOTS; i++) {
      cubies[i].fromArray(this.cube.cubieMatrices, i * 16).premultiply(this.cube.group.matrixWorld);
    }

    // Black hole
    this.hole.visible = p.hole > 0.01;
    this.hole.position.set(p.hx, p.hy, 0);
    this.hole.scale.setScalar(p.hs);
    this.holeRing.quaternion.copy(this.camera.quaternion);
    this.holeDiskFrame.rotation.y = this.time * 0.02;
    this.hole.updateMatrixWorld(true);
    (u.uHoleMatrix.value as THREE.Matrix4).copy(this.holeDiskFrame.matrixWorld);
    const ringMat = this.holeRing.material as THREE.ShaderMaterial;
    ringMat.uniforms.uTime.value = this.time;
    ringMat.uniforms.uOpacity.value = p.hole;
    this.holeClouds.forEach((s, i) => {
      s.material.opacity = p.hole * 0.38;
      s.material.rotation += delta * (i % 2 ? 0.02 : -0.015);
    });

    // Name interaction: dust parts around the pointer and fires on click
    const wantForce = p.name > 0.5 && this.pointer.moved ? 1 : 0;
    this.mouseForce += (wantForce - this.mouseForce) * 0.08;
    (u.uMouse.value as THREE.Vector2).lerp(this.mouseWorld, 0.25);
    u.uMouseForce.value = this.mouseForce * (this.reduced ? 0.4 : 1);
    this.fire.t += raw;
    (u.uFire.value as THREE.Vector3).set(this.fire.x, this.fire.y, this.fire.t);
    this.sparks.update(raw);

    const slotSum = Math.min(1, this.slots[0].weight.value + this.slots[1].weight.value);
    u.uTime.value = this.time;
    u.uIntro.value = this.intro.value;
    u.uCube.value = p.cube;
    u.uHole.value = p.hole;
    u.uText.value = p.name;
    u.uOpacity.value = Math.max(p.galaxy, p.cube, p.hole, p.name, slotSum) * (0.35 + 0.65 * Math.min(1, this.intro.value * 1.5));
    u.uTintAmt.value = this.tint.amt * (1 - p.cube) * (1 - p.hole) * (1 - p.name);
    (u.uTint.value as THREE.Vector3).set(this.tint.r, this.tint.g, this.tint.b);
    this.starMat.uniforms.uTime.value = this.time;
    this.starMat.uniforms.uOpacity.value = p.stars;

    const galaxyPresence = (1 - p.cube) * (1 - p.hole) * (1 - p.name) * (1 - slotSum) * p.galaxy * this.intro.value;
    (this.coreGlow.material as THREE.SpriteMaterial).opacity = galaxyPresence * 0.95;
    this.coreGlow.scale.setScalar(14 + Math.sin(this.time * 0.8) * 0.8);
    (this.orbitLine.material as THREE.LineBasicMaterial).opacity = p.orbitRing * galaxyPresence * 0.32;

    this.updateBodies(galaxyPresence, 1 - p.name);
    this.renderer.render(this.scene, this.camera);
  }

  private updateBodies(galaxyPresence: number, notText: number) {
    const p = this.params;
    const planetAmt = p.planets * galaxyPresence;
    if (this.planets.length) {
      this.galaxy.updateMatrixWorld(true);
      this.planets.forEach((el, i) => {
        if (planetAmt < 0.01) {
          if (el.style.opacity !== "0") el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }
        const a = (i / this.planets.length) * Math.PI * 2 + this.time * 0.045;
        this.tmp.set(Math.cos(a) * 24, 0, Math.sin(a) * 24).applyMatrix4(this.galaxy.matrixWorld);
        const s = this.project(this.tmp);
        const depth = THREE.MathUtils.clamp((this.tmp.z + 20) / 40, 0, 1);
        const scale = 0.72 + depth * 0.45;
        el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(planetAmt * (0.45 + depth * 0.55));
        el.style.zIndex = String(Math.round(depth * 10));
        el.style.pointerEvents = planetAmt > 0.5 ? "auto" : "none";
      });
    }

    const toolAmt = p.tools * notText * this.intro.value;
    if (this.tools.length) {
      this.center.set(p.ax, p.ay, p.az);
      const radii = [8.5, 11.5, 14.5];
      this.tools.forEach((t) => {
        if (toolAmt < 0.01) {
          if (t.el.style.opacity !== "0") t.el.style.opacity = "0";
          return;
        }
        const r = radii[t.ring] * p.as;
        const a = t.angle + this.time * (0.07 / (1 + t.ring * 0.4)) * (t.ring % 2 ? -1 : 1);
        this.tmp.set(Math.cos(a) * r, Math.sin(a) * r * 0.32, Math.sin(a) * r * 0.9).add(this.center);
        const s = this.project(this.tmp);
        const front = Math.sin(a) * 0.5 + 0.5;
        t.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${0.85 + front * 0.2})`;
        t.el.style.opacity = String(toolAmt * (0.45 + front * 0.55));
        t.el.style.zIndex = String(Math.round(front * 10));
      });
    }
  }
}
