// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    n = e.i(352386),
    r = e.i(272173);
  e.s([
    "LaunchDarklyUser",
    0,
    (e) => {
      let i,
        a,
        o,
        l = (0, t.c)(8),
        { address: s, ccUserId: u } = e,
        { patchContext: c } = (0, r.useLaunchDarklyContextSync)();
      l[0] !== c
        ? ((i = (e) =>
            c({ userAddress: e.address, ccUserId: e.ccUserId ?? null })),
          (l[0] = c),
          (l[1] = i))
        : (i = l[1]);
      let d = i;
      return (
        l[2] !== s || l[3] !== u || l[4] !== c || l[5] !== d
          ? ((a = () => (
              s
                ? d({ address: s, ccUserId: u })
                : c({ userAddress: null, ccUserId: null }),
              () => {
                d({});
              }
            )),
            (o = [s, u, c, d]),
            (l[2] = s),
            (l[3] = u),
            (l[4] = c),
            (l[5] = d),
            (l[6] = a),
            (l[7] = o))
          : ((a = l[6]), (o = l[7])),
        (0, n.useEffect)(a, o),
        null
      );
    },
  ]);
};
