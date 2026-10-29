// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(511518);
  e.s([
    "f",
    0,
    function (e, n) {
      return "function" == typeof e
        ? e(n)
        : e && "object" == typeof e && t.C in e
          ? e[t.C](n)
          : e instanceof Date
            ? new e.constructor(n)
            : new Date(n);
    },
  ]);
};
