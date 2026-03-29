import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";

const relatedTools = [
  {
    title: "PAYE Calculator Nigeria",
    copy: "Estimate salary tax and monthly PAYE with simple inputs.",
    to: "/paye-calculator-nigeria"
  },
  {
    title: "VAT Calculator Nigeria",
    copy: "Split VAT from your selling price or add VAT quickly.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "Business Expense Tracker",
    copy: "Track income, expenses, and net profit in one place.",
    to: "/business-expense-tracker"
  }
];

export default function AboutPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Naija Tax Calculator",
      description: "Learn what Naija Tax Calculator does, who it helps, and how the site supports Nigerian tax and finance planning.",
      url: "/about"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "About", item: "/about" }
      ]
    }
  ];

  return (
    <div className="page-stack">
      <SeoHead
        title="About Naija Tax Calculator | Nigerian Tax and Finance Tools"
        description="About Naija Tax Calculator: simple tax and finance tools for Nigerian workers, business owners, and teams who need fast estimates and practical guidance."
        schema={schema}
        canonicalPath="/about"
      />

      <PageHero
        eyebrow="About"
        title="Why Naija Tax Calculator exists"
        copy="Naija Tax Calculator is built to give Nigerian workers, founders, and finance teams a simpler way to estimate taxes, compare numbers, and understand the basics before taking the next step."
        actions={
          <>
            <Link className="button-primary" to="/calculator">
              Start calculating
            </Link>
            <Link className="button-secondary" to="/contact">
              Contact us
            </Link>
          </>
        }
      />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="What we do"
          title="A practical tool hub for Nigerian tax and finance questions"
          copy="This website was created for people who need quick answers without reading overly technical material first."
        />
        <div className="reading-grid">
          <div className="reading-column">
            <p>
              Many Nigerians search for tax help when they are trying to answer a very practical question. They may
              want to know how much PAYE could come out of salary, how VAT affects a selling price, how a loan changes
              monthly cash flow, or whether a business is making real profit after expenses. In many cases, the
              available explanations online are either too short to be useful or too technical for everyday users. This
              site aims to close that gap.
            </p>
            <p>
              Naija Tax Calculator combines calculators with simple explanations so users can both estimate a figure
              and understand what the result means. The goal is not to replace a licensed adviser, accountant, or tax
              authority. The goal is to make planning easier, reduce confusion, and give Nigerian users a cleaner place
              to start before they make bigger financial decisions.
            </p>
          </div>
          <div className="reading-column">
            <p>
              We focus on everyday Nigerian use cases. That includes salary tax checks for employees, company-tax
              planning for business owners, VAT calculations for sellers and service providers, and simple profit or
              expense tools for small businesses. We also include beginner-friendly guide content because many users do
              not just want a number. They want context, next steps, and links to related tools in one place.
            </p>
            <p>
              Every estimate on this site should be treated as a planning aid. Tax outcomes can depend on the exact
              facts, current rules, filing positions, and how a specific transaction is classified. For that reason,
              our calculators are paired with visible disclaimers and contact options so users can move from quick
              estimates to professional follow-up where needed.
            </p>
          </div>
        </div>
      </section>

      <section className="content-card split-card deferred-section">
        <div>
          <SectionHeading
            eyebrow="Who it helps"
            title="Built for real users, not just tax professionals"
            copy="The site is designed to be useful for beginners while still being practical for more experienced teams."
          />
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Employees</h3>
            <p>Check likely PAYE, understand deductions, and plan take-home pay before salary discussions.</p>
          </article>
          <article className="feature-card">
            <h3>Small business owners</h3>
            <p>Estimate profit, review expenses, and understand how tax planning connects to daily business decisions.</p>
          </article>
          <article className="feature-card">
            <h3>Finance teams</h3>
            <p>Use quick tools to review assumptions before deeper internal analysis or external advice.</p>
          </article>
          <article className="feature-card">
            <h3>Founders and freelancers</h3>
            <p>Move quickly between tax, VAT, loan, and profit tools without searching across multiple sites.</p>
          </article>
        </div>
      </section>

      <section className="content-card split-card deferred-section">
        <div>
          <SectionHeading
            eyebrow="Trust note"
            title="Clear purpose, clear limitations"
            copy="The site is designed to be helpful, transparent, and trustworthy."
          />
        </div>
        <div className="improvement-list">
          <div className="improvement-item">Last updated: March 28, 2026</div>
          <div className="improvement-item">Based on Nigerian tax guidelines and common planning assumptions.</div>
          <div className="improvement-item">Estimates support planning only and should be confirmed where final filing matters.</div>
          <div className="improvement-item">Contact options are available for users who need deeper help beyond the calculators.</div>
        </div>
      </section>

      <RelatedTools
        title="Explore the main tools"
        copy="These pages help users continue from discovery into practical action."
        tools={relatedTools}
      />
    </div>
  );
}
