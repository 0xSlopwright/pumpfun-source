// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(532617);
  class r extends f.f {
    constructor() {
      super(
        "No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",
        { docsPath: "/docs/clients/intro", name: "UrlRequiredError" },
      );
    }
  }
  e.s(["f", 0, r], 523837);
  var t = e.i(503725),
    o = e.i(393547);
  let a = {
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
      function (e, f = {}) {
        return {
          async request(r) {
            let {
                body: s,
                fetchFn: n = f.fetchFn ?? fetch,
                onRequest: c = f.onRequest,
                onResponse: i = f.onResponse,
                timeout: d = f.timeout ?? 1e4,
              } = r,
              u = { ...(f.fetchOptions ?? {}), ...(r.fetchOptions ?? {}) },
              { headers: l, method: b, signal: h } = u;
            try {
              let f,
                r = await (function (
                  e,
                  {
                    errorInstance: f = Error("timed out"),
                    timeout: r,
                    signal: t,
                  },
                ) {
                  return new Promise((o, a) => {
                    (async () => {
                      let s;
                      try {
                        let n = new AbortController();
                        (r > 0 &&
                          (s = setTimeout(() => {
                            t ? n.abort() : a(f);
                          }, r)),
                          o(await e({ signal: n?.signal || null })));
                      } catch (e) {
                        (e?.name === "AbortError" && a(f), a(e));
                      } finally {
                        clearTimeout(s);
                      }
                    })();
                  });
                })(
                  async ({ signal: f }) => {
                    let r = {
                        ...u,
                        body: Array.isArray(s)
                          ? (0, o.f)(
                              s.map((e) => ({
                                jsonrpc: "2.0",
                                id: e.id ?? a.take(),
                                ...e,
                              })),
                            )
                          : (0, o.f)({
                              jsonrpc: "2.0",
                              id: s.id ?? a.take(),
                              ...s,
                            }),
                        headers: { "Content-Type": "application/json", ...l },
                        method: b || "POST",
                        signal: h || (d > 0 ? f : null),
                      },
                      t = new Request(e, r),
                      i = (await c?.(t, r)) ?? { ...r, url: e };
                    return await n(i.url ?? e, i);
                  },
                  {
                    errorInstance: new t.t({ body: s, url: e }),
                    timeout: d,
                    signal: !0,
                  },
                );
              if (
                (i && (await i(r)),
                r.headers.get("Content-Type")?.startsWith("application/json"))
              )
                f = await r.json();
              else {
                f = await r.text();
                try {
                  f = JSON.parse(f || "{}");
                } catch (e) {
                  if (r.ok) throw e;
                  f = { error: f };
                }
              }
              if (!r.ok)
                throw new t.y({
                  body: s,
                  details: (0, o.f)(f.error) || r.statusText,
                  headers: r.headers,
                  status: r.status,
                  url: e,
                });
              return f;
            } catch (f) {
              if (f instanceof t.y || f instanceof t.t) throw f;
              throw new t.y({ body: s, cause: f, url: e });
            }
          },
        };
      },
    ],
    443481,
  );
};
