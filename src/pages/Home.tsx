import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { CTABand } from "../components/CTABand";
import { PlannedTile, ProductBadge, StatusTag, TechCard } from "../components/Cards";
import { MapBand } from "../components/MapBand";
import { ProductWindow } from "../components/ProductWindow";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { companyIdentity, flagship, roadmap, technologies, values } from "../content/catalog";
import { Hero } from "../hero/Hero";
import { usePageMeta } from "../lib/usePageMeta";
import { DataBand } from "../sections/DataBand";

const RESEARCH = [
  { k: "Manuscript", v: "Growth-aware infrastructure siting with independent validation", to: "/research" },
  { k: "Invention disclosure", v: "Hindcast skill gating of Earth-observation-derived criteria", to: "/research" },
  { k: "Open methods", v: "Every result rebuilds from open data and published code", to: "/research" },
];

export default function Home() {
  usePageMeta(
    "CightX",
    "CightX is a geospatial and predictive AI company building satellite-data, simulation and decision systems for cities. Flagship product: the CightX Urban Growth Platform.",
  );

  return (
    <>
      <Hero />
      <DataBand />

      {/* 1 · the company: what CightX builds */}
      <section className="py-24 lg:py-32">
        <div className="frame">
          <SectionHeader
            label="What CightX builds"
            title={
              <>
                Four technologies. <span className="text-bone/45">One intelligence layer for the built environment.</span>
              </>
            }
            lede="We develop the core technology in-house, from satellite pipelines to simulation engines, and build products on top of it."
          />
          <div className="mt-14 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((t, i) => (
              <Reveal key={t.slug} delay={i * 70} className="bg-ink">
                <TechCard t={t} index={i} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link to="/technology" className="inline-flex items-center gap-2 text-[14px] text-laterite hover:text-laterite-soft">
              Explore our technology
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 2 · the domain */}
      <MapBand
        layers={[
          { src: "built_2024.png", on: true, opacity: 0.55 },
          { src: "growth_prob_2030.png", on: true, smooth: true },
          { src: "projected_2035.png", on: true },
        ]}
        className="min-h-[440px] lg:min-h-[520px]"
      >
        <Reveal className="w-full">
          <div className="max-w-xl">
            <p className="eyebrow">Our focus · {companyIdentity.focus}</p>
            <h2 className="display mt-6 text-[clamp(2.1rem,4.2vw,3.8rem)]">
              Cities change every year. <span className="font-serif font-normal italic">Plans should too.</span>
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-bone/65">{companyIdentity.focusLine}</p>
          </div>
        </Reveal>
      </MapBand>

      {/* 3 · the flagship product, framed as something CightX makes */}
      <section className="border-b border-bone/10 bg-ink-900 py-24 lg:py-32">
        <div className="frame">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <ProductBadge label="Flagship product" />
                  <StatusTag status="Live" />
                </div>
                <h2 className="mt-8 text-[clamp(2.2rem,4vw,3.4rem)] font-medium leading-[1.0] tracking-[-0.04em] text-bone">
                  {flagship.name}
                </h2>
                <p className="mt-5 font-serif text-[clamp(1.5rem,2.4vw,2rem)] italic leading-[1.2] text-bone/85">{flagship.tagline}</p>
                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-bone/60">{flagship.lede}</p>
                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {flagship.modules.map((m) => (
                    <li key={m.t} className="flex items-center gap-2.5 text-[14.5px] text-bone/80">
                      <span className="h-1.5 w-1.5 bg-laterite" />
                      {m.t}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link to={`/products/${flagship.slug}`} className="btn btn-primary">
                    <span className="btn-dot" />
                    Explore the platform
                  </Link>
                  <Link to="/contact" className="btn btn-ghost">
                    Request a pilot
                    <Arrow />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-7">
              <ProductWindow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 · the product roadmap, on the same technology */}
      <section className="py-24 lg:py-32">
        <div className="frame">
          <SectionHeader
            label="Product roadmap"
            title={
              <>
                More products, <span className="text-bone/45">same technology base.</span>
              </>
            }
            lede="Each planned product reuses the technology behind the Urban Growth Platform for a new kind of decision."
          />
          <div className="mt-14 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="bg-ink">
                <PlannedTile p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · how the company works: principles and research */}
      <section className="border-t border-bone/10 bg-ink-900 py-24 lg:py-32">
        <div className="frame">
          <SectionHeader label="How we work" title="Research-grade, by design." lede="Everything CightX ships is tested against evidence it has never seen." />
          <div className="mt-14 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val, i) => (
              <Reveal key={val.t} delay={i * 70} className="bg-ink-900">
                <div className="p-6 sm:p-7">
                  <span className="block h-2 w-2 bg-laterite" />
                  <h3 className="mt-8 text-[19px] font-medium leading-tight tracking-[-0.02em] text-bone">{val.t}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-bone/55">{val.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-px grid gap-px border border-t-0 border-bone/10 bg-bone/10 md:grid-cols-3">
            {RESEARCH.map((r) => (
              <Link key={r.k} to={r.to} className="group flex items-start justify-between gap-6 bg-ink-900 p-6 transition-colors hover:bg-ink-800 sm:p-7">
                <span>
                  <span className="tick">{r.k}</span>
                  <span className="mt-2 block text-[15px] leading-snug text-bone/80">{r.v}</span>
                </span>
                <Arrow className="mt-1 shrink-0 text-bone/30 transition-all group-hover:translate-x-1 group-hover:text-laterite" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Build the cities ahead with us."
        lede="Pilot cities, research partners and engineers who care about cities: we'd like to hear from you."
        primary={{ label: "Contact us", to: "/contact" }}
        secondary={{ label: "Careers", to: "/careers" }}
      />
    </>
  );
}
