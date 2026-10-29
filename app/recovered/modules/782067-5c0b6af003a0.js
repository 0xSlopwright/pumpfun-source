// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(149502),
    n = e.i(445242),
    r = e.i(30181),
    a = e.i(690877),
    l = e.i(606933),
    i = e.i(448341),
    o = e.i(528600);
  let s =
      (void 0 !== t.default && "https://frontend-api-v3.pump.fun") ||
      "https://frontend-api-v3.pump.fun",
    c = (e, t) =>
      (!(t instanceof o.M) ||
        void 0 === t.status ||
        !(t.status >= 400) ||
        !(t.status < 500)) &&
      e < 1,
    u = (e) => {
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
                    throw new o.M({
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
    d = new Map(),
    h = (e) => ["user-profile-batch", e];
  e.s([
    "H",
    0,
    f,
    "T",
    0,
    (e) => {
      let t,
        r,
        o,
        p,
        m,
        v = (0, n.c)(13),
        { address: y, enabled: g } = e,
        b = (0, l.useQueryClient)(),
        x = y ?? "";
      (v[0] !== x ? ((t = h(x)), (v[0] = x), (v[1] = t)) : (t = v[1]),
        v[2] !== y || v[3] !== b
          ? ((r = async () => {
              let e = await ((e) => {
                let t = d.get(e);
                if (!t) {
                  let n, r, a;
                  ((n = new Map()),
                    (r = null),
                    (a = () => {
                      r = null;
                      let t = n;
                      n = new Map();
                      let a = [...t.keys()];
                      for (let n = 0; n < a.length; n += 100) {
                        let r = a.slice(n, n + 100);
                        f(e, r)
                          .then((e) => {
                            let n = u(e);
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
                        new Promise((t, l) => {
                          let i = n.get(e) ?? [];
                          (i.push({ resolve: t, reject: l }),
                            n.set(e, i),
                            null === r && (r = setTimeout(a, 50)));
                        }),
                    }),
                    d.set(e, t));
                }
                return t;
              })(s).fetch(y ?? "");
              if (!e) return null;
              for (let t of [e.address, ...(0, i.i)(e, e.address)])
                t && b.setQueryData((0, i.B)(t), (t) => t ?? e);
              return e;
            }),
            (o = () => (y ? b.getQueryData((0, i.B)(y)) : void 0)),
            (p = () =>
              y ? b.getQueryState((0, i.B)(y))?.dataUpdatedAt : void 0),
            (v[2] = y),
            (v[3] = b),
            (v[4] = r),
            (v[5] = o),
            (v[6] = p))
          : ((r = v[4]), (o = v[5]), (p = v[6])));
      let w = (void 0 === g || g) && !!y;
      return (
        v[7] !== t || v[8] !== r || v[9] !== o || v[10] !== p || v[11] !== w
          ? ((m = {
              queryKey: t,
              queryFn: r,
              initialData: o,
              initialDataUpdatedAt: p,
              enabled: w,
              staleTime: 3e5,
              retry: c,
            }),
            (v[7] = t),
            (v[8] = r),
            (v[9] = o),
            (v[10] = p),
            (v[11] = w),
            (v[12] = m))
          : (m = v[12]),
        (0, a.useQuery)(m)
      );
    },
    "J",
    0,
    h,
    "V",
    0,
    u,
  ]);
};
