// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(231332);
  let i = [];
  e.s([
    "_",
    0,
    (e) => {
      let t = !1,
        a = () => {
          t || ((t = !0), e());
        };
      return (
        (i = [...i, a]),
        () => {
          i.includes(a) && ((i = i.filter((e) => e !== a)), a());
        }
      );
    },
    "S",
    0,
    (e) => {
      let a,
        n = ((a = i), (i = []), a),
        l = () => {
          try {
            e();
          } finally {
            for (let e of n) e();
          }
        };
      !("u" < typeof document) &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? document.startViewTransition(() => {
            (0, t.flushSync)(l);
          })
        : l();
    },
  ]);
};
