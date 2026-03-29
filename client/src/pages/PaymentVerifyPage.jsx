import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPaystackCheckout } from "../api/http";
import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import StatusPill from "../components/StatusPill";

export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || "";
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your Paystack payment...");
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference was found in the callback URL.");
      return;
    }

    verifyPaystackCheckout(reference)
      .then(response => {
        setPayment(response.data);
        setStatus(response.data.paymentStatus === "success" ? "success" : "error");
        setMessage(response.message);
      })
      .catch(error => {
        setStatus("error");
        setMessage(error.message);
      });
  }, [reference]);

  return (
    <div className="page-stack">
      <SeoHead
        title="Payment Status | Naija Tax Calculator"
        description="Verify your Paystack payment status for reports, subscriptions, or support services on Naija Tax Calculator."
        schema={[
          { "@context": "https://schema.org", "@type": "WebPage", name: "Payment Status", description: "Payment verification page for Naija Tax Calculator.", url: "/payment/verify" },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "/" }, { "@type": "ListItem", position: 2, name: "Payment Status", item: "/payment/verify" }] }
        ]}
        canonicalPath="/payment/verify"
      />
      <PageHero
        eyebrow="Payment"
        title="Paystack payment status"
        copy="This page confirms whether your payment was verified and whether the service request is now ready for follow-up."
      />

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow={status === "success" ? "Success" : status === "loading" ? "Verifying" : "Action needed"}
            title={status === "success" ? "Payment confirmed" : status === "loading" ? "Checking payment" : "Payment could not be confirmed"}
            copy={message}
          />
          {status === "success" ? <StatusPill label="Verified payment received" variant="success" /> : null}
          {status === "error" ? <StatusPill label="Payment needs attention" variant="warning" /> : null}
          {payment ? (
            <div className="support-grid">
              <div className="feature-card">
                <h3>Reference</h3>
                <p>{payment.reference}</p>
              </div>
              <div className="feature-card">
                <h3>Amount</h3>
                <p>{payment.currency} {Number(payment.amount || 0).toLocaleString()}</p>
              </div>
              <div className="feature-card">
                <h3>Payment status</h3>
                <StatusPill
                  label={payment.paymentStatus}
                  variant={payment.paymentStatus === "success" ? "success" : "warning"}
                  compact
                />
              </div>
              <div className="feature-card">
                <h3>Request status</h3>
                <p>{payment.status}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="improvement-list">
          <div className="improvement-item">
            {status === "success"
              ? "Your request has been recorded as paid, and the team can continue with delivery or follow-up."
              : "If you were charged but this page still shows an error, check the dashboard later or contact support with your reference."}
          </div>
          {status === "success" && payment?.type === "pdf_report" && payment?.downloadUrl ? (
            <a className="button-primary" href={payment.downloadUrl} target="_blank" rel="noreferrer">
              Download paid PDF
            </a>
          ) : null}
          <Link className="button-primary" to="/dashboard">
            Go to dashboard
          </Link>
          <Link className="button-secondary" to="/contact">
            Contact support
          </Link>
        </div>
      </section>
    </div>
  );
}
