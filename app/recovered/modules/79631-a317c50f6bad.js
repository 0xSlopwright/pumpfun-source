// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(690877),
    r = e.i(832971),
    a = e.i(889451),
    n = e.i(384886),
    l = e.i(663628),
    s = e.i(188902);
  let o = new Map(),
    d = { batch: (e, t) => ["userMintPositions", e, t] };
  function u(e) {
    return !!e;
  }
  function c(e) {
    return e.coinMint;
  }
  e.s([
    "F",
    0,
    d,
    "_",
    0,
    (e) => {
      let m,
        h,
        f,
        g,
        p,
        y,
        w,
        x,
        v,
        E,
        _,
        b,
        L,
        A,
        M,
        j = (0, t.c)(53),
        {
          userId: P,
          mints: k,
          enabled: N,
          refetchIntervalMs: S,
          refetchInterval: I,
          skipChainDispute: q,
        } = e;
      (j[0] !== k || j[1] !== P
        ? ((m = Array.from(new Set(k.filter(u))).sort()),
          (f = i.useQuery),
          (h = d.batch(P ?? void 0, m)),
          (j[0] = k),
          (j[1] = P),
          (j[2] = m),
          (j[3] = h),
          (j[4] = f))
        : ((m = j[2]), (h = j[3]), (f = j[4])),
        j[5] !== m || j[6] !== P
          ? ((g = () => (0, n.m)({ userId: P, mints: m })),
            (j[5] = m),
            (j[6] = P),
            (j[7] = g))
          : (g = j[7]));
      let C = (void 0 === N || N) && !!P && m.length > 0,
        U = I ?? S ?? !1,
        T = 3e4 * (void 0 === I && null == S);
      (j[8] !== P
        ? ((p = (e, t) => (t?.queryKey[1] === P ? e : void 0)),
          (j[8] = P),
          (j[9] = p))
        : (p = j[9]),
        j[10] !== h ||
        j[11] !== g ||
        j[12] !== C ||
        j[13] !== U ||
        j[14] !== T ||
        j[15] !== p
          ? ((y = {
              queryKey: h,
              queryFn: g,
              enabled: C,
              refetchInterval: U,
              staleTime: T,
              placeholderData: p,
            }),
            (j[10] = h),
            (j[11] = g),
            (j[12] = C),
            (j[13] = U),
            (j[14] = T),
            (j[15] = p),
            (j[16] = y))
          : (y = j[16]));
      let F = f(y);
      e: {
        let e, t, i;
        if (void 0 !== q && q) {
          let e;
          (j[17] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = { owner: null, mints: [] }), (j[17] = e))
            : (e = j[17]),
            (w = e));
          break e;
        }
        if (j[18] !== F.data) {
          let i = (F.data ?? []).filter(r.P);
          ((e = i[0]?.walletAddress ?? null),
            (t = i
              .filter((t) => t.walletAddress === e)
              .map(c)
              .sort()
              .slice(0, l.y)),
            (j[18] = F.data),
            (j[19] = e),
            (j[20] = t));
        } else ((e = j[19]), (t = j[20]));
        let a = t;
        (j[21] !== a || j[22] !== e
          ? ((i = { owner: e, mints: a }),
            (j[21] = a),
            (j[22] = e),
            (j[23] = i))
          : (i = j[23]),
          (w = i));
      }
      let B = w;
      j[24] !== B.mints || j[25] !== B.owner
        ? ((x = ["userMintPositions.chainHeld", B.owner, B.mints]),
          (j[24] = B.mints),
          (j[25] = B.owner),
          (j[26] = x))
        : (x = j[26]);
      let R = !!B.owner && B.mints.length > 0;
      (j[27] !== B.mints || j[28] !== B.owner
        ? ((v = (e) => {
            let { signal: t } = e;
            return (0, l.L)({
              owner: B.owner,
              mints: B.mints,
              endpoint: (0, s.L)(),
              signal: t,
            });
          }),
          (j[27] = B.mints),
          (j[28] = B.owner),
          (j[29] = v))
        : (v = j[29]),
        j[30] !== x || j[31] !== R || j[32] !== v
          ? ((E = {
              queryKey: x,
              enabled: R,
              staleTime: 3e4,
              retry: !1,
              queryFn: v,
            }),
            (j[30] = x),
            (j[31] = R),
            (j[32] = v),
            (j[33] = E))
          : (E = j[33]));
      let z = (0, i.useQuery)(E),
        H = z.data ?? o;
      if (j[34] !== H || j[35] !== F.data) {
        let e;
        (j[37] !== H
          ? ((e = (e) => (0, a.N)((0, r.N)(e, H.get(e.coinMint)))),
            (j[37] = H),
            (j[38] = e))
          : (e = j[38]),
          (_ = (0, n.u)((F.data ?? []).map(e))),
          (j[34] = H),
          (j[35] = F.data),
          (j[36] = _));
      } else _ = j[36];
      let O = _;
      j[39] !== O
        ? ((b = (e) => (0, n.l)(O, e)), (j[39] = O), (j[40] = b))
        : (b = j[40]);
      let $ = b;
      j[41] !== O
        ? ((L = (e) => (0, a.y)((0, n.l)(O, e))), (j[41] = O), (j[42] = L))
        : (L = j[42]);
      let D = L,
        K = F.isLoading || z.isLoading;
      return (
        j[43] !== F
          ? ((A = () => {
              F.refetch();
            }),
            (j[43] = F),
            (j[44] = A))
          : (A = j[44]),
        j[45] !== O ||
        j[46] !== $ ||
        j[47] !== F.dataUpdatedAt ||
        j[48] !== F.isError ||
        j[49] !== D ||
        j[50] !== K ||
        j[51] !== A
          ? ((M = {
              byMint: O,
              positionFor: $,
              summaryFor: D,
              isLoading: K,
              isError: F.isError,
              dataUpdatedAt: F.dataUpdatedAt,
              refetch: A,
            }),
            (j[45] = O),
            (j[46] = $),
            (j[47] = F.dataUpdatedAt),
            (j[48] = F.isError),
            (j[49] = D),
            (j[50] = K),
            (j[51] = A),
            (j[52] = M))
          : (M = j[52]),
        M
      );
    },
  ]);
};
