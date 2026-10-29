// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  Object.defineProperty(a, "__esModule", { value: !0 });
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
    r = o(e.r(304153)),
    i = e.r(352386),
    n = o(i);
  function o(e) {
    return e && e.__esModule ? e : { default: e };
  }
  var s = {
      bgColor: r.default.oneOfType([r.default.object, r.default.string])
        .isRequired,
      bgD: r.default.string.isRequired,
      fgColor: r.default.oneOfType([r.default.object, r.default.string])
        .isRequired,
      fgD: r.default.string.isRequired,
      size: r.default.number.isRequired,
      title: r.default.string,
      viewBoxSize: r.default.number.isRequired,
      xmlns: r.default.string,
    },
    c = (0, i.forwardRef)(function (e, t) {
      var a = e.bgColor,
        r = e.bgD,
        i = e.fgD,
        o = e.fgColor,
        s = e.size,
        c = e.title,
        u = e.viewBoxSize,
        d = e.xmlns,
        m = (function (e, t) {
          var a = {};
          for (var l in e)
            !(t.indexOf(l) >= 0) &&
              Object.prototype.hasOwnProperty.call(e, l) &&
              (a[l] = e[l]);
          return a;
        })(e, [
          "bgColor",
          "bgD",
          "fgD",
          "fgColor",
          "size",
          "title",
          "viewBoxSize",
          "xmlns",
        ]);
      return n.default.createElement(
        "svg",
        l({}, m, {
          height: s,
          ref: t,
          viewBox: "0 0 " + u + " " + u,
          width: s,
          xmlns: void 0 === d ? "http://www.w3.org/2000/svg" : d,
        }),
        c ? n.default.createElement("title", null, c) : null,
        n.default.createElement("path", { d: r, fill: a }),
        n.default.createElement("path", { d: i, fill: o }),
      );
    });
  ((c.displayName = "QRCodeSvg"), (c.propTypes = s), (a.default = c));
};
