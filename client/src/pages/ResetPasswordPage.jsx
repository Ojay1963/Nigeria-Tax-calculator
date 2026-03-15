import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, resetPassword } = useAuth();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!token) {
      setStatus({ type: "error", message: "This password reset link is missing a token." });
      return;
    }

    if (form.password.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setSubmitting(true);

    try {
      const response = await resetPassword({ token, password: form.password });
      setStatus({ type: "success", message: response.message });
      setTimeout(() => navigate("/login", { replace: true }), 1200);
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
            eyebrow="Password reset"
            title="Set a new password"
            copy="Choose a new password for your account. After saving, you will be redirected to log in."
          />
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              value={form.password}
              onChange={event => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={event => setForm({ ...form, confirmPassword: event.target.value })}
            />
          </label>
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Reset password"}
          </button>
          {status.message ? (
            <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p>
          ) : null}
          <div className="auth-helper-row auth-helper-row-stack">
            <p className="auth-switch-text">
              Need a fresh link?{" "}
              <Link to="/forgot-password" className="text-link">
                Request another reset email
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
