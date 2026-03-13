import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";

const homepageStats = [
  {
    label: "Small company CIT",
    value: "0% under Act test",
    copy: "Applies only where turnover is at most N50m, fixed assets are at most N250m, and the company is not in professional services."
  },
  {
    label: "Development levy",
    value: "4% assessable profit",
    copy: "Shown separately for chargeable companies under the Act."
  },
  {
    label: "15% ETR rule",
    value: "N20bn or MNE",
    copy: "Checked only for qualifying large groups or constituent MNE entities."
  }
];

const quickFacts = [
  {
    title: "PAYE relief lines",
    text: "The employee calculator surfaces rent relief, pension, NHF, NHIS, life assurance, and mortgage-interest fields."
  },
  {
    title: "Company classification",
    text: "The business calculator checks turnover, fixed assets, and professional-services status before deciding whether the company qualifies as small."
  },
  {
    title: "Source-backed guidance",
    text: "The guide page points users back to FIRS and LIRS materials before they rely on an estimate in payroll or finance discussions."
  }
];

const workflowPaths = [
  {
    title: "Employees and payroll teams",
    text: "Check how annual income and relief items affect monthly PAYE before salary reviews, onboarding, or payroll updates.",
    cta: "/calculator",
    ctaLabel: "Open PAYE calculator"
  },
  {
    title: "SMEs and finance leads",
    text: "Estimate company income tax, development levy, minimum-tax exposure, and the 15% effective-tax-rate top-up before a formal computation or adviser meeting.",
    cta: "/calculator",
    ctaLabel: "Open company calculator"
  },
  {
    title: "Founders and operations teams",
    text: "Use the guide and FAQ to verify thresholds, assumptions, and workflow questions before sharing figures internally.",
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
    title: "Choose the tax path",
    text: "Start with PAYE if you are reviewing salary impact, or switch to company tax if you are planning for a business."
  },
  {
    step: "02",
    title: "Enter real figures",
    text: "Use actual income, turnover, taxable profit, and relief figures instead of guessing from net pay or rough percentages."
  },
  {
    step: "03",
    title: "Verify before action",
    text: "Read the assumptions, cross-check the guide, and contact support if the scenario needs a closer look before filing."
  }
];

const coveragePoints = [
  "PAYE estimate with visible relief lines and monthly output",
  "Company income tax with the Act's small-company conditions",
  "Development levy, minimum-tax, and 15% ETR checks",
  "Guide page with public reference links",
  "FAQ, contact flow, and verified account access"
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
            <p>
              Estimate Nigerian PAYE and company tax with clearer assumptions, official-source guidance, and
              separate views for reliefs, thresholds, and minimum-tax checks.
            </p>

            <div className="landing-floating-row">
              <div className="floating-alert-card fade-up fade-up-delay-1">
                <strong>Built around real Nigerian tax decision points</strong>
                <span>Use the same platform for payroll reviews, SME planning, and source-backed tax explainers.</span>
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
            <h3>Designed for payroll reviews, SME tax planning, and practical verification before filing.</h3>
            <div className="landing-side-list">
              <div>
                <span>Primary use</span>
                <strong>PAYE, company income tax, and minimum-tax estimates</strong>
              </div>
              <div>
                <span>Audience</span>
                <strong>Employees, founders, payroll teams, and finance managers</strong>
              </div>
              <div>
                <span>Reference points</span>
                <strong>LIRS guidance, FIRS rate circulars, and calculator assumptions in one place</strong>
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
          title="A practical view of what this website helps Nigerian users do"
          copy="Get quick tax reference points before you move into calculation, support, or deeper tax reading."
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
            title="Choose the task that matches your tax question"
            copy="Start with the calculator, review the guide, or move into support depending on the kind of decision you need to make."
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
            title="Built for real Nigerian tax conversations"
            copy="Useful for salary reviews, tax planning, internal finance discussions, and client-facing explanations."
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
          title="A simple way to use the platform"
          copy="Follow these steps to move from estimate to verification with less back-and-forth."
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
            title="What the platform covers today"
            copy="The platform covers the most common areas users need before payroll, planning, and review meetings."
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
            <strong>Trust before conversion</strong>
            <p>See what the calculator covers, who it is for, and where official guidance still matters before you rely on an estimate.</p>
          </article>
          <article className="tax-highlight-card">
            <span>Operational value</span>
            <strong>Useful before payroll and finance decisions</strong>
            <p>Use the platform to prepare for payroll updates, finance reviews, adviser calls, and internal tax planning discussions.</p>
          </article>
        </div>
      </section>

      <section className="content-card split-card homepage-guardrail-card">
        <div>
          <SectionHeading
            eyebrow="Important"
            title="Use the estimates with the right expectation"
            copy="A tax site should not oversell certainty. It should help users move faster while still reminding them where verification matters."
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
