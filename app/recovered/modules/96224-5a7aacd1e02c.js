// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386),
    a = e.i(894228);
  let i = (0, r.createContext)(null);
  e.s([
    "ApiClientsConfigProvider",
    0,
    (e) => {
      let r,
        l,
        o = (0, n.c)(5),
        { config: s, children: u } = e;
      o[0] !== s ? ((r = a.f.parse(s)), (o[0] = s), (o[1] = r)) : (r = o[1]);
      let c = r;
      return (
        o[2] !== u || o[3] !== c
          ? ((l = (0, t.jsx)(i.Provider, { value: c, children: u })),
            (o[2] = u),
            (o[3] = c),
            (o[4] = l))
          : (l = o[4]),
        l
      );
    },
    "useApiClientsConfig",
    0,
    () => {
      let e = (0, r.useContext)(i);
      if (!e)
        throw Error(
          "useApiClientsConfig must be used within an ApiClientsConfigProvider. Wrap your component tree with ApiClientsConfigProvider and pass the config prop.",
        );
      return e;
    },
    "useHasApiClientsConfig",
    0,
    () => null !== (0, r.useContext)(i),
  ]);
};
