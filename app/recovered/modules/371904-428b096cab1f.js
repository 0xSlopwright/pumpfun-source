// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  (Object.defineProperty(n, "__esModule", { value: !0 }),
    Object.defineProperty(n, "PreloadChunks", {
      enumerable: !0,
      get: function () {
        return s;
      },
    }));
  let r = e.r(732486),
    a = e.r(231332),
    i = e.r(948382),
    l = e.r(582817),
    o = e.r(185457);
  function s({ moduleIds: e }) {
    if ("u" > typeof window) return null;
    let t = i.workAsyncStorage.getStore();
    if (void 0 === t) return null;
    let n = [];
    if (t.reactLoadableManifest && e) {
      let r = t.reactLoadableManifest;
      for (let t of e) {
        if (!r[t]) continue;
        let e = r[t].files;
        n.push(...e);
      }
    }
    if (0 === n.length) return null;
    let u = (0, o.getAssetTokenQuery)();
    return (0, r.jsx)(r.Fragment, {
      children: n.map((e) => {
        let n = `${t.assetPrefix}/_next/${(0, l.encodeURIPath)(e)}${u}`;
        return e.endsWith(".css")
          ? (0, r.jsx)(
              "link",
              {
                precedence: "dynamic",
                href: n,
                rel: "stylesheet",
                as: "style",
                nonce: t.nonce,
              },
              e,
            )
          : ((0, a.preload)(n, {
              as: "script",
              fetchPriority: "low",
              nonce: t.nonce,
            }),
            null);
      }),
    });
  }
};
