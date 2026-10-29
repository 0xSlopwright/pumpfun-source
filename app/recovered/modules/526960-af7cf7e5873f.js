// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(960892),
    r = e.i(470083),
    o = e.i(612735),
    s = e.i(382772),
    n = e.i(19648);
  async function a({ hash: t, signature: c }) {
    let l = (0, r.f)(t) ? t : (0, n.g)(t),
      { secp256k1: u } = await e.A(313886),
      d = (() => {
        if ("object" == typeof c && "r" in c && "s" in c) {
          let { r: e, s: t, v: r, yParity: o } = c,
            n = i(Number(o ?? r));
          return new u.Signature((0, s.K)(e), (0, s.K)(t)).addRecoveryBit(n);
        }
        let e = (0, r.f)(c) ? c : (0, n.g)(c);
        if (65 !== (0, o.f)(e)) throw Error("invalid signature length");
        let t = i((0, s.T)(`0x${e.slice(130)}`));
        return u.Signature.fromCompact(e.substring(2, 130)).addRecoveryBit(t);
      })()
        .recoverPublicKey(l.substring(2))
        .toHex(!1);
    return `0x${d}`;
  }
  function i(e) {
    if (0 === e || 1 === e) return e;
    if (27 === e) return 0;
    if (28 === e) return 1;
    throw Error("Invalid yParityOrV value");
  }
  async function c({ hash: e, signature: r }) {
    return (0, t.f)(await a({ hash: e, signature: r }));
  }
  (e.s(["f", 0, c], 526960),
    e.s(
      [
        "l",
        0,
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "B",
        0,
        "0x0000000000000000000000000000000000000000",
      ],
      790907,
    ));
};
