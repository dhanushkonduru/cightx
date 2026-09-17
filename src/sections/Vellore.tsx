import { useState } from "react";
import { Counter } from "../components/Counter";
import { MapStage, ZoneMarks, useVectors } from "../components/MapStage";
import { Reveal } from "../components/Reveal";
import { epochs, impact, vellore, zonesTable } from "../content/site";
import { useInView } from "../lib/useInView";

type LayerKey = "2013" | "2019" | "2024" | "2030" | "2035" | "growth" | "travel" | "zones";

const LAYERS: { key: LayerKey; label: string; group: "Observed" | "Projected" | "Analysis" }[] = [
  { key: "2013", label: "2013", group: "Observed" },
  { key: "2019", label: "2019", group: "Observed" },
  { key: "2024", label: "2024", group: "Observed" },
  { key: "2030", label: "2030", group: "Projected" },
  { key: "2035", label: "2035", group: "Projected" },
  { key: "growth", label: "Growth probability", group: "Analysis" },
  { key: "travel", label: "Drive time", group: "Analysis" },
  { key: "zones", label: "Zones", group: "Analysis" },
];

const READOUT: Record<LayerKey, { title: string; body: string; legend: React.ReactNode }> = {
  "2013": { title: "Built-up land, 2013", body: "Landsat 8, 31 October 2013. Classified by the pooled Random Forest on independent labels.", legend: <Swatch c="bg-bone" t="Built-up" /> },
  "2019": { title: "Built-up land, 2019", body: "Landsat 8, 17 November 2019. Same model, same threshold — so change is development, not drift.", legend: <Swatch c="bg-bone" t="Built-up" /> },
  "2024": { title: "Built-up land, 2024", body: "Landsat 9 priority composite, Nov–Dec 2024. 0.84% of the window unobserved, against 44% for the single scene it replaced.", legend: <Swatch c="bg-bone" t="Built-up" /> },
  "2030": { title: "Projected growth to 2030", body: "Cellular automaton driven by the learned transition surface, spending the growth rate measured over 2013–2024. Low / central / high: 44.30 / 44.57 / 44.86 km².", legend: <><Swatch c="bg-bone" t="Built 2024" /><Swatch c="bg-laterite" t="Projected" /></> },
  "2035": { title: "Projected growth to 2035", body: "Central scenario 47.47 km², range 46.96–47.98 km². The model decides where; the measured record decides how much.", legend: <><Swatch c="bg-bone" t="Built 2024" /><Swatch c="bg-laterite" t="Projected" /></> },
  "growth": { title: "Transition probability, 2030", body: "Calibrated by isotonic regression, so a value of 0.8 means land like this converts about 80% of the time. Already-built land is zeroed out.", legend: <Ramp from="rgba(143,53,23,.5)" to="#FFC48C" lo="Low" hi="High" /> },
  "travel": { title: "Drive time to the nearest inpatient facility", body: `Dijkstra over ${"21,978"} road junctions from all 80 inpatient-capable facilities at once. Median ${vellore.medianTravelMin} min, 90th percentile ${vellore.p90TravelMin} min.`, legend: <Ramp from="#D6F5E8" to="#E4602F" lo="0 min" hi="45+ min" /> },
  "zones": { title: "Composite suitability and ranked zones", body: "Cells above the 85th percentile grouped into contiguous zones, ranked on suitability, distance from existing provision, road access and area.", legend: <><Ramp from="#0C161A" to="#D6F5E8" lo="Low" hi="High suitability" /><Swatch c="bg-laterite" t="Candidate zone" /></> },
};

export function VelloreExplorer() {
  const [layer, setLayer] = useState<LayerKey>("2024");
  const [roads, setRoads] = useState(true);
  const [facilities, setFacilities] = useState(false);
  const [zone, setZone] = useState<number | null>(null);
  const v = useVectors();
  const r = READOUT[layer];
  const epoch = epochs.find((e) => String(e.year) === layer);
  const showZones = layer === "zones";

  return (
    <>
        {/* explorer */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <div className="-mx-[var(--gutter)] mb-4 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              <div role="tablist" aria-label="Map layers" className="flex w-max gap-1.5">
                {LAYERS.map((l, i) => {
                  const newGroup = i === 0 || LAYERS[i - 1].group !== l.group;
                  return (
                    <div key={l.key} className="flex items-center gap-1.5">
                      {newGroup && i > 0 && <span className="mx-1.5 h-4 w-px bg-bone/15" />}
                      <button
                        role="tab"
                        aria-selected={layer === l.key}
                        onClick={() => setLayer(l.key)}
                        className={`whitespace-nowrap border px-3 py-2 font-mono text-[11px] transition-colors ${
                          layer === l.key
                            ? l.group === "Projected"
                              ? "border-laterite bg-laterite/10 text-bone"
                              : "border-bone/60 bg-bone/[0.06] text-bone"
                            : "border-bone/10 text-bone/50 hover:border-bone/30 hover:text-bone/80"
                        }`}
                      >
                        {l.label}
                        {l.group === "Projected" && <span className="text-laterite">p</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <MapStage
              alt={`Vellore map: ${r.title}`}
              layers={[
                { src: "built_2013.png", on: layer === "2013" },
                { src: "built_2019.png", on: layer === "2019" },
                { src: "built_2024.png", on: ["2024", "2030", "2035"].includes(layer) || layer === "growth", opacity: layer === "growth" ? 0.25 : 1 },
                { src: "projected_2030.png", on: layer === "2030" },
                { src: "projected_2035.png", on: layer === "2035" },
                { src: "growth_prob_2030.png", on: layer === "growth", smooth: true },
                { src: "travel_time.png", on: layer === "travel", smooth: true, opacity: 0.9 },
                { src: "suitability.png", on: showZones, smooth: true, opacity: 0.8 },
              ]}
              overlay={
                v && (
                  <>
                    <path d={v.roads} fill="none" stroke="#E6E1D5" strokeWidth={0.9} opacity={roads ? 0.28 : 0} style={{ transition: "opacity .5s" }} />
                    <g opacity={facilities || layer === "travel" ? 1 : 0} style={{ transition: "opacity .5s" }}>
                      {v.facilities.map((f, i) => (
                        <path key={i} d={`M${f.x - 4.5} ${f.y}h9M${f.x} ${f.y - 4.5}v9`} stroke="#fff" strokeWidth={1.6} />
                      ))}
                    </g>
                    <g opacity={showZones ? 1 : 0} style={{ transition: "opacity .5s" }}>
                      <ZoneMarks v={v} active={zone} />
                    </g>
                  </>
                )
              }
              label={
                epoch ? (
                  <div className="border border-bone/15 bg-ink/80 px-3 py-2 backdrop-blur">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone/50">{epoch.kind} built-up</div>
                    <div className="text-[22px] font-medium tracking-[-0.03em] tabular-nums text-bone">
                      {epoch.km2.toFixed(2)} <span className="text-[12px] text-bone/50">km²</span>
                    </div>
                  </div>
                ) : undefined
              }
            />
            <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10.5px] text-bone/55">
              <Toggle on={roads} set={setRoads} t="Major roads" />
              <Toggle on={facilities || layer === "travel"} set={setFacilities} t="Inpatient facilities" disabled={layer === "travel"} />
              <span className="text-bone/35">OSM · WorldPop · Landsat · UTM 44N</span>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div key={layer} className="panel marks p-6 sm:p-7" style={{ animation: "fadeUp .6s cubic-bezier(.2,.7,.1,1) both" }}>
              <p className="tick">Layer</p>
              <h3 className="mt-2 text-[24px] font-medium leading-tight tracking-[-0.03em] text-bone">{r.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-bone/65">{r.body}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-bone/10 pt-5 font-mono text-[10.5px] text-bone/60">{r.legend}</div>
            </div>

            {showZones ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-left">
                  <caption className="sr-only">Candidate zones ranked by composite score</caption>
                  <thead>
                    <tr className="border-b border-bone/15">
                      {["Zone", "Area km²", "Suit.", "To care km", "Road m", "Reach +pp"].map((h) => (
                        <th key={h} scope="col" className="tick pb-2.5 pr-2 font-normal last:text-right">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody onMouseLeave={() => setZone(null)}>
                    {zonesTable.map((z) => (
                      <tr
                        key={z.rank}
                        onMouseEnter={() => setZone(z.rank)}
                        className={`border-b border-bone/10 font-mono text-[12.5px] tabular-nums transition-colors ${zone === z.rank ? "bg-laterite/10 text-bone" : "text-bone/70"}`}
                      >
                        <td className="py-2.5 pr-2 text-laterite">{String(z.rank).padStart(2, "0")}</td>
                        <td className="py-2.5 pr-2">{z.area.toFixed(3)}</td>
                        <td className="py-2.5 pr-2">{z.suit.toFixed(3)}</td>
                        <td className="py-2.5 pr-2">{z.facility.toFixed(2)}</td>
                        <td className="py-2.5 pr-2">{z.road}</td>
                        <td className="py-2.5 text-right">{z.gain.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-[12.5px] leading-relaxed text-bone/45">
                  Reach: gain in the share of residents within a 15-minute drive of inpatient care. Rank follows the
                  composite score, not reach alone.
                </p>
              </div>
            ) : (
              <dl className="mt-6 grid grid-cols-2 border-l border-t border-bone/10">
                {[
                  ["Study window", `${vellore.areaKm2} km²`],
                  ["Observable, all epochs", `${vellore.observablePct}%`],
                  ["Residents", vellore.residents.toLocaleString("en-US")],
                  ["Inpatient facilities", `${vellore.inpatient} of ${vellore.healthcarePoints}`],
                  ["Built-up 2013 → 2024", "34.26 → 40.61 km²"],
                  ["Road network", "4,613 km"],
                ].map(([k, val]) => (
                  <div key={k} className="border-b border-r border-bone/10 p-4">
                    <dt className="tick">{k}</dt>
                    <dd className="mt-1.5 text-[17px] font-medium tracking-[-0.02em] text-bone">{val}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

    </>
  );
}

export function Impact() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div className="grid gap-px border border-bone/10 bg-bone/10 lg:grid-cols-3">
      <Reveal className="bg-ink p-7 sm:p-9">
        <p className="tick">One hospital at Zone 01</p>
        <div className="mt-8 text-[clamp(3rem,5vw,4.4rem)] font-medium leading-none tracking-[-0.05em] text-bone">
          +<Counter value={impact.site1Residents} />
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-bone/60">
          more residents within a 15-minute drive of care. Same budget, better pin.
        </p>
      </Reveal>

      <Reveal delay={80} className="bg-ink p-7 sm:p-9">
        <p className="tick">All five zones, scored jointly</p>
        <div className="mt-8 text-[clamp(3rem,5vw,4.4rem)] font-medium leading-none tracking-[-0.05em] text-bone">
          +<Counter value={impact.jointResidents} />
        </div>
        <div ref={ref} className="mt-6 space-y-2.5">
          {[
            { t: "Sum of individual gains", v: impact.summedResidents, c: "bg-bone/25" },
            { t: "Real joint gain", v: impact.jointResidents, c: "bg-laterite" },
          ].map((b, i) => (
            <div key={b.t}>
              <div className="flex justify-between font-mono text-[10.5px] text-bone/55">
                <span>{b.t}</span>
                <span className="tabular-nums text-bone/80">{b.v.toLocaleString("en-US")}</span>
              </div>
              <div className="mt-1 h-2 bg-bone/[0.05]">
                <div className={`h-full ${b.c} transition-[width] duration-[1300ms] ease-out`} style={{ width: inView ? `${(b.v / impact.summedResidents) * 100}%` : "0%", transitionDelay: `${i * 150}ms` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-bone/60">
          Naive sums overstate the gain by {impact.overstatementPct}%. We score the programme as one.
        </p>
      </Reveal>

      <Reveal delay={160} className="bg-ink p-7 sm:p-9">
        <p className="tick">Population within 15 min of care</p>
        <div className="mt-8 flex items-baseline gap-3 text-[clamp(3rem,5vw,4.4rem)] font-medium leading-none tracking-[-0.05em] text-bone">
          <Counter value={impact.jointCoverage15} decimals={2} suffix="%" />
        </div>
        <p className="mt-2 font-mono text-[11px] text-bone/45">from {impact.baselineCoverage15}% today, all five zones built</p>
        <p className="mt-4 text-[15px] leading-relaxed text-bone/60">
          Measured on people and real roads, not circles.
        </p>
      </Reveal>
    </div>
  );
}

export function WithWithout() {
  const v = useVectors();
  return (
    <div className="mt-px grid gap-10 border border-t-0 border-bone/10 bg-ink-900 p-7 sm:p-9 lg:grid-cols-12">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow">Measured, not asserted</p>
        <h3 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-bone">
          What the forecast changed.
        </h3>
        <p className="mt-4 text-[15.5px] leading-relaxed text-bone/60">
          Same analysis, run with and without the growth forecast.
        </p>
        <dl className="mt-8 divide-y divide-bone/10 border-y border-bone/10">
          {[
            ["Leading zone moved", `${impact.leaderShiftM} m`, "The first choice is robust either way"],
            ["Candidates replaced", `${impact.zonesReplaced} of 5`, "Different land enters the shortlist"],
            ["Mean growth alignment", `${impact.growthAlignment.without} → ${impact.growthAlignment.with}`, "Roughly four times closer to projected growth"],
            ["Population coverage, all five", `${impact.coverageWithout}% → ${impact.jointCoverage15}%`, "No cost to present-day reach"],
          ].map(([k, val, note]) => (
            <div key={k} className="grid grid-cols-[1fr_auto] gap-x-4 py-3.5">
              <dt className="text-[15px] text-bone/80">{k}</dt>
              <dd className="text-right font-mono text-[14px] tabular-nums text-bone">{val}</dd>
              <dd className="col-span-2 mt-0.5 font-mono text-[10.5px] text-bone/40">{note}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7">
        <MapStage
          alt="Leading zones without the growth criterion compared with leading zones with it"
          layers={[
            { src: "built_2024.png", on: true, opacity: 0.45 },
            { src: "projected_2035.png", on: true, opacity: 0.9 },
          ]}
          overlay={
            v && (
              <>
                {v.model_a_top5.map((z) => (
                  <g key={`a${z.rank}`} transform={`translate(${z.cx} ${z.cy})`}>
                    <rect x={-9} y={-9} width={18} height={18} fill="none" stroke="#E6E1D5" strokeWidth={1.6} transform="rotate(45)" />
                  </g>
                ))}
                {v.model_b_top5.map((z) => (
                  <g key={`b${z.rank}`} transform={`translate(${z.cx} ${z.cy})`}>
                    <circle r={14} fill="none" stroke="#E4602F" strokeWidth={2} />
                    <circle r={3} fill="#E4602F" />
                  </g>
                ))}
              </>
            )
          }
          caption={
            <span className="flex flex-wrap gap-x-5 gap-y-1">
              <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rotate-45 border border-bone align-middle" />Without growth criterion</span>
              <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border-2 border-laterite align-middle" />With growth criterion</span>
              <span><i className="mr-1.5 inline-block h-2 w-2 bg-laterite align-middle" />Projected 2035</span>
            </span>
          }
        />
      </Reveal>
    </div>
  );
}

function Swatch({ c, t }: { c: string; t: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 ${c}`} />
      {t}
    </span>
  );
}

function Ramp({ from, to, lo, hi }: { from: string; to: string; lo: string; hi: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {lo}
      <span className="h-2.5 w-24" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
      {hi}
    </span>
  );
}

function Toggle({ on, set, t, disabled }: { on: boolean; set: (b: boolean) => void; t: string; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={() => set(!on)} aria-pressed={on} className="inline-flex items-center gap-2 hover:text-bone disabled:opacity-60">
      <span className={`flex h-3.5 w-6 items-center border px-[2px] transition-colors ${on ? "border-laterite" : "border-bone/25"}`}>
        <span className={`h-2 w-2 transition-transform ${on ? "translate-x-[9px] bg-laterite" : "bg-bone/40"}`} />
      </span>
      {t}
    </button>
  );
}
