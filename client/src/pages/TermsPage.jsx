import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";

export default function TermsPage() {
  return (
    <div className="page-stack">
      <SeoHead
        title="Terms of Use | Naija Tax Calculator"
        description="Read the Naija Tax Calculator terms of use and important notes about estimates, user responsibility, and service updates."
        schema={[
          { "@context": "https://schema.org", "@type": "WebPage", name: "Terms of Use", description: "Terms page for Naija Tax Calculator.", url: "/terms" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "/" }, { "@type": "ListItem", position: 2, name: "Terms", item: "/terms" }] }
        ]}
        canonicalPath="/terms"
      />
      <PageHero
        eyebrow="Terms"
        title="Terms of use"
        copy="This page makes it clear that the calculator is an estimate and not a substitute for formal tax advice or final filing review."
        aside={
          <div className="hero-note-card">
            <strong>Important</strong>
            <p>All outputs are informational and should be checked against current law and professional advice before filing.</p>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="Use of service"
          title="How the product should be used"
          copy="Use the service for planning, explanation, and rough decision support. Do not rely on it as the only basis for legal or tax filing decisions."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>No filing guarantee</h3>
            <p>The platform does not guarantee that estimates match your final tax liability.</p>
          </article>
          <article className="feature-card">
            <h3>User responsibility</h3>
            <p>Users are responsible for verifying their data, understanding their facts, and seeking qualified advice where needed.</p>
          </article>
          <article className="feature-card">
            <h3>Service updates</h3>
            <p>We may revise tax assumptions, design, and product behavior as policy, law, and operational needs change.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
