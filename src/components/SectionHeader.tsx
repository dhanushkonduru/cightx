import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  label,
  title,
  lede,
  align = "split",
}: {
  index?: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "split" | "stack";
}) {
  return (
    <div className={align === "split" ? "grid gap-8 lg:grid-cols-12 lg:gap-10" : "max-w-3xl"}>
      <Reveal className={align === "split" ? "lg:col-span-7" : ""}>
        <div className="mb-6 flex items-center gap-3">
          {index ? <span className="font-mono text-[11px] text-laterite">{index}</span> : <span className="h-1.5 w-1.5 bg-laterite" />}
          <span className="h-px w-8 bg-bone/20" />
          <span className="eyebrow">{label}</span>
        </div>
        <h2 className="h2">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={120} className={align === "split" ? "self-end lg:col-span-5" : "mt-6"}>
          <p className="lede">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
