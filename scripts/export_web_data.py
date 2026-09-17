"""Export the Vellore pipeline outputs as web assets for the CightX site.

Everything the site draws comes from here: the hero's 3D field, the map layers,
the zone outlines. Nothing is typed in by hand, so the site cannot drift from
the rasters and audit files the paper quotes.

The site lives in its own folder, separate from the analysis code. Point the
script at the pipeline repository and run it with that repository's venv:

    CIGHTX_PIPELINE=/path/to/hospital_site_vellore \
        /path/to/hospital_site_vellore/venv/bin/python scripts/export_web_data.py

CIGHTX_PIPELINE defaults to a sibling folder named hospital_site_vellore.
"""

import json
import os
from pathlib import Path

import geopandas as gpd
import numpy as np
import rasterio
from PIL import Image

SITE = Path(__file__).resolve().parents[1]
PIPELINE = Path(os.environ.get("CIGHTX_PIPELINE", SITE.parent / "hospital_site_vellore")).resolve()
P = PIPELINE / "data" / "processed"
if not P.is_dir():
    raise SystemExit(f"pipeline outputs not found at {P}; set CIGHTX_PIPELINE")
OUT = SITE / "public" / "data"
MAPS = SITE / "public" / "maps"
OUT.mkdir(parents=True, exist_ok=True)
MAPS.mkdir(parents=True, exist_ok=True)

BLOCK = 4  # 30 m cells aggregated to 120 m blocks for the hero field

INK = (7, 8, 10)
GROUND = (17, 20, 24)
WATER = (40, 74, 86)
BONE = (230, 225, 213)
MINT = (132, 208, 191)  # observed new growth
LATERITE = (228, 96, 47)


def read(rel):
    with rasterio.open(P / rel) as src:
        a = src.read(1).astype("float32")
        nod = src.nodata
        transform = src.transform
    if nod is not None:
        a[a == nod] = np.nan
    return a, transform


def rgba(shape, colour=(0, 0, 0), alpha=0):
    img = np.zeros(shape + (4,), dtype=np.uint8)
    img[..., :3] = colour
    img[..., 3] = alpha
    return img


def save(img, name, colours=None):
    im = Image.fromarray(img, "RGBA")
    if colours:
        im = im.quantize(colours, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
    im.save(MAPS / name, optimize=True)


def ramp(values, stops):
    """Piecewise-linear colour ramp; stops are (t, (r, g, b, a))."""
    v = np.clip(np.nan_to_num(values, nan=0.0), 0, 1)
    out = np.zeros(v.shape + (4,), dtype=np.float32)
    for (t0, c0), (t1, c1) in zip(stops[:-1], stops[1:]):
        m = (v >= t0) & (v <= t1)
        k = ((v - t0) / max(t1 - t0, 1e-9))[m][:, None]
        out[m] = np.array(c0) * (1 - k) + np.array(c1) * k
    return out.astype(np.uint8)


# ----------------------------------------------------------------- land cover
lulc = {}
for year, rel in [(2013, "lulc/lulc_2013.tif"), (2019, "lulc/lulc_2019.tif"),
                  (2024, "lulc/lulc_2024.tif"), (2030, "ca_ann/lulc_predicted_2030.tif"),
                  (2035, "ca_ann/lulc_predicted_2035.tif")]:
    a, transform = read(rel)
    lulc[year] = np.nan_to_num(a, nan=0).astype(np.uint8)

H, W = lulc[2013].shape
built = {y: (a == 1) for y, a in lulc.items()}
water, _ = read("lulc/water_mask.tif")
water = np.nan_to_num(water, nan=0) == 1
valid_all = (lulc[2013] > 0) & (lulc[2019] > 0) & (lulc[2024] > 0)

# Observed epochs carry their own gaps; the site shows each epoch as observed
# and keeps projected cells cumulative on top of 2024.
growth, _ = read("ca_ann/growth_prob_2030.tif")
suit, _ = read("ahp/suitability_score.tif")
travel, _ = read("demand/travel_time_minutes.tif")

# ----------------------------------------------------------- hero field (bin)
gh, gw = H // BLOCK, W // BLOCK


def block_mean(a):
    a = a[: gh * BLOCK, : gw * BLOCK].astype("float32")
    return np.nanmean(a.reshape(gh, BLOCK, gw, BLOCK), axis=(1, 3))


# Keep a cell built once it is built so the hero never "unbuilds" a block
# because of a cloud gap or a hysteresis flip in a single epoch.
cum = np.zeros((H, W), dtype=bool)
layers = []
for y in (2013, 2019, 2024, 2030, 2035):
    cum = cum | built[y]
    layers.append(block_mean(cum))

suit_n = (suit - np.nanmin(suit)) / (np.nanmax(suit) - np.nanmin(suit))
fields = layers + [block_mean(np.nan_to_num(growth, nan=0)),
                   block_mean(np.nan_to_num(suit_n, nan=0)),
                   block_mean(water.astype("float32"))]
stack = np.stack([np.clip(np.nan_to_num(f) * 255, 0, 255).astype(np.uint8) for f in fields], axis=-1)
stack.tofile(OUT / "vellore_field.bin")

# ------------------------------------------------------------------ map layers
# base: ground, water, no-data
base = rgba((H, W), INK, 255)
base[valid_all] = (*GROUND, 255)
base[water] = (*WATER, 255)
save(base, "base.png", colours=8)

for y in (2013, 2019, 2024):
    img = rgba((H, W))
    img[built[y]] = (*BONE, 255)
    save(img, f"built_{y}.png", colours=4)

# observed change 2013 -> 2024, net new cells
img = rgba((H, W))
img[built[2024] & ~built[2013] & valid_all] = (*MINT, 255)
save(img, "change_2013_2024.png", colours=4)

for y in (2030, 2035):
    img = rgba((H, W))
    img[built[y] & ~built[2024]] = (*LATERITE, 255)
    save(img, f"projected_{y}.png", colours=4)

g = np.nan_to_num(growth, nan=0)
g[built[2024]] = 0
save(ramp(g, [(0.0, (228, 96, 47, 0)), (0.35, (120, 40, 20, 0)),
              (0.6, (160, 55, 25, 150)), (0.85, (228, 96, 47, 230)),
              (1.0, (255, 196, 140, 255))]), "growth_prob_2030.png", colours=64)

save(ramp(suit_n, [(0.0, (12, 22, 26, 255)), (0.45, (22, 70, 72, 255)),
                   (0.75, (70, 160, 146, 255)), (1.0, (214, 245, 232, 255))]),
     "suitability.png", colours=64)

tt = np.clip(np.nan_to_num(travel, nan=0) / 45.0, 0, 1)
save(ramp(tt, [(0.0, (214, 245, 232, 255)), (0.333, (70, 160, 146, 255)),
               (0.5, (60, 50, 40, 255)), (0.8, (160, 55, 25, 255)),
               (1.0, (228, 96, 47, 255))]), "travel_time.png", colours=64)

criteria = {
    "c1": "ahp/c1_population_density.tif", "c2": "ahp/c2_hospital_distance.tif",
    "c3": "ahp/c3_growth_hotspot.tif", "c4": "ahp/c4_road_accessibility.tif",
    "c5": "ahp/c5_environmental_safety.tif", "c6": "ahp/c6_land_suitability.tif",
}
for key, rel in criteria.items():
    a, _ = read(rel)
    lo, hi = np.nanpercentile(a, 1), np.nanpercentile(a, 99)
    n = np.clip((a - lo) / max(hi - lo, 1e-9), 0, 1)
    save(ramp(n, [(0.0, (14, 18, 22, 255)), (0.5, (60, 110, 104, 255)),
                  (1.0, (214, 245, 232, 255))]), f"criterion_{key}.png", colours=32)

# --------------------------------------------------------------- vector layers
inv = ~transform


def to_px(x, y):
    c, r = inv * (x, y)
    return round(float(c), 1), round(float(r), 1)


sites = gpd.read_file(P / "sites" / "candidate_sites.gpkg").to_crs(32644)
zones = []
for _, s in sites.sort_values("site_rank").iterrows():
    geom = s.geometry
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    paths = []
    for poly in polys:
        pts = [to_px(x, y) for x, y in poly.exterior.coords]
        paths.append("M" + "L".join(f"{c},{r}" for c, r in pts) + "Z")
    cx, cy = to_px(s.centroid_x, s.centroid_y)
    zones.append({
        "rank": int(s.site_rank), "path": "".join(paths), "cx": cx, "cy": cy,
        "area_km2": round(float(s.area_km2), 3),
        "mean_suitability": round(float(s.mean_score), 4),
        "dist_road_m": round(float(s.dist_road_m)),
        "dist_hosp_km": round(float(s.dist_hosp_m) / 1000, 2),
        "composite": round(float(s.composite), 3),
    })

fac = gpd.read_file(P / "facilities" / "facilities_inpatient.gpkg").to_crs(32644)
facilities = []
for _, f in fac.iterrows():
    c, r = to_px(f.geometry.x, f.geometry.y)
    if 0 <= c <= W and 0 <= r <= H:
        facilities.append({"x": c, "y": r, "tier": f.tier})

roads = gpd.read_file(P / "roads" / "vellore_roads.gpkg", layer="edges").to_crs(32644)
major = roads[roads["highway"].astype(str).isin(["trunk", "primary", "secondary"])]
major = major.geometry.simplify(25)
road_paths = []
for geom in major:
    lines = [geom] if geom.geom_type == "LineString" else list(geom.geoms)
    for ln in lines:
        pts = [to_px(x, y) for x, y in ln.coords]
        road_paths.append("M" + "L".join(f"{c:.0f},{r:.0f}" for c, r in pts))

# Model A (no growth criterion) leading zones, for the with/without comparison
bvp = json.loads((P / "audit" / "baseline_vs_prospective.json").read_text())
model_a = [{"rank": z["rank"], **dict(zip(("cx", "cy"), to_px(z["centroid_x"], z["centroid_y"])))}
           for z in bvp["model_a"]["top5"]]
model_b = [{"rank": z["rank"], **dict(zip(("cx", "cy"), to_px(z["centroid_x"], z["centroid_y"])))}
           for z in bvp["model_b"]["top5"]]

meta = {
    "grid": {"width": W, "height": H, "cell_m": 30, "crs": "EPSG:32644"},
    "field": {"file": "vellore_field.bin", "width": gw, "height": gh, "block": BLOCK,
              "channels": ["built_2013", "built_2019", "built_2024", "built_2030p", "built_2035p",
                           "growth_prob_2030", "suitability", "water"]},
    "zones": zones,
    "facilities": facilities,
    "roads": " ".join(road_paths),
    "model_a_top5": model_a,
    "model_b_top5": model_b,
}
(OUT / "vellore_vectors.json").write_text(json.dumps(meta, separators=(",", ":")))

# Hero zone anchors in block coordinates
print(json.dumps([{"rank": z["rank"], "bx": round(z["cx"] / BLOCK, 1), "by": round(z["cy"] / BLOCK, 1)} for z in zones]))
print("field", gw, gh, "facilities", len(facilities), "road paths", len(road_paths))
for f in sorted(MAPS.iterdir()):
    print(f.name, f.stat().st_size // 1024, "KB")
print("vectors", (OUT / "vellore_vectors.json").stat().st_size // 1024, "KB")
