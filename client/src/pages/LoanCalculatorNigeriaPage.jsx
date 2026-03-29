import { useMemo, useState } from "react";
import AdSlot from "../components/AdSlot";
import FaqSection from "../components/FaqSection";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import { formatCurrency } from "../lib/format";

const faqs = [
  {
    question: "How does this loan calculator Nigeria page work?",
    answer:
      "Enter the loan amount, annual interest rate, and repayment period in months. The page estimates monthly repayment, total repayment, and total interest."
  },
  {
    question: "Can small business owners use it?",
    answer:
      "Yes. It is useful for both personal and business borrowing decisions, especially before taking inventory or expansion loans."
  },
  {
    question: "Why is a loan calculator helpful before borrowing?",
    answer:
      "It helps you estimate affordability before you commit, so you can compare repayment with expected income or business cash flow."
  }
];

const relatedTools = [
  {
    title: "Profit Calculator Nigeria",
    copy: "Check whether expected business profit can comfortably support a loan repayment.",
    to: "/profit-calculator-nigeria"
  },
  {
    title: "VAT Calculator Nigeria",
    copy: "Review pricing and tax effect alongside financing decisions.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "Business Expense Tracker",
    copy: "Track cash inflow and spending after you take a loan.",
    to: "/business-expense-tracker"
  }
];

export default function LoanCalculatorNigeriaPage() {
  const [form, setForm] = useState({
    principal: "500000",
    annualRate: "24",
    months: "12"
  });
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const principal = Number(form.principal);
    const annualRate = Number(form.annualRate);
    const months = Number(form.months);

    if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(months) || principal <= 0 || months <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / months;
      return {
        monthlyPayment,
        totalRepayment: principal,
        totalInterest: 0
      };
    }

    const monthlyPayment =
      (principal * monthlyRate * (1 + monthlyRate) ** months) /
      ((1 + monthlyRate) ** months - 1);

    return {
      monthlyPayment,
      totalRepayment: monthlyPayment * months,
      totalInterest: monthlyPayment * months - principal
    };
  }, [form]);

  function updateField(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const principal = Number(form.principal);
    const annualRate = Number(form.annualRate);
    const months = Number(form.months);

    if ([principal, annualRate, months].some(value => !Number.isFinite(value))) {
      setError("Enter valid numbers in all fields before calculating.");
      return;
    }

    if (principal <= 0 || annualRate < 0 || months <= 0) {
      setError("Loan amount and months must be more than zero, and interest rate cannot be negative.");
      return;
    }

    setError("");
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Loan Calculator Nigeria",
      description:
        "Estimate monthly repayment, total repayment, and total interest with this simple loan calculator Nigeria page.",
      url: "/loan-calculator-nigeria"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "Loan Calculator Nigeria", item: "/loan-calculator-nigeria" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ];

  return (
    <div className="page-stack">
      <SeoHead
        title="Loan Calculator Nigeria | Monthly Repayment Estimate"
        description="Free loan calculator Nigeria page for monthly repayment, total interest, and total repayment planning."
        schema={schema}
        canonicalPath="/loan-calculator-nigeria"
      />

      <PageHero
        eyebrow="Loan Calculator Nigeria"
        title="Loan calculator Nigeria users can check before borrowing"
        copy="Estimate monthly repayment, total repayment, and total interest so you can compare affordability before taking a personal or business loan."
        aside={
          <div className="hero-stat-grid">
            <div className="metric-card">
              <span>Best for</span>
              <strong>Salary earners and SMEs</strong>
              <p>Useful before taking short-term or business-support loans.</p>
            </div>
            <div className="metric-card">
              <span>Last updated</span>
              <strong>March 28, 2026</strong>
              <p>Built for planning and affordability checks.</p>
            </div>
          </div>
        }
      />

      <section className="content-card deferred-section">
        <SectionHeading eyebrow="Calculator" title="Loan repayment tool" copy="Enter your loan amount, annual rate, and repayment period." />
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Loan Amount</span>
            <input type="number" min="0" step="0.01" value={form.principal} onChange={event => updateField("principal", event.target.value)} />
          </label>
          <label className="field">
            <span>Annual Interest Rate (%)</span>
            <input type="number" min="0" step="0.01" value={form.annualRate} onChange={event => updateField("annualRate", event.target.value)} />
          </label>
          <label className="field">
            <span>Repayment Period (Months)</span>
            <input type="number" min="1" step="1" value={form.months} onChange={event => updateField("months", event.target.value)} />
          </label>
          <button className="button-primary" type="submit">
            Calculate repayment
          </button>
        </form>
        {error ? <p className="error-text">{error}</p> : null}
        {result ? (
          <div className="result-stack">
            <div className="result-highlight">
              <span>Estimated monthly repayment</span>
              <strong>{formatCurrency(result.monthlyPayment)}</strong>
              <p>Total repayment is {formatCurrency(result.totalRepayment)}.</p>
            </div>
            <div className="result-panel">
              <div className="result-row">
                <span>Monthly repayment</span>
                <strong>{formatCurrency(result.monthlyPayment)}</strong>
              </div>
              <div className="result-row">
                <span>Total repayment</span>
                <strong>{formatCurrency(result.totalRepayment)}</strong>
              </div>
              <div className="result-row">
                <span>Total interest</span>
                <strong>{formatCurrency(result.totalInterest)}</strong>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Guide"
          title="Why loan calculators increase smarter decisions"
          copy="People stay longer when a calculator also explains what the result means."
        />
        <div className="reading-grid">
          <div className="reading-column">
            <p>
              A loan calculator Nigeria users can trust is helpful because borrowing decisions often happen under
              pressure. Someone may want to restock a shop, handle school fees, buy equipment, or compare salary-backed
              loan offers. In those moments, monthly repayment matters more than the headline loan amount. A small
              difference in interest rate or repayment period can change affordability significantly, and many borrowers
              only discover that after they commit.
            </p>
            <p>
              This page gives you a simple way to estimate repayment before making that commitment. By entering principal,
              annual interest rate, and repayment months, you can see the expected monthly repayment, total repayment,
              and total interest. That makes it easier to ask a better question: can my salary or business cash flow
              carry this loan comfortably?
            </p>
          </div>
          <div className="reading-column">
            <p>
              The page also works well with the rest of the site. After calculating repayment, you may want to check a
              profit calculator, business expense tracker, or VAT tool. Those connected pages create a better user
              journey and support longer session time. A founder comparing financing options, for example, can move from
              loan repayment to profit planning without leaving the site.
            </p>
            <p>
              Use this result as a planning estimate, then confirm full loan terms, charges, and lender conditions before
              you sign any agreement.
            </p>
          </div>
        </div>
      </section>

      <AdSlot className="mid-content-ad" label="Mid-content placement for loan calculator pages" />

      <section className="content-card deferred-section">
        <SectionHeading eyebrow="Did you know?" title="Loan planning tips" copy="Helpful reminders for better borrowing decisions." />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Lower monthly repayment can mean longer cost</h3>
            <p>A longer tenor may reduce monthly strain but increase total interest paid.</p>
          </article>
          <article className="feature-card">
            <h3>Business loans should match business cash flow</h3>
            <p>Always compare repayment with expected monthly inflow, not only with projected annual profit.</p>
          </article>
          <article className="feature-card">
            <h3>Repayment should leave room for other bills</h3>
            <p>Check expenses and taxes too so the loan does not create avoidable pressure later.</p>
          </article>
        </div>
      </section>

      <RelatedTools title="Related tools for loan planning" copy="Users often compare repayment with profit, expenses, and tax estimates." tools={relatedTools} />

      <FaqSection title="Loan calculator Nigeria FAQs" faqs={faqs} />
    </div>
  );
}
