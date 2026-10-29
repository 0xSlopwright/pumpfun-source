// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var n = e.i(732486),
    t = e.i(352386);
  let a = (0, e.i(78436).$)(() => ({})),
    r = (e) => a.getState()[e];
  e.s([
    "P",
    0,
    ({ children: e, configPlugins: r }) => (
      (0, t.useEffect)(() => {
        if (r && 0 !== r.length)
          return (
            a.setState(Object.fromEntries(r.map((e) => [e.id, e]))),
            () => {
              a.setState(Object.fromEntries(r.map((e) => [e.id, void 0])));
            }
          );
      }, [r]),
      (0, n.jsx)(n.Fragment, { children: e })
    ),
    "a",
    0,
    (e) => {
      (0, t.useEffect)(
        () => (
          a.setState({ [e.id]: e }),
          () => {
            a.setState({ [e.id]: void 0 });
          }
        ),
        [e],
      );
    },
    "g",
    0,
    r,
    "u",
    0,
    () => (0, t.useCallback)((e) => r(e), []),
  ]);
};
