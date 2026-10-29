// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(267146);
  var t = e.i(540805),
    r = e.i(890088),
    n = e.i(714283),
    i = e.i(90832);
  let l = (e) => {
      let t = Number(e);
      return Number.isFinite(t) ? t : 0;
    },
    a = (e) => (0, t.w)(l(e)),
    u = (e) => (0, i.m)(l(e), 4),
    s = { lt: "<", eq: "", gt: ">" };
  e.s([
    "_",
    0,
    (e) => (0, t.l)(l(e)),
    "B",
    0,
    ({ outAmount: e, denominationOut: t }) =>
      "sol" === t
        ? { amount: `≈ ${u(e)}`, symbol: "SOL" }
        : { amount: a(e).replace(/^\$/, ""), symbol: "USDC" },
    "r",
    0,
    ({ impactBps: e, bookDepthExceeded: t, locale: i }) => {
      let { pct: l, bound: a } = (({
          impactBps: e,
          bookDepthExceeded: t = !1,
        }) => {
          let r = Math.max(0, Number.isFinite(e) ? e : 0) / 100;
          return t
            ? { pct: Math.max(r, 0.01), bound: "gt" }
            : r < 0.01
              ? { pct: 0.01, bound: "lt" }
              : { pct: r, bound: "eq" };
        })({ impactBps: e, bookDepthExceeded: t }),
        u = (0, r.R)(i, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(l);
      return (0, n.f)(`${s[a]}${u}%`);
    },
    "$",
    0,
    ({ size: e, locale: t }) =>
      (0, n.f)(
        (0, r.R)(t, { maximumFractionDigits: 6, useGrouping: !1 }).format(l(e)),
      ),
    "s",
    0,
    u,
    "O",
    0,
    a,
    "t",
    0,
    ({ value: e, locale: t }) =>
      (0, n.f)(
        (0, r.R)(t, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(l(e)),
      ),
    "U",
    0,
    ({ impactBps: e, bookDepthExceeded: t = !1 }) => t || e > 100,
    "L",
    0,
    l,
  ]);
};
