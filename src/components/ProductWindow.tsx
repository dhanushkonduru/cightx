import { useState } from "react";
import { flagship } from "../content/catalog";
import { MapStage, ZoneMarks, useVectors } from "./MapStage";
import { Mark } from "./Logo";

/** The flagship shown as an application window: this is software CightX ships. */
export function ProductWindow({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);
  const v = useVectors();
  const mod = flagship.modules[active];

  return (
    <div className={`overflow-hidden rounded-[10px] border border-bone/15 bg-ink-900 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="flex items-center justify-between border-b border-bone/10 bg-ink-800/80 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-bone/15" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px] text-bone/60">
          <Mark size={12} />
          CightX · {flagship.name}
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mint">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          Live
        </span>
      </div>
      <div className="grid sm:grid-cols-[180px_1fr]">
        <div className="flex gap-1 overflow-x-auto border-b border-bone/10 p-2 sm:flex-col sm:border-b-0 sm:border-r" role="tablist" aria-label="Platform modules">
          <p className="hidden px-2 pb-1 pt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-bone/35 sm:block">Modules</p>
          {flagship.modules.map((m, i) => (
            <button
              key={m.t}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`whitespace-nowrap rounded-[6px] px-2.5 py-2 text-left text-[12.5px] transition-colors ${
                active === i ? "bg-bone/[0.08] text-bone" : "text-bone/50 hover:text-bone/80"
              }`}
            >
              {m.t}
            </button>
          ))}
        </div>
        <div className="p-3">
          <MapStage
            alt={`${flagship.name}: ${mod.t}`}
            showScale={false}
            layers={flagship.modules.flatMap((m, i) => m.layers.map((l) => ({ ...l, on: i === active })))}
            overlay={v && "zones" in mod && mod.zones ? <ZoneMarks v={v} /> : undefined}
          />
          <p className="mt-2.5 px-1 text-[12.5px] text-bone/55">{mod.d}</p>
        </div>
      </div>
    </div>
  );
}
