import { Link } from "react-router-dom";
import { Arrow } from "../components/Arrow";
import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { companyIdentity, flagship, journey, mission, technologies, values, vision } from "../content/catalog";
import { team } from "../content/site";
import { usePageMeta } from "../lib/usePageMeta";

export default function Company() {
  usePageMeta("Company", "CightX is a geospatial and predictive AI company, founded at VIT Vellore, building intelligence for the cities ahead.");
  return (
    <>
      <PageHero
        eyebrow="Company"
        title={
          <>
            About <span className="font-serif font-normal italic">CightX.</span>
          </>
        }
        lede={companyIdentity.summary}
        layers={[
          { src: "built_2024.png", on: true, opacity: 0.55 },
          { src: "projected_2035.png", on: true },
        ]}
        stats={[
          { v: String(technologies.length), k: "Core technologies" },
          { v: "1 live · 4 planned", k: "Products" },
          { v: "VIT Vellore", k: "Where we started" },
        ]}
      />

      {/* what the company is, in one screen */}
      <section className="py-24 lg:py-28">
        <div className="frame grid gap-px border border-bone/10 bg-bone/10 lg:grid-cols-3">
          {[
            { k: "Who we are", v: "A deep-tech company working at the intersection of AI, satellite data and urban systems." },
            { k: "What we build", v: "Earth observation, geospatial AI, predictive simulation and spatial decision systems.", to: "/technology" },
            { k: "What we ship", v: `Products on that technology, starting with the ${flagship.fullName}.`, to: "/products" },
          ].map((c, i) => (
            <Reveal key={c.k} delay={i * 70} className="bg-ink">
              <div className="flex h-full flex-col p-7 sm:p-9">
                <p className="tick">{c.k}</p>
                <p className="mt-5 text-[19px] leading-snug tracking-[-0.015em] text-bone">{c.v}</p>
                {c.to && (
                  <Link to={c.to} className="mt-auto inline-flex items-center gap-2 pt-8 text-[13.5px] text-laterite hover:text-laterite-soft">
                    Learn more
                    <Arrow />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="mission" className="scroll-mt-20 border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <Reveal>
            <div className="max-w-4xl">
              <p className="eyebrow">Our mission</p>
              <p className="display mt-6 text-[clamp(2rem,4vw,3.4rem)]">{mission.statement}</p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
            {mission.gap.map((g, i) => (
              <Reveal key={g.v} delay={i * 70} className="bg-ink-900">
                <div className="p-7">
                  <p className="text-[44px] font-medium leading-none tracking-[-0.05em] text-bone">{g.v}</p>
                  <p className="mt-3 text-[15px] text-bone/55">{g.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="vision" className="relative scroll-mt-20 overflow-hidden border-t border-bone/10 py-24 lg:py-28">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="frame relative">
          <Reveal>
            <div className="max-w-4xl">
              <p className="eyebrow">Our vision</p>
              <p className="display mt-6 text-[clamp(2rem,4vw,3.4rem)]">{vision.statement}</p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
            {vision.pillars.map((p, i) => (
              <Reveal key={p.t} delay={i * 70} className="bg-ink">
                <div className="p-7">
                  <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                  <h3 className="mt-8 text-[19px] font-medium tracking-[-0.02em] text-bone">{p.t}</h3>
                  <p className="mt-2 text-[14.5px] text-bone/55">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="scroll-mt-20 border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Our values" title="How we work." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 70} className="bg-ink-900">
                <div className="p-7">
                  <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                  <h3 className="mt-8 text-[19px] font-medium tracking-[-0.02em] text-bone">{v.t}</h3>
                  <p className="mt-2 text-[14.5px] text-bone/55">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="scroll-mt-20 py-24 lg:py-28">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader align="stack" label="Our journey" title="From research to a company." />
          </div>
          <ol className="border-l border-bone/15 lg:col-span-6 lg:col-start-7">
            {journey.map((j) => (
              <Reveal as="li" key={j.t} className="pb-7 pl-7 last:pb-0">
                <div className="relative">
                  <span className={`absolute -left-[33px] top-1.5 h-[9px] w-[9px] ${j.next ? "border border-laterite bg-ink" : "bg-bone"}`} />
                  <p className={`text-[17px] font-medium tracking-[-0.01em] ${j.next ? "text-laterite" : "text-bone"}`}>{j.t}</p>
                  <p className="mt-1 text-[14.5px] text-bone/55">{j.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="team" className="scroll-mt-20 border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Team" title="The people building CightX." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 80} className="bg-ink-900">
                <div className="p-7">
                  <div className="flex h-14 w-14 items-center justify-center border border-bone/15 font-mono text-[15px] text-bone/80">
                    {t.name.replace("Prof. ", "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <p className="mt-8 text-[21px] font-medium tracking-[-0.03em] text-bone">{t.name}</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-laterite">{t.role}</p>
                  <p className="mt-4 text-[14.5px] text-bone/55">{t.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-5 font-mono text-[10.5px] text-bone/40">Founded at Vellore Institute of Technology, Tamil Nadu</p>
        </div>
      </section>

      <CTABand title="Join the company." lede="Engineers, researchers and pilot partners welcome." primary={{ label: "Careers", to: "/careers" }} secondary={{ label: "Contact us", to: "/contact" }} />
    </>
  );
}
