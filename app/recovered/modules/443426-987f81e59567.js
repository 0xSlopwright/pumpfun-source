// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  function n(e) {
    try {
      return JSON.stringify(e);
    } catch (e) {
      return '"[Circular]"';
    }
  }
  t.exports = function (e, t, r) {
    var i = (r && r.stringify) || n;
    if ("object" == typeof e && null !== e) {
      var o = t.length + 1;
      if (1 === o) return e;
      var s = Array(o);
      s[0] = i(e);
      for (var a = 1; a < o; a++) s[a] = i(t[a]);
      return s.join(" ");
    }
    if ("string" != typeof e) return e;
    var c = t.length;
    if (0 === c) return e;
    for (var l = "", u = 0, f = -1, h = (e && e.length) || 0, d = 0; d < h; ) {
      if (37 === e.charCodeAt(d) && d + 1 < h) {
        switch (((f = f > -1 ? f : 0), e.charCodeAt(d + 1))) {
          case 100:
          case 102:
            if (u >= c || null == t[u]) break;
            (f < d && (l += e.slice(f, d)),
              (l += Number(t[u])),
              (f = d + 2),
              d++);
            break;
          case 105:
            if (u >= c || null == t[u]) break;
            (f < d && (l += e.slice(f, d)),
              (l += Math.floor(Number(t[u]))),
              (f = d + 2),
              d++);
            break;
          case 79:
          case 111:
          case 106:
            if (u >= c || void 0 === t[u]) break;
            f < d && (l += e.slice(f, d));
            var p = typeof t[u];
            if ("string" === p) {
              ((l += "'" + t[u] + "'"), (f = d + 2), d++);
              break;
            }
            if ("function" === p) {
              ((l += t[u].name || "<anonymous>"), (f = d + 2), d++);
              break;
            }
            ((l += i(t[u])), (f = d + 2), d++);
            break;
          case 115:
            if (u >= c) break;
            (f < d && (l += e.slice(f, d)),
              (l += String(t[u])),
              (f = d + 2),
              d++);
            break;
          case 37:
            (f < d && (l += e.slice(f, d)), (l += "%"), (f = d + 2), d++, u--);
        }
        ++u;
      }
      ++d;
    }
    return -1 === f ? e : (f < h && (l += e.slice(f)), l);
  };
};
