import { useEffect, useState } from "react";
import { getTaxAssumptions } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { implementationNotes, sourceLinks } from "../lib/assumptions";

const guideRows = [
  {
    title: "PAYE model",
    text: "The calculator treats the employee result as annual tax first, then derives a monthly PAYE estimate."
  },
  {
    title: "Harmonised deductions",
    text: "Rent, pension, NHF, NHIS, life insurance, and housing-loan interest are collected explicitly instead of being hidden assumptions."
  },
  {
    title: "Company logic",
    text: "Company tax uses turnover to decide whether the business is treated as small, then uses taxable profit for the tax base."
  },
  {
    title: "Compliance warning",
    text: "The site is for estimating and explaining, not for filing final returns without a professional review."
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
        title="Use the tax guide as a standalone briefing page"
        copy="This page is for teams that need context before calculation. It works as a quick briefing document, a pre-meeting reference, and a source list you can share directly."
        aside={
          <div className="hero-note-card">
            <strong>Best use cases</strong>
            <p>Client onboarding, payroll team briefings, internal tax explainers, and prep before using the calculator.</p>
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
            copy="These should be reviewed whenever the tax authorities publish more detailed implementation guidance."
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
            copy="These are the same references used to shape the revised calculator experience."
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
            <p>Use the source section when finance teams want to verify the basis before using the estimate in a meeting.</p>
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
