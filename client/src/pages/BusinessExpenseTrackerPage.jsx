import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdSlot from "../components/AdSlot";
import ExpenseTrackerEntryForm from "../components/ExpenseTrackerEntryForm";
import ExpenseTrackerEntryList from "../components/ExpenseTrackerEntryList";
import ExpenseTrackerSummaryCard from "../components/ExpenseTrackerSummaryCard";
import FaqSection from "../components/FaqSection";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import {
  buildEntry,
  calculateTrackerSummary,
  createExpenseTrackerCsv,
  EXPENSE_TRACKER_STORAGE_KEY,
  getDefaultEntryDate,
  getMonthlySummary,
  normalizeEntries
} from "../lib/expenseTracker";
import { formatCurrency } from "../lib/format";

const initialEntryDraft = {
  amount: "",
  description: "",
  date: getDefaultEntryDate()
};

const faqs = [
  {
    question: "How does this business expense tracker Nigeria page work?",
    answer:
      "Add income and expense entries with amount, description, and optional date. The page stores them in your browser and updates totals instantly."
  },
  {
    question: "Will my entries stay after refresh?",
    answer:
      "Yes. Entries are saved in local storage on your device unless you clear them manually or use a different browser."
  },
  {
    question: "Who is this tool for?",
    answer:
      "It is built for Nigerian traders, service providers, founders, and small business owners who want a simple way to track money in and money out."
  }
];

const relatedTools = [
  {
    title: "Profit Calculator Nigeria",
    copy: "Move from tracked expenses into a structured profit estimate.",
    to: "/profit-calculator-nigeria"
  },
  {
    title: "VAT Calculator Nigeria",
    copy: "Check pricing and VAT after reviewing your sales and expense records.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "Loan Calculator Nigeria",
    copy: "Compare your cash flow picture with potential loan repayments.",
    to: "/loan-calculator-nigeria"
  }
];

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric"
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

export default function BusinessExpenseTrackerPage() {
  const [activeType, setActiveType] = useState("income");
  const [drafts, setDrafts] = useState({
    income: { ...initialEntryDraft },
    expense: { ...initialEntryDraft }
  });
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [hasLoadedEntries, setHasLoadedEntries] = useState(false);

  useEffect(() => {
    try {
      const storedEntries = window.localStorage.getItem(EXPENSE_TRACKER_STORAGE_KEY);
      if (!storedEntries) {
        return;
      }

      setEntries(normalizeEntries(JSON.parse(storedEntries)));
    } catch {
      setEntries([]);
    } finally {
      setHasLoadedEntries(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedEntries) {
      return;
    }

    window.localStorage.setItem(EXPENSE_TRACKER_STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hasLoadedEntries]);

  const incomeEntries = useMemo(() => entries.filter(entry => entry.type === "income"), [entries]);
  const expenseEntries = useMemo(() => entries.filter(entry => entry.type === "expense"), [entries]);
  const totals = useMemo(() => calculateTrackerSummary(entries), [entries]);
  const monthlySummary = useMemo(() => getMonthlySummary(entries).slice(0, 6), [entries]);
  const form = useMemo(
    () => ({
      type: activeType,
      ...drafts[activeType]
    }),
    [activeType, drafts]
  );

  function updateForm(field, value) {
    if (field === "type") {
      setActiveType(value);
      return;
    }

    setDrafts(current => ({
      ...current,
      [activeType]: {
        ...current[activeType],
        [field]: value
      }
    }));
  }

  function resetForm(typeToReset = activeType) {
    setDrafts(current => ({
      ...current,
      [typeToReset]: {
        ...initialEntryDraft,
        date: getDefaultEntryDate()
      }
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || form.amount === "") {
      setError("Enter a valid amount before adding an entry.");
      return;
    }

    if (amount < 0) {
      setError("Amounts cannot be negative.");
      return;
    }

    if (amount === 0) {
      setError("Amount must be more than zero.");
      return;
    }

    const nextEntry = buildEntry({
      type: form.type,
      amount,
      description: form.description,
      date: form.date
    });

    setEntries(current => [nextEntry, ...current]);
    resetForm(form.type);
  }

  function handleDelete(entryId) {
    setEntries(current => current.filter(entry => entry.id !== entryId));
  }

  function handleClearAll() {
    setEntries([]);
    setDrafts({
      income: { ...initialEntryDraft, date: getDefaultEntryDate() },
      expense: { ...initialEntryDraft, date: getDefaultEntryDate() }
    });
    setActiveType("income");
    setError("");
  }

  function handleExportCsv() {
    if (entries.length === 0) {
      setError("Add at least one entry before exporting to CSV.");
      return;
    }

    const csvContent = createExpenseTrackerCsv(entries);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "business-expense-tracker.csv";
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Business Expense Tracker Nigeria",
      description:
        "Track income, expenses, and net profit with this simple business expense tracker for Nigerian small businesses.",
      url: "/business-expense-tracker"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "Business Expense Tracker Nigeria", item: "/business-expense-tracker" }
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
        title="Business Expense Tracker Nigeria | Track Income and Expenses Easily"
        description="Free business expense tracker Nigeria page for small businesses. Track income, expenses, and profit with a simple mobile-friendly tool."
        schema={schema}
        canonicalPath="/business-expense-tracker"
      />

      <PageHero
        eyebrow="Business Expense Tracker Nigeria"
        title="Track business income and expenses in a clear, beginner-friendly way"
        copy="Keep a running record of money you earned and money you spent so you can see total income, total expenses, and net profit without using complex software."
        aside={
          <div className="hero-stat-grid">
            <ExpenseTrackerSummaryCard label="Total Income" amount={totals.totalIncome} tone="success" />
            <ExpenseTrackerSummaryCard label="Total Expenses" amount={totals.totalExpenses} tone="warning" />
          </div>
        }
      />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Why it matters"
          title="Why tracking business expenses matters"
          copy="Small business owners often know what they sold today but not what they truly kept after transport, stock, rent, and daily spending."
        />
        <div className="reading-grid">
          <div className="reading-column">
            <p>
              A business expense tracker Nigeria entrepreneurs can use easily is valuable because many small businesses
              still depend on memory, WhatsApp messages, or scattered notes to track money. That makes it harder to know
              whether the business is truly profitable. When income and expenses are recorded in one place, the owner can
              see the real picture more quickly. This is useful for daily review, monthly planning, stock decisions, and
              simple conversations with accountants or advisers.
            </p>
            <p>
              This page is designed for beginners. You add income entries for money earned and expense entries for money
              spent. The tracker then totals both sides and shows net profit immediately. It also stores entries in your
              browser so you do not lose them when the page refreshes.
            </p>
          </div>
          <div className="reading-column">
            <p>
              The monthly summary makes the page even more useful for Nigerian traders and service providers who want a
              simple trend view. Instead of asking only "Did I sell today?", you can start asking "Was this month better
              than last month?" That shift helps business owners make better decisions. Once you finish here, you can
              move to the profit calculator, VAT calculator, or loan calculator using the related links below.
            </p>
            <p>
              Last updated March 28, 2026. Based on simple Nigerian small-business planning use cases. This tool is for
              tracking and estimation, not formal bookkeeping advice.
            </p>
          </div>
        </div>
      </section>

      <section className="content-card expense-tracker-layout deferred-section">
        <div className="expense-tracker-main">
          <SectionHeading
            eyebrow="Tracker"
            title="Business Expense Tracker for Nigerian small business owners"
            copy="Add each income or expense entry below. Your totals and net profit update automatically."
          />

          <ExpenseTrackerEntryForm form={form} onChange={updateForm} onSubmit={handleSubmit} />

          {error ? <p className="error-text">{error}</p> : null}

          <section className="expense-tracker-summary-grid">
            <ExpenseTrackerSummaryCard label="Money You Earned" amount={totals.totalIncome} tone="success" />
            <ExpenseTrackerSummaryCard label="Money You Spent" amount={totals.totalExpenses} tone="warning" />
            <ExpenseTrackerSummaryCard label="Net Profit" amount={totals.netProfit} tone={totals.netProfit >= 0 ? "neutral" : "danger"} />
          </section>

          <section className="expense-tracker-highlight">
            <div className="result-highlight expense-tracker-profit-box">
              <span>Net Profit</span>
              <strong>{formatCurrency(totals.netProfit)}</strong>
              <p>
                Total income of {formatCurrency(totals.totalIncome)} minus total expenses of {formatCurrency(totals.totalExpenses)}.
              </p>
            </div>
            <div className="expense-tracker-actions">
              <button className="button-secondary" type="button" onClick={handleExportCsv}>
                Export as CSV
              </button>
              <button className="button-secondary" type="button" onClick={handleClearAll} disabled={entries.length === 0}>
                Clear all entries
              </button>
            </div>
          </section>

          <div className="expense-tracker-list-grid">
            <ExpenseTrackerEntryList
              title="Money You Earned"
              entries={incomeEntries}
              emptyTitle="No income entries yet"
              emptyCopy="Add your sales, transfers, or any money the business received."
              onDelete={handleDelete}
            />
            <ExpenseTrackerEntryList
              title="Money You Spent"
              entries={expenseEntries}
              emptyTitle="No expense entries yet"
              emptyCopy="Add your stock, transport, rent, utility, and other business spending."
              onDelete={handleDelete}
            />
          </div>
        </div>

        <aside className="expense-tracker-side">
          <div className="expense-tracker-monthly-card">
            <SectionHeading
              eyebrow="Monthly summary"
              title="Quick monthly view"
              copy="This section uses entries with dates so you can review monthly income, expenses, and profit."
            />

            {monthlySummary.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">Month</span>
                <strong>No monthly summary yet</strong>
                <p>Add dates to your entries and your monthly summary will show here automatically.</p>
              </div>
            ) : (
              <div className="expense-tracker-monthly-list">
                {monthlySummary.map(item => (
                  <article className="expense-tracker-month-row" key={item.monthKey}>
                    <strong>{formatMonthLabel(item.monthKey)}</strong>
                    <div className="expense-tracker-month-metrics">
                      <span>Income: {formatCurrency(item.income)}</span>
                      <span>Expenses: {formatCurrency(item.expenses)}</span>
                      <span>Profit: {formatCurrency(item.netProfit)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>

      <AdSlot className="mid-content-ad" label="Mid-content placement for expense tracker guides and educational content" />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Did you know?"
          title="Simple money-tracking tips"
          copy="Short reminders that make the tracker easier to use and more useful over time."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Daily tracking is easier than memory</h3>
            <p>Small entries are easier to record daily than to reconstruct at the end of the week.</p>
          </article>
          <article className="feature-card">
            <h3>Descriptions improve clarity</h3>
            <p>Adding a short note like stock, transport, or transfer makes later review much easier.</p>
          </article>
          <article className="feature-card">
            <h3>Dates improve business decisions</h3>
            <p>Dated entries unlock the monthly summary and make trend checking more useful.</p>
          </article>
        </div>
      </section>

      <RelatedTools
        title="Try other tools after using the expense tracker"
        copy="Move from transaction tracking into VAT checks, profit planning, or loan decisions."
        tools={relatedTools}
      />

      <FaqSection title="Business expense tracker Nigeria FAQs" faqs={faqs} />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Next step"
          title="Turn your records into better planning"
          copy="After tracking income and expenses, the next useful step is usually profit estimation or VAT checking."
        />
        <div className="cta-row">
          <Link className="button-primary" to="/profit-calculator-nigeria">
            Open profit calculator
          </Link>
          <Link className="button-secondary" to="/vat-calculator-nigeria">
            Open VAT calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
