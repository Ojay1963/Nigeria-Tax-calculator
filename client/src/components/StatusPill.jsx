function StatusIcon({ variant }) {
  if (variant === "success") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="status-pill-icon-svg">
        <path d="M6.5 11.2 3.6 8.3l1-1 1.9 1.9 5-5 1 1-6 6Z" fill="currentColor" />
      </svg>
    );
  }

  if (variant === "warning") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="status-pill-icon-svg">
        <path d="M8 2.2 14 13H2L8 2.2Zm-.7 3.3v3.7h1.4V5.5H7.3Zm0 4.8v1.2h1.4v-1.2H7.3Z" fill="currentColor" />
      </svg>
    );
  }

  if (variant === "error") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="status-pill-icon-svg">
        <path d="m5 5 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="status-pill-icon-svg">
      <circle cx="8" cy="8" r="5" fill="currentColor" />
    </svg>
  );
}

export default function StatusPill({ label, variant = "neutral", compact = false }) {
  const className = compact ? `status-pill ${variant} compact` : `status-pill ${variant}`;

  return (
    <span className={className}>
      <span className="status-pill-icon">
        <StatusIcon variant={variant} />
      </span>
      <span>{label}</span>
    </span>
  );
}
