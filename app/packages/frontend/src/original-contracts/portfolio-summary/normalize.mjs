// Maintained projection for JSON responses using 520669's fixed schemas.
// This is not a Zod implementation; top-level validation errors are local.
export class SummaryResponseError extends TypeError {
  constructor() {
    super("Portfolio summary response must be an object");
    this.name = "SummaryResponseError";
  }
}
const object = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const finite = (value) => typeof value === "number" && Number.isFinite(value);
const numberOrNull = (value) => (finite(value) ? value : null);
const pair = (value) => ({
  sol: numberOrNull(object(value) ? value.sol : undefined),
  usd: numberOrNull(object(value) ? value.usd : undefined),
});

export function normalizeSummaryJSON(value) {
  if (!object(value)) throw new SummaryResponseError();
  return {
    pnl: pair(value.pnl),
    realizedPnl: pair(value.realizedPnl),
    unrealizedPnl: pair(value.unrealizedPnl),
    percentage: pair(value.percentage),
    totalBuySpend: pair(value.totalBuySpend),
    tokenCount: numberOrNull(value.tokenCount),
    totalValueUsd: numberOrNull(value.totalValueUsd),
  };
}
function holding(value) {
  if (
    !object(value) ||
    typeof value.mint !== "string" ||
    value.mint.length < 1 ||
    !finite(value.amount) ||
    !finite(value.priceUsd)
  )
    return [];
  return [
    {
      chain: typeof value.chain === "string" ? value.chain : "",
      mint: value.mint,
      amount: value.amount,
      priceUsd: value.priceUsd,
      valueUsd: finite(value.valueUsd) ? value.valueUsd : 0,
      marketCapUsd: numberOrNull(value.marketCapUsd),
      ...(value.markUsd === undefined
        ? {}
        : { markUsd: numberOrNull(value.markUsd) }),
    },
  ];
}
function unrepriced(value) {
  if (
    !object(value) ||
    typeof value.mint !== "string" ||
    value.mint.length < 1 ||
    typeof value.reason !== "string"
  )
    return [];
  return [
    {
      chain: typeof value.chain === "string" ? value.chain : "",
      mint: value.mint,
      reason: value.reason,
    },
  ];
}
export function normalizeEnhancedSummaryJSON(value) {
  if (!object(value)) throw new SummaryResponseError();
  return {
    holdings: Array.isArray(value.holdings)
      ? value.holdings.flatMap(holding)
      : null,
    computedAt: numberOrNull(value.computedAt),
    solPriceUsd: numberOrNull(value.solPriceUsd),
    nativeBalanceSol: numberOrNull(value.nativeBalanceSol),
    reprice: object(value.reprice)
      ? {
          asOf: numberOrNull(value.reprice.asOf),
          unrepriced: Array.isArray(value.reprice.unrepriced)
            ? value.reprice.unrepriced.flatMap(unrepriced)
            : [],
        }
      : null,
    cacheFresh: object(value.cache) && value.cache.fresh === true,
  };
}
