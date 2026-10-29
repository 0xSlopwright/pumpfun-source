// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function t() {
    for (var e, t, i = 0, f = ""; i < arguments.length; )
      (e = arguments[i++]) &&
        (t = (function e(t) {
          var i,
            f,
            s = "";
          if ("string" == typeof t || "number" == typeof t) s += t;
          else if ("object" == typeof t)
            if (Array.isArray(t))
              for (i = 0; i < t.length; i++)
                t[i] && (f = e(t[i])) && (s && (s += " "), (s += f));
            else for (i in t) t[i] && (s && (s += " "), (s += i));
          return s;
        })(e)) &&
        (f && (f += " "), (f += t));
    return f;
  }
  e.s(["clsx", 0, t, "default", 0, t]);
};
