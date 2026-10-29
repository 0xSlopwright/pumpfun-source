// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(300059),
    r = e.i(19648);
  e.s([
    "f",
    0,
    function (e) {
      let { r: t, s: o } = f.secp256k1.Signature.fromCompact(e.slice(2, 130)),
        a = Number(`0x${e.slice(130)}`),
        [s, n] = (() => {
          if (0 === a || 1 === a) return [void 0, a];
          if (27 === a) return [BigInt(a), 0];
          if (28 === a) return [BigInt(a), 1];
          throw Error("Invalid yParityOrV value");
        })();
      return void 0 !== s
        ? {
            r: (0, r.N)(t, { size: 32 }),
            s: (0, r.N)(o, { size: 32 }),
            v: s,
            yParity: n,
          }
        : {
            r: (0, r.N)(t, { size: 32 }),
            s: (0, r.N)(o, { size: 32 }),
            yParity: n,
          };
    },
  ]);
};
