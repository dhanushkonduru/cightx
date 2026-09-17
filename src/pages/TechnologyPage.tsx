import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../lib/usePageMeta";
import { Technology } from "../sections/Technology";

export default function TechnologyPage() {
  usePageMeta("Technology", "How CightX works: satellite mapping, growth forecasting, scoring and ranking, with a validation gate at every step.");
  return (
    <>
      <PageHero
        eyebrow="Company · Technology"
        title={
          <>
            Machine learning where it helps. <span className="text-bone/45">Tests where it counts.</span>
          </>
        }
        lede="Satellite imagery in, ranked sites out, with a check at every step."
        stats={[
          { v: "4", k: "Stages" },
          { v: "3", k: "Validation gates" },
          { v: "30 m", k: "Analysis grid" },
        ]}
      />
      <Technology />
      <CTABand title="Want to see how it works on your city?" lede="We'll walk you through the method." primary={{ label: "Contact us", to: "/contact" }} secondary={{ label: "Research", to: "/company/research" }} />
    </>
  );
}
