// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    ServerInsertedHTMLContext: function () {
      return i;
    },
    useServerInsertedHTML: function () {
      return a;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let u = e.r(56421)._(e.r(352386)),
    i = u.default.createContext(null);
  function a(e) {
    let t = (0, u.useContext)(i);
    t && t(e);
  }
};
