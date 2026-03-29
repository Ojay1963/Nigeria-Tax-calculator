import { Link } from "react-router-dom";
import AdSlot from "../components/AdSlot";
import FaqSection from "../components/FaqSection";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";

const popularTools = [
  {
    title: "PAYE Calculator Nigeria",
    text: "Estimate salary tax, monthly PAYE, and taxable income for employees in Nigeria.",
    cta: "/paye-calculator-nigeria",
    ctaLabel: "Open PAYE tool"
  },
  {
    title: "VAT Calculator Nigeria",
    text: "Work out VAT-inclusive price, VAT amount, and net sale value in a few seconds.",
    cta: "/vat-calculator-nigeria",
    ctaLabel: "Use VAT calculator"
  },
  {
    title: "Loan Calculator Nigeria",
    text: "Plan repayments, interest cost, and monthly instalments before taking a loan.",
    cta: "/loan-calculator-nigeria",
    ctaLabel: "Check loan repayment"
  },
  {
    title: "Profit Calculator Nigeria",
    text: "See gross profit, net profit, and profit margin for your small business.",
    cta: "/profit-calculator-nigeria",
    ctaLabel: "Track business profit"
  }
];

const keywordSections = [
  {
    title: "PAYE calculator Nigeria",
    text: "If you are looking for a PAYE calculator Nigeria workers can use without confusion, this page helps you start quickly. Nigerian employees often want to know how much tax comes out of salary, how reliefs affect taxable income, and what the monthly PAYE figure may look like. Our PAYE tools are designed to make those checks easier before payroll discussions, salary negotiations, or tax planning conversations."
  },
  {
    title: "Salary tax calculator Nigeria",
    text: "Many people search for a salary tax calculator Nigeria professionals can trust when they want a practical estimate. That usually means understanding annual gross income, pension, housing-related deductions, and how each item changes taxable income. Naija Tax Calculator explains the numbers in plain English so beginners can follow the result."
  },
  {
    title: "Company income tax Nigeria",
    text: "Small business owners and finance teams also search for company income tax Nigeria guidance. Our platform helps you estimate company tax exposure, review turnover and profit assumptions, and understand development levy, minimum tax, and business profit planning in one place."
  },
  {
    title: "VAT calculator Nigeria",
    text: "When you need a VAT calculator Nigeria shoppers, freelancers, and business owners can use fast, simple answers matter. A clear VAT tool helps you separate the tax portion from the selling price, check the amount to charge, and avoid simple pricing mistakes."
  }
];

const financeArticles = [
  {
    title: "How PAYE works in Nigeria",
    copy: "PAYE means Pay As You Earn. It is the system used to deduct personal income tax from salary before the employee receives final pay. For most workers, the employer handles the deduction and remits it to the relevant tax authority. That is why a PAYE estimate is useful before payday or before a salary review. When you understand the likely tax amount, it becomes easier to plan take-home pay, pension contributions, and household budgeting. A good PAYE calculator also helps you see how tax reliefs may reduce taxable income. That matters when you are reviewing payroll records, comparing job offers, or checking whether a change in annual income could affect monthly deductions.",
    to: "/paye-calculator-nigeria"
  },
  {
    title: "How to reduce your tax legally",
    copy: "Reducing tax legally starts with understanding which reliefs, deductions, and allowable business costs apply to you. Employees may review pension, housing-related items, insurance, and other relevant deductions. Business owners should also track accurate records because poor records can make it hard to explain expenses, revenue, and profit. Tax planning does not mean hiding income. It means staying organised, using the correct structure, and calculating with the right inputs. If your numbers are clear, you can speak with an adviser more confidently and make better financial decisions. Good calculators support this process by giving you fast estimates before you make changes.",
    to: "/calculator"
  },
  {
    title: "What is VAT in Nigeria",
    copy: "VAT stands for Value Added Tax. In simple terms, it is a tax added to certain goods and services. Many buyers see the final price but do not always know how much of it is VAT. Business owners also need to know whether they should quote a net amount, a VAT-inclusive amount, or the tax amount separately. A VAT calculator helps with all three. It is useful for invoices, pricing, quick quotes, and checking how much tax is included in a sale. When business owners understand VAT clearly, they can price more accurately and communicate better with customers.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "How small businesses calculate profit",
    copy: "Profit is not the same as revenue. Revenue is the money coming in, while profit is what remains after costs are removed. Small businesses often make pricing or spending decisions based only on cash received, and that can create problems. A simple profit calculator helps you subtract cost of goods sold, operating expenses, and other expenses so you can see what is really left. Once you understand gross profit and net profit, you can make better decisions about stock levels, salaries, transport, rent, and growth. This is especially useful for Nigerian entrepreneurs who want a simple financial view without complicated accounting software.",
    to: "/profit-calculator-nigeria"
  }
];

const faqSchema = [
  {
    question: "What is the best PAYE calculator Nigeria workers can use?",
    answer: "A useful PAYE calculator should show taxable income, annual tax, monthly PAYE, and the effect of common deductions in clear language."
  },
  {
    question: "Can I use this website for salary tax calculator Nigeria searches?",
    answer: "Yes. The site includes a PAYE calculator, business tax tools, a VAT calculator, and additional finance tools built for Nigerian users."
  },
  {
    question: "Does Naija Tax Calculator cover company income tax Nigeria estimates?",
    answer: "Yes. The main calculator includes company tax estimation for turnover, profit, levy, and minimum-tax checks."
  }
];

const relatedTools = [
  {
    title: "PAYE Calculator Nigeria",
    copy: "Estimate salary tax and monthly PAYE with a beginner-friendly breakdown.",
    to: "/paye-calculator-nigeria"
  },
  {
    title: "VAT Calculator Nigeria",
    copy: "Split VAT from your selling price or add VAT to a base amount instantly.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "Loan Calculator Nigeria",
    copy: "Compare repayment plans before taking a business or personal loan.",
    to: "/loan-calculator-nigeria"
  }
];

export default function HomePage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Naija Tax Calculator",
      description:
        "Naija Tax Calculator helps Nigerians estimate PAYE, VAT, company tax, loans, and business profit with simple tools and explainers.",
      url: "/"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqSchema.map(item => ({
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
        title="PAYE Calculator Nigeria, VAT Calculator Nigeria & Tax Tools | Naija Tax Calculator"
        description="Use Naija Tax Calculator for PAYE calculator Nigeria searches, salary tax estimates, company income tax Nigeria checks, VAT calculation, loan planning, and business profit tools."
        schema={schema}
        canonicalPath="/"
      />

      <section className="landing-hero homepage-hero-lite">
        <div className="landing-hero-overlay" />
        <div className="landing-hero-grid">
          <div className="landing-hero-main fade-up">
            <span className="eyebrow light-eyebrow">Nigeria tax and finance tools</span>
            <h1>PAYE Calculator Nigeria, VAT Calculator Nigeria, and simple tax tools for everyday use</h1>
            <p>
              Naija Tax Calculator helps workers, founders, and finance teams estimate salary tax, company income tax,
              VAT, loan repayment, and business profit with practical explanations written for Nigerian users.
            </p>

            <section className="popular-tools-band" aria-labelledby="popular-tools-heading">
              <div className="popular-tools-head">
                <strong id="popular-tools-heading">Popular Tools</strong>
                <span>Start with the calculators people use most.</span>
              </div>
              <div className="popular-tools-grid">
                {popularTools.map(tool => (
                  <article className="popular-tool-card" key={tool.title}>
                    <h2>{tool.title}</h2>
                    <p>{tool.text}</p>
                    <Link className="text-link" to={tool.cta}>
                      {tool.ctaLabel}
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <div className="cta-row">
              <Link className="button-accent homepage-primary-cta" to="/calculator">
                Start Calculating
              </Link>
              <Link className="button-outline-light" to="/paye-calculator-nigeria">
                Open PAYE tool
              </Link>
              <Link className="button-ghost-dark" to="/vat-calculator-nigeria">
                Check VAT quickly
              </Link>
            </div>
          </div>

          <aside className="landing-hero-side fade-up fade-up-delay-3">
            <h2>Built to answer the searches Nigerians actually make.</h2>
            <div className="landing-side-list">
              <div>
                <span>Popular keywords</span>
                <strong>PAYE calculator Nigeria, salary tax calculator Nigeria, VAT calculator Nigeria</strong>
              </div>
              <div>
                <span>Best for</span>
                <strong>Employees, payroll teams, founders, SME operators, and finance managers</strong>
              </div>
              <div>
                <span>Trust note</span>
                <strong>Based on Nigerian tax guidelines and planning assumptions. Last updated March 28, 2026.</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-card split-card deferred-section">
        <div>
          <SectionHeading
            eyebrow="Search-friendly coverage"
            title="Useful answers for common Nigeria tax and finance searches"
            copy="These sections are designed to help people who want clear explanations before they use a calculator."
          />
        </div>
        <div className="keyword-section-list">
          {keywordSections.map(item => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Helpful guide"
          title="Understand Nigerian tax and finance in simple English"
          copy="People stay longer when they can calculate and learn in the same place. This homepage now works as both a tool hub and a beginner-friendly guide."
        />
        <div className="reading-grid">
          <div className="reading-column">
            <p>
              Many Nigerians search for a PAYE calculator Nigeria tool because they want a fast answer to a real
              question: how much tax comes out of salary, and what will be left after deductions? Others search for a
              salary tax calculator Nigeria workers can understand without reading complex tax language. This site is
              built for both needs. It gives you quick calculators first, then simple explanations to help you
              understand what the numbers mean. That matters because tax and finance decisions are easier when you can
              see the figures and read the context in one session.
            </p>
            <p>
              The homepage also supports users searching for company income tax Nigeria guidance. Small business owners
              often need more than a single result figure. They want to compare turnover and profit assumptions, review
              likely tax exposure, and understand how business profit connects to broader tax planning. That is why the
              site now links tax tools, profit tools, and educational content together. A founder can move from a VAT
              calculator to a profit calculator, then to a tax explainer, without leaving the website.
            </p>
          </div>
          <div className="reading-column">
            <p>
              VAT is another area where quick answers save time. A VAT calculator Nigeria sellers can trust should
              separate the tax amount clearly and show the before-tax value without forcing users to calculate it
              manually. The same idea applies to loans and profit planning. When the interface is simple and the labels
              are clear, more people are willing to continue exploring instead of bouncing after one page view. That
              creates a stronger user journey and helps the site serve more search intents from one visit.
            </p>
            <p>
              Naija Tax Calculator is therefore positioned as a practical Nigerian finance toolkit, not just a single
              tax form. The goal is to help users calculate, learn, compare related tools, and find the next action
              quickly. Whether you are an employee checking PAYE, a freelancer reviewing VAT pricing, or a business
              owner trying to understand profit, the site gives you a clear path to the next relevant tool.
            </p>
          </div>
        </div>
      </section>

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Learn Nigerian Tax & Finance"
          title="Short articles for beginners"
          copy="These practical reads are designed to increase session time while helping users understand what to do next."
        />
        <div className="article-grid">
          {financeArticles.map(article => (
            <article className="journey-card article-card" key={article.title}>
              <h3>{article.title}</h3>
              <p>{article.copy}</p>
              <Link className="text-link" to={article.to}>
                Continue with this tool
              </Link>
            </article>
          ))}
        </div>
      </section>

      <AdSlot className="mid-content-ad" label="Mid-content placement for responsive homepage ads" />

      <RelatedTools
        title="Try other calculators after your first result"
        copy="Internal links keep the experience simple and help users discover related tools without searching again."
        tools={relatedTools}
      />

      <FaqSection title="Popular Nigeria tax and calculator questions" faqs={faqSchema} />

      <section className="content-card split-card homepage-guardrail-card deferred-section">
        <div>
          <SectionHeading
            eyebrow="Trust and authority"
            title="Built for planning, backed by clear context"
            copy="Use these tools for estimation and internal review, then confirm final filing with the relevant tax authority or an adviser."
          />
        </div>
        <div className="improvement-list">
          <div className="improvement-item">Last updated: March 28, 2026</div>
          <div className="improvement-item">Based on Nigerian tax guidelines and common planning assumptions.</div>
          <div className="improvement-item">Disclaimer: estimates support planning only and should not replace professional advice.</div>
        </div>
      </section>
    </div>
  );
}
