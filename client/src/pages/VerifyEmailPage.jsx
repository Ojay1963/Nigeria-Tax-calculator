import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
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
      <section className="content-card auth-layout">
        <div>
          <SectionHeading
            eyebrow="Email verification"
            title="Verify your account or request a new link"
            copy="If you opened this page from your email, the verification runs automatically. If not, request another message below."
          />
          {status.message ? (
            <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p>
          ) : null}
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
