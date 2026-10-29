// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(732486),
    s = e.i(445242),
    t = e.i(352386);
  let o = (0, t.createContext)(null);
  e.s([
    "UserConfigProvider",
    0,
    (e) => {
      let t,
        a,
        n = (0, s.c)(5),
        { children: i, clientServerUrl: c } = e;
      return (
        n[0] !== c
          ? ((t = { clientServerUrl: c }), (n[0] = c), (n[1] = t))
          : (t = n[1]),
        n[2] !== i || n[3] !== t
          ? ((a = (0, r.jsx)(o.Provider, { value: t, children: i })),
            (n[2] = i),
            (n[3] = t),
            (n[4] = a))
          : (a = n[4]),
        a
      );
    },
    "useUserConfig",
    0,
    () => {
      let e = (0, t.useContext)(o);
      if (!e)
        throw Error("useUserConfig must be used within a UserConfigProvider");
      return e;
    },
  ]);
};
