import { Fragment, useEffect, useState } from "react";
import { MapStage, ZoneMarks, useVectors } from "../components/MapStage";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { stages } from "../content/site";
import { prefersReducedMotion, useInView } from "../lib/useInView";

const CYCLE = 7000;

export function Technology() {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>({}, false);
  const v = useVectors();
  const stage = stages[active];

  useEffect(() => {
    if (manual || !inView || prefersReducedMotion()) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % stages.length), CYCLE);
    return () => window.clearTimeout(t);
  }, [active, manual, inView]);

  const pick = (i: number) => {
    setManual(true);
    setActive(i);
  };

  return (
    <section id="technology" className="relative border-t border-bone/10 bg-ink-900 py-24 lg:py-32">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-60" />
      <div className="frame relative">
        <SectionHeader
          label="The engine"
          title={
            <>
              Four stages. <span className="text-bone/45">Three gates.</span>
            </>
          }
          lede="A component that fails its gate never reaches a recommendation."
        />

        {/* pipeline rail */}
        <Reveal className="mt-16">
          <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ol className="flex min-w-[860px] items-stretch" aria-label="Pipeline stages">
              <RailEnd label="Input" value="Landsat 8/9 · open data" />
              {stages.map((s, i) => (
                <Fragment key={s.id}>
                  <Connector lit={active >= i} />
                  <li className="flex-1">
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-pressed={active === i}
                      className={`group relative h-full w-full border px-4 py-4 text-left transition-colors duration-500 ${
                        active === i ? "border-laterite/70 bg-laterite/[0.07]" : "border-bone/10 hover:border-bone/30"
                      }`}
                    >
                      <span className="font-mono text-[10.5px] text-bone/40">0{i + 1}</span>
                      <span className={`mt-1 block text-[20px] font-medium tracking-[-0.03em] ${active === i ? "text-bone" : "text-bone/60"}`}>
                        {s.verb}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10.5px] text-bone/40">{s.method}</span>
                      {active === i && !manual && inView && (
                        <span
                          key={active}
                          className="absolute bottom-0 left-0 h-[2px] bg-laterite"
                          style={{ animation: `grow ${CYCLE}ms linear forwards` }}
                        />
                      )}
                    </button>
                  </li>
                  {s.gate && (
                    <>
                      <Connector lit={active > i || (i === 3 && active === 3)} />
                      <li className="flex w-[74px] shrink-0 flex-col items-center justify-center" title={s.gate.name}>
                        <span
                          className={`flex h-9 w-9 rotate-45 items-center justify-center border transition-colors duration-500 ${
                            active > i || (i === 3 && active === 3) ? "border-mint bg-mint/10" : "border-bone/25"
                          }`}
                        >
                          <span className="-rotate-45 font-mono text-[10px] text-bone/80">G{i === 3 ? 3 : i + 1}</span>
                        </span>
                        <span className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-bone/40">Gate</span>
                      </li>
                    </>
                  )}
                </Fragment>
              ))}
              <Connector lit={active === 3} />
              <RailEnd label="Output" value="Ranked sites + reasons" accent />
            </ol>
          </div>
        </Reveal>

        {/* detail */}
        <div ref={ref} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div key={stage.id} className="min-w-0 lg:col-span-6 xl:col-span-5" style={{ animation: "fadeUp .7s cubic-bezier(.2,.7,.1,1) both" }}>
            <p className="eyebrow">
              Stage {active + 1} · {stage.verb}
            </p>
            <h3 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.035em] text-bone">{stage.title}</h3>
            <p className="mt-5 text-[16.5px] leading-relaxed text-bone/65">{stage.plain}</p>

            <dl className="mt-8 grid grid-cols-2 border-l border-t border-bone/10">
              {stage.specs.map((s) => (
                <div key={s.k} className="border-b border-r border-bone/10 p-4">
                  <dt className="tick">{s.k}</dt>
                  <dd className="mt-2 text-[17px] font-medium tracking-[-0.02em] text-bone">{s.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-start gap-3 border border-bone/10 p-4">
              <span className="mt-1 h-2 w-2 shrink-0 bg-laterite" />
              <div>
                <p className="tick">Output</p>
                <p className="mt-1 text-[15px] text-bone/80">{stage.output}</p>
              </div>
            </div>

            {stage.gate && (
              <div className="mt-3 flex items-start gap-3 border border-mint/25 bg-mint/[0.04] p-4">
                <span className="mt-1 h-2 w-2 shrink-0 rotate-45 border border-mint" />
                <div>
                  <p className="tick text-mint/80">{stage.gate.name}</p>
                  <p className="mt-1 text-[15px] text-bone/80">{stage.gate.result}</p>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 lg:col-span-6 xl:col-span-6 xl:col-start-7">
            <MapStage
              alt={`Stage output map: ${stage.output}`}
              layers={[
                { src: "built_2024.png", on: active === 0 },
                { src: "built_2024.png", on: active === 1, opacity: 0.35 },
                { src: "growth_prob_2030.png", on: active === 1, smooth: true },
                { src: "projected_2035.png", on: active === 1 },
                { src: "suitability.png", on: active >= 2, opacity: active === 3 ? 0.55 : 1, smooth: true },
              ]}
              overlay={
                v && (
                  <>
                    <g style={{ opacity: active === 3 ? 1 : 0, transition: "opacity .6s" }}>
                      {v.facilities.map((f, i) => (
                        <path key={i} d={`M${f.x - 4} ${f.y}h8M${f.x} ${f.y - 4}v8`} stroke="#D6F5E8" strokeWidth={1.4} opacity={0.7} />
                      ))}
                      <ZoneMarks v={v} />
                    </g>
                  </>
                )
              }
              label={
                <span className="border border-bone/15 bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/75 backdrop-blur">
                  {["Built-up · 2024", "Growth probability 2030 + projected 2035", "Composite suitability", "Candidate zones + inpatient facilities"][active]}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Connector({ lit }: { lit: boolean }) {
  return (
    <li aria-hidden className="relative flex w-6 shrink-0 items-center">
      <svg className="h-2 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 24 2">
        <line x1="0" y1="1" x2="24" y2="1" stroke={lit ? "#E4602F" : "rgba(230,225,213,.25)"} strokeWidth="1.2" className={lit ? "flow" : ""} />
      </svg>
    </li>
  );
}

function RailEnd({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <li className={`flex w-[150px] shrink-0 flex-col justify-center border border-dashed px-4 py-4 ${accent ? "border-laterite/40" : "border-bone/15"}`}>
      <span className="tick">{label}</span>
      <span className="mt-1.5 text-[13.5px] leading-snug text-bone/80">{value}</span>
    </li>
  );
}
