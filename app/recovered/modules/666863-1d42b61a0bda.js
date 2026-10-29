// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(352386),
    r = e.i(456753);
  e.s([
    "f",
    0,
    (e, n, a, l) => {
      let s,
        o,
        c,
        m = (0, t.c)(11),
        u = (0, i.useRef)(null),
        { observe: d, unobserve: f, addSeenCoin: h } = (0, r.j)();
      m[0] !== h ||
      m[1] !== n ||
      m[2] !== e ||
      m[3] !== d ||
      m[4] !== a ||
      m[5] !== l
        ? ((s = () => {
            u.current &&
              void 0 !== n &&
              d(
                u.current,
                e,
                () => {
                  h({
                    coinId: e,
                    itemPosition: n.itemPosition,
                    marketCap: n.marketCap,
                    sourceScreen: n.sourceScreen,
                    rec_id: n.rec_id,
                    recommendationRank: n.recommendationRank,
                    searchTerm: a,
                    sourceElement: n.sourceElement ?? l,
                  });
                },
                n.rec_id,
              );
          }),
          (m[0] = h),
          (m[1] = n),
          (m[2] = e),
          (m[3] = d),
          (m[4] = a),
          (m[5] = l),
          (m[6] = s))
        : (s = m[6]);
      let p = s;
      return (
        m[7] !== p || m[8] !== f
          ? ((o = () => {
              p();
              let e = u.current;
              return () => {
                e && f(e);
              };
            }),
            (c = [p, f]),
            (m[7] = p),
            (m[8] = f),
            (m[9] = o),
            (m[10] = c))
          : ((o = m[9]), (c = m[10])),
        (0, i.useEffect)(o, c),
        u
      );
    },
  ]);
};
