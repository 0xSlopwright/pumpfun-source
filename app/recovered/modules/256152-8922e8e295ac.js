// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    a = e.i(509836),
    r = e.i(906201),
    n = e.i(717394),
    i = e.i(254667),
    l = e.i(352386),
    s = e.i(23729),
    o = e.i(829183);
  e.s([
    "f",
    0,
    function () {
      let e,
        d,
        c,
        u,
        f,
        m,
        h,
        p = (0, t.c)(22),
        { wallets: g, ready: w } = (0, n.f)(),
        { wallets: b } = (0, r.f)(),
        { user: y, ready: v } = (0, a.f)();
      p[0] !== b ? ((e = (0, o.L)(b)), (p[0] = b), (p[1] = e)) : (e = p[1]);
      let x = e;
      p[2] !== y ? ((d = (0, o.A)(y)), (p[2] = y), (p[3] = d)) : (d = p[3]);
      let _ = d;
      p[4] !== g ? ((c = g.some(s.f)), (p[4] = g), (p[5] = c)) : (c = p[5]);
      let S = c,
        j = !S && void 0 !== x && _.length > 0;
      p[6] !== j || p[7] !== _ || p[8] !== x || p[9] !== g
        ? ((u = j
            ? [...(0, o.C)({ addresses: _, standardWallet: x }), ...g]
            : g),
          (p[6] = j),
          (p[7] = _),
          (p[8] = x),
          (p[9] = g),
          (p[10] = u))
        : (u = p[10]);
      let N = u,
        k = S ? "sdk" : j ? "linked_accounts" : "none",
        E = w || (v && null !== y && void 0 !== x),
        I = (0, l.useRef)(null),
        C = y?.id,
        T = g.length;
      return (
        p[11] !== _ || p[12] !== C || p[13] !== w || p[14] !== T || p[15] !== k
          ? ((f = () => {
              if ("linked_accounts" !== k) return;
              let e = `${C ?? ""}:${_.join(",")}`;
              if (I.current === e) return;
              let t = setTimeout(() => {
                ((I.current = e),
                  i.y.warn(
                    "Privy Solana wallet synthesized from linkedAccounts — react-auth useWallets() withheld the embedded wallet",
                    {
                      privyUserId: C,
                      sdkReady: w,
                      sdkWalletCount: T,
                      addressCount: _.length,
                    },
                  ));
              }, 3e3);
              return () => clearTimeout(t);
            }),
            (m = [k, C, _, w, T]),
            (p[11] = _),
            (p[12] = C),
            (p[13] = w),
            (p[14] = T),
            (p[15] = k),
            (p[16] = f),
            (p[17] = m))
          : ((f = p[16]), (m = p[17])),
        (0, l.useEffect)(f, m),
        p[18] !== E || p[19] !== k || p[20] !== N
          ? ((h = { wallets: N, ready: E, source: k }),
            (p[18] = E),
            (p[19] = k),
            (p[20] = N),
            (p[21] = h))
          : (h = p[21]),
        h
      );
    },
  ]);
};
