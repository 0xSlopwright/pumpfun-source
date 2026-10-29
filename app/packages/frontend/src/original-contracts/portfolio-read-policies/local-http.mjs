// Explicit local single-attempt transport; no cookie jar, retry or timeout loop.
export function localPortfolioPolicyClient({ baseUrl, fetchImplementation }) {
  if (
    typeof baseUrl !== "string" ||
    !baseUrl ||
    typeof fetchImplementation !== "function"
  )
    throw new TypeError("Explicit baseUrl and fetchImplementation required");
  const base = new URL(baseUrl);
  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.href.includes("?") ||
    base.href.includes("#")
  )
    throw new TypeError("Plain HTTP(S) destination required");
  if (!base.pathname.endsWith("/")) base.pathname += "/";
  return () => async (operation, options) => {
    let url;
    if (operation === "GET /user-portfolio/dust-floor")
      url = new URL("user-portfolio/dust-floor", base);
    else if (operation === "GET /user-portfolio/{userId}") {
      url = new URL(
        `user-portfolio/${encodeURIComponent(String(options.params.userId))}`,
        base,
      );
      for (const [key, value] of Object.entries(options.query))
        if (value !== undefined) url.searchParams.set(key, String(value));
    } else
      throw new TypeError("Unsupported read-only portfolio policy operation");
    const init = {
      method: "get",
      credentials: options.credentials,
      signal: options.signal,
      headers: {
        accept: "application/json",
        "x-pump-source": "WEB",
        "x-pump-platform": "web",
      },
    };
    let response = await fetchImplementation(url, init);
    for (const hook of options.hooks.afterResponse) {
      const replacement = await hook(new Request(url, init), {}, response);
      if (replacement instanceof Response) response = replacement;
    }
    const text = response.status === 204 ? "" : await response.text();
    return text === "" ? "" : JSON.parse(text);
  };
}
