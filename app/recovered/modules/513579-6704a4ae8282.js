// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    a = e.i(352386);
  let n = (0, a.createContext)(() => {});
  e.s([
    "g",
    0,
    function (e) {
      let l,
        o,
        s,
        d = (0, i.c)(6),
        { children: c } = e,
        [r, u] = (0, a.useState)("");
      d[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((l = (e) => {
            u((t) => (t === e ? `${e}\xa0` : e));
          }),
          (d[0] = l))
        : (l = d[0]);
      let m = l;
      return (
        d[1] !== r
          ? ((o = (0, t.jsx)("div", {
              "aria-live": "polite",
              role: "status",
              className: "sr-only",
              "data-testid": "screeners-live-region",
              children: r,
            })),
            (d[1] = r),
            (d[2] = o))
          : (o = d[2]),
        d[3] !== c || d[4] !== o
          ? ((s = (0, t.jsxs)(n.Provider, { value: m, children: [c, o] })),
            (d[3] = c),
            (d[4] = o),
            (d[5] = s))
          : (s = d[5]),
        s
      );
    },
    "G",
    0,
    () => (0, a.use)(n),
  ]);
};
