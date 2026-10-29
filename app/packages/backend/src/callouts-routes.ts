import type { FastifyInstance } from "fastify";
import { CalloutListError } from "./callout-list-query.js";
import type { CalloutsStore } from "./callouts-store.js";

export const CALLOUTS_NATIVE_ROUTES = new Set([
  "GET /callout/{calloutId}",
  "GET /callout/list/{userId}",
]);
export function registerCalloutRoutes(
  app: FastifyInstance,
  store: CalloutsStore,
): void {
  app.get("/v1/callout/list/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    try {
      const queryStart = request.url.indexOf("?");
      const response = store.list(
        userId,
        new URLSearchParams(
          queryStart < 0 ? "" : request.url.slice(queryStart + 1),
        ),
      );
      return reply
        .header("X-Reconstruction-Data-Source", store.dataSource)
        .header("X-Reconstruction-Observed-At", store.observedAt)
        .header("X-Reconstruction-Compatibility", "unqualified")
        .send(response);
    } catch (error) {
      if (!(error instanceof CalloutListError)) throw error;
      return reply.code(error.status).send({
        error:
          error.status === 501
            ? "COMPATIBILITY_NOT_IMPLEMENTED"
            : "BAD_REQUEST",
        reason: error.reason,
      });
    }
  });
  app.get("/v1/callout/:calloutId", async (request, reply) => {
    // No query behavior is documented for this operation. Do not pretend viewer/filter hints work.
    const queryStart = request.url.indexOf("?");
    if (
      queryStart !== -1 &&
      new URLSearchParams(request.url.slice(queryStart + 1)).size !== 0
    ) {
      return reply
        .code(501)
        .send({
          error: "COMPATIBILITY_NOT_IMPLEMENTED",
          reason: "CALLOUT_QUERY_UNSUPPORTED",
        });
    }
    const { calloutId } = request.params as { calloutId: string };
    return reply
      .header("X-Reconstruction-Data-Source", store.dataSource)
      .header("X-Reconstruction-Observed-At", store.observedAt)
      .header("X-Reconstruction-Compatibility", "unqualified")
      .send(store.get(calloutId));
  });
}
