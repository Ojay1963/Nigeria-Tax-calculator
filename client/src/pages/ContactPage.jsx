import { startTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import { createSupportLead, sendContact } from "../api/http";
import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  audience: "Employee",
  message: ""
};

export default function ContactPage() {
  const { user, isAuthenticated, token } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    companyName: "",
    taxUseCase: typeof location.state?.prefill === "string" ? location.state.prefill : "",
    message: ""
  });
  const [leadStatus, setLeadStatus] = useState({ type: "", message: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await sendContact(form, token);
      startTransition(() => {
        setStatus({ type: "success", message: response.message });
        setForm(initialForm);
      });
    } catch (submitError) {
      setStatus({ type: "error", message: submitError.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLeadSubmit(event) {
    event.preventDefault();
    setLeadSubmitting(true);
    setLeadStatus({ type: "", message: "" });

    try {
      await createSupportLead(
        {
          type: "support_lead",
          ...leadForm,
          context: location.state?.context || {}
        },
        token
      );
      setLeadStatus({
        type: "success",
        message: "Follow-up request submitted successfully. Someone can now review your request and get back to you."
      });
    } catch (error) {
      setLeadStatus({ type: "error", message: error.message });
    } finally {
      setLeadSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <SeoHead
        title="Contact Naija Tax Calculator | Tax Support and Questions"
        description="Contact Naija Tax Calculator for PAYE help, company tax questions, calculator support, or business tax follow-up."
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Contact Naija Tax Calculator",
            description: "Support and follow-up page for users who need tax help or calculator guidance.",
            url: "/contact"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Contact", item: "/contact" }
            ]
          }
        ]}
        canonicalPath="/contact"
      />

      <PageHero
        eyebrow="Contact"
        title="Contact Naija Tax Calculator support"
        copy="Send a question, request help with a calculation, or ask for follow-up support for PAYE, company tax, VAT, or business planning."
        aside={
          <div className="hero-note-card">
            <strong>Need help?</strong>
            <p>Use the first form for direct support and the second if you want a follow-up conversation later.</p>
          </div>
        }
      />

      <section className="content-card split-card">
        <div className="reading-column">
          <SectionHeading
            eyebrow="Contact"
            title="Support form"
            copy="Best for calculator questions, tax-estimate clarification, and general support."
          />
          <div className="contact-aside">
            <p>Helpful details to include:</p>
            <ul className="source-list">
              <li>Whether your question is about PAYE, VAT, company tax, or another tool.</li>
              <li>The tax year or business period involved.</li>
              <li>The key figures or result you want help reviewing.</li>
            </ul>
            <p className="note-text">
              {isAuthenticated ? `Signed in as ${user?.email}.` : "You can send a message without signing in."}
            </p>
            <p className="note-text">Last updated March 28, 2026. Built for simple Nigerian tax-planning support needs.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="field">
            <span>I am a...</span>
            <select value={form.audience} onChange={event => setForm({ ...form, audience: event.target.value })}>
              <option>Employee</option>
              <option>Founder</option>
              <option>Finance Manager</option>
              <option>Tax Adviser</option>
            </select>
          </label>
          <label className="field field-wide">
            <span>Message</span>
            <textarea rows="6" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} />
          </label>

          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </button>

          {status.message ? <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p> : null}
        </form>
      </section>

      <section className="content-card split-card">
        <div className="reading-column">
          <SectionHeading
            eyebrow="Follow-up support"
            title="Request a follow-up conversation"
            copy="Use this if you want a later follow-up for a business question, team setup, or more detailed tax support."
          />
        </div>

        <form className="form-grid" onSubmit={handleLeadSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={leadForm.name} onChange={event => setLeadForm({ ...leadForm, name: event.target.value })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={leadForm.email} onChange={event => setLeadForm({ ...leadForm, email: event.target.value })} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input value={leadForm.phone} onChange={event => setLeadForm({ ...leadForm, phone: event.target.value })} />
          </label>
          <label className="field">
            <span>Company name</span>
            <input value={leadForm.companyName} onChange={event => setLeadForm({ ...leadForm, companyName: event.target.value })} />
          </label>
          <label className="field field-wide">
            <span>Tax use case</span>
            <textarea rows="4" value={leadForm.taxUseCase} onChange={event => setLeadForm({ ...leadForm, taxUseCase: event.target.value })} />
          </label>
          <label className="field field-wide">
            <span>What kind of help do you need?</span>
            <textarea rows="5" value={leadForm.message} onChange={event => setLeadForm({ ...leadForm, message: event.target.value })} />
          </label>

          <button className="button-primary" type="submit" disabled={leadSubmitting}>
            {leadSubmitting ? "Submitting..." : "Request follow-up"}
          </button>

          {leadStatus.message ? <p className={leadStatus.type === "error" ? "error-text" : "success-text"}>{leadStatus.message}</p> : null}
        </form>
      </section>
    </div>
  );
}
