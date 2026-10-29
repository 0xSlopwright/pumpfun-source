// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    l = e.i(445242),
    a = e.i(745018),
    s = e.i(352386);
  e.i(12692);
  var r = e.i(398902),
    i = e.i(783358),
    n = e.i(764844);
  e.i(267146);
  var o = e.i(540805),
    c = e.i(338319);
  function d(e) {
    return e.stopPropagation();
  }
  function u(e) {
    return e.stopPropagation();
  }
  e.s([
    "f",
    0,
    function (e) {
      let m,
        p,
        x,
        f,
        h,
        g,
        y,
        b,
        v,
        w,
        j,
        _,
        k,
        N = (0, l.c)(38),
        {
          count: I,
          reposted: C,
          busy: S,
          onToggleRepost: A,
          onQuote: U,
          dense: L,
        } = e,
        { t: z } = (0, r.f)(),
        [P, q] = (0, s.useState)(!1),
        O = L ? "size-3.5" : "size-4";
      N[0] !== C || N[1] !== z
        ? ((m = z(
            C
              ? "web.callouts.repost_menu_open_a11y"
              : "web.callouts.repost_a11y",
          )),
          (N[0] = C),
          (N[1] = z),
          (N[2] = m))
        : (m = N[2]);
      let T = C ? "text-text-accent" : i.V;
      return (
        N[3] !== T
          ? ((p = (0, c.c)(i._, T)), (N[3] = T), (N[4] = p))
          : (p = N[4]),
        N[5] === Symbol.for("react.memo_cache_sentinel")
          ? ((x = (0, t.jsx)(a.I3, { className: i.f })), (N[5] = x))
          : (x = N[5]),
        N[6] !== I
          ? ((f =
              null != I && I > 0
                ? (0, t.jsx)("span", { className: i.c, children: (0, o.O)(I) })
                : null),
            (N[6] = I),
            (N[7] = f))
          : (f = N[7]),
        N[8] !== m || N[9] !== p || N[10] !== f
          ? ((h = (0, t.jsxs)(n.g, {
              "aria-label": m,
              "data-testid": "callout-action-repost",
              onClick: u,
              className: p,
              children: [x, f],
            })),
            (N[8] = m),
            (N[9] = p),
            (N[10] = f),
            (N[11] = h))
          : (h = N[11]),
        N[12] !== O
          ? ((g = (0, t.jsx)(a.I3, { className: O })), (N[12] = O), (N[13] = g))
          : (g = N[13]),
        N[14] !== C || N[15] !== z
          ? ((y = z(C ? "callouts.repost.undo" : "callouts.repost.repost")),
            (N[14] = C),
            (N[15] = z),
            (N[16] = y))
          : (y = N[16]),
        N[17] !== S || N[18] !== A || N[19] !== g || N[20] !== y
          ? ((b = (0, t.jsxs)(n.d, {
              "data-testid": "callout-repost-menu-toggle",
              disabled: S,
              onClick: A,
              children: [g, y],
            })),
            (N[17] = S),
            (N[18] = A),
            (N[19] = g),
            (N[20] = y),
            (N[21] = b))
          : (b = N[21]),
        N[22] !== O
          ? ((v = (0, t.jsx)(a.wh, { className: O })), (N[22] = O), (N[23] = v))
          : (v = N[23]),
        N[24] !== z
          ? ((w = z("callouts.repost.quote")), (N[24] = z), (N[25] = w))
          : (w = N[25]),
        N[26] !== U || N[27] !== w || N[28] !== v
          ? ((j = (0, t.jsxs)(n.d, {
              "data-testid": "callout-repost-menu-quote",
              onClick: U,
              children: [v, w],
            })),
            (N[26] = U),
            (N[27] = w),
            (N[28] = v),
            (N[29] = j))
          : (j = N[29]),
        N[30] !== L || N[31] !== j || N[32] !== b
          ? ((_ = (0, t.jsxs)(n.A, {
              align: "start",
              dense: L,
              className: "w-44",
              onClick: d,
              children: [b, j],
            })),
            (N[30] = L),
            (N[31] = j),
            (N[32] = b),
            (N[33] = _))
          : (_ = N[33]),
        N[34] !== P || N[35] !== _ || N[36] !== h
          ? ((k = (0, t.jsxs)(n.k, {
              open: P,
              onOpenChange: q,
              modal: !1,
              children: [h, _],
            })),
            (N[34] = P),
            (N[35] = _),
            (N[36] = h),
            (N[37] = k))
          : (k = N[37]),
        k
      );
    },
  ]);
};
