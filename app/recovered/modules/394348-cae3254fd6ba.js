// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    i = e.i(426091),
    a = e.i(352386),
    n = e.i(872522),
    l = e.i(662093);
  let s = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    o = (0, a.memo)(function (e) {
      let a,
        o,
        c,
        m,
        d = (0, r.c)(9),
        { mint: u, chainId: h, fallbackMarketCap: f } = e,
        x = void 0 === f ? 0 : f,
        p = (0, l.h)({ mint: u, chainId: h, fallbackMarketCap: x }) ?? x,
        g = (0, n.v)((0, n._)(p > 0 ? p : null, 0.001));
      if (
        (d[0] !== g
          ? ((a = (0, i.c)(
              "z-1 relative inline-flex items-center justify-end px-0.5 py-1 text-sm max-sm:text-xs sm:px-2",
              (0, n.a)(g),
            )),
            (d[0] = g),
            (d[1] = a))
          : (a = d[1]),
        d[2] !== p)
      )
        ((o =
          p > 0
            ? (0, t.jsx)("span", {
                className:
                  "inline-block whitespace-nowrap text-right text-sm font-medium max-md:text-xs",
                children: s.format(p),
              })
            : "-"),
          (d[2] = p),
          (d[3] = o));
      else o = d[3];
      return (
        d[4] !== o
          ? ((c = (0, t.jsx)("span", {
              className: "font-medium",
              children: o,
            })),
            (d[4] = o),
            (d[5] = c))
          : (c = d[5]),
        d[6] !== a || d[7] !== c
          ? ((m = (0, t.jsx)("div", {
              className: "relative text-right",
              children: (0, t.jsx)("div", {
                className: "inline-block text-right",
                children: (0, t.jsx)("div", { className: a, children: c }),
              }),
            })),
            (d[6] = a),
            (d[7] = c),
            (d[8] = m))
          : (m = d[8]),
        m
      );
    });
  e.s(["f", 0, o], 394348);
  var c = e.i(745018);
  e.i(84455);
  var m = e.i(678730);
  let d = (0, a.memo)((e) => {
    let a,
      l,
      s,
      o,
      d,
      u,
      h,
      f = (0, r.c)(19),
      { value: x } = e,
      p = (0, n.v)(x);
    if (null === x) {
      let e;
      return (
        f[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = (0, t.jsx)("div", {
              className: "text-right",
              children: (0, t.jsx)("div", {
                className: "inline-block min-w-[70px] text-right",
                children: (0, t.jsx)("span", {
                  className: "text-sm max-sm:text-xs",
                  children: "-",
                }),
              }),
            })),
            (f[0] = e))
          : (e = f[0]),
        e
      );
    }
    f[1] !== x ? ((a = (0, m.P)(x)), (f[1] = x), (f[2] = a)) : (a = f[2]);
    let g = a,
      v = m.j[g];
    return (
      f[3] !== p || f[4] !== v
        ? ((l = (0, i.c)(m.B, m.N, v, (0, n.a)(p))),
          (f[3] = p),
          (f[4] = v),
          (f[5] = l))
        : (l = f[5]),
      f[6] !== g
        ? ((s =
            "gain" === g
              ? (0, t.jsx)(c.DD, { "aria-hidden": !0, className: "h-3 w-3" })
              : null),
          (f[6] = g),
          (f[7] = s))
        : (s = f[7]),
      f[8] !== g
        ? ((o =
            "loss" === g
              ? (0, t.jsx)(c.kg, { "aria-hidden": !0, className: "h-3 w-3" })
              : null),
          (f[8] = g),
          (f[9] = o))
        : (o = f[9]),
      f[10] !== x
        ? ((d = (0, m.H)(Math.abs(x))), (f[10] = x), (f[11] = d))
        : (d = f[11]),
      f[12] !== d
        ? ((u = (0, t.jsx)("span", {
            className: "inline-block whitespace-nowrap text-right",
            children: d,
          })),
          (f[12] = d),
          (f[13] = u))
        : (u = f[13]),
      f[14] !== l || f[15] !== s || f[16] !== o || f[17] !== u
        ? ((h = (0, t.jsx)("div", {
            className: "text-right",
            children: (0, t.jsx)("div", {
              className: "inline-block min-w-[70px] text-right",
              children: (0, t.jsxs)("div", {
                className: l,
                children: [s, o, u],
              }),
            }),
          })),
          (f[14] = l),
          (f[15] = s),
          (f[16] = o),
          (f[17] = u),
          (f[18] = h))
        : (h = f[18]),
      h
    );
  });
  ((d.displayName = "PriceChangeCell"), e.s(["f", 0, d], 34714));
};
