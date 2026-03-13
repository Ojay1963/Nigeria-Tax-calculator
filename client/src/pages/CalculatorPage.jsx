import { startTransition, useState } from "react";
import { calculateCompanyTax, calculatePaye } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { formatCurrency, formatPercent } from "../lib/format";

const initialPayeForm = {
  annualIncome: 2500000,
  rent: 0,
  pension: 0,
  nhf: 0,
  nhis: 0,
  lifeInsurance: 0,
  housingLoanInterest: 0
};

const initialCompanyForm = {
  annualTurnover: 120000000,
  taxableProfit: 20000000,
  frankedInvestmentIncome: 0,
  fixedAssets: 0,
  isLargeQualifyingEntity: false,
  coveredTaxesPaid: 0
};

const payePresets = [
  {
    label: "Young professional",
    values: {
      annualIncome: 4200000,
      rent: 600000,
      pension: 336000,
      nhf: 50000,
      nhis: 45000,
      lifeInsurance: 25000,
      housingLoanInterest: 0
    }
  },
  {
    label: "Mid-level manager",
    values: {
      annualIncome: 9600000,
      rent: 1500000,
      pension: 768000,
      nhf: 120000,
      nhis: 80000,
      lifeInsurance: 50000,
      housingLoanInterest: 0
    }
  },
  {
    label: "Executive with mortgage",
    values: {
      annualIncome: 24000000,
      rent: 0,
      pension: 1920000,
      nhf: 0,
      nhis: 120000,
      lifeInsurance: 120000,
      housingLoanInterest: 1400000
    }
  }
];

const companyPresets = [
  {
    label: "Small services firm",
    values: {
      annualTurnover: 45000000,
      taxableProfit: 6500000,
      frankedInvestmentIncome: 0,
      fixedAssets: 5000000,
      isLargeQualifyingEntity: false,
      coveredTaxesPaid: 0
    }
  },
  {
    label: "Growing SME",
    values: {
      annualTurnover: 180000000,
      taxableProfit: 30000000,
      frankedInvestmentIncome: 0,
      fixedAssets: 35000000,
      isLargeQualifyingEntity: false,
      coveredTaxesPaid: 0
    }
  },
  {
    label: "Large qualifying group entity",
    values: {
      annualTurnover: 950000000,
      taxableProfit: 130000000,
      frankedInvestmentIncome: 10000000,
      fixedAssets: 260000000,
      isLargeQualifyingEntity: true,
      coveredTaxesPaid: 12000000
    }
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
  const [payeForm, setPayeForm] = useState(initialPayeForm);
  const [companyForm, setCompanyForm] = useState(initialCompanyForm);
  const [payeResult, setPayeResult] = useState(null);
  const [companyResult, setCompanyResult] = useState(null);
  const [loading, setLoading] = useState({ paye: false, company: false });
  const [error, setError] = useState({ paye: "", company: "" });

  async function submitPaye(event) {
    event.preventDefault();
    setLoading(current => ({ ...current, paye: true }));
    setError(current => ({ ...current, paye: "" }));

    try {
      const response = await calculatePaye(payeForm);
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
      const response = await calculateCompanyTax(companyForm);
      startTransition(() => setCompanyResult(response.data));
    } catch (submitError) {
      setError(current => ({ ...current, company: submitError.message }));
    } finally {
      setLoading(current => ({ ...current, company: false }));
    }
  }

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Calculator"
        title="Run employee and business tax scenarios from one place"
        copy="This page is built to stand on its own for payroll reviews, SME planning, and client walkthroughs. Use the presets for quick demos or fill the forms manually for custom cases."
        aside={
          <div className="hero-stat-grid">
            <div className="metric-card">
              <span>Individual calculator</span>
              <strong>PAYE estimate</strong>
              <p>Deduction-aware output with monthly and annual views.</p>
            </div>
            <div className="metric-card">
              <span>Business calculator</span>
              <strong>Company tax estimate</strong>
              <p>Classification, levy, minimum tax, and top-up logic in one place.</p>
            </div>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="Calculator suite"
          title="Estimate PAYE and company tax from the same workspace"
          copy="These figures are for planning and discussion. Filing outcomes can differ if your exact tax facts, reliefs, or qualifying-company status change."
        />
        <div className="trust-strip">
          <div className="trust-chip">
            <strong>Better input model</strong>
            <span>Deductions and tax bases are separated more clearly.</span>
          </div>
          <div className="trust-chip">
            <strong>Useful for teams</strong>
            <span>Preset scenarios make payroll and planning demos faster.</span>
          </div>
          <div className="trust-chip">
            <strong>Explains the result</strong>
            <span>Key totals are surfaced before the detailed breakdown.</span>
          </div>
        </div>
      </section>

      <section className="calculator-grid">
        <article className="calculator-card">
          <SectionHeading
            eyebrow="PAYE"
            title="Individual tax estimate"
            copy="Use annual gross income and add deduction lines that match your situation."
          />

          <div className="preset-row">
            {payePresets.map(preset => (
              <button
                key={preset.label}
                className="preset-button"
                type="button"
                onClick={() => setPayeForm(preset.values)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form className="form-grid" onSubmit={submitPaye}>
            <NumberField
              id="annual-income"
              label="Annual gross income"
              value={payeForm.annualIncome}
              onChange={event => setPayeForm({ ...payeForm, annualIncome: Number(event.target.value) })}
            />
            <NumberField
              id="rent"
              label="Annual rent deduction"
              value={payeForm.rent}
              onChange={event => setPayeForm({ ...payeForm, rent: Number(event.target.value) })}
            />
            <NumberField
              id="pension"
              label="Pension contribution"
              value={payeForm.pension}
              onChange={event => setPayeForm({ ...payeForm, pension: Number(event.target.value) })}
            />
            <NumberField
              id="nhf"
              label="NHF contribution"
              value={payeForm.nhf}
              onChange={event => setPayeForm({ ...payeForm, nhf: Number(event.target.value) })}
            />
            <NumberField
              id="nhis"
              label="NHIS contribution"
              value={payeForm.nhis}
              onChange={event => setPayeForm({ ...payeForm, nhis: Number(event.target.value) })}
            />
            <NumberField
              id="life-insurance"
              label="Life insurance premium"
              value={payeForm.lifeInsurance}
              onChange={event => setPayeForm({ ...payeForm, lifeInsurance: Number(event.target.value) })}
            />
            <NumberField
              id="housing-loan-interest"
              label="Housing loan interest"
              value={payeForm.housingLoanInterest}
              onChange={event =>
                setPayeForm({ ...payeForm, housingLoanInterest: Number(event.target.value) })
              }
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
                  Annual tax of {formatCurrency(payeResult.annualTax)} on taxable income of{" "}
                  {formatCurrency(payeResult.taxableIncome)}.
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
              </div>
            </div>
          ) : null}
        </article>

        <article className="calculator-card">
          <SectionHeading
            eyebrow="Company tax"
            title="Business estimate"
            copy="For cleaner planning, use turnover for classification and taxable profit for tax computation."
          />

          <div className="preset-row">
            {companyPresets.map(preset => (
              <button
                key={preset.label}
                className="preset-button"
                type="button"
                onClick={() => setCompanyForm(preset.values)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form className="form-grid" onSubmit={submitCompany}>
            <NumberField
              id="turnover"
              label="Annual turnover"
              value={companyForm.annualTurnover}
              onChange={event =>
                setCompanyForm({ ...companyForm, annualTurnover: Number(event.target.value) })
              }
            />
            <NumberField
              id="taxable-profit"
              label="Taxable profit"
              value={companyForm.taxableProfit}
              onChange={event =>
                setCompanyForm({ ...companyForm, taxableProfit: Number(event.target.value) })
              }
            />
            <NumberField
              id="franked-income"
              label="Franked investment income"
              value={companyForm.frankedInvestmentIncome}
              onChange={event =>
                setCompanyForm({
                  ...companyForm,
                  frankedInvestmentIncome: Number(event.target.value)
                })
              }
              hint="Used when minimum-tax logic matters."
            />
            <NumberField
              id="fixed-assets"
              label="Fixed assets"
              value={companyForm.fixedAssets}
              onChange={event => setCompanyForm({ ...companyForm, fixedAssets: Number(event.target.value) })}
              hint="Optional context for internal classification only."
            />

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={companyForm.isLargeQualifyingEntity}
                onChange={event =>
                  setCompanyForm({
                    ...companyForm,
                    isLargeQualifyingEntity: event.target.checked
                  })
                }
              />
              <span>This is a qualifying large entity for global minimum tax checks.</span>
            </label>

            <NumberField
              id="covered-taxes"
              label="Covered taxes already paid"
              value={companyForm.coveredTaxesPaid}
              onChange={event =>
                setCompanyForm({ ...companyForm, coveredTaxesPaid: Number(event.target.value) })
              }
              hint="Only relevant if the qualifying-entity box is checked."
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
                  {companyResult.classification} case with {formatCurrency(companyResult.companyIncomeTax)} in
                  company income tax before adjustments.
                </p>
              </div>
              <div className="result-panel">
              <div className="result-row">
                <span>Classification</span>
                <strong>{companyResult.classification}</strong>
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
                <span>Global top-up</span>
                <strong>{formatCurrency(companyResult.globalMinimumTopUpTax)}</strong>
              </div>
              <div className="result-row">
                <span>Total estimate</span>
                <strong>{formatCurrency(companyResult.totalEstimatedTax)}</strong>
              </div>
              <p className="note-text">{companyResult.note}</p>
              </div>
            </div>
          ) : null}
        </article>
      </section>

      <section className="content-card">
        <SectionHeading
          eyebrow="How to use this page"
          title="A calculator page that works even if users never visit the guide first"
          copy="The presets, explanations, and summaries are built to reduce hand-holding during live use."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Pick a scenario</h3>
            <p>Start with a preset when you need to demo quickly, then adjust figures to match the real case.</p>
          </article>
          <article className="feature-card">
            <h3>Read the summary first</h3>
            <p>The highlight cards surface the most important number before the detail rows take over the screen.</p>
          </article>
          <article className="feature-card">
            <h3>Move to guide or contact</h3>
            <p>If people question the logic, send them to the guide. If they need help, the contact page is ready next.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
