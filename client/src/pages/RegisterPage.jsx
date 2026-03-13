import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await register(form);
      setStatus({
        type: "success",
        message: "Account created. Check your inbox for the Brevo verification email."
      });
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="content-card auth-layout">
        <div>
          <SectionHeading
            eyebrow="Create account"
            title="Register for a verified Tax Tools NG account"
            copy="Each account is email-verified so contact records and future saved tools are tied to a real user."
          />
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Full name</span>
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
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={event => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create account"}
          </button>
          {status.message ? (
            <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
