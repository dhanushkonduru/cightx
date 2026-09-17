import { Link, useParams } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { StatusTag } from "../components/Cards";
import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { findProduct, services, type Product } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";
import InfrastructureIntelligence from "./InfrastructureIntelligence";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const { slug } = useParams();
  const p = findProduct(slug);
  usePageMeta(p?.name ?? "Product", p ? `${p.name}: ${p.short}` : "");
  if (!p) return <NotFound />;
  if (p.status === "Live") return <InfrastructureIntelligence p={p} />;
  return <PlannedProduct p={p} />;
}

function PlannedProduct({ p }: { p: Product }) {
  const uses = services.filter((s) => p.uses.includes(s.slug));
  return (
    <>
      <PageHero
        eyebrow={`Product · ${p.name}`}
        badge={<StatusTag status="Planned" />}
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
          <SectionHeader label="Same engine" title="Built on proven services." />
          <div className="mt-10 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2">
            {uses.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="group flex items-center justify-between bg-ink-900 p-6 transition-colors hover:bg-ink-800">
                <span>
                  <span className="block text-[18px] font-medium tracking-[-0.02em] text-bone">{s.name}</span>
                  <span className="mt-1 block text-[14px] text-bone/50">{s.short}</span>
                </span>
                <Arrow className="text-bone/30 transition-all group-hover:translate-x-1 group-hover:text-laterite" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand title="Want to shape this product?" lede="We're looking for early partners to define it with." primary={{ label: "Register interest", to: "/contact" }} secondary={{ label: "See the live product", to: "/products/infrastructure-intelligence" }} />
    </>
  );
}
