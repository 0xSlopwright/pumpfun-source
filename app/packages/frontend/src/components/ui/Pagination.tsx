"use client";

type PaginationProps = {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
};

/** Load-more button with loading spinner. */
export function Pagination({ hasMore, loading, onLoadMore }: PaginationProps) {
  if (!hasMore && !loading) {
    return (
      <p className="py-6 text-center text-xs text-text-muted">
        No more results
      </p>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <button
        type="button"
        disabled={loading}
        onClick={onLoadMore}
        className="inline-flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-xl border border-border-tertiary bg-bg-tertiary px-4 text-[13px] font-semibold text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:text-text-on-disabled"
      >
        {loading ? (
          <>
            <span className="leaderboard-spinner !h-4 !w-4 !border-2" />
            Loading…
          </>
        ) : (
          "Load more"
        )}
      </button>
    </div>
  );
}
