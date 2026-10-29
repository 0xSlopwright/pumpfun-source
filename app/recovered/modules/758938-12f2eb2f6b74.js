// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242);
  e.i(353110);
  var r = e.i(648470),
    i = e.i(193509);
  e.i(70833);
  var n = e.i(328242),
    a = e.i(690877),
    l = e.i(759257);
  function o(e, t, r) {
    if (!r.ok) throw Error(`Failed to fetch params: ${r.statusText}`);
  }
  var u = e.i(255538),
    s = e.i(541710),
    m = e.i(646908),
    c = e.i(655397);
  let d = new Set(["complete", "completed", "graduated", "4", "5"]),
    f = new Set(["curve", "created", "launched", "1", "2"]);
  function b(e) {
    let t =
        "string" == typeof e.curve_phase || "number" == typeof e.curve_phase
          ? String(e.curve_phase).toLowerCase()
          : "",
      r = !0 === e.complete || d.has(t);
    if (r) return { progress: 100, isComplete: r };
    let i = f.has(t);
    if (null == e.progress_bps || "" === e.progress_bps)
      return i ? { progress: void 0, isComplete: r } : null;
    let n = Number(e.progress_bps);
    return Number.isFinite(n)
      ? { progress: Math.min(99.9, Math.max(0, n / 100)), isComplete: r }
      : i
        ? { progress: void 0, isComplete: r }
        : null;
  }
  function g(e, n) {
    let s,
      d,
      f,
      g,
      v,
      h,
      p,
      _,
      y,
      w = (0, t.c)(37),
      {
        bondingCurve: k,
        pool: S,
        poolAccountInfo: N,
        isHydrated: M,
        quoteTokenProgram: B,
      } = n,
      { initialBondingCurveParams: q } = ((e) => {
        let r,
          i,
          n,
          u,
          s = (0, t.c)(13);
        s[0] !== e
          ? ((r = async () => {
              if (!e) throw Error("Timestamp is required");
              return (0, l.j)()("GET /global-params/{timestamp}", {
                params: { timestamp: e },
                throwHttpErrors: !1,
                hooks: { afterResponse: [o] },
              });
            }),
            (s[0] = e),
            (s[1] = r))
          : (r = s[1]);
        let m = r;
        s[2] !== e
          ? ((i = ["bondingCurveParams", e]), (s[2] = e), (s[3] = i))
          : (i = s[3]);
        let c = !!e;
        s[4] !== m || s[5] !== i || s[6] !== c
          ? ((n = {
              queryKey: i,
              queryFn: m,
              enabled: c,
              staleTime: 6e4,
              gcTime: 3e5,
            }),
            (s[4] = m),
            (s[5] = i),
            (s[6] = c),
            (s[7] = n))
          : (n = s[7]);
        let {
          data: d,
          isLoading: f,
          error: b,
          refetch: g,
        } = (0, a.useQuery)(n);
        return (
          s[8] !== d || s[9] !== b || s[10] !== f || s[11] !== g
            ? ((u = {
                initialBondingCurveParams: d,
                fetchInitialBondingCurveParams: g,
                isLoading: f,
                error: b,
              }),
              (s[8] = d),
              (s[9] = b),
              (s[10] = f),
              (s[11] = g),
              (s[12] = u))
            : (u = s[12]),
          u
        );
      })(e?.created_timestamp);
    w[0] !== e
      ? ((s = null != e && (0, m.X)(e)), (w[0] = e), (w[1] = s))
      : (s = w[1]);
    let C = s;
    w[2] !== e
      ? ((d = e && (0, m.X)(e) ? b(e) : null), (w[2] = e), (w[3] = d))
      : (d = w[3]);
    let T = d,
      F = null != T && void 0 === T.progress;
    e: {
      let e;
      if (C) {
        f = T?.progress ?? 0;
        break e;
      }
      (w[4] !== k || w[5] !== q
        ? ((e = (function (e, t) {
            if (!e || !t) return 0;
            let { initial_real_token_reserves: n } = t,
              a = e?.realTokenReserves || new r.BN(n);
            return (0, i.J)({
              realTokenReserves: BigInt(a.toString()),
              initialRealTokenReserves: BigInt(String(Math.trunc(n))),
            });
          })(k, q)),
          (w[4] = k),
          (w[5] = q),
          (w[6] = e))
        : (e = w[6]),
        (f = e));
    }
    let P = f;
    w[7] !== k
      ? ((g = (k && k?.realQuoteReserves) || new r.BN(0)),
        (w[7] = k),
        (w[8] = g))
      : (g = w[8]);
    let $ = g;
    (w[9] !== k?.quoteMint || w[10] !== e
      ? ((v = () => k?.quoteMint ?? (0, c.H)(e)),
        (w[9] = k?.quoteMint),
        (w[10] = e),
        (w[11] = v))
      : (v = w[11]),
      k?.quoteMint,
      w[12] !== v ? ((h = v()), (w[12] = v), (w[13] = h)) : (h = w[13]));
    let E = h;
    e?.quote_decimals;
    let x = e?.quote_decimals;
    w[14] !== E || w[15] !== $ || w[16] !== x
      ? ((p = (0, c.U)($, E, x)),
        (w[14] = E),
        (w[15] = $),
        (w[16] = x),
        (w[17] = p))
      : (p = w[17]);
    let I = p,
      U = (0, u.f)(E);
    t: {
      let t;
      if (!e) {
        _ = !1;
        break t;
      }
      if (C) {
        _ = T?.isComplete ?? !1;
        break t;
      }
      (w[18] !== e || w[19] !== S || w[20] !== P
        ? ((t = P >= 100 || !!S || !!e?.raydium_pool),
          (w[18] = e),
          (w[19] = S),
          (w[20] = P),
          (w[21] = t))
        : (t = w[21]),
        (_ = t));
    }
    let R = _;
    if (!e) {
      let e;
      return (
        w[22] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = {
              bondingCurve: null,
              initialBondingCurveParams: null,
              pool: null,
              poolAccountInfo: null,
              progress: 0,
              realSolReserves: new r.BN(0),
              solInBondingCurve: 0,
              quoteSymbol: "SOL",
              isComplete: !1,
              hasCurve: !1,
              isHydrated: !1,
              quoteTokenProgram: null,
            }),
            (w[22] = e))
          : (e = w[22]),
        e
      );
    }
    let D = !C || null != T,
      L = !F && M;
    return (
      w[23] !== k ||
      w[24] !== E ||
      w[25] !== q ||
      w[26] !== R ||
      w[27] !== S ||
      w[28] !== N ||
      w[29] !== P ||
      w[30] !== U ||
      w[31] !== B ||
      w[32] !== $ ||
      w[33] !== I ||
      w[34] !== D ||
      w[35] !== L
        ? ((y = {
            bondingCurve: k,
            initialBondingCurveParams: q,
            pool: S,
            poolAccountInfo: N,
            progress: P,
            realSolReserves: $,
            solInBondingCurve: I,
            quoteSymbol: U,
            isComplete: R,
            hasCurve: D,
            isHydrated: L,
            quoteMint: E,
            quoteTokenProgram: B,
          }),
          (w[23] = k),
          (w[24] = E),
          (w[25] = q),
          (w[26] = R),
          (w[27] = S),
          (w[28] = N),
          (w[29] = P),
          (w[30] = U),
          (w[31] = B),
          (w[32] = $),
          (w[33] = I),
          (w[34] = D),
          (w[35] = L),
          (w[36] = y))
        : (y = w[36]),
      y
    );
  }
  e.s(
    [
      "u",
      0,
      (e) =>
        null == (0, s.T)(e.chain_id) || ((0, m._)(e.chain_id) && null != b(e)),
      "k",
      0,
      (e) => e?.data[124] === 1,
      "C",
      0,
      b,
      "K",
      0,
      function (e) {
        let t = (0, n.G)(
          e?.mint ?? "",
          e?.token_program,
          e?.quote_mint,
          e?.pool_address,
        );
        return g(e, t);
      },
      "e",
      0,
      function (e) {
        let t = (0, n.g)(
          e?.mint ?? "",
          e?.token_program,
          e?.quote_mint,
          e?.pool_address,
        );
        return g(e, t);
      },
    ],
    758938,
  );
};
