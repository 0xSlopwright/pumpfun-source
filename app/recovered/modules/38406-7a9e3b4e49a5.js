// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(79631),
    r = e.i(889451),
    n = e.i(384886);
  e.s([
    "f",
    0,
    (e) => {
      let a,
        o,
        s = (0, t.c)(9),
        { mint: l, authorAddress: d, positionPnl: c, chainId: u } = e,
        m = !!c,
        f = (0, n.h)(l, u),
        {
          positionFor: b,
          isLoading: p,
          isError: h,
        } = (0, i._)({ userId: d, mints: [f], enabled: !m }),
        w = r.y,
        v = c ?? b(f) ?? b(l);
      s[0] !== w || s[1] !== v
        ? ((a = w(v)), (s[0] = w), (s[1] = v), (s[2] = a))
        : (a = s[2]);
      let g = a,
        y = !!(g && !g.isClosed),
        x = !m && p,
        k = !m && h,
        C = !x && !k && g?.isClosed === !0,
        S = !!l && !!d && !x && !k && C;
      return (
        s[3] !== y || s[4] !== C || s[5] !== k || s[6] !== x || s[7] !== S
          ? ((o = {
              hasOpenPosition: y,
              isClosed: C,
              isLoading: x,
              isError: k,
              shouldHide: S,
            }),
            (s[3] = y),
            (s[4] = C),
            (s[5] = k),
            (s[6] = x),
            (s[7] = S),
            (s[8] = o))
          : (o = s[8]),
        o
      );
    },
  ]);
};
