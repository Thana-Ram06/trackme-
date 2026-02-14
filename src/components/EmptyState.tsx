type EmptyStateProps = {
  title?: string;
  body?: string;
  hint?: string;
};

export default function EmptyState({
  title = "No subscriptions yet.",
  body = "Start by adding the subscriptions you actually care about. Track.me stays quiet until something is due.",
  hint = "Tip: Add trials too, so you remember to cancel them in time.",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-pill">
        <span className="empty-dot" />
        <span>Elegant when empty.</span>
      </div>
      <div className="empty-title">{title}</div>
      <p className="empty-body">{body}</p>
      <p className="empty-hint">{hint}</p>
    </div>
  );
}

