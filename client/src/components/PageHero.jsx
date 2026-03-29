export default function PageHero({ eyebrow, title, copy, actions, aside, headingTag = "h1" }) {
  const HeadingTag = headingTag;

  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <HeadingTag>{title}</HeadingTag>
        <p>{copy}</p>
        {actions ? <div className="cta-row">{actions}</div> : null}
      </div>
      {aside ? <div className="page-hero-aside">{aside}</div> : null}
    </section>
  );
}
