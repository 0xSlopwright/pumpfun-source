// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(481654),
    a = e.i(641705);
  let r = new Map();
  e.s([
    "getEvmPublicClient",
    0,
    function (e) {
      let n = r.get(e);
      if (n) return n;
      let i = (0, t.f)({
        transport: (0, a.f)(`${window.location.origin}/api/evm-rpc/${e}`, {
          batch: { batchSize: 8, wait: 0 },
        }),
      });
      return (r.set(e, i), i);
    },
  ]);
};
