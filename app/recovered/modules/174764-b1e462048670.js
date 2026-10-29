// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  async function t(e) {
    let t, n, r;
    try {
      n = await e("GET /auth/my-profile", {
        credentials: "include",
        headers: { "Cache-Control": "no-cache" },
        throwHttpErrors: !1,
        hooks: {
          afterResponse: [
            (e, n, r) => {
              t = r;
            },
          ],
        },
      });
    } catch (e) {
      r = e;
    }
    let o = t?.status ?? null;
    return {
      verdict:
        null === o
          ? "inconclusive"
          : (o >= 200 && o < 300) || 304 === o
            ? "ok"
            : 401 === o
              ? "rejected"
              : "inconclusive",
      status: o,
      payload: n,
      error: r,
    };
  }
  e.s(["f", 0, t]);
};
