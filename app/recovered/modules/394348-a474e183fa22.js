// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    a = e.i(426091),
    l = e.i(352386),
    n = e.i(872522),
    i = e.i(662093);
  let s = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    o = (0, l.memo)(function (e) {
      let l,
        o,
        c,
        d,
        u = (0, r.c)(9),
        { mint: m, chainId: h, fallbackMarketCap: f } = e,
        x = void 0 === f ? 0 : f,
        p = (0, i.h)({ mint: m, chainId: h, fallbackMarketCap: x }) ?? x,
        v = (0, n.v)((0, n._)(p > 0 ? p : null, 0.001));
      if (
        (u[0] !== v
          ? ((l = (0, a.c)(
              "z-1 relative inline-flex items-center justify-end px-0.5 py-1 text-sm max-sm:text-xs sm:px-2",
              (0, n.a)(v),
            )),
            (u[0] = v),
            (u[1] = l))
          : (l = u[1]),
        u[2] !== p)
      )
        ((o =
          p > 0
            ? (0, t.jsx)("span", {
                className:
                  "inline-block whitespace-nowrap text-right text-sm font-medium max-md:text-xs",
                children: s.format(p),
              })
            : "-"),
          (u[2] = p),
          (u[3] = o));
      else o = u[3];
      return (
        u[4] !== o
          ? ((c = (0, t.jsx)("span", {
              className: "font-medium",
              children: o,
            })),
            (u[4] = o),
            (u[5] = c))
          : (c = u[5]),
        u[6] !== l || u[7] !== c
          ? ((d = (0, t.jsx)("div", {
              className: "relative text-right",
              children: (0, t.jsx)("div", {
                className: "inline-block text-right",
                children: (0, t.jsx)("div", { className: l, children: c }),
              }),
            })),
            (u[6] = l),
            (u[7] = c),
            (u[8] = d))
          : (d = u[8]),
        d
      );
    });
  e.s(["f", 0, o], 394348);
  var c = e.i(745018);
  e.i(84455);
  var d = e.i(678730);
  let u = (0, l.memo)((e) => {
    let l,
      i,
      s,
      o,
      u,
      m,
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
    f[1] !== x ? ((l = (0, d.P)(x)), (f[1] = x), (f[2] = l)) : (l = f[2]);
    let v = l,
      b = d.j[v];
    return (
      f[3] !== p || f[4] !== b
        ? ((i = (0, a.c)(d.B, d.N, b, (0, n.a)(p))),
          (f[3] = p),
          (f[4] = b),
          (f[5] = i))
        : (i = f[5]),
      f[6] !== v
        ? ((s =
            "gain" === v
              ? (0, t.jsx)(c.DD, { "aria-hidden": !0, className: "h-3 w-3" })
              : null),
          (f[6] = v),
          (f[7] = s))
        : (s = f[7]),
      f[8] !== v
        ? ((o =
            "loss" === v
              ? (0, t.jsx)(c.kg, { "aria-hidden": !0, className: "h-3 w-3" })
              : null),
          (f[8] = v),
          (f[9] = o))
        : (o = f[9]),
      f[10] !== x
        ? ((u = (0, d.H)(Math.abs(x))), (f[10] = x), (f[11] = u))
        : (u = f[11]),
      f[12] !== u
        ? ((m = (0, t.jsx)("span", {
            className: "inline-block whitespace-nowrap text-right",
            children: u,
          })),
          (f[12] = u),
          (f[13] = m))
        : (m = f[13]),
      f[14] !== i || f[15] !== s || f[16] !== o || f[17] !== m
        ? ((h = (0, t.jsx)("div", {
            className: "text-right",
            children: (0, t.jsx)("div", {
              className: "inline-block min-w-[70px] text-right",
              children: (0, t.jsxs)("div", {
                className: i,
                children: [s, o, m],
              }),
            }),
          })),
          (f[14] = i),
          (f[15] = s),
          (f[16] = o),
          (f[17] = m),
          (f[18] = h))
        : (h = f[18]),
      h
    );
  });
  ((u.displayName = "PriceChangeCell"), e.s(["f", 0, u], 34714));
};
