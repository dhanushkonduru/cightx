import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import type { Shared } from "./HeroScene";
import { Arrow } from "../components/Arrow";
import { Link } from "react-router-dom";
import { company, epochs } from "../content/site";
import { prefersReducedMotion } from "../lib/useInView";
import { ZONES } from "./field";
import { PHASES, timeline } from "./timeline";

const HeroScene = lazy(() => import("./HeroScene"));

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function useCanRender3D() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData) return false;
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
    return webglAvailable();
  }, []);
}

const PHASE_LABEL = ["Observed", "Observed", "Observed", "Projected · central", "Projected · central", "Ranked zones"];

export function Hero() {
  const can3D = useCanRender3D();
  const reduced = useMemo(prefersReducedMotion, []);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState(reduced ? 5 : 0);
  const [active, setActive] = useState(true);
  const section = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const shared = useMemo<Shared>(
    () => ({ pointer: { x: 0, y: 0, touched: false }, pointerWorld: { x: 999, y: 0, z: 999 }, scroll: 0, reduced }),
    [reduced],
  );

  useEffect(() => {
    const unsub = timeline.subscribe(setPhase);
    if (reduced) {
      timeline.auto = false;
      timeline.set(5);
    }
    return unsub;
  }, [reduced]);

  useEffect(() => {
    if (ready && !reduced) timeline.start();
    return () => timeline.stop();
  }, [ready, reduced]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting);
      if (e.isIntersecting && ready && !reduced) timeline.start();
      else timeline.stop();
    });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      shared.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      shared.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      shared.pointer.touched = true;
    };
    const onLeave = () => {
      shared.pointer.x = 0;
      shared.pointer.y = 0;
      shared.pointer.touched = false;
    };
    const onScroll = () => {
      shared.scroll = Math.min(Math.max(window.scrollY / (el.offsetHeight || 1), 0), 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [shared, ready, reduced]);

  const epochIndex = Math.min(phase, 4);
  const current = epochs[epochIndex];

  return (
    <section
      id="top"
      ref={section}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-label="CightX — where to build next"
    >
      {/* scene */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[64svh] lg:inset-0 lg:h-auto">
        <StaticFallback visible={!can3D || !ready} />
        {can3D && (
          <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
            <Suspense fallback={null}>
              <HeroScene shared={shared} onReady={() => setReady(true)} labelRefs={labelRefs} active={active} />
            </Suspense>
            <div className="pointer-events-none absolute inset-0">
              {ZONES.map((z, i) => (
                <div
                  key={z.rank}
                  ref={(el) => (labelRefs.current[i] = el)}
                  className="absolute left-0 top-0 opacity-0 will-change-transform"
                >
                  <div className={`-translate-y-full pb-2 ${z.rank === 1 ? "-translate-x-full pr-1" : z.rank === 4 ? "pl-1" : "-translate-x-1/2"}`}>
                    <span className="block whitespace-nowrap border border-laterite/60 bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-laterite-soft backdrop-blur">
                      ZONE {String(z.rank).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* legibility scrims */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.92)_0%,rgba(7,8,10,0.55)_38%,rgba(7,8,10,0)_62%)] max-lg:bg-[linear-gradient(180deg,rgba(7,8,10,0)_45%,rgba(7,8,10,0.75)_78%,#07080A_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />
      </div>

      {/* top-right coordinates readout */}
      <div className={`frame pointer-events-none mt-[92px] hidden justify-end transition-opacity duration-700 lg:flex ${phase === 5 ? "opacity-0" : "opacity-100"}`}>
        <dl className="tick grid grid-cols-[auto_auto] gap-x-5 gap-y-1.5 text-right">
          <dt className="text-bone/35">Study window</dt>
          <dd className="text-bone/70">Vellore, Tamil Nadu</dd>
          <dt className="text-bone/35">Extent</dt>
          <dd className="text-bone/70">79.02–79.22°E · 12.82–13.02°N</dd>
          <dt className="text-bone/35">Resolution</dt>
          <dd className="text-bone/70">30 m cells · shown at 120 m</dd>
        </dl>
      </div>

      <div className="frame relative mt-auto grid gap-10 pb-10 pt-[44svh] lg:grid-cols-12 lg:items-end lg:pb-14 lg:pt-10">
        <div className="lg:col-span-7">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-bone/15 bg-ink/40 py-1.5 pl-2 pr-3.5 backdrop-blur">
            <span className="h-1.5 w-1.5 bg-laterite" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-bone/75">
              <span className="sm:hidden">Built-environment intelligence</span>
              <span className="hidden sm:inline">{company.descriptor}</span>
            </span>
          </div>
          <h1 className="display text-[clamp(2.35rem,5.4vw,5.2rem)]">
            Where to build next,
            <br />
            <span className="text-bone/45">before the city</span>
            <br />
            <span className="font-serif font-normal italic tracking-[-0.02em] text-bone">gets there.</span>
          </h1>
          <p className="lede mt-7 max-w-[34rem]">
            We forecast how cities grow from satellite data and tell you where new infrastructure should go —
            tested against history first.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-primary">
              <span className="btn-dot" />
              Talk to us
            </Link>
            <Link to="/products/infrastructure-intelligence" className="btn btn-ghost">
              See it on Vellore
              <Arrow />
            </Link>
          </div>
        </div>

        {/* epoch readout */}
        <div className="lg:col-span-5 lg:justify-self-end">
          <div className="panel marks w-full max-w-[420px] bg-ink/60 p-4 backdrop-blur-md sm:p-5 lg:w-[400px]">
            <div className="flex items-baseline justify-between">
              <span className="tick">Built-up land · Vellore</span>
              <span className={`tick ${phase >= 3 ? "text-laterite" : "text-mint"}`}>{PHASE_LABEL[phase]}</span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div className="font-sans text-[44px] font-medium leading-none tracking-[-0.04em] tabular-nums text-bone sm:text-[52px]">
                {current.km2.toFixed(2)}
                <span className="ml-1.5 text-[16px] tracking-normal text-bone/45">km²</span>
              </div>
              <div className="pb-1 text-right font-mono text-[10.5px] leading-relaxed text-bone/45">
                {phase === 5 ? "5 candidate zones" : current.source}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-6 gap-1" role="group" aria-label="Timeline">
              {epochs.map((e, i) => (
                <button
                  key={e.year}
                  type="button"
                  onClick={() => timeline.set(i, true)}
                  className="group text-left"
                  aria-pressed={epochIndex === i && phase !== 5}
                >
                  <span
                    className={`block h-[3px] transition-colors duration-500 ${
                      i <= epochIndex ? (e.kind === "projected" ? "bg-laterite" : "bg-bone/80") : "bg-bone/15"
                    }`}
                  />
                  <span
                    className={`mt-2 block font-mono text-[10.5px] tabular-nums transition-colors ${
                      epochIndex === i ? "text-bone" : "text-bone/40 group-hover:text-bone/70"
                    }`}
                  >
                    {e.year}
                    {e.kind === "projected" && <span className="text-laterite">p</span>}
                  </span>
                </button>
              ))}
              <button type="button" onClick={() => timeline.set(PHASES - 1, true)} className="group text-left" aria-pressed={phase === 5}>
                <span className={`block h-[3px] transition-colors duration-500 ${phase === 5 ? "bg-laterite" : "bg-bone/15"}`} />
                <span className={`mt-2 block font-mono text-[10.5px] ${phase === 5 ? "text-bone" : "text-bone/40 group-hover:text-bone/70"}`}>
                  Zones
                </span>
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-bone/10 pt-3 font-mono text-[10px] text-bone/50">
              <Key c="bg-[#DBD6C9]" t="Built by 2013" />
              <Key c="bg-mint" t="Built 2013–24" />
              <Key c="bg-laterite" t="Projected" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Key({ c, t }: { c: string; t: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 ${c}`} />
      {t}
    </span>
  );
}

/** Shown while WebGL loads, and instead of it on devices that cannot run it. */
function StaticFallback({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    >
      <div className="absolute left-1/2 top-[32%] w-[min(130vw,900px)] -translate-x-1/2 -translate-y-1/2 [perspective:1400px] lg:left-[64%] lg:top-1/2 lg:w-[min(62vw,980px)]">
        <div className="relative aspect-[730/744] [transform:rotateX(56deg)_rotateZ(-22deg)]">
          <img src="/maps/base.png" alt="" className="map-img absolute inset-0 h-full w-full opacity-60" />
          <img src="/maps/built_2024.png" alt="" className="map-img absolute inset-0 h-full w-full" />
          <img src="/maps/projected_2035.png" alt="" className="map-img absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 [mask-image:radial-gradient(circle,transparent_40%,#000_72%)] bg-ink" />
        </div>
      </div>
    </div>
  );
}
