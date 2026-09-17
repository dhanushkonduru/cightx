// Every number on the site lives here, next to the file it was read from.
// Paths are relative to the repository root. Nothing below is estimated.

export const company = {
  name: "CightX",
  descriptor: "Decision intelligence for the built environment",
  tagline: "Where to build next, before the city gets there.",
  email: "dhanush.konduru2022@vitstudent.ac.in",
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
    plain:
      "Every 30-metre square of the district is described by 21 measurements and its neighbourhood, then classified as built-up or not, for 2013, 2019 and 2024.",
    output: "Built-up map for each epoch, on one common valid-cell mask",
    method: "Pooled Random Forest",
    specs: [
      { k: "Trees", v: "500" },
      { k: "Features / cell", v: "21" },
      { k: "Training cells", v: "36,000" },
      { k: "Threshold", v: "0.70, calibrated" },
    ],
    layer: "built_2024",
    gate: { name: "Gate 1 · independent accuracy", result: "OA 0.85–0.91 · built-up F1 0.83–0.91" },
  },
  {
    id: "predict",
    verb: "Predict",
    title: "Learn how it grows, run it forward",
    plain:
      "A neural network learns which land converts and why. A cellular automaton redraws the map each simulated year. How much growth comes only from what the city actually did.",
    output: "Projected built-up land for 2030 and 2035, with low / central / high extents",
    method: "Cellular automaton + neural network",
    specs: [
      { k: "Drivers", v: "7" },
      { k: "Network", v: "7 → 128 → 64 → 32 → 1" },
      { k: "Validation AUC", v: "0.9405" },
      { k: "Rate 2013–24", v: "0.131% / yr, measured" },
    ],
    layer: "growth_prob_2030",
    gate: { name: "Gate 2 · hindcast vs no-change", result: "FoM 0.042 vs 0 · beats persistence on 6 of 6 runs" },
  },
  {
    id: "score",
    verb: "Score",
    title: "Weigh the forecast against today",
    plain:
      "Six criteria — population, drive time to care, growth alignment, road access, water proximity and free land — are combined with weights that are published and checked for consistency.",
    output: "A suitability score for every 30-metre cell",
    method: "Analytic Hierarchy Process",
    specs: [
      { k: "Criteria", v: "6" },
      { k: "Consistency ratio", v: "0.0117" },
      { k: "Growth weight", v: "20.5%" },
      { k: "Alt. weightings", v: "3, carried through" },
    ],
    layer: "suitability",
  },
  {
    id: "rank",
    verb: "Rank",
    title: "Turn scores into places",
    plain:
      "The best-scoring land becomes contiguous candidate zones, ranked by a published formula, and scored on how many residents each brings within a real drive time.",
    output: "Ranked candidate zones, each with the reason it ranked",
    method: "Zone extraction + road-network routing",
    specs: [
      { k: "Road graph", v: "21,978 nodes · 4,613 km" },
      { k: "Routing", v: "Dijkstra, multi-source" },
      { k: "Coverage", v: "Population-weighted" },
      { k: "Detour ratio", v: "1.383 × straight line" },
    ],
    layer: "zones",
    gate: { name: "Gate 3 · sensitivity sweeps", result: "Leading zone holds first in every growth-weight, threshold and drive-time sweep" },
  },
];

// data/processed/ahp/ahp_weights.json via README AHP table
export const criteria = [
  { id: "c1", name: "Population density", weight: 34.1, from: "WorldPop 2020, 450 m moving mean" },
  { id: "c2", name: "Service gap", weight: 20.5, from: "Network travel time to inpatient care" },
  { id: "c3", name: "Growth alignment", weight: 20.5, from: "Distance to CA-ANN 2030–35 hotspots", forecast: true },
  { id: "c4", name: "Road access", weight: 12.3, from: "Distance to OSM road network" },
  { id: "c5", name: "Water proximity", weight: 7.6, from: "JRC Global Surface Water buffer" },
  { id: "c6", name: "Land availability", weight: 5.0, from: "Non-built, non-water cells" },
];

// data/processed/audit/hindcast_2024.json, hindcast_replicates.json
export const hindcast = {
  observedNewCells: 9031,
  models: [
    { id: "persistence", name: "“Nothing changes”", oa: 0.9761, fom: 0.0, hits: 0 },
    { id: "ca_ann", name: "CA-ANN (ours)", oa: 0.9751, fom: 0.0422, hits: 421, range: [0.0313, 0.056] as [number, number] },
  ],
  replicates: 6,
};

// data/processed/lulc/accuracy_assessment.json via README and REVISION_RESPONSE.md
export const classification = {
  oa: "0.85–0.91",
  kappa: "0.71–0.82",
  f1: "0.83–0.91",
  products: 3,
  blocksWithheld: "8 of 25",
  visualCheck: "0.88–0.90 on 56–58 photo-interpreted points",
};

// data/processed/audit/sensitivity_summary.json, How_It_Works §6
export const sensitivity = [
  { sweep: "Growth weight 0–30%", held: "7 / 7" },
  { sweep: "Candidate threshold P75–P90", held: "4 / 4" },
  { sweep: "Drive-time standard 10 / 15 / 20 min", held: "3 / 3" },
  { sweep: "Equal and operations-first weights", held: "2 / 2" },
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
  { name: "Dhanush Konduru", role: "Co-founder · Machine learning", note: "Classification, growth modelling and validation." },
  { name: "Anusha B", role: "Co-founder · Platform", note: "The map-based planner and delivery platform." },
  { name: "Prof. Sushanth S J", role: "Mentor", note: "Sustainable architecture, VIT Vellore." },
];
