// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function f() {
    for (var e, f, r = 0, t = ""; r < arguments.length; )
      (e = arguments[r++]) &&
        (f = (function e(f) {
          var r,
            t,
            o = "";
          if ("string" == typeof f || "number" == typeof f) o += f;
          else if ("object" == typeof f)
            if (Array.isArray(f))
              for (r = 0; r < f.length; r++)
                f[r] && (t = e(f[r])) && (o && (o += " "), (o += t));
            else for (r in f) f[r] && (o && (o += " "), (o += r));
          return o;
        })(e)) &&
        (t && (t += " "), (t += f));
    return t;
  }
  e.s(["clsx", 0, f, "default", 0, f]);
};
