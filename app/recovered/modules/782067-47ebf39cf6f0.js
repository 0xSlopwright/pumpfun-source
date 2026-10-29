// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(149502),
    r = e.i(445242),
    n = e.i(30181),
    i = e.i(690877),
    s = e.i(606933),
    a = e.i(448341),
    l = e.i(528600);
  let o =
      (void 0 !== t.default && "https://frontend-api-v3.pump.fun") ||
      "https://frontend-api-v3.pump.fun",
    c = (e, t) =>
      (!(t instanceof l.M) ||
        void 0 === t.status ||
        !(t.status >= 400) ||
        !(t.status < 500)) &&
      e < 1,
    u = (e) => {
      let t = new Map();
      for (let r of e)
        (r?.address && t.set(r.address, r), r?.userId && t.set(r.userId, r));
      return t;
    },
    d = async (e, t) => {
      let r = [...new Set(t)].filter(Boolean);
      return 0 === r.length
        ? []
        : (0, n.K)({ clientServerUrl: e })("POST /users/batch", {
            body: { addresses: r },
            credentials: "same-origin",
            hooks: {
              afterResponse: [
                (e, t, r) => {
                  if (!r.ok)
                    throw new l.M({
                      reason: 404 === r.status ? "not_found" : "http_error",
                      status: r.status,
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
    f = new Map(),
    m = (e) => ["user-profile-batch", e];
  e.s([
    "H",
    0,
    d,
    "T",
    0,
    (e) => {
      let t,
        n,
        l,
        E,
        p,
        h = (0, r.c)(13),
        { address: _, enabled: O } = e,
        N = (0, s.useQueryClient)(),
        I = _ ?? "";
      (h[0] !== I ? ((t = m(I)), (h[0] = I), (h[1] = t)) : (t = h[1]),
        h[2] !== _ || h[3] !== N
          ? ((n = async () => {
              let e = await ((e) => {
                let t = f.get(e);
                if (!t) {
                  let r, n, i;
                  ((r = new Map()),
                    (n = null),
                    (i = () => {
                      n = null;
                      let t = r;
                      r = new Map();
                      let i = [...t.keys()];
                      for (let r = 0; r < i.length; r += 100) {
                        let n = i.slice(r, r + 100);
                        d(e, n)
                          .then((e) => {
                            let r = u(e);
                            for (let e of n) {
                              let n = r.get(e) ?? null;
                              for (let r of t.get(e) ?? []) r.resolve(n);
                            }
                          })
                          .catch((e) => {
                            for (let r of n)
                              for (let n of t.get(r) ?? []) n.reject(e);
                          });
                      }
                    }),
                    (t = {
                      fetch: (e) =>
                        new Promise((t, s) => {
                          let a = r.get(e) ?? [];
                          (a.push({ resolve: t, reject: s }),
                            r.set(e, a),
                            null === n && (n = setTimeout(i, 50)));
                        }),
                    }),
                    f.set(e, t));
                }
                return t;
              })(o).fetch(_ ?? "");
              if (!e) return null;
              for (let t of [e.address, ...(0, a.i)(e, e.address)])
                t && N.setQueryData((0, a.B)(t), (t) => t ?? e);
              return e;
            }),
            (l = () => (_ ? N.getQueryData((0, a.B)(_)) : void 0)),
            (E = () =>
              _ ? N.getQueryState((0, a.B)(_))?.dataUpdatedAt : void 0),
            (h[2] = _),
            (h[3] = N),
            (h[4] = n),
            (h[5] = l),
            (h[6] = E))
          : ((n = h[4]), (l = h[5]), (E = h[6])));
      let R = (void 0 === O || O) && !!_;
      return (
        h[7] !== t || h[8] !== n || h[9] !== l || h[10] !== E || h[11] !== R
          ? ((p = {
              queryKey: t,
              queryFn: n,
              initialData: l,
              initialDataUpdatedAt: E,
              enabled: R,
              staleTime: 3e5,
              retry: c,
            }),
            (h[7] = t),
            (h[8] = n),
            (h[9] = l),
            (h[10] = E),
            (h[11] = R),
            (h[12] = p))
          : (p = h[12]),
        (0, i.useQuery)(p)
      );
    },
    "J",
    0,
    m,
    "V",
    0,
    u,
  ]);
};
