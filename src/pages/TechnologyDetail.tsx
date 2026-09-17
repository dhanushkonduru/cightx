import { Link, useParams } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { CTABand } from "../components/CTABand";
import { MapBand } from "../components/MapBand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { findTechnology, flagship, roadmap, technologies } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";
import NotFound from "./NotFound";

export default function TechnologyDetail() {
  const { slug } = useParams();
  const t = findTechnology(slug);
  usePageMeta(t?.name ?? "Technology", t ? `CightX technology · ${t.name}: ${t.lede}` : "");
  if (!t) return <NotFound />;

  const others = technologies.filter((o) => o.slug !== t.slug);
  const planned = roadmap.filter((p) => p.poweredBy.includes(t.slug));

  return (
    <>
      <PageHero
        eyebrow={`Technology · ${t.name}`}
        title={t.headline}
        lede={t.lede}
        layers={t.layers}
        overlay={t.overlay}
        stats={t.stats}
        actions={
          <>
            <Link to="/contact" className="btn btn-primary">
              <span className="btn-dot" />
              Talk to our team
            </Link>
            <Link to="/technology" className="btn btn-ghost">
              All technology
              <Arrow />
            </Link>
          </>
        }
      />

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="What we build" title={`Inside ${t.name}.`} />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {t.builds.map((b, i) => (
              <Reveal key={b.t} delay={i * 70} className="bg-ink">
                <div className="p-6 sm:p-7">
                  <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                  <h3 className="mt-8 text-[19px] font-medium tracking-[-0.02em] text-bone">{b.t}</h3>
                  <p className="mt-2 text-[14.5px] text-bone/55">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MapBand layers={t.layers} overlay={t.overlay} className="min-h-[420px] lg:min-h-[500px]">
        <Reveal className="w-full">
          <div className="max-w-lg">
            <p className="eyebrow">CightX technology</p>
            <p className="display mt-6 text-[clamp(2.1rem,4.2vw,3.6rem)]">{t.short}</p>
          </div>
        </Reveal>
      </MapBand>

      <section className="py-20">
        <div className="frame grid gap-10 lg:grid-cols-2">
          <div>
            <p className="tick">Powers</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              <li>
                <Link to={`/products/${flagship.slug}`} className="inline-flex items-center gap-2 border border-bone/15 px-3 py-2 text-[14px] text-bone/85 hover:border-bone/40">
                  {flagship.fullName}
                  <span className="font-mono text-[9.5px] uppercase text-mint">live</span>
                </Link>
              </li>
              {planned.map((p) => (
                <li key={p.slug}>
                  <Link to={`/products/${p.slug}`} className="inline-flex items-center gap-2 border border-bone/15 px-3 py-2 text-[14px] text-bone/70 hover:border-bone/40">
                    {p.name}
                    <span className="font-mono text-[9.5px] uppercase text-bone/35">planned</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="tick">Other technologies</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={`/technology/${o.slug}`} className="inline-flex border border-bone/15 px-3 py-2 text-[14px] text-bone/80 hover:border-bone/40">
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTABand title="Build with this technology." lede="Tell us the problem. We'll tell you what our technology can do for it." />
    </>
  );
}
