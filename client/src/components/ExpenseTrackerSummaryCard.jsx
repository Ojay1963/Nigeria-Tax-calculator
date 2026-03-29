import { formatCurrency } from "../lib/format";

export default function ExpenseTrackerSummaryCard({ label, amount, tone = "neutral" }) {
  return (
    <div className={`expense-tracker-summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{formatCurrency(amount)}</strong>
    </div>
  );
}
