import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { CTABand } from "../components/CTABand";
import { ProductTile, ServiceCard, StatusTag } from "../components/Cards";
import { MapBand } from "../components/MapBand";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { products, services, values } from "../content/catalog";
import { stages } from "../content/site";
import { Hero } from "../hero/Hero";
import { usePageMeta } from "../lib/usePageMeta";
import { DataBand } from "../sections/DataBand";

export default function Home() {
  usePageMeta(
    "CightX",
    "CightX forecasts urban growth from satellite data and ranks sites for hospitals and public infrastructure, with every forecast tested against history.",
  );
  const [flagship, ...planned] = products;

  return (
    <>
      <Hero />
      <DataBand />

      {/* services */}
      <section className="py-24 lg:py-32">
        <div className="frame">
          <SectionHeader label="Services" title="What we deliver." lede="Four services, one validated engine." />
          <div className="mt-14 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70} className="bg-ink">
                <ServiceCard s={s} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* products */}
      <section className="border-t border-bone/10 pb-14 pt-24 lg:pt-32">
        <div className="frame">
          <SectionHeader label="Products" title="One engine. Five questions." lede="One product is live. Four are on the roadmap." />
        </div>
      </section>

      <MapBand layers={[{ src: "suitability.png", on: true, smooth: true, opacity: 0.9 }]} overlay="zones" focus="top">
        <Reveal className="w-full">
          <div className="max-w-xl">
            <StatusTag status="Live" />
            <h3 className="mt-8 text-[clamp(2.2rem,4vw,3.6rem)] font-medium leading-[1.0] tracking-[-0.04em] text-bone">{flagship.name}</h3>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-bone/65">{flagship.short}</p>
            <ul className="mt-8 space-y-2">
              {flagship.questions.map((q) => (
                <li key={q} className="flex items-center gap-3 text-[15px] text-bone/85">
                  <span className="h-px w-3 bg-laterite" />
                  {q}
                </li>
              ))}
            </ul>
            <Link to={`/products/${flagship.slug}`} className="btn btn-primary mt-10">
              <span className="btn-dot" />
              Explore Infrastructure Intelligence
            </Link>
          </div>
        </Reveal>
      </MapBand>

      <section className="pb-24 pt-px lg:pb-32">
        <div className="frame">
          <div className="grid gap-px border border-t-0 border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {planned.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="bg-ink">
                <ProductTile p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-24 lg:py-32">
        <div className="frame">
          <SectionHeader label="How it works" title="See. Predict. Score. Rank." lede="Nothing reaches a recommendation until it passes a test." />
          <ol className="mt-14 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 80} className="bg-ink">
                <div className="flex h-full flex-col p-6 sm:p-7">
                  <span className="font-mono text-[11px] text-bone/40">0{i + 1}</span>
                  <h3 className="mt-8 text-[28px] font-medium tracking-[-0.04em] text-bone">{s.verb}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-bone/55">{s.title}</p>
                  <p className="mt-auto pt-8 font-mono text-[10.5px] text-bone/40">{s.method}</p>
                  {s.gate && (
                    <p className="mt-3 flex items-center gap-2 font-mono text-[10.5px] text-mint/80">
                      <span className="h-1.5 w-1.5 rotate-45 border border-mint" />
                      {s.gate.name.split(" · ")[0]} passed
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-8">
            <Link to="/company/technology" className="inline-flex items-center gap-2 text-[14px] text-laterite hover:text-laterite-soft">
              Explore the technology
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      <MapBand
        layers={[
          { src: "built_2024.png", on: true, opacity: 0.55 },
          { src: "growth_prob_2030.png", on: true, smooth: true },
          { src: "projected_2035.png", on: true },
        ]}
        focus="center"
      >
        <Reveal className="w-full">
          <div className="max-w-xl">
            <p className="eyebrow">Urban Growth Forecasting</p>
            <h2 className="display mt-6 text-[clamp(2.2rem,4.4vw,4rem)]">
              See a city grow <span className="font-serif font-normal italic">before it does.</span>
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-bone/65">
              Years of satellite imagery turned into a forecast of where a city grows next, tested against history first.
            </p>
            <Link to="/services/urban-growth-forecasting" className="btn btn-ghost mt-10">
              Urban Growth Forecasting
              <Arrow />
            </Link>
          </div>
        </Reveal>
      </MapBand>

      {/* why */}
      <section className="bg-ink-900 py-24 lg:py-32">
        <div className="frame">
          <SectionHeader label="Why CightX" title="Forecasts you can check." />
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
        </div>
      </section>

      <CTABand />
    </>
  );
}
