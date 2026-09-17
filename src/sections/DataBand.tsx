import { openData } from "../content/site";

export function DataBand() {
  const row = [...openData, ...openData];
  return (
    <section aria-label="Open data the engine is built on" className="relative border-y border-bone/10 bg-ink-900">
      <div className="frame flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:gap-10">
        <p className="tick shrink-0 lg:w-[210px]">
          Built entirely on open Earth-observation data
          <span className="block text-bone/30 normal-case tracking-normal">Data sources, not partners</span>
        </p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="marquee flex w-max gap-12">
            {row.map((d, i) => (
              <li key={i} className="flex items-baseline gap-3 whitespace-nowrap" aria-hidden={i >= openData.length}>
                <span className="text-[15px] font-medium tracking-[-0.01em] text-bone/85">{d.name}</span>
                <span className="font-mono text-[10.5px] text-bone/35">
                  {d.org} · {d.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
