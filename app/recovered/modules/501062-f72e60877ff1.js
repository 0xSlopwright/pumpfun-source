// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "getAssetPrefix", {
      enumerable: !0,
      get: function () {
        return o;
      },
    }));
  let n = e.r(487364);
  function o() {
    let e = document.currentScript;
    if (!(e instanceof HTMLScriptElement))
      throw new n.InvariantError(
        `Expected document.currentScript to be a <script> element. Received ${e} instead.`,
      );
    let { pathname: t } = new URL(e.src),
      r = t.indexOf("/_next/");
    if (-1 === r)
      throw new n.InvariantError(
        `Expected document.currentScript src to contain '/_next/'. Received ${e.src} instead.`,
      );
    return t.slice(0, r);
  }
  ("function" == typeof r.default ||
    ("object" == typeof r.default && null !== r.default)) &&
    void 0 === r.default.__esModule &&
    (Object.defineProperty(r.default, "__esModule", { value: !0 }),
    Object.assign(r.default, r),
    (t.exports = r.default));
};
