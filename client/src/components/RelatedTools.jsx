import { Link } from "react-router-dom";

export default function RelatedTools({ title, copy, tools }) {
  return (
    <section className="content-card deferred-section">
      <div className="section-heading">
        <span className="eyebrow">Related tools</span>
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
      <div className="feature-grid">
        {tools.map(tool => (
          <article className="feature-card" key={tool.to}>
            <h3>{tool.title}</h3>
            <p>{tool.copy}</p>
            <Link className="text-link" to={tool.to}>
              {tool.ctaLabel || "Open tool"}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
