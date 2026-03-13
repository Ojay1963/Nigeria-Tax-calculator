import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";

const features = [
  {
    title: "Employee PAYE planning",
    text: "Estimate annual and monthly PAYE with the deduction lines Nigerian employees actually ask about."
  },
  {
    title: "Business tax planning",
    text: "Model company income tax, development levy, small-company treatment, and large-entity edge cases."
  },
  {
    title: "Verified workflow support",
    text: "Guide pages, FAQ support, contact intake, and account flows are all available from the same platform."
  }
];

const homepageStats = [
  {
    label: "Tax mode",
    value: "PAYE + Company",
    copy: "One tool for employee and business scenarios."
  },
  {
    label: "Built for",
    value: "Nigeria",
    copy: "Made around Nigerian tax questions and workflows."
  },
  {
    label: "Best use",
    value: "Fast planning",
    copy: "Useful for payroll reviews and SME tax prep."
  }
];

const taxHighlights = [
  {
    heading: "Employee tax",
    value: "Monthly PAYE projection",
    detail: "Show staff what deductions do before payroll changes go live."
  },
  {
    heading: "Company tax",
    value: "CIT, levy, and minimum-tax view",
    detail: "Get a clearer planning estimate before a finance review or adviser call."
  }
];

const audienceCards = [
  "Employees checking salary impact",
  "SMEs preparing year-end estimates",
  "Finance teams comparing scenarios",
  "Founders explaining payroll changes"
];

const improvementIdeas = [
  "Open the calculator from the hero without hunting for it",
  "Read tax assumptions before doing any estimate",
  "Move into support, FAQ, or registration from the same screen"
];

const homepageSections = [
  {
    title: "Run PAYE quickly",
    text: "For workers, HR, and payroll teams that need a fast explanation of monthly tax impact."
  },
  {
    title: "Estimate company tax",
    text: "For SMEs and finance teams checking likely exposure before a formal computation."
  },
  {
    title: "Understand the logic",
    text: "For people who want assumptions, source links, and practical notes before trusting the output."
  }
];

const supportCards = [
  "Tax guide with live assumptions",
  "Searchable FAQ for common concerns",
  "Contact page tied to the backend",
  "Account registration and email verification"
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="landing-hero">
        <div className="landing-hero-overlay" />
        <div className="landing-hero-grid">
          <div className="landing-hero-main fade-up">
            <span className="eyebrow light-eyebrow">Nigeria tax platform</span>
            <h2>TAX TOOLS NG</h2>
            <p>
              A sharper Nigerian tax landing experience with faster paths into PAYE estimates, company tax
              planning, assumptions, support, and account verification.
            </p>

            <div className="landing-floating-row">
              <div className="floating-alert-card fade-up fade-up-delay-1">
                <strong>Ready for payroll and planning</strong>
                <span>Use one platform for salary conversations, SME estimates, and guide-led tax support.</span>
              </div>
              {homepageStats.map((item, index) => (
                <div
                  className={`floating-mini-card fade-up fade-up-delay-${Math.min(index + 2, 4)}`}
                  key={item.label}
                >
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="cta-row">
              <Link className="button-accent" to="/calculator">
                Start calculating
              </Link>
              <Link className="button-outline-light" to="/guide">
                Explore tax guide
              </Link>
              <Link className="button-ghost-dark" to="/register">
                Create account
              </Link>
            </div>
          </div>

          <aside className="landing-hero-side fade-up fade-up-delay-3">
            <h3>Designed for payroll conversations, SME tax planning, and cleaner support handoff.</h3>
            <div className="landing-side-list">
              <div>
                <span>Primary use</span>
                <strong>PAYE and company tax estimates</strong>
              </div>
              <div>
                <span>Audience</span>
                <strong>Employees, founders, HR, and finance teams</strong>
              </div>
              <div>
                <span>Flow</span>
                <strong>Calculate, verify assumptions, then contact or register</strong>
              </div>
            </div>
            <Link className="side-cta-link" to="/contact">
              Ask a tax question
            </Link>
          </aside>
        </div>
      </section>

      <section className="content-card">
        <SectionHeading
          eyebrow="Core tools"
          title="The tax components your homepage actually needs"
          copy="This homepage is now centered on the product paths that matter most for a tax website instead of generic landing copy."
        />
        <div className="feature-grid">
          {features.map(feature => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Quick access"
            title="What users can do from the homepage"
            copy="The home route now acts like a real launchpad into the rest of the site."
          />
          <div className="feature-grid compact-feature-grid">
            {homepageSections.map(section => (
              <article className="feature-card" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="audience-grid">
          {audienceCards.map(item => (
            <div key={item} className="audience-chip">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Tax summary"
            title="The homepage now previews the tax value clearly"
            copy="Instead of generic promo cards, the hero and supporting content explain the actual use cases of the tax product."
          />
        </div>
        <div className="improvement-list">
          {improvementIdeas.map(item => (
            <div key={item} className="improvement-item">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Tax focus"
            title="Two headline workflows, one polished homepage"
            copy="The landing layout now mirrors a premium hospitality-style split hero, but the substance is tailored to tax work."
          />
          <div className="support-grid">
            {supportCards.map(item => (
              <div key={item} className="support-card">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="tax-highlight-stack">
          {taxHighlights.map(item => (
            <article key={item.heading} className="tax-highlight-card">
              <span>{item.heading}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
