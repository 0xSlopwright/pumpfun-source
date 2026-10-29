// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (Object.defineProperty(a, "__esModule", { value: !0 }), (a.QRCode = void 0));
  var l =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var a = arguments[t];
          for (var l in a)
            Object.prototype.hasOwnProperty.call(a, l) && (e[l] = a[l]);
        }
        return e;
      },
    r = u(e.r(304153)),
    i = u(e.r(317330)),
    n = u(e.r(119113)),
    o = e.r(352386),
    s = u(o),
    c = u(e.r(150973));
  function u(e) {
    return e && e.__esModule ? e : { default: e };
  }
  var d = {
      bgColor: r.default.oneOfType([r.default.object, r.default.string]),
      fgColor: r.default.oneOfType([r.default.object, r.default.string]),
      level: r.default.string,
      size: r.default.number,
      value: r.default.string.isRequired,
    },
    m = (0, o.forwardRef)(function (e, t) {
      var a = e.bgColor,
        r = e.fgColor,
        o = e.level,
        u = e.size,
        d = e.value,
        m = (function (e, t) {
          var a = {};
          for (var l in e)
            !(t.indexOf(l) >= 0) &&
              Object.prototype.hasOwnProperty.call(e, l) &&
              (a[l] = e[l]);
          return a;
        })(e, ["bgColor", "fgColor", "level", "size", "value"]),
        f = new n.default(-1, i.default[void 0 === o ? "L" : o]);
      (f.addData(d), f.make());
      var p = f.modules;
      return s.default.createElement(
        c.default,
        l({}, m, {
          bgColor: void 0 === a ? "#FFFFFF" : a,
          bgD: p
            .map(function (e, t) {
              return e
                .map(function (e, a) {
                  return e ? "" : "M " + a + " " + t + " l 1 0 0 1 -1 0 Z";
                })
                .join(" ");
            })
            .join(" "),
          fgColor: void 0 === r ? "#000000" : r,
          fgD: p
            .map(function (e, t) {
              return e
                .map(function (e, a) {
                  return e ? "M " + a + " " + t + " l 1 0 0 1 -1 0 Z" : "";
                })
                .join(" ");
            })
            .join(" "),
          ref: t,
          size: void 0 === u ? 256 : u,
          viewBoxSize: p.length,
        }),
      );
    });
  ((a.QRCode = m),
    (m.displayName = "QRCode"),
    (m.propTypes = d),
    (a.default = m));
};
