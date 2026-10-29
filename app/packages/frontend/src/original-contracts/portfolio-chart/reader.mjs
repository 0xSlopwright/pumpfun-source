// Maintained reconstruction of factory 58159. No captured factory is evaluated.
// Transport, its actual HTTPError class, and response-schema semantics are ports.
export const portfolioChartKeys = {
  wallet: (user, period) => ["portfolioChart", user, period],
  walletPrefix: (user) => ["portfolioChart", user],
};

async function isComputing(response) {
  try {
    const body = await response.clone().json();
    return typeof body === "object" && body !== null &&
      "status" in body && body.status === "computing";
  } catch {
    return false;
  }
}

// Keep the schema-building boundary explicit: the capture's Zod dependency is
// not installed, evaluated, replaced with a guessed version, or vendored here.
export function portfolioChartResponseSchema(z) {
  return z.object({
    period: z.enum(["1d", "1w", "1m", "all"]),
    points: z.array(z.object({ time: z.number(), value: z.number() })),
  }).passthrough();
}

export function createPortfolioChartReader({ createClient, HTTPError, responseSchema }) {
  // One retry object per constructed reader (one recovered module instance).
  const retry = {
    limit: 3,
    methods: ["get"],
    statusCodes: [502, 503],
    afterStatusCodes: [503],
    maxRetryAfter: 15000,
    shouldRetry: async ({ error, retryCount }) => {
      if (error instanceof HTTPError && error.response.status === 503) {
        return !!(retryCount <= 3 && await isComputing(error.response)) && undefined;
      }
      return retryCount <= 1 && undefined;
    },
  };
  return async ({ user, period, signal }) => {
    const response = await createClient({ timeout: 30000, retry, signal })(
      "GET /portfolio-summary/chart", { query: { user, period } },
    );
    responseSchema.parse(response); // Discard the parsed result, as the source does.
    return response;
  };
}
