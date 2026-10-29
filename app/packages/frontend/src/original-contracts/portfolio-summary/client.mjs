import {
  normalizeSummaryJSON,
  normalizeEnhancedSummaryJSON,
} from "./normalize.mjs";

export const portfolioSummaryKeys = {
  wallet: (user, period) => ["portfolioSummary", user, period],
  walletPrefix: (user) => ["portfolioSummary", user],
};
export function createPortfolioSummaryClient({ createClient }) {
  const read = async ({ user, period, holdings = false, fresh = false }) => {
    if (!holdings && !fresh) {
      const response = await createClient()("GET /portfolio-summary", {
        query: { user, period },
      });
      return normalizeSummaryJSON(response);
    }
    const query = {
      user,
      period,
      ...(holdings ? { holdings: 1 } : {}),
      ...(fresh ? { fresh: 1 } : {}),
    };
    const response = await createClient(
      fresh ? { credentials: "include" } : undefined,
    )("GET /portfolio-summary", { query });
    return {
      ...normalizeSummaryJSON(response),
      ...normalizeEnhancedSummaryJSON(response),
    };
  };
  return {
    read,
    async refresh(queryClient, user, period) {
      const response = await read({
        user,
        period,
        holdings: true,
        fresh: true,
      });
      const key = portfolioSummaryKeys.wallet(user, period);
      await queryClient.cancelQueries({ queryKey: key, exact: true });
      queryClient.setQueryData(key, response);
    },
  };
}
