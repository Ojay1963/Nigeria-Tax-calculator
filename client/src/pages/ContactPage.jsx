import { startTransition, useState } from "react";
import { useLocation } from "react-router-dom";
import { createSupportLead, sendContact } from "../api/http";
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
      await createSupportLead({
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
        title="Contact support"
        copy="Send a question, support request, or tax review enquiry."
        aside={
          <div className="hero-note-card">
            <strong>Need help?</strong>
            <p>Use the first form for support and the second for follow-up leads.</p>
          </div>
        }
      />
      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Support form"
            copy="Best for product questions and tax-estimate follow-up."
          />
          <div className="contact-aside">
            <p>Helpful details to include:</p>
            <ul className="source-list">
              <li>Whether your question is about PAYE or company tax.</li>
              <li>The tax year or payroll period.</li>
              <li>The key figures involved.</li>
            </ul>
            <p className="note-text">
              {isAuthenticated
                ? `Signed in as ${user?.email}.`
                : "You can send a message without signing in."}
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
            title="Request a follow-up"
            copy="Use this if you want us to get back to you later."
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
