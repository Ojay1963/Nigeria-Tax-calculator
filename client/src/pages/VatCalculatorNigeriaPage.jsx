import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdSlot from "../components/AdSlot";
import FaqSection from "../components/FaqSection";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import { formatCurrency } from "../lib/format";

const faqs = [
  {
    question: "How does this VAT calculator Nigeria page work?",
    answer:
      "Choose whether your number already includes VAT or whether VAT should be added. The calculator then shows the VAT amount and the value before or after VAT."
  },
  {
    question: "Is this useful for Nigerian businesses and freelancers?",
    answer:
      "Yes. It is useful for quotes, invoices, pricing checks, and quick customer calculations."
  },
  {
    question: "Can I use it on mobile?",
    answer: "Yes. The VAT calculator page is designed to be clean and mobile-friendly."
  }
];

const relatedTools = [
  {
    title: "PAYE Calculator Nigeria",
    copy: "Estimate salary tax and taxable income after you finish your VAT check.",
    to: "/paye-calculator-nigeria"
  },
  {
    title: "Profit Calculator Nigeria",
    copy: "See how pricing and expenses affect business profit and margin.",
    to: "/profit-calculator-nigeria"
  },
  {
    title: "Loan Calculator Nigeria",
    copy: "Plan repayment if you are funding inventory or business growth.",
    to: "/loan-calculator-nigeria"
  }
];

export default function VatCalculatorNigeriaPage() {
  const [mode, setMode] = useState("exclusive");
  const [amount, setAmount] = useState("100000");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return null;
    }

    if (mode === "exclusive") {
      const vatAmount = numericAmount * 0.075;
      return {
        baseAmount: numericAmount,
        vatAmount,
        totalAmount: numericAmount + vatAmount
      };
    }

    const baseAmount = numericAmount / 1.075;
    return {
      baseAmount,
      vatAmount: numericAmount - baseAmount,
      totalAmount: numericAmount
    };
  }, [amount, mode]);

  function handleSubmit(event) {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || amount === "") {
      setError("Enter a valid amount before calculating VAT.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Amount must be more than zero.");
      return;
    }

    setError("");
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "VAT Calculator Nigeria",
      description: "Use this VAT calculator Nigeria page to calculate VAT amount, VAT-inclusive price, and net value quickly.",
      url: "/vat-calculator-nigeria"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "VAT Calculator Nigeria", item: "/vat-calculator-nigeria" }
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
        title="VAT Calculator Nigeria | Calculate VAT Quickly"
        description="Free VAT calculator Nigeria page for businesses and freelancers. Calculate VAT amount, VAT-inclusive price, and value before VAT instantly."
        schema={schema}
        canonicalPath="/vat-calculator-nigeria"
      />

      <PageHero
        eyebrow="VAT Calculator Nigeria"
        title="VAT calculator Nigeria users can run in seconds"
        copy="Calculate VAT amount, value before VAT, and value after VAT with a simple tool built for Nigerian pricing checks."
        aside={
          <div className="hero-stat-grid">
            <div className="metric-card">
              <span>Use cases</span>
              <strong>Quotes, invoices, and pricing</strong>
              <p>Useful for shops, freelancers, and service businesses.</p>
            </div>
            <div className="metric-card">
              <span>Last updated</span>
              <strong>March 28, 2026</strong>
              <p>Based on Nigerian VAT planning use cases.</p>
            </div>
          </div>
        }
      />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Calculator"
          title="VAT calculator tool"
          copy="Choose whether your amount already includes VAT or whether VAT should be added to it."
        />
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="calculator-tabs">
            <button type="button" className={mode === "exclusive" ? "calculator-tab is-active" : "calculator-tab"} onClick={() => setMode("exclusive")}>
              Add VAT to amount
            </button>
            <button type="button" className={mode === "inclusive" ? "calculator-tab is-active" : "calculator-tab"} onClick={() => setMode("inclusive")}>
              Extract VAT from total
            </button>
          </div>
          <label className="field">
            <span>{mode === "exclusive" ? "Amount Before VAT" : "Amount Including VAT"}</span>
            <input type="number" min="0" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} />
          </label>
          <button className="button-primary" type="submit">
            Calculate VAT
          </button>
        </form>
        {error ? <p className="error-text">{error}</p> : null}
        {result ? (
          <div className="result-stack">
            <div className="result-highlight">
              <span>VAT amount</span>
              <strong>{formatCurrency(result.vatAmount)}</strong>
              <p>Total amount is {formatCurrency(result.totalAmount)}.</p>
            </div>
            <div className="result-panel">
              <div className="result-row">
                <span>Amount before VAT</span>
                <strong>{formatCurrency(result.baseAmount)}</strong>
              </div>
              <div className="result-row">
                <span>VAT amount</span>
                <strong>{formatCurrency(result.vatAmount)}</strong>
              </div>
              <div className="result-row">
                <span>Total amount</span>
                <strong>{formatCurrency(result.totalAmount)}</strong>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Guide"
          title="Why Nigerians search for a VAT calculator"
          copy="Most people need a VAT answer quickly, but they also want to know whether the figure includes tax already."
        />
        <div className="reading-grid">
          <div className="reading-column">
            <p>
              A VAT calculator Nigeria business owners can use quickly is valuable because pricing decisions happen fast.
              A customer may ask for a quote, a freelancer may need to raise an invoice, or a small business may want to
              separate VAT from the total amount charged. Without a clear calculator, users often guess or calculate
              manually, which leads to avoidable errors. That is why this page keeps the process simple. You can either
              add VAT to a base amount or remove VAT from a VAT-inclusive total.
            </p>
            <p>
              This is especially useful for businesses that want cleaner communication with customers. A clear VAT
              breakdown shows the net value, the tax amount, and the final price. It also helps users check whether a
              selling price still makes sense after tax is added. Beginners often stay on a page longer when the tool is
              simple and the explanation around it is easy to understand.
            </p>
          </div>
          <div className="reading-column">
            <p>
              This VAT calculator Nigeria page is therefore designed for both speed and retention. It gives you a quick
              result first, then offers related tools that help with the next task, such as profit planning or salary
              estimation. That makes the website more useful as a general Nigerian finance toolkit instead of a one-time
              stop. If you finish a VAT check and want to understand margin or business profit, the next tool is one
              click away.
            </p>
            <p>
              For best use, confirm your final tax treatment with the latest official guidance or a qualified adviser if
              your situation is more complex than a simple pricing check.
            </p>
          </div>
        </div>
      </section>

      <AdSlot className="mid-content-ad" label="Mid-content placement for VAT articles and finance guides" />

      <section className="content-card deferred-section">
        <SectionHeading eyebrow="Did you know?" title="Simple VAT tips" copy="These short points help users make better pricing decisions." />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>VAT changes the final selling price</h3>
            <p>Always check whether the amount you are quoting already includes VAT or not.</p>
          </article>
          <article className="feature-card">
            <h3>Invoices look clearer with a breakdown</h3>
            <p>Showing base amount and VAT separately can reduce confusion with customers.</p>
          </article>
          <article className="feature-card">
            <h3>Margin matters too</h3>
            <p>After checking VAT, use the profit calculator to see whether your pricing still supports your target margin.</p>
          </article>
        </div>
      </section>

      <RelatedTools title="Related calculators for VAT users" copy="Keep the session moving with other relevant finance tools." tools={relatedTools} />

      <FaqSection title="VAT calculator Nigeria FAQs" faqs={faqs} />
    </div>
  );
}
