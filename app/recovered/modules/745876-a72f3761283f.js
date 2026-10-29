// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = ("u" > typeof JSON ? JSON : e.r(635400)).stringify,
    i = e.r(691037),
    o = e.r(625229),
    a = e.r(63366),
    s = e.r(795081),
    l = s("Array.prototype.join"),
    u = s("Array.prototype.indexOf"),
    d = s("Array.prototype.splice"),
    c = s("Array.prototype.sort"),
    f = function (e, t) {
      for (var r = "", n = 0; n < e; n += 1) r += t;
      return r;
    },
    h = function (e, t, r) {
      return r;
    };
  t.exports = function (e) {
    var t = arguments.length > 1 ? arguments[1] : void 0,
      r = (t && t.space) || "";
    "number" == typeof r && (r = f(r, " "));
    var s = !!t && "boolean" == typeof t.cycles && t.cycles,
      p = t && t.replacer ? a(t.replacer) : h;
    if (t && void 0 !== t.collapseEmpty && "boolean" != typeof t.collapseEmpty)
      throw TypeError("`collapseEmpty` must be a boolean, if provided");
    var g = !!t && t.collapseEmpty,
      b = "function" == typeof t ? t : t && t.cmp,
      m =
        b &&
        function (e) {
          var t =
            b.length > 2 &&
            function (t) {
              return e[t];
            };
          return function (r, n) {
            return b(
              { key: r, value: e[r] },
              { key: n, value: e[n] },
              t ? { __proto__: null, get: t } : void 0,
            );
          };
        },
      y = [];
    return (function e(t, a, h, b) {
      var w = r ? "\n" + f(b, r) : "",
        v = r ? ": " : ":";
      if (
        (h && h.toJSON && "function" == typeof h.toJSON && (h = h.toJSON()),
        void 0 !== (h = p(t, a, h)))
      ) {
        if ("object" != typeof h || null === h) return n(h);
        var _ = function (e, t) {
          return g && 0 === e.length
            ? t
            : ("[]" === t ? "[" : "{") +
                l(e, ",") +
                w +
                ("[]" === t ? "]" : "}");
        };
        if (i(h)) {
          for (var S = [], E = 0; E < h.length; E++) {
            var A = e(h, E, h[E], b + 1) || n(null);
            S[S.length] = w + r + A;
          }
          return _(S, "[]");
        }
        if (-1 !== u(y, h)) {
          if (s) return n("__cycle__");
          throw TypeError("Converting circular structure to JSON");
        }
        y[y.length] = h;
        for (var x = c(o(h), m && m(h)), S = [], E = 0; E < x.length; E++) {
          var a = x[E],
            M = e(h, a, h[a], b + 1);
          if (M) {
            var k = n(a) + v + M;
            S[S.length] = w + r + k;
          }
        }
        return (d(y, u(y, h), 1), _(S, "{}"));
      }
    })({ "": e }, "", e, 0);
  };
};
