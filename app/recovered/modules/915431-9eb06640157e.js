// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    i = e.i(163401),
    r = e.i(369773),
    a = e.i(352386),
    n = e.i(803797),
    l = e.i(541710),
    s = e.i(646908);
  e.i(11315);
  var o = e.i(254967),
    d = e.i(956113),
    c = e.i(605587),
    u = e.i(763114);
  let p = { parts: [t.Part.MARKET, t.Part.PHASE, t.Part.META] },
    m = (e, t, r = l.q) => {
      if (!e) return null;
      try {
        if ((0, s.L)(t)) return !0 === r.ton ? (0, i.coinTopic)(s.J, e) : null;
        if ((0, s.B)(t)) return (0, l.M)(r) ? (0, i.coinTopic)(s.d, e) : null;
        if ((0, s._)(t)) return (0, l.k)(r) ? (0, i.coinTopic)(s.W, e) : null;
        if ((0, c.N)({ mint: e, chainId: t })) {
          let r = Number(t?.split(":")[1]);
          if (!Number.isInteger(r) || r <= 0) return null;
          return (0, i.coinTopic)((0, i.chainIdFor)({ evmChainId: r }), e);
        }
        return (0, i.coinTopic)((0, i.chainIdFor)("solana"), e);
      } catch {
        return null;
      }
    },
    f = (e, t) => {
      let i = h(e.phase);
      if (i)
        return {
          ...i,
          ...(void 0 !== e.liquidityUsd
            ? { liquidityUsd: e.liquidityUsd }
            : {}),
          ...(t && void 0 !== e.receivedAt
            ? { staleAsOfMs: e.receivedAt }
            : {}),
        };
    },
    v = ({ mint: e, chain: t }) => {
      let i = m(e, t, (0, l.l)()),
        s = (0, o.f)(),
        c = (0, a.useRef)(s);
      c.current = s;
      let v = (0, a.useRef)({ mint: e }),
        g = (0, a.useCallback)(
          (t, i) => {
            if (!(0, r.isCoinState)(i)) return;
            v.current.mint !== e && (v.current = { mint: e });
            let a = v.current,
              { market: l, phase: s } = i;
            a.receivedAt = Date.now();
            let o = !1;
            if (l && l !== a.market) {
              let t = l.asOf?.blockId,
                i = void 0 !== t && t !== a.blockId;
              ((a.market = l),
                (a.blockId = t),
                (0, n.T)({
                  mint: e,
                  update: (0, u.X)(l, { mint: e, traded: i }),
                }));
              let r = (0, u.K)(l);
              void 0 !== r &&
                r !== a.liquidityUsd &&
                ((a.liquidityUsd = r), (o = !0));
            }
            s !== a.phase && ((a.phase = s), (o = !0));
            let p = d.E.getState();
            (o && p.setCurve(e, f(a, c.current)),
              c.current || p.setServing(e, "header", !0));
          },
          [e],
        );
      ((0, o.A)(i, p, g, void 0, { delivery: "latest" }),
        (0, a.useEffect)(() => {
          let t = v.current,
            i = t.mint === e ? t : { mint: e },
            r = d.E.getState();
          (r.setCurve(e, f(i, s)),
            r.setServing(e, "header", !s && void 0 !== i.receivedAt));
        }, [e, s]),
        (0, a.useEffect)(
          () => () => {
            let t = d.E.getState();
            (t.setCurve(e, void 0), t.setServing(e, "header", !1));
          },
          [e],
        ));
    },
    g = {
      [t.LifecyclePhase.BONDING]: { curveComplete: !1, graduated: !1 },
      [t.LifecyclePhase.BONDING_COMPLETE]: { curveComplete: !0, graduated: !1 },
      [t.LifecyclePhase.GRADUATED]: { curveComplete: !0, graduated: !0 },
    },
    h = (e) => {
      let t = e ? g[e.phase] : void 0;
      return e && t ? { progress: e.progressBps / 100, ...t } : void 0;
    };
  e.s([
    "UAPI_COIN_HEADER_OPTIONS",
    0,
    p,
    "UapiCoinHeaderSource",
    0,
    function (e) {
      return (v(e), null);
    },
    "uapiCoinHeaderTopic",
    0,
    m,
    "uapiCurveOverride",
    0,
    h,
    "useUapiCoinHeader",
    0,
    v,
  ]);
};
