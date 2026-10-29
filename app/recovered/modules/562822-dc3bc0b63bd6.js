// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (e.i(149502),
    Object.defineProperty(r, "__esModule", { value: !0 }),
    Object.defineProperty(r, "appBootstrap", {
      enumerable: !0,
      get: function () {
        return a;
      },
    }));
  let n = e.r(501062),
    o = e.r(885524);
  function a(e) {
    var t, r;
    let a = (0, n.getAssetPrefix)();
    ((t = self.__next_s),
      (r = () => {
        e(a);
      }),
      t && t.length
        ? t
            .reduce(
              (e, [t, r]) =>
                e.then(
                  () =>
                    new Promise((e, n) => {
                      let a = document.createElement("script");
                      (r && (0, o.setAttributesFromProps)(a, r),
                        t
                          ? ((a.src = t),
                            (a.onload = () => e()),
                            (a.onerror = n))
                          : r && ((a.innerHTML = r.children), setTimeout(e)),
                        document.head.appendChild(a));
                    }),
                ),
              Promise.resolve(),
            )
            .catch((e) => {
              console.error(e);
            })
            .then(() => {
              r();
            })
        : r());
  }
  ((window.next = { version: "16.4.1", appDir: !0 }),
    ("function" == typeof r.default ||
      ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default)));
};
