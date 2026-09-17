import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../lib/usePageMeta";
import { Research } from "../sections/Research";

export default function ResearchPage() {
  usePageMeta("Research", "Research at CightX: published methods, an invention disclosure and reproducible open-data pipelines behind our technology.");
  return (
    <>
      <PageHero
        eyebrow="Research"
        title={
          <>
            Research behind <span className="font-serif font-normal italic">our technology.</span>
          </>
        }
        lede="CightX technology starts as research: written up, built on open data, and reproducible from a clean checkout."
      />
      <Research />
      <CTABand title="Collaborate with us." lede="Researchers and planning institutions welcome." />
    </>
  );
}
