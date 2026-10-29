// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(843831),
    d = e.r(992956);
  ((f.assert = i),
    (f.toArray = d.toArray),
    (f.zero2 = d.zero2),
    (f.toHex = d.toHex),
    (f.encode = d.encode),
    (f.getNAF = function (e, t, f) {
      var r = Array(Math.max(e.bitLength(), f) + 1);
      for (a = 0; a < r.length; a += 1) r[a] = 0;
      var i = 1 << (t + 1),
        d = e.clone();
      for (a = 0; a < r.length; a++) {
        var a,
          n,
          c = d.andln(i - 1);
        (d.isOdd()
          ? ((n = c > (i >> 1) - 1 ? (i >> 1) - c : c), d.isubn(n))
          : (n = 0),
          (r[a] = n),
          d.iushrn(1));
      }
      return r;
    }),
    (f.getJSF = function (e, t) {
      var f = [[], []];
      ((e = e.clone()), (t = t.clone()));
      for (var r = 0, i = 0; e.cmpn(-r) > 0 || t.cmpn(-i) > 0; ) {
        var d,
          a,
          n,
          c = (e.andln(3) + r) & 3,
          h = (t.andln(3) + i) & 3;
        (3 === c && (c = -1),
          3 === h && (h = -1),
          (a =
            (1 & c) == 0
              ? 0
              : (3 == (d = (e.andln(7) + r) & 7) || 5 === d) && 2 === h
                ? -c
                : c),
          f[0].push(a),
          (n =
            (1 & h) == 0
              ? 0
              : (3 == (d = (t.andln(7) + i) & 7) || 5 === d) && 2 === c
                ? -h
                : h),
          f[1].push(n),
          2 * r === a + 1 && (r = 1 - r),
          2 * i === n + 1 && (i = 1 - i),
          e.iushrn(1),
          t.iushrn(1));
      }
      return f;
    }),
    (f.cachedProperty = function (e, t, f) {
      var r = "_" + t;
      e.prototype[t] = function () {
        return void 0 !== this[r] ? this[r] : (this[r] = f.call(this));
      };
    }),
    (f.parseBytes = function (e) {
      return "string" == typeof e ? f.toArray(e, "hex") : e;
    }),
    (f.intFromLE = function (e) {
      return new r(e, "hex", "le");
    }));
};
