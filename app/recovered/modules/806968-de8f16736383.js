// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    s = e.i(426091),
    a = e.i(352386);
  let o = (0, a.lazy)(() =>
      e.A(723337).then((e) => ({ default: e.BountyVideoPlayerImpl })),
    ),
    r = (e) => {
      let a,
        o,
        r,
        l = (0, i.c)(7),
        { className: n, maxHeight: c } = e;
      return (
        l[0] !== n
          ? ((a = (0, s.c)("aspect-video w-full bg-bg-tertiary", n)),
            (l[0] = n),
            (l[1] = a))
          : (a = l[1]),
        l[2] !== c
          ? ((o = c ? { maxHeight: c } : void 0), (l[2] = c), (l[3] = o))
          : (o = l[3]),
        l[4] !== a || l[5] !== o
          ? ((r = (0, t.jsx)("div", {
              "aria-hidden": !0,
              className: a,
              style: o,
            })),
            (l[4] = a),
            (l[5] = o),
            (l[6] = r))
          : (r = l[6]),
        r
      );
    };
  e.s([
    "f",
    0,
    (e) => {
      let s,
        l,
        n,
        c = (0, i.c)(8);
      return (
        c[0] !== e.className || c[1] !== e.maxHeight
          ? ((s = (0, t.jsx)(r, {
              className: e.className,
              maxHeight: e.maxHeight,
            })),
            (c[0] = e.className),
            (c[1] = e.maxHeight),
            (c[2] = s))
          : (s = c[2]),
        c[3] !== e
          ? ((l = (0, t.jsx)(o, { ...e })), (c[3] = e), (c[4] = l))
          : (l = c[4]),
        c[5] !== s || c[6] !== l
          ? ((n = (0, t.jsx)(a.Suspense, { fallback: s, children: l })),
            (c[5] = s),
            (c[6] = l),
            (c[7] = n))
          : (n = c[7]),
        n
      );
    },
  ]);
};
