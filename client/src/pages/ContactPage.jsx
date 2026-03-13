import { startTransition, useState } from "react";
import { sendContact } from "../api/http";
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
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Contact"
        title="Reach the team without leaving the product flow"
        copy="This page is designed to be fully usable on its own for support, product feedback, or client follow-up requests."
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
            title="Turn the calculator into a better client conversation"
            copy="Use the form for feedback, support requests, or ideas for payroll and SME workflows."
          />
          <div className="contact-aside">
            <p>Suggested next improvements for this product:</p>
            <ul className="source-list">
              <li>Add downloadable PDF summaries for payroll teams.</li>
              <li>Add scenario saving for HR and finance users.</li>
              <li>Add state-specific explanatory notes where administration differs.</li>
            </ul>
            <p className="note-text">
              {isAuthenticated
                ? `Signed in as ${user?.email}. Your message can now be associated with your account on the backend.`
                : "You can send a message without signing in, but registered users will later be able to track requests more cleanly."}
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
    </div>
  );
}
