import type { ReactNode } from "react";
import { MapStage, ZoneMarks, useVectors, type Layer } from "./MapStage";

export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  layers,
  overlay,
  stats,
  badge,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  actions?: ReactNode;
  layers?: Layer[];
  overlay?: "zones" | "facilities";
  stats?: { v: string; k: string }[];
  badge?: ReactNode;
}) {
  const v = useVectors();
  return (
    <section className="relative overflow-hidden border-b border-bone/10 pb-16 pt-32 lg:pb-24 lg:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="frame relative grid items-center gap-12 lg:grid-cols-12">
        <div className={layers ? "lg:col-span-7" : "lg:col-span-9"} style={{ animation: "fadeUp .9s cubic-bezier(.2,.7,.1,1) both" }}>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-bone/15 bg-ink/40 py-1.5 pl-2 pr-3.5">
              <span className="h-1.5 w-1.5 bg-laterite" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-bone/75">{eyebrow}</span>
            </span>
            {badge}
          </div>
          <h1 className="display text-[clamp(2.4rem,5vw,4.6rem)]">{title}</h1>
          <p className="lede mt-6 max-w-xl">{lede}</p>
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {layers && (
          <div className="lg:col-span-5" style={{ animation: "fadeUp 1.1s .15s cubic-bezier(.2,.7,.1,1) both" }}>
            <div className="mx-auto max-w-[300px] [perspective:1600px] sm:max-w-[380px] lg:max-w-[460px]">
              <div className="transition-transform duration-700 [transform:rotateX(18deg)_rotateZ(-6deg)] hover:[transform:rotateX(8deg)_rotateZ(-2deg)]">
                <MapStage
                  eager
                  alt=""
                  showScale={false}
                  layers={layers}
                  overlay={
                    v && overlay === "zones" ? (
                      <ZoneMarks v={v} />
                    ) : v && overlay === "facilities" ? (
                      v.facilities.map((f, i) => <path key={i} d={`M${f.x - 5} ${f.y}h10M${f.x} ${f.y - 5}v10`} stroke="#fff" strokeWidth={1.8} />)
                    ) : undefined
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {stats && (
        <div className="frame relative mt-14 lg:mt-20">
          <dl className="grid border-l border-t border-bone/10 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.k} className="border-b border-r border-bone/10 px-5 py-5">
                <dd className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium tracking-[-0.03em] text-bone">{s.v}</dd>
                <dt className="mt-1 font-mono text-[10.5px] text-bone/45">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
