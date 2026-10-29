// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(213618);
  function n(e, { pages: t, pageParams: r }) {
    let a = t.length - 1;
    return t.length > 0 ? e.getNextPageParam(t[a], t, r[a], r) : void 0;
  }
  function r(e, { pages: t, pageParams: n }) {
    return t.length > 0 ? e.getPreviousPageParam?.(t[0], t, n[0], n) : void 0;
  }
  e.s([
    "B",
    0,
    function (e, t) {
      return !!t && null != n(e, t);
    },
    "u",
    0,
    function (e, t) {
      return !!t && !!e.getPreviousPageParam && null != r(e, t);
    },
    "T",
    0,
    function (e) {
      return {
        onFetch: (a, i) => {
          let l = a.options,
            o = a.fetchOptions?.meta?.fetchMore?.direction,
            s = a.state.data?.pages || [],
            u = a.state.data?.pageParams || [],
            c = { pages: [], pageParams: [] },
            f = 0,
            d = async () => {
              let i = !1,
                d = (0, t.W)(a.options, a.fetchOptions),
                h = async (e, n, r) => {
                  if (i) return Promise.reject();
                  if (null == n && e.pages.length) return Promise.resolve(e);
                  let l = {
                    client: a.client,
                    queryKey: a.queryKey,
                    pageParam: n,
                    direction: r ? "backward" : "forward",
                    meta: a.options.meta,
                  };
                  Object.defineProperty(l, "signal", {
                    enumerable: !0,
                    get: () => (
                      a.signal.aborted
                        ? (i = !0)
                        : a.signal.addEventListener("abort", () => {
                            i = !0;
                          }),
                      a.signal
                    ),
                  });
                  let o = await d(l),
                    { maxPages: s } = a.options,
                    u = r ? t.R : t.E;
                  return {
                    pages: u(e.pages, o, s),
                    pageParams: u(e.pageParams, n, s),
                  };
                };
              if (o && s.length) {
                let e = "backward" === o,
                  t = { pages: s, pageParams: u },
                  a = (e ? r : n)(l, t);
                c = await h(t, a, e);
              } else {
                let t = e ?? s.length;
                do {
                  let e = 0 === f ? (u[0] ?? l.initialPageParam) : n(l, c);
                  if (f > 0 && null == e) break;
                  ((c = await h(c, e)), f++);
                } while (f < t);
              }
              return c;
            };
          a.options.persister
            ? (a.fetchFn = () =>
                a.options.persister?.(
                  d,
                  {
                    client: a.client,
                    queryKey: a.queryKey,
                    meta: a.options.meta,
                    signal: a.signal,
                  },
                  i,
                ))
            : (a.fetchFn = d);
        },
      };
    },
  ]);
};
