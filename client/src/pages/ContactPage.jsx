import { startTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import { createMonetizationRequest, sendContact } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  audience: "Employee",
  message: ""
};

export default function ContactPage() {
  const { user, isAuthenticated } = useAuth();
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
      const response = await sendContact(form);
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
      await createMonetizationRequest({
        type: "support_lead",
        ...leadForm,
        context: location.state?.context || {}
      });
      setLeadStatus({
        type: "success",
        message: "Support lead submitted. You can now follow up from the admin workflow."
      });
    } catch (error) {
      setLeadStatus({ type: "error", message: error.message });
    } finally {
      setLeadSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Contact"
        title="Send a real support or tax-calculation question"
        copy="Use this page for support, product feedback, payroll questions, or a request to review a PAYE or company-tax scenario."
        aside={
          <div className="hero-note-card">
            <strong>What this page does</strong>
            <p>Collects structured messages and explains whether the request is linked to a signed-in account.</p>
          </div>
        }
      />
      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Use the form for support, workflow questions, or tax-estimate follow-up"
            copy="This works for payroll clarification, SME estimate questions, product feedback, or implementation requests."
          />
          <div className="contact-aside">
            <p>Useful information to include in your message:</p>
            <ul className="source-list">
              <li>Whether your question is about PAYE or company tax.</li>
              <li>The tax year or payroll period you are reviewing.</li>
              <li>The turnover, taxable profit, or income figures involved.</li>
            </ul>
            <p className="note-text">
              {isAuthenticated
                ? `Signed in as ${user?.email}. Your message can be associated with your account on the backend.`
                : "You can send a message without signing in, but registered users can later have a cleaner support history."}
            </p>
            <p className="note-text">
              For official public guidance, you can also review FIRS and LIRS materials linked on the guide page.
            </p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={event => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label className="field">
            <span>I am a...</span>
            <select
              value={form.audience}
              onChange={event => setForm({ ...form, audience: event.target.value })}
            >
              <option>Employee</option>
              <option>Founder</option>
              <option>Finance Manager</option>
              <option>Tax Adviser</option>
            </select>
          </label>
          <label className="field field-wide">
            <span>Message</span>
            <textarea
              rows="6"
              value={form.message}
              onChange={event => setForm({ ...form, message: event.target.value })}
            />
          </label>

          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </button>

          {status.message ? (
            <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p>
          ) : null}
        </form>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Tax support leads"
            title="Capture users who need paid help after seeing a tax result"
            copy="This form turns interested visitors into leads you can contact later for support, review, or paid services."
          />
          <div className="support-grid">
            <div className="feature-card">
              <h3>Best use</h3>
              <p>For users who want help but are not ready to book a consultation immediately.</p>
            </div>
            <div className="feature-card">
              <h3>Good monetization path</h3>
              <p>Support leads often become consultations, PDF report orders, or business-plan conversations.</p>
            </div>
          </div>
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
            {leadSubmitting ? "Submitting..." : "Submit support lead"}
          </button>

          {leadStatus.message ? (
            <p className={leadStatus.type === "error" ? "error-text" : "success-text"}>{leadStatus.message}</p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
