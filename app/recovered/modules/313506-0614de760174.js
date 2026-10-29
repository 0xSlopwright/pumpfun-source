// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = 0;
  e.s([
    "O",
    0,
    function () {
      return t > 0;
    },
    "c",
    0,
    function () {
      t += 1;
      let e = !1;
      return () => {
        e || ((e = !0), (t = Math.max(0, t - 1)));
      };
    },
  ]);
};
