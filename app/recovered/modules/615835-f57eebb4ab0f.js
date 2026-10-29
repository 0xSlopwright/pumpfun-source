// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(352386);
  e.i(12692);
  var a = e.i(398902),
    n = e.i(63289),
    l = e.i(79631),
    s = e.i(193504),
    o = e.i(595673),
    d = e.i(616299),
    u = e.i(711454),
    c = e.i(154121);
  function m(e) {
    let a,
      n,
      l,
      s,
      c = (0, i.c)(11),
      { data: m, sourceElement: h, onClose: f } = e,
      { shareType: g, openSource: p } = (0, u.p)(m.holder.address, h),
      y = (0, r.useRef)(!1);
    return (
      c[0] !== m.mint || c[1] !== p || c[2] !== g
        ? ((a = () => {
            y.current ||
              ((y.current = !0),
              (0, o.EN)({ shareType: g, mint: m.mint, source: p }));
          }),
          (n = [g, m.mint, p]),
          (c[0] = m.mint),
          (c[1] = p),
          (c[2] = g),
          (c[3] = a),
          (c[4] = n))
        : ((a = c[3]), (n = c[4])),
      (0, r.useEffect)(a, n),
      c[5] !== f
        ? ((l = (e) => {
            e || f();
          }),
          (c[5] = f),
          (c[6] = l))
        : (l = c[6]),
      c[7] !== m || c[8] !== g || c[9] !== l
        ? ((s = (0, t.jsx)(d.f, {
            data: m,
            shareType: g,
            open: !0,
            onOpenChange: l,
          })),
          (c[7] = m),
          (c[8] = g),
          (c[9] = l),
          (c[10] = s))
        : (s = c[10]),
      s
    );
  }
  function h(e) {
    let o,
      d,
      u,
      h,
      f,
      g,
      p,
      y,
      w,
      x = (0, i.c)(23),
      { coin: v, holderAddress: E, sourceElement: _, onClose: b } = e,
      { t: L } = (0, a.f)();
    (x[0] !== v.mint
      ? ((o = [v.mint]), (x[0] = v.mint), (x[1] = o))
      : (o = x[1]),
      x[2] !== E || x[3] !== o
        ? ((d = { userId: E, mints: o }), (x[2] = E), (x[3] = o), (x[4] = d))
        : (d = x[4]));
    let { summaryFor: A, isLoading: M, isError: j, refetch: P } = (0, l._)(d),
      k = (0, r.useRef)(!1);
    (x[5] !== P
      ? ((u = () => {
          k.current || ((k.current = !0), P());
        }),
        (h = [P]),
        (x[5] = P),
        (x[6] = u),
        (x[7] = h))
      : ((u = x[6]), (h = x[7])),
      (0, r.useEffect)(u, h),
      x[8] !== E ? ((f = { address: E }), (x[8] = E), (x[9] = f)) : (f = x[9]));
    let N = (0, c.f)(f);
    x[10] !== v || x[11] !== N || x[12] !== A
      ? ((g = N
          ? (0, s.D)({
              mint: v.mint,
              coin: v,
              coinName: v.name,
              coinSymbol: v.symbol,
              coinImageUri: v.image_uri ?? null,
              summary: A(v.mint),
              holder: N,
            })
          : null),
        (x[10] = v),
        (x[11] = N),
        (x[12] = A),
        (x[13] = g))
      : (g = x[13]);
    let S = g,
      I = null == S && !M && (j || null != N);
    return (x[14] !== I || x[15] !== b || x[16] !== L
      ? ((p = () => {
          I &&
            (n.c.error(L("profile.external_wallet.no_position_history")), b());
        }),
        (y = [I, b, L]),
        (x[14] = I),
        (x[15] = b),
        (x[16] = L),
        (x[17] = p),
        (x[18] = y))
      : ((p = x[17]), (y = x[18])),
    (0, r.useEffect)(p, y),
    S)
      ? (x[19] !== S || x[20] !== b || x[21] !== _
          ? ((w = (0, t.jsx)(m, { data: S, sourceElement: _, onClose: b })),
            (x[19] = S),
            (x[20] = b),
            (x[21] = _),
            (x[22] = w))
          : (w = x[22]),
        w)
      : null;
  }
  e.s([
    "PositionPnlShareSheet",
    0,
    function (e) {
      let r,
        a = (0, i.c)(7),
        { request: n, onClose: l } = e;
      return (
        a[0] !== l ||
        a[1] !== n.coin ||
        a[2] !== n.data ||
        a[3] !== n.holderAddress ||
        a[4] !== n.kind ||
        a[5] !== n.sourceElement
          ? ((r =
              "data" === n.kind
                ? (0, t.jsx)(m, {
                    data: n.data,
                    sourceElement: n.sourceElement,
                    onClose: l,
                  })
                : (0, t.jsx)(h, {
                    coin: n.coin,
                    holderAddress: n.holderAddress,
                    sourceElement: n.sourceElement,
                    onClose: l,
                  })),
            (a[0] = l),
            (a[1] = n.coin),
            (a[2] = n.data),
            (a[3] = n.holderAddress),
            (a[4] = n.kind),
            (a[5] = n.sourceElement),
            (a[6] = r))
          : (r = a[6]),
        r
      );
    },
  ]);
};
