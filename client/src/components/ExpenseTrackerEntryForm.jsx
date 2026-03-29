export default function ExpenseTrackerEntryForm({ form, onChange, onSubmit }) {
  return (
    <form className="expense-tracker-form" onSubmit={onSubmit}>
      <div className="expense-tracker-type-row" role="tablist" aria-label="Choose entry type">
        <button
          type="button"
          className={form.type === "income" ? "expense-tracker-type is-active" : "expense-tracker-type"}
          onClick={() => onChange("type", "income")}
        >
          Money You Earned
        </button>
        <button
          type="button"
          className={form.type === "expense" ? "expense-tracker-type is-active expense-tracker-type-expense" : "expense-tracker-type expense-tracker-type-expense"}
          onClick={() => onChange("type", "expense")}
        >
          Money You Spent
        </button>
      </div>

      <div className="expense-tracker-form-grid">
        <label className="field">
          <span>{form.type === "income" ? "Income Amount" : "Expense Amount"}</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={event => onChange("amount", event.target.value)}
            placeholder="Enter amount in naira"
            required
          />
        </label>

        <label className="field">
          <span>Description (Optional)</span>
          <input
            type="text"
            value={form.description}
            onChange={event => onChange("description", event.target.value)}
            placeholder={form.type === "income" ? "Example: POS sales" : "Example: Restocking shop"}
          />
        </label>

        <label className="field">
          <span>Date (Preferred)</span>
          <div className="expense-tracker-date-row">
            <input type="date" value={form.date} onChange={event => onChange("date", event.target.value)} />
            <button className="button-secondary expense-tracker-date-clear" type="button" onClick={() => onChange("date", "")}>
              Clear date
            </button>
          </div>
          <small>Add the date to make the monthly summary more useful.</small>
        </label>
      </div>

      <button className="button-primary" type="submit">
        Add {form.type === "income" ? "income" : "expense"} entry
      </button>
    </form>
  );
}
