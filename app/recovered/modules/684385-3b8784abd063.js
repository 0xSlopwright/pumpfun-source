// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    i = e.i(445242),
    r = e.i(322315),
    n = e.i(254010),
    a = e.i(453706),
    o = e.i(352386),
    s = e.i(78436),
    l = e.i(510757),
    d = e.i(329017);
  let c = (0, a.default)(
      () => e.A(643435).then((e) => e.UapiCoinHeaderSource),
      { loadableGenerated: { modules: [979895] }, ssr: !1 },
    ),
    u = (0, o.createContext)(null),
    m = (0, o.createContext)(null),
    f = m.Provider;
  function b() {
    let e = (0, o.useContext)(u);
    if (!e)
      throw Error("useCoinPageStatic must be used inside CoinPageProviders");
    return e;
  }
  e.s([
    "I",
    0,
    function (e) {
      let a,
        o,
        s = (0, i.c)(7),
        { value: l, children: d } = e,
        m = (0, n.k)(r.D.UAPI_STREAM_HEADER);
      return (
        s[0] !== m || s[1] !== l
          ? ((a =
              m && l.coin.mint
                ? (0, t.jsx)(c, { mint: l.coin.mint, chain: l.coin.chain_id })
                : null),
            (s[0] = m),
            (s[1] = l),
            (s[2] = a))
          : (a = s[2]),
        s[3] !== d || s[4] !== a || s[5] !== l
          ? ((o = (0, t.jsxs)(u.Provider, { value: l, children: [a, d] })),
            (s[3] = d),
            (s[4] = a),
            (s[5] = l),
            (s[6] = o))
          : (o = s[6]),
        o
      );
    },
    "Y",
    0,
    f,
    "i",
    0,
    (e = {}) =>
      (0, l.f)(() => ({
        selectedTab: "holders",
        showOverlay: !1,
        isOpen: !1,
        tradeSheetHeight: 0,
        ...e,
      })),
    "u",
    0,
    function () {
      let e,
        t = (0, i.c)(4),
        { coin: r, liveUsdMarketCap: n, liveWholeTokenSupply: a } = b();
      return (
        t[0] !== r || t[1] !== n || t[2] !== a
          ? ((e = { coin: r, liveUsdMarketCap: n, liveWholeTokenSupply: a }),
            (t[0] = r),
            (t[1] = n),
            (t[2] = a),
            (t[3] = e))
          : (e = t[3]),
        (0, d.n)(e)
      );
    },
    "Z",
    0,
    b,
    "a",
    0,
    function () {
      return (0, o.useContext)(u);
    },
    "V",
    0,
    function (e) {
      let t = (0, o.useContext)(m);
      if (!t)
        throw Error("useCoinPageUi must be used inside CoinPageProviders");
      return (0, s.f)(t, e);
    },
  ]);
};
