export default function FaqSection({ eyebrow = "FAQ", title, faqs }) {
  return (
    <section className="content-card deferred-section">
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="faq-list">
        {faqs.map(item => (
          <article className="faq-item" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
