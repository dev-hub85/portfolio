// "Firing" dust: a pool of sparks that burst from a click and fall away.

import * as THREE from "three";

const POOL = 1400;
const PALETTE = ["#ffd6d9", "#ff5a67", "#e0203d", "#ff7ab6", "#8b7bff", "#56d7ff", "#ffffff"].map((h) => new THREE.Color(h));

const vertex = /* glsl */ `
  uniform float uPixelRatio;
  attribute vec3 aColor;
  attribute float aLife;
  attribute float aSize;
  varying vec3 vColor;
  varying float vLife;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (0.35 + aLife) * uPixelRatio * (120.0 / -mv.z);
    vColor = aColor;
    vLife = aLife;
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * vLife;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor * (1.0 + vLife), a);
  }
`;

export class Sparks {
  readonly points: THREE.Points;
  private material: THREE.ShaderMaterial;
  private pos = new Float32Array(POOL * 3);
  private vel = new Float32Array(POOL * 3);
  private life = new Float32Array(POOL);
  private maxLife = new Float32Array(POOL);
  private cursor = 0;
  private alive = 0;

  constructor() {
    const geo = new THREE.BufferGeometry();
    const color = new Float32Array(POOL * 3);
    const size = new Float32Array(POOL);
    for (let i = 0; i < POOL; i++) {
      const c = PALETTE[i % PALETTE.length];
      color.set([c.r, c.g, c.b], i * 3);
      size[i] = 1.2 + ((i * 37) % 17) / 6;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    geo.setAttribute("aLife", new THREE.BufferAttribute(this.life, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 500);
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uPixelRatio: { value: 1 } },
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
  }

  setPixelRatio(v: number) {
    this.material.uniforms.uPixelRatio.value = v;
  }

  /** Burst `n` sparks from `origin`, fanning out and lifting toward the camera. */
  fire(origin: THREE.Vector3, n = 520) {
    for (let k = 0; k < n; k++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % POOL;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 6 + Math.pow(Math.random(), 0.6) * 26;
      this.pos.set([origin.x, origin.y, origin.z], i * 3);
      this.vel.set(
        [
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed + 6,
          Math.abs(Math.cos(phi)) * speed * 0.8,
        ],
        i * 3,
      );
      this.maxLife[i] = 1 + Math.random() * 1.4;
      this.life[i] = 1;
    }
    this.alive = Math.min(POOL, this.alive + n);
  }

  update(dt: number) {
    if (this.alive === 0) return;
    let any = 0;
    const drag = Math.pow(0.28, dt);
    for (let i = 0; i < POOL; i++) {
      if (this.life[i] <= 0) continue;
      any++;
      const j = i * 3;
      this.vel[j] *= drag;
      this.vel[j + 1] = this.vel[j + 1] * drag - 16 * dt;
      this.vel[j + 2] *= drag;
      this.pos[j] += this.vel[j] * dt;
      this.pos[j + 1] += this.vel[j + 1] * dt;
      this.pos[j + 2] += this.vel[j + 2] * dt;
      this.life[i] = Math.max(0, this.life[i] - dt / this.maxLife[i]);
    }
    this.alive = any;
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aLife.needsUpdate = true;
  }

  dispose() {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
