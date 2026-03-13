import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";

const faqs = [
  {
    question: "Is this calculator suitable for filing returns directly?",
    answer:
      "No. It is designed for planning, communication, and estimation. Final filing should still be checked against official guidance and your exact facts."
  },
  {
    question: "Why does the company calculator ask for turnover, assessable profit, and taxable profit?",
    answer:
      "Turnover is used for the small-company and 15% effective-tax-rate thresholds, assessable profit is used for the 4% development levy, and taxable profit is used for company income tax."
  },
  {
    question: "Can HR teams use this for salary conversations?",
    answer:
      "Yes. The PAYE view is built to make monthly impact easier to explain to employees during onboarding, raises, and payroll reviews."
  },
  {
    question: "Which Nigerian tax facts are reflected on the site?",
    answer:
      "The calculator now follows the Nigeria Tax Act, 2025 more closely, including the minimum-wage PAYE exemption, the Fourth Schedule PIT rates, the small-company test at N50,000,000 turnover and N250,000,000 fixed assets, the 4% development levy, the 0.5% minimum tax, and the 15% effective-tax-rate rule for qualifying large groups."
  },
  {
    question: "What happens to contact messages?",
    answer:
      "They are sent to the backend, where they can be stored in the configured database and later reviewed from the admin workflow."
  }
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        item =>
          item.question.toLowerCase().includes(query.toLowerCase()) ||
          item.answer.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="FAQ"
        title="A searchable answer bank for common Nigerian tax-tool questions"
        copy="This page stands on its own when someone just needs quick answers about trust, tax assumptions, use cases, and calculator limits."
        aside={
          <div className="hero-note-card">
            <strong>Independent use</strong>
            <p>Share this route directly with teams that want answers before they touch the calculators.</p>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions teams usually ask before they trust a tax tool"
          copy="A production-ready calculator needs more than formulas. It needs enough explanation for users to know when to use it and when to verify with official guidance."
        />
        <label className="field faq-search">
          <span>Search FAQ</span>
          <input
            type="search"
            placeholder="Search by question or keyword"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </label>
        <div className="faq-list">
          {filteredFaqs.map(item => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
        {!filteredFaqs.length ? <p className="note-text">No FAQ matched your search.</p> : null}
      </section>
    </div>
  );
}
