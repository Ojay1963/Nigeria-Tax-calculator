import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { initializePaystackCheckout } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

function openPrintableReport(report) {
  const reportWindow = window.open("", "_blank", "width=900,height=700");
  if (!reportWindow) {
    return false;
  }

  reportWindow.document.write(`
    <html>
      <head>
        <title>Naija Tax Calculator Report Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #16212b; }
          h1, h2 { margin-bottom: 8px; }
          .card { border: 1px solid #d9e3ee; border-radius: 16px; padding: 20px; margin-bottom: 20px; }
          .row { display: flex; justify-content: space-between; gap: 16px; margin: 8px 0; }
          .muted { color: #62748a; }
          .actions { margin-top: 24px; display: flex; gap: 12px; }
          .button { border: 0; border-radius: 10px; padding: 12px 16px; cursor: pointer; font-size: 14px; }
          .button-primary { background: #125b9a; color: white; }
          .button-light { background: #eef4fb; color: #16212b; }
        </style>
      </head>
      <body>
        <h1>Naija Tax Calculator</h1>
        <p class="muted">Report preview generated from the calculator.</p>
        <div class="card">
          <h2>${report.title}</h2>
          ${report.rows.map(row => `<div class="row"><span>${row.label}</span><strong>${row.value}</strong></div>`).join("")}
        </div>
        <div class="card">
          <h2>Note</h2>
          <p class="muted">This preview is useful for internal sharing. The paid PDF workflow can be used when you need a reviewed, branded, or client-ready version.</p>
        </div>
        <div class="actions">
          <button class="button button-primary" onclick="window.print()">Print preview</button>
          <button class="button button-light" onclick="window.close()">Close</button>
        </div>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
  return true;
}

const initialOrder = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  calculationType: "PAYE",
  reportScope: "Reviewed PDF summary",
  taxUseCase: "",
  message: ""
};

export default function ReportsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [order, setOrder] = useState({
    ...initialOrder,
    name: user?.name || "",
    email: user?.email || "",
    calculationType: location.state?.kind === "company" ? "Company tax" : "PAYE",
    taxUseCase: location.state?.prefill || ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const previewReport = useMemo(() => {
    const result = location.state?.result;
    const kind = location.state?.kind;
    if (!result || !kind) {
      return null;
    }

    if (kind === "paye") {
      return {
        title: "PAYE estimate preview",
        rows: [
          { label: "Annual income", value: `N${Number(result.annualIncome || 0).toLocaleString()}` },
          { label: "Taxable income", value: `N${Number(result.taxableIncome || 0).toLocaleString()}` },
          { label: "Annual tax", value: `N${Number(result.annualTax || 0).toLocaleString()}` },
          { label: "Monthly PAYE", value: `N${Number(result.monthlyTax || 0).toLocaleString()}` }
        ]
      };
    }

    return {
      title: "Company tax estimate preview",
      rows: [
        { label: "Classification", value: result.classification || "-" },
        { label: "Company income tax", value: `N${Number(result.companyIncomeTax || 0).toLocaleString()}` },
        { label: "Development levy", value: `N${Number(result.developmentLevy || 0).toLocaleString()}` },
        { label: "Total estimate", value: `N${Number(result.totalEstimatedTax || 0).toLocaleString()}` }
      ]
    };
  }, [location.state]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await initializePaystackCheckout({
        type: "pdf_report",
        ...order,
        context: location.state?.result ? { result: location.state.result, kind: location.state.kind } : {}
      });
      window.location.assign(response.data.authorizationUrl);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenPreview() {
    if (!previewReport) {
      setStatus({ type: "error", message: "Run a calculation first to generate a preview." });
      return;
    }

    const opened = openPrintableReport(previewReport);
    if (!opened) {
      setStatus({
        type: "error",
        message: "The preview window was blocked by your browser. Allow popups for this site and try again."
      });
      return;
    }

    setStatus({ type: "", message: "" });
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Reports"
        title="Sell premium PDF tax reports from the calculator"
        copy="Use this page for the paid-report flow: free on-screen result, then an order for a reviewed or branded PDF summary."
      />
      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Preview"
            title="Give users a useful preview before the paid order"
            copy="A free preview builds trust. The paid offer is the reviewed or branded PDF version for sharing, filing prep, or client communication."
          />
          <div className="support-grid">
            <div className="feature-card">
              <h3>What the paid PDF can include</h3>
              <p>Input summary, tax breakdown, assumptions, branding, notes, and delivery support.</p>
            </div>
            <div className="feature-card">
              <h3>Why users pay</h3>
              <p>They want something printable, presentable, and easier to send to employers, finance teams, or clients.</p>
            </div>
            <div className="feature-card">
              <h3>Pricing</h3>
              <p>Reviewed PDF summary starts at N5,000, branded management report at N15,000, and client-ready pack at N25,000.</p>
            </div>
          </div>
          {previewReport ? (
            <button className="button-secondary" type="button" onClick={handleOpenPreview}>
              Open printable preview
            </button>
          ) : (
            <p className="note-text">Run a calculation first if you want this page prefilled with a live result preview.</p>
          )}
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field"><span>Name</span><input value={order.name} onChange={event => setOrder({ ...order, name: event.target.value })} /></label>
          <label className="field"><span>Email</span><input type="email" value={order.email} onChange={event => setOrder({ ...order, email: event.target.value })} /></label>
          <label className="field"><span>Phone</span><input value={order.phone} onChange={event => setOrder({ ...order, phone: event.target.value })} /></label>
          <label className="field"><span>Company name</span><input value={order.companyName} onChange={event => setOrder({ ...order, companyName: event.target.value })} /></label>
          <label className="field"><span>Calculation type</span><select value={order.calculationType} onChange={event => setOrder({ ...order, calculationType: event.target.value })}><option>PAYE</option><option>Company tax</option><option>Combined pack</option></select></label>
          <label className="field"><span>Report scope</span><select value={order.reportScope} onChange={event => setOrder({ ...order, reportScope: event.target.value })}><option>Reviewed PDF summary</option><option>Branded management report</option><option>Client-ready report pack</option></select></label>
          <label className="field field-wide"><span>Use case</span><textarea rows="4" value={order.taxUseCase} onChange={event => setOrder({ ...order, taxUseCase: event.target.value })} /></label>
          <label className="field field-wide"><span>Extra instructions</span><textarea rows="5" value={order.message} onChange={event => setOrder({ ...order, message: event.target.value })} /></label>
          <button className="button-primary" type="submit" disabled={submitting}>{submitting ? "Redirecting..." : "Pay with Paystack"}</button>
          {status.message ? <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p> : null}
        </form>
      </section>
    </div>
  );
}
