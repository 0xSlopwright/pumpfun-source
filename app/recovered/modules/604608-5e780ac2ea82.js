// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    s = t.i(241175),
    a = t.i(213618),
    l = t.i(606933);
  function i(t, e) {
    return t.findAll(e.filters).map((t) => (e.select ? e.select(t) : t.state));
  }
  function n(t = {}, m) {
    let c = (0, l.useQueryClient)(m).getMutationCache(),
      u = e.useRef(t),
      r = e.useRef(null);
    return (
      r.current || (r.current = i(c, t)),
      e.useEffect(() => {
        u.current = t;
      }),
      e.useSyncExternalStore(
        e.useCallback(
          (t) =>
            c.subscribe(() => {
              let e = (0, a.B)(r.current, i(c, u.current));
              r.current !== e && ((r.current = e), s.f.schedule(t));
            }),
          [c],
        ),
        () => r.current,
        () => r.current,
      )
    );
  }
  t.s([
    "F",
    0,
    function (t, e) {
      let s = (0, l.useQueryClient)(e);
      return n({ filters: { ...t, status: "pending" } }, s).length;
    },
    "Z",
    0,
    n,
  ]);
};
