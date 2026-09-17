// Services, products and company pages. Copy is kept short on purpose:
// a headline, one sentence, and facts that come from site.ts or the audit files.

import type { Layer } from "../components/MapStage";

export type Service = {
  slug: string;
  name: string;
  short: string; // nav + cards
  headline: string;
  lede: string;
  layers: Layer[];
  overlay?: "zones" | "facilities";
  stats: { v: string; k: string }[];
  deliverables: { t: string; d: string }[];
  informs: string[];
};

export const services: Service[] = [
  {
    slug: "urban-growth-forecasting",
    name: "Urban Growth Forecasting",
    short: "Where a city has grown, and where it grows next.",
    headline: "See where the city is heading.",
    lede: "A decade of satellite record turned into a tested forecast of built-up growth to 2030 and 2035.",
    layers: [
      { src: "built_2024.png", on: true, opacity: 0.45 },
      { src: "growth_prob_2030.png", on: true, smooth: true },
      { src: "projected_2035.png", on: true },
    ],
    stats: [
      { v: "34.26 → 40.61 km²", k: "Vellore built-up, 2013–2024" },
      { v: "47.47 km²", k: "Projected by 2035, central" },
      { v: "6 / 6", k: "Hindcast runs beating no-change" },
    ],
    deliverables: [
      { t: "Growth history", d: "Built-up land for every observed year." },
      { t: "2030 & 2035 projections", d: "Low, central and high extents." },
      { t: "Conversion probability", d: "Calibrated, cell by cell." },
      { t: "Hindcast report", d: "Tested against a no-change map." },
    ],
    informs: ["Master-plan base maps", "Road and utility sequencing", "Land reservation ahead of growth"],
  },
  {
    slug: "site-selection",
    name: "Site Suitability & Selection",
    short: "A ranked shortlist of real sites, with reasons.",
    headline: "Pick the site before the brief.",
    lede: "Every 30 m cell scored on published criteria, grouped into buildable zones and ranked.",
    layers: [{ src: "suitability.png", on: true, smooth: true, opacity: 0.85 }],
    overlay: "zones",
    stats: [
      { v: "+14,417", k: "Residents within 15 min, Zone 01" },
      { v: "0.0117", k: "AHP consistency ratio" },
      { v: "7 / 7", k: "Growth weights where Zone 01 holds" },
    ],
    deliverables: [
      { t: "Suitability surface", d: "Six weighted criteria at 30 m." },
      { t: "Ranked zones", d: "Contiguous, buildable, road-accessible." },
      { t: "Sensitivity sweeps", d: "Which picks survive other choices." },
      { t: "Programme scoring", d: "Joint coverage for multi-site plans." },
    ],
    informs: ["Land shortlists for feasibility", "Architect and planner briefs", "Multi-site programme sizing"],
  },
  {
    slug: "accessibility-analysis",
    name: "Accessibility & Service Gaps",
    short: "Drive time to care, measured on real roads.",
    headline: "Measure access in minutes.",
    lede: "Travel time along the actual road network, weighted by where people live.",
    layers: [{ src: "travel_time.png", on: true, smooth: true, opacity: 0.9 }],
    overlay: "facilities",
    stats: [
      { v: "91.67%", k: "Vellore residents within 15 min" },
      { v: "1.38×", k: "Road vs straight-line distance" },
      { v: "4,613 km", k: "Road network routed" },
    ],
    deliverables: [
      { t: "Drive-time surface", d: "Minutes to the nearest facility." },
      { t: "Population coverage", d: "At 10, 15 and 20 minutes." },
      { t: "Facility inventory", d: "Classified by capability." },
      { t: "Gain per site", d: "Residents reached by each option." },
    ],
    informs: ["Service-gap identification", "Health and education equity", "Catchment planning"],
  },
  {
    slug: "land-cover-mapping",
    name: "Land-Cover Mapping",
    short: "Built-up maps from free imagery, independently checked.",
    headline: "Map the city as it is built.",
    lede: "Built-up land classified from Landsat and scored against independent global products.",
    layers: [
      { src: "built_2013.png", on: true, opacity: 0.7 },
      { src: "change_2013_2024.png", on: true },
    ],
    stats: [
      { v: "0.85–0.91", k: "Overall accuracy" },
      { v: "3", k: "Independent reference products" },
      { v: "97.4%", k: "Window observable, all years" },
    ],
    deliverables: [
      { t: "Built-up maps", d: "30 m, per year." },
      { t: "Change detection", d: "What was built, and when." },
      { t: "Accuracy assessment", d: "On withheld spatial blocks." },
      { t: "Area tables", d: "On one consistent mask." },
    ],
    informs: ["Unrecorded growth audits", "Ward and zoning reviews", "Baseline for every other service"],
  },
];

export type Product = {
  slug: string;
  name: string;
  short: string;
  status: "Live" | "Planned";
  headline: string;
  lede: string;
  questions: string[];
  audience: string[];
  uses: string[]; // service slugs
  layers: Layer[];
};

export const products: Product[] = [
  {
    slug: "infrastructure-intelligence",
    name: "Infrastructure Intelligence",
    short: "Where hospitals, schools and civic facilities should go.",
    status: "Live",
    headline: "Site public infrastructure for the city ahead.",
    lede: "Our flagship. Running on Vellore, Tamil Nadu — hindcast, swept and ranked end to end.",
    questions: ["Where should the next hospital go?", "Which areas are underserved today?", "Will the site still fit in 2035?"],
    audience: ["Municipal corporations", "State planning bodies", "Hospital and education groups"],
    uses: ["urban-growth-forecasting", "site-selection", "accessibility-analysis", "land-cover-mapping"],
    layers: [{ src: "suitability.png", on: true, smooth: true, opacity: 0.8 }],
  },
  {
    slug: "commercial-intelligence",
    name: "Commercial Intelligence",
    short: "Where a hotel, office, warehouse or store belongs.",
    status: "Planned",
    headline: "Open where customers will be.",
    lede: "The same engine, scored on commercial criteria for each sector.",
    questions: ["Where will demand be when the lease matures?", "Which corridors are about to grow?", "How do candidate sites compare?"],
    audience: ["Developers", "Retail and logistics groups", "Hospitality chains"],
    uses: ["urban-growth-forecasting", "site-selection"],
    layers: [{ src: "built_2024.png", on: true, opacity: 0.5 }, { src: "projected_2035.png", on: true }],
  },
  {
    slug: "risk-intelligence",
    name: "Risk Intelligence",
    short: "Which zones a hazard would hit hardest.",
    status: "Planned",
    headline: "Know exposure before the event.",
    lede: "Growth forecasts overlaid with hazard layers, so exposure is known in advance.",
    questions: ["Where is new building moving into risk?", "Which assets are most exposed?", "Where should mitigation go first?"],
    audience: ["Disaster management agencies", "Insurers", "Civic bodies"],
    uses: ["urban-growth-forecasting", "land-cover-mapping"],
    layers: [{ src: "built_2024.png", on: true, opacity: 0.5 }, { src: "growth_prob_2030.png", on: true, smooth: true }],
  },
  {
    slug: "environmental-intelligence",
    name: "Environmental Intelligence",
    short: "Where growth is closing in on water and green cover.",
    status: "Planned",
    headline: "Evidence a policy can stand on.",
    lede: "Change detection pointed at green cover and water bodies.",
    questions: ["Where is green cover disappearing?", "Which water bodies face encroachment?", "How fast is it happening?"],
    audience: ["Environmental agencies", "Urban local bodies", "Researchers"],
    uses: ["land-cover-mapping", "urban-growth-forecasting"],
    layers: [{ src: "built_2013.png", on: true, opacity: 0.6 }, { src: "change_2013_2024.png", on: true }],
  },
  {
    slug: "governance-intelligence",
    name: "Governance Intelligence",
    short: "Where people actually are, so services reach them.",
    status: "Planned",
    headline: "Put services where people are.",
    lede: "Population and access, measured between censuses.",
    questions: ["Which communities are furthest from services?", "Where has population outgrown provision?", "Where should outreach go first?"],
    audience: ["State departments", "District administrations", "Public health programmes"],
    uses: ["accessibility-analysis", "urban-growth-forecasting"],
    layers: [{ src: "travel_time.png", on: true, smooth: true, opacity: 0.85 }],
  },
];

export const companyPages = [
  { to: "/company/mission#mission", name: "Our Mission", short: "Infrastructure where people are going." },
  { to: "/company/mission#vision", name: "Our Vision", short: "Every city decision backed by a tested forecast." },
  { to: "/company/mission#values", name: "Our Values", short: "How we work." },
  { to: "/company/technology", name: "Technology", short: "The engine and its validation gates." },
  { to: "/company/research", name: "Research", short: "Manuscript, disclosure, open methods." },
  { to: "/privacy-policy", name: "Privacy Policy", short: "How we handle your information." },
];

export const vision = {
  statement: "Every city decides where to build with a tested view of where it is going.",
  pillars: [
    { t: "Beyond one city", d: "From Vellore to Tier-2 and Tier-3 cities across India." },
    { t: "Beyond one facility", d: "Hospitals first, then schools, commerce, risk and environment." },
    { t: "Beyond one decision", d: "A living forecast, refreshed as the satellite record grows." },
  ],
};

export const values = [
  { t: "No forecast without proof", d: "A projection must beat a no-change map before it counts." },
  { t: "Show the working", d: "Weights and formulas are published with every result." },
  { t: "Open by default", d: "Built on free data anyone can re-check." },
  { t: "Every site explained", d: "Each ranking comes with the reason behind it." },
];

export const journey = [
  { t: "Prototype", d: "Growth model and siting engine built for Vellore." },
  { t: "Independent validation", d: "Maps scored against three global reference products." },
  { t: "Validation gates", d: "Hindcast and sensitivity testing built into the engine." },
  { t: "Research outputs", d: "Manuscript and invention disclosure prepared." },
  { t: "Pilot cities", d: "Next: municipal pilots in Tamil Nadu.", next: true },
];

export const findService = (slug?: string) => services.find((s) => s.slug === slug);
export const findProduct = (slug?: string) => products.find((p) => p.slug === slug);
