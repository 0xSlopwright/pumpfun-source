// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "D",
    0,
    6,
    "W",
    0,
    (e, t) => {
      if (null == e || !/^\d+$/.test(e) || !Number.isInteger(t) || t < 0)
        return null;
      let n = BigInt(e).toString(),
        r = n.length > t ? n.slice(0, -t || void 0) : "0",
        o = n.length > t ? n.slice(n.length - t) : n.padStart(t, "0"),
        l = Number(0 === t ? r : `${r}.${o}`);
      return Number.isFinite(l) && l > 0 ? l : null;
    },
  ]);
};
