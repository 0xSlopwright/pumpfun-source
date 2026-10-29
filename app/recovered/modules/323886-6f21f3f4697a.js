// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(532617),
    r = e.i(503725),
    t = e.i(416532),
    o = e.i(19648),
    a = e.i(664596),
    s = e.i(300950),
    n = e.i(393547);
  e.s([
    "f",
    0,
    function (e, c = {}) {
      return async (i, d = {}) => {
        let {
            dedupe: u = !1,
            methods: l,
            retryDelay: b = 150,
            retryCount: h = 3,
            uid: p,
          } = { ...c, ...d },
          { method: w } = i;
        if (l?.exclude?.includes(w) || (l?.include && !l.include.includes(w)))
          throw new t.b(Error("method not supported"), { method: w });
        let m = u ? (0, o.B)(`${p}.${(0, n.f)(i)}`) : void 0;
        return (0, a.f)(
          () =>
            (0, s.f)(
              async () => {
                try {
                  return await e(i);
                } catch (e) {
                  switch (e.code) {
                    case t.Q.code:
                      throw new t.Q(e);
                    case t.P.code:
                      throw new t.P(e);
                    case t.X.code:
                      throw new t.X(e, { method: i.method });
                    case t.u.code:
                      throw new t.u(e);
                    case t.D.code:
                      throw new t.D(e);
                    case t.L.code:
                      throw new t.L(e);
                    case t.V.code:
                      throw new t.V(e);
                    case t.j.code:
                      throw new t.j(e);
                    case t.g.code:
                      throw new t.g(e);
                    case t.b.code:
                      throw new t.b(e, { method: i.method });
                    case t.H.code:
                      throw new t.H(e);
                    case t.J.code:
                      throw new t.J(e);
                    case t.k.code:
                      throw new t.k(e);
                    case t.$.code:
                      throw new t.$(e);
                    case t.q.code:
                      throw new t.q(e);
                    case t.p.code:
                      throw new t.p(e);
                    case t.r.code:
                      throw new t.r(e);
                    case t.S.code:
                      throw new t.S(e);
                    case t.E.code:
                      throw new t.E(e);
                    case t.d.code:
                      throw new t.d(e);
                    case t.a.code:
                      throw new t.a(e);
                    case t.s.code:
                      throw new t.s(e);
                    case t.Y.code:
                      throw new t.Y(e);
                    case t.Z.code:
                      throw new t.Z(e);
                    case t.T.code:
                      throw new t.T(e);
                    case 5e3:
                      throw new t.k(e);
                    default:
                      if (e instanceof f.f) throw e;
                      throw new t.U(e);
                  }
                }
              },
              {
                delay: ({ count: e, error: f }) => {
                  if (f && f instanceof r.y) {
                    let e = f?.headers?.get("Retry-After");
                    if (e?.match(/\d/)) return 1e3 * Number.parseInt(e, 10);
                  }
                  return ~~(1 << e) * b;
                },
                retryCount: h,
                shouldRetry: ({ error: e }) => {
                  var f;
                  return "code" in (f = e) && "number" == typeof f.code
                    ? -1 === f.code ||
                        f.code === t.H.code ||
                        f.code === t.D.code
                    : !(f instanceof r.y) ||
                        !f.status ||
                        403 === f.status ||
                        408 === f.status ||
                        413 === f.status ||
                        429 === f.status ||
                        500 === f.status ||
                        502 === f.status ||
                        503 === f.status ||
                        504 === f.status ||
                        !1;
                },
              },
            ),
          { enabled: u, id: m },
        );
      };
    },
  ]);
};
