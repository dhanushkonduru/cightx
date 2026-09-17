import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { classification, hindcast, sensitivity } from "../content/site";
import { useInView } from "../lib/useInView";

export function Validation() {
  return (
    <section id="validation" className="relative border-t border-bone/10 bg-ink-900 py-24 lg:py-32">
      <div className="frame">
        <SectionHeader
          label="Validation"
          title={
            <>
              No forecast <span className="font-serif font-normal italic">without proof.</span>
            </>
          }
          lede="Every component is tested against evidence it has never seen before it can shape a recommendation."
        />

        <div className="mt-16 grid gap-px border border-bone/10 bg-bone/10 lg:grid-cols-12">
          <Gate1 />
          <Gate2 />
        </div>
        <Gate3 />
      </div>
    </section>
  );
}

function GateHead({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 rotate-45 items-center justify-center border border-mint">
          <span className="-rotate-45 font-mono text-[10px] text-bone">G{n}</span>
        </span>
        <h3 className="text-[19px] font-medium tracking-[-0.02em] text-bone">{title}</h3>
      </div>
      <span className="border border-mint/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mint">Passed</span>
    </div>
  );
}

function Gate1() {
  return (
    <Reveal className="bg-ink-900 p-7 sm:p-9 lg:col-span-5">
      <div>
        <GateHead n={1} title="Is the map right?" />
        <p className="mt-5 text-[15.5px] leading-relaxed text-bone/60">
          {classification.blocksWithheld} district blocks withheld, scored against {classification.products} independent products.
        </p>
        <dl className="mt-8 grid grid-cols-3 border-l border-t border-bone/10">
          {[
            ["Overall accuracy", classification.oa],
            ["Built-up F1", classification.f1],
            ["Kappa", classification.kappa],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-r border-bone/10 p-3 sm:p-4">
              <dt className="tick">{k}</dt>
              <dd className="mt-2 text-[clamp(15px,1.6vw,20px)] font-medium tracking-[-0.02em] text-bone">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[10.5px] text-bone/45">Photo-interpretation check: {classification.visualCheck}</p>
      </div>
    </Reveal>
  );
}

function Gate2() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const maxFom = 0.06;
  const rows = hindcast.models.filter((m) => m.id === "persistence" || m.id === "ca_ann");

  return (
    <Reveal className="bg-ink-900 p-7 sm:p-9 lg:col-span-7">
      <div>
        <GateHead n={2} title="Does the forecast beat no-change?" />
        <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-bone/60">
          Trained on 2013–19, asked to predict 2024. Figure of merit scores only the{" "}
          {hindcast.observedNewCells.toLocaleString("en-US")} cells that actually changed.
        </p>

        <figure ref={ref} className="mt-9">
          <figcaption className="flex items-baseline justify-between">
            <span className="tick">Figure of merit · 2024 hindcast</span>
            <span className="font-mono text-[10px] text-bone/35">axis 0 – 0.06</span>
          </figcaption>
          <ul className="mt-4 space-y-5">
            {rows.map((m, i) => (
              <li key={m.id} title={`${m.name}: ${m.hits} newly built cells correctly predicted`}>
                <div className="flex justify-between text-[13.5px]">
                  <span className={m.id === "ca_ann" ? "text-bone" : "text-bone/55"}>{m.name}</span>
                  <span className="font-mono tabular-nums text-bone/80">{m.fom.toFixed(3)}</span>
                </div>
                <div className="relative mt-2 h-[12px] bg-bone/[0.05]">
                  <div
                    className={`h-full rounded-r-[3px] transition-[width] duration-[1200ms] ease-out ${m.id === "ca_ann" ? "bg-laterite" : "bg-bone/25"}`}
                    style={{ width: inView ? `${(m.fom / maxFom) * 100}%` : "0%", transitionDelay: `${i * 120}ms` }}
                  />
                  {"range" in m && m.range && (
                    <div
                      className="absolute top-1/2 h-[18px] -translate-y-1/2 border-x border-laterite-soft transition-opacity delay-1000 duration-500"
                      style={{
                        left: `${(m.range[0] / maxFom) * 100}%`,
                        width: `${((m.range[1] - m.range[0]) / maxFom) * 100}%`,
                        opacity: inView ? 1 : 0,
                      }}
                    >
                      <div className="absolute inset-x-0 top-1/2 h-px bg-laterite-soft" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] leading-relaxed text-bone/50">
            Whiskers: {hindcast.replicates} independent training runs, 0.031–0.056.
          </p>
        </figure>

        <p className="mt-8 border-t border-bone/10 pt-6 text-[15px] leading-relaxed text-bone/70">
          <span className="text-mint">✓ </span>Beats the no-change map on every run, so the forecast earns its weight.
        </p>
      </div>
    </Reveal>
  );
}

function Gate3() {
  return (
    <Reveal className="mt-px grid gap-8 border border-t-0 border-bone/10 bg-ink-900 p-7 sm:p-9 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <GateHead n={3} title="Is the top pick robust?" />
        <p className="mt-5 text-[15.5px] leading-relaxed text-bone/60">Every setting we chose is swept and the ranking re-run.</p>
      </div>
      <div className="lg:col-span-7">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Sensitivity sweeps and whether the leading zone held first place</caption>
          <thead>
            <tr className="border-b border-bone/15">
              <th scope="col" className="tick pb-3 font-normal">Sweep</th>
              <th scope="col" className="tick pb-3 text-right font-normal">Zone 01 holds first</th>
            </tr>
          </thead>
          <tbody>
            {sensitivity.map((s) => (
              <tr key={s.sweep} className="border-b border-bone/10">
                <td className="py-3.5 pr-4 text-[15px] text-bone/80">{s.sweep}</td>
                <td className="py-3.5 text-right">
                  <span className="inline-flex items-center gap-2 font-mono text-[13px] text-bone">
                    <span className="h-1.5 w-1.5 bg-mint" />
                    {s.held}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
