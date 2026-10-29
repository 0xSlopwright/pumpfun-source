// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "J",
    0,
    (e) => {
      let { realTokenReserves: t, initialRealTokenReserves: r } = e;
      if (r <= BigInt(0)) return 0;
      let i = BigInt(100),
        n = Number(i - (t * i) / r);
      return !Number.isFinite(n) || n < 0 ? 0 : n > 100 ? 100 : n;
    },
    "P",
    0,
    (e) => {
      if (null == e) return null;
      try {
        let t = "number" == typeof e ? Math.floor(e).toString() : e;
        if (!t || !/^\d+$/.test(t)) return null;
        return BigInt(t);
      } catch {
        return null;
      }
    },
  ]);
};
