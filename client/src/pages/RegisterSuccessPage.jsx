import { Link, Navigate, useLocation } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";

export default function RegisterSuccessPage() {
  const location = useLocation();
  const email = location.state?.email || "";

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="page-stack">
      <SeoHead
        title="Account Created | Naija Tax Calculator"
        description="Your Naija Tax Calculator account was created. Verify your email to activate it."
        canonicalPath="/register/success"
      />
      <section className="content-card auth-layout">
        <div>
          <SectionHeading
            eyebrow="Account created"
            title="Your account was created successfully"
            copy="Check your email for the verification link before you log in."
          />
          <div className="success-panel">
            <strong>Verification email sent to</strong>
            <p>{email}</p>
            <span>Open the message from Naija Tax Calculator and click the verification link to activate your account.</span>
          </div>
        </div>
        <div className="form-grid">
          <Link className="button-primary" to="/verify-email" state={{ email }}>
            Resend verification email
          </Link>
          <Link className="button-secondary" to="/login">
            Back to login
          </Link>
          <p className="auth-switch-text">
            If you do not see the message, check spam, promotions, or updates folders.
          </p>
        </div>
      </section>
    </div>
  );
}
