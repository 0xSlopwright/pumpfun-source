// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    a = e.i(445242),
    l = e.i(745018),
    r = e.i(439587),
    i = e.i(574472),
    n = e.i(599077),
    o = e.i(352386);
  e.i(12692);
  var s = e.i(398902),
    c = e.i(781901),
    u = e.i(63289),
    d = e.i(536925),
    m = e.i(839305),
    f = e.i(763236),
    p = e.i(642282),
    _ = e.i(237687),
    h = e.i(46894),
    g = e.i(214111),
    b = e.i(342606),
    x = e.i(34011),
    y = e.i(116830),
    v = e.i(924631),
    E = e.i(167958),
    w = e.i(787773),
    L = e.i(148003),
    C = e.i(724423),
    N = e.i(51206),
    I = e.i(289638),
    A = e.i(935302),
    T = e.i(248496),
    j = e.i(675874),
    k = e.i(149757),
    S = e.i(161705),
    D = e.i(132838),
    P = e.i(606933),
    O = e.i(690877),
    B = e.i(85324),
    M = e.i(402030),
    R = e.i(759257);
  let U = "POST /callout/media",
    q = (e) =>
      (0, R.j)()("GET /callout/media/{mediaId}", {
        params: { mediaId: e },
        credentials: "include",
      }),
    V = "callouts.reply.media.video_check_failed";
  var F = e.i(561259);
  let K = (e) => ["callouts", "media-upload", e.name, e.size, e.lastModified],
    z = (e) => ["callouts", "media-status", e];
  var Q = e.i(116458),
    G = e.i(768359),
    H = e.i(362373),
    $ = e.i(830340),
    W = e.i(541710),
    X = e.i(779106),
    Y = e.i(79395);
  e.s(["f", 0, 1], 385999);
  var J = e.i(595673),
    Z = e.i(338319),
    ee = e.i(728923),
    et = e.i(653805),
    ea = e.i(90832),
    el = e.i(955332);
  let er =
      "mt-0.5 flex min-w-0 items-baseline gap-3 text-xs leading-4 text-text-tertiary tabular-nums",
    ei = [0, 1, 2],
    en = (e) => {
      let t = (0, v.W)(e);
      return t ? `$${t}` : null;
    };
  function eo(e) {
    return "number" == typeof e && Number.isFinite(e) && e > 0 ? e : null;
  }
  function es(e) {
    return (0, t.jsxs)(
      "li",
      {
        className: "flex h-14 items-center gap-3 px-5",
        children: [
          (0, t.jsx)(T.l, { variant: "art", size: 40 }),
          (0, t.jsxs)("span", {
            className: "flex flex-col gap-1.5",
            children: [
              (0, t.jsx)(T.l, { width: 112, height: 14 }),
              (0, t.jsx)(T.l, { width: 80, height: 12 }),
            ],
          }),
        ],
      },
      e,
    );
  }
  e.s(
    [
      "f",
      0,
      function (e) {
        var v;
        let T,
          ec,
          eu,
          ed,
          em,
          ef,
          ep,
          e_,
          eh,
          eg,
          eb,
          ex,
          ey,
          ev,
          eE,
          ew,
          eL,
          eC,
          eN,
          eI,
          eA,
          eT,
          ej,
          ek,
          eS,
          eD,
          eP,
          eO,
          eB = (0, a.c)(68),
          {
            isOpen: eM,
            onOpenChange: eR,
            prefilledCoin: eU,
            sourceRef: eq,
          } = e,
          eV = void 0 === eq ? null : eq,
          { t: eF } = (0, s.f)(),
          { address: eK, revalidateSession: ez } = (0, i.F)(),
          eQ = (0, n.usePathname)();
        eB[0] !== eQ
          ? ((T = (0, el.I)(eQ)), (eB[0] = eQ), (eB[1] = T))
          : (T = eB[1]);
        let eG = T,
          [eH, e$] = (0, o.useState)(""),
          [eW, eX] = (0, o.useState)(eU ?? null),
          [eY, eJ] = (0, o.useState)("");
        eB[2] !== eY
          ? ((ec = { content: eY, setContent: eJ }), (eB[2] = eY), (eB[3] = ec))
          : (ec = eB[3]);
        let eZ = (0, k.f)(ec);
        eB[4] === Symbol.for("react.memo_cache_sentinel")
          ? ((eu = { allowVideo: !0 }), (eB[4] = eu))
          : (eu = eB[4]);
        let {
            attachment: e1,
            attachmentError: e0,
            attachMedia: e2,
            attachFromDataTransfer: e4,
            removeMedia: e3,
          } = (0, j.f)(eu),
          e5 = e1?.kind !== "video" || e1.checking ? null : e1.file,
          [e6, e7] = (0, d.j)("create-callout-app-upsell-dismissed", !1),
          [e8, e9] = (0, d.j)("create-callout-quality-tip-dismissed", !1),
          te = (0, o.useRef)(!1),
          tt = eM && !eU && !eW && !!eG,
          ta = eG ?? "";
        (eB[5] !== tt
          ? ((ed = { enabled: tt }), (eB[5] = tt), (eB[6] = ed))
          : (ed = eB[6]),
          eB[7] !== ta || eB[8] !== ed
            ? ((em = { coinAddress: ta, queryOptions: ed }),
              (eB[7] = ta),
              (eB[8] = ed),
              (eB[9] = em))
            : (em = eB[9]));
        let { data: tl, isFetching: tr } = (0, Y.f)(em),
          ti = eW ?? (tt ? (tl ?? null) : null),
          tn = ti?.mint ?? "",
          to = eM && !!ti?.mint;
        (eB[10] !== to
          ? ((ef = {
              enabled: to,
              refetchOnMount: "always",
              staleTime: 0,
              refetchInterval: 15e3,
            }),
            (eB[10] = to),
            (eB[11] = ef))
          : (ef = eB[11]),
          eB[12] !== tn || eB[13] !== ef
            ? ((ep = { coinAddress: tn, queryOptions: ef }),
              (eB[12] = tn),
              (eB[13] = ef),
              (eB[14] = ep))
            : (ep = eB[14]));
        let { data: ts, dataUpdatedAt: tc } = (0, Y.f)(ep),
          tu = (0, et.F)(ti?.mint ?? ""),
          td =
            (tu?.isLiveData && tu.lastUpdated > tc
              ? eo(tu.usdMarketCap)
              : null) ??
            eo(ts?.usd_market_cap) ??
            eo(ti?.usd_market_cap),
          tm = eM && !!ti && !e6,
          tf = (0, o.useRef)(!1);
        (eB[15] !== eM || eB[16] !== tm
          ? ((e_ = () => {
              if (!eM) {
                tf.current = !1;
                return;
              }
              !tm || tf.current || ((tf.current = !0), (0, J.M6)());
            }),
            (eh = [eM, tm]),
            (eB[15] = eM),
            (eB[16] = tm),
            (eB[17] = e_),
            (eB[18] = eh))
          : ((e_ = eB[17]), (eh = eB[18])),
          (0, o.useEffect)(e_, eh),
          ti?.mint);
        let tp = ti?.mint;
        eB[19] !== eQ || eB[20] !== tp
          ? ((eg = (0, el.d)(eQ, "callout", tp)),
            (eB[19] = eQ),
            (eB[20] = tp),
            (eB[21] = eg))
          : (eg = eB[21]);
        let t_ = eg,
          th = eM && !ti;
        eB[22] !== eH || eB[23] !== th
          ? ((eb = { term: eH, enabled: th }),
            (eB[22] = eH),
            (eB[23] = th),
            (eB[24] = eb))
          : (eb = eB[24]);
        let { data: tg, isFetching: tb } = (0, b.f)(eb);
        eB[25] !== tg
          ? ((ex = void 0 === tg ? [] : tg), (eB[25] = tg), (eB[26] = ex))
          : (ex = eB[26]);
        let tx = ex,
          ty = ti?.mint,
          tv = ti?.chain_id,
          tE = eM && !!ti?.mint;
        eB[27] !== ty || eB[28] !== tv || eB[29] !== tE
          ? ((ey = { mint: ty, chainId: tv, enabled: tE, pollWhileDenied: !0 }),
            (eB[27] = ty),
            (eB[28] = tv),
            (eB[29] = tE),
            (eB[30] = ey))
          : (ey = eB[30]);
        let { data: tw, isPending: tL, refetch: tC } = (0, S.f)(ey),
          tN = tw?.eligible === !1,
          tI =
            tw?.eligible === !1 &&
            ("EXISTING_CALLOUT" === tw.reason || !!tw.existingCalloutId);
        eB[31] !== e5
          ? ((ev = { video: e5 }), (eB[31] = e5), (eB[32] = ev))
          : (ev = eB[32]);
        let tA = (function (e) {
            let t,
              l,
              r,
              n,
              c,
              d = (0, a.c)(16);
            d[0] !== e
              ? ((t = void 0 === e ? {} : e), (d[0] = e), (d[1] = t))
              : (t = d[1]);
            let { video: m } = t,
              f = (0, P.useQueryClient)(),
              { address: p } = (0, i.F)(),
              _ = (0, X.f)("create-callout"),
              { t: h } = (0, s.f)(),
              g = ((e) => {
                let t,
                  l,
                  r,
                  i,
                  n,
                  c,
                  d,
                  m,
                  f,
                  p,
                  _,
                  h,
                  g,
                  b,
                  x = (0, a.c)(48),
                  { t: y } = (0, s.f)(),
                  v = (0, P.useQueryClient)();
                (x[0] !== e
                  ? ((t = e ? K(e) : ["callouts", "media-upload", "none"]),
                    (x[0] = e),
                    (x[1] = t))
                  : (t = x[1]),
                  x[2] !== e
                    ? ((l = () =>
                        (0, R.j)()(U, {
                          body: { video: e },
                          credentials: "include",
                        })),
                      (x[2] = e),
                      (x[3] = l))
                    : (l = x[3]));
                let E = null !== e;
                x[4] !== t || x[5] !== l || x[6] !== E
                  ? ((r = {
                      queryKey: t,
                      queryFn: l,
                      enabled: E,
                      staleTime: 1 / 0,
                      gcTime: 15e5,
                      retry: !1,
                    }),
                    (x[4] = t),
                    (x[5] = l),
                    (x[6] = E),
                    (x[7] = r))
                  : (r = x[7]);
                let w = (0, O.useQuery)(r),
                  L = w.data?.mediaId ?? null,
                  C = w.dataUpdatedAt,
                  N = w.data?.status === "pending";
                x[8] !== L || x[9] !== v
                  ? ((i = v.getQueryData(z(L))),
                    (x[8] = L),
                    (x[9] = v),
                    (x[10] = i))
                  : (i = x[10]);
                let I = i,
                  A = !I || "pending" === I.status,
                  T = (0, B.q)(Date.now() - C < 3e4 ? 2e3 : 5e3, N && A);
                (x[11] !== L
                  ? ((n = z(L)), (x[11] = L), (x[12] = n))
                  : (n = x[12]),
                  x[13] !== L
                    ? ((c = () => q(L)), (x[13] = L), (x[14] = c))
                    : (c = x[14]));
                let j = N && null !== L;
                x[15] !== T || x[16] !== n || x[17] !== c || x[18] !== j
                  ? ((d = {
                      queryKey: n,
                      queryFn: c,
                      enabled: j,
                      refetchInterval: T,
                      retry: 2,
                    }),
                    (x[15] = T),
                    (x[16] = n),
                    (x[17] = c),
                    (x[18] = j),
                    (x[19] = d))
                  : (d = x[19]);
                let k = (0, O.useQuery)(d),
                  S = (0, o.useRef)(null);
                (x[20] !== y || x[21] !== w.error
                  ? ((f = () => {
                      var e;
                      let t;
                      if (!w.error || S.current === w.error) return;
                      S.current = w.error;
                      let a = ((t = e = w.error), (0, M.isContractError)(t, U))
                        ? "VIDEO_DISABLED" === e.code
                          ? "callouts.reply.errors.video_disabled"
                          : "MEDIA_RATE_LIMITED" === e.code || 429 === e.status
                            ? "web.callouts.create_media_rate_limited"
                            : 413 === e.status
                              ? "callouts.reply.media.video_too_large"
                              : 400 === e.status
                                ? "callouts.reply.media.video_attach_failed"
                                : V
                        : V;
                      u.c.error(
                        "callouts.reply.media.video_too_large" === a
                          ? y(a, { size: F.Z })
                          : y(a),
                      );
                    }),
                    (m = [w.error, y]),
                    (x[20] = y),
                    (x[21] = w.error),
                    (x[22] = m),
                    (x[23] = f))
                  : ((m = x[22]), (f = x[23])),
                  (0, o.useEffect)(f, m),
                  x[24] !== e || x[25] !== v || x[26] !== w.data || x[27] !== C
                    ? ((p = () => {
                        if (!e || !w.data) return;
                        let t = setTimeout(
                          () => v.resetQueries({ queryKey: K(e) }),
                          Math.max(15e5 - (Date.now() - C), 0),
                        );
                        return () => clearTimeout(t);
                      }),
                      (_ = [e, w.data, C, v]),
                      (x[24] = e),
                      (x[25] = v),
                      (x[26] = w.data),
                      (x[27] = C),
                      (x[28] = p),
                      (x[29] = _))
                    : ((p = x[28]), (_ = x[29])),
                  (0, o.useEffect)(p, _),
                  x[30] !== e ||
                  x[31] !== L ||
                  x[32] !== v ||
                  x[33] !== w.data ||
                  x[34] !== k.error
                    ? ((h = () => {
                        if (e) {
                          if (w.data && k.error)
                            return void v.resetQueries({ queryKey: z(L) });
                          v.resetQueries({ queryKey: K(e) });
                        }
                      }),
                      (x[30] = e),
                      (x[31] = L),
                      (x[32] = v),
                      (x[33] = w.data),
                      (x[34] = k.error),
                      (x[35] = h))
                    : (h = x[35]));
                let D = h,
                  Q = w.data?.status,
                  G = k.data?.status;
                x[36] !== e ||
                x[37] !== Q ||
                x[38] !== G ||
                x[39] !== w.error ||
                x[40] !== k.error
                  ? ((g = (({
                      file: e,
                      uploadError: t,
                      uploadStatus: a,
                      verdictError: l,
                      verdictStatus: r,
                    }) => {
                      if (!e) return "idle";
                      if (t || l) return "failed";
                      if (!a) return "uploading";
                      let i = r ?? a;
                      return "pending" === i ? "checking" : i;
                    })({
                      file: e,
                      uploadError: w.error,
                      uploadStatus: Q,
                      verdictError: k.error,
                      verdictStatus: G,
                    })),
                    (x[36] = e),
                    (x[37] = Q),
                    (x[38] = G),
                    (x[39] = w.error),
                    (x[40] = k.error),
                    (x[41] = g))
                  : (g = x[41]);
                let H = g,
                  $ = "uploading" === H || "flagged" === H || "failed" === H,
                  W = "checking" === H && null !== L;
                return (
                  x[42] !== L ||
                  x[43] !== D ||
                  x[44] !== H ||
                  x[45] !== $ ||
                  x[46] !== W
                    ? ((b = {
                        status: H,
                        mediaId: L,
                        isBlockingSubmit: $,
                        isDeferredPublish: W,
                        retry: D,
                      }),
                      (x[42] = L),
                      (x[43] = D),
                      (x[44] = H),
                      (x[45] = $),
                      (x[46] = W),
                      (x[47] = b))
                    : (b = x[47]),
                  b
                );
              })(void 0 === m ? null : m),
              b = (0, W.l)();
            (d[2] !== p || d[3] !== b
              ? ((l = async (e) => {
                  let {
                    coin: t,
                    note: a,
                    image: l,
                    mediaId: r,
                    sourceRef: i,
                  } = e;
                  if (!p) throw new $.m();
                  let n = a?.trim() || void 0,
                    o = (0, H.s)(t, b),
                    s = (0, H.L)(t, b),
                    { id: c } = await (0, $.I)({
                      tokenAddress: t.mint,
                      ...(n ? { content: n } : {}),
                      ...(null != o ? { chainId: o } : {}),
                      ...(s ? { chain: s } : {}),
                      ...(l ? { image: l } : {}),
                      ...(r ? { mediaId: r } : {}),
                      ...(i ? { sourceRef: i } : {}),
                    });
                  return { calloutId: c };
                }),
                (d[2] = p),
                (d[3] = b),
                (d[4] = l))
              : (l = d[4]),
              d[5] !== p || d[6] !== f || d[7] !== h || d[8] !== _
                ? ((r = async (e, t) => {
                    let a = t.coin.mint,
                      l = t.note?.trim() || void 0;
                    if (_) {
                      let r =
                          t.image && "function" == typeof URL.createObjectURL
                            ? URL.createObjectURL(t.image)
                            : null,
                        i = {
                          calloutId: e.calloutId,
                          userId: _,
                          coinMint: a,
                          marketCap: t.coin.usd_market_cap ?? 0,
                          calloutPrice: 0,
                          multiple: 1,
                          createdAt: Date.now(),
                          maxPriceSol: 0,
                          ...(l ? { note: l } : {}),
                          ...(r ? { mediaUrl: r } : {}),
                        };
                      (t.mediaId && t.videoPending
                        ? (0, Q.H)(_, a, i, { ttlMs: 9e5 })
                        : (0, Q.H)(_, a, i),
                        f.setQueriesData(
                          { queryKey: ["callouts", "by-user", _] },
                          (e) => {
                            let t = e?.pages[0];
                            return !e ||
                              !t ||
                              e.pages.some((e) =>
                                e.callouts.some((e) => e.coinMint === a),
                              )
                              ? e
                              : {
                                  ...e,
                                  pages: [
                                    { ...t, callouts: [i, ...t.callouts] },
                                    ...e.pages.slice(1),
                                  ],
                                };
                          },
                        ));
                    }
                    (t.mediaId &&
                      t.videoPending &&
                      (({
                        mediaId: e,
                        calloutId: t,
                        mint: a,
                        viewer: l,
                        portfolioAddress: r = null,
                        queryClient: i,
                        t: n,
                        now: o = Date.now,
                      }) => {
                        let s = u.c.loading(
                            n("web.callouts.create.video_processing_toast"),
                            { duration: 9e5 },
                          ),
                          c = o(),
                          d = null,
                          m = !1,
                          f = () =>
                            Promise.all([
                              i.invalidateQueries({
                                queryKey: ["callouts", "own-mint"],
                              }),
                              i.invalidateQueries({
                                queryKey: ["callouts", "by-mint"],
                              }),
                              i.invalidateQueries({
                                queryKey: ["callouts", "recent"],
                              }),
                              ...(l
                                ? [
                                    i.invalidateQueries({
                                      queryKey: ["callouts", "by-user", l],
                                    }),
                                  ]
                                : []),
                              ...(r
                                ? [
                                    i.invalidateQueries({
                                      queryKey: G.m.subject(r),
                                    }),
                                  ]
                                : []),
                            ]),
                          p = async () => {
                            if (m) return;
                            if (o() - c > 9e5) return void u.c.dismiss(s);
                            let r = null;
                            try {
                              r = await q(e);
                            } catch {}
                            if (!m) {
                              if (r?.status === "clean")
                                return void (u.c.success(
                                  n("callouts.create.video_published_toast"),
                                  { id: s, duration: void 0 },
                                ),
                                f());
                              if (r && "pending" !== r.status)
                                return void (u.c.error(
                                  n("callouts.create.video_dropped_toast"),
                                  { id: s, duration: void 0 },
                                ),
                                l &&
                                  ((0, Q.q)(l, a),
                                  i.setQueriesData(
                                    { queryKey: ["callouts", "by-user", l] },
                                    (e) =>
                                      e
                                        ? {
                                            ...e,
                                            pages: e.pages.map((e) => ({
                                              ...e,
                                              callouts: e.callouts.filter(
                                                (e) => e.calloutId !== t,
                                              ),
                                            })),
                                          }
                                        : e,
                                  )),
                                Promise.all([
                                  f(),
                                  i.invalidateQueries({
                                    queryKey: ["callouts", "eligibility", a],
                                  }),
                                ]));
                              d = setTimeout(() => void p(), 5e3);
                            }
                          };
                        return (
                          (d = setTimeout(() => void p(), 5e3)),
                          () => {
                            ((m = !0), d && clearTimeout(d));
                          }
                        );
                      })({
                        mediaId: t.mediaId,
                        calloutId: e.calloutId,
                        mint: a,
                        viewer: _,
                        portfolioAddress: p ?? null,
                        queryClient: f,
                        t: h,
                      }),
                      await Promise.all([
                        ...(p
                          ? [f.invalidateQueries({ queryKey: G.m.subject(p) })]
                          : []),
                        f.invalidateQueries({
                          queryKey: ["callouts", "leaderboard"],
                        }),
                        f.invalidateQueries({
                          queryKey: ["callouts", "eligibility", a],
                        }),
                        f.invalidateQueries({
                          queryKey: ["callouts", "own-mint"],
                        }),
                        f.invalidateQueries({
                          queryKey: ["callouts", "by-mint"],
                        }),
                        f.invalidateQueries({
                          queryKey: ["callouts", "recent"],
                        }),
                      ]));
                  }),
                  (d[5] = p),
                  (d[6] = f),
                  (d[7] = h),
                  (d[8] = _),
                  (d[9] = r))
                : (r = d[9]),
              d[10] !== l || d[11] !== r
                ? ((n = { mutationFn: l, onSuccess: r }),
                  (d[10] = l),
                  (d[11] = r),
                  (d[12] = n))
                : (n = d[12]));
            let x = (0, D.f)(n);
            return (
              d[13] !== x || d[14] !== g
                ? ((c = { ...x, videoUpload: g }),
                  (d[13] = x),
                  (d[14] = g),
                  (d[15] = c))
                : (c = d[15]),
              c
            );
          })(ev),
          tT = tA.reset,
          { videoUpload: tj } = tA;
        (eB[33] !== tT || eB[34] !== eM || eB[35] !== eU || eB[36] !== e3
          ? ((eE = () => {
              eM ||
                (e$(""), eX(eU ?? null), eJ(""), e3(), (te.current = !1), tT());
            }),
            (ew = [eM, eU, tT, e3]),
            (eB[33] = tT),
            (eB[34] = eM),
            (eB[35] = eU),
            (eB[36] = e3),
            (eB[37] = eE),
            (eB[38] = ew))
          : ((eE = eB[37]), (ew = eB[38])),
          (0, o.useEffect)(eE, ew),
          eB[39] !== tl || eB[40] !== tt
            ? ((eL = () => {
                !tt || (tl && eX(tl));
              }),
              (eC = [tt, tl]),
              (eB[39] = tl),
              (eB[40] = tt),
              (eB[41] = eL),
              (eB[42] = eC))
            : ((eL = eB[41]), (eC = eB[42])),
          (0, o.useEffect)(eL, eC),
          eB[43] !== t_
            ? ((eN = () => {
                ((0, J.Ke)({ interactionType: "click" }),
                  window.open(t_, "_blank", "noopener,noreferrer"));
              }),
              (eB[43] = t_),
              (eB[44] = eN))
            : (eN = eB[44]));
        let tk = eN;
        eB[45] !== e7
          ? ((eI = () => {
              ((0, J.Ke)({ interactionType: "dismiss" }), e7(!0));
            }),
            (eB[45] = e7),
            (eB[46] = eI))
          : (eI = eB[46]);
        let tS = eI,
          tD = eY.trim();
        eB[47] !== eZ || eB[48] !== eY
          ? ((eA = eZ.serialize(eY)),
            (eB[47] = eZ),
            (eB[48] = eY),
            (eB[49] = eA))
          : (eA = eB[49]);
        let tP = eA.length,
          tO = 2e3 - tP,
          tB = tD.length > 0,
          tM = tP <= 2e3,
          tR = null !== e1,
          tU = tA.isPending || tR;
        eB[50] !== e2
          ? ((eT = (e) => {
              e2(e) && (0, J.hH)({ surface: "create" });
            }),
            (eB[50] = e2),
            (eB[51] = eT))
          : (eT = eB[51]);
        let tq = eT;
        eB[52] !== e4
          ? ((ej = (e) => {
              let t = e4(e);
              return (t && (0, J.hH)({ surface: "create" }), t);
            }),
            (eB[52] = e4),
            (eB[53] = ej))
          : (ej = eB[53]);
        let tV = ej;
        eB[54] !== tU || eB[55] !== tV
          ? ((ek = { onDrop: tV, disabled: tU }),
            (eB[54] = tU),
            (eB[55] = tV),
            (eB[56] = ek))
          : (ek = eB[56]);
        let { isDragging: tF, dropProps: tK } = (0, f.O)(ek);
        e1?.checking;
        e: {
          if (
            !eK ||
            !ti ||
            tL ||
            !tw ||
            !1 === tw.eligible ||
            tA.isPending ||
            e1?.checking ||
            tj.isBlockingSubmit ||
            !tM ||
            !tB ||
            tw?.createDenialVerdict === "INSUFFICIENT_BALANCE"
          ) {
            eS = !1;
            break e;
          }
          eS = !0;
        }
        let tz = eS;
        eB[57] !== ti || eB[58] !== eR
          ? ((eD = () => {
              ti &&
                (eR(!1),
                (0, _.R)({
                  mint: ti.mint,
                  chainId: ti.chain_id,
                  entryPoint: "create_callout_dialog",
                }));
            }),
            (eB[57] = ti),
            (eB[58] = eR),
            (eB[59] = eD))
          : (eD = eB[59]);
        let tQ = eD,
          tG = async () => {
            if (!ti || te.current) return;
            te.current = !0;
            let e =
                null != td && td !== ti.usd_market_cap
                  ? { ...ti, usd_market_cap: td }
                  : ti,
              t = e1?.kind === "image" ? e1.file : null,
              a = e5 ? tj.mediaId : null,
              l = tj.isDeferredPublish,
              r = {
                coin: e,
                note: eZ.serialize(tD) || void 0,
                image: t,
                mediaId: a,
                videoPending: l,
                ...(eV ? { sourceRef: eV } : {}),
              },
              i = null,
              n = null;
            try {
              i = await tA.mutateAsync(r);
            } catch (e) {
              n = e;
            }
            if (null !== i) {
              ((0, J.bH)({ hasNote: tD.length > 0, hasImage: null !== e1 }),
                i.calloutId &&
                  (0, J.V$)({
                    mint: ti.mint,
                    contentId: i.calloutId,
                    chain: (0, J.i9)(ti.mint, ti.chain_id),
                  }),
                l ||
                  (0, m.f)({
                    t: eF,
                    symbol: ti.symbol ?? void 0,
                    href: i.calloutId
                      ? `/callouts/${ti.mint}/${i.calloutId}`
                      : void 0,
                  }),
                eR(!1),
                (0, ee.g)("first_callout"),
                (te.current = !1));
              return;
            }
            if (
              (0, $.q)(n, "INVALID_CONTENT") ||
              ((0, $.S)(n) && 422 === n.status)
            ) {
              ((0, J.dE)({ reason: "moderation", error: n, mint: ti.mint }),
                u.c.error(eF("web.callouts.create_moderation_flagged")),
                (te.current = !1));
              return;
            }
            if (e5 && (0, $.q)(n, "MEDIA_EXPIRED")) {
              ((0, J.dE)({ reason: "media", error: n, mint: ti.mint }),
                u.c.error(eF("callouts.reply.errors.video_expired")),
                tj.retry(),
                (te.current = !1));
              return;
            }
            if ((0, $.w)(n)) {
              ((0, J.dE)({ reason: "media", error: n, mint: ti.mint }),
                u.c.error(eF((0, $.Q)(n))),
                e3(),
                (te.current = !1));
              return;
            }
            if (
              (0, $.q)(n, "DUPLICATE_CALLOUT") ||
              ((0, $.S)(n) && 409 === n.status)
            ) {
              (0, J.dE)({ reason: "ineligible", error: n, mint: ti.mint });
              let e = ti.mint,
                t = ti.chain_id;
              (u.c.error(
                eF("web.callouts.create_duplicate_toast", {
                  symbol: ti.symbol ?? eF("web.callouts.this_coin_fallback"),
                }),
                {
                  action: {
                    label: eF("callouts.update.cta"),
                    onClick: () => {
                      (eR(!1),
                        (0, _.R)({
                          mint: e,
                          chainId: t,
                          entryPoint: "create_callout_dialog",
                        }));
                    },
                  },
                },
              ),
                tC(),
                (te.current = !1));
              return;
            }
            if (n instanceof $.m || ((0, $.S)(n) && 401 === n.status)) {
              ((0, J.dE)({ reason: "session", error: n, mint: ti.mint }),
                u.c.error(eF("web.callouts.create_session_expired")),
                ez(),
                (te.current = !1));
              return;
            }
            if ((0, $.q)(n, "INSUFFICIENT_BALANCE")) {
              ((0, J.dE)({ reason: "ineligible", error: n, mint: ti.mint }),
                u.c.error(
                  eF("web.callouts.holding_requirement", {
                    amount: 1,
                    symbol: ti.symbol ?? eF("web.callouts.the_coin_fallback"),
                  }),
                ),
                (te.current = !1));
              return;
            }
            if ((0, $.q)(n, "NO_ELIGIBLE_WALLET")) {
              ((0, J.dE)({ reason: "ineligible", error: n, mint: ti.mint }),
                u.c.error(
                  eF("web.callouts.create_no_eligible_wallet", {
                    symbol: ti.symbol ?? eF("web.callouts.the_coin_fallback"),
                  }),
                ),
                (te.current = !1));
              return;
            }
            if ((0, $.S)(n) && null !== n.code) {
              ((0, J.dE)({ reason: "ineligible", error: n, mint: ti.mint }),
                u.c.error(eF((0, $.Q)(n))),
                (te.current = !1));
              return;
            }
            let o =
              n instanceof TypeError ||
              (n instanceof Error && /network|fetch/i.test(n.message));
            ((0, J.dE)({
              reason: o ? "network" : "unknown",
              error: n,
              mint: ti.mint,
            }),
              u.c.error(eF((0, $.Q)(n))),
              (te.current = !1));
          },
          tH = tt && !ti && tr,
          t$ = E.N;
        eB[60] !== eF
          ? ((eP = eF("web.callouts.new_callout")),
            (eB[60] = eF),
            (eB[61] = eP))
          : (eP = eB[61]);
        let tW = ti
          ? (0, t.jsxs)(t.Fragment, {
              children: [
                (0, t.jsxs)(E.K, {
                  className: "flex flex-col gap-4",
                  "data-testid": "create-callout-compose",
                  ...tK,
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center gap-3",
                      children: [
                        (0, t.jsx)("span", {
                          "data-testid": "create-callout-coin-art",
                          children: (0, t.jsx)(x.CoinAvatar, {
                            coin: ti,
                            size: 40,
                          }),
                        }),
                        (0, t.jsxs)("span", {
                          className: "flex min-w-0 flex-1 flex-col",
                          children: [
                            (0, t.jsx)(y.f, {
                              coin: ti,
                              nameClassName: "text-sm leading-5",
                            }),
                            (0, t.jsxs)("span", {
                              className: er,
                              children: [
                                en(ti.symbol)
                                  ? (0, t.jsx)("span", {
                                      className: "truncate",
                                      children: en(ti.symbol),
                                    })
                                  : null,
                                (0, t.jsx)("span", {
                                  className: "ml-auto shrink-0",
                                  children: eF("web.callouts.calling_at_mc", {
                                    value: (0, g.f)(td),
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, t.jsx)(E.a, {}),
                    (0, t.jsxs)("div", {
                      className: "flex flex-col gap-1",
                      children: [
                        (0, t.jsx)("div", {
                          className: (0, Z.c)(
                            C.F,
                            tF ? "border-text-accent" : C.D.valid,
                            "h-auto items-stretch p-0",
                          ),
                          children: (0, t.jsx)("textarea", {
                            id: "callout-note",
                            value: eY,
                            onChange: eZ.handleChange,
                            onSelect: eZ.handleSelect,
                            onPaste: (e) => {
                              !tU && tV(e.clipboardData) && e.preventDefault();
                            },
                            placeholder: eF("web.callouts.note_placeholder"),
                            "aria-label": eF("web.callouts.note_placeholder"),
                            rows: 4,
                            className:
                              "block min-h-24 w-full resize-none bg-transparent p-3 text-sm leading-5 text-text-primary outline-none placeholder:text-text-quaternary",
                            maxLength: 4e3,
                          }),
                        }),
                        (0, t.jsx)(p.f, {
                          suggestions: eZ.suggestions,
                          onSelect: eZ.selectSuggestion,
                          testId: "create-callout-mentions",
                        }),
                        (0, t.jsx)("span", {
                          className: (0, Z.c)(
                            "self-end text-xs leading-4 tabular-nums",
                            tO < 0 ? "text-loss" : "text-text-quaternary",
                          ),
                          children: tO,
                        }),
                        (0, t.jsx)(f.e, {
                          attachment: e1,
                          error: e0,
                          onRemove: e3,
                          videoUpload: e5 ? tj : null,
                          testId: "create-callout-attachment",
                        }),
                      ],
                    }),
                    (0, t.jsxs)("div", {
                      className:
                        "flex flex-col gap-1 text-xs leading-4 text-text-tertiary",
                      children: [
                        (0, t.jsx)("p", {
                          children: eF("web.callouts.holding_requirement", {
                            amount: 1,
                            symbol:
                              ti.symbol ?? eF("web.callouts.the_coin_fallback"),
                          }),
                        }),
                        tM &&
                        !tN &&
                        tw?.createDenialVerdict === "INSUFFICIENT_BALANCE"
                          ? (0, t.jsx)("p", {
                              "data-testid": "create-callout-holding-gate",
                              className: "text-loss",
                              children:
                                "number" == typeof tw.positionValueUsd
                                  ? eF("web.callouts.holding_below_threshold", {
                                      amount: 1,
                                      symbol: `$${ti.symbol ?? eF("web.callouts.this_coin_fallback")}`,
                                      balance: (0, ea.w)(tw.positionValueUsd),
                                    })
                                  : eF("web.callouts.no_holding", {
                                      symbol: `$${ti.symbol ?? eF("web.callouts.this_coin_fallback")}`,
                                      amount: 1,
                                    }),
                            })
                          : null,
                        tw && !1 === tw.eligible && !tI
                          ? (0, t.jsx)("p", {
                              className: "text-loss",
                              children:
                                "EXISTING_CALLOUT" === (v = tw.reason)
                                  ? eF("web.callouts.ineligible_existing")
                                  : "COOLDOWN" === v
                                    ? eF("web.callouts.ineligible_cooldown")
                                    : "ATTEMPT_LIMIT" === v
                                      ? eF(
                                          "web.callouts.ineligible_attempt_limit",
                                        )
                                      : eF("web.callouts.ineligible_generic"),
                            })
                          : null,
                        eK
                          ? null
                          : (0, t.jsx)("p", {
                              children: eF(
                                "web.callouts.connect_wallet_to_post",
                              ),
                            }),
                      ],
                    }),
                    tI || e8
                      ? null
                      : (0, t.jsx)("div", {
                          "data-testid": "create-callout-quality-tip",
                          className: (0, Z.c)(
                            "-mx-5",
                            tm ? "-mb-4" : "-mb-5 mt-auto",
                          ),
                          children: (0, t.jsx)(h.f, {
                            density: "comfortable",
                            className:
                              "border-b-0 border-t border-border-secondary",
                            onDismiss: () => e9(!0),
                          }),
                        }),
                    tI
                      ? (0, t.jsx)(L.f, {
                          density: "comfortable",
                          className:
                            "-mx-5 w-auto border-b-0 border-t border-border-secondary",
                          action: (0, t.jsx)(r.K, {
                            size: 32,
                            variant: "secondary",
                            onClick: tQ,
                            children: eF("web.callouts.update_your_callout"),
                          }),
                          children: eF("web.callouts.existing_callout_panel", {
                            symbol:
                              ti.symbol ??
                              eF("web.callouts.this_coin_fallback"),
                          }),
                        })
                      : null,
                    tm
                      ? (0, t.jsx)("div", {
                          "data-testid": "callout-app-upsell-card",
                          className: "-mx-5 -mb-5 mt-auto",
                          children: (0, t.jsxs)(L.f, {
                            density: "comfortable",
                            title: eF("web.callouts.upsell_notify_title"),
                            className:
                              "border-b-0 border-t border-border-secondary",
                            action: (0, t.jsxs)("span", {
                              className: "flex items-center gap-1",
                              children: [
                                (0, t.jsx)(r.K, {
                                  size: 32,
                                  variant: "secondary",
                                  onClick: tk,
                                  children: eF("web.callouts.get_the_app"),
                                }),
                                (0, t.jsx)(N._, {
                                  density: "comfortable",
                                  size: 24,
                                  "aria-label": eF(
                                    "web.callouts.dismiss_upsell_a11y",
                                  ),
                                  onClick: tS,
                                  children: (0, t.jsx)(l.AD, {}),
                                }),
                              ],
                            }),
                            children: [
                              eF("web.callouts.upsell_notify_body"),
                              (0, t.jsxs)(I.V, {
                                children: [
                                  (0, t.jsx)(I.J, {
                                    render: (0, t.jsx)("button", {
                                      type: "button",
                                      "data-testid":
                                        "create-callout-qr-trigger",
                                      className:
                                        "mt-1 block text-xs leading-4 text-text-tertiary underline underline-offset-2 transition-colors hover:text-text-primary",
                                    }),
                                    children: eF("common.scan_code"),
                                  }),
                                  (0, t.jsx)(I.T, {
                                    density: "comfortable",
                                    "aria-label": eF(
                                      "web.callouts.scan_qr_a11y",
                                    ),
                                    children: (0, t.jsx)("button", {
                                      type: "button",
                                      onClick: tk,
                                      "aria-label": eF(
                                        "web.callouts.scan_qr_a11y",
                                      ),
                                      className:
                                        "block rounded-md bg-text-hero p-2",
                                      children: (0, t.jsx)(c.default, {
                                        value: t_,
                                        size: 112,
                                        bgColor: "#FAFAFA",
                                        fgColor: "#0B0B0E",
                                        viewBox: "0 0 112 112",
                                      }),
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        })
                      : null,
                  ],
                }),
                (0, t.jsxs)(E.c, {
                  className: "justify-between",
                  children: [
                    (0, t.jsx)(f.S, {
                      onPick: tq,
                      disabled: tU,
                      allowVideo: !0,
                      testId: "create-callout-attach",
                    }),
                    (0, t.jsx)("span", {
                      className: "flex items-center gap-2",
                      children: (0, t.jsx)(r.K, {
                        size: E.$,
                        variant: "primary",
                        onClick: tG,
                        isDisabled: !tz,
                        isLoading: tA.isPending,
                        children: tA.isPending
                          ? eF("web.callouts.posting")
                          : tL
                            ? eF("web.callouts.checking")
                            : eF("web.callouts.call_symbol_cta", {
                                symbol: `$${ti.symbol ?? eF("web.callouts.coin_fallback")}`,
                              }),
                      }),
                    }),
                  ],
                }),
              ],
            })
          : tH
            ? (0, t.jsx)(E.K, {
                className: "flex flex-col",
                children: (0, t.jsx)(w.L, {
                  density: "comfortable",
                  className: "min-h-[280px] flex-1",
                  children: eF("web.callouts.loading_coin"),
                }),
              })
            : (0, t.jsxs)(E.K, {
                className: "flex flex-col gap-3",
                children: [
                  (0, t.jsx)(A.o, {
                    density: "comfortable",
                    label: eF("web.callouts.search_coin_placeholder"),
                    value: eH,
                    onValueChange: e$,
                    className: "h-9 shrink-0",
                    autoFocus: !0,
                  }),
                  (0, t.jsx)("div", {
                    className: "-mx-5 flex min-h-[280px] flex-col",
                    children:
                      0 === eH.trim().length
                        ? (0, t.jsx)(w.L, {
                            density: "comfortable",
                            className: "flex-1",
                            children: eF("web.callouts.search_start_typing"),
                          })
                        : tb && 0 === tx.length
                          ? (0, t.jsxs)(t.Fragment, {
                              children: [
                                (0, t.jsx)("ul", {
                                  "aria-hidden": !0,
                                  className: "flex flex-col",
                                  children: ei.map(es),
                                }),
                                (0, t.jsx)("p", {
                                  role: "status",
                                  className: "sr-only",
                                  children: eF("web.callouts.searching"),
                                }),
                              ],
                            })
                          : 0 === tx.length
                            ? (0, t.jsx)(w.L, {
                                density: "comfortable",
                                className: "flex-1",
                                children: eF("web.callouts.search_no_coins", {
                                  query: eH.trim(),
                                }),
                              })
                            : (0, t.jsx)("ul", {
                                className:
                                  "flex max-h-[448px] flex-col overflow-y-auto",
                                children: tx.map((e) =>
                                  (0, t.jsx)(
                                    "li",
                                    {
                                      children: (0, t.jsxs)("button", {
                                        type: "button",
                                        "data-testid":
                                          "create-callout-search-result",
                                        onClick: () => eX(e),
                                        className:
                                          "focus-inset flex h-14 w-full items-center gap-3 px-5 text-left transition-colors hover:bg-bg-tertiary",
                                        children: [
                                          (0, t.jsx)(x.CoinAvatar, {
                                            coin: e,
                                            size: 40,
                                          }),
                                          (0, t.jsxs)("span", {
                                            className:
                                              "flex min-w-0 flex-1 flex-col",
                                            children: [
                                              (0, t.jsx)(y.f, {
                                                coin: e,
                                                nameClassName:
                                                  "text-sm leading-5",
                                              }),
                                              (0, t.jsxs)("span", {
                                                className: er,
                                                children: [
                                                  en(e.symbol)
                                                    ? (0, t.jsx)("span", {
                                                        className: "truncate",
                                                        children: en(e.symbol),
                                                      })
                                                    : null,
                                                  (0, t.jsx)("span", {
                                                    className: "shrink-0",
                                                    children: eF(
                                                      "home.bounties.coin_market_cap",
                                                      {
                                                        value: (0, g.f)(
                                                          e.usd_market_cap,
                                                        ),
                                                      },
                                                    ),
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    },
                                    e.mint,
                                  ),
                                ),
                              }),
                  }),
                ],
              });
        return (
          eB[62] !== t$ ||
          eB[63] !== eM ||
          eB[64] !== eR ||
          eB[65] !== eP ||
          eB[66] !== tW
            ? ((eO = (0, t.jsx)(t$, {
                open: eM,
                onOpenChange: eR,
                density: "comfortable",
                size: "md",
                title: eP,
                "data-testid": "create-callout-dialog",
                children: tW,
              })),
              (eB[62] = t$),
              (eB[63] = eM),
              (eB[64] = eR),
              (eB[65] = eP),
              (eB[66] = tW),
              (eB[67] = eO))
            : (eO = eB[67]),
          eO
        );
      },
    ],
    171840,
  );
};
