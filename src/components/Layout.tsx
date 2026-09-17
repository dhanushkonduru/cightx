import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../sections/Footer";
import { Navbar } from "./Navbar";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // pages load lazily, so wait for the target section to exist
      const id = hash.slice(1);
      let tries = 0;
      const t = window.setInterval(() => {
        const el = document.getElementById(id);
        if (el || ++tries > 40) {
          window.clearInterval(t);
          el?.scrollIntoView({ behavior: "smooth" });
        }
      }, 60);
      return () => window.clearInterval(t);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
