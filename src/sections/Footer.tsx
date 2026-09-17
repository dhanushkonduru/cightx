import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { companyPages, products, services } from "../content/catalog";
import { company } from "../content/site";

const COLS = [
  { title: "Services", links: services.map((s) => ({ to: `/services/${s.slug}`, label: s.name })) },
  { title: "Products", links: products.map((p) => ({ to: `/products/${p.slug}`, label: p.name, tag: p.status })) },
  {
    title: "Company",
    links: [{ to: "/about", label: "About Us" }, ...companyPages.map((c) => ({ to: c.to, label: c.name })), { to: "/careers", label: "Careers" }, { to: "/contact", label: "Contact Us" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink-900">
      <div className="frame grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <Logo height={34} />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-bone/55">{company.tagline}</p>
          <a href={`mailto:${company.email}`} className="mt-6 block break-all font-mono text-[11px] text-bone/50 hover:text-bone">
            {company.email}
          </a>
          <p className="mt-2 font-mono text-[11px] text-bone/35">{company.location}</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title} className="md:col-span-3">
            <p className="tick">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[14px] text-bone/65 transition-colors hover:text-bone">
                    {l.label}
                  </Link>
                  {"tag" in l && l.tag === "Planned" && <span className="ml-2 font-mono text-[9.5px] uppercase text-bone/30">planned</span>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="frame flex flex-col justify-between gap-2 border-t border-bone/10 py-6 font-mono text-[10.5px] text-bone/35 sm:flex-row">
        <span className="flex gap-5">
          <span>© {new Date().getFullYear()} CightX</span>
          <Link to="/privacy-policy" className="hover:text-bone">Privacy Policy</Link>
        </span>
        <span>Landsat courtesy USGS · GHSL & GSW © EC JRC · WorldCover © ESA · © OpenStreetMap contributors</span>
      </div>
    </footer>
  );
}
