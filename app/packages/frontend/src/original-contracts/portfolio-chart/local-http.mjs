// Explicit single-attempt HTTP adapter. Local design, not Ky reproduction.
// The recovered reader can instead use a real contract-client/Ky implementation.
export class LocalChartHTTPError extends Error {
  constructor(response) {
    super(`Chart HTTP ${response.status}`);
    this.name = "LocalChartHTTPError";
    this.response = response;
  }
}

export function localChartClient({ baseUrl, fetchImplementation }) {
  if (typeof baseUrl !== "string" || !baseUrl || typeof fetchImplementation !== "function") {
    throw new TypeError("Explicit baseUrl and fetchImplementation required");
  }
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password ||
      base.href.includes('?') || base.href.includes('#')) {
    throw new TypeError("Plain HTTP(S) base URL required");
  }
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  return ({ signal }) => async (operation, { query }) => {
    if (operation !== "GET /portfolio-summary/chart") throw new TypeError("Unsupported chart operation");
    const url = new URL("portfolio-summary/chart", base);
    // Original 898661 scalar query encoder, not an input validator/default setter.
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const response = await fetchImplementation(url, {
      method: "get", credentials: "same-origin", signal,
      headers: { accept: "application/json", "x-pump-source": "WEB", "x-pump-platform": "web" },
    });
    if (!response.ok) throw new LocalChartHTTPError(response);
    const text = response.status === 204 ? "" : await response.text();
    return text === "" ? "" : JSON.parse(text);
  };
}
