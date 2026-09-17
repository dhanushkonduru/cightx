import { Link } from "react-router-dom";
import type { Product, Service } from "../content/catalog";
import { Arrow } from "./Arrow";
import { MapStage, ZoneMarks, useVectors } from "./MapStage";

export function StatusTag({ status }: { status: "Live" | "Planned" }) {
  const live = status === "Live";
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
        live ? "border-mint/35 text-mint" : "border-dashed border-bone/25 text-bone/50"
      }`}
    >
      <span className={`h-1.5 w-1.5 ${live ? "bg-mint" : "border border-bone/40"}`} />
      {live ? "Live · Vellore" : "Planned"}
    </span>
  );
}

export function ServiceCard({ s, index }: { s: Service; index: number }) {
  const v = useVectors();
  return (
    <Link to={`/services/${s.slug}`} className="group relative flex h-full flex-col bg-ink p-6 transition-colors duration-500 hover:bg-ink-800 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-laterite">0{index + 1}</span>
        <Arrow className="text-bone/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-laterite" />
      </div>
      <div className="mt-6 overflow-hidden">
        <div className="transition-transform duration-700 group-hover:scale-[1.04]">
          <MapStage
            alt=""
            showScale={false}
            layers={s.layers}
            overlay={v && s.overlay === "zones" ? <ZoneMarks v={v} showPaths={false} /> : undefined}
          />
        </div>
      </div>
      <h3 className="mt-6 text-[20px] font-medium leading-tight tracking-[-0.025em] text-bone">{s.name}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-bone/55">{s.short}</p>
      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-laterite transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
  );
}

export function ProductTile({ p }: { p: Product }) {
  return (
    <Link to={`/products/${p.slug}`} className="group relative flex h-full flex-col bg-ink p-6 transition-colors duration-500 hover:bg-ink-800 sm:p-7">
      <div className="flex items-center justify-between">
        <StatusTag status={p.status} />
        <Arrow className="text-bone/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-laterite" />
      </div>
      <h3 className="mt-10 text-[20px] font-medium leading-tight tracking-[-0.025em] text-bone">{p.name}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-bone/50">{p.short}</p>
    </Link>
  );
}
