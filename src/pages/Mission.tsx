import { CTABand } from "../components/CTABand";
import { Counter } from "../components/Counter";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { values, vision } from "../content/catalog";
import { usePageMeta } from "../lib/usePageMeta";

export default function Mission() {
  usePageMeta("Mission, Vision & Values", "CightX exists so public money lands where people are going, not where they used to be.");
  return (
    <div id="mission">
      <PageHero
        eyebrow="Company · Our Mission"
        title={
          <>
            Put infrastructure where people <span className="font-serif font-normal italic">are going.</span>
          </>
        }
        lede="Cities change every year. The evidence behind siting decisions rarely does."
        layers={[
          { src: "built_2013.png", on: true, opacity: 0.7 },
          { src: "change_2013_2024.png", on: true },
        ]}
      />

      <section className="py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="The gap" title="Planning from an old snapshot." />
          <div className="mt-12 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
            <Reveal className="bg-ink">
              <div className="p-7">
                <p className="text-[52px] font-medium leading-none tracking-[-0.05em] text-bone">2011</p>
                <p className="mt-3 text-[15px] text-bone/55">Last census. Next reference date: 1 March 2027.</p>
              </div>
            </Reveal>
            <Reveal delay={80} className="bg-ink">
              <div className="p-7">
                <p className="text-[52px] font-medium leading-none tracking-[-0.05em] text-bone">
                  +<Counter value={6.35} decimals={2} />
                  <span className="ml-1 text-[18px] text-bone/45">km²</span>
                </p>
                <p className="mt-3 text-[15px] text-bone/55">Built in Vellore, 2013–2024. Off the record.</p>
              </div>
            </Reveal>
            <Reveal delay={160} className="bg-ink">
              <div className="p-7">
                <p className="text-[52px] font-medium leading-none tracking-[-0.05em] text-bone">~4×</p>
                <p className="mt-3 text-[15px] text-bone/55">Faster building in 2019–24 than 2013–19.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="vision" className="relative overflow-hidden border-t border-bone/10 py-24 lg:py-32">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="frame relative">
          <Reveal>
            <div className="max-w-4xl">
              <p className="eyebrow">Our Vision</p>
              <p className="display mt-6 text-[clamp(2rem,4.2vw,3.6rem)]">
                {vision.statement.split(" with ")[0]} <span className="font-serif font-normal italic">with {vision.statement.split(" with ")[1]}</span>
              </p>
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

      <section id="values" className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Our Values" title="How we work." />
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

      <CTABand />
    </div>
  );
}
