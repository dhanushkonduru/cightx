import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { CTABand } from "../components/CTABand";
import { MapStage, ZoneMarks, useVectors } from "../components/MapStage";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { services } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";

export default function Services() {
  usePageMeta("Services", "Urban growth forecasting, site selection, accessibility analysis and land-cover mapping from open satellite data.");
  const v = useVectors();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Geospatial evidence for <span className="font-serif font-normal italic">where to build.</span>
          </>
        }
        lede="From satellite record to ranked sites. Take one service, or the whole chain."
        actions={
          <Link to="/contact" className="btn btn-primary">
            <span className="btn-dot" />
            Discuss a project
          </Link>
        }
        stats={[
          { v: "30 m", k: "Analysis resolution" },
          { v: "₹0", k: "Data licensing cost" },
          { v: "3", k: "Validation gates" },
        ]}
      />

      <section className="py-20 lg:py-28">
        <div className="frame space-y-px">
          {services.map((s, i) => (
            <Reveal key={s.slug}>
              <Link
                to={`/services/${s.slug}`}
                className="group grid items-center gap-8 border border-bone/10 bg-ink p-6 transition-colors hover:border-bone/25 hover:bg-ink-800 sm:p-8 lg:grid-cols-12"
              >
                <div className="lg:col-span-1">
                  <span className="font-mono text-[12px] text-laterite">0{i + 1}</span>
                </div>
                <div className="lg:col-span-5">
                  <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium leading-[1.05] tracking-[-0.035em] text-bone">{s.name}</h2>
                  <p className="mt-3 text-[16px] text-bone/55">{s.short}</p>
                </div>
                <ul className="space-y-2 lg:col-span-4">
                  {s.deliverables.map((d) => (
                    <li key={d.t} className="flex items-center gap-3 text-[14.5px] text-bone/75">
                      <span className="h-px w-3 bg-laterite" />
                      {d.t}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-5 lg:col-span-2 lg:justify-end">
                  <div className="w-24 sm:w-28">
                    <MapStage alt="" showScale={false} layers={s.layers} overlay={v && s.overlay === "zones" ? <ZoneMarks v={v} showPaths={false} /> : undefined} />
                  </div>
                  <Arrow className="shrink-0 text-bone/30 transition-all group-hover:translate-x-1 group-hover:text-laterite" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand title="Not sure which service fits?" lede="Tell us the decision you're facing. We'll scope it with you." />
    </>
  );
}
