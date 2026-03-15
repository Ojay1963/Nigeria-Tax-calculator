import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const submittedEmail = form.email;
      await register(form);
      navigate("/register/success", {
        replace: true,
        state: {
          email: submittedEmail
        }
      });
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
            title="Register for a verified Naija Tax Calculator account"
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
          <div className="auth-helper-row auth-helper-row-stack">
            <p className="auth-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="text-link">
                Log in
              </Link>
            </p>
            <p className="auth-switch-text">
              Need another verification email?{" "}
              <Link to="/verify-email" className="text-link">
                Resend verification
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
