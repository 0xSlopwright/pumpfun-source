// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(352386),
    r = t.i(7284),
    n = t.i(871791),
    o = ["children", "className"];
  function i() {
    return (i = Object.assign.bind()).apply(this, arguments);
  }
  var a = e.default.forwardRef(function (t, a) {
    var u = t.children,
      c = t.className,
      l = (function (t, e) {
        if (null == t) return {};
        var r,
          n,
          o = (function (t, e) {
            if (null == t) return {};
            var r = {};
            for (var n in t)
              if (Object.prototype.hasOwnProperty.call(t, n)) {
                if (e.indexOf(n) >= 0) continue;
                r[n] = t[n];
              }
            return r;
          })(t, e);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t);
          for (n = 0; n < i.length; n++)
            ((r = i[n]),
              !(e.indexOf(r) >= 0) &&
                Object.prototype.propertyIsEnumerable.call(t, r) &&
                (o[r] = t[r]));
        }
        return o;
      })(t, o),
      s = (0, r.U)("recharts-layer", c);
    return e.default.createElement(
      "g",
      i({ className: s }, (0, n.T)(l, !0), { ref: a }),
      u,
    );
  });
  t.s(["f", 0, a]);
};
