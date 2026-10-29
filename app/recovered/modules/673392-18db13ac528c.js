// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "notFound", {
      enumerable: !0,
      get: function () {
        return u;
      },
    }));
  let n = e.r(835932),
    o = `${n.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;
  function u() {
    let e = Error(o);
    throw ((e.digest = o), e);
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
