// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let f = new (e.i(533030).f)(8192);
  e.s([
    "f",
    0,
    function (e, { enabled: r = !0, id: t }) {
      if (!r || !t) return e();
      if (f.get(t)) return f.get(t);
      let o = e().finally(() => f.delete(t));
      return (f.set(t, o), o);
    },
  ]);
};
