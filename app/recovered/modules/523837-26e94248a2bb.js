// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(532617);
  class r extends t.f {
    constructor() {
      super(
        "No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",
        { docsPath: "/docs/clients/intro", name: "UrlRequiredError" },
      );
    }
  }
  e.s(["f", 0, r], 523837);
  var o = e.i(503725),
    s = e.i(393547);
  let n = {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    },
  };
  e.s(
    [
      "f",
      0,
      function (e, t = {}) {
        return {
          async request(r) {
            let {
                body: a,
                fetchFn: i = t.fetchFn ?? fetch,
                onRequest: c = t.onRequest,
                onResponse: l = t.onResponse,
                timeout: u = t.timeout ?? 1e4,
              } = r,
              d = { ...(t.fetchOptions ?? {}), ...(r.fetchOptions ?? {}) },
              { headers: f, method: b, signal: p } = d;
            try {
              let t,
                r = await (function (
                  e,
                  {
                    errorInstance: t = Error("timed out"),
                    timeout: r,
                    signal: o,
                  },
                ) {
                  return new Promise((s, n) => {
                    (async () => {
                      let a;
                      try {
                        let i = new AbortController();
                        (r > 0 &&
                          (a = setTimeout(() => {
                            o ? i.abort() : n(t);
                          }, r)),
                          s(await e({ signal: i?.signal || null })));
                      } catch (e) {
                        (e?.name === "AbortError" && n(t), n(e));
                      } finally {
                        clearTimeout(a);
                      }
                    })();
                  });
                })(
                  async ({ signal: t }) => {
                    let r = {
                        ...d,
                        body: Array.isArray(a)
                          ? (0, s.f)(
                              a.map((e) => ({
                                jsonrpc: "2.0",
                                id: e.id ?? n.take(),
                                ...e,
                              })),
                            )
                          : (0, s.f)({
                              jsonrpc: "2.0",
                              id: a.id ?? n.take(),
                              ...a,
                            }),
                        headers: { "Content-Type": "application/json", ...f },
                        method: b || "POST",
                        signal: p || (u > 0 ? t : null),
                      },
                      o = new Request(e, r),
                      l = (await c?.(o, r)) ?? { ...r, url: e };
                    return await i(l.url ?? e, l);
                  },
                  {
                    errorInstance: new o.t({ body: a, url: e }),
                    timeout: u,
                    signal: !0,
                  },
                );
              if (
                (l && (await l(r)),
                r.headers.get("Content-Type")?.startsWith("application/json"))
              )
                t = await r.json();
              else {
                t = await r.text();
                try {
                  t = JSON.parse(t || "{}");
                } catch (e) {
                  if (r.ok) throw e;
                  t = { error: t };
                }
              }
              if (!r.ok)
                throw new o.y({
                  body: a,
                  details: (0, s.f)(t.error) || r.statusText,
                  headers: r.headers,
                  status: r.status,
                  url: e,
                });
              return t;
            } catch (t) {
              if (t instanceof o.y || t instanceof o.t) throw t;
              throw new o.y({ body: a, cause: t, url: e });
            }
          },
        };
      },
    ],
    443481,
  );
};
