import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { ProductBadge, StatusTag } from "../components/Cards";
import { CTABand } from "../components/CTABand";
import { MapBand } from "../components/MapBand";
import { MapStage, ZoneMarks, useVectors } from "../components/MapStage";
import { ProductWindow } from "../components/ProductWindow";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { flagship, technologies } from "../content/catalog";
import { vellore } from "../content/site";
import { usePageMeta } from "../lib/usePageMeta";
import { PlanningRows, PlanningStrip } from "../sections/Planning";
import { Impact, VelloreExplorer, WithWithout } from "../sections/Vellore";

const GATES = [
  { g: "G1", t: "Map accuracy", r: "0.85–0.91 vs 3 independent products" },
  { g: "G2", t: "Forecast hindcast", r: "Beats no-change on 6 of 6 runs" },
  { g: "G3", t: "Stress test", r: "Top site holds first across growth, threshold and drive-time sweeps" },
];

const DELIVERY = [
  { t: "Run an analysis", d: "Pick a city and a facility type." },
  { t: "Watch each stage", d: "Progress streamed live." },
  { t: "Inspect every site", d: "Scores and reasons on the map." },
  { t: "Export", d: "GeoJSON and PDF." },
];

export default function FlagshipProduct() {
  usePageMeta(flagship.fullName, `${flagship.fullName}, the flagship product from CightX. ${flagship.tagline} ${flagship.short}`);
  const v = useVectors();

  return (
    <>
      {/* product hero */}
      <section className="relative overflow-hidden border-b border-bone/10 pb-20 pt-32 lg:pb-28 lg:pt-40">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="frame relative">
          <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 font-mono text-[11px] text-bone/45">
            <Link to="/" className="hover:text-bone">CightX</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-bone">Products</Link>
            <span>/</span>
            <span className="text-bone/75">{flagship.name}</span>
          </nav>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5" style={{ animation: "fadeUp .9s cubic-bezier(.2,.7,.1,1) both" }}>
              <div className="flex flex-wrap items-center gap-4">
                <ProductBadge label="Flagship product" />
                <StatusTag status="Live" />
              </div>
              <h1 className="display mt-7 text-[clamp(2.4rem,4.6vw,4.2rem)]">{flagship.name}</h1>
              <p className="mt-5 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-[1.15] text-bone/85">{flagship.tagline}</p>
              <p className="lede mt-6 max-w-md">{flagship.lede}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/contact" className="btn btn-primary">
                  <span className="btn-dot" />
                  Request a pilot
                </Link>
                <a href="#case-study" className="btn btn-ghost">
                  See the case study
                  <Arrow />
                </a>
              </div>
            </div>
            <div className="lg:col-span-7" style={{ animation: "fadeUp 1.1s .15s cubic-bezier(.2,.7,.1,1) both" }}>
              <ProductWindow />
            </div>
          </div>
        </div>
      </section>

      {/* modules */}
      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Platform modules" title="Four modules, one workflow." lede="Use them together, or start with the one your decision needs." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {flagship.modules.map((m, i) => (
              <Reveal key={m.t} delay={i * 70} className="bg-ink">
                <div className="flex h-full flex-col p-6 sm:p-7">
                  <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                  <div className="mt-6">
                    <MapStage alt="" showScale={false} layers={m.layers} overlay={v && "zones" in m && m.zones ? <ZoneMarks v={v} showPaths={false} /> : undefined} />
                  </div>
                  <h3 className="mt-6 text-[19px] font-medium tracking-[-0.02em] text-bone">{m.t}</h3>
                  <p className="mt-2 text-[14.5px] text-bone/55">{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* workflow */}
      <section className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="How it works" title="From satellite record to ranked sites." />
          <div className="mt-12">
            <PlanningStrip />
          </div>
        </div>
      </section>

      {/* who and why */}
      <section className="py-24 lg:py-28">
        <div className="frame grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader align="stack" label="Questions it answers" title="Built for real decisions." />
            <ul className="mt-10 border-t border-bone/10">
              {flagship.questions.map((q) => (
                <Reveal as="li" key={q} className="border-b border-bone/10">
                  <p className="py-4 text-[18px] tracking-[-0.01em] text-bone/85">{q}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader align="stack" label="Who uses it" title="For the people who plan." />
            <ul className="mt-10 border-t border-bone/10">
              {flagship.audience.map((a) => (
                <Reveal as="li" key={a} className="border-b border-bone/10">
                  <p className="flex items-center gap-4 py-4 text-[18px] tracking-[-0.01em] text-bone/85">
                    <span className="h-2 w-2 bg-laterite" />
                    {a}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* case study */}
      <section id="case-study" className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader
            label="Case study · Vellore, Tamil Nadu"
            title="Tested on a real district."
            lede={`${vellore.areaKm2} km², ${vellore.residents.toLocaleString("en-US")} residents, ${vellore.years} years of satellite record.`}
          />
          <div className="mt-12">
            <VelloreExplorer />
          </div>
        </div>
      </section>

      <MapBand layers={[{ src: "suitability.png", on: true, smooth: true, opacity: 0.9 }]} overlay="zones">
        <Reveal className="w-full">
          <div className="max-w-xl">
            <p className="eyebrow">Case study result</p>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.4vw,4rem)]">
              Five sites. <span className="font-serif font-normal italic">One clear first choice.</span>
            </h2>
            <p className="mt-5 text-[17px] text-bone/65">The top site brings 14,417 more residents within a 15-minute drive of care.</p>
          </div>
        </Reveal>
      </MapBand>

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Case study results" title="What it changed." />
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

      {/* trust + delivery */}
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
          </div>
          <div>
            <SectionHeader align="stack" label="Delivered through" title="A map-based web app." />
            <div className="mt-10 grid grid-cols-2 gap-px border border-bone/10 bg-bone/10">
              {DELIVERY.map((x, i) => (
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

      {/* back up to the company */}
      <section className="border-t border-bone/10 bg-ink-900 py-20">
        <div className="frame">
          <SectionHeader label="Built by CightX" title="Powered by our core technology." />
          <div className="mt-10 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((t) => (
              <Link key={t.slug} to={`/technology/${t.slug}`} className="group flex items-start justify-between gap-4 bg-ink-900 p-6 transition-colors hover:bg-ink-800">
                <span>
                  <span className="block text-[17px] font-medium tracking-[-0.02em] text-bone">{t.name}</span>
                  <span className="mt-1 block text-[13.5px] text-bone/50">{t.short}</span>
                </span>
                <Arrow className="mt-1 shrink-0 text-bone/30 transition-all group-hover:translate-x-1 group-hover:text-laterite" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title={`Bring the ${flagship.name} to your city.`}
        lede="We're starting with pilot cities in Tamil Nadu."
        primary={{ label: "Request a pilot", to: "/contact" }}
        secondary={{ label: "All products", to: "/products" }}
      />
    </>
  );
}
