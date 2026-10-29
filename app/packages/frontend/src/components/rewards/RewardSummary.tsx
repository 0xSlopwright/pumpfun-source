export type RewardSummaryItem = {
  label: string;
  amount: string | null;
  denomination?: string;
  explanation: string;
};

/** Render only caller-supplied reward observations; null values stay unknown. */
export function RewardSummary({ items }: { items: readonly RewardSummaryItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" data-testid="reward-summary">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border-secondary bg-bg-secondary p-4"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            {item.label}
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-text-primary">
            {item.amount ?? "Unavailable"}
          </p>
          {item.amount && item.denomination ? (
            <p className="text-xs text-text-tertiary">{item.denomination}</p>
          ) : null}
          <p className="mt-2 text-xs leading-5 text-text-muted">
            {item.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
