// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(375194),
    r = t.i(180793),
    n = t.i(989089),
    o = t.i(462931),
    i = t.i(878524),
    a = t.i(352386),
    u = t.i(87683),
    c = t.i(756438),
    l = t.i(923763),
    s = t.i(49647),
    f = ["children"],
    p = ["children"];
  function d(t, e) {
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
  }
  function h(t) {
    return (h =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(t);
  }
  var y = {
      click: "onClick",
      mousedown: "onMouseDown",
      mouseup: "onMouseUp",
      mouseover: "onMouseOver",
      mousemove: "onMouseMove",
      mouseout: "onMouseOut",
      mouseenter: "onMouseEnter",
      mouseleave: "onMouseLeave",
      touchcancel: "onTouchCancel",
      touchend: "onTouchEnd",
      touchmove: "onTouchMove",
      touchstart: "onTouchStart",
      contextmenu: "onContextMenu",
      dblclick: "onDoubleClick",
    },
    v = function (t) {
      return "string" == typeof t
        ? t
        : t
          ? t.displayName || t.name || "Component"
          : "";
    },
    m = null,
    b = null,
    g = function t(e) {
      if (e === m && Array.isArray(b)) return b;
      var n = [];
      return (
        a.Children.forEach(e, function (e) {
          (0, r.default)(e) ||
            ((0, u.isFragment)(e)
              ? (n = n.concat(t(e.props.children)))
              : n.push(e));
        }),
        (b = n),
        (m = e),
        n
      );
    };
  function x(t, r) {
    var n = [],
      o = [];
    return (
      (o = Array.isArray(r)
        ? r.map(function (t) {
            return v(t);
          })
        : [v(r)]),
      g(t).forEach(function (t) {
        var r =
          (0, e.default)(t, "type.displayName") ||
          (0, e.default)(t, "type.name");
        -1 !== o.indexOf(r) && n.push(t);
      }),
      n
    );
  }
  var O = [
      "a",
      "altGlyph",
      "altGlyphDef",
      "altGlyphItem",
      "animate",
      "animateColor",
      "animateMotion",
      "animateTransform",
      "circle",
      "clipPath",
      "color-profile",
      "cursor",
      "defs",
      "desc",
      "ellipse",
      "feBlend",
      "feColormatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "filter",
      "font",
      "font-face",
      "font-face-format",
      "font-face-name",
      "font-face-url",
      "foreignObject",
      "g",
      "glyph",
      "glyphRef",
      "hkern",
      "image",
      "line",
      "lineGradient",
      "marker",
      "mask",
      "metadata",
      "missing-glyph",
      "mpath",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialGradient",
      "rect",
      "script",
      "set",
      "stop",
      "style",
      "svg",
      "switch",
      "symbol",
      "text",
      "textPath",
      "title",
      "tref",
      "tspan",
      "use",
      "view",
      "vkern",
    ],
    w = function (t, e, r, n) {
      var i,
        a =
          null != (i = null === s.P || void 0 === s.P ? void 0 : s.P[n])
            ? i
            : [];
      return (
        e.startsWith("data-") ||
        (!(0, o.default)(t) && ((n && a.includes(e)) || s.d.includes(e))) ||
        (r && s.X.includes(e))
      );
    },
    j = function t(e, r) {
      if (e === r) return !0;
      var n = a.Children.count(e);
      if (n !== a.Children.count(r)) return !1;
      if (0 === n) return !0;
      if (1 === n)
        return S(Array.isArray(e) ? e[0] : e, Array.isArray(r) ? r[0] : r);
      for (var o = 0; o < n; o++) {
        var i = e[o],
          u = r[o];
        if (Array.isArray(i) || Array.isArray(u)) {
          if (!t(i, u)) return !1;
        } else if (!S(i, u)) return !1;
      }
      return !0;
    },
    S = function (t, e) {
      if ((0, r.default)(t) && (0, r.default)(e)) return !0;
      if (!(0, r.default)(t) && !(0, r.default)(e)) {
        var n = t.props || {},
          o = n.children,
          i = d(n, f),
          a = e.props || {},
          u = a.children,
          c = d(a, p);
        if (o && u) return (0, l.f)(i, c) && j(o, u);
        if (!o && !u) return (0, l.f)(i, c);
      }
      return !1;
    };
  t.s([
    "T",
    0,
    function (t, e, r) {
      if (!t || "function" == typeof t || "boolean" == typeof t) return null;
      var n = t;
      if (((0, a.isValidElement)(t) && (n = t.props), !(0, i.default)(n)))
        return null;
      var o = {};
      return (
        Object.keys(n).forEach(function (t) {
          var i;
          w(null == (i = n) ? void 0 : i[t], t, e, r) && (o[t] = n[t]);
        }),
        o
      );
    },
    "M",
    0,
    x,
    "m",
    0,
    function (t, e) {
      var r = x(t, e);
      return r && r[0];
    },
    "d",
    0,
    v,
    "g",
    0,
    function (t) {
      var e = t && t.type;
      return e && y[e] ? y[e] : null;
    },
    "b",
    0,
    function (t) {
      return t && "object" === h(t) && "clipDot" in t;
    },
    "N",
    0,
    j,
    "X",
    0,
    function (t, e) {
      return g(e).indexOf(t);
    },
    "W",
    0,
    function (t, e) {
      var r = [],
        o = {};
      return (
        g(t).forEach(function (t, i) {
          if (t && t.type && (0, n.default)(t.type) && O.indexOf(t.type) >= 0)
            r.push(t);
          else if (t) {
            var a = v(t.type),
              u = e[a] || {},
              c = u.handler,
              l = u.once;
            if (c && (!l || !o[a])) {
              var s = c(t, a, i);
              (r.push(s), (o[a] = !0));
            }
          }
        }),
        r
      );
    },
    "J",
    0,
    function (t) {
      if (!t || !t.props) return !1;
      var e = t.props,
        r = e.width,
        n = e.height;
      return !!(0, c.H)(r) && !(r <= 0) && !!(0, c.H)(n) && !(n <= 0);
    },
  ]);
};
