// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(300059),
    r = e.i(19648);
  e.s([
    "f",
    0,
    function (e) {
      let { r: o, s } = t.secp256k1.Signature.fromCompact(e.slice(2, 130)),
        n = Number(`0x${e.slice(130)}`),
        [a, i] = (() => {
          if (0 === n || 1 === n) return [void 0, n];
          if (27 === n) return [BigInt(n), 0];
          if (28 === n) return [BigInt(n), 1];
          throw Error("Invalid yParityOrV value");
        })();
      return void 0 !== a
        ? {
            r: (0, r.N)(o, { size: 32 }),
            s: (0, r.N)(s, { size: 32 }),
            v: a,
            yParity: i,
          }
        : {
            r: (0, r.N)(o, { size: 32 }),
            s: (0, r.N)(s, { size: 32 }),
            yParity: i,
          };
    },
  ]);
};
