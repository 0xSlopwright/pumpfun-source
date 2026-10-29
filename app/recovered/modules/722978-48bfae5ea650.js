// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function t() {
    for (var e, t, r = 0, o = ""; r < arguments.length; )
      (e = arguments[r++]) &&
        (t = (function e(t) {
          var r,
            o,
            s = "";
          if ("string" == typeof t || "number" == typeof t) s += t;
          else if ("object" == typeof t)
            if (Array.isArray(t))
              for (r = 0; r < t.length; r++)
                t[r] && (o = e(t[r])) && (s && (s += " "), (s += o));
            else for (r in t) t[r] && (s && (s += " "), (s += r));
          return s;
        })(e)) &&
        (o && (o += " "), (o += t));
    return o;
  }
  e.s(["clsx", 0, t, "default", 0, t]);
};
