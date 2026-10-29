// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.s(
    [
      "f",
      0,
      function (t, e) {
        for (
          var r = arguments.length, n = Array(r > 2 ? r - 2 : 0), o = 2;
          o < r;
          o++
        )
          n[o - 2] = arguments[o];
      },
    ],
    609094,
  );
  var e = t.i(352386),
    r = t.i(7284),
    n = t.i(871791),
    o = [
      "children",
      "width",
      "height",
      "viewBox",
      "className",
      "style",
      "title",
      "desc",
    ];
  function i() {
    return (i = Object.assign.bind()).apply(this, arguments);
  }
  t.s(
    [
      "f",
      0,
      function (t) {
        var a = t.children,
          u = t.width,
          c = t.height,
          l = t.viewBox,
          s = t.className,
          f = t.style,
          p = t.title,
          d = t.desc,
          h = (function (t, e) {
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
          y = l || { width: u, height: c, x: 0, y: 0 },
          v = (0, r.U)("recharts-surface", s);
        return e.default.createElement(
          "svg",
          i({}, (0, n.T)(h, !0, "svg"), {
            className: v,
            width: u,
            height: c,
            style: f,
            viewBox: ""
              .concat(y.x, " ")
              .concat(y.y, " ")
              .concat(y.width, " ")
              .concat(y.height),
          }),
          e.default.createElement("title", null, p),
          e.default.createElement("desc", null, d),
          a,
        );
      },
    ],
    236475,
  );
};
