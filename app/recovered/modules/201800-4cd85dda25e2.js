// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502), Object.defineProperty(r, "__esModule", { value: !0 }));
  var n = {
    NavigationPromisesContext: function () {
      return f;
    },
    PathParamsContext: function () {
      return c;
    },
    PathnameContext: function () {
      return l;
    },
    ReadonlyURLSearchParams: function () {
      return i.ReadonlyURLSearchParams;
    },
    SearchParamsContext: function () {
      return a;
    },
    createDevToolsInstrumentedPromise: function () {
      return s;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let u = e.r(352386),
    i = e.r(308727),
    a = (0, u.createContext)(null),
    l = (0, u.createContext)(null),
    c = (0, u.createContext)(null),
    f = (0, u.createContext)(null);
  function s(e, t) {
    let r = Promise.resolve(t);
    return (
      (r.status = "fulfilled"),
      (r.value = t),
      (r.displayName = `${e} (SSR)`),
      r
    );
  }
};
