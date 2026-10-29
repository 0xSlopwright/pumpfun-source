// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    a = e.i(745018),
    l = e.i(338319);
  e.s([
    "f",
    0,
    (e) => {
      let n,
        i,
        s,
        o,
        c,
        d = (0, r.c)(13),
        { isSorted: u, isDesc: m } = e,
        h = u && !m ? "text-positive" : "text-text-tertiary",
        f = !u && "opacity-60";
      (d[0] !== h || d[1] !== f
        ? ((n = (0, l.c)("h-3 w-3 transition-all duration-200", h, f)),
          (d[0] = h),
          (d[1] = f),
          (d[2] = n))
        : (n = d[2]),
        d[3] !== n
          ? ((i = (0, t.jsx)(a.cg, { className: n })), (d[3] = n), (d[4] = i))
          : (i = d[4]));
      let x = u && m ? "text-positive" : "text-text-tertiary",
        p = !u && "opacity-60";
      return (
        d[5] !== x || d[6] !== p
          ? ((s = (0, l.c)("-mt-1 h-3 w-3 transition-all duration-200", x, p)),
            (d[5] = x),
            (d[6] = p),
            (d[7] = s))
          : (s = d[7]),
        d[8] !== s
          ? ((o = (0, t.jsx)(a.J0, { className: s })), (d[8] = s), (d[9] = o))
          : (o = d[9]),
        d[10] !== i || d[11] !== o
          ? ((c = (0, t.jsxs)("div", {
              className: "-gap-1 relative flex flex-col",
              children: [i, o],
            })),
            (d[10] = i),
            (d[11] = o),
            (d[12] = c))
          : (c = d[12]),
        c
      );
    },
  ]);
};
