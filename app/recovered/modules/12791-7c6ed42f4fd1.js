// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  function n(e) {
    let t;
    return ("u" > typeof window && void 0 !== window[e] && (t = window[e]), t);
  }
  function i(e) {
    let t = n(e);
    if (!t) throw Error(`${e} is not defined in Window`);
    return t;
  }
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.getLocalStorage =
      r.getLocalStorageOrThrow =
      r.getCrypto =
      r.getCryptoOrThrow =
      r.getLocation =
      r.getLocationOrThrow =
      r.getNavigator =
      r.getNavigatorOrThrow =
      r.getDocument =
      r.getDocumentOrThrow =
      r.getFromWindowOrThrow =
      r.getFromWindow =
        void 0),
    (r.getFromWindow = n),
    (r.getFromWindowOrThrow = i),
    (r.getDocumentOrThrow = function () {
      return i("document");
    }),
    (r.getDocument = function () {
      return n("document");
    }),
    (r.getNavigatorOrThrow = function () {
      return i("navigator");
    }),
    (r.getNavigator = function () {
      return n("navigator");
    }),
    (r.getLocationOrThrow = function () {
      return i("location");
    }),
    (r.getLocation = function () {
      return n("location");
    }),
    (r.getCryptoOrThrow = function () {
      return i("crypto");
    }),
    (r.getCrypto = function () {
      return n("crypto");
    }),
    (r.getLocalStorageOrThrow = function () {
      return i("localStorage");
    }),
    (r.getLocalStorage = function () {
      return n("localStorage");
    }));
};
