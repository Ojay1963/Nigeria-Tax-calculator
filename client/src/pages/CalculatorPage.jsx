import { startTransition, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { calculateCompanyTax, calculatePaye } from "../api/http";
import AdSlot from "../components/AdSlot";
import PageHero from "../components/PageHero";
import RelatedTools from "../components/RelatedTools";
import SeoHead from "../components/SeoHead";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatPercent } from "../lib/format";

const initialPayeForm = {
  annualIncome: "2500000",
  rent: "0",
  pension: "0",
  nhf: "0",
  nhis: "0",
  lifeInsurance: "0",
  housingLoanInterest: "0"
};

const initialCompanyForm = {
  annualTurnover: "120000000",
  assessableProfit: "24000000",
  taxableProfit: "20000000",
  frankedInvestmentIncome: "0",
  fixedAssets: "150000000",
  netProfitBeforeTax: "26000000",
  depreciationExpense: "3000000",
  personnelCost: "12000000",
  isProfessionalServicesBusiness: false,
  isMNEConstituentEntity: false,
  coveredTaxesPaid: "0"
};

const payePresets = [
  {
    label: "Young professional",
    values: {
      annualIncome: 4200000,
      rent: "600000",
      pension: "336000",
      nhf: "50000",
      nhis: "45000",
      lifeInsurance: "25000",
      housingLoanInterest: "0"
    }
  },
  {
    label: "Mid-level manager",
    values: {
      annualIncome: "9600000",
      rent: "1500000",
      pension: "768000",
      nhf: "120000",
      nhis: "80000",
      lifeInsurance: "50000",
      housingLoanInterest: "0"
    }
  },
  {
    label: "Executive with mortgage",
    values: {
      annualIncome: "24000000",
      rent: "0",
      pension: "1920000",
      nhf: "0",
      nhis: "120000",
      lifeInsurance: "120000",
      housingLoanInterest: "1400000"
    }
  }
];

const companyPresets = [
  {
    label: "Small trading company",
    values: {
      annualTurnover: 18000000,
      assessableProfit: "6500000",
      taxableProfit: "6500000",
      frankedInvestmentIncome: "0",
      fixedAssets: "5000000",
      netProfitBeforeTax: "7000000",
      depreciationExpense: "250000",
      personnelCost: "1800000",
      isProfessionalServicesBusiness: false,
      isMNEConstituentEntity: false,
      coveredTaxesPaid: "0"
    }
  },
  {
    label: "Professional services firm",
    values: {
      annualTurnover: "30000000",
      assessableProfit: "12000000",
      taxableProfit: "10000000",
      frankedInvestmentIncome: "0",
      fixedAssets: "18000000",
      netProfitBeforeTax: "12500000",
      depreciationExpense: "400000",
      personnelCost: "5500000",
      isProfessionalServicesBusiness: true,
      isMNEConstituentEntity: false,
      coveredTaxesPaid: "0"
    }
  },
  {
    label: "Large MNE constituent entity",
    values: {
      annualTurnover: "23000000000",
      assessableProfit: "180000000",
      taxableProfit: "130000000",
      frankedInvestmentIncome: "10000000",
      fixedAssets: "260000000",
      netProfitBeforeTax: "200000000",
      depreciationExpense: "10000000",
      personnelCost: "25000000",
      isProfessionalServicesBusiness: false,
      isMNEConstituentEntity: true,
      coveredTaxesPaid: "12000000"
    }
  }
];

const relatedTools = [
  {
    title: "VAT Calculator Nigeria",
    copy: "Check VAT-inclusive pricing after reviewing tax estimates.",
    to: "/vat-calculator-nigeria"
  },
  {
    title: "Loan Calculator Nigeria",
    copy: "Compare repayment with expected take-home pay or business cash flow.",
    to: "/loan-calculator-nigeria"
  },
  {
    title: "Profit Calculator Nigeria",
    copy: "Estimate business profit and margin after your company tax review.",
    to: "/profit-calculator-nigeria"
  }
];

function NumberField({ id, label, value, onChange, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input id={id} type="number" min="0" value={value} onChange={onChange} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export default function CalculatorPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("paye");
  const [payeForm, setPayeForm] = useState(initialPayeForm);
  const [companyForm, setCompanyForm] = useState(initialCompanyForm);
  const [payeResult, setPayeResult] = useState(null);
  const [companyResult, setCompanyResult] = useState(null);
  const [loading, setLoading] = useState({ paye: false, company: false });
  const [error, setError] = useState({ paye: "", company: "" });
  const [showActionShadow, setShowActionShadow] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowActionShadow(window.scrollY > 260);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "paye" || tab === "company") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  function updateNumberField(setter, currentState, field, value) {
    setter({ ...currentState, [field]: value });
  }

  async function submitPaye(event) {
    event.preventDefault();
    setLoading(current => ({ ...current, paye: true }));
    setError(current => ({ ...current, paye: "" }));

    try {
      const response = await calculatePaye(payeForm, token);
      startTransition(() => setPayeResult(response.data));
    } catch (submitError) {
      setError(current => ({ ...current, paye: submitError.message }));
    } finally {
      setLoading(current => ({ ...current, paye: false }));
    }
  }

  async function submitCompany(event) {
    event.preventDefault();
    setLoading(current => ({ ...current, company: true }));
    setError(current => ({ ...current, company: "" }));

    try {
      const response = await calculateCompanyTax(companyForm, token);
      startTransition(() => setCompanyResult(response.data));
    } catch (submitError) {
      setError(current => ({ ...current, company: submitError.message }));
    } finally {
      setLoading(current => ({ ...current, company: false }));
    }
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Naija Tax Calculator",
      description: "Calculate PAYE and company income tax for Nigerian salary and business planning.",
      url: "/calculator"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "Calculator", item: "/calculator" }
      ]
    }
  ];

  return (
    <div className="page-stack">
      <SeoHead
        title="Naija Tax Calculator | PAYE Calculator Nigeria and Company Tax Tools"
        description="Use Naija Tax Calculator for PAYE calculator Nigeria searches, salary tax planning, and company income tax estimate checks."
        schema={schema}
        canonicalPath="/calculator"
      />

      <PageHero
        eyebrow="Calculator"
        title="PAYE and company tax calculator for Nigerian planning"
        copy="Run employee and business tax estimates, then move into VAT, loan, and profit tools without leaving the site."
        actions={
          <>
            <Link className="button-primary" to={activeTab === "company" ? "/calculator?tab=company" : "/calculator?tab=paye"}>
              Start Calculating
            </Link>
            <Link className="button-secondary" to="/paye-calculator-nigeria">
              PAYE guide
            </Link>
          </>
        }
        aside={
          <div className="hero-stat-grid">
            <div className="metric-card">
              <span>Individual</span>
              <strong>PAYE estimate</strong>
              <p>Monthly and annual output.</p>
            </div>
            <div className="metric-card">
              <span>Business</span>
              <strong>Company tax estimate</strong>
              <p>CIT, levy, minimum tax, and 15% rule checks.</p>
            </div>
          </div>
        }
      />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Authority note"
          title="Built for tax checks, backed by context"
          copy="Last updated March 28, 2026. Based on Nigerian tax guidelines and planning assumptions. Use estimates as a starting point, then confirm final filing positions where needed."
        />
      </section>

      <section className="calculator-tabs">
        <button type="button" className={activeTab === "paye" ? "calculator-tab is-active" : "calculator-tab"} onClick={() => setActiveTab("paye")}>
          PAYE
          {payeResult ? (
            <span className="calculator-tab-badge" aria-label="PAYE result ready" title="PAYE result ready">
              <span className="calculator-tab-check" aria-hidden="true">Ready</span>
            </span>
          ) : null}
        </button>
        <button type="button" className={activeTab === "company" ? "calculator-tab is-active" : "calculator-tab"} onClick={() => setActiveTab("company")}>
          Company tax
          {companyResult ? (
            <span className="calculator-tab-badge" aria-label="Company tax result ready" title="Company tax result ready">
              <span className="calculator-tab-check" aria-hidden="true">Ready</span>
            </span>
          ) : null}
        </button>
      </section>

      <section className="calculator-grid">
        <article className={activeTab === "paye" ? "calculator-card" : "calculator-card calculator-card-hidden"}>
          <SectionHeading eyebrow="PAYE" title="Individual tax estimate" copy="Enter annual income and any reliefs that apply." />

          <div className="preset-row">
            {payePresets.map(preset => (
              <button key={preset.label} className="preset-button" type="button" onClick={() => setPayeForm(preset.values)}>
                {preset.label}
              </button>
            ))}
          </div>

          <form className="form-grid" onSubmit={submitPaye}>
            <NumberField
              id="annual-income"
              label="Annual gross income"
              value={payeForm.annualIncome}
              onChange={event => updateNumberField(setPayeForm, payeForm, "annualIncome", event.target.value)}
            />
            <NumberField
              id="rent"
              label="Annual rent deduction"
              value={payeForm.rent}
              onChange={event => updateNumberField(setPayeForm, payeForm, "rent", event.target.value)}
              hint="Rent relief is 20% of annual rent, capped at N500,000. Enter the eligible relief amount, not the full rent paid."
            />
            <NumberField
              id="pension"
              label="Pension contribution"
              value={payeForm.pension}
              onChange={event => updateNumberField(setPayeForm, payeForm, "pension", event.target.value)}
            />
            <NumberField
              id="nhf"
              label="NHF contribution"
              value={payeForm.nhf}
              onChange={event => updateNumberField(setPayeForm, payeForm, "nhf", event.target.value)}
              hint="National Housing Fund contribution."
            />
            <NumberField
              id="nhis"
              label="NHIS contribution"
              value={payeForm.nhis}
              onChange={event => updateNumberField(setPayeForm, payeForm, "nhis", event.target.value)}
              hint="National Health Insurance Scheme contribution."
            />
            <NumberField
              id="life-insurance"
              label="Life insurance premium"
              value={payeForm.lifeInsurance}
              onChange={event => updateNumberField(setPayeForm, payeForm, "lifeInsurance", event.target.value)}
            />
            <NumberField
              id="housing-loan-interest"
              label="Housing loan interest"
              value={payeForm.housingLoanInterest}
              onChange={event => updateNumberField(setPayeForm, payeForm, "housingLoanInterest", event.target.value)}
              hint="Owner-occupied residential mortgage interest."
            />
            <button className="button-primary" type="submit" disabled={loading.paye}>
              {loading.paye ? "Calculating..." : "Calculate PAYE"}
            </button>
          </form>

          {error.paye ? <p className="error-text">{error.paye}</p> : null}
          {payeResult ? (
            <div className="result-stack">
              <div className="result-highlight">
                <span>Estimated monthly PAYE</span>
                <strong>{formatCurrency(payeResult.monthlyTax)}</strong>
                <p>
                  Annual tax of {formatCurrency(payeResult.annualTax)} on taxable income of {formatCurrency(payeResult.taxableIncome)}.
                </p>
              </div>
              <div className="result-panel">
                <div className="result-row">
                  <span>Taxable income</span>
                  <strong>{formatCurrency(payeResult.taxableIncome)}</strong>
                </div>
                <div className="result-row">
                  <span>Annual tax</span>
                  <strong>{formatCurrency(payeResult.annualTax)}</strong>
                </div>
                <div className="result-row">
                  <span>Monthly PAYE</span>
                  <strong>{formatCurrency(payeResult.monthlyTax)}</strong>
                </div>
                <div className="result-row">
                  <span>Effective rate</span>
                  <strong>{formatPercent(payeResult.effectiveRate)}</strong>
                </div>
                <div className="result-row">
                  <span>Marginal rate</span>
                  <strong>{formatPercent(payeResult.marginalRate)}</strong>
                </div>
                <div className="result-row">
                  <span>Minimum wage exemption</span>
                  <strong>{payeResult.isMinimumWageExempt ? "Applied" : "Not applied"}</strong>
                </div>
              </div>
              <div className={showActionShadow ? "result-actions result-action-bar has-shadow" : "result-actions result-action-bar"}>
                <Link className="button-secondary" to="/contact" state={{ prefill: "I need help reviewing my PAYE result.", context: { kind: "paye", result: payeResult } }}>
                  Request tax support
                </Link>
                <Link
                  className="button-secondary"
                  to="/consultations"
                  state={{
                    prefill: {
                      taxUseCase: "Review my PAYE estimate and confirm the assumptions used.",
                      message: `Monthly PAYE estimate: N${Number(payeResult.monthlyTax || 0).toLocaleString()}`
                    },
                    context: { kind: "paye", result: payeResult }
                  }}
                >
                  Book consultation
                </Link>
                <Link className="button-secondary" to="/reports" state={{ kind: "paye", result: payeResult, prefill: "Need a reviewed PAYE PDF report." }}>
                  Order PDF report
                </Link>
              </div>
              <RelatedTools
                title="Try other tools after your PAYE result"
                copy="Users who finish a salary estimate often continue to loan, VAT, or profit tools."
                tools={relatedTools}
              />
            </div>
          ) : null}
        </article>

        <article className={activeTab === "company" ? "calculator-card" : "calculator-card calculator-card-hidden"}>
          <SectionHeading eyebrow="Company tax" title="Business estimate" copy="Enter turnover, profit, and any relevant company details." />

          <div className="preset-row">
            {companyPresets.map(preset => (
              <button key={preset.label} className="preset-button" type="button" onClick={() => setCompanyForm(preset.values)}>
                {preset.label}
              </button>
            ))}
          </div>

          <form className="form-grid" onSubmit={submitCompany}>
            <NumberField
              id="turnover"
              label="Annual turnover"
              value={companyForm.annualTurnover}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "annualTurnover", event.target.value)}
            />
            <NumberField
              id="assessable-profit"
              label="Assessable profit"
              value={companyForm.assessableProfit}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "assessableProfit", event.target.value)}
              hint="Used for the 4% development levy under the Act."
            />
            <NumberField
              id="taxable-profit"
              label="Taxable profit"
              value={companyForm.taxableProfit}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "taxableProfit", event.target.value)}
            />
            <NumberField
              id="franked-income"
              label="Franked investment income"
              value={companyForm.frankedInvestmentIncome}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "frankedInvestmentIncome", event.target.value)}
              hint="Used when minimum-tax logic matters."
            />
            <NumberField
              id="fixed-assets"
              label="Fixed assets"
              value={companyForm.fixedAssets}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "fixedAssets", event.target.value)}
              hint="Relevant to the small-company test under the Act."
            />
            <NumberField
              id="net-profit-before-tax"
              label="Net profit before tax"
              value={companyForm.netProfitBeforeTax}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "netProfitBeforeTax", event.target.value)}
              hint="Used only for the 15% effective-tax-rate check."
            />
            <NumberField
              id="depreciation-expense"
              label="Depreciation expense"
              value={companyForm.depreciationExpense}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "depreciationExpense", event.target.value)}
              hint="Used in the Act's profit base adjustment for the 15% effective-tax-rate rule."
            />
            <NumberField
              id="personnel-cost"
              label="Personnel cost"
              value={companyForm.personnelCost}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "personnelCost", event.target.value)}
              hint="Used in the Act's profit base adjustment for the 15% effective-tax-rate rule."
            />

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={companyForm.isProfessionalServicesBusiness}
                onChange={event => setCompanyForm({ ...companyForm, isProfessionalServicesBusiness: event.target.checked })}
              />
              <span>This company carries on professional services.</span>
            </label>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={companyForm.isMNEConstituentEntity}
                onChange={event => setCompanyForm({ ...companyForm, isMNEConstituentEntity: event.target.checked })}
              />
              <span>This company is a constituent entity of an MNE group.</span>
            </label>

            <NumberField
              id="covered-taxes"
              label="Covered taxes already paid"
              value={companyForm.coveredTaxesPaid}
              onChange={event => updateNumberField(setCompanyForm, companyForm, "coveredTaxesPaid", event.target.value)}
              hint="Only relevant where the 15% effective-tax-rate rule applies."
            />

            <button className="button-primary" type="submit" disabled={loading.company}>
              {loading.company ? "Calculating..." : "Calculate company tax"}
            </button>
          </form>

          {error.company ? <p className="error-text">{error.company}</p> : null}
          {companyResult ? (
            <div className="result-stack">
              <div className="result-highlight company-highlight">
                <span>Total estimated company tax</span>
                <strong>{formatCurrency(companyResult.totalEstimatedTax)}</strong>
                <p>
                  {companyResult.classification} case with {formatCurrency(companyResult.companyIncomeTax)} in company income tax before adjustments.
                </p>
              </div>
              <div className="result-panel">
                <div className="result-row">
                  <span>Classification</span>
                  <strong>{companyResult.classification}</strong>
                </div>
                <div className="result-row">
                  <span>Company income tax rate</span>
                  <strong>{formatPercent(companyResult.companyIncomeTaxRate)}</strong>
                </div>
                <div className="result-row">
                  <span>Assessable profit</span>
                  <strong>{formatCurrency(companyResult.assessableProfit)}</strong>
                </div>
                <div className="result-row">
                  <span>Company income tax</span>
                  <strong>{formatCurrency(companyResult.companyIncomeTax)}</strong>
                </div>
                <div className="result-row">
                  <span>Development levy</span>
                  <strong>{formatCurrency(companyResult.developmentLevy)}</strong>
                </div>
                <div className="result-row">
                  <span>Minimum tax</span>
                  <strong>{formatCurrency(companyResult.minimumTax)}</strong>
                </div>
                <div className="result-row">
                  <span>15% ETR rule</span>
                  <strong>{companyResult.isEffectiveTaxRuleApplicable ? "Applies" : "Does not apply"}</strong>
                </div>
                <div className="result-row">
                  <span>ETR profit base</span>
                  <strong>{formatCurrency(companyResult.globalMinimumTaxProfitBase)}</strong>
                </div>
                <div className="result-row">
                  <span>Global top-up</span>
                  <strong>{formatCurrency(companyResult.globalMinimumTopUpTax)}</strong>
                </div>
                <div className="result-row">
                  <span>Total estimate</span>
                  <strong>{formatCurrency(companyResult.totalEstimatedTax)}</strong>
                </div>
                <p className="note-text">{companyResult.note}</p>
              </div>
              <div className={showActionShadow ? "result-actions result-action-bar has-shadow" : "result-actions result-action-bar"}>
                <Link className="button-secondary" to="/contact" state={{ prefill: "I need help reviewing my company tax result.", context: { kind: "company", result: companyResult } }}>
                  Request tax support
                </Link>
                <Link
                  className="button-secondary"
                  to="/consultations"
                  state={{
                    prefill: {
                      taxUseCase: "Review my company tax estimate and advise on the next step.",
                      message: `Total estimate: N${Number(companyResult.totalEstimatedTax || 0).toLocaleString()}`
                    },
                    context: { kind: "company", result: companyResult }
                  }}
                >
                  Book consultation
                </Link>
                <Link className="button-secondary" to="/reports" state={{ kind: "company", result: companyResult, prefill: "Need a reviewed company tax PDF report." }}>
                  Order PDF report
                </Link>
                <Link className="button-secondary" to="/pricing">
                  Explore business plans
                </Link>
              </div>
              <RelatedTools
                title="Try other tools after your company tax result"
                copy="Move into profit, VAT, or expense-tracking pages to continue planning."
                tools={relatedTools}
              />
            </div>
          ) : null}
        </article>
      </section>

      <AdSlot className="mid-content-ad" label="Mid-content placement for calculator pages" />

      <section className="content-card deferred-section">
        <SectionHeading
          eyebrow="Did you know?"
          title="Simple tax and finance tips"
          copy="These quick notes help users understand what to do after a result and encourage deeper site exploration."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>PAYE estimates help before payroll meetings</h3>
            <p>Knowing the likely monthly deduction improves take-home-pay planning and salary review discussions.</p>
          </article>
          <article className="feature-card">
            <h3>Company tax is only one planning view</h3>
            <p>Business owners should also compare profit, VAT, loans, and expenses for a fuller picture.</p>
          </article>
          <article className="feature-card">
            <h3>Related tools reduce repeat searching</h3>
            <p>When users can move from tax to VAT or profit in one session, decisions become easier and faster.</p>
          </article>
        </div>
      </section>

      <RelatedTools
        title="Related calculators to keep exploring"
        copy="These suggestions improve retention and help users solve the next question immediately."
        tools={relatedTools}
      />
    </div>
  );
}
