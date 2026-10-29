import type { FastifyInstance } from "fastify";
import {
  PayoutsStore,
  UnavailablePayoutWindowError,
  type PayoutPeriod,
} from "./payouts-store.js";

export const PAYOUTS_NATIVE_ROUTES = new Set(["GET /payouts/leaderboard"]);
function integer(
  value: string | undefined,
  minimum: number,
  maximum: number,
): number | undefined {
  if (value === undefined) return undefined;
  if (!/^(?:0|[1-9][0-9]*)$/.test(value)) throw new RangeError();
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum)
    throw new RangeError();
  return parsed;
}

/** Must be registered inside the existing developer API-key compatibility gate. */
export function registerPayoutRoutes(
  app: FastifyInstance,
  store: PayoutsStore,
): void {
  app.get("/v1/payouts/leaderboard", async (request, reply) => {
    try {
      const query = new Map<string, string>();
      const separator = request.url.indexOf("?");
      for (const [key, value] of new URLSearchParams(
        separator < 0 ? "" : request.url.slice(separator + 1),
      )) {
        if (!["page", "pageSize", "period"].includes(key) || query.has(key))
          throw new RangeError();
        query.set(key, value);
      }
      const period = query.get("period");
      if (period !== undefined && !["1d", "1w", "1m"].includes(period))
        throw new RangeError();
      const result = store.leaderboard({
        page: integer(query.get("page"), 0, Number.MAX_SAFE_INTEGER),
        pageSize: integer(query.get("pageSize"), 1, 200),
        period: period as PayoutPeriod | undefined,
      });
      return reply
        .header("X-Reconstruction-Data-Source", store.dataSource)
        .header("X-Reconstruction-Observed-At", store.observedAt)
        .header("X-Reconstruction-Compatibility", "unqualified")
        .send(result);
    } catch (error) {
      if (error instanceof RangeError)
        return reply
          .code(400)
          .send({ statusCode: 400, error: "INVALID_QUERY" });
      if (error instanceof UnavailablePayoutWindowError)
        return reply.code(501).send({
          statusCode: 501,
          error: "COMPATIBILITY_NOT_IMPLEMENTED",
          reason: "PAYOUT_WINDOW_UNAVAILABLE",
        });
      throw error;
    }
  });
}
