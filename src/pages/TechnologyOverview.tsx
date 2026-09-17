import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { TechCard } from "../components/Cards";
import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { flagship, technologies } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";
import { Technology } from "../sections/Technology";

export default function TechnologyOverview() {
  usePageMeta(
    "Technology",
    "CightX technology: Earth observation, geospatial AI, predictive simulation and spatial decision systems, built in-house and validated before use.",
  );
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title={
          <>
            The technology <span className="font-serif font-normal italic">behind CightX.</span>
          </>
        }
        lede="Four technologies we build in-house. Together they form the intelligence layer every CightX product runs on."
        stats={[
          { v: "4", k: "Core technologies" },
          { v: "3", k: "Validation gates" },
          { v: "Open", k: "Data foundation" },
        ]}
      />

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Core technologies" title="What we build." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((t, i) => (
              <Reveal key={t.slug} delay={i * 70} className="bg-ink">
                <TechCard t={t} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Technology />

      <section className="py-20">
        <div className="frame">
          <Reveal>
            <Link
              to={`/products/${flagship.slug}`}
              className="group flex flex-col justify-between gap-6 border border-bone/10 p-7 transition-colors hover:border-bone/30 sm:flex-row sm:items-center sm:p-9"
            >
              <span>
                <span className="tick">In production</span>
                <span className="mt-2 block text-[clamp(1.4rem,2.4vw,2rem)] font-medium tracking-[-0.03em] text-bone">
                  This technology powers the {flagship.fullName}.
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 text-[14px] text-laterite">
                See the product
                <Arrow className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand title="Work with our technology." lede="Research collaborations, pilots and engineering roles." primary={{ label: "Contact us", to: "/contact" }} secondary={{ label: "Research", to: "/research" }} />
    </>
  );
}
