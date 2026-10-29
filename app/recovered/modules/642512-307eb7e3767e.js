// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(872682),
    r = e.i(163401),
    i = e.i(369773),
    a = e.i(352386),
    n = e.i(394468),
    l = e.i(505835),
    s = e.i(11315),
    o = e.i(254967),
    d = e.i(816785);
  let c = { parts: [t.Part.TRADES], delivery: "all" },
    u = (e, t) => {
      if (!e) return null;
      let i = (0, l.U)({ mint: e, chainId: t });
      if (!i) return null;
      try {
        return (0, r.coinTopic)(i, e);
      } catch {
        return null;
      }
    },
    p = (e) => new Date(e.timestamp).getTime(),
    f = ({ mint: e, chainId: r, onTrade: l, onResync: f }) => {
      let m = (0, a.useRef)(l);
      m.current = l;
      let g = (0, a.useRef)(f);
      g.current = f;
      let v = (0, a.useMemo)(() => u(e, r), [e, r]),
        h = (0, a.useRef)({
          blocks: 0,
          dropped: 0,
          reportedAtMs: 0,
          resyncedAtMs: 0,
        }),
        b = (0, a.useRef)(!1),
        [S, k] = (0, a.useState)(null);
      (0, a.useEffect)(
        () => (
          (h.current = {
            blocks: 0,
            dropped: 0,
            reportedAtMs: 0,
            resyncedAtMs: 0,
          }),
          (b.current = !1),
          () => k(null)
        ),
        [v],
      );
      let y = (0, a.useCallback)(
        (r, a) => {
          let l,
            s = (0, i.isCoinState)(a) ? a.phase : void 0,
            o = [],
            d = !1,
            c = !1;
          for (let i of r) {
            if ("gap" === i.kind) {
              d = !0;
              continue;
            }
            if ("end" === i.kind) {
              l = !1;
              continue;
            }
            if ("unavailable" === i.kind) {
              i.parts.includes(t.Part.TRADES) && (l = !1);
              continue;
            }
            let r = i.frame.payload;
            if (("coin" === r.case && r.value.trades && (l = !0), i.snapshot)) {
              b.current || ((b.current = !0), (d = !0));
              continue;
            }
            if ("coin" !== r.case) continue;
            let a = r.value,
              u = a.trades?.rows ?? [],
              p = a.aggregates?.trades ?? 0;
            for (let t of (a.trades &&
              p > u.length &&
              ((c = !0),
              (h.current.blocks += 1),
              (h.current.dropped += p - u.length)),
            u)) {
              if (t.isBackfill) continue;
              let r = (0, n.M)(t, a, s);
              r && o.push({ ...r, mintAddress: e });
            }
          }
          for (let e of (o.sort((e, t) => p(e) - p(t)), o)) m.current(e);
          let u = h.current,
            f = Date.now();
          if (
            (c && f - u.resyncedAtMs >= 1e4 && ((u.resyncedAtMs = f), (d = !0)),
            u.dropped > 0 && f - u.reportedAtMs >= 6e4)
          ) {
            var S;
            ((S = {
              name: "chart_truncated",
              topic: v,
              blocks: u.blocks,
              dropped: u.dropped,
            }),
              window.DD_RUM?.addAction?.("uapi_stream", S),
              (u.blocks = 0),
              (u.dropped = 0),
              (u.reportedAtMs = f));
          }
          (void 0 !== l && k(l ? null : v), d && g.current());
        },
        [e, v],
      );
      (0, o.A)(v, c, y);
      let T = (0, s.q)(null !== v),
        w = null !== v && S === v;
      (0, a.useEffect)(() => {
        let { setDown: t } = d.Z.getState();
        return (t(e, T || w), () => t(e, !1));
      }, [e, T, w]);
    };
  e.s([
    "CHART_STREAM_OPTIONS",
    0,
    c,
    "CHART_TRUNCATION_RESYNC_MS",
    0,
    1e4,
    "UapiChartTradesMount",
    0,
    function (e) {
      return (f(e), null);
    },
    "chartStreamTopic",
    0,
    u,
    "useUapiChartTrades",
    0,
    f,
  ]);
};
