// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242);
  let r = (0, e.i(78436).$)((e) => ({
    downByMint: {},
    setDown: (t, r) =>
      e((e) => {
        if ((!0 === e.downByMint[t]) === r) return e;
        let i = { ...e.downByMint };
        return (r ? (i[t] = !0) : delete i[t], { downByMint: i });
      }),
  }));
  e.s([
    "a",
    0,
    3e4,
    "u",
    0,
    (e) => {
      let i,
        a = (0, t.c)(2);
      return (
        a[0] !== e
          ? ((i = (t) => !0 === t.downByMint[e]), (a[0] = e), (a[1] = i))
          : (i = a[1]),
        r(i)
      );
    },
    "Z",
    0,
    r,
  ]);
};
