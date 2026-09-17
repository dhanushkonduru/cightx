import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import type { Shared } from "./HeroScene";
import { Arrow } from "../components/Arrow";
import { Link } from "react-router-dom";
import { ProductBadge } from "../components/Cards";
import { companyIdentity, flagship } from "../content/catalog";
import { prefersReducedMotion } from "../lib/useInView";
import { timeline } from "./timeline";

const HeroScene = lazy(() => import("./HeroScene"));

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useCanRender3D() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (nav.connection?.saveData) return false;
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
    return webglAvailable();
  }, []);
}

export function Hero() {
  const can3D = useCanRender3D();
  const reduced = useMemo(prefersReducedMotion, []);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const section = useRef<HTMLElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const shared = useMemo<Shared>(
    () => ({ pointer: { x: 0, y: 0, touched: false }, pointerWorld: { x: 999, y: 0, z: 999 }, scroll: 0, reduced }),
    [reduced],
  );

  useEffect(() => {
    if (reduced) {
      timeline.auto = false;
      timeline.set(5);
    }
  }, [reduced]);

  useEffect(() => {
    if (ready && !reduced) timeline.start();
    return () => timeline.stop();
  }, [ready, reduced]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting);
      if (e.isIntersecting && ready && !reduced) timeline.start();
      else timeline.stop();
    });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      shared.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      shared.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      shared.pointer.touched = true;
    };
    const onLeave = () => {
      shared.pointer.x = 0;
      shared.pointer.y = 0;
      shared.pointer.touched = false;
    };
    const onScroll = () => {
      shared.scroll = Math.min(Math.max(window.scrollY / (el.offsetHeight || 1), 0), 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [shared, ready, reduced]);

  return (
    <section
      id="top"
      ref={section}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-label="CightX, building intelligence for the cities ahead"
    >
      {/* scene */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[64svh] lg:inset-0 lg:h-auto">
        <StaticFallback visible={!can3D || !ready} />
        {can3D && (
          <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
            <Suspense fallback={null}>
              <HeroScene shared={shared} onReady={() => setReady(true)} labelRefs={labelRefs} active={active} />
            </Suspense>
          </div>
        )}
        {/* legibility scrims */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.92)_0%,rgba(7,8,10,0.55)_38%,rgba(7,8,10,0)_62%)] max-lg:bg-[linear-gradient(180deg,rgba(7,8,10,0)_45%,rgba(7,8,10,0.75)_78%,#07080A_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />
      </div>

      <div className="frame relative mt-auto grid gap-10 pb-12 pt-[44svh] lg:grid-cols-12 lg:items-end lg:pb-20 lg:pt-10">
        <div className="lg:col-span-7">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-bone/15 bg-ink/40 py-1.5 pl-2 pr-3.5 backdrop-blur">
            <span className="h-1.5 w-1.5 bg-laterite" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-bone/75">{companyIdentity.kind}</span>
          </div>
          <h1 className="display text-[clamp(2.35rem,5.4vw,5.2rem)]">
            Building intelligence
            <br />
            <span className="text-bone/45">for the cities</span>{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-bone">ahead.</span>
          </h1>
          <p className="lede mt-7 max-w-[36rem]">{companyIdentity.summary}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/technology" className="btn btn-primary">
              <span className="btn-dot" />
              Our technology
            </Link>
            <Link to="/company" className="btn btn-ghost">
              About CightX
              <Arrow />
            </Link>
          </div>
        </div>

        {/* flagship product, clearly separate from the company statement */}
        <div className="lg:col-span-5 lg:justify-self-end">
          <Link
            to={`/products/${flagship.slug}`}
            className="group block w-full max-w-[400px] border border-bone/15 bg-ink/70 p-5 backdrop-blur-md transition-colors hover:border-bone/35 lg:w-[380px]"
          >
            <div className="flex items-center justify-between">
              <ProductBadge label="Flagship product" />
              <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Live
              </span>
            </div>
            <p className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.03em] text-bone">{flagship.fullName}</p>
            <p className="mt-1.5 text-[14.5px] text-bone/60">{flagship.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] text-laterite">
              Explore the platform
              <Arrow className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Shown while WebGL loads, and instead of it on devices that cannot run it. */
function StaticFallback({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    >
      <div className="absolute left-1/2 top-[32%] w-[min(130vw,900px)] -translate-x-1/2 -translate-y-1/2 [perspective:1400px] lg:left-[64%] lg:top-1/2 lg:w-[min(62vw,980px)]">
        <div className="relative aspect-[730/744] [transform:rotateX(56deg)_rotateZ(-22deg)]">
          <img src="/maps/base.png" alt="" className="map-img absolute inset-0 h-full w-full opacity-60" />
          <img src="/maps/built_2024.png" alt="" className="map-img absolute inset-0 h-full w-full" />
          <img src="/maps/projected_2035.png" alt="" className="map-img absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 [mask-image:radial-gradient(circle,transparent_40%,#000_72%)] bg-ink" />
        </div>
      </div>
    </div>
  );
}
