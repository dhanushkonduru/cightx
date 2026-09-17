import { useEffect } from "react";

const SITE = "CightX";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title === SITE ? `${SITE} — Where to build next, before the city gets there` : `${title} — ${SITE}`;
    const set = (sel: string, attr: string, value: string) => {
      const el = document.head.querySelector(sel);
      if (el) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', "content", description);
    set('meta[property="og:title"]', "content", document.title);
    set('meta[property="og:description"]', "content", description);
    set('meta[name="twitter:title"]', "content", document.title);
    set('meta[name="twitter:description"]', "content", description);
  }, [title, description]);
}
