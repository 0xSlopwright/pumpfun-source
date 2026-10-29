// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n;
  (e.i(149502), Object.defineProperty(r, "__esModule", { value: !0 }));
  var o = {
    getAssetToken: function () {
      return l;
    },
    getAssetTokenQuery: function () {
      return c;
    },
    getDeploymentId: function () {
      return i;
    },
    getDeploymentIdQuery: function () {
      return a;
    },
  };
  for (var u in o) Object.defineProperty(r, u, { enumerable: !0, get: o[u] });
  function i() {
    return n;
  }
  function a(e = !1) {
    let t = n;
    return t ? `${e ? "&" : "?"}dpl=${t}` : "";
  }
  function l() {}
  function c(e = !1) {
    return (l(), "");
  }
  "u" > typeof window
    ? ((n = document.documentElement.dataset.dplId),
      document.documentElement.removeAttribute("data-dpl-id"))
    : (n = globalThis.NEXT_DEPLOYMENT_ID || void 0);
};
