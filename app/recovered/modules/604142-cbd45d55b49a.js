// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function t(e) {
    if (!e) return { max: null, label: "winners TBD" };
    switch (e.type) {
      case "ONE_WINNER":
        return { max: 1, label: "1 winner" };
      case "DIVIDE_ACROSS_FIRST_X_VALID_SUBMISSIONS": {
        let t = e.firstXValidSubmissionsCount;
        return { max: t, label: 1 === t ? "1 winner" : `up to ${t} winners` };
      }
      case "DIVIDE_ACROSS_ALL_SUBMISSIONS":
        return { max: null, label: "all submissions" };
    }
  }
  let r = (e) => {
    try {
      return BigInt(e) > BigInt(0);
    } catch {
      return !1;
    }
  };
  e.s([
    "d",
    0,
    5,
    "z",
    0,
    function (e) {
      if (!e?.awards.length) return 0;
      let t = new Set();
      for (let n of e.awards) r(n.amountAtomic) && t.add(n.submissionId);
      return t.size;
    },
    "Z",
    0,
    function ({ rewardDistribution: e, pickedWinners: r }) {
      let n = t(e);
      if (!e)
        return {
          max: null,
          picked: r,
          allPicked: !1,
          overPicked: !1,
          label: n.label,
          tone: "empty",
        };
      if (null === n.max)
        return {
          max: null,
          picked: r,
          allPicked: !1,
          overPicked: !1,
          label: n.label,
          tone: "info",
        };
      let i = r > n.max,
        s = r === n.max;
      return {
        max: n.max,
        picked: r,
        allPicked: s,
        overPicked: i,
        label: `${r}/${n.max} winners`,
        tone: i ? "over" : s ? "complete" : r > 0 ? "partial" : "empty",
      };
    },
    "m",
    0,
    t,
    "w",
    0,
    function (e) {
      let { max: r } = t(e);
      return 5 * (r ?? 1);
    },
    "u",
    0,
    function (e) {
      return !!e?.noteMarkdown?.trim();
    },
  ]);
};
