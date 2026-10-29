// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(76373),
    r = e.i(183249),
    o = e.i(811369),
    s = e.i(612735),
    n = e.i(989494),
    a = e.i(449985),
    i = e.i(108270),
    c = e.i(382772),
    l = e.i(19648);
  function u(e, t = {}) {
    void 0 !== t.size && (0, c.u)(e, { size: t.size });
    let r = (0, l.v)(e, t);
    return (0, c.T)(r, t);
  }
  var d = e.i(590719),
    f = e.i(971860);
  function b(e) {
    let { type: t } = e;
    if ("string" === t || "bytes" === t || t.endsWith("[]")) return !0;
    if ("tuple" === t) return e.components?.some(b);
    let r = (0, f.t)(e.type);
    return !!(r && b({ ...e, type: r[1] }));
  }
  e.s(
    [
      "f",
      0,
      function (e, p) {
        let h = "string" == typeof p ? (0, d.X)(p) : p,
          m = (0, o.f)(h);
        if (0 === (0, s.f)(h) && e.length > 0) throw new t.g();
        if ((0, s.f)(p) && 32 > (0, s.f)(p))
          throw new t.D({
            data: "string" == typeof p ? p : (0, l.v)(p),
            params: e,
            size: (0, s.f)(p),
          });
        let g = 0,
          y = [];
        for (let o = 0; o < e.length; ++o) {
          let s = e[o];
          m.setPosition(g);
          let [d, p] = (function e(o, s, { staticPosition: d }) {
            let p = (0, f.t)(s.type);
            if (p) {
              let [t, r] = p;
              return (function (t, r, { length: o, staticPosition: s }) {
                if (!o) {
                  let o = s + u(t.readBytes(32)),
                    n = o + 32;
                  t.setPosition(o);
                  let a = u(t.readBytes(32)),
                    i = b(r),
                    c = 0,
                    l = [];
                  for (let o = 0; o < a; ++o) {
                    t.setPosition(n + (i ? 32 * o : c));
                    let [s, a] = e(t, r, { staticPosition: n });
                    ((c += a), l.push(s));
                  }
                  return (t.setPosition(s + 32), [l, 32]);
                }
                if (b(r)) {
                  let n = s + u(t.readBytes(32)),
                    a = [];
                  for (let s = 0; s < o; ++s) {
                    t.setPosition(n + 32 * s);
                    let [o] = e(t, r, { staticPosition: n });
                    a.push(o);
                  }
                  return (t.setPosition(s + 32), [a, 32]);
                }
                let n = 0,
                  a = [];
                for (let i = 0; i < o; ++i) {
                  let [o, i] = e(t, r, { staticPosition: s + n });
                  ((n += i), a.push(o));
                }
                return [a, n];
              })(o, { ...s, type: r }, { length: t, staticPosition: d });
            }
            if ("tuple" === s.type)
              return (function (t, r, { staticPosition: o }) {
                let s =
                    0 === r.components.length ||
                    r.components.some(({ name: e }) => !e),
                  n = s ? [] : {},
                  a = 0;
                if (b(r)) {
                  let i = o + u(t.readBytes(32));
                  for (let o = 0; o < r.components.length; ++o) {
                    let c = r.components[o];
                    t.setPosition(i + a);
                    let [l, u] = e(t, c, { staticPosition: i });
                    ((a += u), (n[s ? o : c?.name] = l));
                  }
                  return (t.setPosition(o + 32), [n, 32]);
                }
                for (let i = 0; i < r.components.length; ++i) {
                  let c = r.components[i],
                    [l, u] = e(t, c, { staticPosition: o });
                  ((n[s ? i : c?.name] = l), (a += u));
                }
                return [n, a];
              })(o, s, { staticPosition: d });
            if ("address" === s.type) {
              let e;
              return (
                (e = o.readBytes(32)),
                [(0, r.b)((0, l.v)((0, n.S)(e, -20))), 32]
              );
            }
            if ("bool" === s.type)
              return [
                (function (e, t = {}) {
                  let r = e;
                  if (
                    (void 0 !== t.size &&
                      ((0, c.u)(r, { size: t.size }), (r = (0, a.f)(r))),
                    r.length > 1 || r[0] > 1)
                  )
                    throw new i.C(r);
                  return !!r[0];
                })(o.readBytes(32), { size: 32 }),
                32,
              ];
            if (s.type.startsWith("bytes"))
              return (function (e, t, { staticPosition: r }) {
                let [o, s] = t.type.split("bytes");
                if (!s) {
                  let t = u(e.readBytes(32));
                  e.setPosition(r + t);
                  let o = u(e.readBytes(32));
                  if (0 === o) return (e.setPosition(r + 32), ["0x", 32]);
                  let s = e.readBytes(o);
                  return (e.setPosition(r + 32), [(0, l.v)(s), 32]);
                }
                return [(0, l.v)(e.readBytes(Number.parseInt(s, 10), 32)), 32];
              })(o, s, { staticPosition: d });
            if (s.type.startsWith("uint") || s.type.startsWith("int")) {
              var h, m;
              let e, t, r;
              return (
                (h = o),
                (e = (m = s).type.startsWith("int")),
                (t = Number.parseInt(m.type.split("int")[1] || "256", 10)),
                (r = h.readBytes(32)),
                [
                  t > 48
                    ? (function (e, t = {}) {
                        void 0 !== t.size && (0, c.u)(e, { size: t.size });
                        let r = (0, l.v)(e, t);
                        return (0, c.K)(r, t);
                      })(r, { signed: e })
                    : u(r, { signed: e }),
                  32,
                ]
              );
            }
            if ("string" === s.type)
              return (function (e, { staticPosition: t }) {
                let r = u(e.readBytes(32));
                e.setPosition(t + r);
                let o = u(e.readBytes(32));
                if (0 === o) return (e.setPosition(t + 32), ["", 32]);
                let s = e.readBytes(o, 32),
                  n = (function (e, t = {}) {
                    let r = e;
                    return (
                      void 0 !== t.size &&
                        ((0, c.u)(r, { size: t.size }),
                        (r = (0, a.f)(r, { dir: "right" }))),
                      new TextDecoder().decode(r)
                    );
                  })((0, a.f)(s));
                return (e.setPosition(t + 32), [n, 32]);
              })(o, { staticPosition: d });
            throw new t.l(s.type, {
              docsPath: "/docs/contract/decodeAbiParameters",
            });
          })(m, s, { staticPosition: 0 });
          ((g += p), y.push(d));
        }
        return y;
      },
    ],
    887857,
  );
};
