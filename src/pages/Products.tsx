import { Link } from "react-router-dom";
import { CTABand } from "../components/CTABand";
import { ProductTile, StatusTag } from "../components/Cards";
import { MapBand } from "../components/MapBand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { products } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";

export default function Products() {
  usePageMeta("Products", "Infrastructure Intelligence is live on Vellore. Commercial, risk, environmental and governance intelligence are planned on the same engine.");
  const [flagship, ...planned] = products;

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={
          <>
            One engine, <span className="font-serif font-normal italic">pointed at five questions.</span>
          </>
        }
        lede="Change the criteria, and the same validated pipeline answers a new question for a new customer."
      />

      <MapBand layers={flagship.layers} overlay="zones" focus="top">
        <Reveal className="w-full">
          <div className="max-w-xl">
            <StatusTag status="Live" />
            <h2 className="mt-8 text-[clamp(2.2rem,4vw,3.6rem)] font-medium leading-[1.0] tracking-[-0.04em] text-bone">{flagship.name}</h2>
            <p className="mt-4 max-w-lg text-[17px] text-bone/65">{flagship.lede}</p>
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
              View product
            </Link>
          </div>
        </Reveal>
      </MapBand>

      <section className="bg-ink-900 py-20 lg:py-28">
        <div className="frame">
          <SectionHeader label="Roadmap" title="Coming next." lede="Planned, not built. Each runs on the engine proven above." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {planned.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="bg-ink">
                <ProductTile p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand title="Have a question we haven't listed?" lede="If it's about where to build, the engine can probably be pointed at it." />
    </>
  );
}
