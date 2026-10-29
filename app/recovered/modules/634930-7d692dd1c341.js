// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n,
    i,
    o,
    a =
      /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    s = {
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\",
    };
  function l(e) {
    return (
      (a.lastIndex = 0),
      a.test(e)
        ? '"' +
          e.replace(a, function (e) {
            var t = s[e];
            return "string" == typeof t
              ? t
              : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
        : '"' + e + '"'
    );
  }
  t.exports = function (e, t, r) {
    var a;
    if (((n = ""), (i = ""), "number" == typeof r))
      for (a = 0; a < r; a += 1) i += " ";
    else "string" == typeof r && (i = r);
    if (
      ((o = t),
      t &&
        "function" != typeof t &&
        ("object" != typeof t || "number" != typeof t.length))
    )
      throw Error("JSON.stringify");
    return (function e(t, r) {
      var a,
        s,
        u,
        d,
        c,
        f = n,
        h = r[t];
      switch (
        (h &&
          "object" == typeof h &&
          "function" == typeof h.toJSON &&
          (h = h.toJSON(t)),
        "function" == typeof o && (h = o.call(r, t, h)),
        typeof h)
      ) {
        case "string":
          return l(h);
        case "number":
          return isFinite(h) ? String(h) : "null";
        case "boolean":
        case "null":
          return String(h);
        case "object":
          if (!h) return "null";
          if (
            ((n += i),
            (c = []),
            "[object Array]" === Object.prototype.toString.apply(h))
          ) {
            for (d = h.length, a = 0; a < d; a += 1) c[a] = e(a, h) || "null";
            return (
              (u =
                0 === c.length
                  ? "[]"
                  : n
                    ? "[\n" + n + c.join(",\n" + n) + "\n" + f + "]"
                    : "[" + c.join(",") + "]"),
              (n = f),
              u
            );
          }
          if (o && "object" == typeof o)
            for (d = o.length, a = 0; a < d; a += 1)
              "string" == typeof (s = o[a]) &&
                (u = e(s, h)) &&
                c.push(l(s) + (n ? ": " : ":") + u);
          else
            for (s in h)
              Object.prototype.hasOwnProperty.call(h, s) &&
                (u = e(s, h)) &&
                c.push(l(s) + (n ? ": " : ":") + u);
          return (
            (u =
              0 === c.length
                ? "{}"
                : n
                  ? "{\n" + n + c.join(",\n" + n) + "\n" + f + "}"
                  : "{" + c.join(",") + "}"),
            (n = f),
            u
          );
      }
    })("", { "": e });
  };
};
