import { MapStage, ZoneMarks, useVectors, type Layer } from "../components/MapStage";
import { Reveal } from "../components/Reveal";
import { planning } from "../content/site";

const STRIP: { step: string; title: string; note: string; layers: Layer[]; zones?: boolean }[] = [
  { step: "Before", title: "The city in 2013", note: "34.26 km² built-up", layers: [{ src: "built_2013.png", on: true }] },
  { step: "Analysis", title: "What changed to 2024", note: "+6.35 km², off the record", layers: [{ src: "built_2013.png", on: true, opacity: 0.6 }, { src: "change_2013_2024.png", on: true }] },
  { step: "Prediction", title: "Where it goes by 2035", note: "47.47 km², central scenario", layers: [{ src: "built_2024.png", on: true, opacity: 0.6 }, { src: "projected_2035.png", on: true }] },
  { step: "Planning insight", title: "Where to build", note: "5 ranked candidate zones", layers: [{ src: "suitability.png", on: true, smooth: true, opacity: 0.85 }], zones: true },
];

function layersFor(key: string): Layer[] {
  switch (key) {
    case "change":
      return [{ src: "built_2013.png", on: true, opacity: 0.55 }, { src: "change_2013_2024.png", on: true }];
    case "growth":
      return [{ src: "built_2024.png", on: true, opacity: 0.3 }, { src: "growth_prob_2030.png", on: true, smooth: true }];
    case "travel":
      return [{ src: "travel_time.png", on: true, smooth: true, opacity: 0.9 }];
    default:
      return [{ src: "suitability.png", on: true, smooth: true, opacity: 0.75 }];
  }
}

export function PlanningStrip() {
  const v = useVectors();
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6">
      {STRIP.map((s, i) => (
        <Reveal key={s.step} delay={i * 110}>
          <div className="mb-3 flex items-center gap-2">
            <span className={`font-mono text-[10.5px] uppercase tracking-[0.14em] ${i === 3 ? "text-laterite" : "text-bone/50"}`}>
              {String(i + 1).padStart(2, "0")} · {s.step}
            </span>
            {i < 3 && <span className="hidden h-px flex-1 bg-gradient-to-r from-bone/25 to-transparent lg:block" />}
          </div>
          <MapStage alt={`${s.step}: ${s.title}`} layers={s.layers} showScale={false} overlay={s.zones && v ? <ZoneMarks v={v} showPaths={false} /> : undefined} />
          <p className="mt-3 text-[15px] font-medium tracking-[-0.01em] text-bone">{s.title}</p>
          <p className="font-mono text-[10.5px] text-bone/45">{s.note}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function PlanningRows() {
  const v = useVectors();
  return (
    <div>
      <div className="hidden grid-cols-12 gap-6 border-b border-bone/15 pb-3 lg:grid">
        <span className="tick col-span-3">Output</span>
        <span className="tick col-span-3">Tells a planner</span>
        <span className="tick col-span-3">Informs</span>
        <span className="tick col-span-3">Why it matters</span>
      </div>
      {planning.map((p, i) => (
        <Reveal key={p.output} className="grid gap-5 border-b border-bone/10 py-7 lg:grid-cols-12 lg:gap-6">
          <div className="flex gap-4 lg:col-span-3">
            <div className="w-[84px] shrink-0">
              <MapStage alt={p.output} layers={layersFor(p.layer)} showScale={false} overlay={p.layer === "zones" && v ? <ZoneMarks v={v} /> : undefined} />
            </div>
            <div>
              <span className="font-mono text-[10.5px] text-laterite">0{i + 1}</span>
              <h3 className="mt-1 text-[17px] font-medium leading-snug tracking-[-0.02em] text-bone">{p.output}</h3>
            </div>
          </div>
          <Cell label="Tells a planner" text={p.tells} />
          <Cell label="Informs" text={p.decision} strong />
          <Cell label="Why it matters" text={p.matters} muted />
        </Reveal>
      ))}
    </div>
  );
}

function Cell({ label, text, strong, muted }: { label: string; text: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="lg:col-span-3">
      <p className="tick mb-1.5 lg:hidden">{label}</p>
      <p className={`text-[15.5px] leading-relaxed ${strong ? "text-bone" : muted ? "text-bone/50" : "text-bone/70"}`}>{text}</p>
    </div>
  );
}
