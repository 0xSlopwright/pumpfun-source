// Complete original live-Cup landing/timeframe hook.
export function createLanding({
  useMemoCache,
  useState,
  useList,
  hasLiveCompetition,
}) {
  const t = { c: useMemoCache },
    l = { useState },
    a = { f: useList },
    n = { g: hasLiveCompetition };
  return (e, r, i) => {
    let s,
      o,
      d = (0, t.c)(4);
    d[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((s = { isVisible: !1 }), (d[0] = s))
      : (s = d[0]);
    let { data: u } = (0, a.f)(s),
      c = (0, n.g)(u, r) ? "cup" : e,
      [m, p] = (0, l.useState)(i ?? null),
      h = m ?? c;
    return (
      d[1] !== c || d[2] !== h
        ? ((o = { timeframe: h, landing: c, setTimeframe: p }),
          (d[1] = c),
          (d[2] = h),
          (d[3] = o))
        : (o = d[3]),
      o
    );
  };
}
