import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../lib/usePageMeta";
import { Research } from "../sections/Research";

export default function ResearchPage() {
  usePageMeta("Research", "CightX research: a manuscript on growth-aware infrastructure siting, an invention disclosure, and a fully reproducible open-data pipeline.");
  return (
    <>
      <PageHero
        eyebrow="Company · Research"
        title={
          <>
            Every number, <span className="font-serif font-normal italic">re-derivable.</span>
          </>
        }
        lede="Our method is written up, open-data, and rebuilds from a clean checkout."
      />
      <Research />
      <CTABand title="Collaborate with us." lede="Researchers and planning institutions welcome." />
    </>
  );
}
