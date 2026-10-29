// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = (e) => {
    let t = String(e);
    if (!Number.isFinite(e)) return t;
    let n = t.indexOf("e");
    if (-1 === n) return t;
    let r = Number(t.slice(n + 1));
    if (r < 0) {
      let a = t.slice(0, n),
        i = a.split(".")[1]?.length ?? 0;
      return e.toFixed(Math.min(100, -r + i));
    }
    return BigInt(e).toString();
  };
  e.s([
    "I",
    0,
    t,
    "a",
    0,
    ({ value: e, precision: n }) => {
      let r = e.toPrecision(n);
      return r.includes("e") ? t(Number(r)) : r;
    },
  ]);
};
