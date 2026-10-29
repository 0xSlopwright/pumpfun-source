// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (e, t) {
      return ({ exclude: r, format: o }) => ({
        exclude: r,
        format: (e, s) => {
          let n = t(e, s);
          if (r) for (let e of r) delete n[e];
          return { ...n, ...o(e, s) };
        },
        type: e,
      });
    },
  ]);
};
