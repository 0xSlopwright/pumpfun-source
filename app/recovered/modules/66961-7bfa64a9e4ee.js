// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(51954);
  function r(e) {
    return e.connection;
  }
  e.s([
    "f",
    0,
    () => {
      let e,
        a = (0, t.c)(2),
        s = (0, n.f)(r);
      return (
        a[0] !== s
          ? ((e = { connection: s }), (a[0] = s), (a[1] = e))
          : (e = a[1]),
        e
      );
    },
  ]);
};
