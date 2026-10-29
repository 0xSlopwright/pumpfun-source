// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(778593);
  e.s([
    "f",
    0,
    () => {
      let e,
        r,
        a = (0, t.c)(6),
        { activePreset: s, updateActivePreset: i } = (0, n.f)(),
        o = s.frontRunningProtection;
      a[0] !== o || a[1] !== i
        ? ((e = (e) => {
            i({ frontRunningProtection: "function" == typeof e ? e(o) : e });
          }),
          (a[0] = o),
          (a[1] = i),
          (a[2] = e))
        : (e = a[2]);
      let l = e;
      return (
        a[3] !== o || a[4] !== l
          ? ((r = { frontRunningProtection: o, setFrontRunningProtection: l }),
            (a[3] = o),
            (a[4] = l),
            (a[5] = r))
          : (r = a[5]),
        r
      );
    },
  ]);
};
