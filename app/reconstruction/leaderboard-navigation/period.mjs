// Complete original period hook and link builder.
export function createPeriod({ useMemoCache, parseEnum, useQueryState }) {
  const t = { c: useMemoCache },
    r = { b: parseEnum, o: useQueryState },
    l = { N: "cup" },
    i = { f: { LEADERBOARD: { TAB: "tab", PERIOD: "period" } } };
  let a = ["daily", "weekly", "monthly", l.N];
  return {
    usePeriod: function () {
      let e,
        l,
        n,
        s = (0, t.c)(6);
      s[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = (0, r.b)(a)), (s[0] = e))
        : (e = s[0]);
      let [o, d] = (0, r.o)(i.f.LEADERBOARD.PERIOD, e);
      s[1] !== d
        ? ((l = (e) => {
            d(e);
          }),
          (s[1] = d),
          (s[2] = l))
        : (l = s[2]);
      let u = l;
      return (
        s[3] !== u || s[4] !== o
          ? ((n = { urlPeriod: o, setUrlPeriod: u }),
            (s[3] = u),
            (s[4] = o),
            (s[5] = n))
          : (n = s[5]),
        n
      );
    },
    periodHref: (e) => `/leaderboard?${i.f.LEADERBOARD.PERIOD}=${e}`,
  };
}
