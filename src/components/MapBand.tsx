import type { ReactNode } from "react";
import { GRID_H, GRID_W, ZoneMarks, useVectors, type Layer } from "./MapStage";

/**
 * A Vellore map laid out as a tilted ground plane that runs the full width of
 * the screen, echoing the hero, with content laid over it inside the page frame.
 */
export function MapBand({
  layers,
  overlay,
  children,
  className = "min-h-[520px] lg:min-h-[640px]",
}: {
  layers: Layer[];
  overlay?: "zones" | "facilities";
  focus?: "top" | "center" | "bottom";
  children: ReactNode;
  className?: string;
}) {
  const v = useVectors();

  return (
    <section className="relative isolate overflow-hidden border-y border-bone/10 bg-ink">
      <div className="absolute inset-0 -z-10 [perspective:1400px]" aria-hidden>
        <div
          className="absolute left-[64%] top-[62%] aspect-square w-[max(1100px,110%)] max-md:left-1/2 max-md:top-[30%]"
          style={{ transform: "translate(-50%, -50%) rotateX(56deg) rotateZ(38deg)" }}
        >
          <div className="map-drift absolute inset-0 [mask-image:radial-gradient(closest-side,#000_62%,transparent_100%)]">
            <img src="/maps/base.png" alt="" loading="lazy" decoding="async" className="map-img absolute inset-0 h-full w-full" />
            {layers.map((l, i) => (
              <img
                key={`${i}-${l.src}`}
                src={`/maps/${l.src}`}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full ${l.smooth ? "" : "map-img"}`}
                style={{ opacity: l.opacity ?? 1 }}
              />
            ))}
            {v && overlay && (
              <svg viewBox={`0 0 ${GRID_W} ${GRID_H}`} className="absolute inset-0 h-full w-full">
                {overlay === "zones" ? (
                  <ZoneMarks v={v} k={0.8} />
                ) : (
                  v.facilities.map((f, i) => <path key={i} d={`M${f.x - 4} ${f.y}h8M${f.x} ${f.y - 4}v8`} stroke="#fff" strokeWidth={1.6} />)
                )}
              </svg>
            )}
          </div>
        </div>
        {/* legibility: dark on the text side, soft fades top and bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.92)_0%,rgba(7,8,10,0.7)_32%,rgba(7,8,10,0)_60%)] max-md:bg-[linear-gradient(180deg,rgba(7,8,10,0)_20%,rgba(7,8,10,0.9)_65%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
      </div>
      <div className={`frame relative flex items-center py-20 max-md:items-end max-md:pt-64 ${className}`}>{children}</div>
    </section>
  );
}
