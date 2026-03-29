import { formatCurrency } from "../lib/format";

function formatEntryDate(value) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

export default function ExpenseTrackerEntryList({ title, entries, emptyTitle, emptyCopy, onDelete }) {
  return (
    <section className="expense-tracker-list-card">
      <div className="section-heading expense-tracker-list-heading">
        <span className="eyebrow">{title}</span>
        <h2>{title}</h2>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">Empty</span>
          <strong>{emptyTitle}</strong>
          <p>{emptyCopy}</p>
        </div>
      ) : (
        <div className="expense-tracker-list">
          {entries.map(entry => (
            <article className="expense-tracker-entry" key={entry.id}>
              <div className="expense-tracker-entry-main">
                <strong>{entry.description || "No description added"}</strong>
                <span>{formatEntryDate(entry.date)}</span>
              </div>
              <div className="expense-tracker-entry-side">
                <strong>{formatCurrency(entry.amount)}</strong>
                <button className="expense-tracker-delete" type="button" onClick={() => onDelete(entry.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
