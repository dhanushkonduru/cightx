import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { PlannedTile, ProductBadge, StatusTag } from "../components/Cards";
import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { ProductWindow } from "../components/ProductWindow";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { flagship, roadmap } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";

export default function Products() {
  usePageMeta(
    "Products",
    "Products built by CightX. Flagship: the CightX Urban Growth Platform. Planned: commercial, risk, environmental and governance intelligence.",
  );

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={
          <>
            Products built on <span className="font-serif font-normal italic">CightX technology.</span>
          </>
        }
        lede="One product in the field today, four on the roadmap, all running on the same technology base."
      />

      <section className="py-20 lg:py-28">
        <div className="frame">
          <SectionHeader label="Flagship" title="Available now." />
          <Reveal className="mt-12">
            <div className="grid items-center gap-12 border border-bone/10 p-6 sm:p-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-center gap-4">
                  <ProductBadge />
                  <StatusTag status="Live" />
                </div>
                <h2 className="mt-8 text-[clamp(2rem,3.6vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.04em] text-bone">{flagship.name}</h2>
                <p className="mt-4 font-serif text-[clamp(1.35rem,2.2vw,1.8rem)] italic leading-snug text-bone/80">{flagship.tagline}</p>
                <p className="mt-4 max-w-md text-[16px] text-bone/60">{flagship.lede}</p>
                <Link to={`/products/${flagship.slug}`} className="btn btn-primary mt-9">
                  <span className="btn-dot" />
                  View the platform
                </Link>
              </div>
              <div className="lg:col-span-7">
                <ProductWindow />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink-900 py-20 lg:py-28">
        <div className="frame">
          <SectionHeader label="Roadmap" title="Coming next." lede="Planned products. Each one reuses technology already built for the flagship." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70} className="bg-ink">
                <PlannedTile p={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link to="/technology" className="inline-flex items-center gap-2 text-[14px] text-laterite hover:text-laterite-soft">
              The technology they share
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand title="Shape what we build next." lede="Early partners help define each product on our roadmap." primary={{ label: "Contact us", to: "/contact" }} secondary={{ label: "Our technology", to: "/technology" }} />
    </>
  );
}
