// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  Object.defineProperty(n, "__esModule", { value: !0 });
  var r = {
    ESCAPE_REGEX: function () {
      return o;
    },
    htmlEscapeAttributeString: function () {
      return c;
    },
    htmlEscapeJsonString: function () {
      return u;
    },
  };
  for (var i in r) Object.defineProperty(n, i, { enumerable: !0, get: r[i] });
  let a = {
      "&": "\\u0026",
      ">": "\\u003e",
      "<": "\\u003c",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029",
    },
    o = /[&><\u2028\u2029]/g,
    l = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" },
    s = /[&"'<>]/g;
  function u(e) {
    return e.replace(o, (e) => a[e]);
  }
  function c(e) {
    return e.replace(s, (e) => l[e]);
  }
};
