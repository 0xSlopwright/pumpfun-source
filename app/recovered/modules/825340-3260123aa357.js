// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(747337),
    n = e.i(256617);
  let a = {
    "1000x-oracle": "legendary",
    "immortal-run": "legendary",
    "serial-winner": "legendary",
    "perfect-month": "epic",
    "podium-regular": "epic",
    "first-place": "epic",
    "second-place": "rare",
    "third-place": "rare",
    phoenix: "rare",
    veteran: "rare",
    "on-the-board": "common",
    "first-callout": "common",
  };
  e.s([
    "N",
    0,
    0.75,
    "w",
    0,
    {
      common: "#96A099",
      rare: "#00E676",
      epic: "#A78BFA",
      legendary: "#F5C451",
    },
    "g",
    0,
    (e) =>
      `${(0, t.M)({ id: `mobile-resources/achievements/v2/${e.id}`, variant: (0, n.l)({ width: 256, height: 256 }) })}&v=5`,
    "E",
    0,
    (e, t) => {
      let n = a[e.id];
      if (n) return n;
      let i = t ?? 4;
      return e.tier >= i
        ? "legendary"
        : e.tier === i - 1
          ? "epic"
          : 1 === e.tier
            ? "common"
            : "rare";
    },
    "J",
    0,
    (e) => {
      let t = new Map();
      for (let n of e) {
        if (null === n.metric) continue;
        let e = t.get(n.metric) ?? 0;
        n.tier > e && t.set(n.metric, n.tier);
      }
      return t;
    },
  ]);
};
