// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  function n() {
    throw Error(
      "`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled.",
    );
  }
  (e.i(149502),
    Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "forbidden", {
      enumerable: !0,
      get: function () {
        return n;
      },
    }),
    e.r(835932).HTTP_ERROR_FALLBACK_ERROR_CODE,
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default)));
};
