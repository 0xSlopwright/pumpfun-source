// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    (e, f, t) =>
      JSON.stringify(
        e,
        (e, t) => {
          let n = "bigint" == typeof t ? t.toString() : t;
          return "function" == typeof f ? f(e, n) : n;
        },
        t,
      ),
  ]);
};
