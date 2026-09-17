// Every number on the site lives here, next to the file it was read from.
// Paths are relative to the repository root. Nothing below is estimated.

export const company = {
  name: "CightX",
  descriptor: "Geospatial & predictive AI",
  tagline: "Building intelligence for the cities ahead.",
  email: "cightx.official@gmail.com",
  location: "VIT Vellore, Tamil Nadu, India",
};


// data/processed/audit/lulc_area_table.json, growth_scenarios.json (central)
export const epochs = [
  { year: 2013, km2: 34.26, kind: "observed", source: "Landsat 8 · 31 Oct 2013" },
  { year: 2019, km2: 35.74, kind: "observed", source: "Landsat 8 · 17 Nov 2019" },
  { year: 2024, km2: 40.61, kind: "observed", source: "Landsat 9 · Nov–Dec 2024 composite" },
  { year: 2030, km2: 44.57, kind: "projected", source: "CA-ANN · central scenario" },
  { year: 2035, km2: 47.47, kind: "projected", source: "CA-ANN · central scenario" },
] as const;

export const openData = [
  { name: "Landsat 8 / 9", org: "USGS", role: "Imagery" },
  { name: "GHS-BUILT-S R2023A", org: "EC JRC", role: "Reference labels" },
  { name: "WorldCover v200", org: "ESA", role: "Reference labels" },
  { name: "Land Cover v02", org: "Esri / Impact Observatory", role: "Reference labels" },
  { name: "Global Surface Water", org: "EC JRC", role: "Water" },
  { name: "WorldPop 2020", org: "Univ. of Southampton", role: "Population" },
  { name: "OpenStreetMap", org: "OSM contributors", role: "Roads, facilities" },
];


export type Stage = {
  id: string;
  verb: string;
  title: string;
  plain: string;
  output: string;
  method: string;
  specs: { k: string; v: string }[];
  layer: string;
  gate?: { name: string; result: string };
};

// pitch/CightX_How_It_Works.md, README.md, data/processed/audit/*.json
export const stages: Stage[] = [
  {
    id: "see",
    verb: "See",
    title: "Read the city from orbit",
    plain: "Satellite imagery is turned into a map of built-up land for every year on record, one 30-metre square at a time.",
    output: "Built-up map for each year",
    method: "Random Forest classification",
    specs: [
      { k: "Input", v: "Landsat imagery" },
      { k: "Grid", v: "30 m cells" },
      { k: "Model", v: "Random Forest" },
      { k: "Output", v: "Yearly built-up maps" },
    ],
    layer: "built_2024",
    gate: { name: "Gate 1 · accuracy check", result: "Checked against independent reference maps" },
  },
  {
    id: "predict",
    verb: "Predict",
    title: "Learn how it grows, run it forward",
    plain: "The engine learns which land turns into buildings and why, then runs the city forward year by year.",
    output: "Where growth is likely over the next 5 to 10 years",
    method: "Neural network + cellular automaton",
    specs: [
      { k: "Drivers", v: "Roads, density, water, services" },
      { k: "Model", v: "Neural network" },
      { k: "Horizon", v: "5–10 years" },
      { k: "Growth rate", v: "Measured, never assumed" },
    ],
    layer: "growth_prob_2030",
    gate: { name: "Gate 2 · hindcast", result: "Must beat a no-change forecast on past years" },
  },
  {
    id: "score",
    verb: "Score",
    title: "Weigh the forecast against today",
    plain: "Each location is scored on the criteria that matter for the question, with the forecast as one of them.",
    output: "A suitability score for every cell",
    method: "Analytic Hierarchy Process",
    specs: [
      { k: "Criteria", v: "Set per use case" },
      { k: "Weights", v: "Published" },
      { k: "Consistency", v: "Checked" },
      { k: "Output", v: "Suitability surface" },
    ],
    layer: "suitability",
  },
  {
    id: "rank",
    verb: "Rank",
    title: "Turn scores into places",
    plain: "The best land becomes real candidate sites, ranked, and measured by how many people each one serves.",
    output: "A ranked shortlist, each site with its reasons",
    method: "Zone extraction + road routing",
    specs: [
      { k: "Sites", v: "Contiguous, buildable land" },
      { k: "Access", v: "Real road network" },
      { k: "Coverage", v: "Weighted by population" },
      { k: "Output", v: "Ranked shortlist" },
    ],
    layer: "zones",
    gate: { name: "Gate 3 · stress test", result: "Top picks re-checked under changed assumptions" },
  },
];

// data/processed/ahp/ahp_weights.json via README AHP table (hospital siting template)
export const criteria = [
  { id: "c1", name: "Population density", weight: 34.1, from: "WorldPop 2020, 450 m moving mean" },
  { id: "c2", name: "Service gap", weight: 20.5, from: "Network travel time to inpatient care" },
  { id: "c3", name: "Growth alignment", weight: 20.5, from: "Distance to 2030–35 growth hotspots", forecast: true },
  { id: "c4", name: "Road access", weight: 12.3, from: "Distance to OSM road network" },
  { id: "c5", name: "Water proximity", weight: 7.6, from: "JRC Global Surface Water buffer" },
  { id: "c6", name: "Land availability", weight: 5.0, from: "Non-built, non-water cells" },
];

// data/processed/audit/coverage_population_weighted.json, baseline_vs_prospective.json
export const impact = {
  population: 824409,
  baselineCoverage15: 91.67,
  site1Residents: 14417, // 1.7488 pp of 824,409
  jointResidents: 20585, // 2.497 pp
  summedResidents: 33141, // 4.02 pp, the naive sum
  overstatementPct: 61,
  jointCoverage15: 94.17,
  leaderShiftM: 78,
  zonesReplaced: 2,
  growthAlignment: { without: 0.046, with: 0.184 },
  distanceFromProvision: { without: 3.94, with: 4.62 },
  coverageWithout: 94.06,
};

export const vellore = {
  areaKm2: 489,
  bbox: "79.02–79.22°E · 12.82–13.02°N",
  observableKm2: 476.16,
  observablePct: 97.4,
  residents: 824409,
  inpatient: 80,
  healthcarePoints: 144,
  years: 11,
  medianTravelMin: 11.87,
  p90TravelMin: 34.14,
};

// data/processed/sites/candidate_sites.gpkg, coverage_population_weighted.json
export const zonesTable = [
  { rank: 1, area: 0.941, suit: 0.404, facility: 5.61, road: 5, gain: 1.75 },
  { rank: 2, area: 0.673, suit: 0.399, facility: 5.3, road: 107, gain: 0.16 },
  { rank: 3, area: 1.879, suit: 0.41, facility: 3.32, road: 6, gain: 0.32 },
  { rank: 4, area: 0.279, suit: 0.391, facility: 6.39, road: 33, gain: 1.58 },
  { rank: 5, area: 0.589, suit: 0.422, facility: 2.49, road: 33, gain: 0.21 },
];

export const planning = [
  {
    output: "Built-up change, 2013–2024",
    layer: "change",
    tells: "Where the district grew: 6.35 km², off the record.",
    decision: "Refresh base maps before plans are drawn.",
    matters: "Plans start from the city as built.",
  },
  {
    output: "Growth probability, 2030",
    layer: "growth",
    tells: "Which land converts next, as a calibrated probability.",
    decision: "Sequence roads and utilities ahead of growth.",
    matters: "Leading growth costs less than chasing it.",
  },
  {
    output: "Drive time to inpatient care",
    layer: "travel",
    tells: "Real drive times to care: median 11.9 min.",
    decision: "Find gaps a straight-line radius hides.",
    matters: "Equity is measured in minutes.",
  },
  {
    output: "Ranked candidate zones",
    layer: "zones",
    tells: "Buildable land, ranked by a published formula.",
    decision: "Shortlist land before the design brief.",
    matters: "The site is the hardest thing to change later.",
  },
];



export const team = [
  { name: "Dhanush Konduru", role: "Co-founder · Machine learning", note: "Machine learning, geospatial AI and validation." },
  { name: "Anusha B", role: "Co-founder · Platform", note: "Product engineering and platform." },
  { name: "Prof. Sushanth S J", role: "Mentor", note: "Sustainable architecture, VIT Vellore." },
];
