// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(445242),
    t = e.i(509836),
    a = e.i(352386);
  e.s([
    "PrivyReader",
    0,
    function (e) {
      let r,
        i,
        o = (0, n.c)(6),
        { onChange: s } = e,
        { user: d, ready: l, authenticated: c } = (0, t.f)();
      return (
        o[0] !== c || o[1] !== s || o[2] !== l || o[3] !== d
          ? ((r = () => {
              s({ user: d, ready: l, authenticated: c });
            }),
            (i = [d, l, c, s]),
            (o[0] = c),
            (o[1] = s),
            (o[2] = l),
            (o[3] = d),
            (o[4] = r),
            (o[5] = i))
          : ((r = o[4]), (i = o[5])),
        (0, a.useEffect)(r, i),
        null
      );
    },
  ]);
};
