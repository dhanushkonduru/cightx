import { CTABand } from "../components/CTABand";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../lib/usePageMeta";
import { Criteria } from "../sections/Criteria";
import { Technology } from "../sections/Technology";
import { Validation } from "../sections/Validation";

export default function TechnologyPage() {
  usePageMeta("Technology", "How CightX works: Random Forest land-cover mapping, a cellular-automaton neural network growth model, AHP scoring and road-network routing, behind three validation gates.");
  return (
    <>
      <PageHero
        eyebrow="Company · Technology"
        title={
          <>
            Machine learning where it helps. <span className="text-bone/45">Tests where it counts.</span>
          </>
        }
        lede="Satellite imagery in, ranked sites out — with a gate at every step."
        stats={[
          { v: "500 trees", k: "Random Forest land-cover model" },
          { v: "0.9405", k: "Growth model validation AUC" },
          { v: "21,978", k: "Road junctions routed" },
        ]}
      />
      <Technology />
      <Criteria />
      <Validation />
      <CTABand title="Want to check our working?" lede="We'll walk you through the method and the numbers." primary={{ label: "Contact us", to: "/contact" }} secondary={{ label: "Research", to: "/company/research" }} />
    </>
  );
}
