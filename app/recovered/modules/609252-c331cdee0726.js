// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    i = e.i(689943),
    r = e.i(369091),
    n = e.i(493025);
  e.s([
    "f",
    0,
    (e) => {
      let a,
        l,
        s,
        o,
        c,
        m,
        u,
        d,
        f,
        h,
        p,
        x,
        b,
        v = (0, t.c)(32);
      v[0] !== e
        ? (({
            mints: a,
            limit: s,
            offset: o,
            sort: c,
            order: m,
            includeNsfw: u,
            disabled: d,
            ...l
          } = e),
          (v[0] = e),
          (v[1] = a),
          (v[2] = l),
          (v[3] = s),
          (v[4] = o),
          (v[5] = c),
          (v[6] = m),
          (v[7] = u),
          (v[8] = d))
        : ((a = v[1]),
          (l = v[2]),
          (s = v[3]),
          (o = v[4]),
          (c = v[5]),
          (m = v[6]),
          (u = v[7]),
          (d = v[8]));
      let y = void 0 === s ? 50 : s,
        g = void 0 === o ? 0 : o,
        w = void 0 === c ? "market_cap" : c,
        N = void 0 === m ? "DESC" : m,
        _ = void 0 !== u && u,
        E = void 0 !== d && d,
        { ipfsPrefix: j } = (0, r.useIpfsPrefix)();
      v[9] !== E ||
      v[10] !== _ ||
      v[11] !== y ||
      v[12] !== g ||
      v[13] !== N ||
      v[14] !== l ||
      v[15] !== w
        ? ((f = {
            limit: y,
            offset: g,
            sort: w,
            order: N,
            includeNsfw: _,
            disabled: E,
            ...l,
          }),
          (v[9] = E),
          (v[10] = _),
          (v[11] = y),
          (v[12] = g),
          (v[13] = N),
          (v[14] = l),
          (v[15] = w),
          (v[16] = f))
        : (f = v[16]);
      let {
        data: C,
        isLoading: I,
        error: k,
        refetch: S,
        isError: T,
        isLoadingError: A,
      } = (0, i.V)(a, f);
      v[17] !== C
        ? ((h = void 0 === C ? [] : C), (v[17] = C), (v[18] = h))
        : (h = v[18]);
      let R = h;
      e: {
        let e;
        if (!R.length) {
          let e;
          (v[19] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = []), (v[19] = e))
            : (e = v[19]),
            (p = e));
          break e;
        }
        (v[20] !== j || v[21] !== R
          ? ((e = (0, n.f)(R, j)), (v[20] = j), (v[21] = R), (v[22] = e))
          : (e = v[22]),
          (p = e));
      }
      let F = p;
      v[23] !== k
        ? ((x = k ? (k instanceof Error ? k : Error(String(k))) : null),
          (v[23] = k),
          (v[24] = x))
        : (x = v[24]);
      let O = x;
      return (
        v[25] !== F ||
        v[26] !== O ||
        v[27] !== T ||
        v[28] !== A ||
        v[29] !== I ||
        v[30] !== S
          ? ((b = {
              coins: F,
              loading: I,
              error: O,
              refetch: S,
              isError: T,
              isLoadingError: A,
            }),
            (v[25] = F),
            (v[26] = O),
            (v[27] = T),
            (v[28] = A),
            (v[29] = I),
            (v[30] = S),
            (v[31] = b))
          : (b = v[31]),
        b
      );
    },
  ]);
};
