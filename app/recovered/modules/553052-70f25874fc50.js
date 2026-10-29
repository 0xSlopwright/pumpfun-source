// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = {
      consecutiveNetworkFailures: 0,
      lastFailureAt: null,
      lastSuccessAt: null,
    },
    n = (e, t) => {
      let n = e.filter((e) => t - e.at < 3e4);
      return n.length === e.length ? e : n;
    },
    r = (e, t) =>
      e.recentFailures.filter((e) => !e.backgroundChurn && t - e.at < 3e4),
    a = (e) => Array.from(new Set(e.map((e) => e.family))).sort();
  e.s([
    "d",
    0,
    ["swap-api"],
    "V",
    0,
    {
      shadow: "healthy",
      openedAt: null,
      closedAt: null,
      flapCount: 0,
      recentFailures: [],
      lastSuccessAt: null,
      families: {},
    },
    "b",
    0,
    r,
    "_",
    0,
    a,
    "r",
    0,
    (e, i, l = i.at) => {
      let o,
        s = n(e.recentFailures, l),
        u = s.some(
          (e) =>
            e.family === i.family &&
            e.backgroundChurn === i.backgroundChurn &&
            i.at - e.at < 2e3,
        )
          ? s
          : [...s, { ...i, kind: "network" }],
        c = e.families[i.family] ?? t,
        f = {
          ...e,
          recentFailures: u,
          families: {
            ...e.families,
            [i.family]: {
              ...c,
              consecutiveNetworkFailures: c.consecutiveNetworkFailures + 1,
              lastFailureAt: i.at,
            },
          },
        };
      if (
        "would-be-open" === f.shadow ||
        (o = r(f, l)).length < 3 ||
        !(a(o).length >= 2)
      )
        return f;
      let d = null !== e.closedAt && l - e.closedAt < 3e4;
      return {
        ...f,
        shadow: "would-be-open",
        openedAt: i.at,
        flapCount: d ? e.flapCount + 1 : e.flapCount,
      };
    },
    "y",
    0,
    (e, r, a) => {
      let i = e.families[r] ?? t,
        l = {
          ...e,
          recentFailures: n(e.recentFailures, a),
          lastSuccessAt: a,
          families: {
            ...e.families,
            [r]: { ...i, consecutiveNetworkFailures: 0, lastSuccessAt: a },
          },
        };
      return "would-be-open" !== e.shadow
        ? l
        : { ...l, shadow: "healthy", openedAt: null, closedAt: a };
    },
  ]);
};
