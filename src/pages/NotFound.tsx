import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found", "This page does not exist.");
  return (
    <section className="flex min-h-[80svh] items-center pt-24">
      <div className="frame">
        <p className="tick">404 · Outside the study window</p>
        <h1 className="display mt-6 text-[clamp(2.4rem,6vw,5rem)]">Nothing mapped here.</h1>
        <Link to="/" className="btn btn-primary mt-10">
          <span className="btn-dot" />
          Back to home
        </Link>
      </div>
    </section>
  );
}
