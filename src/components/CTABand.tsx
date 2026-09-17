import { Link } from "react-router-dom";
import { Arrow } from "./Arrow";
import { Reveal } from "./Reveal";

export function CTABand({
  title = "Bring us a city and a question.",
  lede = "Tell us the facility and the horizon. We'll tell you what the evidence supports.",
  primary = { label: "Contact us", to: "/contact" },
  secondary = { label: "How it works", to: "/company/technology" },
}: {
  title?: string;
  lede?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="relative overflow-hidden border-t border-bone/10 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.2]" aria-hidden>
        <img src="/maps/built_2024.png" alt="" className="map-img absolute left-1/2 top-1/2 w-[1000px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-40 [mask-image:radial-gradient(circle,#000_20%,transparent_62%)]" />
        <img src="/maps/projected_2035.png" alt="" className="map-img absolute left-1/2 top-1/2 w-[1000px] max-w-none -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,#000_20%,transparent_62%)]" />
      </div>
      <Reveal className="frame relative text-center">
        <div>
          <h2 className="display mx-auto max-w-4xl text-[clamp(2.2rem,5vw,4.4rem)]">{title}</h2>
          <p className="lede mx-auto mt-5 max-w-lg">{lede}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to={primary.to} className="btn btn-primary">
              <span className="btn-dot" />
              {primary.label}
            </Link>
            <Link to={secondary.to} className="btn btn-ghost">
              {secondary.label}
              <Arrow />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
