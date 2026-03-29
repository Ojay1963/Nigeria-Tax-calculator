export default function AdSlot({ label = "Advertisement", className = "", compact = false }) {
  return (
    <aside className={compact ? `ad-slot ad-slot-compact ${className}`.trim() : `ad-slot ${className}`.trim()} aria-label={label}>
      <span className="ad-slot-label">Advertisement</span>
    </aside>
  );
}
