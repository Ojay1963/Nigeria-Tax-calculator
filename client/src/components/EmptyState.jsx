export default function EmptyState({ title, copy, action = null, icon = "INFO" }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <strong>{title}</strong>
      <p>{copy}</p>
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}
