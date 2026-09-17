// The mark: a viewfinder closing on a single 30 m cell.
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2 8V2h6M16 2h6v6M22 16v6h-6M8 22H2v-6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="9" y="9" width="6" height="6" fill="#E4602F" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 text-bone">
      <Mark />
      <span className="text-[19px] font-semibold tracking-[-0.04em]">
        Cight<span className="text-laterite">X</span>
      </span>
    </span>
  );
}
