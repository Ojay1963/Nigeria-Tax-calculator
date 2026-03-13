import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";

export default function PrivacyPage() {
  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Privacy"
        title="Privacy policy"
        copy="This page explains the basic handling of account data, contact submissions, and estimate requests."
        aside={
          <div className="hero-note-card">
            <strong>Summary</strong>
            <p>Only collect what is necessary to operate the product, respond to messages, and secure user accounts.</p>
          </div>
        }
      />
      <section className="content-card">
        <SectionHeading
          eyebrow="Data use"
          title="What this site stores"
          copy="Account records, contact form submissions, and calculator request logs may be stored to operate the platform."
        />
        <div className="feature-grid">
          <article className="feature-card">
            <h3>Accounts</h3>
            <p>Name, email, password hash, role, and verification status are used for authentication and access control.</p>
          </article>
          <article className="feature-card">
            <h3>Contact requests</h3>
            <p>Contact submissions may be retained for follow-up, support handling, and service improvement.</p>
          </article>
          <article className="feature-card">
            <h3>Calculator usage</h3>
            <p>Estimate runs may be logged for operational insight, quality checks, and future product features.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
