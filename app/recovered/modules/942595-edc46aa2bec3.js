// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  function n() {
    return (
      (null === e.g || void 0 === e.g ? void 0 : e.g.crypto) ||
      (null === e.g || void 0 === e.g ? void 0 : e.g.msCrypto) ||
      {}
    );
  }
  function i() {
    let e = n();
    return e.subtle || e.webkitSubtle;
  }
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.isBrowserCryptoAvailable =
      r.getSubtleCrypto =
      r.getBrowerCrypto =
        void 0),
    (r.getBrowerCrypto = n),
    (r.getSubtleCrypto = i),
    (r.isBrowserCryptoAvailable = function () {
      return !!n() && !!i();
    }));
};
