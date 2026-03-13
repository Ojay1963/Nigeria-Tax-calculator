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
    question: "Why does the company calculator ask for taxable profit and turnover?",
    answer:
      "Turnover helps classify the business, while taxable profit is the more realistic base for company income tax in a standard estimate."
  },
  {
    question: "Can HR teams use this for salary conversations?",
    answer:
      "Yes. The PAYE view is built to make monthly impact easier to explain to employees during onboarding, raises, and payroll reviews."
  },
  {
    question: "What happens to contact messages?",
    answer:
      "They are stored on the server in a local log file so you can review them later or wire them into email or CRM automation."
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
        title="A searchable answer bank for common tax-tool questions"
        copy="This page stands on its own when someone just needs quick answers about trust, use cases, and calculator limits."
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
          copy="A production-ready calculator needs more than formulas. It needs enough explanation that people know when to use it and when to double-check."
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
