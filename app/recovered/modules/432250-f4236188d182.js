// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(352386);
  let i = (0, e.i(78436).$)(() => ({})),
    n = (e) => i.getState()[e];
  e.s([
    "P",
    0,
    ({ children: e, configPlugins: n }) => (
      (0, a.useEffect)(() => {
        if (n && 0 !== n.length)
          return (
            i.setState(Object.fromEntries(n.map((e) => [e.id, e]))),
            () => {
              i.setState(Object.fromEntries(n.map((e) => [e.id, void 0])));
            }
          );
      }, [n]),
      (0, t.jsx)(t.Fragment, { children: e })
    ),
    "a",
    0,
    (e) => {
      (0, a.useEffect)(
        () => (
          i.setState({ [e.id]: e }),
          () => {
            i.setState({ [e.id]: void 0 });
          }
        ),
        [e],
      );
    },
    "g",
    0,
    n,
    "u",
    0,
    () => (0, a.useCallback)((e) => n(e), []),
  ]);
};
