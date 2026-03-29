import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

export default function NotFoundPage() {
  return (
    <div className="page-stack">
      <SeoHead
        title="Page Not Found | Naija Tax Calculator"
        description="The page you requested could not be found. Continue to the main Naija Tax Calculator tools."
      />
      <section className="content-card">
        <h1>Page not found</h1>
        <p>The page you asked for is not here, but the main calculators and guides are still available.</p>
        <Link className="button-primary" to="/calculator">
          Go to calculator
        </Link>
      </section>
    </div>
  );
}
