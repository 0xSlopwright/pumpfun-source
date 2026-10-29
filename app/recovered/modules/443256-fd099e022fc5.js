// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  Object.defineProperty(r, "__esModule", { value: !0 });
  var n = {
    BailoutToCSRError: function () {
      return i;
    },
    isBailoutToCSRError: function () {
      return a;
    },
  };
  for (var o in n) Object.defineProperty(r, o, { enumerable: !0, get: n[o] });
  let u = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
  class i extends Error {
    constructor(e) {
      (super(`Bail out to client-side rendering: ${e}`),
        (this.reason = e),
        (this.digest = u));
    }
  }
  function a(e) {
    return (
      "object" == typeof e && null !== e && "digest" in e && e.digest === u
    );
  }
};
