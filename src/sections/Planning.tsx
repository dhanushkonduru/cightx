import { MapStage, ZoneMarks, useVectors, type Layer } from "../components/MapStage";
import { Reveal } from "../components/Reveal";
import { planning } from "../content/site";


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
