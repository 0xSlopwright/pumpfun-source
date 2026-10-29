// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(369773),
    r = e.i(163401),
    a = e.i(352386),
    n = e.i(872682),
    s = e.i(503774),
    l = e.i(493025);
  let o = (e) => {
      if (!e || "" === e.value) return;
      let t = Number(e.value);
      return Number.isFinite(t) ? t : void 0;
    },
    d = (e) => ("number" == typeof e && Number.isFinite(e) ? e / 100 : void 0),
    c = (e) => {
      if (!e) return;
      let t = 1e3 * Number(e.seconds) + Math.floor(e.nanos / 1e6);
      return t > 0 ? t : void 0;
    },
    u = new WeakMap();
  var m = e.i(763114);
  e.i(11315);
  var p = e.i(254967),
    f = e.i(653805);
  let g = {
    new: "board_new",
    graduating: "board_graduating",
    graduated: "board_graduated",
    movers: "board_movers",
  };
  function v(e, n, s) {
    let l,
      o,
      d,
      c,
      u,
      g,
      v,
      h = (0, t.c)(5);
    h[0] !== n || h[1] !== e
      ? ((l = n ? (0, r.listTopic)(e) : null),
        (h[0] = n),
        (h[1] = e),
        (h[2] = l))
      : (l = h[2]);
    let b = (0, p.b)(l, void 0, s);
    h[3] !== b
      ? ((o = (0, i.isListState)(b) ? b : void 0), (h[3] = b), (h[4] = o))
      : (o = h[4]);
    let S = o;
    return (
      (g = (0, t.c)(4))[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((d = new WeakSet()), (g[0] = d))
        : (d = g[0]),
      (v = (0, a.useRef)(d)),
      g[1] !== S
        ? ((c = () => {
            if (!S) return;
            let e = f.x.getState();
            for (let t of S.cards) {
              let r = S.members.get((0, i.refKey)(t.coin?.id ?? t.market?.id)),
                a = r?.market ?? t.market;
              if (!a || v.current.has(a)) continue;
              v.current.add(a);
              let n = (r?.coin ?? t.coin)?.id?.address ?? a.id?.address;
              if (!n) continue;
              let s = (0, m.X)(a, {
                mint: n,
                traded: !!r?.market && (0, m.s)(r.kind),
              });
              void 0 !== s.usdMarketCap && e.updateCoin(n, s);
            }
          }),
          (u = [S]),
          (g[1] = S),
          (g[2] = c),
          (g[3] = u))
        : ((c = g[2]), (u = g[3])),
      (0, a.useEffect)(c, u),
      S
    );
  }
  e.s(
    [
      "UAPI_BOARD_KIND",
      0,
      g,
      "UapiBoardFeed",
      0,
      function (e) {
        let r,
          m,
          f,
          h,
          b,
          S,
          k,
          y = (0, t.c)(14),
          { board: w, ipfsPrefix: T, onRows: _, onDown: E, client: M } = e,
          A = (0, p.f)(void 0, M);
        (y[0] !== A || y[1] !== E
          ? ((r = () => {
              E?.(A);
            }),
            (m = [A, E]),
            (y[0] = A),
            (y[1] = E),
            (y[2] = r),
            (y[3] = m))
          : ((r = y[2]), (m = y[3])),
          (0, a.useEffect)(r, m));
        let O = v(g[w], !0, M);
        if (y[4] !== T || y[5] !== O)
          ((f = O
            ? O
              ? O.cards.map((e) => {
                  let t,
                    r,
                    a,
                    m,
                    p,
                    f,
                    g,
                    v,
                    h,
                    b,
                    S,
                    k = O.members.get(
                      (0, i.refKey)(e.coin?.id ?? e.market?.id),
                    ),
                    y = u.get(e);
                  if (y && y.member === k && y.ipfsPrefix === T) return y.row;
                  let w =
                    ((t = k?.coin ?? e.coin),
                    (r = k?.market ?? e.market),
                    (a = k?.phase ?? e.phase),
                    (m = a?.phase === n.LifecyclePhase.GRADUATED),
                    (p = a?.progressBps ?? r?.progressBps),
                    (f = r?.windows.find(
                      (e) => e.kind === n.WindowKind.WINDOW_KIND_24H,
                    )),
                    (g = r?.holdersSummary),
                    (v = t?.socials),
                    (h = c(a?.graduatedAt?.blockTime)),
                    (b = {
                      m: t?.id?.address ?? r?.id?.address,
                      n: t?.name,
                      t: t?.symbol,
                      i: t?.imageUrl,
                      mc: o(r?.marketCapUsd),
                      gd: m ? Math.floor((h ?? 1e3) / 1e3) : 0,
                      dw: t?.creator,
                      desc: t?.description,
                      c: t?.id?.chainId ?? r?.id?.chainId,
                      p: void 0 !== p ? p / 100 : void 0,
                      nh:
                        r?.holderCount !== void 0
                          ? Number(r.holderCount)
                          : void 0,
                      vUsd24h: o(f?.volumeUsd),
                      bc: f?.buys,
                      sc: f?.sells,
                      txc: f ? f.buys + f.sells : void 0,
                      t10: d(g?.top10ShareBps),
                      dh: d(g?.devShareBps),
                      so: d(g?.sniperShareBps),
                      bo: d(g?.bundlerShareBps),
                      tw: v?.twitter,
                      ws: v?.website,
                      tg: v?.telegram,
                    }),
                    ((S = (0, s.J)(b)).coin.created_timestamp =
                      c(t?.createdAt?.blockTime) ?? null),
                    S);
                  return (
                    (0, l.f)([w.coin], T),
                    u.set(e, { member: k, ipfsPrefix: T, row: w }),
                    w
                  );
                })
              : []
            : void 0),
            (y[4] = T),
            (y[5] = O),
            (y[6] = f));
        else f = y[6];
        let I = f;
        return (
          y[7] !== _ || y[8] !== I
            ? ((h = () => {
                _(I);
              }),
              (b = [I, _]),
              (y[7] = _),
              (y[8] = I),
              (y[9] = h),
              (y[10] = b))
            : ((h = y[9]), (b = y[10])),
          (0, a.useEffect)(h, b),
          y[11] !== _
            ? ((S = () => () => _(void 0)),
              (k = [_]),
              (y[11] = _),
              (y[12] = S),
              (y[13] = k))
            : ((S = y[12]), (k = y[13])),
          (0, a.useEffect)(S, k),
          null
        );
      },
      "useUapiBoard",
      0,
      v,
    ],
    968115,
  );
};
