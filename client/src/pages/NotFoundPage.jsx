import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="content-card">
      <h2>Page not found</h2>
      <p>The page you asked for is not here. The calculator is still available.</p>
      <Link className="button-primary" to="/calculator">
        Go to calculator
      </Link>
    </section>
  );
}
