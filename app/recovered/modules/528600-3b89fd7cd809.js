// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(445242),
    s = e.i(30181),
    t = e.i(690877),
    o = e.i(606933),
    a = e.i(136354),
    n = e.i(786480);
  let i = (e) => ["user", e],
    c = (e, r) =>
      (0, n.f)(e.address)
        ? []
        : [e.userId, e.address, e.username].filter((e) => !!e && e !== r);
  e.s(["i", 0, c, "B", 0, i], 448341);
  class d extends Error {
    reason;
    status;
    constructor({ reason: e, status: r } = {}) {
      (super("Failed to fetch user"),
        (this.name = "UserFetchError"),
        (this.status = r),
        (this.reason =
          e ??
          (404 === r ? "not_found" : void 0 !== r ? "http_error" : "unknown")));
    }
  }
  let l = (e) => e instanceof d && "not_found" === e.reason,
    u = (e) =>
      e instanceof d &&
      void 0 !== e.status &&
      e.status >= 400 &&
      e.status < 500,
    y = (e, r) => !u(r) && e < 3,
    f = (e) => {
      let s,
        a,
        n,
        d = (0, r.c)(11),
        {
          clientServerUrl: l,
          enabled: u,
          queryOptions: f,
          userIdentifier: B,
        } = e,
        p = (u ?? !0) && !!B,
        m = (0, o.useQueryClient)();
      return (
        d[0] !== l || d[1] !== m || d[2] !== B
          ? ((s = async () => {
              let e = await g({ clientServerUrl: l, userIdentifier: B });
              for (let r of c(e, B)) m.setQueryData(i(r), (r) => r ?? e);
              return e;
            }),
            (d[0] = l),
            (d[1] = m),
            (d[2] = B),
            (d[3] = s))
          : (s = d[3]),
        d[4] !== B ? ((a = i(B)), (d[4] = B), (d[5] = a)) : (a = d[5]),
        d[6] !== p || d[7] !== f || d[8] !== s || d[9] !== a
          ? ((n = {
              enabled: p,
              queryFn: s,
              queryKey: a,
              refetchOnMount: !1,
              refetchOnWindowFocus: !1,
              retry: y,
              ...f,
            }),
            (d[6] = p),
            (d[7] = f),
            (d[8] = s),
            (d[9] = a),
            (d[10] = n))
          : (n = d[10]),
        (0, t.useQuery)(n)
      );
    },
    B = async (e) => {
      try {
        return (await g(e), "exists");
      } catch (e) {
        return l(e) ? "missing" : "unknown";
      }
    },
    g = async (e) => {
      let { clientServerUrl: r, fetchOptions: t, userIdentifier: o } = e;
      try {
        return await (0, s.K)({ clientServerUrl: r })("GET /users/{id}", {
          ...t,
          params: { id: o },
          credentials: t?.credentials ?? "same-origin",
          retry: 0,
          hooks: {
            afterResponse: [
              async (e, r, s) => {
                if (!s.ok)
                  throw new d({
                    reason: 404 === s.status ? "not_found" : "http_error",
                    status: s.status,
                  });
                if ("" === (await s.clone().text()).trim())
                  throw new d({ reason: "empty_body" });
              },
            ],
          },
        });
      } catch (e) {
        if (e instanceof SyntaxError) throw new d({ reason: "invalid_json" });
        throw e;
      }
    };
  e.s(
    [
      "M",
      0,
      d,
      "d",
      0,
      B,
      "e",
      0,
      g,
      "r",
      0,
      u,
      "g",
      0,
      l,
      "B",
      0,
      y,
      "U",
      0,
      (e) => {
        let s,
          t = (0, r.c)(5),
          { enabled: o, queryOptions: n, userIdentifier: i } = e,
          { clientServerUrl: c } = (0, a.useUserConfig)();
        return (
          t[0] !== c || t[1] !== o || t[2] !== n || t[3] !== i
            ? ((s = {
                clientServerUrl: c,
                enabled: o,
                queryOptions: n,
                userIdentifier: i,
              }),
              (t[0] = c),
              (t[1] = o),
              (t[2] = n),
              (t[3] = i),
              (t[4] = s))
            : (s = t[4]),
          f(s)
        );
      },
      "C",
      0,
      f,
    ],
    528600,
  );
};
