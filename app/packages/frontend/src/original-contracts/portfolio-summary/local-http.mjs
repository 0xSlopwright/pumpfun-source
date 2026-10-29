// Explicit local single-attempt transport, separate from original Ky behavior.
export function localSummaryClient({ baseUrl, fetchImplementation }) {
  if (
    typeof baseUrl !== "string" ||
    !baseUrl ||
    typeof fetchImplementation !== "function"
  )
    throw new TypeError("Explicit HTTP destination and transport required");
  const base = new URL(baseUrl);
  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.href.includes("?") ||
    base.href.includes("#")
  )
    throw new TypeError("Plain HTTP(S) base URL required");
  if (!base.pathname.endsWith("/")) base.pathname += "/";
  return ({ credentials = "same-origin" } = {}) =>
    async (operation, { query }) => {
      if (operation !== "GET /portfolio-summary")
        throw new TypeError("Unsupported summary operation");
      const url = new URL("portfolio-summary", base);
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;
        // This local adapter's wire domain is scalar query values. The recovered
        // reader still forwards arbitrary values to a supplied contract client.
        if (Array.isArray(value))
          throw new TypeError("Local summary query must be scalar");
        url.searchParams.set(key, String(value));
      }
      const response = await fetchImplementation(url, {
        method: "get",
        credentials,
        headers: {
          accept: "application/json",
          "x-pump-source": "WEB",
          "x-pump-platform": "web",
        },
      });
      if (!response.ok)
        throw Object.assign(
          new Error(`Local summary HTTP ${response.status}`),
          { response },
        );
      const text = response.status === 204 ? "" : await response.text();
      return text === "" ? "" : JSON.parse(text);
    };
}
