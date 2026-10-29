// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(795081),
    n = t.r(280885)(/^\s*(?:function)?\*/),
    i = t.r(948163)(),
    a = t.r(211915),
    u = o("Object.prototype.toString"),
    p = o("Function.prototype.toString"),
    c = t.r(352021);
  r.exports = function (t) {
    if ("function" != typeof t) return !1;
    if (n(p(t))) return !0;
    if (!i) return "[object GeneratorFunction]" === u(t);
    if (!a) return !1;
    var r = c();
    return r && a(t) === r.prototype;
  };
};
