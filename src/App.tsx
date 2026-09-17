import { lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { Layout } from "./components/Layout";
import { flagship } from "./content/catalog";
import Home from "./pages/Home";

const Company = lazy(() => import("./pages/Company"));
const TechnologyOverview = lazy(() => import("./pages/TechnologyOverview"));
const TechnologyDetail = lazy(() => import("./pages/TechnologyDetail"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ResearchPage = lazy(() => import("./pages/ResearchPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Old URLs from the earlier site structure, so shared links keep working.
const SERVICE_TO_TECH: Record<string, string> = {
  "urban-growth-forecasting": "/technology/predictive-simulation",
  "site-selection": "/technology/decision-systems",
  "accessibility-analysis": "/technology/decision-systems",
  "land-cover-mapping": "/technology/earth-observation",
};

function ServiceRedirect() {
  const { slug } = useParams();
  return <Navigate to={SERVICE_TO_TECH[slug ?? ""] ?? "/technology"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="company" element={<Company />} />
        <Route path="technology" element={<TechnologyOverview />} />
        <Route path="technology/:slug" element={<TechnologyDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />

        <Route path="about" element={<Navigate to="/company" replace />} />
        <Route path="company/mission" element={<Navigate to="/company#mission" replace />} />
        <Route path="company/technology" element={<Navigate to="/technology" replace />} />
        <Route path="company/research" element={<Navigate to="/research" replace />} />
        <Route path="services" element={<Navigate to="/technology" replace />} />
        <Route path="services/:slug" element={<ServiceRedirect />} />
        <Route path="products/infrastructure-intelligence" element={<Navigate to={`/products/${flagship.slug}`} replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
