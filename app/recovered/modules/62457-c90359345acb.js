// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    r = e.i(163401),
    i = e.i(369773),
    a = e.i(352386),
    n = e.i(394468),
    l = e.i(541710),
    s = e.i(646908);
  e.i(11315);
  var o = e.i(254967),
    d = e.i(956113),
    c = e.i(978854),
    u = e.i(605587);
  let p = { parts: [t.Part.TRADES], delivery: "all" },
    f = new Set(),
    m = (e, t) => `${e}|${(0, n.n)(t)}`,
    g = (e) => {
      if ((f.add(e), f.size <= 1024)) return;
      let t = f.values().next().value;
      void 0 !== t && f.delete(t);
    },
    v = (e, t, i = l.q) => {
      if (!e) return null;
      if ((0, s.L)(t)) {
        if (!0 !== i.ton) return null;
        try {
          return (0, r.coinTopic)(s.J, e);
        } catch {
          return null;
        }
      }
      if ((0, s.B)(t)) {
        if (!(0, l.M)(i)) return null;
        try {
          return (0, r.coinTopic)(s.d, e);
        } catch {
          return null;
        }
      }
      if ((0, s._)(t)) {
        if (!(0, l.k)(i)) return null;
        try {
          return (0, r.coinTopic)(s.W, e);
        } catch {
          return null;
        }
      }
      let a = (0, u.N)({ mint: e, chainId: t });
      if (a && !t) return null;
      try {
        return (0, r.coinTopic)(a && t ? t : r.SOLANA_CHAIN_ID, e);
      } catch {
        return null;
      }
    },
    h = ({
      mint: e,
      chainId: r,
      enabled: s,
      onTrades: u,
      onRevoke: h,
      onResync: b,
      onServing: S,
    }) => {
      let k = (0, a.useRef)(u);
      k.current = u;
      let T = (0, a.useRef)(h);
      T.current = h;
      let y = (0, a.useRef)(b);
      y.current = b;
      let w = (0, a.useRef)(S);
      w.current = S;
      let A = (0, a.useRef)(void 0),
        [E, M] = (0, a.useState)(!1),
        _ = (0, o.f)(),
        I = (0, a.useRef)(new Map()),
        O = (0, a.useRef)({ blocks: 0, dropped: 0, reportedAtMs: 0 }),
        R = (0, l.l)(),
        C = (0, a.useMemo)(() => (s ? v(e, r, R) : null), [s, e, r, R]),
        L = (0, a.useCallback)(
          (r, l) => {
            let s,
              o = (0, i.isCoinState)(l) ? l.phase : void 0,
              u = [],
              p = [],
              v = !1;
            for (let i of r) {
              if ("gap" === i.kind) {
                v = !0;
                continue;
              }
              if ("end" === i.kind) {
                s = !1;
                continue;
              }
              if ("unavailable" === i.kind) {
                i.parts.includes(t.Part.TRADES) && (s = !1);
                continue;
              }
              if ("coin" !== i.frame.payload.case) continue;
              let r = i.frame.payload.value;
              if (!r.trades) continue;
              for (let e of ((s = !0), r.trades.revoked)) {
                if (!e.txId) continue;
                let t = m(e.txId, e.ordinal);
                g(t);
                let r = I.current.get(t);
                r && p.push(r);
              }
              let a = r.aggregates?.trades ?? 0;
              for (let t of (a > r.trades.rows.length &&
                ((O.current.blocks += 1),
                (O.current.dropped += a - r.trades.rows.length)),
              r.trades.rows)) {
                if (t.isBackfill) continue;
                let i = m(t.txId, t.ordinal);
                if (f.has(i)) continue;
                let a = (0, n.M)(t, r, o);
                if (a) {
                  if (
                    a.slotIndexId &&
                    (I.current.set(i, a.slotIndexId), I.current.size > 1024)
                  ) {
                    let e = I.current.keys().next().value;
                    void 0 !== e && I.current.delete(e);
                  }
                  u.push({ ...a, mintAddress: e });
                }
              }
            }
            let h = O.current,
              b = Date.now();
            if (h.dropped > 0 && b - h.reportedAtMs >= 6e4) {
              var S;
              ((S = {
                name: "tape_truncated",
                topic: C,
                blocks: h.blocks,
                dropped: h.dropped,
              }),
                window.DD_RUM?.addAction?.("uapi_stream", S),
                (O.current = { blocks: 0, dropped: 0, reportedAtMs: b }));
            }
            if (
              (void 0 !== s && M(s),
              p.length && T.current(p),
              u.length && (0, a.startTransition)(() => k.current(u)),
              u.length && !0 === s && (0, d.R)(e, "header"))
            ) {
              let t = u.reduce((e, t) =>
                new Date(t.timestamp).getTime() >=
                new Date(e.timestamp).getTime()
                  ? t
                  : e,
              );
              c.m.getState().setLatest(e, t, { fold: !1, buffer: !1 });
            }
            v &&
              !A.current &&
              (A.current = setTimeout(() => {
                ((A.current = void 0), y.current());
              }, 1e3));
          },
          [e, C],
        );
      (0, a.useEffect)(
        () => () => {
          (clearTimeout(A.current), (A.current = void 0), M(!1));
        },
        [C],
      );
      let P = null !== C && E && !_;
      ((0, a.useEffect)(() => {
        w.current?.(P);
      }, [P]),
        (0, a.useEffect)(() => () => w.current?.(!1), []),
        (0, a.useEffect)(() => {
          if (!P) return;
          let { setServing: t } = d.E.getState();
          return (t(e, "tape", !0), () => t(e, "tape", !1));
        }, [e, P]),
        (0, o.A)(C, p, L));
    };
  e.s([
    "UAPI_TRADES_GAP_COALESCE_MS",
    0,
    1e3,
    "UapiTradesFeedMount",
    0,
    function (e) {
      return (h(e), null);
    },
    "resetUapiRevokedTradesForTests",
    0,
    () => f.clear(),
    "uapiTradesTopic",
    0,
    v,
    "useUapiTradesFeed",
    0,
    h,
  ]);
};
