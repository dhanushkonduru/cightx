// Built by scripts/build_brand.py; the horizontal lockup is 664.18 × 162.00.
export function Logo({ height = 26 }: { height?: number }) {
  return (
    <img
      src="/brand/cightx-logo.svg"
      alt="CightX"
      width={Math.round((height * 664.18) / 162.0)}
      height={height}
      className="block"
      decoding="async"
    />
  );
}

export function Mark({ size = 20 }: { size?: number }) {
  return <img src="/brand/cightx-symbol.svg" alt="" width={size} height={size} className="inline-block" decoding="async" />;
}
