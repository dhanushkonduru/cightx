// Company, technology and product content. The hierarchy is deliberate:
// CightX (company) → technology it builds → products built on that technology.
// Keep product language out of company copy, and company language out of product copy.

import type { Layer } from "../components/MapStage";

/* ---------------------------------------------------------------- company */

export const companyIdentity = {
  kind: "Geospatial & predictive AI company",
  headline: "Building intelligence for the cities ahead.",
  summary:
    "CightX is a deep-tech company building AI, satellite-data and simulation systems that show how cities are changing, and what to build as they do.",
  focus: "Urban intelligence",
  focusLine: "Cities change every year. We build the systems that see that change, forecast it, and turn it into decisions.",
};

/* ------------------------------------------------------------- technology */

export type Technology = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  lede: string;
  layers: Layer[];
  overlay?: "zones" | "facilities";
  stats: { v: string; k: string }[];
  builds: { t: string; d: string }[];
};

export const technologies: Technology[] = [
  {
    slug: "earth-observation",
    name: "Earth Observation",
    short: "Satellite data systems that turn raw imagery into reliable maps of change.",
    headline: "Satellite data, made dependable.",
    lede: "We build pipelines that turn years of free satellite imagery into consistent, independently checked maps of how land is used.",
    layers: [
      { src: "built_2013.png", on: true, opacity: 0.7 },
      { src: "change_2013_2024.png", on: true },
    ],
    stats: [
      { v: "30 m", k: "Mapping resolution" },
      { v: "Multi-year", k: "Consistent time series" },
      { v: "Independent", k: "Reference labels" },
    ],
    builds: [
      { t: "Imagery pipelines", d: "Scenes selected, cloud-masked and composited automatically." },
      { t: "Built-up mapping", d: "Land classified on labels the model never learned from." },
      { t: "Change detection", d: "What was built, where and when, on one grid." },
      { t: "Accuracy assessment", d: "Every map scored on areas held back from training." },
    ],
  },
  {
    slug: "geospatial-ai",
    name: "Geospatial AI",
    short: "Machine learning that learns how places change, not just what they look like.",
    headline: "Machine learning that understands place.",
    lede: "Our models learn from spatial context around every location, so they capture why land changes and not only how it appears from above.",
    layers: [
      { src: "built_2024.png", on: true, opacity: 0.3 },
      { src: "growth_prob_2030.png", on: true, smooth: true },
    ],
    stats: [
      { v: "Context-aware", k: "Neighbourhood features" },
      { v: "Calibrated", k: "Probabilities you can read" },
      { v: "Benchmarked", k: "Against simpler baselines" },
    ],
    builds: [
      { t: "Spatial features", d: "Texture and context around each cell, not only its colour." },
      { t: "Learned transitions", d: "Neural networks that learn which land converts, and why." },
      { t: "Calibration", d: "A score of 0.8 means roughly 80%, checked on real outcomes." },
      { t: "Model transparency", d: "Feature importance and baselines reported with every model." },
    ],
  },
  {
    slug: "predictive-simulation",
    name: "Predictive Simulation",
    short: "Simulation engines that run a city forward in time.",
    headline: "Simulate the city before it grows.",
    lede: "Our simulation engine runs a city forward year by year, redrawing the map at every step, to show where growth is heading.",
    layers: [
      { src: "built_2024.png", on: true, opacity: 0.55 },
      { src: "projected_2035.png", on: true },
    ],
    stats: [
      { v: "5–10 years", k: "Forecast horizon" },
      { v: "Scenarios", k: "Low, central and high" },
      { v: "Hindcast-tested", k: "Before it is trusted" },
    ],
    builds: [
      { t: "Cellular automata", d: "The map updates every simulated year, so each step shapes the next." },
      { t: "Measured growth", d: "How much a city grows comes from its record, never an assumption." },
      { t: "Scenario ranges", d: "Low, central and high futures instead of a single guess." },
      { t: "Hindcast testing", d: "Models must predict years we already know before they are used." },
    ],
  },
  {
    slug: "decision-systems",
    name: "Spatial Decision Systems",
    short: "Systems that turn forecasts into ranked, explainable decisions.",
    headline: "Decisions you can explain.",
    lede: "We combine forecasts with today's conditions into ranked options, with every weight, route and assumption on the table.",
    layers: [{ src: "suitability.png", on: true, smooth: true, opacity: 0.85 }],
    overlay: "zones",
    stats: [
      { v: "Road-network", k: "Travel-time routing" },
      { v: "Population-weighted", k: "Coverage measures" },
      { v: "Stress-tested", k: "Rankings" },
    ],
    builds: [
      { t: "Multi-criteria scoring", d: "Published weights, checked for internal consistency." },
      { t: "Network accessibility", d: "Travel time along real roads, weighted by where people live." },
      { t: "Site ranking", d: "Contiguous, buildable options ranked by a published formula." },
      { t: "Stress testing", d: "Rankings re-run under changed assumptions." },
    ],
  },
];

/* --------------------------------------------------------------- products */

export const flagship = {
  slug: "urban-growth-platform",
  name: "Urban Growth Platform",
  fullName: "CightX Urban Growth Platform",
  status: "Live" as const,
  tagline: "Predict where cities will grow before they do.",
  short: "Forecasts urban growth and ranks where new infrastructure should go.",
  lede: "The platform reads a city's satellite record, forecasts where it will grow, and ranks the best sites for new hospitals, schools and public services.",
  modules: [
    {
      t: "Growth Forecasting",
      d: "Built-up history and growth forecasts for the next 5 to 10 years.",
      layers: [{ src: "built_2024.png", on: true, opacity: 0.45 }, { src: "projected_2035.png", on: true }] as Layer[],
    },
    {
      t: "Site Selection",
      d: "Ranked candidate sites, each with the reasons it ranked.",
      layers: [{ src: "suitability.png", on: true, smooth: true, opacity: 0.85 }] as Layer[],
      zones: true,
    },
    {
      t: "Accessibility Analysis",
      d: "Drive time to services, weighted by where people live.",
      layers: [{ src: "travel_time.png", on: true, smooth: true, opacity: 0.9 }] as Layer[],
    },
    {
      t: "Land-Cover Mapping",
      d: "Yearly built-up maps from satellite imagery.",
      layers: [{ src: "built_2013.png", on: true, opacity: 0.7 }, { src: "change_2013_2024.png", on: true }] as Layer[],
    },
  ],
  questions: ["Where should the next hospital go?", "Which areas are underserved today?", "Will the site still fit in 2035?"],
  audience: ["City corporations and planning departments", "Hospital and education groups", "Infrastructure agencies"],
  poweredBy: ["earth-observation", "geospatial-ai", "predictive-simulation", "decision-systems"],
};

export type PlannedProduct = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  lede: string;
  questions: string[];
  audience: string[];
  poweredBy: string[];
  layers: Layer[];
};

export const roadmap: PlannedProduct[] = [
  {
    slug: "commercial-intelligence",
    name: "Commercial Intelligence",
    short: "Location decisions for offices, stores, hotels and warehouses.",
    headline: "Open where customers will be.",
    lede: "A planned CightX product that applies our forecasting and ranking technology to commercial location decisions.",
    questions: ["Where will demand be when the lease matures?", "Which corridors are about to grow?", "How do candidate sites compare?"],
    audience: ["Developers", "Retail and logistics groups", "Hospitality chains"],
    poweredBy: ["predictive-simulation", "decision-systems"],
    layers: [{ src: "built_2024.png", on: true, opacity: 0.5 }, { src: "projected_2035.png", on: true }],
  },
  {
    slug: "risk-intelligence",
    name: "Risk Intelligence",
    short: "Exposure of growing cities to hazards, known in advance.",
    headline: "Know exposure before the event.",
    lede: "A planned CightX product that combines growth forecasts with hazard layers to show where exposure is rising.",
    questions: ["Where is new building moving into risk?", "Which assets are most exposed?", "Where should mitigation go first?"],
    audience: ["Disaster management agencies", "Insurers", "Civic bodies"],
    poweredBy: ["earth-observation", "predictive-simulation"],
    layers: [{ src: "built_2024.png", on: true, opacity: 0.5 }, { src: "growth_prob_2030.png", on: true, smooth: true }],
  },
  {
    slug: "environmental-intelligence",
    name: "Environmental Intelligence",
    short: "Where growth is closing in on green cover and water.",
    headline: "Evidence a policy can stand on.",
    lede: "A planned CightX product that points our change-detection technology at green cover and water bodies.",
    questions: ["Where is green cover disappearing?", "Which water bodies face encroachment?", "How fast is it happening?"],
    audience: ["Environmental agencies", "Urban local bodies", "Researchers"],
    poweredBy: ["earth-observation", "geospatial-ai"],
    layers: [{ src: "built_2013.png", on: true, opacity: 0.6 }, { src: "change_2013_2024.png", on: true }],
  },
  {
    slug: "governance-intelligence",
    name: "Governance Intelligence",
    short: "Where people actually are, so services reach them.",
    headline: "Put services where people are.",
    lede: "A planned CightX product that measures population and access between censuses.",
    questions: ["Which communities are furthest from services?", "Where has population outgrown provision?", "Where should outreach go first?"],
    audience: ["State departments", "District administrations", "Public health programmes"],
    poweredBy: ["decision-systems", "geospatial-ai"],
    layers: [{ src: "travel_time.png", on: true, smooth: true, opacity: 0.85 }],
  },
];

/* ---------------------------------------------------------- company pages */

export const mission = {
  statement: "Give every city the intelligence to build for the people it will have, not only the people it had.",
  gap: [
    { v: "2011", d: "The last census most plans still rely on." },
    { v: "Decades", d: "How long a building stays where it is put." },
    { v: "Every year", d: "How often a growing city changes shape." },
  ],
};

export const vision = {
  statement: "Every city decides what to build with a tested view of where it is going.",
  pillars: [
    { t: "Beyond one city", d: "From one district to Tier-2 and Tier-3 cities across India." },
    { t: "Beyond one product", d: "One technology base, powering products for infrastructure, commerce, risk and environment." },
    { t: "Beyond one decision", d: "Living forecasts, refreshed as the satellite record grows." },
  ],
};

export const values = [
  { t: "No forecast without proof", d: "A projection must beat a no-change map before it counts." },
  { t: "Show the working", d: "Weights and formulas are published with every result." },
  { t: "Open by default", d: "Built on open data anyone can re-check." },
  { t: "Explainable by design", d: "Every recommendation comes with the reason behind it." },
];

export const journey = [
  { t: "Research foundation", d: "Growth modelling and siting methods developed at VIT Vellore." },
  { t: "Technology base", d: "Earth observation, geospatial AI, simulation and decision systems built and validated." },
  { t: "Flagship product", d: "The Urban Growth Platform, tested end to end on a real district." },
  { t: "Research outputs", d: "Manuscript and invention disclosure prepared." },
  { t: "Pilot cities", d: "Next: municipal pilots in Tamil Nadu.", next: true },
];

export const findTechnology = (slug?: string) => technologies.find((t) => t.slug === slug);
export const findPlanned = (slug?: string) => roadmap.find((p) => p.slug === slug);
