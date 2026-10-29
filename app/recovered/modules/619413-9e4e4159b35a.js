// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  Object.defineProperty(n, "__esModule", { value: !0 });
  var r = {
    createReactBrowserBailoutReason: function () {
      return l;
    },
    getReactBrowserBailoutReason: function () {
      return o;
    },
    isNextBrowserBailoutError: function () {
      return s;
    },
  };
  for (var a in r) Object.defineProperty(n, a, { enumerable: !0, get: r[a] });
  let i = Symbol.for("next.browser-bailout-reason");
  function l(e) {
    return { $$typeof: i, reason: e };
  }
  function o(e) {
    let t = e?.cause;
    return t?.$$typeof === i ? t.reason : void 0;
  }
  function s(e) {
    return void 0 !== o(e);
  }
};
