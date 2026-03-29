import { Link, useLocation } from "react-router-dom";

export default function StickyMobileCta() {
  const location = useLocation();
  const visiblePaths = new Set([
    "/",
    "/about",
    "/guide",
    "/faq",
    "/contact",
    "/pricing",
    "/privacy",
    "/terms",
    "/paye-calculator-nigeria",
    "/vat-calculator-nigeria",
    "/loan-calculator-nigeria",
    "/profit-calculator-nigeria",
    "/business-expense-tracker",
    "/business-profit-calculator"
  ]);

  if (!visiblePaths.has(location.pathname)) {
    return null;
  }

  return (
    <div className="sticky-mobile-cta">
      <Link className="button-primary sticky-mobile-cta-link" to="/calculator">
        Start Calculating
      </Link>
    </div>
  );
}
