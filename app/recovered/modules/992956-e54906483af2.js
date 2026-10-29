// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  function r(e) {
    return 1 === e.length ? "0" + e : e;
  }
  function i(e) {
    for (var t = "", f = 0; f < e.length; f++) t += r(e[f].toString(16));
    return t;
  }
  ((f.toArray = function (e, t) {
    if (Array.isArray(e)) return e.slice();
    if (!e) return [];
    var f = [];
    if ("string" != typeof e) {
      for (var r = 0; r < e.length; r++) f[r] = 0 | e[r];
      return f;
    }
    if ("hex" === t) {
      (e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
      for (var r = 0; r < e.length; r += 2)
        f.push(parseInt(e[r] + e[r + 1], 16));
    } else
      for (var r = 0; r < e.length; r++) {
        var i = e.charCodeAt(r),
          d = i >> 8,
          a = 255 & i;
        d ? f.push(d, a) : f.push(a);
      }
    return f;
  }),
    (f.zero2 = r),
    (f.toHex = i),
    (f.encode = function (e, t) {
      return "hex" === t ? i(e) : e;
    }));
};
