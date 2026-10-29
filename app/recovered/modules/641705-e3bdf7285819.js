// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(503725),
    r = e.i(523837),
    t = e.i(343213),
    o = e.i(443481),
    a = e.i(262356);
  e.s([
    "f",
    0,
    function (e, s = {}) {
      let {
        batch: n,
        fetchFn: c,
        fetchOptions: i,
        key: d = "http",
        methods: u,
        name: l = "HTTP JSON-RPC",
        onFetchRequest: b,
        onFetchResponse: h,
        retryDelay: p,
        raw: w,
      } = s;
      return ({ chain: m, retryCount: g, timeout: y }) => {
        let { batchSize: v = 1e3, wait: P = 0 } = "object" == typeof n ? n : {},
          x = s.retryCount ?? g,
          R = y ?? s.timeout ?? 1e4,
          j = e || m?.rpcUrls.default.http[0];
        if (!j) throw new r.f();
        let O = (0, o.f)(j, {
          fetchFn: c,
          fetchOptions: i,
          onRequest: b,
          onResponse: h,
          timeout: R,
        });
        return (0, a.f)(
          {
            key: d,
            methods: u,
            name: l,
            async request({ method: e, params: r }) {
              let o = { method: e, params: r },
                { schedule: a } = (0, t.f)({
                  id: j,
                  wait: P,
                  shouldSplitBatch: (e) => e.length > v,
                  fn: (e) => O.request({ body: e }),
                  sort: (e, f) => e.id - f.id,
                }),
                s = async (e) => (n ? a(e) : [await O.request({ body: e })]),
                [{ error: c, result: i }] = await s(o);
              if (w) return { error: c, result: i };
              if (c) throw new f.V({ body: o, error: c, url: j });
              return i;
            },
            retryCount: x,
            retryDelay: p,
            timeout: R,
            type: "http",
          },
          { fetchOptions: i, url: j },
        );
      };
    },
  ]);
};
