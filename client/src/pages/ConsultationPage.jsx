import { useState } from "react";
import { useLocation } from "react-router-dom";
import { initializePaystackCheckout } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  consultationType: "PAYE review",
  preferredDate: "",
  preferredTime: "",
  taxUseCase: "",
  message: ""
};

export default function ConsultationPage() {
  const { user } = useAuth();
  const location = useLocation();
  const preset = location.state?.prefill || {};
  const [form, setForm] = useState({
    ...initialForm,
    name: user?.name || "",
    email: user?.email || "",
    taxUseCase: preset.taxUseCase || "",
    message: preset.message || ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await initializePaystackCheckout({
        type: "consultation",
        ...form,
        context: location.state?.context || {}
      });
      window.location.assign(response.data.authorizationUrl);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Consultation"
        title="Book a paid tax consultation"
        copy="Use this flow when the calculator is not enough and you want a human review of PAYE, company tax, filings, or implementation questions."
      />
      <section className="content-card auth-layout">
        <div>
          <SectionHeading
            eyebrow="Booking"
            title="Turn a tax question into a paid service request"
            copy="This is the highest-value monetization path for lower traffic, because one booked session can outperform many ad views."
          />
          <div className="support-grid">
            <div className="feature-card"><h3>PAYE review</h3><p>Salary impact, relief checks, and payroll clarification.</p></div>
            <div className="feature-card"><h3>Company tax review</h3><p>Profit bases, development levy, minimum tax, and group-tax questions.</p></div>
            <div className="feature-card"><h3>Compliance guidance</h3><p>Use when a team needs help preparing for filing or internal review.</p></div>
            <div className="feature-card"><h3>Price</h3><p>Consultations start at N20,000 and are paid through Paystack before follow-up is booked.</p></div>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field"><span>Name</span><input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
          <label className="field"><span>Email</span><input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
          <label className="field"><span>Phone</span><input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label>
          <label className="field"><span>Company name</span><input value={form.companyName} onChange={event => setForm({ ...form, companyName: event.target.value })} /></label>
          <label className="field"><span>Consultation type</span><select value={form.consultationType} onChange={event => setForm({ ...form, consultationType: event.target.value })}><option>PAYE review</option><option>Company tax review</option><option>Filing guidance</option><option>Business subscription setup</option></select></label>
          <label className="field"><span>Preferred date</span><input type="date" value={form.preferredDate} onChange={event => setForm({ ...form, preferredDate: event.target.value })} /></label>
          <label className="field"><span>Preferred time</span><input type="time" value={form.preferredTime} onChange={event => setForm({ ...form, preferredTime: event.target.value })} /></label>
          <label className="field field-wide"><span>Tax use case</span><textarea rows="4" value={form.taxUseCase} onChange={event => setForm({ ...form, taxUseCase: event.target.value })} /></label>
          <label className="field field-wide"><span>Extra notes</span><textarea rows="5" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} /></label>
          <button className="button-primary" type="submit" disabled={submitting}>{submitting ? "Redirecting..." : "Pay with Paystack"}</button>
          {status.message ? <p className={status.type === "error" ? "error-text" : "success-text"}>{status.message}</p> : null}
        </form>
      </section>
    </div>
  );
}
