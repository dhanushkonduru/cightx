import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { StatusTag } from "../components/Cards";
import { CTABand } from "../components/CTABand";
import { MapBand } from "../components/MapBand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import type { Product } from "../content/catalog";
import { vellore } from "../content/site";
import { PlanningRows, PlanningStrip } from "../sections/Planning";
import { Impact, VelloreExplorer, WithWithout } from "../sections/Vellore";

const GATES = [
  { g: "G1", t: "Map accuracy", r: "0.85–0.91 vs 3 independent products" },
  { g: "G2", t: "Forecast hindcast", r: "Beats no-change on 6 of 6 runs" },
  { g: "G3", t: "Sensitivity", r: "Zone 01 holds first across growth, threshold and drive-time sweeps" },
];

const PLATFORM = [
  { t: "Run an analysis", d: "Pick a city and facility type." },
  { t: "Watch each stage", d: "Progress streamed live." },
  { t: "Inspect every site", d: "Scores and reasons on the map." },
  { t: "Export", d: "GeoJSON and PDF." },
];

export default function InfrastructureIntelligence({ p }: { p: Product }) {
  return (
    <>
      <PageHero
        eyebrow={`Product · ${p.name}`}
        badge={<StatusTag status="Live" />}
        title={p.headline}
        lede={p.lede}
        layers={p.layers}
        overlay="zones"
        stats={[
          { v: "4", k: "Services in one product" },
          { v: "30 m", k: "Analysis grid" },
          { v: "3", k: "Validation gates" },
        ]}
        actions={
          <>
            <Link to="/contact" className="btn btn-primary">
              <span className="btn-dot" />
              Start a pilot
            </Link>
            <a href="#explore" className="btn btn-ghost">
              See the case study
              <Arrow />
            </a>
          </>
        }
      />

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="How it works" title="Four maps, one decision." />
          <div className="mt-12">
            <PlanningStrip />
          </div>
        </div>
      </section>

      <section id="explore" className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Case study · Vellore, Tamil Nadu" title="Tested on a real district." lede={`${vellore.areaKm2} km², ${vellore.residents.toLocaleString("en-US")} residents, ${vellore.years} years of satellite record.`} />
          <div className="mt-12">
            <VelloreExplorer />
          </div>
        </div>
      </section>

      <MapBand layers={[{ src: "suitability.png", on: true, smooth: true, opacity: 0.9 }]} overlay="zones" focus="top">
        <Reveal className="w-full">
          <div className="max-w-xl">
            <p className="eyebrow">Ranked candidate zones</p>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.4vw,4rem)]">
              Five zones. <span className="font-serif font-normal italic">One clear first choice.</span>
            </h2>
            <p className="mt-5 text-[17px] text-bone/65">Zone 01 brings 14,417 more residents within a 15-minute drive of care.</p>
          </div>
        </Reveal>
      </MapBand>

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Results" title="What it changed." />
          <div className="mt-12">
            <Impact />
            <WithWithout />
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="For planners and architects" title="What each output informs." />
          <div className="mt-12">
            <PlanningRows />
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-28">
        <div className="frame grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader align="stack" label="Validated" title="Three gates passed." />
            <ul className="mt-10 border-t border-bone/10">
              {GATES.map((g) => (
                <Reveal as="li" key={g.g} className="border-b border-bone/10">
                  <div className="grid grid-cols-[48px_1fr] items-baseline gap-2 py-4">
                    <span className="font-mono text-[11px] text-mint">{g.g}</span>
                    <p className="text-[17px] text-bone">
                      {g.t} <span className="block text-[14.5px] text-bone/50 sm:inline sm:before:content-['_—_']">{g.r}</span>
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Link to="/company/technology" className="mt-6 inline-flex items-center gap-2 text-[14px] text-laterite">
              See the validation in detail
              <Arrow />
            </Link>
          </div>
          <div>
            <SectionHeader align="stack" label="Delivered through" title="The CightX Planner." />
            <div className="mt-10 grid grid-cols-2 gap-px border border-bone/10 bg-bone/10">
              {PLATFORM.map((x, i) => (
                <Reveal key={x.t} delay={i * 60} className="bg-ink">
                  <div className="p-5">
                    <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                    <p className="mt-5 text-[16px] font-medium text-bone">{x.t}</p>
                    <p className="mt-1 text-[13.5px] text-bone/50">{x.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABand title="Bring Infrastructure Intelligence to your city." lede="We're starting with pilot cities in Tamil Nadu." primary={{ label: "Start a pilot", to: "/contact" }} />
    </>
  );
}
