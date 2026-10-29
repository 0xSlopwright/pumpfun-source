// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(445242),
    s = t.i(509836),
    a = t.i(906201),
    i = t.i(717394),
    l = t.i(254667),
    n = t.i(352386),
    m = t.i(23729),
    c = t.i(829183);
  t.s([
    "f",
    0,
    function () {
      let t,
        u,
        r,
        o,
        h,
        b,
        d,
        k = (0, e.c)(22),
        { wallets: f, ready: p } = (0, i.f)(),
        { wallets: j } = (0, a.f)(),
        { user: v, ready: g } = (0, s.f)();
      k[0] !== j ? ((t = (0, c.L)(j)), (k[0] = j), (k[1] = t)) : (t = k[1]);
      let w = t;
      k[2] !== v ? ((u = (0, c.A)(v)), (k[2] = v), (k[3] = u)) : (u = k[3]);
      let P = u;
      k[4] !== f ? ((r = f.some(m.f)), (k[4] = f), (k[5] = r)) : (r = k[5]);
      let y = r,
        _ = !y && void 0 !== w && P.length > 0;
      k[6] !== _ || k[7] !== P || k[8] !== w || k[9] !== f
        ? ((o = _
            ? [...(0, c.C)({ addresses: P, standardWallet: w }), ...f]
            : f),
          (k[6] = _),
          (k[7] = P),
          (k[8] = w),
          (k[9] = f),
          (k[10] = o))
        : (o = k[10]);
      let z = o,
        E = y ? "sdk" : _ ? "linked_accounts" : "none",
        q = p || (g && null !== v && void 0 !== w),
        x = (0, n.useRef)(null),
        O = v?.id,
        T = f.length;
      return (
        k[11] !== P || k[12] !== O || k[13] !== p || k[14] !== T || k[15] !== E
          ? ((h = () => {
              if ("linked_accounts" !== E) return;
              let t = `${O ?? ""}:${P.join(",")}`;
              if (x.current === t) return;
              let e = setTimeout(() => {
                ((x.current = t),
                  l.y.warn(
                    "Privy Solana wallet synthesized from linkedAccounts — react-auth useWallets() withheld the embedded wallet",
                    {
                      privyUserId: O,
                      sdkReady: p,
                      sdkWalletCount: T,
                      addressCount: P.length,
                    },
                  ));
              }, 3e3);
              return () => clearTimeout(e);
            }),
            (b = [E, O, P, p, T]),
            (k[11] = P),
            (k[12] = O),
            (k[13] = p),
            (k[14] = T),
            (k[15] = E),
            (k[16] = h),
            (k[17] = b))
          : ((h = k[16]), (b = k[17])),
        (0, n.useEffect)(h, b),
        k[18] !== q || k[19] !== E || k[20] !== z
          ? ((d = { wallets: z, ready: q, source: E }),
            (k[18] = q),
            (k[19] = E),
            (k[20] = z),
            (k[21] = d))
          : (d = k[21]),
        d
      );
    },
  ]);
};
