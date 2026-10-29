// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    a = e.i(498936),
    s = e.i(574472),
    l = e.i(102824),
    n = e.i(524711),
    i = e.i(363250),
    r = e.i(824425),
    o = e.i(575281),
    u = e.i(971370),
    c = e.i(690877),
    d = e.i(656846);
  e.i(70833);
  var m = e.i(66961),
    f = e.i(85324),
    p = e.i(38279),
    _ = e.i(228935),
    g = e.i(655397);
  async function b(e, t) {
    let a = (0, o.h)((0, g.p)(), new u.PublicKey(t), !0),
      s = await e.getAccountInfo(a);
    if (!s) return { uiAmount: 0, atomicAmount: BigInt(0), ataExists: !1 };
    let l = BigInt(r.d.decode(new Uint8Array(s.data)).amount.toString());
    return {
      uiAmount: (0, _.f)(l, d.f.decimals),
      atomicAmount: l,
      ataExists: !0,
    };
  }
  function x(e) {
    let a,
      s,
      l,
      n = (0, t.c)(11),
      { connection: i } = (0, m.f)(),
      { wallet: r, enabled: o, refetchIntervalMs: u } = e,
      d = void 0 === u ? 6e4 : u,
      _ = (void 0 === o || o) && !!r,
      g = (0, f.q)(d, _);
    (n[0] !== r
      ? ((a = p.Q.USDC_TOKEN_BALANCE(r ?? "")), (n[0] = r), (n[1] = a))
      : (a = n[1]),
      n[2] !== i || n[3] !== r
        ? ((s = () => b(i, r)), (n[2] = i), (n[3] = r), (n[4] = s))
        : (s = n[4]));
    let x = Math.min(6e4, d);
    return (
      n[5] !== _ || n[6] !== g || n[7] !== a || n[8] !== s || n[9] !== x
        ? ((l = {
            enabled: _,
            queryKey: a,
            queryFn: s,
            staleTime: x,
            refetchInterval: g,
            refetchIntervalInBackground: !1,
            refetchOnWindowFocus: !0,
          }),
          (n[5] = _),
          (n[6] = g),
          (n[7] = a),
          (n[8] = s),
          (n[9] = x),
          (n[10] = l))
        : (l = n[10]),
      (0, c.useQuery)(l)
    );
  }
  (e.s(["q", 0, b, "G", 0, x], 505102),
    e.s(
      [
        "O",
        0,
        3e4,
        "Y",
        0,
        function (e) {
          let r,
            o,
            u,
            c,
            d,
            m,
            f,
            p = (0, t.c)(26),
            { wallet: _ } = e,
            { address: g } = (0, s.F)();
          p[0] !== g || p[1] !== _
            ? ((r = _ && g && _.toLowerCase() === g.toLowerCase()),
              (p[0] = g),
              (p[1] = _),
              (p[2] = r))
            : (r = p[2]);
          let b = !!r,
            h = _ ?? "";
          p[3] !== h
            ? ((o = { userAddress: h }), (p[3] = h), (p[4] = o))
            : (o = p[4]);
          let { data: v } = (0, n._)(o);
          p[5] === Symbol.for("react.memo_cache_sentinel")
            ? ((u = {}), (p[5] = u))
            : (u = p[5]);
          let { data: y } = (0, i.f)(u),
            { usdcBalance: N } = (0, l.f)(),
            w = b && null !== N,
            A = !!_ && !w,
            j = b ? 3e4 : void 0;
          p[6] !== A || p[7] !== j || p[8] !== _
            ? ((c = { wallet: _, enabled: A, refetchIntervalMs: j }),
              (p[6] = A),
              (p[7] = j),
              (p[8] = _),
              (p[9] = c))
            : (c = p[9]);
          let U = x(c),
            $ = v?.success === !0;
          p[10] !== v || p[11] !== $
            ? ((d = $ && v.data ? (0, a.f)(v.data) : null),
              (p[10] = v),
              (p[11] = $),
              (p[12] = d))
            : (d = p[12]);
          let B = d,
            C = B && B.solPrice > 0 ? B.solPrice : void 0 === y ? 0 : y,
            I = B?.nativeBalance ?? 0,
            S = null !== B,
            M = I * C;
          p[13] !== U || p[14] !== b || p[15] !== N
            ? ((m = b
                ? null !== N
                  ? { usdcAmount: N.balance, usdcError: !1 }
                  : {
                      usdcAmount: U.data ? U.data.uiAmount : null,
                      usdcError: !1,
                    }
                : U.isError
                  ? { usdcAmount: null, usdcError: !0 }
                  : {
                      usdcAmount: U.data ? U.data.uiAmount : null,
                      usdcError: !1,
                    }),
              (p[13] = U),
              (p[14] = b),
              (p[15] = N),
              (p[16] = m))
            : (m = p[16]);
          let { usdcAmount: E, usdcError: D } = m,
            L = null === E ? null : E,
            P = null === L ? null : M + L;
          return (
            p[17] !== P ||
            p[18] !== b ||
            p[19] !== I ||
            p[20] !== S ||
            p[21] !== M ||
            p[22] !== E ||
            p[23] !== D ||
            p[24] !== L
              ? ((f = {
                  solAmount: I,
                  solLoaded: S,
                  solUsd: M,
                  usdcAmount: E,
                  usdcUsd: L,
                  usdcError: D,
                  combinedUsd: P,
                  isSelf: b,
                }),
                (p[17] = P),
                (p[18] = b),
                (p[19] = I),
                (p[20] = S),
                (p[21] = M),
                (p[22] = E),
                (p[23] = D),
                (p[24] = L),
                (p[25] = f))
              : (f = p[25]),
            f
          );
        },
      ],
      901665,
    ));
};
