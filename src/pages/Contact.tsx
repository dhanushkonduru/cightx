import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { flagship, roadmap, technologies } from "../content/catalog";
import { company } from "../content/site";
import { usePageMeta } from "../lib/usePageMeta";

const NEXT = ["Tell us the city and the question.", "We scope it with you on a short call.", "You get a proposal: data, method, timeline."];

export default function Contact() {
  usePageMeta("Contact Us", "Contact CightX about our technology, the Urban Growth Platform, pilots, research or careers.");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Organisation: ${f.get("org")}`,
      `Email: ${f.get("email")}`,
      `Interested in: ${f.get("interest")}`,
      "",
      String(f.get("message") ?? ""),
    ].join("\n");
    const subject = `CightX enquiry — ${f.get("interest")}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = "w-full border border-bone/15 bg-ink px-4 py-3.5 text-[15px] text-bone placeholder:text-bone/30 transition-colors focus:border-laterite focus:outline-none";

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={
          <>
            Talk to <span className="font-serif font-normal italic">CightX.</span>
          </>
        }
        lede="Pilots, partnerships, research or careers. Tell us what you have in mind."
      />

      <section className="py-20 lg:py-28">
        <div className="frame grid gap-14 lg:grid-cols-12">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:col-span-7" aria-label="Enquiry form">
            <label className="block">
              <span className="tick mb-2 block">Name</span>
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block">
              <span className="tick mb-2 block">Organisation</span>
              <input name="org" autoComplete="organization" className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className="tick mb-2 block">Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className="tick mb-2 block">Interested in</span>
              <select name="interest" className={field} defaultValue="A pilot for my city">
                <option>A pilot for my city</option>
                <optgroup label="Products">
                  <option>{flagship.fullName}</option>
                  {roadmap.map((p) => (
                    <option key={p.slug}>{p.name} (planned)</option>
                  ))}
                </optgroup>
                <optgroup label="Technology">
                  {technologies.map((t) => (
                    <option key={t.slug}>{t.name}</option>
                  ))}
                </optgroup>
                <option>Partnership</option>
                <option>Research collaboration</option>
                <option>Careers</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="tick mb-2 block">Your question</span>
              <textarea name="message" rows={5} placeholder="e.g. Where should a new district hospital go in our city by 2035?" className={field} />
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button type="submit" className="btn btn-primary">
                <span className="btn-dot" />
                Send enquiry
              </button>
              <span className="font-mono text-[10.5px] text-bone/40">
                {sent ? "Your email app should have opened with the message." : "Opens your email app with the message filled in."}{" "}
                <Link to="/privacy-policy" className="underline decoration-bone/30 underline-offset-2 hover:text-bone">Privacy</Link>
              </span>
            </div>
          </form>

          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="tick">Email</p>
              <a href={`mailto:${company.email}`} className="mt-2 block break-all text-[17px] text-bone hover:text-laterite">
                {company.email}
              </a>
            </div>
            <div>
              <p className="tick">Location</p>
              <p className="mt-2 text-[17px] text-bone">{company.location}</p>
            </div>
            <div>
              <p className="tick">What happens next</p>
              <ol className="mt-3 border-t border-bone/10">
                {NEXT.map((n, i) => (
                  <li key={n} className="grid grid-cols-[32px_1fr] border-b border-bone/10 py-3 text-[14.5px] text-bone/70">
                    <span className="font-mono text-[11px] text-laterite">0{i + 1}</span>
                    {n}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
