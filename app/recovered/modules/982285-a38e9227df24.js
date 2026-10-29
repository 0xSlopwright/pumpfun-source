// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(445242),
    r = e.i(935258),
    n = e.i(606933),
    i = e.i(352386);
  let l = [];
  var a = e.i(211670);
  function u(e) {
    return [...e].sort();
  }
  function s(e) {
    return e.data;
  }
  function o(e) {
    return e.dataUpdatedAt;
  }
  function c(e) {
    return e.isFetching;
  }
  function d(e) {
    return e.isLoading;
  }
  function m(e) {
    return e.isFetching;
  }
  function f(e) {
    return e.isError;
  }
  function g(e) {
    return e.error;
  }
  function p(e) {
    return e.refetch();
  }
  function h(e) {
    return {
      entries: e.map(s),
      dataUpdatedAt: e.map(o),
      fetching: e.map(c),
      isLoading: e.some(d),
      isFetching: e.some(m),
      isError: e.some(f),
      error: e.find(g)?.error ?? null,
      refetch: () => Promise.all(e.map(p)),
    };
  }
  function b(e) {
    return e ?? [];
  }
  e.s(
    [
      "f",
      0,
      (e) => {
        let s,
          o,
          c,
          d,
          m,
          f,
          g,
          p,
          v,
          y,
          w,
          C,
          U,
          A,
          S = (0, t.c)(41),
          { wallet: $, mints: R, enabled: k } = e,
          I = void 0 === k || k,
          E = (0, n.useQueryClient)(),
          N =
            ((A = (0, i.useRef)(l)),
            (0, i.useMemo)(() => {
              let e = ((e, t) => {
                let r = new Set();
                for (let e of t) e && r.add(e);
                let n = [],
                  i = !1;
                for (let t of e) {
                  let e = !1;
                  for (let n of t) r.delete(n) && (e = !0);
                  e ? n.push(t) : (i = !0);
                }
                return (
                  r.size > 0 && (n.push(Array.from(r)), (i = !0)),
                  i ? n : e
                );
              })(A.current, R);
              return ((A.current = e), e);
            }, [R]));
        S[0] !== N ? ((s = N.map(u)), (S[0] = N), (S[1] = s)) : (s = S[1]);
        let F = s;
        if (S[2] !== F || S[3] !== $) {
          let e;
          (S[5] !== $
            ? ((e = (e) => `${$}|${e.join(",")}`), (S[5] = $), (S[6] = e))
            : (e = S[6]),
            (o = F.map(e)),
            (S[2] = F),
            (S[3] = $),
            (S[4] = o));
        } else o = S[4];
        let B = o;
        if (S[7] !== I || S[8] !== F || S[9] !== $) {
          let e;
          (S[11] !== I || S[12] !== $
            ? ((e = (e) => ({
                queryKey: a.V.batch($, e),
                queryFn: () => (0, a.Z)({ wallet: $, mints: e }),
                enabled: I && !!$ && e.length > 0,
                staleTime: 6e4,
              })),
              (S[11] = I),
              (S[12] = $),
              (S[13] = e))
            : (e = S[13]),
            (c = F.map(e)),
            (S[7] = I),
            (S[8] = F),
            (S[9] = $),
            (S[10] = c));
        } else c = S[10];
        S[14] !== c
          ? ((d = { queries: c, combine: h }), (S[14] = c), (S[15] = d))
          : (d = S[15]);
        let x = (0, r.f)(d);
        S[16] !== x.entries
          ? ((m = x.entries.flatMap(b)), (S[16] = x.entries), (S[17] = m))
          : (m = S[17]);
        let _ = m;
        if (S[18] !== _) {
          for (let e of ((f = new Map()), _)) f.set(e.mint, e);
          ((S[18] = _), (S[19] = f));
        } else f = S[19];
        let M = f;
        S[20] === Symbol.for("react.memo_cache_sentinel")
          ? ((g = new Map()), (S[20] = g))
          : (g = S[20]);
        let V = (0, i.useRef)(g);
        S[21] === Symbol.for("react.memo_cache_sentinel")
          ? ((p = new Map()), (S[21] = p))
          : (p = S[21]);
        let O = (0, i.useRef)(p),
          { fetching: T } = x;
        (S[22] !== B || S[23] !== T
          ? ((y = () => {
              T.forEach((e, t) => {
                let r = B[t];
                (e && !O.current.get(r) && V.current.set(r, Date.now()),
                  O.current.set(r, e));
              });
            }),
            (v = [T, B]),
            (S[22] = B),
            (S[23] = T),
            (S[24] = v),
            (S[25] = y))
          : ((v = S[24]), (y = S[25])),
          (0, i.useEffect)(y, v));
        let { entries: j, dataUpdatedAt: L } = x;
        return (
          S[26] !== B ||
          S[27] !== L ||
          S[28] !== j ||
          S[29] !== E ||
          S[30] !== $
            ? ((w = () => {
                $ &&
                  j.forEach((e, t) => {
                    if (!e) return;
                    let r = V.current.get(B[t]) || L[t];
                    for (let t of e) {
                      if (!t.unrealized || !(t.unrealized.amount_held > 0))
                        continue;
                      let e = a.V.token($, t.mint),
                        n = E.getQueryState(e);
                      (!n || n.dataUpdatedAt <= r) &&
                        E.setQueryData(e, (0, a.B)(t));
                    }
                  });
              }),
              (C = [$, j, L, B, E]),
              (S[26] = B),
              (S[27] = L),
              (S[28] = j),
              (S[29] = E),
              (S[30] = $),
              (S[31] = w),
              (S[32] = C))
            : ((w = S[31]), (C = S[32])),
          (0, i.useEffect)(w, C),
          S[33] !== M ||
          S[34] !== x.error ||
          S[35] !== x.isError ||
          S[36] !== x.isFetching ||
          S[37] !== x.isLoading ||
          S[38] !== x.refetch ||
          S[39] !== _
            ? ((U = {
                byMint: M,
                data: _,
                isLoading: x.isLoading,
                isFetching: x.isFetching,
                isError: x.isError,
                error: x.error,
                refetch: x.refetch,
              }),
              (S[33] = M),
              (S[34] = x.error),
              (S[35] = x.isError),
              (S[36] = x.isFetching),
              (S[37] = x.isLoading),
              (S[38] = x.refetch),
              (S[39] = _),
              (S[40] = U))
            : (U = S[40]),
          U
        );
      },
    ],
    982285,
  );
};
