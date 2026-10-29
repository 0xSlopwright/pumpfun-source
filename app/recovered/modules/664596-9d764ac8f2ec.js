// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = new (e.i(533030).f)(8192);
  e.s([
    "f",
    0,
    function (e, { enabled: r = !0, id: o }) {
      if (!r || !o) return e();
      if (t.get(o)) return t.get(o);
      let s = e().finally(() => t.delete(o));
      return (t.set(o, s), s);
    },
  ]);
};
