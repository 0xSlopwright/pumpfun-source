// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (e, t) {
      if (e === BigInt(0)) return 0;
      if (t <= 0) {
        let t = Number(e);
        return Number.isFinite(t) ? t : 0;
      }
      let a = e < BigInt(0),
        s = (a ? -e : e).toString().padStart(t + 1, "0"),
        l = s.slice(0, s.length - t),
        n = s.slice(s.length - t),
        i = Number(`${a ? "-" : ""}${l}.${n}`);
      return Number.isFinite(i) ? i : 0;
    },
  ]);
};
