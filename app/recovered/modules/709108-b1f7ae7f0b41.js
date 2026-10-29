// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(429560);
  e.s([
    "f",
    0,
    function (e) {
      let n,
        o,
        s = (0, t.c)(10);
      s[0] !== e ? ((n = { address: e }), (s[0] = e), (s[1] = n)) : (n = s[1]);
      let { data: r, isLoading: a } = (0, i.z)(n),
        l = r ?? i.g,
        u = !!e && a && !r;
      return (
        s[2] !== l.claimCount ||
        s[3] !== l.disputeCount ||
        s[4] !== l.finalizeCount ||
        s[5] !== l.hasAttention ||
        s[6] !== l.items ||
        s[7] !== l.totalCount ||
        s[8] !== u
          ? ((o = {
              items: l.items,
              claimCount: l.claimCount,
              disputeCount: l.disputeCount,
              finalizeCount: l.finalizeCount,
              totalCount: l.totalCount,
              hasAttention: l.hasAttention,
              isLoading: u,
            }),
            (s[2] = l.claimCount),
            (s[3] = l.disputeCount),
            (s[4] = l.finalizeCount),
            (s[5] = l.hasAttention),
            (s[6] = l.items),
            (s[7] = l.totalCount),
            (s[8] = u),
            (s[9] = o))
          : (o = s[9]),
        o
      );
    },
  ]);
};
