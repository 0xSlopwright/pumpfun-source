/**
 * Explicit local read transport for exercising the recovered hooks. This is not
 * the original Ky/contract-client implementation: no schema, retry, auth store,
 * production origin, or private competition business rule is inferred here.
 */
export function createCompetitionFetchTransport({ baseUrl, fetch: send }) {
  const base = new URL(baseUrl);
  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  ) {
    throw new TypeError(
      "Supply an HTTP(S) base URL without credentials, query or fragment",
    );
  }
  if (typeof send !== "function")
    throw new TypeError("An explicit fetch capability is required");
  return async (operation, options = {}) => {
    let suffix;
    if (operation === "GET /competitions") suffix = "/competitions";
    else if (operation === "GET /competitions/{idOrSlug}") {
      if (typeof options.params?.idOrSlug !== "string")
        throw new TypeError("A string idOrSlug is required");
      const id = options.params.idOrSlug;
      // URL pathname parsing collapses dot segments even when percent encoded.
      // Reject them instead of silently addressing a different local route.
      if (id === "." || id === "..")
        throw new TypeError(
          "Dot-segment identifiers are not supported by this local transport",
        );
      suffix = `/competitions/${encodeURIComponent(id)}`;
    } else throw new TypeError("Unsupported competition read operation");
    const url = new URL(base);
    url.pathname = `${base.pathname.replace(/\/$/, "")}${suffix}`;
    const response = await send(
      new Request(url, {
        method: "GET",
        credentials: "include",
        signal: options.signal,
        headers: { "x-pump-source": "WEB", "x-pump-platform": "web" },
      }),
    );
    if (!response.ok) {
      const error = new Error(
        `Local competition read failed (${response.status})`,
      );
      error.name = "LocalCompetitionHttpError";
      error.status = response.status;
      throw error;
    }
    return response.json();
  };
}
