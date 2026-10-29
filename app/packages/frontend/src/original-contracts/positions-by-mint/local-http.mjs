// Local single-attempt GET adapter, not a Ky/auth/timeout implementation.
export function localMintPositionClient({ baseUrl, fetchImplementation }) {
  if (
    typeof baseUrl !== "string" ||
    !baseUrl ||
    typeof fetchImplementation !== "function"
  )
    throw new TypeError(
      "Explicit HTTP destination and fetchImplementation required",
    );
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
  return () =>
    async (operation, { params, query, hooks }) => {
      if (operation !== "GET /user-positions/{userId}")
        throw new TypeError("Unsupported position operation");
      const url = new URL(
        `user-positions/${encodeURIComponent(String(params.userId))}`,
        base,
      );
      const mints = query.mints.map(String);
      if (mints.some((mint) => mint.includes(",")))
        throw new TypeError("Comma inside mint array element");
      url.searchParams.set("mints", mints.join(","));
      url.searchParams.set("updatesLimit", String(query.updatesLimit));
      const init = {
        method: "get",
        credentials: "same-origin",
        headers: {
          accept: "application/json",
          "x-pump-source": "WEB",
          "x-pump-platform": "web",
        },
      };
      let response = await fetchImplementation(url, init);
      for (const hook of hooks.afterResponse) {
        const replacement = await hook(new Request(url, init), {}, response);
        if (replacement instanceof Response) response = replacement;
      }
      if (!response.ok)
        throw new Error(`Local position HTTP ${response.status}`);
      const text = response.status === 204 ? "" : await response.text();
      return text === "" ? "" : JSON.parse(text);
    };
}
