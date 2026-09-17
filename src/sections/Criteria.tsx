import { useEffect, useRef, useState } from "react";
import { Reveal } from "../components/Reveal";
import { SectionHeader } from "../components/SectionHeader";
import { criteria } from "../content/site";
import { prefersReducedMotion, useInView } from "../lib/useInView";

export function Criteria() {
  const [active, setActive] = useState<string | null>(null);
  const [spread, setSpread] = useState(prefersReducedMotion() ? 1 : 0);
  const stackRef = useRef<HTMLDivElement>(null);
  const [listRef, listIn] = useInView<HTMLUListElement>();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = stackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the stack enters from below, 1 once its centre passes 45% of the viewport
      const p = (vh - (r.top + r.height / 2)) / (vh * 0.55);
      setSpread(Math.min(Math.max(p, 0), 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const layers = [...criteria.map((c) => ({ ...c, src: `criterion_${c.id}.png` })), { id: "s", name: "Composite suitability", weight: 100, from: "S = Σ wⱼ · Cⱼ", src: "suitability.png", forecast: false }];
  const ease = 1 - Math.pow(1 - spread, 3);

  return (
    <section id="scoring" className="relative overflow-hidden border-t border-bone/10 py-24 lg:py-32">
      <div className="frame">
        <SectionHeader
          label="Site Selection module · scoring"
          title={
            <>
              The forecast is a <span className="font-serif font-normal italic">weighted input.</span>
            </>
          }
          lede="Six measured layers, stacked into one suitability surface. Weights shown are the platform's hospital siting template."
        />

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-12">
          {/* weights */}
          <div className="lg:col-span-5">
            <ul ref={listRef} className="border-t border-bone/10" onMouseLeave={() => setActive(null)}>
              {criteria.map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 50} className="border-b border-bone/10">
                  <button
                    type="button"
                    className="group grid w-full grid-cols-[34px_1fr_auto] items-baseline gap-x-3 py-4 text-left"
                    onMouseEnter={() => setActive(c.id)}
                    onFocus={() => setActive(c.id)}
                    onClick={() => setActive((a) => (a === c.id ? null : c.id))}
                    aria-pressed={active === c.id}
                  >
                    <span className="font-mono text-[11px] uppercase text-bone/40">{c.id}</span>
                    <span>
                      <span className={`block text-[17px] font-medium tracking-[-0.02em] transition-colors ${active && active !== c.id ? "text-bone/40" : "text-bone"}`}>
                        {c.name}
                        {c.forecast && <span className="ml-2 align-middle font-mono text-[9.5px] uppercase tracking-[0.12em] text-laterite">forecast</span>}
                      </span>
                      <span className="mt-1 block font-mono text-[10.5px] text-bone/40">{c.from}</span>
                    </span>
                    <span className="font-mono text-[15px] tabular-nums text-bone">{c.weight.toFixed(1)}%</span>
                    <span className="col-span-2 col-start-2 mt-3 h-[3px] bg-bone/[0.06]">
                      <span
                        className={`block h-full transition-[width] duration-1000 ${c.forecast ? "bg-laterite" : "bg-bone/60"}`}
                        style={{ width: listIn ? `${(c.weight / 34.1) * 100}%` : "0%", transitionDelay: `${300 + i * 80}ms` }}
                      />
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
            <Reveal className="mt-8 grid grid-cols-3 border-l border-t border-bone/10">
              {[
                ["Consistency ratio", "0.0117"],
                ["Acceptable below", "0.10"],
                ["λmax", "6.0723"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-r border-bone/10 p-4">
                  <p className="tick">{k}</p>
                  <p className="mt-2 font-mono text-[17px] text-bone">{v}</p>
                </div>
              ))}
            </Reveal>
            <p className="mt-5 text-[14.5px] leading-relaxed text-bone/50">
              Re-run under three alternative weightings to test the judgement itself.
            </p>
          </div>

          {/* exploded stack */}
          <div className="lg:col-span-7">
            <div ref={stackRef} className="relative mx-auto h-[560px] w-full max-w-[560px] sm:h-[680px]" style={{ perspective: "2200px" }} aria-label="Six criteria layers combining into one suitability surface" role="img">
              {layers.map((l, i) => {
                const n = layers.length - 1;
                const gap = 14 + ease * 62;
                const y = (i - n / 2) * gap;
                const dim = active && active !== l.id && l.id !== "s";
                const lifted = active === l.id;
                return (
                  <div
                    key={l.id}
                    className="absolute left-[60%] top-1/2 w-[58%] sm:left-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translateY(${y}px) rotateX(60deg) rotateZ(-38deg) translateZ(${lifted ? 26 : 0}px)`,
                      transition: "transform .6s cubic-bezier(.2,.7,.1,1), opacity .4s",
                      zIndex: layers.length - i,
                      opacity: dim ? 0.28 : 1,
                    }}
                  >
                    <div
                      className={`relative aspect-[730/744] overflow-hidden border ${l.id === "s" ? "border-mint/60" : l.forecast ? "border-laterite/70" : "border-bone/25"}`}
                      style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,.9)" }}
                    >
                      <img src={`/maps/${l.src}`} alt="" loading="lazy" decoding="async" width={730} height={744} className="h-full w-full" />
                      {l.id !== "s" && <div className="absolute inset-0 bg-ink/15" />}
                    </div>
                    <span
                      className={`absolute -left-1 top-0 -translate-x-full whitespace-nowrap pr-3 font-mono text-[10px] uppercase tracking-[0.1em] ${
                        l.id === "s" ? "text-mint" : l.forecast ? "text-laterite" : "text-bone/60"
                      }`}
                      style={{ opacity: 0.35 + ease * 0.65 }}
                    >
                      {l.id === "s" ? "S · composite" : `${l.id} · ${l.weight}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
