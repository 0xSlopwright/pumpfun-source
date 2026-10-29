// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(944410),
    n = e.i(690877),
    i = e.i(38279),
    s = e.i(711902);
  e.s([
    "f",
    0,
    (e) => {
      let a,
        o,
        l,
        u,
        c = (0, t.c)(11);
      c[0] !== e
        ? ((a = void 0 === e ? {} : e), (c[0] = e), (c[1] = a))
        : (a = c[1]);
      let { walletAddress: m, enabled: d, queryOptions: p } = a,
        g = (0, r.useLivestreamApiClient)(),
        b = (void 0 === d || d) && !!m;
      return (
        c[2] !== m
          ? ((o = i.Q.BOUNTY_RECOVERABLE(m ?? void 0)), (c[2] = m), (c[3] = o))
          : (o = c[3]),
        c[4] !== g
          ? ((l = async () => {
              let e = await g.get("bounties/tasks/me/recoverable").json();
              return s.h.parse(e);
            }),
            (c[4] = g),
            (c[5] = l))
          : (l = c[5]),
        c[6] !== p || c[7] !== b || c[8] !== o || c[9] !== l
          ? ((u = { enabled: b, queryKey: o, queryFn: l, ...p }),
            (c[6] = p),
            (c[7] = b),
            (c[8] = o),
            (c[9] = l),
            (c[10] = u))
          : (u = c[10]),
        (0, n.useQuery)(u)
      );
    },
  ]);
};
