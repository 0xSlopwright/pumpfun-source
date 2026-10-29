// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = e.r(499534),
    i = Array.prototype.concat,
    o = Array.prototype.slice,
    a = (t.exports = function (e) {
      for (var t = [], r = 0, a = e.length; r < a; r++) {
        var s = e[r];
        n(s) ? (t = i.call(t, o.call(s))) : t.push(s);
      }
      return t;
    });
  a.wrap = function (e) {
    return function () {
      return e(a(arguments));
    };
  };
};
