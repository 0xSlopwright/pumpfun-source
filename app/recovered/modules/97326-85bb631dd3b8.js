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
        s = (0, t.c)(5),
        { activePreset: i, updateActivePreset: a } = (0, n.f)();
      s[0] !== a
        ? ((e = (e) => {
            a({ slippage: e ?? 0 });
          }),
          (s[0] = a),
          (s[1] = e))
        : (e = s[1]);
      let o = e;
      return (
        s[2] !== i.slippage || s[3] !== o
          ? ((r = { slippage: i.slippage, setSlippage: o }),
            (s[2] = i.slippage),
            (s[3] = o),
            (s[4] = r))
          : (r = s[4]),
        r
      );
    },
  ]);
};
