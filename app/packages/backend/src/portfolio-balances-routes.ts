import type { FastifyInstance } from "fastify";
import {
  BalanceBatchQueryError,
  type PortfolioBalancesStore,
} from "./portfolio-balances-store.js";

export const PORTFOLIO_BALANCES_NATIVE_ROUTES = new Set([
  "POST /portfolio-summary/balances",
]);

/** Developer API host semantics only; inherited key-shape gate still runs first. */
export function registerPortfolioBalancesRoutes(
  app: FastifyInstance,
  store: PortfolioBalancesStore,
): void {
  app.post("/v1/portfolio-summary/balances", async (request, reply) => {
    try {
      if (
        request.url.includes("?") &&
        [
          ...new URLSearchParams(
            request.url.slice(request.url.indexOf("?") + 1),
          ),
        ].length
      )
        throw new BalanceBatchQueryError();
      const body = request.body;
      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        Object.keys(body).some(
          (key) => !["wallets", "fresh", "holdings"].includes(key),
        )
      )
        throw new BalanceBatchQueryError();
      const values = body as Record<string, unknown>;
      for (const flag of ["fresh", "holdings"])
        if (Object.hasOwn(values, flag) && typeof values[flag] !== "boolean")
          throw new BalanceBatchQueryError();
      // Neither option grants ownership or refresh privileges on the API host.
      const result = store.batch(values.wallets as string[]);
      return reply
        .header("X-Reconstruction-Data-Source", store.dataSource)
        .header("X-Reconstruction-Observed-At", store.observedAt)
        .header("X-Reconstruction-Compatibility", "unqualified")
        .send(result);
    } catch (error) {
      if (error instanceof BalanceBatchQueryError)
        return reply.code(400).send({ statusCode: 400, error: "INVALID_BODY" });
      throw error;
    }
  });
}
