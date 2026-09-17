// Shared clock between the WebGL scene and the DOM readout.
// Phase 0–4 are the five epochs; phase 5 raises the ranked zones.

export const PHASES = 6;
const HOLD = [2600, 1900, 2300, 1900, 1500, 4600];

type Listener = (phase: number) => void;

class Timeline {
  phase = 0;
  auto = true;
  private listeners = new Set<Listener>();
  private timer: number | undefined;
  private resumeTimer: number | undefined;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  }

  set(phase: number, manual = false) {
    this.phase = ((phase % PHASES) + PHASES) % PHASES;
    this.listeners.forEach((fn) => fn(this.phase));
    if (manual) {
      this.stop();
      window.clearTimeout(this.resumeTimer);
      this.resumeTimer = window.setTimeout(() => this.start(), 9000);
    }
  }

  start() {
    if (!this.auto) return;
    this.stop();
    const tick = () => {
      this.timer = window.setTimeout(() => {
        this.set(this.phase + 1);
        tick();
      }, HOLD[this.phase]);
    };
    tick();
  }

  stop() {
    window.clearTimeout(this.timer);
  }
}

export const timeline = new Timeline();
