// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  t.exports = function e(t) {
    if ("number" == typeof t && isNaN(t)) throw Error("NaN is not allowed");
    if ("number" == typeof t && !isFinite(t))
      throw Error("Infinity is not allowed");
    if (null === t || "object" != typeof t) return JSON.stringify(t);
    if (t.toJSON instanceof Function) return e(t.toJSON());
    if (Array.isArray(t)) {
      let r = t.reduce(
        (t, r, i) =>
          `${t}${0 === i ? "" : ","}${e(void 0 === r || "symbol" == typeof r ? null : r)}`,
        "",
      );
      return `[${r}]`;
    }
    let r = Object.keys(t)
      .sort()
      .reduce((r, i) => {
        if (void 0 === t[i] || "symbol" == typeof t[i]) return r;
        let a = 0 === r.length ? "" : ",";
        return `${r}${a}${e(i)}:${e(t[i])}`;
      }, "");
    return `{${r}}`;
  };
};
