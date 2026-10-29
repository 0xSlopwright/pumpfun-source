// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(938277),
    a = e.i(146695),
    o = e.i(574472),
    l = e.i(458310);
  e.i(12692);
  var i = e.i(398902),
    c = e.i(329892);
  e.i(70833);
  var s = e.i(102824),
    u = e.i(363250),
    f = e.i(918094);
  e.s([
    "SidebarRewards",
    0,
    function () {
      let e,
        h,
        d,
        p,
        v,
        m,
        b,
        g,
        y,
        B = (0, n.c)(20),
        { t: w } = (0, i.f)(),
        { combinedSolBalanceDisplay: k } = (0, s.f)();
      B[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = {}), (B[0] = e))
        : (e = B[0]);
      let { data: _ } = (0, u.f)(e),
        { address: x, userId: I, user: S } = (0, o.F)(),
        A = parseFloat(k || "0") * (void 0 === _ ? 0 : _);
      if (!A || 0 === A || !x) return null;
      B[1] !== x || B[2] !== S || B[3] !== I
        ? ((h = (0, f.f)({ address: x, userId: I, user: S }) ?? (0, a.$)(x)),
          (B[1] = x),
          (B[2] = S),
          (B[3] = I),
          (B[4] = h))
        : (h = B[4]);
      let C = h,
        $ = `${C}?tab=coins`;
      return (
        B[5] !== w
          ? ((d = w("creator_fees.creator_rewards")), (B[5] = w), (B[6] = d))
          : (d = B[6]),
        B[7] !== d
          ? ((p = (0, t.jsx)("p", {
              className:
                "truncate text-[11px] leading-none text-text-quaternary",
              children: d,
            })),
            (B[7] = d),
            (B[8] = p))
          : (p = B[8]),
        B[9] === Symbol.for("react.memo_cache_sentinel")
          ? ((v = (0, t.jsx)(c.f, {})), (B[9] = v))
          : (v = B[9]),
        B[10] !== p
          ? ((m = (0, t.jsxs)("div", {
              className: "flex items-center justify-between gap-2",
              children: [p, v],
            })),
            (B[10] = p),
            (B[11] = m))
          : (m = B[11]),
        B[12] !== A
          ? ((b = (0, r.q)(A, 2)), (B[12] = A), (B[13] = b))
          : (b = B[13]),
        B[14] !== b
          ? ((g = (0, t.jsx)("p", {
              className:
                "text-[13px] font-medium leading-4 tabular-nums text-text-primary",
              children: b,
            })),
            (B[14] = b),
            (B[15] = g))
          : (g = B[15]),
        B[16] !== $ || B[17] !== m || B[18] !== g
          ? ((y = (0, t.jsxs)(l.default, {
              href: $,
              className:
                "mt-2 flex cursor-pointer flex-col gap-1 rounded-md border border-border-secondary bg-bg-secondary px-2.5 py-2 transition-colors hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent",
              children: [m, g],
            })),
            (B[16] = $),
            (B[17] = m),
            (B[18] = g),
            (B[19] = y))
          : (y = B[19]),
        y
      );
    },
  ]);
};
