// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(960892),
    t = e.i(470083),
    n = e.i(612735),
    r = e.i(382772),
    a = e.i(19648);
  async function i({ hash: f, signature: o }) {
    let c = (0, t.f)(f) ? f : (0, a.g)(f),
      { secp256k1: u } = await e.A(313886),
      d = (() => {
        if ("object" == typeof o && "r" in o && "s" in o) {
          let { r: e, s: f, v: t, yParity: n } = o,
            a = s(Number(n ?? t));
          return new u.Signature((0, r.K)(e), (0, r.K)(f)).addRecoveryBit(a);
        }
        let e = (0, t.f)(o) ? o : (0, a.g)(o);
        if (65 !== (0, n.f)(e)) throw Error("invalid signature length");
        let f = s((0, r.T)(`0x${e.slice(130)}`));
        return u.Signature.fromCompact(e.substring(2, 130)).addRecoveryBit(f);
      })()
        .recoverPublicKey(c.substring(2))
        .toHex(!1);
    return `0x${d}`;
  }
  function s(e) {
    if (0 === e || 1 === e) return e;
    if (27 === e) return 0;
    if (28 === e) return 1;
    throw Error("Invalid yParityOrV value");
  }
  async function o({ hash: e, signature: t }) {
    return (0, f.f)(await i({ hash: e, signature: t }));
  }
  (e.s(["f", 0, o], 526960),
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
