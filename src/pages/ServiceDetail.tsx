import { Link, useParams } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { CTABand } from "../components/CTABand";
import { MapBand } from "../components/MapBand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { findService, products, services } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";
import NotFound from "./NotFound";

const STEPS = [
  { t: "Scope", d: "Your city, facility and horizon." },
  { t: "Analyse", d: "Open data through the validated engine." },
  { t: "Deliver", d: "Maps, rankings and a short report." },
];

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = findService(slug);
  usePageMeta(s?.name ?? "Service", s ? `${s.name}: ${s.lede}` : "");
  if (!s) return <NotFound />;

  const others = services.filter((o) => o.slug !== s.slug);
  const related = products.filter((p) => p.uses.includes(s.slug));

  return (
    <>
      <PageHero
        eyebrow={`Service · ${s.name}`}
        title={s.headline}
        lede={s.lede}
        layers={s.layers}
        overlay={s.overlay}
        stats={s.stats}
        actions={
          <>
            <Link to="/contact" className="btn btn-primary">
              <span className="btn-dot" />
              Request this service
            </Link>
            <Link to="/products/infrastructure-intelligence" className="btn btn-ghost">
              See it on Vellore
              <Arrow />
            </Link>
          </>
        }
      />

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="What you get" title="Deliverables." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {s.deliverables.map((d, i) => (
              <Reveal key={d.t} delay={i * 70} className="bg-ink">
                <div className="p-6 sm:p-7">
                  <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                  <h3 className="mt-8 text-[19px] font-medium tracking-[-0.02em] text-bone">{d.t}</h3>
                  <p className="mt-2 text-[14.5px] text-bone/55">{d.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MapBand layers={s.layers} overlay={s.overlay} focus={s.overlay === "zones" ? "top" : "center"} className="min-h-[460px] lg:min-h-[560px]">
        <Reveal className="w-full">
          <div className="max-w-lg">
            <p className="eyebrow">Running on Vellore</p>
            <p className="display mt-6 text-[clamp(2.6rem,5vw,4.4rem)]">{s.stats[0].v}</p>
            <p className="mt-3 text-[17px] text-bone/65">{s.stats[0].k}</p>
          </div>
        </Reveal>
      </MapBand>

      <section className="bg-ink-900 py-24 lg:py-28">
        <div className="frame grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader align="stack" label="Decisions it informs" title="Built for planners." />
            <ul className="mt-10 border-t border-bone/10">
              {s.informs.map((x) => (
                <Reveal as="li" key={x} className="border-b border-bone/10">
                  <p className="flex items-center gap-4 py-4 text-[18px] tracking-[-0.01em] text-bone/85">
                    <span className="h-2 w-2 bg-mint" />
                    {x}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader align="stack" label="How we deliver" title="Three steps." />
            <ol className="mt-10 border-t border-bone/10">
              {STEPS.map((st, i) => (
                <Reveal as="li" key={st.t} className="border-b border-bone/10">
                  <div className="grid grid-cols-[40px_1fr] items-baseline py-4">
                    <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                    <p className="text-[18px] tracking-[-0.01em] text-bone">
                      {st.t} <span className="text-bone/45">— {st.d}</span>
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="frame grid gap-10 lg:grid-cols-2">
          <div>
            <p className="tick">Used in</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link to={`/products/${p.slug}`} className="inline-flex items-center gap-2 border border-bone/15 px-3 py-2 text-[14px] text-bone/80 hover:border-bone/40">
                    {p.name}
                    {p.status === "Planned" && <span className="font-mono text-[9.5px] uppercase text-bone/35">planned</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="tick">Other services</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={`/services/${o.slug}`} className="inline-flex border border-bone/15 px-3 py-2 text-[14px] text-bone/80 hover:border-bone/40">
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
