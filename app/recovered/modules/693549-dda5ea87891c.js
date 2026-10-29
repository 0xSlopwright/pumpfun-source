// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(343473),
    n = t.r(533308),
    i = t.r(425311)(),
    a = t.r(83585),
    u = t.r(231473),
    p = o("%Math.floor%");
  r.exports = function (t, r) {
    if ("function" != typeof t) throw new u("`fn` is not a function");
    if ("number" != typeof r || r < 0 || r > 0xffffffff || p(r) !== r)
      throw new u("`length` must be a positive 32-bit integer");
    var e = arguments.length > 2 && !!arguments[2],
      o = !0,
      c = !0;
    if ("length" in t && a) {
      var y = a(t, "length");
      (y && !y.configurable && (o = !1), y && !y.writable && (c = !1));
    }
    return (
      (o || c || !e) && (i ? n(t, "length", r, !0, !0) : n(t, "length", r)),
      t
    );
  };
};
