import { Link } from "react-router-dom";
import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { company } from "../content/site";
import { usePageMeta } from "../lib/usePageMeta";

const AREAS = [
  { t: "Geospatial machine learning", d: "Remote sensing, land-cover models, growth simulation." },
  { t: "Full-stack & GIS engineering", d: "Map platforms, raster pipelines, APIs." },
  { t: "Urban planning & design", d: "Turning outputs into planning decisions." },
  { t: "Partnerships", d: "Working with cities and institutions on pilots." },
];

const WHY = [
  { t: "Real problems", d: "Where public infrastructure goes affects people for decades." },
  { t: "Early team", d: "Your work shapes the product and the company." },
  { t: "Open methods", d: "Built on open data and research-grade validation." },
];

const mail = `mailto:${company.email}?subject=${encodeURIComponent("Careers at CightX")}`;

export default function Careers() {
  usePageMeta("Careers", "Join CightX and build decision intelligence for the built environment.");
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Help decide <span className="font-serif font-normal italic">where cities build.</span>
          </>
        }
        lede="We're a small, early team in Vellore. We want to hear from people who care about cities and data."
        actions={
          <a href={mail} className="btn btn-primary">
            <span className="btn-dot" />
            Send your profile
          </a>
        }
      />

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Why CightX" title="Work that lands on the map." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 70} className="bg-ink">
                <div className="p-7">
                  <span className="block h-2 w-2 bg-laterite" />
                  <h3 className="mt-8 text-[19px] font-medium tracking-[-0.02em] text-bone">{w.t}</h3>
                  <p className="mt-2 text-[14.5px] text-bone/55">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Areas we hire in" title="Where you could fit." lede="No roles are advertised right now. Tell us what you'd bring." />
          <ul className="mt-12 border-t border-bone/10">
            {AREAS.map((a, i) => (
              <Reveal as="li" key={a.t} className="border-b border-bone/10">
                <a href={`${mail}${encodeURIComponent(` — ${a.t}`)}`} className="group grid items-baseline gap-2 py-6 sm:grid-cols-12">
                  <span className="font-mono text-[11px] text-laterite sm:col-span-1">0{i + 1}</span>
                  <span className="text-[20px] font-medium tracking-[-0.02em] text-bone sm:col-span-5">{a.t}</span>
                  <span className="text-[15px] text-bone/55 sm:col-span-5">{a.d}</span>
                  <span className="font-mono text-[11px] text-bone/35 transition-colors group-hover:text-laterite sm:col-span-1 sm:text-right">Apply →</span>
                </a>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-[14px] text-bone/50">
            Students and interns welcome too. Read how we handle your details in our{" "}
            <Link to="/privacy-policy" className="text-bone underline decoration-bone/30 underline-offset-4 hover:text-laterite">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </section>

      <CTABand title="Don't see your area?" lede="Write to us anyway." primary={{ label: "Contact us", to: "/contact" }} secondary={{ label: "About CightX", to: "/about" }} />
    </>
  );
}
