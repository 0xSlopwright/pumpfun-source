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
        a = (0, t.c)(5),
        { activePreset: s, updateActivePreset: i } = (0, n.f)();
      a[0] !== i
        ? ((e = (e) => {
            i({ tipAmount: Math.max(e ?? 0, 0) });
          }),
          (a[0] = i),
          (a[1] = e))
        : (e = a[1]);
      let o = e;
      return (
        a[2] !== s.tipAmount || a[3] !== o
          ? ((r = { tipAmount: s.tipAmount, setTipAmount: o }),
            (a[2] = s.tipAmount),
            (a[3] = o),
            (a[4] = r))
          : (r = a[4]),
        r
      );
    },
  ]);
};
