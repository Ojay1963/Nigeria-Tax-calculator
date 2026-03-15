import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
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
      const response = await forgotPassword({ email });
      setStatus({ type: "success", message: response.message });
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
            title="Request a reset link"
            copy="Enter the email address tied to your account and we will send a password reset link if it exists."
          />
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </button>
          {status.message ? (
            <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p>
          ) : null}
          <div className="auth-helper-row auth-helper-row-stack">
            <p className="auth-switch-text">
              Remembered your password?{" "}
              <Link to="/login" className="text-link">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
