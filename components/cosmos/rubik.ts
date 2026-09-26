// Stardust Rubik's cube: twist logic, pointer interaction and the particle
// layout the universe shader morphs into. Rendering lives in engine.ts; this
// module only owns transforms (27 cubies + the cube root) and state.

import * as THREE from "three";
import type { CubeStatus } from "@/lib/cosmos-bus";

export type Axis = 0 | 1 | 2;
export interface Move {
  axis: Axis;
  /** -1, 0 or 1 */
  layer: number;
  dir: 1 | -1;
}

/** Distance between neighbouring cubie centres, in cube-local units. */
export const CUBIE_SPACING = 1.04;
/** Matrix slots: 27 cubies + one for the cube root (halo dust rides on it). */
export const CUBE_SLOTS = 28;
export const ROOT_SLOT = 27;

const S = CUBIE_SPACING;
const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];

// +x, -x, +y, -y, +z, -z — sRGB hex, tuned to glow against the void.
export const FACE_COLORS = ["#ff3b4a", "#ff4fd8", "#f4f1ff", "#9b6bff", "#56d7ff", "#6dffb0"];

const KEY_MOVES: Record<string, Move> = {
  r: { axis: 0, layer: 1, dir: -1 },
  l: { axis: 0, layer: -1, dir: 1 },
  u: { axis: 1, layer: 1, dir: -1 },
  d: { axis: 1, layer: -1, dir: 1 },
  f: { axis: 2, layer: 1, dir: -1 },
  b: { axis: 2, layer: -1, dir: 1 },
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const cubieIndex = (x: number, y: number, z: number) => (x + 1) * 9 + (y + 1) * 3 + (z + 1);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// ─── Particle layout ────────────────────────────────────────────────────────

export interface StardustCubeGeometry {
  count: number;
  /** xyz per particle, relative to its slot (cubie centre, or cube centre for halo). */
  local: Float32Array;
  /** Matrix slot per particle: 0..26 cubie (index = (x+1)*9 + (y+1)*3 + (z+1)), 27 cube root. */
  cubie: Float32Array;
  /** sRGB 0..1 per particle. */
  color: Float32Array;
  /** 0 sticker face, 1 cubie edge, 2 halo dust around the cube. */
  kind: Float32Array;
}

/** Distribute `count` particles over the cube: stickers, cubie edges and a halo. Deterministic per seed. */
export function buildStardustCube(count: number, seed = 1): StardustCubeGeometry {
  const rand = mulberry32(seed);
  const local = new Float32Array(count * 3);
  const cubie = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const kind = new Float32Array(count);

  const stickerTotal = Math.floor(count * 0.64);
  const edgeTotal = Math.floor(count * 0.2);

  // 54 outer stickers
  const stickers: { slot: number; axis: number; sign: number }[] = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const c = [x, y, z];
        for (let a = 0; a < 3; a++)
          for (const sign of [1, -1]) if (c[a] === sign) stickers.push({ slot: cubieIndex(x, y, z), axis: a, sign });
      }

  const faceRgb = FACE_COLORS.map(hexToRgb);
  const half = 0.41;
  const radius = 0.11;
  let i = 0;

  for (; i < stickerTotal; i++) {
    const st = stickers[i % stickers.length];
    let u = 0;
    let v = 0;
    if (rand() < 0.32) {
      // Outline for crisp sticker edges
      const t = rand() * 4;
      const side = Math.floor(t);
      const f = (t - side) * 2 - 1;
      const inset = half - rand() * 0.035;
      [u, v] = side === 0 ? [f * half, inset] : side === 1 ? [f * half, -inset] : side === 2 ? [inset, f * half] : [-inset, f * half];
    } else {
      for (;;) {
        u = (rand() * 2 - 1) * half;
        v = (rand() * 2 - 1) * half;
        const cu = Math.max(Math.abs(u) - (half - radius), 0);
        const cv = Math.max(Math.abs(v) - (half - radius), 0);
        if (cu * cu + cv * cv <= radius * radius) break;
      }
    }
    const n = 0.5 + (rand() - 0.5) * 0.03;
    const p = [0, 0, 0];
    const [ua, va] = [(st.axis + 1) % 3, (st.axis + 2) % 3];
    p[st.axis] = n * st.sign;
    p[ua] = u;
    p[va] = v;
    local.set(p, i * 3);
    cubie[i] = st.slot;
    const rgb = faceRgb[st.axis * 2 + (st.sign === 1 ? 0 : 1)];
    const b = 0.82 + rand() * 0.3;
    color.set([rgb[0] * b, rgb[1] * b, rgb[2] * b], i * 3);
    kind[i] = 0;
  }

  // Edges of the 26 visible cubies (dim violet frame)
  const edgeRgb = hexToRgb("#5a5f7a");
  for (let e = 0; i < stickerTotal + edgeTotal; i++, e++) {
    let slot = Math.floor(rand() * 27);
    if (slot === 13) slot = 0;
    const axis = Math.floor(rand() * 3);
    const p = [0, 0, 0];
    p[axis] = (rand() * 2 - 1) * 0.47;
    p[(axis + 1) % 3] = (rand() < 0.5 ? -1 : 1) * 0.47;
    p[(axis + 2) % 3] = (rand() < 0.5 ? -1 : 1) * 0.47;
    local.set(p, i * 3);
    cubie[i] = slot;
    const b = 0.45 + rand() * 0.35;
    color.set([edgeRgb[0] * b, edgeRgb[1] * b, edgeRgb[2] * b], i * 3);
    kind[i] = 1;
    void e;
  }

  // Halo: a loose shell of dust that rides on the cube root
  const haloPalette = ["#ff5a67", "#8b7bff", "#56d7ff", "#ff7ab6", "#ecebf7"].map(hexToRgb);
  for (; i < count; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const r = 2.3 + Math.pow(rand(), 1.8) * 1.9;
    local.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.8, r * Math.sin(phi) * Math.sin(theta)], i * 3);
    cubie[i] = ROOT_SLOT;
    const rgb = haloPalette[Math.floor(rand() * haloPalette.length)];
    const b = 0.35 + rand() * 0.45;
    color.set([rgb[0] * b, rgb[1] * b, rgb[2] * b], i * 3);
    kind[i] = 2;
  }

  return { count, local, cubie, color, kind };
}

// ─── Cube logic ─────────────────────────────────────────────────────────────

interface Sticker {
  normal: THREE.Vector3;
  face: number;
}

type Queued = { move: Move; duration: number; record: boolean };

const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
const tmpM = new THREE.Matrix4();

export class RubikCube {
  /** Cube root. The engine adds it to the scene and sets position/scale; orbit drag rotates it. */
  readonly group = new THREE.Group();
  /** 28 column-major 4x4 matrices relative to `group`: 27 cubies + identity root slot. */
  readonly cubieMatrices = new Float32Array(CUBE_SLOTS * 16);

  private pivot = new THREE.Group();
  private cubies: THREE.Mesh[] = [];
  private stickers: Sticker[][] = [];
  private queueList: Queued[] = [];
  private active: (Queued & { t: number; members: THREE.Mesh[] }) | null = null;
  private history: Move[] = [];
  private moves = 0;
  private solved = true;
  private listeners = new Set<(s: CubeStatus) => void>();

  private spin = { x: 0, y: 0 };
  private idle = 0;
  private dragging = false;

  constructor() {
    this.group.name = "rubik";
    this.group.add(this.pivot);
    const geo = new THREE.BoxGeometry(S, S, S);
    const mat = new THREE.MeshBasicMaterial();
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          const mesh = new THREE.Mesh(geo, mat);
          mesh.visible = false;
          mesh.position.set(x * S, y * S, z * S);
          mesh.userData.slot = cubieIndex(x, y, z);
          this.group.add(mesh);
          this.cubies[mesh.userData.slot] = mesh;
          const own: Sticker[] = [];
          const c = [x, y, z];
          for (let a = 0; a < 3; a++)
            for (const sign of [1, -1])
              if (c[a] === sign) own.push({ normal: AXES[a].clone().multiplyScalar(sign), face: a * 2 + (sign === 1 ? 0 : 1) });
          this.stickers[mesh.userData.slot] = own;
        }
    this.group.rotation.set(0.5, -0.65, 0);
    this.writeMatrices();
  }

  get status(): CubeStatus {
    return { moves: this.moves, solved: this.solved, busy: !!this.active || this.queueList.length > 0 };
  }

  onStatus(fn: (s: CubeStatus) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    const s = this.status;
    this.listeners.forEach((fn) => fn(s));
  }

  queue(move: Move, duration = 0.28, record = true) {
    this.queueList.push({ move, duration, record });
    if (record) this.history.push(move);
    if (!this.active) this.notify();
  }

  scramble(count = 22) {
    let last = -1;
    for (let i = 0; i < count; i++) {
      let axis: Axis;
      do axis = Math.floor(Math.random() * 3) as Axis;
      while (axis === last);
      last = axis;
      this.queue({ axis, layer: Math.random() < 0.5 ? -1 : 1, dir: Math.random() < 0.5 ? 1 : -1 }, 0.12);
    }
  }

  solve() {
    const pending = this.queueList.filter((q) => q.record).map((q) => q.move);
    this.queueList = this.queueList.filter((q) => !q.record);
    const all = [...this.history];
    // Moves still pending were never applied: drop them from what needs undoing.
    all.splice(all.length - pending.length, pending.length);
    this.history = [];
    for (let i = all.length - 1; i >= 0; i--) {
      const m = all[i];
      this.queue({ ...m, dir: (m.dir * -1) as 1 | -1 }, 0.1, false);
    }
    this.notify();
  }

  reset() {
    this.queueList = [];
    if (this.active) this.finish();
    this.cubies.forEach((c) => {
      const s = c.userData.slot as number;
      const x = Math.floor(s / 9) - 1;
      const y = (Math.floor(s / 3) % 3) - 1;
      const z = (s % 3) - 1;
      c.position.set(x * S, y * S, z * S);
      c.quaternion.identity();
    });
    this.history = [];
    this.moves = 0;
    this.solved = true;
    this.writeMatrices();
    this.notify();
  }

  update(dt: number) {
    if (!this.active && this.queueList.length) {
      const next = this.queueList.shift()!;
      const { axis, layer } = next.move;
      const members = this.cubies.filter((c) => Math.round(c.position.getComponent(axis) / S) === layer);
      this.pivot.quaternion.identity();
      members.forEach((c) => this.pivot.add(c));
      this.active = { ...next, t: 0, members };
    }

    const a = this.active;
    if (a) {
      a.t = Math.min(1, a.t + dt / a.duration);
      tmpQ.setFromAxisAngle(AXES[a.move.axis], ((a.move.dir * Math.PI) / 2) * easeInOut(a.t));
      this.pivot.quaternion.copy(tmpQ);
      if (a.t >= 1) this.finish();
    }

    // Orbit inertia + idle drift
    if (!this.dragging) {
      this.idle += dt;
      this.spin.x *= 0.93;
      this.spin.y *= 0.93;
      const drift = this.idle > 2.5 ? 0.12 * dt : 0;
      this.rotateWorld(this.spin.y + drift, this.spin.x);
    }

    this.writeMatrices();
  }

  private finish() {
    const a = this.active!;
    a.members.forEach((c) => {
      c.position.applyQuaternion(this.pivot.quaternion);
      c.quaternion.premultiply(this.pivot.quaternion);
      this.group.add(c);
      c.position.set(
        Math.round(c.position.x / S) * S,
        Math.round(c.position.y / S) * S,
        Math.round(c.position.z / S) * S,
      );
      tmpM.makeRotationFromQuaternion(c.quaternion);
      const e = tmpM.elements;
      for (const k of [0, 1, 2, 4, 5, 6, 8, 9, 10]) e[k] = Math.round(e[k]);
      c.quaternion.setFromRotationMatrix(tmpM);
    });
    this.pivot.quaternion.identity();
    this.active = null;
    this.moves += 1;
    this.solved = this.checkSolved();
    if (this.solved && this.queueList.length === 0) this.history = [];
    this.notify();
  }

  /** Solved when every visible face shows a single colour (tolerates slice moves). */
  private checkSolved() {
    const faceColor = new Map<string, number>();
    for (const c of this.cubies) {
      for (const st of this.stickers[c.userData.slot]) {
        tmpV.copy(st.normal).applyQuaternion(c.quaternion);
        const key = `${Math.round(tmpV.x)},${Math.round(tmpV.y)},${Math.round(tmpV.z)}`;
        const seen = faceColor.get(key);
        if (seen === undefined) faceColor.set(key, st.face);
        else if (seen !== st.face) return false;
      }
    }
    return true;
  }

  private writeMatrices() {
    this.pivot.updateMatrix();
    for (const c of this.cubies) {
      c.updateMatrix();
      const m = c.parent === this.pivot ? tmpM.multiplyMatrices(this.pivot.matrix, c.matrix) : c.matrix;
      m.toArray(this.cubieMatrices, (c.userData.slot as number) * 16);
    }
    tmpM.identity().toArray(this.cubieMatrices, ROOT_SLOT * 16);
  }

  /** Rotate the whole cube around world-space axes (camera-aligned orbit). */
  private rotateWorld(yaw: number, pitch: number) {
    if (yaw) this.group.quaternion.premultiply(tmpQ.setFromAxisAngle(AXES[1], yaw));
    if (pitch) this.group.quaternion.premultiply(tmpQ.setFromAxisAngle(AXES[0], pitch));
  }

  /**
   * Pointer interaction on `el` (the .cube-zone): drag a face to twist its layer,
   * drag empty space to orbit the cube. `surface` is the canvas used for NDC maths.
   */
  attach(el: HTMLElement, camera: THREE.Camera, surface?: HTMLElement): () => void {
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = false;
    let drag:
      | { mode: "face"; x: number; y: number; normal: THREE.Vector3; point: THREE.Vector3; cubie: THREE.Mesh }
      | { mode: "orbit"; x: number; y: number }
      | null = null;

    const rect = () => (surface ?? el.ownerDocument.documentElement).getBoundingClientRect();

    const toScreen = (world: THREE.Vector3, r: DOMRect) => {
      tmpV2.copy(world).project(camera);
      return new THREE.Vector2(((tmpV2.x + 1) / 2) * r.width, ((1 - tmpV2.y) / 2) * r.height);
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const r = rect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this.group.updateMatrixWorld(true);
      raycaster.setFromCamera(ndc, camera);
      const hit = this.active ? undefined : raycaster.intersectObjects(this.cubies, false)[0];
      this.dragging = true;
      this.idle = 0;
      el.setPointerCapture(e.pointerId);
      if (hit?.face) {
        // Face normal in cube-root space, snapped to the nearest axis.
        const worldNormal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
        const local = worldNormal.applyQuaternion(tmpQ.copy(this.group.quaternion).invert());
        const abs = [Math.abs(local.x), Math.abs(local.y), Math.abs(local.z)];
        const k = abs.indexOf(Math.max(...abs));
        const normal = AXES[k].clone().multiplyScalar(Math.sign(local.getComponent(k)));
        drag = { mode: "face", x: e.clientX, y: e.clientY, normal, point: hit.point.clone(), cubie: hit.object as THREE.Mesh };
      } else {
        drag = { mode: "orbit", x: e.clientX, y: e.clientY };
      }
    };

    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;

      if (drag.mode === "orbit") {
        this.spin.y = dx * 0.006;
        this.spin.x = dy * 0.006;
        this.rotateWorld(this.spin.y, this.spin.x);
        drag.x = e.clientX;
        drag.y = e.clientY;
        return;
      }

      if (Math.hypot(dx, dy) < 12) return;
      const r = rect();
      const screenDrag = new THREE.Vector2(dx, dy).normalize();
      const origin = toScreen(drag.point, r);
      const worldQ = this.group.getWorldQuaternion(new THREE.Quaternion());
      const scale = this.group.getWorldScale(new THREE.Vector3()).x;

      let best: { t: THREE.Vector3; score: number } | null = null;
      for (const axis of AXES) {
        if (Math.abs(axis.dot(drag.normal)) > 0.5) continue;
        const tip = axis.clone().applyQuaternion(worldQ).multiplyScalar(scale).add(drag.point);
        const s = toScreen(tip, r).sub(origin).normalize();
        const score = s.dot(screenDrag);
        if (!best || Math.abs(score) > Math.abs(best.score)) best = { t: axis, score };
      }
      if (!best) return;

      const t = best.t.clone().multiplyScalar(Math.sign(best.score));
      const rot = new THREE.Vector3().crossVectors(drag.normal, t);
      const comps = [Math.abs(rot.x), Math.abs(rot.y), Math.abs(rot.z)];
      const axis = comps.indexOf(Math.max(...comps)) as Axis;
      const dir = Math.sign(rot.getComponent(axis)) as 1 | -1;
      const layer = Math.round(drag.cubie.position.getComponent(axis) / S);
      this.queue({ axis, layer, dir });
      drag = null;
    };

    const up = (e: PointerEvent) => {
      drag = null;
      this.dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    const key = (e: KeyboardEvent) => {
      if (!hovered && document.activeElement !== el) return;
      if ((e.target as HTMLElement).closest("input, textarea, select")) return;
      const m = KEY_MOVES[e.key.toLowerCase()];
      if (!m) return;
      e.preventDefault();
      this.queue(e.shiftKey ? { ...m, dir: (m.dir * -1) as 1 | -1 } : m);
    };

    const enter = () => (hovered = true);
    const leave = () => (hovered = false);

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("keydown", key);

    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("keydown", key);
    };
  }

  dispose() {
    this.listeners.clear();
    const geo = this.cubies[0]?.geometry;
    const mat = this.cubies[0]?.material as THREE.Material | undefined;
    geo?.dispose();
    mat?.dispose();
  }
}
