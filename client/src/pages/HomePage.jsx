import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";

const homepageStats = [
  {
    label: "Small company CIT",
    value: "0% under Act test",
    copy: "Applies only where the Act's small-company conditions are met."
  },
  {
    label: "Development levy",
    value: "4% assessable profit",
    copy: "Shown separately for chargeable companies."
  },
  {
    label: "15% ETR rule",
    value: "N20bn or MNE",
    copy: "Checked only for qualifying large groups."
  }
];

const quickFacts = [
  {
    title: "PAYE relief lines",
    text: "Rent relief, pension, NHF, NHIS, life assurance, and mortgage-interest fields."
  },
  {
    title: "Company classification",
    text: "Turnover, fixed assets, and professional-services status are checked first."
  },
  {
    title: "Source-backed guidance",
    text: "The guide links back to FIRS and LIRS materials."
  }
];

const workflowPaths = [
  {
    title: "Employees and payroll teams",
    text: "Check how income and relief items affect monthly PAYE.",
    cta: "/calculator",
    ctaLabel: "Open PAYE calculator"
  },
  {
    title: "SMEs and finance leads",
    text: "Estimate company tax, levy, minimum tax, and top-up exposure.",
    cta: "/calculator",
    ctaLabel: "Open company calculator"
  },
  {
    title: "Questions and guidance",
    text: "Use the guide and FAQ to verify thresholds and assumptions.",
    cta: "/guide",
    ctaLabel: "Read the guide"
  }
];

const audienceCards = [
  "Employees checking net-pay impact",
  "HR teams preparing payroll communication",
  "SMEs estimating year-end tax exposure",
  "Finance managers reviewing scenarios",
  "Founders validating assumptions before meetings",
  "Advisers needing a quick planning view"
];

const processSteps = [
  {
    step: "01",
    title: "Pick a calculator",
    text: "Use PAYE for salary reviews or company tax for business planning."
  },
  {
    step: "02",
    title: "Enter your figures",
    text: "Use actual income, turnover, profit, and relief values."
  },
  {
    step: "03",
    title: "Review the result",
    text: "Check the guide or contact support if you need a second look."
  }
];

const coveragePoints = [
  "PAYE estimate",
  "Company tax estimate",
  "Guide and FAQ",
  "Support and consultation",
  "Verified accounts"
];

const guardrails = [
  "The site is for planning, communication, and estimation.",
  "Final filing should still be checked against current official guidance and the taxpayer's exact facts.",
  "The calculator is most useful before payroll changes, board reviews, adviser calls, and internal budgeting discussions."
];

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="landing-hero">
        <div className="landing-hero-overlay" />
        <div className="landing-hero-grid">
          <div className="landing-hero-main fade-up">
            <span className="eyebrow light-eyebrow">Nigeria tax platform</span>
            <h2>NAIJA TAX CALCULATOR</h2>
            <p>Estimate Nigerian PAYE and company tax in one place.</p>

            <div className="landing-floating-row">
              <div className="floating-alert-card fade-up fade-up-delay-1">
                <strong>Built for payroll and business tax checks</strong>
                <span>Use one platform for PAYE, company tax, and follow-up support.</span>
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
            <h3>Built for payroll reviews, SME planning, and quick tax checks.</h3>
            <div className="landing-side-list">
              <div>
                <span>Tools</span>
                <strong>PAYE and company tax estimates</strong>
              </div>
              <div>
                <span>Audience</span>
                <strong>Employees, founders, payroll teams, and finance managers</strong>
              </div>
              <div>
                <span>Support</span>
                <strong>Guide, FAQ, consultation, and paid reports</strong>
              </div>
            </div>
            <Link className="side-cta-link" to="/contact">
              Contact support
            </Link>
          </aside>
        </div>
      </section>

      <section className="content-card homepage-band">
        <SectionHeading
          eyebrow="Snapshot"
          title="What you can do here"
          copy="Quick tax checks without unnecessary steps."
        />
        <div className="homepage-band-grid">
          {quickFacts.map(item => (
            <article className="feature-card homepage-band-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
          eyebrow="User paths"
          title="Choose your next step"
          copy="Start with a calculator, then move to guidance or support."
        />
          <div className="feature-grid compact-feature-grid">
            {workflowPaths.map(path => (
              <article className="feature-card homepage-path-card" key={path.title}>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <Link className="text-link" to={path.cta}>
                  {path.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading
          eyebrow="Who it serves"
          title="Who it serves"
          copy="Useful for payroll, planning, and internal review."
        />
          <div className="audience-grid">
            {audienceCards.map(item => (
              <div key={item} className="audience-chip">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-card">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          copy="Three quick steps."
        />
        <div className="journey-grid">
          {processSteps.map(item => (
            <article className="journey-card" key={item.step}>
              <span className="journey-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
        <SectionHeading
          eyebrow="Coverage"
          title="Included"
          copy="Core tax tools and support features."
        />
        <div className="support-grid">
            {coveragePoints.map(item => (
              <div key={item} className="support-card">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="tax-highlight-stack">
          <article className="tax-highlight-card">
            <span>Use case</span>
            <strong>Before payroll or finance reviews</strong>
            <p>Use the calculator before meetings, salary updates, or internal planning.</p>
          </article>
        </div>
      </section>

      <section className="content-card split-card homepage-guardrail-card">
        <div>
          <SectionHeading
            eyebrow="Important"
            title="Use estimates as estimates"
            copy="Check official guidance before filing."
          />
        </div>
        <div className="improvement-list">
          {guardrails.map(item => (
            <div key={item} className="improvement-item">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
