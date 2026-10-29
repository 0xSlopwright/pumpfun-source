// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(532617),
    r = e.i(503725),
    o = e.i(416532),
    s = e.i(19648),
    n = e.i(664596),
    a = e.i(300950),
    i = e.i(393547);
  e.s([
    "f",
    0,
    function (e, c = {}) {
      return async (l, u = {}) => {
        let {
            dedupe: d = !1,
            methods: f,
            retryDelay: b = 150,
            retryCount: p = 3,
            uid: h,
          } = { ...c, ...u },
          { method: m } = l;
        if (f?.exclude?.includes(m) || (f?.include && !f.include.includes(m)))
          throw new o.b(Error("method not supported"), { method: m });
        let g = d ? (0, s.B)(`${h}.${(0, i.f)(l)}`) : void 0;
        return (0, n.f)(
          () =>
            (0, a.f)(
              async () => {
                try {
                  return await e(l);
                } catch (e) {
                  switch (e.code) {
                    case o.Q.code:
                      throw new o.Q(e);
                    case o.P.code:
                      throw new o.P(e);
                    case o.X.code:
                      throw new o.X(e, { method: l.method });
                    case o.u.code:
                      throw new o.u(e);
                    case o.D.code:
                      throw new o.D(e);
                    case o.L.code:
                      throw new o.L(e);
                    case o.V.code:
                      throw new o.V(e);
                    case o.j.code:
                      throw new o.j(e);
                    case o.g.code:
                      throw new o.g(e);
                    case o.b.code:
                      throw new o.b(e, { method: l.method });
                    case o.H.code:
                      throw new o.H(e);
                    case o.J.code:
                      throw new o.J(e);
                    case o.k.code:
                      throw new o.k(e);
                    case o.$.code:
                      throw new o.$(e);
                    case o.q.code:
                      throw new o.q(e);
                    case o.p.code:
                      throw new o.p(e);
                    case o.r.code:
                      throw new o.r(e);
                    case o.S.code:
                      throw new o.S(e);
                    case o.E.code:
                      throw new o.E(e);
                    case o.d.code:
                      throw new o.d(e);
                    case o.a.code:
                      throw new o.a(e);
                    case o.s.code:
                      throw new o.s(e);
                    case o.Y.code:
                      throw new o.Y(e);
                    case o.Z.code:
                      throw new o.Z(e);
                    case o.T.code:
                      throw new o.T(e);
                    case 5e3:
                      throw new o.k(e);
                    default:
                      if (e instanceof t.f) throw e;
                      throw new o.U(e);
                  }
                }
              },
              {
                delay: ({ count: e, error: t }) => {
                  if (t && t instanceof r.y) {
                    let e = t?.headers?.get("Retry-After");
                    if (e?.match(/\d/)) return 1e3 * Number.parseInt(e, 10);
                  }
                  return ~~(1 << e) * b;
                },
                retryCount: p,
                shouldRetry: ({ error: e }) => {
                  var t;
                  return "code" in (t = e) && "number" == typeof t.code
                    ? -1 === t.code ||
                        t.code === o.H.code ||
                        t.code === o.D.code
                    : !(t instanceof r.y) ||
                        !t.status ||
                        403 === t.status ||
                        408 === t.status ||
                        413 === t.status ||
                        429 === t.status ||
                        500 === t.status ||
                        502 === t.status ||
                        503 === t.status ||
                        504 === t.status ||
                        !1;
                },
              },
            ),
          { enabled: d, id: g },
        );
      };
    },
  ]);
};
