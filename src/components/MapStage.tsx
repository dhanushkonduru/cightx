import { useEffect, useState, type ReactNode } from "react";

// Map layers are exported at the analysis grid: 730 × 744 cells of 30 m.
export const GRID_W = 730;
export const GRID_H = 744;
const KM5 = (5000 / 30 / GRID_W) * 100; // 5 km as a share of width

export type Vectors = {
  zones: { rank: number; path: string; cx: number; cy: number; area_km2: number; dist_hosp_km: number; dist_road_m: number; mean_suitability: number }[];
  facilities: { x: number; y: number; tier: string }[];
  roads: string;
  model_a_top5: { rank: number; cx: number; cy: number }[];
  model_b_top5: { rank: number; cx: number; cy: number }[];
};

let cache: Promise<Vectors> | null = null;
export function useVectors() {
  const [v, setV] = useState<Vectors | null>(null);
  useEffect(() => {
    cache ??= fetch("/data/vellore_vectors.json").then((r) => r.json());
    let alive = true;
    cache.then((d) => alive && setV(d));
    return () => {
      alive = false;
    };
  }, []);
  return v;
}

export type Layer = { src: string; on: boolean; opacity?: number; smooth?: boolean };

export function MapStage({
  layers,
  overlay,
  label,
  caption,
  className = "",
  showScale = true,
  alt,
  eager = false,
}: {
  layers: Layer[];
  overlay?: ReactNode;
  label?: ReactNode;
  caption?: ReactNode;
  className?: string;
  showScale?: boolean;
  alt: string;
  eager?: boolean;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div className="panel marks relative overflow-hidden bg-ink" style={{ aspectRatio: `${GRID_W} / ${GRID_H}` }} role="img" aria-label={alt}>
        <img src="/maps/base.png" alt="" loading={eager ? "eager" : "lazy"} decoding="async" width={GRID_W} height={GRID_H} className="map-img absolute inset-0 h-full w-full" />
        {layers.map((l, i) => (
          <img
            key={`${i}-${l.src}`}
            src={`/maps/${l.src}`}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            width={GRID_W}
            height={GRID_H}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${l.smooth ? "" : "map-img"}`}
            style={{ opacity: l.on ? l.opacity ?? 1 : 0 }}
          />
        ))}
        {overlay && (
          <svg viewBox={`0 0 ${GRID_W} ${GRID_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            {overlay}
          </svg>
        )}
        {label && <div className="absolute left-3 top-3">{label}</div>}
        {showScale && (
          <>
            <div className="pointer-events-none absolute bottom-[26px] left-3 h-[5px] border-x border-b border-bone/70" style={{ width: `${KM5}%` }} />
            <div className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[9.5px] text-bone/60">5 km</div>
            <div className="pointer-events-none absolute bottom-2.5 right-3 flex flex-col items-center font-mono text-[9.5px] text-bone/60">
              <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden>
                <path d="M4 0l4 10-4-2.5L0 10z" fill="currentColor" />
              </svg>
              N
            </div>
          </>
        )}
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[10.5px] leading-relaxed text-bone/45">{caption}</figcaption>}
    </figure>
  );
}

// k shrinks marks when a map is drawn much larger than its 730-cell grid
export function ZoneMarks({ v, active, showPaths = true, k = 1 }: { v: Vectors; active?: number | null; showPaths?: boolean; k?: number }) {
  return (
    <g>
      {showPaths &&
        v.zones.map((z) => (
          <path key={`p${z.rank}`} d={z.path} fill="#E4602F" fillOpacity={0.55} stroke="#F0B37E" strokeWidth={1.2 * k} />
        ))}
      {v.zones.map((z) => {
        const on = active == null || active === z.rank;
        // zone 01 sits just west of zone 04, so its label goes on the left
        const left = z.cx > GRID_W - 70 || (z.rank === 1 && z.cx > 60);
        return (
          <g key={z.rank} transform={`translate(${z.cx} ${z.cy})`} opacity={on ? 1 : 0.35} style={{ transition: "opacity .4s" }}>
            <circle r={16 * k} fill="none" stroke="#E4602F" strokeWidth={1.4 * k} />
            <circle r={3 * k} fill="#E4602F" />
            <g transform={`translate(${(left ? -22 : 22) * k} ${(z.cy < 30 ? 22 : -4) * k})`}>
              <text
                textAnchor={left ? "end" : "start"}
                className="fill-bone font-mono"
                style={{ fontSize: 17 * k, paintOrder: "stroke", stroke: "#07080A", strokeWidth: 4 * k }}
              >
                {String(z.rank).padStart(2, "0")}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
