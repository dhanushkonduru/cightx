import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";

const WORK = [
  {
    kind: "Manuscript",
    status: "Prepared for peer-review submission",
    title: "Integrating Urban Growth into Sustainable Hospital Siting: A Geospatial Decision-Support Framework with Independent Validation from Vellore, India",
    meta: "Konduru, B, S J · Vellore Institute of Technology · targeted at Frontiers in Sustainable Cities",
  },
  {
    kind: "Invention disclosure",
    status: "Disclosure prepared",
    title: "No Forecast Without Proof: Predictor-Independence Auditing and Hindcast Skill Gating of Earth-Observation-Derived Siting Criteria",
    meta: "The gating apparatus between learned models and the scoring engine, independent of facility type",
  },
];

const REPRO = [
  ["Open inputs", "Every dataset fetched by script. No licences."],
  ["Audited numbers", "Figures read from pipeline audit files."],
  ["Fixed seeds", "Test samples can be rebuilt exactly."],
  ["Repeat-run tested", "Forecast skill measured across 6 training runs."],
];

export function Research() {
  return (
    <section id="research" className="relative py-24 lg:py-32">
      <div className="frame">
        <SectionHeader
          label="Publications"
          title={
            <>
              Built as research first.
            </>
          }
        />

        <div className="mt-16 grid gap-px border border-bone/10 bg-bone/10 lg:grid-cols-2">
          {WORK.map((w, i) => (
            <Reveal key={w.kind} delay={i * 90} className="relative flex flex-col bg-ink p-7 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="eyebrow text-bone/70">{w.kind}</span>
                <span className="font-mono text-[10.5px] text-bone/45">{w.status}</span>
              </div>
              <h3 className="mt-10 font-serif text-[clamp(1.55rem,2.5vw,2.15rem)] leading-[1.15] text-bone">“{w.title}”</h3>
              <p className="mt-auto pt-8 font-mono text-[10.5px] leading-relaxed text-bone/45">{w.meta}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-px grid gap-px border border-t-0 border-bone/10 bg-bone/10 lg:grid-cols-12">
          <Reveal className="bg-ink p-7 sm:p-10 lg:col-span-12">
            <p className="eyebrow">Reproducibility</p>
            <dl className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {REPRO.map(([k, v]) => (
                <div key={k}>
                  <dt className="flex items-center gap-2 text-[16px] font-medium tracking-[-0.01em] text-bone">
                    <span className="h-1.5 w-1.5 bg-mint" />
                    {k}
                  </dt>
                  <dd className="mt-2 text-[14.5px] leading-relaxed text-bone/55">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
