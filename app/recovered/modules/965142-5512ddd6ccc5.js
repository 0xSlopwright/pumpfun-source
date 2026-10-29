// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(990149),
    t = e.i(590719),
    n = e.i(19648),
    r = e.i(711753),
    a = e.i(497763);
  e.s([
    "f",
    0,
    function (e) {
      let { chainId: i, nonce: s, to: o } = e,
        c = e.contractAddress ?? e.address,
        u = (0, a.f)(
          (0, f.s)([
            "0x05",
            (0, r.f)([i ? (0, n.N)(i) : "0x", c, s ? (0, n.N)(s) : "0x"]),
          ]),
        );
      return "bytes" === o ? (0, t.X)(u) : u;
    },
  ]);
};
