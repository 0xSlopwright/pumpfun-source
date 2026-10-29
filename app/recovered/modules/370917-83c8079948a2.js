// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (e, t) {
      return ({ exclude: i, format: f }) => ({
        exclude: i,
        format: (e, s) => {
          let n = t(e, s);
          if (i) for (let e of i) delete n[e];
          return { ...n, ...f(e, s) };
        },
        type: e,
      });
    },
  ]);
};
