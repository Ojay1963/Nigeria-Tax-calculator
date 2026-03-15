import { useEffect, useState } from "react";
import { getTaxAssumptions } from "../api/http";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { implementationNotes, sourceLinks } from "../lib/assumptions";

const guideRows = [
  {
    title: "PAYE model",
    text: "The calculator works out annual tax first, then shows a monthly PAYE estimate."
  },
  {
    title: "Visible relief items",
    text: "Rent relief, pension, NHF, NHIS, life assurance, and mortgage interest are shown clearly."
  },
  {
    title: "Company logic",
    text: "Company tax checks the small-company test, then applies CIT, levy, minimum tax, and the 15% rule where relevant."
  },
  {
    title: "Compliance warning",
    text: "Use the site for estimates, not final filing without checking official guidance."
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
        title="Tax guide"
        copy="A quick reference for assumptions, thresholds, and source links."
        aside={
          <div className="hero-note-card">
            <strong>Best use</strong>
            <p>Check assumptions before using the calculator.</p>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="Tax guide"
          title="Key notes"
          copy="Short notes on how the calculator works."
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
            title="Current assumptions"
            copy="Review these before relying on any estimate."
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
            title="Source links"
            copy="Primary public references."
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

    </div>
  );
}
