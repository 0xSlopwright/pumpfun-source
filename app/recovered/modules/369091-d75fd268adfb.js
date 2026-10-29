// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var r = e.i(732486),
    s = e.i(445242),
    t = e.i(352386);
  let o = (0, t.createContext)({
      ipfsPrefix: "https://ipfs.io/ipfs/",
      findIpfsPrefix: () => {},
    }),
    a = "https://pump.mypinata.cloud/ipfs/";
  function n(e) {
    return e.json();
  }
  function i(e) {
    return e.json();
  }
  e.s([
    "IpfsPrefixProvider",
    0,
    (e) => {
      let c,
        d,
        l,
        u,
        y,
        f = (0, s.c)(8),
        { children: B } = e,
        [g, p] = (0, t.useState)(a);
      f[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((c = async () => {
            let e = [
              "https://pump.mypinata.cloud/ipfs/",
              "https://ipfs.io/ipfs/",
              "https://gateway.pinata.cloud/ipfs/",
            ];
            await fetch(`${a}QmXeG5tTjC63hjTF7a4GcUyetE6yPcsR4rBzX7wb8mmpzg`)
              .then(n)
              .then(() => {
                p(a);
              })
              .catch((r) => {
                (console.error(r),
                  e.forEach(async (e) => {
                    let r = await fetch(
                      `${e}QmXeG5tTjC63hjTF7a4GcUyetE6yPcsR4rBzX7wb8mmpzg`,
                    ).then(i);
                    r?.name && p((r) => (r !== a ? r : e));
                  }));
              });
          }),
          (f[0] = c))
        : (c = f[0]);
      let m = c;
      return (
        f[1] === Symbol.for("react.memo_cache_sentinel")
          ? ((d = () => {
              m();
            }),
            (l = []),
            (f[1] = d),
            (f[2] = l))
          : ((d = f[1]), (l = f[2])),
        (0, t.useEffect)(d, l),
        f[3] !== g
          ? ((u = { ipfsPrefix: g, findIpfsPrefix: m }), (f[3] = g), (f[4] = u))
          : (u = f[4]),
        f[5] !== B || f[6] !== u
          ? ((y = (0, r.jsx)(o.Provider, { value: u, children: B })),
            (f[5] = B),
            (f[6] = u),
            (f[7] = y))
          : (y = f[7]),
        y
      );
    },
    "useIpfsPrefix",
    0,
    () => (0, t.useContext)(o),
  ]);
};
