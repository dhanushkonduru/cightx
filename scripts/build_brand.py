"""Build the CightX logo files from one geometry definition.

Symbol: four square brackets turned 45 degrees, sitting on the diagonals and
opening towards a single orange cell. Together they read as an X closing in on
the chosen site. Wordmark: Geist SemiBold converted to outlines, so the
SVGs render identically without the font installed.

    pip install fonttools brotli
    python scripts/build_brand.py

Writes public/brand/*.svg and public/favicon.svg.
"""

import math
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SITE = Path(__file__).resolve().parents[1]
BRAND = SITE / "public" / "brand"
BRAND.mkdir(parents=True, exist_ok=True)
FONT = SITE / "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"

INK, BONE, LATERITE = "#07080A", "#E6E1D5", "#E4602F"

# ------------------------------------------------------------------ symbol
# 64-unit grid, centre (32, 32). Four square U-brackets turned 45 degrees sit on
# the diagonals, each opening towards the orange cell, so together they form
# an X that closes in on the chosen site.
S = 16  # cell size
H = 8.5  # half the bracket's outer side
T = 6  # bracket thickness
GAP = 3.6  # space between a bracket's open side and the cell's corner


def rotate(pts, deg, cx=32, cy=32):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in pts]


def poly(pts):
    return "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + "Z"


# a U opening to the right, centred on the origin
u = [(H, -H), (-H, -H), (-H, H), (H, H), (H, H - T), (-H + T, H - T), (-H + T, -H + T), (H, -H + T)]
# turn it to open down-right (towards the centre) and move it onto the top-left diagonal
d = (H + GAP + S / 2 * math.sqrt(2)) / math.sqrt(2)
top_left = rotate([(x + 32 - d, y + 32 - d) for x, y in u], 45, 32 - d, 32 - d)
pieces = [rotate(top_left, k * 90) for k in range(4)]
BRACKETS = "".join(poly(p) for p in pieces)
lo = 32 - S / 2
CELL = poly([(lo, lo), (lo + S, lo), (lo + S, lo + S), (lo, lo + S)])
SYM_MIN = round(min(x for p in pieces for x, _ in p), 2)  # symmetric, so the same on every side
SYM_SIZE = round(64 - 2 * SYM_MIN, 2)

# ---------------------------------------------------------------- wordmark
font = TTFont(FONT)
font = instantiateVariableFont(font, {"wght": 600})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font["hmtx"]
upm = font["head"].unitsPerEm
cap = font["OS/2"].sCapHeight

TRACK = -0.018 * upm  # tight, modern
KERN = {("t", "X"): -0.004 * upm}  # keep t and X close without touching


def word_paths(text):
    """Return ([(char, path)], width, bounds) in font units, y flipped, baseline at 0."""
    x = 0.0
    out = []
    xmin = ymin = math.inf
    xmax = ymax = -math.inf
    prev = None
    for ch in text:
        name = cmap[ord(ch)]
        if prev:
            x += KERN.get((prev, ch), 0)
        pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        bp = BoundsPen(glyphs)
        glyphs[name].draw(TransformPen(bp, (1, 0, 0, -1, x, 0)))
        if bp.bounds:
            xmin, ymin = min(xmin, bp.bounds[0]), min(ymin, bp.bounds[1])
            xmax, ymax = max(xmax, bp.bounds[2]), max(ymax, bp.bounds[3])
        out.append((ch, pen.getCommands()))
        x += hmtx[name][0] + TRACK
        prev = ch
    return out, (xmin, ymin, xmax, ymax)


WORD, (wx0, wy0, wx1, wy1) = word_paths("CightX")
CIGHT = " ".join(p for ch, p in WORD[:-1])
X = WORD[-1][1]

# ------------------------------------------------------------------- files


def symbol_group(bracket_fill, x=0, y=0, scale=1):
    return (
        f'<g transform="translate({x:.2f} {y:.2f}) scale({scale:.4f}) translate({-SYM_MIN} {-SYM_MIN})">'
        f'<path fill="{bracket_fill}" d="{BRACKETS}"/><path fill="{LATERITE}" d="{CELL}"/></g>'
    )


def word_group(text_fill, x, y, scale):
    return (
        f'<g transform="translate({x:.2f} {y:.2f}) scale({scale:.5f})">'
        f'<path fill="{text_fill}" d="{CIGHT}"/><path fill="{LATERITE}" d="{X}"/></g>'
    )


def svg(w, h, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{body}</svg>\n"
    )


def write(name, content):
    (BRAND / name).write_text(content)


for variant, fg in (("", BONE), ("-ink", INK)):
    # symbol only
    write(f"cightx-symbol{variant}.svg", svg(SYM_SIZE, SYM_SIZE, symbol_group(fg), "CightX"))

    # horizontal: symbol 1.62x the cap height, caps centred on the symbol
    cap_h = 100
    k = cap_h / cap
    sym = cap_h * 1.62
    gap = sym * 0.36
    word_w = (wx1 - wx0) * k
    desc = max(0, wy1) * k  # descender of the g below the baseline
    h = max(sym, cap_h + desc)
    top = (h - sym) / 2
    base = top + sym / 2 + cap_h / 2  # centre caps on the symbol
    h = max(h, base + desc)
    body = symbol_group(fg, 0, top, sym / SYM_SIZE) + word_group(fg, sym + gap - wx0 * k, base, k)
    write(f"cightx-logo{variant}.svg", svg(sym + gap + word_w, h, body, "CightX"))

    # stacked
    sym2 = 200
    k2 = 62 / cap
    word_w2 = (wx1 - wx0) * k2
    w2 = max(sym2, word_w2)
    base2 = sym2 + 44 + 62
    body2 = symbol_group(fg, (w2 - sym2) / 2, 0, sym2 / SYM_SIZE) + word_group(fg, (w2 - word_w2) / 2 - wx0 * k2, base2, k2)
    write(f"cightx-logo-stacked{variant}.svg", svg(w2, base2 + max(0, wy1) * k2, body2, "CightX"))

# app icon / favicon: symbol on a rounded ink tile
for name, bg, fg in (("cightx-app-icon.svg", INK, BONE), ("cightx-app-icon-light.svg", BONE, INK)):
    pad = 11
    body = f'<rect width="100" height="100" rx="22" fill="{bg}"/>' + symbol_group(fg, pad, pad, (100 - 2 * pad) / SYM_SIZE)
    write(name, svg(100, 100, body, "CightX"))
(SITE / "public" / "favicon.svg").write_text((BRAND / "cightx-app-icon.svg").read_text())

print("symbol", SYM_SIZE, "word", round(wx1 - wx0), "x", round(wy1 - wy0), "cap", cap, "upm", upm)
for f in sorted(BRAND.iterdir()):
    print(f.name, f.stat().st_size, "B")
