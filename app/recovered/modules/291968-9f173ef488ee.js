// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(149502);
  var t = e.i(445242),
    r = e.i(728141),
    i = e.i(424509);
  e.i(70833);
  var n = e.i(36629),
    a = e.i(328242),
    l = e.i(363250),
    o = e.i(646908);
  e.i(753134);
  var u = e.i(480133),
    s = e.i(655397);
  let m = (e) =>
      "number" == typeof e && Number.isFinite(e) && e > 0 ? e : void 0,
    c = (e) => (0, o.L)(e) || (0, o.B)(e) || (0, o._)(e);
  e.s([
    "f",
    0,
    (e) => {
      let o,
        d,
        f,
        b,
        g,
        v,
        h,
        p,
        _,
        y,
        w,
        k = (0, t.c)(50),
        { bondingCurve: S, mintAccount: N } = (0, a.g)(
          e?.mint ?? "",
          e?.token_program,
          e?.quote_mint,
          e?.pool_address,
        ),
        { global: M, feeConfig: B } = (0, n.f)();
      k[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((o = {}), (k[0] = o))
        : (o = k[0]);
      let { data: q } = (0, l.f)(o),
        C = void 0 === q ? 0 : q;
      (S?.quoteMint,
        k[1] !== S?.quoteMint || k[2] !== e
          ? ((d = S?.quoteMint ?? (0, s.H)(e)),
            (k[1] = S?.quoteMint),
            (k[2] = e),
            (k[3] = d))
          : (d = k[3]));
      let T = d,
        F = (0, s.N)(T, e?.quote_decimals),
        P = m(e?.market_cap_usd);
      e: {
        let e;
        if (!M) {
          let e;
          (k[4] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = new i.default(0)), (k[4] = e))
            : (e = k[4]),
            (f = e));
          break e;
        }
        if (!S) {
          let e;
          (k[5] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = new i.default(0)), (k[5] = e))
            : (e = k[5]),
            (f = e));
          break e;
        }
        if (!B) {
          let e;
          (k[6] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = new i.default(0)), (k[6] = e))
            : (e = k[6]),
            (f = e));
          break e;
        }
        if (!N) {
          let e;
          (k[7] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = new i.default(0)), (k[7] = e))
            : (e = k[7]),
            (f = e));
          break e;
        }
        (k[8] !== S || k[9] !== B || k[10] !== M || k[11] !== N
          ? ((e = (0, r.S)({
              global: M,
              bondingCurve: S,
              amount: S.realTokenReserves,
              feeConfig: B,
              mintSupply: N ? (0, u.B)(N) : null,
              quoteMint: (0, s.k)(S.quoteMint),
            })),
            (k[8] = S),
            (k[9] = B),
            (k[10] = M),
            (k[11] = N),
            (k[12] = e))
          : (e = k[12]),
          (f = e));
      }
      let $ = f;
      k[13] !== P ||
      k[14] !== S ||
      k[15] !== e?.chain_id ||
      k[16] !== e?.usd_market_cap ||
      k[17] !== M ||
      k[18] !== F ||
      k[19] !== T ||
      k[20] !== C
        ? ((b = () => {
            if (void 0 !== P) return P.toLocaleString("en-US");
            if (c(e?.chain_id)) {
              let t = m(e?.usd_market_cap);
              return void 0 === t ? "N/A" : t.toLocaleString("en-US");
            }
            if (!M || (0, s.Z)(T) || void 0 === F)
              return e?.usd_market_cap?.toLocaleString("en-US") || 0;
            let {
              virtualQuoteReserves: t,
              virtualTokenReserves: n,
              tokenTotalSupply: a,
            } = S || (0, r.g)(M);
            return n.eq(new i.default(0))
              ? e?.usd_market_cap?.toLocaleString("en-US") || 0
              : Number(
                  (
                    (a.mul(t).div(n).toNumber() / 10 ** F) *
                    ((0, s.w)(T) ? 1 : C)
                  ).toFixed(10),
                ).toLocaleString("en-US");
          }),
          (k[13] = P),
          (k[14] = S),
          (k[15] = e?.chain_id),
          (k[16] = e?.usd_market_cap),
          (k[17] = M),
          (k[18] = F),
          (k[19] = T),
          (k[20] = C),
          (k[21] = b))
        : (b = k[21]);
      let E = b;
      (k[22] !== P ||
      k[23] !== S ||
      k[24] !== e?.chain_id ||
      k[25] !== $ ||
      k[26] !== M ||
      k[27] !== F ||
      k[28] !== T ||
      k[29] !== C
        ? ((g = () => {
            if (!M || c(e?.chain_id)) return 0;
            let t = (0, s.Z)(T);
            if (t && !S) return 0;
            let {
                virtualQuoteReserves: n,
                virtualTokenReserves: a,
                tokenTotalSupply: l,
                realTokenReserves: o,
              } = S || (0, r.g)(M),
              u = n.add($),
              m = a.sub(o);
            return m.eq(new i.default(0))
              ? 0
              : t
                ? void 0 === P || n.isZero()
                  ? 0
                  : Number(
                      (
                        P *
                        (Number(u.mul(a).toString()) /
                          Number(m.mul(n).toString()))
                      ).toFixed(0),
                    )
                : void 0 === F
                  ? 0
                  : Number(
                      (
                        (l.mul(u).div(m).toNumber() / 10 ** F) *
                        ((0, s.w)(T) ? 1 : C)
                      ).toFixed(0),
                    );
          }),
          (k[22] = P),
          (k[23] = S),
          (k[24] = e?.chain_id),
          (k[25] = $),
          (k[26] = M),
          (k[27] = F),
          (k[28] = T),
          (k[29] = C),
          (k[30] = g))
        : (g = k[30]),
        e?.chain_id);
      let x = g();
      k[31] !== x
        ? ((v = x.toLocaleString("en-US")), (k[31] = x), (k[32] = v))
        : (v = k[32]);
      let I = v;
      t: {
        let e;
        if ((0, s.w)(T)) {
          h = 1;
          break t;
        }
        if (!(0, s.Z)(T)) {
          h = C;
          break t;
        }
        if (void 0 === P || !S || void 0 === F) {
          h = void 0;
          break t;
        }
        let {
          virtualQuoteReserves: t,
          virtualTokenReserves: r,
          tokenTotalSupply: i,
        } = S;
        if (r.isZero() || t.isZero()) {
          h = void 0;
          break t;
        }
        k[33] !== i || k[34] !== t || k[35] !== r
          ? ((e = i.mul(t).div(r).toString()),
            (k[33] = i),
            (k[34] = t),
            (k[35] = r),
            (k[36] = e))
          : (e = k[36]);
        let n = Number(e) / 10 ** F;
        h = n > 0 ? P / n : void 0;
      }
      let U = h;
      k[37] !== I ? ((p = () => I), (k[37] = I), (k[38] = p)) : (p = k[38]);
      let R = p;
      k[39] !== x ? ((_ = () => x), (k[39] = x), (k[40] = _)) : (_ = k[40]);
      let D = _;
      k[41] !== C
        ? ((y = () =>
            Number(
              ((0, s.h)(new i.default("200000000000")) * C).toFixed(0),
            ).toLocaleString("en-US")),
          (k[41] = C),
          (k[42] = y))
        : (y = k[42]);
      let L = y;
      return (
        k[43] !== $ ||
        k[44] !== R ||
        k[45] !== D ||
        k[46] !== L ||
        k[47] !== E ||
        k[48] !== U
          ? ((w = {
              getFinalVirtualSolReserves: $,
              getUSDMarketCap: E,
              getFinalUSDMarketCap: R,
              getFinalUSDMarketCapNumber: D,
              getKingOfTheHillMarketCap: L,
              quoteUsdPrice: U,
            }),
            (k[43] = $),
            (k[44] = R),
            (k[45] = D),
            (k[46] = L),
            (k[47] = E),
            (k[48] = U),
            (k[49] = w))
          : (w = k[49]),
        w
      );
    },
  ]);
};
