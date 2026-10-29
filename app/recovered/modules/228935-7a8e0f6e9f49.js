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
      let n = e < BigInt(0),
        r = (n ? -e : e).toString().padStart(t + 1, "0"),
        a = r.slice(0, r.length - t),
        s = r.slice(r.length - t),
        i = Number(`${n ? "-" : ""}${a}.${s}`);
      return Number.isFinite(i) ? i : 0;
    },
  ]);
};
