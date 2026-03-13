import { useEffect, useState } from "react";
import { getTaxAssumptions } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { implementationNotes, sourceLinks } from "../lib/assumptions";

const guideRows = [
  {
    title: "PAYE model",
    text: "The calculator treats the employee result as annual tax first, then derives a monthly PAYE estimate for payroll discussion."
  },
  {
    title: "Visible relief items",
    text: "Relief lines such as rent relief, pension, NHF, NHIS, life assurance, and owner-occupied mortgage interest are shown explicitly instead of being buried in the formula."
  },
  {
    title: "Company logic",
    text: "Company tax uses turnover, fixed assets, and professional-services status for the small-company test, then applies company income tax, development levy, minimum tax, and the 15% effective-tax-rate rule where relevant."
  },
  {
    title: "Compliance warning",
    text: "The site is for estimating and explaining, not for filing final returns without checking the latest official guidance and your exact facts."
  }
];

export default function GuidePage() {
  const [apiAssumptions, setApiAssumptions] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getTaxAssumptions()
      .then(response => {
        setApiAssumptions(response.data);
      })
      .catch(() => {
        setStatus("Live assumptions could not be loaded, so local guide notes are shown.");
      });
  }, []);

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Guide"
        title="Use the tax guide as a standalone Nigerian tax briefing page"
        copy="This page is for teams that need context before calculation. It works as a quick briefing document, a pre-meeting reference, and a source list you can share directly."
        aside={
          <div className="hero-note-card">
            <strong>Best use cases</strong>
            <p>Client onboarding, payroll briefings, internal tax explainers, and prep before using the calculator.</p>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="Tax guide"
          title="Implementation notes and official links"
          copy="This is where the site becomes more trustworthy: the assumptions are visible, the sources are linked, and the limits are stated plainly."
        />
        <div className="feature-grid">
          {guideRows.map(row => (
            <article className="feature-card" key={row.title}>
              <h3>{row.title}</h3>
              <p>{row.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card split-card">
        <div>
          <SectionHeading
            eyebrow="Current assumptions"
            title="What the calculator assumes today"
            copy="These should be reviewed whenever FIRS, LIRS, or another relevant revenue authority publishes more detailed implementation guidance."
          />
          <ul className="source-list">
            {(apiAssumptions.length ? apiAssumptions : implementationNotes).map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          {status ? <p className="note-text">{status}</p> : null}
        </div>
        <div>
          <SectionHeading
            eyebrow="Official reading"
            title="Primary sources to keep nearby"
            copy="These are the main public references used to replace placeholder copy with real Nigerian tax information."
          />
          <ul className="source-list">
            {sourceLinks.map(source => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-card">
        <SectionHeading
          eyebrow="Use this page independently"
          title="How to use the guide without opening the calculator first"
          copy="If you are onboarding a client or preparing internal documentation, this page is meant to stand on its own."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Start with assumptions</h3>
            <p>Read the current tax logic first so people understand what the estimate includes and what it does not.</p>
          </article>
          <article className="feature-card">
            <h3>Share official links</h3>
            <p>Use the source section when finance teams want to verify the basis before using the estimate in a meeting or memo.</p>
          </article>
          <article className="feature-card">
            <h3>Then move to scenarios</h3>
            <p>After alignment on assumptions, switch to the calculator to compare employee or company cases with less friction.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
