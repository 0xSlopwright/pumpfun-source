// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(944410),
    n = e.i(690877),
    o = e.i(38279),
    s = e.i(711902),
    r = e.i(779106);
  e.s([
    "g",
    0,
    {
      items: [],
      claimCount: 0,
      disputeCount: 0,
      finalizeCount: 0,
      totalCount: 0,
      hasAttention: !1,
    },
    "z",
    0,
    (e) => {
      let a,
        l,
        u,
        d,
        c = (0, t.c)(11);
      c[0] !== e
        ? ((a = void 0 === e ? {} : e), (c[0] = e), (c[1] = a))
        : (a = c[1]);
      let { address: m, enabled: b, queryOptions: f } = a,
        p = (0, i.useLivestreamApiClient)(),
        x = (0, r.f)("bounties-pending-attention"),
        h = (void 0 === b || b) && !!m;
      return (
        c[2] !== x
          ? ((l = o.Q.BOUNTIES_PENDING_ATTENTION(x)), (c[2] = x), (c[3] = l))
          : (l = c[3]),
        c[4] !== p
          ? ((u = async () => {
              let e = await p.get("bounties/tasks/me/pending-attention").json();
              return s._.parse(e);
            }),
            (c[4] = p),
            (c[5] = u))
          : (u = c[5]),
        c[6] !== f || c[7] !== h || c[8] !== l || c[9] !== u
          ? ((d = { enabled: h, queryKey: l, queryFn: u, ...f }),
            (c[6] = f),
            (c[7] = h),
            (c[8] = l),
            (c[9] = u),
            (c[10] = d))
          : (d = c[10]),
        (0, n.useQuery)(d)
      );
    },
  ]);
};
