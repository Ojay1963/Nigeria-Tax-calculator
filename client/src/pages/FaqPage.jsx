import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import SeoHead from "../components/SeoHead";
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
      "The calculator follows the Nigeria Tax Act, 2025 more closely, including the minimum-wage PAYE exemption, the Fourth Schedule PIT rates, the small-company test at N50,000,000 turnover and N250,000,000 fixed assets, the 4% development levy, the 0.5% minimum tax, and the 15% effective-tax-rate rule for qualifying large groups."
  },
  {
    question: "What happens to contact messages?",
    answer:
      "They are sent to the backend, where they can be stored in the configured database and later reviewed through the support workflow."
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
      <SeoHead
        title="Naija Tax Calculator FAQ | PAYE, Company Tax, and Tool Questions"
        description="Read common questions about Naija Tax Calculator, including PAYE, company tax, assumptions, and support flows."
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Naija Tax Calculator FAQ",
            description: "Frequently asked questions about Naija Tax Calculator and its Nigerian tax tools.",
            url: "/faq"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "FAQ", item: "/faq" }
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
        ]}
        canonicalPath="/faq"
      />

      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        copy="Quick answers about the calculator, Nigerian tax assumptions, and how to use the site more confidently."
        aside={
          <div className="hero-note-card">
            <strong>Tip</strong>
            <p>Search by keyword to find an answer faster.</p>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          copy="Short answers before you calculate or contact support."
        />
        <label className="field faq-search">
          <span>Search FAQ</span>
          <input type="search" placeholder="Search by question or keyword" value={query} onChange={event => setQuery(event.target.value)} />
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
