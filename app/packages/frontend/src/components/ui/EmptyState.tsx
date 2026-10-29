import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

/** Generic empty state used when a section has no data to display. */
export function EmptyState({ icon = "P", title, description, action }: EmptyStateProps) {
  return (
    <section className="empty-state" data-product-state="unavailable">
      <div className="empty-state-content">
        <span className="empty-mark" aria-hidden="true">
          {icon}
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
        {action ?? null}
        <p className="muted">Local reconstruction — no live data.</p>
      </div>
    </section>
  );
}
