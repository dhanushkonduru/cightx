import { Link, useParams } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { ProductBadge, StatusTag } from "../components/Cards";
import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { findPlanned, flagship, technologies, type PlannedProduct } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";
import FlagshipProduct from "./FlagshipProduct";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const { slug } = useParams();
  if (slug === flagship.slug) return <FlagshipProduct />;
  const p = findPlanned(slug);
  if (!p) return <NotFound />;
  return <Planned p={p} />;
}

function Planned({ p }: { p: PlannedProduct }) {
  usePageMeta(p.name, `${p.name}, a planned CightX product: ${p.short}`);
  const tech = technologies.filter((t) => p.poweredBy.includes(t.slug));
  return (
    <>
      <PageHero
        eyebrow={`Products · ${p.name}`}
        badge={
          <span className="flex items-center gap-3">
            <ProductBadge />
            <StatusTag status="Planned" />
          </span>
        }
        title={p.headline}
        lede={p.lede}
        layers={p.layers}
        actions={
          <Link to="/contact" className="btn btn-primary">
            <span className="btn-dot" />
            Register interest
          </Link>
        }
      />

      <section className="py-24">
        <div className="frame grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader align="stack" label="Questions it will answer" title="What it's for." />
            <ul className="mt-10 border-t border-bone/10">
              {p.questions.map((q) => (
                <Reveal as="li" key={q} className="border-b border-bone/10">
                  <p className="py-4 text-[18px] tracking-[-0.01em] text-bone/85">{q}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader align="stack" label="Who it's for" title="Built for." />
            <ul className="mt-10 border-t border-bone/10">
              {p.audience.map((a) => (
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

      <section className="border-t border-bone/10 bg-ink-900 py-20">
        <div className="frame">
          <SectionHeader label="Built on CightX technology" title="Already proven in our flagship." />
          <div className="mt-10 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2">
            {tech.map((t) => (
              <Link key={t.slug} to={`/technology/${t.slug}`} className="group flex items-center justify-between bg-ink-900 p-6 transition-colors hover:bg-ink-800">
                <span>
                  <span className="block text-[18px] font-medium tracking-[-0.02em] text-bone">{t.name}</span>
                  <span className="mt-1 block text-[14px] text-bone/50">{t.short}</span>
                </span>
                <Arrow className="text-bone/30 transition-all group-hover:translate-x-1 group-hover:text-laterite" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand title="Want to shape this product?" lede="We're looking for early partners to define it with." primary={{ label: "Register interest", to: "/contact" }} secondary={{ label: "See our flagship", to: `/products/${flagship.slug}` }} />
    </>
  );
}
