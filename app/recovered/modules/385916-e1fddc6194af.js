// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(38279);
  let i = [1500, 6e3, 15e3],
    r = new Map();
  e.s([
    "f",
    0,
    (e, n) => {
      if (!n) return;
      for (let e of r.get(n) ?? []) clearTimeout(e);
      let o = t.Q.BALANCE_SUMMARY(n),
        a = i.map((t, a) =>
          setTimeout(() => {
            (e.invalidateQueries({ queryKey: o }),
              a === i.length - 1 && r.delete(n));
          }, t),
        );
      r.set(n, a);
    },
  ]);
};
