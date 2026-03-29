import { Link } from "react-router-dom";
import AdSlot from "../components/AdSlot";
import FaqSection from "../components/FaqSection";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";

const faqs = [
  {
    question: "How do I use this PAYE calculator Nigeria page?",
    answer:
      "Start with the PAYE calculator button on this page. Enter annual income and any relevant deductions to see taxable income, annual tax, and estimated monthly PAYE."
  },
  {
    question: "Is this useful as a salary tax calculator Nigeria workers can understand?",
    answer:
      "Yes. The page is written in simple English and explains what common deductions mean before you calculate."
  },
  {
    question: "Can employers and payroll teams use this page?",
    answer:
      "Yes. It is useful for payroll checks, salary reviews, and internal communication before final filing."
  }
];

const relatedTools = [
  {
    title: "VAT Calculator Nigeria",
    copy: "Check VAT-inclusive and VAT-exclusive prices for invoices and customer quotes.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "Profit Calculator Nigeria",
    copy: "Estimate gross profit, net profit, and margin for your business.",
    to: "/profit-calculator-nigeria"
  },
  {
    title: "Loan Calculator Nigeria",
    copy: "Compare monthly repayment and total interest before borrowing.",
    to: "/loan-calculator-nigeria"
  }
];

export default function PayeCalculatorNigeriaPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "PAYE Calculator Nigeria",
      description:
        "Estimate salary tax in Nigeria with a simple PAYE calculator page, beginner-friendly guidance, and links to related finance tools.",
      url: "/paye-calculator-nigeria"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "PAYE Calculator Nigeria", item: "/paye-calculator-nigeria" }
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
        title="PAYE Calculator Nigeria | Salary Tax Calculator Nigeria"
        description="Use this PAYE calculator Nigeria page to understand salary tax, taxable income, and monthly PAYE estimates in simple English."
        schema={schema}
        canonicalPath="/paye-calculator-nigeria"
      />

      <PageHero
        eyebrow="PAYE Calculator Nigeria"
        title="PAYE calculator Nigeria workers can use without confusion"
        copy="Check salary tax, taxable income, and estimated monthly PAYE before payroll reviews, salary negotiations, or tax planning conversations."
        actions={
          <>
            <Link className="button-primary" to="/calculator?tab=paye">
              Start Calculating
            </Link>
            <Link className="button-secondary" to="/guide">
              Read tax guide
            </Link>
          </>
        }
        aside={
          <div className="hero-stat-grid">
            <div className="metric-card">
              <span>Best for</span>
              <strong>Employees and payroll teams</strong>
              <p>Good for salary checks and quick PAYE planning.</p>
            </div>
            <div className="metric-card">
              <span>Last updated</span>
              <strong>March 28, 2026</strong>
              <p>Based on Nigerian tax guidelines and planning assumptions.</p>
            </div>
          </div>
        }
      />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Guide"
          title="How this salary tax calculator Nigeria page helps"
          copy="This page is written for Nigerians who want practical tax guidance before opening the full calculator."
        />
        <div className="reading-grid">
          <div className="reading-column">
            <p>
              A PAYE calculator Nigeria employees can trust should do two things well. First, it should help users see
              an estimate quickly. Second, it should explain the result in plain English. Many people do not just want a
              number. They want to know why the number changed, whether a deduction matters, and how their gross income
              compares to their likely taxable income. This page is designed around that need. It points you to the full
              PAYE calculator while also helping you understand the basics before you start.
            </p>
            <p>
              PAYE is especially important when workers are reviewing offers, planning budgets, or preparing for salary
              adjustments. Employers and payroll teams can also use a salary tax calculator Nigeria staff will
              understand, because it reduces confusion during payroll conversations. Instead of jumping straight to
              complex rules, you can begin with your annual income, then review relevant deductions and see how the
              result changes.
            </p>
          </div>
          <div className="reading-column">
            <p>
              This page also improves the user journey by connecting PAYE to related needs. Someone checking take-home
              pay today may also need a loan calculator tomorrow, or a VAT calculator for freelance work later in the
              week. Internal links help users stay on the site longer and find the next tool naturally. That is useful
              for both user experience and content discovery.
            </p>
            <p>
              When you are ready, open the full PAYE calculator using the button above. It includes the actual estimate
              flow, result breakdown, and additional support options if you need a second review.
            </p>
          </div>
        </div>
      </section>

      <AdSlot className="mid-content-ad" label="Mid-article ad placement for PAYE content pages" />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Did you know?"
          title="Quick PAYE tips"
          copy="Simple reminders that help users stay engaged and understand the result better."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Gross pay is not take-home pay</h3>
            <p>PAYE estimates become more useful when you compare annual income against deductions and monthly budgeting.</p>
          </article>
          <article className="feature-card">
            <h3>Small changes can affect monthly PAYE</h3>
            <p>A new salary level, pension amount, or eligible relief may change the result more than people expect.</p>
          </article>
          <article className="feature-card">
            <h3>Use estimates before payroll meetings</h3>
            <p>It is easier to discuss salary changes when you already understand the likely tax effect.</p>
          </article>
        </div>
      </section>

      <RelatedTools
        title="Try other tools after your PAYE estimate"
        copy="Users who finish a salary check often move to budgeting, VAT pricing, or business planning tools."
        tools={relatedTools}
      />

      <FaqSection title="PAYE calculator Nigeria FAQs" faqs={faqs} />
    </div>
  );
}
