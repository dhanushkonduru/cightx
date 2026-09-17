// Loads the 120 m Vellore field exported by scripts/export_web_data.py.
// Channels: built fraction 2013, 2019, 2024, 2030p, 2035p, growth prob 2030,
// suitability, water — each a byte per block.

export const FIELD_W = 182;
export const FIELD_H = 186;
const CHANNELS = 8;

// Candidate zone centroids in block coordinates (candidate_sites.gpkg / 4)
export const ZONES = [
  { rank: 1, bx: 43.6, by: 44.6 },
  { rank: 2, bx: 104.1, by: 4.3 },
  { rank: 3, bx: 6.7, by: 92.4 },
  { rank: 4, bx: 54.2, by: 41.4 },
  { rank: 5, bx: 155.8, by: 5.4 },
];

export type Field = {
  count: number;
  offsets: Float32Array; // x, z per column
  heights: Float32Array; // 5 per column
  growth: Float32Array; // 1 per column
  texture: Uint8Array; // RGBA per block: growth, suitability, water, 255
};

export function toWorld(bx: number, by: number) {
  return { x: bx - FIELD_W / 2 + 0.5, z: by - FIELD_H / 2 + 0.5 };
}

export async function loadField(maxHeight: number): Promise<Field> {
  const res = await fetch("/data/vellore_field.bin");
  const buf = new Uint8Array(await res.arrayBuffer());
  const n = FIELD_W * FIELD_H;

  const texture = new Uint8Array(n * 4);
  let count = 0;
  for (let i = 0; i < n; i++) {
    const o = i * CHANNELS;
    texture[i * 4] = buf[o + 5];
    texture[i * 4 + 1] = buf[o + 6];
    texture[i * 4 + 2] = buf[o + 7];
    texture[i * 4 + 3] = 255;
    if (buf[o + 4] > 0) count++;
  }

  const offsets = new Float32Array(count * 2);
  const heights = new Float32Array(count * 5);
  const growth = new Float32Array(count);
  const h = (v: number) => (v === 0 ? 0 : 0.22 + Math.pow(v / 255, 0.85) * maxHeight);

  let k = 0;
  for (let by = 0; by < FIELD_H; by++) {
    for (let bx = 0; bx < FIELD_W; bx++) {
      const o = (by * FIELD_W + bx) * CHANNELS;
      if (buf[o + 4] === 0) continue;
      const w = toWorld(bx, by);
      offsets[k * 2] = w.x;
      offsets[k * 2 + 1] = w.z;
      for (let e = 0; e < 5; e++) heights[k * 5 + e] = h(buf[o + e]);
      growth[k] = buf[o + 5] / 255;
      k++;
    }
  }
  return { count, offsets, heights, growth, texture };
}
