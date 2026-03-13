export default function PageHero({ eyebrow, title, copy, actions, aside }) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        <p>{copy}</p>
        {actions ? <div className="cta-row">{actions}</div> : null}
      </div>
      {aside ? <div className="page-hero-aside">{aside}</div> : null}
    </section>
  );
}
