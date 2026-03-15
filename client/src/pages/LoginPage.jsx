import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form);
      setStatus({ type: "success", message: "Login successful. Redirecting to the calculator..." });
      setTimeout(() => navigate("/calculator"), 800);
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
            eyebrow="Account"
            title="Log in to continue"
            copy="Use your verified account to manage contact requests and future saved tax scenarios."
          />
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
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
          <div className="auth-helper-row">
            <Link to="/forgot-password" className="text-link">
              Forgot password?
            </Link>
            <Link to="/verify-email" className="text-link">
              Need a new verification email?
            </Link>
          </div>
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
          {status.message ? (
            <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p>
          ) : null}
          <p className="auth-switch-text">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-link">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
