import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(options: IntersectionObserverInit = {}, once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05, ...options });
    io.observe(el);
    return () => io.disconnect();
  }, [once]); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView] as const;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
