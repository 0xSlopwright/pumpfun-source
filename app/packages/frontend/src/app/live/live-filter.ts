import type { ArchivedStream } from "./live-data";

export type LiveSort = "captured" | "viewers" | "title";
export const LIVE_PAGE_SIZE = 12;

function comparable(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("en-US");
}

export function filterArchivedStreams(
  streams: readonly ArchivedStream[],
  query: string,
  sort: LiveSort,
): ArchivedStream[] {
  const normalized = comparable(query.trim());
  const filtered = normalized
    ? streams.filter((stream) =>
        [stream.title, stream.symbol, stream.creatorAddress, stream.mint].some(
          (value) => comparable(value).includes(normalized),
        ),
      )
    : [...streams];

  if (sort === "captured") return filtered;

  return filtered.sort((left, right) => {
    if (sort === "title") {
      return (
        comparable(left.title).localeCompare(
          comparable(right.title),
          "en-US",
        ) || left.mint.localeCompare(right.mint, "en-US")
      );
    }
    return (
      right.viewerCountAtCapture - left.viewerCountAtCapture ||
      left.mint.localeCompare(right.mint, "en-US")
    );
  });
}

// Pagination is local archive navigation, not a reconstructed upstream cursor.
// Reject ambiguous, noncanonical and out-of-range URLs instead of silently
// displaying a different page. Search/sort changes explicitly reset the page.
export function paginateArchivedStreams(
  streams: readonly ArchivedStream[],
  pageValues: readonly string[],
) {
  const pageCount = Math.max(1, Math.ceil(streams.length / LIVE_PAGE_SIZE));
  const value = pageValues[0] ?? "1";
  const page = /^[1-9]\d{0,8}$/u.test(value) ? Number(value) : 0;
  const valid = pageValues.length <= 1 && page >= 1 && page <= pageCount;
  const start = valid ? (page - 1) * LIVE_PAGE_SIZE : 0;
  return {
    valid,
    page,
    pageCount,
    total: streams.length,
    start: valid && streams.length > 0 ? start + 1 : 0,
    end: valid ? Math.min(start + LIVE_PAGE_SIZE, streams.length) : 0,
    streams: valid ? streams.slice(start, start + LIVE_PAGE_SIZE) : [],
  };
}
