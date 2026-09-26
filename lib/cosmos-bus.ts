// Tiny typed event bus shared by the DOM chapters and the three.js universe.
// Every event keeps its last payload so late subscribers (e.g. a HUD that
// mounts after the engine) can read the current value immediately.

export type Stage =
  | "hero"
  | "origin"
  | "about"
  | "skills"
  | "work"
  | "world"
  | "workshop"
  | "log"
  | "contact";

export interface StagePayload {
  stage: Stage;
  /** Index into lib/worlds when stage === "world". */
  world?: number;
  /** 0..1 scroll progress through the active section. */
  progress: number;
}

export interface CubeStatus {
  moves: number;
  solved: boolean;
  /** True while a twist animation or scramble/solve sequence is running. */
  busy: boolean;
}

export interface CosmosEvents {
  /** Emitted by the universe's ScrollTriggers when the active chapter changes or progresses. */
  stage: StagePayload;
  /** Emitted by a world scene when its step (0 problem, 1 build, 2 result, 3 live) changes. */
  "world:step": { world: number; step: number };
  "cube:scramble": null;
  "cube:solve": null;
  "cube:reset": null;
  /** Emitted by the engine after every completed twist. */
  "cube:status": CubeStatus;
  /** Header pause button. */
  motion: { paused: boolean };
  /** Intro loader finished (or was skipped). */
  "intro:done": null;
  /** Engine finished its first frame; intro may count up to 100. */
  "engine:ready": null;
  /** Loading progress 0..1 reported by the engine while it builds geometry. */
  "engine:progress": { value: number };
}

type Handler<T> = (payload: T) => void;

class Bus {
  private handlers = new Map<keyof CosmosEvents, Set<Handler<unknown>>>();
  private last = new Map<keyof CosmosEvents, unknown>();

  on<K extends keyof CosmosEvents>(type: K, fn: Handler<CosmosEvents[K]>, replay = true) {
    let set = this.handlers.get(type);
    if (!set) this.handlers.set(type, (set = new Set()));
    set.add(fn as Handler<unknown>);
    if (replay && this.last.has(type)) fn(this.last.get(type) as CosmosEvents[K]);
    return () => {
      set!.delete(fn as Handler<unknown>);
    };
  }

  emit<K extends keyof CosmosEvents>(type: K, payload: CosmosEvents[K]) {
    this.last.set(type, payload);
    this.handlers.get(type)?.forEach((fn) => fn(payload));
  }

  peek<K extends keyof CosmosEvents>(type: K): CosmosEvents[K] | undefined {
    return this.last.get(type) as CosmosEvents[K] | undefined;
  }
}

export const cosmos = new Bus();
