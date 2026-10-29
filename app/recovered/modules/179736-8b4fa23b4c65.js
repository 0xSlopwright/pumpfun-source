// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(149502),
    i = e.i(445242),
    r = e.i(30181),
    a = e.i(690877);
  let n =
      (void 0 !== t.default && "https://frontend-api-v3.pump.fun") ||
      "https://frontend-api-v3.pump.fun",
    l = async (e, t) => {
      let i = [...new Set(t)].filter(Boolean);
      return 0 === i.length
        ? {}
        : (0, r.K)({ clientServerUrl: e })("POST /profiles/verified", {
            body: { ids: i },
            credentials: "same-origin",
            hooks: {
              afterResponse: [
                (e, t, i) => {
                  if (!i.ok) throw Error("Failed to fetch verified profiles");
                },
              ],
            },
          });
    },
    s = async (e, t) => {
      try {
        return await l(e, t);
      } catch {
        return {};
      }
    },
    o = new Map(),
    d = (e) => ["user-verified", e];
  e.s([
    "s",
    0,
    (e, t) => {
      let r,
        l,
        u,
        c,
        m = (0, i.c)(10);
      m[0] !== t
        ? ((r = void 0 === t ? {} : t), (m[0] = t), (m[1] = r))
        : (r = m[1]);
      let { enabled: h } = r,
        f = e ?? "";
      (m[2] !== f ? ((l = d(f)), (m[2] = f), (m[3] = l)) : (l = m[3]),
        m[4] !== e
          ? ((u = () =>
              ((e) => {
                let t = o.get(e);
                if (!t) {
                  let i, r, a;
                  ((i = new Map()),
                    (r = null),
                    (a = () => {
                      r = null;
                      let t = i;
                      i = new Map();
                      let a = [...t.keys()];
                      for (let i = 0; i < a.length; i += 100) {
                        let r = a.slice(i, i + 100);
                        s(e, r)
                          .then((e) => {
                            for (let i of r) {
                              let r = e[i] ?? !1;
                              for (let e of t.get(i) ?? []) e.resolve(r);
                            }
                          })
                          .catch(() => {
                            for (let e of r)
                              for (let i of t.get(e) ?? []) i.resolve(!1);
                          });
                      }
                    }),
                    (t = {
                      fetch: (e) =>
                        new Promise((t) => {
                          let n = i.get(e) ?? [];
                          (n.push({ resolve: t }),
                            i.set(e, n),
                            null === r && (r = setTimeout(a, 50)));
                        }),
                    }),
                    o.set(e, t));
                }
                return t;
              })(n).fetch(e ?? "")),
            (m[4] = e),
            (m[5] = u))
          : (u = m[5]));
      let g = (void 0 === h || h) && !!e;
      m[6] !== l || m[7] !== u || m[8] !== g
        ? ((c = {
            queryKey: l,
            queryFn: u,
            enabled: g,
            staleTime: 18e5,
            retry: !1,
          }),
          (m[6] = l),
          (m[7] = u),
          (m[8] = g),
          (m[9] = c))
        : (c = m[9]);
      let { data: p } = (0, a.useQuery)(c);
      return !0 === p;
    },
    "B",
    0,
    d,
  ]);
};
