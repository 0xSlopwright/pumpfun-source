// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n,
    i,
    o,
    a = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "	",
    };
  function s(e) {
    throw { name: "SyntaxError", message: e, at: n, text: o };
  }
  function l(e) {
    return (
      e && e !== i && s("Expected '" + e + "' instead of '" + i + "'"),
      (i = o.charAt(n)),
      (n += 1),
      i
    );
  }
  function u() {
    var e,
      t = "";
    for ("-" === i && ((t = "-"), l("-")); i >= "0" && i <= "9"; )
      ((t += i), l());
    if ("." === i) for (t += "."; l() && i >= "0" && i <= "9"; ) t += i;
    if ("e" === i || "E" === i)
      for (
        t += i, l(), ("-" === i || "+" === i) && ((t += i), l());
        i >= "0" && i <= "9";

      )
        ((t += i), l());
    return (isFinite((e = Number(t))) || s("Bad number"), e);
  }
  function d() {
    var e,
      t,
      r,
      n = "";
    if ('"' === i)
      for (; l(); )
        if ('"' === i) return (l(), n);
        else if ("\\" === i)
          if ((l(), "u" === i)) {
            for (
              t = 0, r = 0;
              t < 4 && isFinite((e = parseInt(l(), 16)));
              t += 1
            )
              r = 16 * r + e;
            n += String.fromCharCode(r);
          } else if ("string" == typeof a[i]) n += a[i];
          else break;
        else n += i;
    s("Bad string");
  }
  function c() {
    for (; i && i <= " "; ) l();
  }
  function f() {
    switch ((c(), i)) {
      case "{":
        var e,
          t = {};
        if ("{" === i) {
          if ((l("{"), c(), "}" === i)) return (l("}"), t);
          for (; i; ) {
            if (
              ((e = d()),
              c(),
              l(":"),
              Object.prototype.hasOwnProperty.call(t, e) &&
                s('Duplicate key "' + e + '"'),
              (t[e] = f()),
              c(),
              "}" === i)
            )
              return (l("}"), t);
            (l(","), c());
          }
        }
        s("Bad object");
        return;
      case "[":
        var r = [];
        if ("[" === i) {
          if ((l("["), c(), "]" === i)) return (l("]"), r);
          for (; i; ) {
            if ((r.push(f()), c(), "]" === i)) return (l("]"), r);
            (l(","), c());
          }
        }
        s("Bad array");
        return;
      case '"':
        return d();
      case "-":
        return u();
      default:
        return i >= "0" && i <= "9"
          ? u()
          : (function () {
              switch (i) {
                case "t":
                  return (l("t"), l("r"), l("u"), l("e"), !0);
                case "f":
                  return (l("f"), l("a"), l("l"), l("s"), l("e"), !1);
                case "n":
                  return (l("n"), l("u"), l("l"), l("l"), null);
                default:
                  s("Unexpected '" + i + "'");
              }
            })();
    }
  }
  t.exports = function (e, t) {
    var r;
    return (
      (o = e),
      (n = 0),
      (i = " "),
      (r = f()),
      c(),
      i && s("Syntax error"),
      "function" == typeof t
        ? (function e(r, n) {
            var i,
              o,
              a = r[n];
            if (a && "object" == typeof a)
              for (i in f)
                Object.prototype.hasOwnProperty.call(a, i) &&
                  (void 0 === (o = e(a, i)) ? delete a[i] : (a[i] = o));
            return t.call(r, n, a);
          })({ "": r }, "")
        : r
    );
  };
};
