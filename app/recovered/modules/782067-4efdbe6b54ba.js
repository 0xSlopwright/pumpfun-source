// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(149502),
    n = e.i(445242),
    r = e.i(30181),
    o = e.i(690877),
    i = e.i(606933),
    s = e.i(448341),
    a = e.i(528600);
  let l =
      (void 0 !== t.default && "https://frontend-api-v3.pump.fun") ||
      "https://frontend-api-v3.pump.fun",
    u = (e, t) =>
      (!(t instanceof a.M) ||
        void 0 === t.status ||
        !(t.status >= 400) ||
        !(t.status < 500)) &&
      e < 1,
    c = (e) => {
      let t = new Map();
      for (let n of e)
        (n?.address && t.set(n.address, n), n?.userId && t.set(n.userId, n));
      return t;
    },
    f = async (e, t) => {
      let n = [...new Set(t)].filter(Boolean);
      return 0 === n.length
        ? []
        : (0, r.K)({ clientServerUrl: e })("POST /users/batch", {
            body: { addresses: n },
            credentials: "same-origin",
            hooks: {
              afterResponse: [
                (e, t, n) => {
                  if (!n.ok)
                    throw new a.M({
                      reason: 404 === n.status ? "not_found" : "http_error",
                      status: n.status,
                    });
                },
              ],
            },
            parseJson: (e) => {
              let t = JSON.parse(e);
              return Array.isArray(t)
                ? t
                : t &&
                    "object" == typeof t &&
                    "users" in t &&
                    Array.isArray(t.users)
                  ? t.users
                  : [];
            },
          });
    },
    h = new Map(),
    p = (e) => ["user-profile-batch", e];
  e.s([
    "H",
    0,
    f,
    "T",
    0,
    (e) => {
      let t,
        r,
        a,
        d,
        v,
        y = (0, n.c)(13),
        { address: m, enabled: g } = e,
        b = (0, i.useQueryClient)(),
        w = m ?? "";
      (y[0] !== w ? ((t = p(w)), (y[0] = w), (y[1] = t)) : (t = y[1]),
        y[2] !== m || y[3] !== b
          ? ((r = async () => {
              let e = await ((e) => {
                let t = h.get(e);
                if (!t) {
                  let n, r, o;
                  ((n = new Map()),
                    (r = null),
                    (o = () => {
                      r = null;
                      let t = n;
                      n = new Map();
                      let o = [...t.keys()];
                      for (let n = 0; n < o.length; n += 100) {
                        let r = o.slice(n, n + 100);
                        f(e, r)
                          .then((e) => {
                            let n = c(e);
                            for (let e of r) {
                              let r = n.get(e) ?? null;
                              for (let n of t.get(e) ?? []) n.resolve(r);
                            }
                          })
                          .catch((e) => {
                            for (let n of r)
                              for (let r of t.get(n) ?? []) r.reject(e);
                          });
                      }
                    }),
                    (t = {
                      fetch: (e) =>
                        new Promise((t, i) => {
                          let s = n.get(e) ?? [];
                          (s.push({ resolve: t, reject: i }),
                            n.set(e, s),
                            null === r && (r = setTimeout(o, 50)));
                        }),
                    }),
                    h.set(e, t));
                }
                return t;
              })(l).fetch(m ?? "");
              if (!e) return null;
              for (let t of [e.address, ...(0, s.i)(e, e.address)])
                t && b.setQueryData((0, s.B)(t), (t) => t ?? e);
              return e;
            }),
            (a = () => (m ? b.getQueryData((0, s.B)(m)) : void 0)),
            (d = () =>
              m ? b.getQueryState((0, s.B)(m))?.dataUpdatedAt : void 0),
            (y[2] = m),
            (y[3] = b),
            (y[4] = r),
            (y[5] = a),
            (y[6] = d))
          : ((r = y[4]), (a = y[5]), (d = y[6])));
      let _ = (void 0 === g || g) && !!m;
      return (
        y[7] !== t || y[8] !== r || y[9] !== a || y[10] !== d || y[11] !== _
          ? ((v = {
              queryKey: t,
              queryFn: r,
              initialData: a,
              initialDataUpdatedAt: d,
              enabled: _,
              staleTime: 3e5,
              retry: u,
            }),
            (y[7] = t),
            (y[8] = r),
            (y[9] = a),
            (y[10] = d),
            (y[11] = _),
            (y[12] = v))
          : (v = y[12]),
        (0, o.useQuery)(v)
      );
    },
    "J",
    0,
    p,
    "V",
    0,
    c,
  ]);
};
