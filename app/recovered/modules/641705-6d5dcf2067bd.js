// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(503725),
    r = e.i(523837),
    o = e.i(343213),
    s = e.i(443481),
    n = e.i(262356);
  e.s([
    "f",
    0,
    function (e, a = {}) {
      let {
        batch: i,
        fetchFn: c,
        fetchOptions: l,
        key: u = "http",
        methods: d,
        name: f = "HTTP JSON-RPC",
        onFetchRequest: b,
        onFetchResponse: p,
        retryDelay: h,
        raw: m,
      } = a;
      return ({ chain: g, retryCount: y, timeout: v }) => {
        let { batchSize: w = 1e3, wait: P = 0 } = "object" == typeof i ? i : {},
          x = a.retryCount ?? y,
          B = v ?? a.timeout ?? 1e4,
          I = e || g?.rpcUrls.default.http[0];
        if (!I) throw new r.f();
        let R = (0, s.f)(I, {
          fetchFn: c,
          fetchOptions: l,
          onRequest: b,
          onResponse: p,
          timeout: B,
        });
        return (0, n.f)(
          {
            key: u,
            methods: d,
            name: f,
            async request({ method: e, params: r }) {
              let s = { method: e, params: r },
                { schedule: n } = (0, o.f)({
                  id: I,
                  wait: P,
                  shouldSplitBatch: (e) => e.length > w,
                  fn: (e) => R.request({ body: e }),
                  sort: (e, t) => e.id - t.id,
                }),
                a = async (e) => (i ? n(e) : [await R.request({ body: e })]),
                [{ error: c, result: l }] = await a(s);
              if (m) return { error: c, result: l };
              if (c) throw new t.V({ body: s, error: c, url: I });
              return l;
            },
            retryCount: x,
            retryDelay: h,
            timeout: B,
            type: "http",
          },
          { fetchOptions: l, url: I },
        );
      };
    },
  ]);
};
