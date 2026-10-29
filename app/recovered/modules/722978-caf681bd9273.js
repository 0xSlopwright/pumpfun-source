// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function f() {
    for (var e, f, t = 0, n = ""; t < arguments.length; )
      (e = arguments[t++]) &&
        (f = (function e(f) {
          var t,
            n,
            r = "";
          if ("string" == typeof f || "number" == typeof f) r += f;
          else if ("object" == typeof f)
            if (Array.isArray(f))
              for (t = 0; t < f.length; t++)
                f[t] && (n = e(f[t])) && (r && (r += " "), (r += n));
            else for (t in f) f[t] && (r && (r += " "), (r += t));
          return r;
        })(e)) &&
        (n && (n += " "), (n += f));
    return n;
  }
  e.s(["clsx", 0, f, "default", 0, f]);
};
