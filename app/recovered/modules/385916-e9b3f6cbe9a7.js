// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(38279);
  let n = [1500, 6e3, 15e3],
    r = new Map();
  e.s([
    "f",
    0,
    (e, a) => {
      if (!a) return;
      for (let e of r.get(a) ?? []) clearTimeout(e);
      let i = t.Q.BALANCE_SUMMARY(a),
        o = n.map((t, o) =>
          setTimeout(() => {
            (e.invalidateQueries({ queryKey: i }),
              o === n.length - 1 && r.delete(a));
          }, t),
        );
      r.set(a, o);
    },
  ]);
};
