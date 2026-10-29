// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    i = e.i(745018),
    a = e.i(338319);
  e.s([
    "f",
    0,
    (e) => {
      let n,
        l,
        s,
        o,
        c,
        m = (0, r.c)(13),
        { isSorted: d, isDesc: u } = e,
        h = d && !u ? "text-positive" : "text-text-tertiary",
        f = !d && "opacity-60";
      (m[0] !== h || m[1] !== f
        ? ((n = (0, a.c)("h-3 w-3 transition-all duration-200", h, f)),
          (m[0] = h),
          (m[1] = f),
          (m[2] = n))
        : (n = m[2]),
        m[3] !== n
          ? ((l = (0, t.jsx)(i.cg, { className: n })), (m[3] = n), (m[4] = l))
          : (l = m[4]));
      let x = d && u ? "text-positive" : "text-text-tertiary",
        p = !d && "opacity-60";
      return (
        m[5] !== x || m[6] !== p
          ? ((s = (0, a.c)("-mt-1 h-3 w-3 transition-all duration-200", x, p)),
            (m[5] = x),
            (m[6] = p),
            (m[7] = s))
          : (s = m[7]),
        m[8] !== s
          ? ((o = (0, t.jsx)(i.J0, { className: s })), (m[8] = s), (m[9] = o))
          : (o = m[9]),
        m[10] !== l || m[11] !== o
          ? ((c = (0, t.jsxs)("div", {
              className: "-gap-1 relative flex flex-col",
              children: [l, o],
            })),
            (m[10] = l),
            (m[11] = o),
            (m[12] = c))
          : (c = m[12]),
        c
      );
    },
  ]);
};
