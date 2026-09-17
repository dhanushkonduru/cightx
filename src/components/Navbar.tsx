import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { companyPages, products, services } from "../content/catalog";
import { company } from "../content/site";
import { Arrow } from "./Arrow";
import { Logo } from "./Logo";

type MenuItem = { to: string; name: string; short: string; tag?: string };
type Menu = { key: string; label: string; base: string; title: string; overview: { to: string; label: string }; items: MenuItem[] };

const MENUS: Menu[] = [
  {
    key: "services",
    label: "Services",
    base: "/services",
    title: "CightX Services",
    overview: { to: "/services", label: "All services" },
    items: services.map((s) => ({ to: `/services/${s.slug}`, name: s.name, short: s.short })),
  },
  {
    key: "products",
    label: "Products",
    base: "/products",
    title: "CightX Products",
    overview: { to: "/products", label: "All products" },
    items: products.map((p) => ({ to: `/products/${p.slug}`, name: p.name, short: p.short, tag: p.status })),
  },
  {
    key: "company",
    label: "Company",
    base: "/company",
    title: "CightX Company",
    overview: { to: "/about", label: "About CightX" },
    items: companyPages,
  },
];

const LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const { pathname } = useLocation();
  const closeTimer = useRef<number>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const enter = (key: string) => {
    window.clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };

  const active = MENUS.find((m) => m.key === menu);
  const solid = scrolled || open || menu !== null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color] duration-500 ${
          solid ? "border-bone/10 bg-ink/90 backdrop-blur-xl" : "border-transparent"
        }`}
        onMouseLeave={leave}
      >
        <div className="frame flex h-[68px] items-center justify-between">
          <Link to="/" aria-label="CightX home">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {MENUS.map((m) => {
              const current = pathname.startsWith(m.base);
              return (
                <button
                  key={m.key}
                  type="button"
                  onMouseEnter={() => enter(m.key)}
                  onClick={() => setMenu((k) => (k === m.key ? null : m.key))}
                  aria-expanded={menu === m.key}
                  aria-controls="mega-menu"
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] transition-colors ${
                    menu === m.key || current ? "text-bone" : "text-bone/60 hover:text-bone"
                  }`}
                >
                  {current && <span className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 bg-laterite" />}
                  {m.label}
                  <svg width="9" height="9" viewBox="0 0 9 9" className={`transition-transform duration-300 ${menu === m.key ? "rotate-180" : ""}`} aria-hidden>
                    <path d="M1 3l3.5 3.5L8 3" stroke="currentColor" fill="none" strokeWidth="1.3" />
                  </svg>
                </button>
              );
            })}
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onMouseEnter={() => setMenu(null)}
                className={({ isActive }) =>
                  `relative rounded-full px-3.5 py-2 text-[13.5px] transition-colors ${isActive ? "text-bone" : "text-bone/60 hover:text-bone"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 bg-laterite" />}
                    {l.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn btn-primary hidden !py-2.5 !pl-4 !pr-5 !text-[13.5px] sm:inline-flex">
              <span className="btn-dot" />
              Talk to us
            </Link>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-bone/15 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-4 bg-bone transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-4 bg-bone transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>

        {/* desktop mega menu */}
        <div
          id="mega-menu"
          onMouseEnter={() => window.clearTimeout(closeTimer.current)}
          className={`absolute inset-x-0 top-full hidden border-b border-bone/10 bg-ink/95 backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 lg:block ${
            active ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
          {active && (
            <div className="frame relative pb-2 pt-6">
              <div className="flex items-center justify-between border-b border-bone/15 pb-5">
                <p className="text-[26px] font-medium tracking-[-0.03em] text-bone">{active.title}</p>
                <div className="flex items-center gap-6">
                  <Link to={active.overview.to} className="inline-flex items-center gap-2 text-[13px] text-bone/55 hover:text-laterite">
                    {active.overview.label}
                    <Arrow />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenu(null)}
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-bone/70 transition-colors hover:border-bone/40 hover:text-bone"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
              <ul className="grid divide-x divide-bone/10" style={{ gridTemplateColumns: `repeat(${active.items.length}, minmax(0, 1fr))` }}>
                {active.items.map((it, i) => (
                  <li key={it.to} style={{ animation: `fadeUp .45s ${i * 40}ms cubic-bezier(.2,.7,.1,1) both` }}>
                    <Link
                      to={it.to}
                      onClick={() => setMenu(null)}
                      className="group relative flex h-full min-h-[168px] flex-col items-center justify-center px-4 py-8 text-center transition-colors hover:bg-bone/[0.03]"
                    >
                      <span className="text-[15.5px] font-medium tracking-[-0.01em] text-laterite-soft transition-colors group-hover:text-bone">{it.name}</span>
                      {it.tag && (
                        <span className={`mt-2 font-mono text-[9px] uppercase tracking-[0.14em] ${it.tag === "Live" ? "text-mint" : "text-bone/35"}`}>{it.tag}</span>
                      )}
                      <span className="mt-2 hidden max-w-[200px] text-[12.5px] leading-snug text-bone/40 xl:block">{it.short}</span>
                      <span className="absolute inset-x-6 bottom-0 h-[2px] origin-center scale-x-0 bg-laterite transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-ink transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="frame flex min-h-full flex-col pb-8 pt-4">
          <ul className="flex-1">
            {MENUS.map((m) => (
              <li key={m.key} className="border-b border-bone/10">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left text-[24px] font-medium tracking-[-0.03em] text-bone"
                  aria-expanded={mobileGroup === m.key}
                  onClick={() => setMobileGroup((g) => (g === m.key ? null : m.key))}
                >
                  {m.label}
                  <span className={`text-[22px] font-light text-bone/50 transition-transform duration-300 ${mobileGroup === m.key ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${mobileGroup === m.key ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <ul className="overflow-hidden">
                    {[{ to: m.overview.to, name: m.overview.label, short: "" } as MenuItem, ...m.items].map((it) => (
                      <li key={it.to}>
                        <Link to={it.to} className="flex items-center justify-between py-2.5 pl-1 text-[15px] text-bone/70">
                          {it.name}
                          {it.tag && <span className={`font-mono text-[9.5px] uppercase ${it.tag === "Live" ? "text-mint" : "text-bone/35"}`}>{it.tag}</span>}
                        </Link>
                      </li>
                    ))}
                    <li className="h-3" />
                  </ul>
                </div>
              </li>
            ))}
            {LINKS.map((l) => (
              <li key={l.to} className="border-b border-bone/10">
                <Link to={l.to} className="block py-4 text-[24px] font-medium tracking-[-0.03em] text-bone">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-primary mt-8 justify-center">
            <span className="btn-dot" />
            Talk to us
            <Arrow />
          </Link>
          <p className="tick mt-5 text-center">{company.location}</p>
        </nav>
      </div>
    </>
  );
}
