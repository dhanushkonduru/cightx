import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { journey } from "../content/catalog";
import { team } from "../content/site";
import { usePageMeta } from "../lib/usePageMeta";

export default function About() {
  usePageMeta("About Us", "CightX is a decision intelligence company for the built environment, founded at VIT Vellore.");
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            About <span className="font-serif font-normal italic">CightX.</span>
          </>
        }
        lede="A decision intelligence company for the built environment, founded at VIT Vellore."
        layers={[
          { src: "built_2024.png", on: true, opacity: 0.55 },
          { src: "projected_2035.png", on: true },
        ]}
      />

      <section className="py-24 lg:py-28">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div>
              <p className="eyebrow">Who we are</p>
              <p className="mt-6 text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-[1.25] tracking-[-0.025em] text-bone">
                Every building starts with <span className="font-serif font-normal italic">where.</span>{" "}
                <span className="text-bone/50">We make that answer measurable, forward-looking and checkable.</span>
              </p>
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Our journey</p>
            <ol className="mt-6 border-l border-bone/15">
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
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink-900 py-24 lg:py-28">
        <div className="frame">
          <SectionHeader label="Team" title="The people behind it." />
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
          <p className="mt-5 font-mono text-[10.5px] text-bone/40">Integrated M.Tech Software Engineering · Vellore Institute of Technology</p>
        </div>
      </section>

      <CTABand title="Work with us." lede="Pilot cities, research partners and early customers welcome." />
    </>
  );
}
