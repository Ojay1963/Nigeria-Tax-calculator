import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import StatusPill from "../components/StatusPill";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const { verifyEmail, resendVerification } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(location.state?.email || "");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      return;
    }

    verifyEmail({ token })
      .then(response => {
        setStatus({ type: "success", message: response.message });
      })
      .catch(error => {
        setStatus({ type: "error", message: error.message });
      });
  }, [searchParams, verifyEmail]);

  async function handleResend(event) {
    event.preventDefault();
    setResending(true);
    try {
      const response = await resendVerification({ email });
      setStatus({ type: "success", message: response.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="page-stack">
      <SeoHead
        title="Verify Email | Naija Tax Calculator"
        description="Verify your Naija Tax Calculator account email or request a fresh verification link."
        canonicalPath="/verify-email"
      />
      <section className="content-card auth-layout">
        <div>
          <SectionHeading
            eyebrow="Email verification"
            title="Verify your account or request a new link"
            copy="If you opened this page from your email, the verification runs automatically. If not, request another message below."
          />
          {status.message ? <StatusPill label={status.message} variant={status.type === "error" ? "warning" : "success"} /> : null}
        </div>
        <form className="form-grid" onSubmit={handleResend}>
          <label className="field">
            <span>Email address</span>
            <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <button className="button-primary" type="submit" disabled={resending}>
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        </form>
      </section>
    </div>
  );
}
