import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPricingPlans, initializePaystackCheckout } from "../api/http";
import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function PricingPage() {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    selectedPlan: "Business",
    taxUseCase: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPricingPlans()
      .then(response => setPlans(response.data))
      .catch(() => setPlans([]));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await initializePaystackCheckout(
        {
          type: "subscription",
          ...form
        },
        token
      );
      window.location.assign(response.data.authorizationUrl);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <SeoHead
        title="Naija Tax Calculator Pricing | Reports, Consultations, and Business Plans"
        description="View Naija Tax Calculator pricing for reviewed PDF reports, consultations, and business support plans."
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Naija Tax Calculator Pricing",
            description: "Pricing page for reports, consultations, and business tax support plans.",
            url: "/pricing"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Pricing", item: "/pricing" }
            ]
          }
        ]}
        canonicalPath="/pricing"
      />

      <PageHero
        eyebrow="Pricing"
        title="Pricing for reports, consultations, and business support"
        copy="Use the calculator for free, then choose a paid option when you need a reviewed PDF, one-on-one support, or a business-focused workflow."
        aside={
          <div className="hero-note-card">
            <strong>Built for real next steps</strong>
            <p>Useful for payroll teams, founders, finance managers, and users who need more than a quick estimate.</p>
          </div>
        }
      />

      <section className="content-card">
        <SectionHeading
          eyebrow="Plans"
          title="Packages for users who need more than a calculator result"
          copy="Most people start free, then upgrade when they need a reviewed report, professional support, or a recurring business setup."
        />
        <div className="feature-grid">
          {plans.map(plan => (
            <article className="feature-card pricing-card" key={plan.id}>
              <span className="eyebrow">{plan.name}</span>
              <h3>{plan.priceLabel}</h3>
              <p>{plan.audience}</p>
              <ul className="source-list">
                {plan.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="cta-row">
                {plan.id === "pro-report" ? (
                  <Link className="button-primary" to="/reports">
                    Order PDF report
                  </Link>
                ) : null}
                {plan.id === "business" ? (
                  <Link className="button-primary" to="/pricing#business">
                    Request business plan
                  </Link>
                ) : null}
                {plan.id === "starter" ? (
                  <Link className="button-primary" to="/calculator">
                    Use calculator
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="business" className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Business"
            title="What a business plan can help you do"
            copy="This option is best for SMEs, payroll teams, and finance users who need more than a one-off estimate."
          />
          <div className="support-grid">
            <div className="support-card">Saved employee and company scenarios</div>
            <div className="support-card">Priority support and tax follow-up</div>
            <div className="support-card">Team onboarding and workflow setup</div>
            <div className="support-card">Branded PDF reports and recurring use</div>
          </div>
        </div>
        <div className="improvement-list">
          <div className="improvement-item">Start free, then upgrade when your team needs history, exports, support, or recurring access.</div>
          <div className="improvement-item">This plan works best after you understand your workflow and want more consistency.</div>
          <Link className="button-primary" to="/contact">
            Talk about business setup
          </Link>
        </div>
      </section>

      <section className="content-card auth-layout">
        <div>
          <SectionHeading
            eyebrow="Subscription request"
            title="Request a business plan or support package"
            copy="Use this form if your SME, payroll team, or finance lead needs a recurring plan instead of a one-off calculation."
          />
          <div className="hero-note-card">
            <strong>Paystack checkout</strong>
            <p>Business subscriptions are paid online with Paystack only. After payment, the site verifies the transaction and returns you to the dashboard.</p>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field"><span>Name</span><input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
          <label className="field"><span>Email</span><input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
          <label className="field"><span>Phone</span><input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label>
          <label className="field"><span>Company name</span><input value={form.companyName} onChange={event => setForm({ ...form, companyName: event.target.value })} /></label>
          <label className="field"><span>Plan interest</span><select value={form.selectedPlan} onChange={event => setForm({ ...form, selectedPlan: event.target.value })}><option>Business</option><option>Pro Report</option><option>Starter to Business migration</option></select></label>
          <label className="field field-wide"><span>Use case</span><textarea rows="4" value={form.taxUseCase} onChange={event => setForm({ ...form, taxUseCase: event.target.value })} /></label>
          <label className="field field-wide"><span>What do you need for your team?</span><textarea rows="5" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} /></label>
          <button className="button-primary" type="submit" disabled={submitting}>{submitting ? "Redirecting..." : "Pay with Paystack"}</button>
          {status.message ? <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p> : null}
        </form>
      </section>
    </div>
  );
}
