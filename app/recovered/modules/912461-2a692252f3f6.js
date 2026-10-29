// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(352386),
    i = e.i(661434);
  e.s([
    "f",
    0,
    () => {
      let e,
        n,
        a = (0, t.c)(2),
        [l, o] = (0, r.useState)(void 0);
      return (
        a[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = () => {
              o((0, i.X)());
              let e = (e) => {
                (null === e.key || e.key === i.e) && o((0, i.X)());
              };
              return (
                window.addEventListener("storage", e),
                () => window.removeEventListener("storage", e)
              );
            }),
            (n = []),
            (a[0] = e),
            (a[1] = n))
          : ((e = a[0]), (n = a[1])),
        (0, r.useEffect)(e, n),
        l
      );
    },
  ]);
};
