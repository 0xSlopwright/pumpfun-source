// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    r = e.i(241175),
    n = e.i(213618),
    i = e.i(606933);
  function s(e, t) {
    return e.findAll(t.filters).map((e) => (t.select ? t.select(e) : e.state));
  }
  function a(e = {}, l) {
    let o = (0, i.useQueryClient)(l).getMutationCache(),
      c = t.useRef(e),
      u = t.useRef(null);
    return (
      u.current || (u.current = s(o, e)),
      t.useEffect(() => {
        c.current = e;
      }),
      t.useSyncExternalStore(
        t.useCallback(
          (e) =>
            o.subscribe(() => {
              let t = (0, n.B)(u.current, s(o, c.current));
              u.current !== t && ((u.current = t), r.f.schedule(e));
            }),
          [o],
        ),
        () => u.current,
        () => u.current,
      )
    );
  }
  e.s([
    "F",
    0,
    function (e, t) {
      let r = (0, i.useQueryClient)(t);
      return a({ filters: { ...e, status: "pending" } }, r).length;
    },
    "Z",
    0,
    a,
  ]);
};
