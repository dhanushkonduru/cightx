import { Link } from "react-router-dom";
import { company } from "../content/site";
import { usePageMeta } from "../lib/usePageMeta";

const UPDATED = "16 September 2026";

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: "Who we are",
    body: (
      <p>
        CightX (“we”, “us”) operates this website. For any privacy question, contact us at{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    ),
  },
  {
    h: "What we collect",
    body: (
      <>
        <p>We only collect what you choose to send us:</p>
        <ul>
          <li>Your name, organisation, email address and message when you write to us or use the enquiry form.</li>
          <li>Your CV or profile if you apply for a role.</li>
        </ul>
        <p>
          The enquiry form does not store anything on our servers. It opens your own email app with the message filled in,
          and nothing is sent until you send that email.
        </p>
      </>
    ),
  },
  {
    h: "Cookies and tracking",
    body: (
      <p>
        This website does not use cookies, analytics or advertising trackers. Fonts, images and map data are served from
        our own site, not from third parties. Our hosting provider may keep standard server logs, such as IP address and
        request time, for security and reliability.
      </p>
    ),
  },
  {
    h: "How we use your information",
    body: (
      <ul>
        <li>To reply to your enquiry and discuss projects or pilots.</li>
        <li>To assess job applications.</li>
        <li>To keep a record of our correspondence.</li>
      </ul>
    ),
  },
  {
    h: "Sharing",
    body: (
      <p>
        We do not sell or rent personal information. We share it only with service providers we use to operate (such as
        email and hosting), or where the law requires it.
      </p>
    ),
  },
  {
    h: "Retention",
    body: (
      <p>
        We keep enquiries and applications only as long as needed for the purpose you sent them, then delete them. You can
        ask us to delete them sooner.
      </p>
    ),
  },
  {
    h: "Your rights",
    body: (
      <p>
        You can ask to access, correct or delete the personal information we hold about you, or withdraw consent to its
        use, including under India’s Digital Personal Data Protection Act, 2023. Email{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a> and we will respond.
      </p>
    ),
  },
  {
    h: "Data in our products",
    body: (
      <p>
        Our analyses are built on openly licensed satellite, population and map datasets. They work with aggregated,
        gridded data and do not identify individuals.
      </p>
    ),
  },
  {
    h: "Changes",
    body: <p>We may update this policy. The date above shows when it last changed.</p>,
  },
];

export default function PrivacyPolicy() {
  usePageMeta("Privacy Policy", "How CightX collects, uses and protects personal information.");
  return (
    <section className="pb-24 pt-32 lg:pt-44">
      <div className="frame">
        <div className="max-w-3xl">
          <p className="tick">Legal</p>
          <h1 className="display mt-5 text-[clamp(2.4rem,5vw,4.2rem)]">Privacy Policy</h1>
          <p className="mt-4 font-mono text-[11px] text-bone/45">Last updated {UPDATED}</p>
          <p className="lede mt-8">Short version: we don’t track you, and we only hold what you send us.</p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <ul className="sticky top-28 space-y-2 border-l border-bone/10 pl-4">
              {SECTIONS.map((s, i) => (
                <li key={s.h}>
                  <a href={`#p${i}`} className="text-[13.5px] text-bone/50 hover:text-bone">
                    {s.h}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-12 lg:col-span-8 lg:col-start-5">
            {SECTIONS.map((s, i) => (
              <section key={s.h} id={`p${i}`} className="scroll-mt-28 border-t border-bone/10 pt-8">
                <h2 className="text-[22px] font-medium tracking-[-0.02em] text-bone">
                  <span className="mr-3 font-mono text-[12px] text-laterite">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </h2>
                <div className="prose-legal mt-4">{s.body}</div>
              </section>
            ))}
            <p className="border-t border-bone/10 pt-8 text-[14px] text-bone/50">
              Questions? <Link to="/contact" className="text-bone underline decoration-bone/30 underline-offset-4">Contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
