import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AdSlot from "../components/AdSlot";
import FaqSection from "../components/FaqSection";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import { formatCurrency } from "../lib/format";

const initialForm = {
  revenue: "",
  costOfGoodsSold: "",
  operatingExpenses: "",
  otherExpenses: "",
  taxAmount: ""
};

const fieldDetails = [
  {
    label: "Total Revenue / Sales",
    text: "The full amount your business made from selling goods or services before removing any costs."
  },
  {
    label: "Cost of Goods Sold",
    text: "The direct cost of producing or buying the goods you sold, such as stock, raw materials, or direct production costs."
  },
  {
    label: "Operating Expenses",
    text: "Day-to-day business costs like rent, salaries, transport, subscriptions, electricity, and marketing."
  },
  {
    label: "Other Expenses",
    text: "Extra costs that do not sit inside your regular operating expenses, such as one-off charges or bank fees."
  },
  {
    label: "Optional Tax Amount",
    text: "Any tax amount you want to remove from profit to see what is left after tax. You can leave this as zero if you do not need it."
  }
];

function NumberField({ id, label, value, onChange, hint, required = true }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input id={id} type="number" min="0" step="0.01" value={value} onChange={onChange} required={required} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function formatMargin(value) {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function parseCurrencyInput(value) {
  if (value === "") {
    return 0;
  }

  return Number(value);
}

export default function BusinessProfitCalculatorPage() {
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const isSeoRoute = location.pathname === "/profit-calculator-nigeria";

  const summaryCards = useMemo(
    () => [
      {
        label: "Built for",
        value: "Shop owners, founders, and SMEs"
      },
      {
        label: "Outputs",
        value: "Gross profit, net profit, and margin"
      }
    ],
    []
  );

  const faqs = [
    {
      question: "How do I calculate profit for a small business in Nigeria?",
      answer:
        "Start with revenue, subtract direct cost of sales to get gross profit, then remove operating and other expenses to get net profit before tax."
    },
    {
      question: "Why is profit margin useful?",
      answer:
        "Profit margin shows how much of every naira earned remains as profit before tax, which helps with pricing and cost control."
    },
    {
      question: "Can this profit calculator work for small business owners?",
      answer:
        "Yes. It is built for SMEs, founders, traders, and service businesses that want a quick and simple profitability view."
    }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isSeoRoute ? "Profit Calculator Nigeria" : "Business Profit Calculator",
      description:
        "Use this business profit calculator to estimate gross profit, net profit before tax, net profit after tax, and profit margin for Nigerian businesses.",
      url: location.pathname
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: isSeoRoute ? "Profit Calculator Nigeria" : "Business Profit Calculator",
          item: location.pathname
        }
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

  const relatedTools = [
    {
      title: "VAT Calculator Nigeria",
      copy: "Check how VAT affects your selling price before you review margin.",
      to: "/vat-calculator-nigeria"
    },
    {
      title: "Business Expense Tracker",
      copy: "Track income and expenses continuously after your first profit estimate.",
      to: "/business-expense-tracker"
    },
    {
      title: "Loan Calculator Nigeria",
      copy: "Compare expected profit against future loan repayments.",
      to: "/loan-calculator-nigeria"
    }
  ];

  function updateField(field, value) {
    setForm(current => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const revenue = parseCurrencyInput(form.revenue);
    const costOfGoodsSold = parseCurrencyInput(form.costOfGoodsSold);
    const operatingExpenses = parseCurrencyInput(form.operatingExpenses);
    const otherExpenses = parseCurrencyInput(form.otherExpenses);
    const taxAmount = parseCurrencyInput(form.taxAmount);

    if ([revenue, costOfGoodsSold, operatingExpenses, otherExpenses, taxAmount].some(value => Number.isNaN(value))) {
      setResult(null);
      setError("Enter valid numbers in all fields before calculating.");
      return;
    }

    if ([revenue, costOfGoodsSold, operatingExpenses, otherExpenses, taxAmount].some(value => value < 0)) {
      setResult(null);
      setError("Amounts cannot be negative. Please check your entries.");
      return;
    }

    if (revenue <= 0) {
      setResult(null);
      setError("Total revenue must be more than zero so the calculator can work out your profit margin.");
      return;
    }

    const grossProfit = revenue - costOfGoodsSold;
    const netProfitBeforeTax = grossProfit - operatingExpenses - otherExpenses;
    const netProfitAfterTax = netProfitBeforeTax - taxAmount;
    const profitMargin = (netProfitBeforeTax / revenue) * 100;

    setResult({
      revenue,
      grossProfit,
      netProfitBeforeTax,
      netProfitAfterTax,
      profitMargin,
      taxAmount
    });
  }

  return (
    <div className="page-stack">
      <SeoHead
        title={isSeoRoute ? "Profit Calculator Nigeria | Small Business Profit Tool" : "Business Profit Calculator | Naija Tax Calculator"}
        description={
          isSeoRoute
            ? "Free profit calculator Nigeria page for small businesses. Calculate gross profit, net profit, and profit margin instantly."
            : "Use the Business Profit Calculator to estimate gross profit, net profit before tax, net profit after tax, and profit margin for Nigerian businesses."
        }
        schema={schema}
        canonicalPath={isSeoRoute ? "/profit-calculator-nigeria" : "/business-profit-calculator"}
      />

      <PageHero
        eyebrow={isSeoRoute ? "Profit Calculator Nigeria" : "Business Profit Calculator"}
        title={isSeoRoute ? "Profit calculator Nigeria small businesses can use quickly" : "Check business profit in a simple, beginner-friendly way"}
        copy={
          isSeoRoute
            ? "Estimate gross profit, net profit, and profit margin with a clear tool built for Nigerian traders, founders, and small business owners."
            : "Estimate gross profit, net profit before tax, net profit after tax, and profit margin for your Nigerian business with clear labels and clean results."
        }
        aside={
          <div className="hero-stat-grid">
            {summaryCards.map(card => (
              <div className="metric-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
        }
      />

      {isSeoRoute ? (
        <section className="content-card deferred-section">
          <SectionHeading
            eyebrow="Guide"
            title="Why a profit calculator matters"
            copy="A simple profit tool helps business owners understand whether sales are truly translating into profit."
          />
          <div className="reading-grid">
            <div className="reading-column">
              <p>
                Many Nigerian small business owners know how much money comes in each day, but fewer know how much is
                left after cost of goods sold and operating expenses are removed. That is the gap a profit calculator
                helps fill. Revenue on its own can look encouraging, but profit is what supports growth, salaries, stock
                replacement, rent, and long-term planning. When you can see gross profit and net profit clearly, you are
                in a better position to make pricing and spending decisions.
              </p>
              <p>
                This page is written for people who need a simple answer first. Enter your revenue, your direct cost of
                sales, and your other expenses. The calculator then shows you gross profit, net profit before tax, net
                profit after tax, and profit margin. That single view can help a trader, service provider, or founder
                identify whether the business is making enough to support current plans.
              </p>
            </div>
            <div className="reading-column">
              <p>
                Profit margin is especially useful because it shows how much of every naira earned becomes profit before
                tax. That makes it easier to compare products, branches, or months. It also helps users understand why a
                business can generate sales and still struggle with cash flow if expenses are too high. Once you finish,
                try the business expense tracker or VAT calculator to continue planning without leaving the site.
              </p>
              <p>
                Last updated March 28, 2026. Based on Nigerian business planning use cases and simple tax-and-finance
                guidance for beginners.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="content-card business-profit-layout">
        <div className="business-profit-main">
          <SectionHeading
            eyebrow="Profit tool"
            title="Business Profit Calculator for Nigerian entrepreneurs"
            copy="Use your sales and expenses to see how much profit your business is making before tax and after tax."
          />

          <form className="form-grid business-profit-form" onSubmit={handleSubmit}>
            <NumberField
              id="business-revenue"
              label="Total Revenue / Sales"
              value={form.revenue}
              onChange={event => updateField("revenue", event.target.value)}
              hint="Enter the full amount earned from customers."
            />
            <NumberField
              id="business-cogs"
              label="Cost of Goods Sold"
              value={form.costOfGoodsSold}
              onChange={event => updateField("costOfGoodsSold", event.target.value)}
              hint="Example: stock purchases, raw materials, or direct production costs."
            />
            <NumberField
              id="business-operating-expenses"
              label="Operating Expenses"
              value={form.operatingExpenses}
              onChange={event => updateField("operatingExpenses", event.target.value)}
              hint="Example: rent, salaries, transport, internet, or marketing."
            />
            <NumberField
              id="business-other-expenses"
              label="Other Expenses"
              value={form.otherExpenses}
              onChange={event => updateField("otherExpenses", event.target.value)}
              hint="Use this for extra costs that do not fit your main operating expenses."
            />
            <NumberField
              id="business-tax-amount"
              label="Optional Tax Amount"
              value={form.taxAmount}
              onChange={event => updateField("taxAmount", event.target.value)}
              hint="Leave as 0 if you only want profit before tax."
              required={false}
            />

            <button className="button-primary business-profit-submit" type="submit">
              Calculate business profit
            </button>
          </form>

          {error ? <p className="error-text">{error}</p> : null}

          {result ? (
            <section className="business-profit-result" aria-live="polite">
              <div className="result-highlight business-profit-highlight">
                <span>Net profit before tax</span>
                <strong>{formatCurrency(result.netProfitBeforeTax)}</strong>
                <p>
                  From revenue of {formatCurrency(result.revenue)}, after removing direct and running costs.
                </p>
              </div>
              <div className="business-profit-result-grid">
                <div className="result-panel">
                  <div className="result-row">
                    <span>Gross Profit</span>
                    <strong>{formatCurrency(result.grossProfit)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Net Profit Before Tax</span>
                    <strong>{formatCurrency(result.netProfitBeforeTax)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Optional Tax Amount</span>
                    <strong>{formatCurrency(result.taxAmount)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Net Profit After Tax</span>
                    <strong>{formatCurrency(result.netProfitAfterTax)}</strong>
                  </div>
                  <div className="result-row">
                    <span>Profit Margin</span>
                    <strong>{formatMargin(result.profitMargin)}%</strong>
                  </div>
                </div>

                <div className="business-profit-summary-card">
                  <strong>What these numbers mean</strong>
                  <p>Gross profit shows what is left after direct cost of sales.</p>
                  <p>Net profit before tax shows what the business made before tax is removed.</p>
                  <p>Net profit after tax shows what remains after the optional tax amount is deducted.</p>
                  <p>Profit margin shows how much of every naira in sales becomes profit before tax.</p>
                </div>
              </div>

              <RelatedTools
                title="Try other tools after your profit result"
                copy="Move from profit estimation into VAT checks, expense tracking, or loan planning."
                tools={relatedTools}
              />
            </section>
          ) : null}
        </div>

        <aside className="business-profit-side">
          <div className="business-profit-note-card">
            <SectionHeading
              eyebrow="Field guide"
              title="Simple explanation of each field"
              copy="These notes are written for small business owners who want a quick understanding."
            />
            <div className="business-profit-note-list">
              {fieldDetails.map(item => (
                <div key={item.label} className="business-profit-note-item">
                  <strong>{item.label}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {isSeoRoute ? (
        <>
          <AdSlot className="mid-content-ad" label="Mid-content placement for profit guides and educational articles" />
          <section className="content-card deferred-section">
            <SectionHeading
              eyebrow="Did you know?"
              title="Simple business profit tips"
              copy="Short practical notes that help users stay longer and get more value from the page."
            />
            <div className="feature-grid">
              <article className="feature-card">
                <h3>Revenue is not profit</h3>
                <p>Sales can grow while profit falls if cost of goods sold and operating expenses rise too quickly.</p>
              </article>
              <article className="feature-card">
                <h3>Margin helps with pricing</h3>
                <p>A profit margin view makes it easier to know whether a price increase or cost reduction is needed.</p>
              </article>
              <article className="feature-card">
                <h3>Expense tracking improves accuracy</h3>
                <p>Your profit result gets better when expenses are recorded consistently instead of estimated from memory.</p>
              </article>
            </div>
          </section>
          <FaqSection title="Profit calculator Nigeria FAQs" faqs={faqs} />
        </>
      ) : null}

      {!isSeoRoute ? (
        <section className="content-card deferred-section">
          <SectionHeading
            eyebrow="Authority note"
            title="Built for practical business planning"
            copy="Last updated March 28, 2026. Based on Nigerian tax-and-finance planning guidance. Use estimates as a starting point, then confirm final positions with your adviser where needed."
          />
          <div className="cta-row">
            <Link className="button-primary" to="/profit-calculator-nigeria">
              Open SEO profit page
            </Link>
            <Link className="button-secondary" to="/business-expense-tracker">
              Track income and expenses
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
