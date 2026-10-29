// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(300059),
    i = e.i(19648);
  e.s([
    "f",
    0,
    function (e) {
      let { r: f, s } = t.secp256k1.Signature.fromCompact(e.slice(2, 130)),
        n = Number(`0x${e.slice(130)}`),
        [o, r] = (() => {
          if (0 === n || 1 === n) return [void 0, n];
          if (27 === n) return [BigInt(n), 0];
          if (28 === n) return [BigInt(n), 1];
          throw Error("Invalid yParityOrV value");
        })();
      return void 0 !== o
        ? {
            r: (0, i.N)(f, { size: 32 }),
            s: (0, i.N)(s, { size: 32 }),
            v: o,
            yParity: r,
          }
        : {
            r: (0, i.N)(f, { size: 32 }),
            s: (0, i.N)(s, { size: 32 }),
            yParity: r,
          };
    },
  ]);
};
