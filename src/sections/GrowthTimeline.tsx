import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { epochs } from "../content/site";
import { useCanRender3D } from "../hero/Hero";
import type { Shared } from "../hero/HeroScene";
import { ZONES } from "../hero/field";
import { PHASES, timeline } from "../hero/timeline";
import { prefersReducedMotion } from "../lib/useInView";

const HeroScene = lazy(() => import("../hero/HeroScene"));

const PHASE_LABEL = ["Observed", "Observed", "Observed", "Projected · central", "Projected · central", "Ranked zones"];

/**
 * The platform's growth timeline: the 3D city steps through observed and
 * projected years, then raises the ranked zones, with a readout in sync.
 */
export function GrowthTimeline() {
  const can3D = useCanRender3D();
  const reduced = useMemo(prefersReducedMotion, []);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(reduced ? 5 : timeline.phase);
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
    } else {
      timeline.set(0);
    }
    return () => {
      unsub();
      timeline.stop();
    };
  }, [reduced]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting);
        if (e.isIntersecting && ready && !reduced) timeline.start();
        else timeline.stop();
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      shared.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      shared.pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      shared.pointer.touched = true;
    };
    const onLeave = () => {
      shared.pointer.x = 0;
      shared.pointer.y = 0;
      shared.pointer.touched = false;
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [shared, ready, reduced]);

  const epochIndex = Math.min(phase, 4);
  const current = epochs[epochIndex];

  return (
    <section ref={section} id="growth-timeline" className="relative isolate overflow-hidden border-t border-bone/10 bg-ink">
      {/* scene */}
      <div className="absolute inset-x-0 top-[230px] -z-10 h-[420px] lg:inset-0 lg:h-auto">
        {!can3D && (
          <div className="absolute inset-0 flex items-center justify-center opacity-70 lg:justify-end lg:pr-[8%]" aria-hidden>
            <div className="w-[min(90vw,620px)] [perspective:1400px]">
              <div className="relative aspect-[730/744] [transform:rotateX(56deg)_rotateZ(-22deg)]">
                <img src="/maps/base.png" alt="" className="map-img absolute inset-0 h-full w-full opacity-60" />
                <img src="/maps/built_2024.png" alt="" className="map-img absolute inset-0 h-full w-full" />
                <img src="/maps/projected_2035.png" alt="" className="map-img absolute inset-0 h-full w-full" />
              </div>
            </div>
          </div>
        )}
        {can3D && (
          <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
            <Suspense fallback={null}>
              <HeroScene shared={shared} onReady={() => setReady(true)} labelRefs={labelRefs} active={active} />
            </Suspense>
            <div className="pointer-events-none absolute inset-0">
              {ZONES.map((z, i) => (
                <div key={z.rank} ref={(el) => (labelRefs.current[i] = el)} className="absolute left-0 top-0 opacity-0 will-change-transform">
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
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.94)_0%,rgba(7,8,10,0.6)_36%,rgba(7,8,10,0)_60%)] max-lg:bg-[linear-gradient(180deg,#07080A_0%,rgba(7,8,10,0)_18%,rgba(7,8,10,0)_75%,#07080A_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="frame relative flex min-h-[760px] flex-col justify-between gap-10 py-20 lg:min-h-[820px] lg:py-28">
        <div className="max-w-xl">
          <SectionHeader
            align="stack"
            label="Growth Forecasting module"
            title={
              <>
                Watch a city grow, <span className="font-serif font-normal italic">before it does.</span>
              </>
            }
            lede="Observed years from satellite imagery, then the platform's forecast, then the ranked sites. Case study: Vellore, Tamil Nadu."
          />
        </div>

        {/* room for the scene on small screens */}
        <div className="h-[300px] lg:hidden" aria-hidden />

        {/* readout, in sync with the scene */}
        <div className="lg:self-end">
          <div className="panel marks w-full max-w-[420px] bg-ink/70 p-4 backdrop-blur-md sm:p-5 lg:w-[400px]">
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
                <button key={e.year} type="button" onClick={() => timeline.set(i, true)} className="group text-left" aria-pressed={epochIndex === i && phase !== 5}>
                  <span
                    className={`block h-[3px] transition-colors duration-500 ${
                      i <= epochIndex ? (e.kind === "projected" ? "bg-laterite" : "bg-bone/80") : "bg-bone/15"
                    }`}
                  />
                  <span className={`mt-2 block font-mono text-[10.5px] tabular-nums transition-colors ${epochIndex === i ? "text-bone" : "text-bone/40 group-hover:text-bone/70"}`}>
                    {e.year}
                    {e.kind === "projected" && <span className="text-laterite">p</span>}
                  </span>
                </button>
              ))}
              <button type="button" onClick={() => timeline.set(PHASES - 1, true)} className="group text-left" aria-pressed={phase === 5}>
                <span className={`block h-[3px] transition-colors duration-500 ${phase === 5 ? "bg-laterite" : "bg-bone/15"}`} />
                <span className={`mt-2 block font-mono text-[10.5px] ${phase === 5 ? "text-bone" : "text-bone/40 group-hover:text-bone/70"}`}>Zones</span>
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
