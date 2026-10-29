// Complete original tab hook and actual page fallback expressions.
export function createTab({ useMemoCache, parseEnum, useQueryState }) {
  const s = { c: useMemoCache },
    rd = { b: parseEnum, o: useQueryState },
    ro = { f: { LEADERBOARD: { TAB: "tab", PERIOD: "period" } } };
  let rc = ["traders", "squads", "rewards", "callouts"],
    ru = "traders";
  return {
    useTab: function () {
      let e,
        t,
        r,
        a = (0, s.c)(6);
      a[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = (0, rd.b)(rc)), (a[0] = e))
        : (e = a[0]);
      let [l, n] = (0, rd.o)(ro.f.LEADERBOARD.TAB, e);
      a[1] !== n
        ? ((t = (e) => {
            n(e === ru ? null : e);
          }),
          (a[1] = n),
          (a[2] = t))
        : (t = a[2]);
      let i = t;
      return (
        a[3] !== i || a[4] !== l
          ? ((r = { urlTab: l, setUrlTab: i }),
            (a[3] = i),
            (a[4] = l),
            (a[5] = r))
          : (r = a[5]),
        r
      );
    },
    resolveTab: ({ urlTab: q, squadsEnabled: P, isDesktop: $ }) => {
      let E = q ?? ru,
        R = ("squads" === E && !P) || ("callouts" === E && $) ? ru : E;
      return R;
    },
  };
}
