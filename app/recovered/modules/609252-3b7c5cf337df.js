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
        o,
        s,
        l,
        d,
        c,
        u,
        m,
        f,
        b,
        p,
        h,
        w,
        v = (0, t.c)(32);
      v[0] !== e
        ? (({
            mints: a,
            limit: s,
            offset: l,
            sort: d,
            order: c,
            includeNsfw: u,
            disabled: m,
            ...o
          } = e),
          (v[0] = e),
          (v[1] = a),
          (v[2] = o),
          (v[3] = s),
          (v[4] = l),
          (v[5] = d),
          (v[6] = c),
          (v[7] = u),
          (v[8] = m))
        : ((a = v[1]),
          (o = v[2]),
          (s = v[3]),
          (l = v[4]),
          (d = v[5]),
          (c = v[6]),
          (u = v[7]),
          (m = v[8]));
      let g = void 0 === s ? 50 : s,
        y = void 0 === l ? 0 : l,
        x = void 0 === d ? "market_cap" : d,
        k = void 0 === c ? "DESC" : c,
        C = void 0 !== u && u,
        S = void 0 !== m && m,
        { ipfsPrefix: N } = (0, r.useIpfsPrefix)();
      v[9] !== S ||
      v[10] !== C ||
      v[11] !== g ||
      v[12] !== y ||
      v[13] !== k ||
      v[14] !== o ||
      v[15] !== x
        ? ((f = {
            limit: g,
            offset: y,
            sort: x,
            order: k,
            includeNsfw: C,
            disabled: S,
            ...o,
          }),
          (v[9] = S),
          (v[10] = C),
          (v[11] = g),
          (v[12] = y),
          (v[13] = k),
          (v[14] = o),
          (v[15] = x),
          (v[16] = f))
        : (f = v[16]);
      let {
        data: _,
        isLoading: j,
        error: P,
        refetch: E,
        isError: O,
        isLoadingError: T,
      } = (0, i.V)(a, f);
      v[17] !== _
        ? ((b = void 0 === _ ? [] : _), (v[17] = _), (v[18] = b))
        : (b = v[18]);
      let M = b;
      e: {
        let e;
        if (!M.length) {
          let e;
          (v[19] === Symbol.for("react.memo_cache_sentinel")
            ? ((e = []), (v[19] = e))
            : (e = v[19]),
            (p = e));
          break e;
        }
        (v[20] !== N || v[21] !== M
          ? ((e = (0, n.f)(M, N)), (v[20] = N), (v[21] = M), (v[22] = e))
          : (e = v[22]),
          (p = e));
      }
      let A = p;
      v[23] !== P
        ? ((h = P ? (P instanceof Error ? P : Error(String(P))) : null),
          (v[23] = P),
          (v[24] = h))
        : (h = v[24]);
      let F = h;
      return (
        v[25] !== A ||
        v[26] !== F ||
        v[27] !== O ||
        v[28] !== T ||
        v[29] !== j ||
        v[30] !== E
          ? ((w = {
              coins: A,
              loading: j,
              error: F,
              refetch: E,
              isError: O,
              isLoadingError: T,
            }),
            (v[25] = A),
            (v[26] = F),
            (v[27] = O),
            (v[28] = T),
            (v[29] = j),
            (v[30] = E),
            (v[31] = w))
          : (w = v[31]),
        w
      );
    },
  ]);
};
