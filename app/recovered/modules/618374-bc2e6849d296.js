// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(758938),
    i = e.i(824425),
    n = e.i(959719),
    a = e.i(575281),
    l = e.i(971370),
    o = e.i(690877),
    u = e.i(606933),
    s = e.i(352386),
    m = e.i(66961),
    c = e.i(520126),
    d = e.i(655397);
  let f = (e) => ["boost-vault-balance", e],
    b = (e) =>
      e && 0 !== e.data.length
        ? i.d.decode(new Uint8Array(e.data)).amount
        : BigInt(0);
  var g = e.i(291968),
    v = e.i(255538),
    h = e.i(646908),
    p = e.i(361317),
    _ = e.i(357171);
  e.s(
    [
      "f",
      0,
      function (e) {
        var i;
        let y,
          w,
          k,
          S,
          N,
          M,
          B,
          q,
          C,
          T,
          F,
          P,
          $,
          E,
          x,
          I,
          U,
          R,
          D = (0, t.c)(35),
          {
            bondingCurve: L,
            progress: A,
            isComplete: K,
            poolAccountInfo: O,
            solInBondingCurve: j,
            isHydrated: Q,
          } = (0, r.e)(e);
        D[0] !== e
          ? ((y = null != e && (0, h._)(e.chain_id)), (D[0] = e), (D[1] = y))
          : (y = D[1]);
        let H = y;
        D[2] !== e
          ? ((w = null != e && (0, h.B)(e.chain_id)), (D[2] = e), (D[3] = w))
          : (w = D[3]);
        let Z = w,
          V = null != e && H ? (0, r.C)(e) : null,
          J = H ? (V?.progress ?? 0) : A,
          z = H ? (V?.isComplete ?? !1) : K,
          X = H && null != V && void 0 === V.progress,
          {
            getFinalVirtualSolReserves: Y,
            getFinalUSDMarketCap: G,
            getFinalUSDMarketCapNumber: W,
            quoteUsdPrice: ee,
          } = (0, g.f)(e ?? void 0),
          et = e?.mint ?? "",
          er = e?.quote_mint,
          ei = e?.quote_decimals,
          en = e?.pool_address;
        D[4] !== et || D[5] !== er || D[6] !== ei || D[7] !== en
          ? ((k = {
              mint: et,
              quote_mint: er,
              quote_decimals: ei,
              pool_address: en,
            }),
            (D[4] = et),
            (D[5] = er),
            (D[6] = ei),
            (D[7] = en),
            (D[8] = k))
          : (k = D[8]);
        let { data: ea } = (function (e, r) {
          let i,
            g,
            v,
            h,
            p = (0, t.c)(16),
            { connection: _ } = (0, m.f)(),
            y = (0, u.useQueryClient)(),
            w = (0, d.k)((0, d.H)(e)),
            k = (0, d.Z)(w),
            { data: S, isError: N } = (0, o.useQuery)({
              queryKey: ["quote-mint-owner", w.toBase58()],
              queryFn: async () => {
                let e = _ ? await _.getAccountInfo(w) : null;
                if (!e) throw Error(`quote mint ${w.toBase58()} unreadable`);
                return {
                  owner: e.owner.toBase58(),
                  decimals: (0, a.g)(w, e, e.owner).decimals,
                };
              },
              enabled: k && !!_,
              staleTime: 1 / 0,
              retry: 2,
            }),
            M = k ? (S ? new l.PublicKey(S.owner) : null) : n.z,
            B = (0, c.c)(w, e.quote_decimals) ?? S?.decimals,
            q = (0, c.B)(e.mint, e.pool_address, w),
            C = q && M ? (0, c.p)(q, w, M) : null,
            T = C?.toBase58() ?? "",
            F = (r?.enabled ?? !0) && !!_ && (!!C || N),
            P = f(T);
          (p[0] !== C || p[1] !== _ || p[2] !== B
            ? ((i = async () => {
                if (!_ || !C || void 0 === B) return null;
                let e = await _.getAccountInfo(C);
                return e
                  ? { balanceRaw: b(e), exists: !0, decimals: B }
                  : { balanceRaw: BigInt(0), exists: !1, decimals: B };
              }),
              (p[0] = C),
              (p[1] = _),
              (p[2] = B),
              (p[3] = i))
            : (i = p[3]),
            p[4] !== F || p[5] !== P || p[6] !== i
              ? ((g = { queryKey: P, queryFn: i, enabled: F }),
                (p[4] = F),
                (p[5] = P),
                (p[6] = i),
                (p[7] = g))
              : (g = p[7]));
          let $ = (0, o.useQuery)(g);
          return (
            p[8] !== C ||
            p[9] !== T ||
            p[10] !== _ ||
            p[11] !== B ||
            p[12] !== F ||
            p[13] !== y
              ? ((v = () => {
                  if (!_ || !C || !F || void 0 === B) return;
                  let e = _.onAccountChange(C, (e) => {
                    let t =
                      0 === e.data.length
                        ? { balanceRaw: BigInt(0), exists: !1, decimals: B }
                        : { balanceRaw: b(e), exists: !0, decimals: B };
                    y.setQueryData(f(T), t);
                  });
                  return () => {
                    _.removeAccountChangeListener(e);
                  };
                }),
                (h = [_, C, T, F, B, y]),
                (p[8] = C),
                (p[9] = T),
                (p[10] = _),
                (p[11] = B),
                (p[12] = F),
                (p[13] = y),
                (p[14] = v),
                (p[15] = h))
              : ((v = p[14]), (h = p[15])),
            (0, s.useEffect)(v, h),
            $
          );
        })(k, { enabled: !!e && z && !H && !Z });
        D[9] !== e
          ? ((S = (0, d.k)((0, d.H)(e))), (D[9] = e), (D[10] = S))
          : (S = D[10]);
        let el = S,
          eo = (0, v.f)(el),
          eu = H || Z ? "" : eo,
          es = (0, p.Y)(O),
          em = !!O || !!e?.raydium_pool,
          ec = (0, d.N)(el, e?.quote_decimals) ?? ea?.decimals,
          ed =
            ((i = ea ?? null),
            (C = BigInt(0)),
            (F = (T = es ?? C) > C),
            (P = i?.exists ?? !1),
            ($ = i?.balanceRaw ?? C),
            (E = i?.decimals ?? ec),
            (I = (x = P ? T - $ : T) > C ? x : C),
            (U = F ? (0, _.c)((Number(I) / Number(T)) * 100) : 0),
            {
              wasBoosted: F,
              vaultExists: P,
              hasVaultBalance: $ > C,
              boostProgressPct: U,
              totalUi:
                void 0 === (R = void 0 === E ? void 0 : 10 ** E)
                  ? 0
                  : Number(T) / R,
              progressedUi: void 0 === R ? 0 : Number(I) / R,
              decimals: E,
            }),
          ef = (({
            isMigrated: e,
            canBoost: t,
            vaultExists: r,
            hasVaultBalance: i,
          }) => (e ? (t && r && i ? "boost" : "graduated") : "ungraduated"))({
            isMigrated: z,
            canBoost: ed.wasBoosted,
            vaultExists: ed.vaultExists,
            hasVaultBalance: ed.hasVaultBalance,
          }),
          eb = "ungraduated" === ef || ed.wasBoosted,
          eg = H ? null == V : !!e && Q && !L && !O && !e?.raydium_pool;
        D[11] !== Y || D[12] !== z || D[13] !== ec
          ? ((N = z || void 0 === ec ? 0 : Number(Y.toString()) / 10 ** ec),
            (D[11] = Y),
            (D[12] = z),
            (D[13] = ec),
            (D[14] = N))
          : (N = D[14]);
        let ev = N,
          eh = void 0 === ee ? null : ev * ee,
          ep = ed.boostProgressPct,
          e_ = ed.progressedUi,
          ey = ed.totalUi;
        (D[15] !== G ? ((M = G()), (D[15] = G), (D[16] = M)) : (M = D[16]),
          D[17] !== W ? ((B = W()), (D[17] = W), (D[18] = B)) : (B = D[18]));
        let ew = !H && !Z && !!e && (!Q || (z && (!em || void 0 === ea)));
        return (
          D[19] !== J ||
          D[20] !== eg ||
          D[21] !== X ||
          D[22] !== ef ||
          D[23] !== ed.boostProgressPct ||
          D[24] !== ed.progressedUi ||
          D[25] !== ed.totalUi ||
          D[26] !== eu ||
          D[27] !== ev ||
          D[28] !== eh ||
          D[29] !== eb ||
          D[30] !== j ||
          D[31] !== M ||
          D[32] !== B ||
          D[33] !== ew
            ? ((q = {
                phase: ef,
                gradProgress: J,
                boostProgressPct: ep,
                progressedUi: e_,
                totalUi: ey,
                quoteSymbol: eu,
                remainingToGraduateUi: ev,
                remainingToGraduateUsd: eh,
                finalUsdMarketCap: M,
                finalUsdMarketCapValue: B,
                solInBondingCurve: j,
                showProgressBar: eb,
                isOffCurve: eg,
                isLoading: ew,
                isCurvePending: X,
              }),
              (D[19] = J),
              (D[20] = eg),
              (D[21] = X),
              (D[22] = ef),
              (D[23] = ed.boostProgressPct),
              (D[24] = ed.progressedUi),
              (D[25] = ed.totalUi),
              (D[26] = eu),
              (D[27] = ev),
              (D[28] = eh),
              (D[29] = eb),
              (D[30] = j),
              (D[31] = M),
              (D[32] = B),
              (D[33] = ew),
              (D[34] = q))
            : (q = D[34]),
          q
        );
      },
    ],
    618374,
  );
};
