// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(300059),
    r = e.i(382772),
    t = e.i(590719);
  e.s(
    [
      "f",
      0,
      function ({ r: e, s: o, to: a = "hex", v: s, yParity: n }) {
        let c = (() => {
            if (0 === n || 1 === n) return n;
            if (s && (27n === s || 28n === s || s >= 35n))
              return +(s % 2n === 0n);
            throw Error("Invalid `v` or `yParity` value");
          })(),
          i = `0x${new f.secp256k1.Signature((0, r.K)(e), (0, r.K)(o)).toCompactHex()}${0 === c ? "1b" : "1c"}`;
        return "hex" === a ? i : (0, t.X)(i);
      },
    ],
    125975,
  );
  var o = e.i(497763),
    a = e.i(990149),
    s = e.i(612735),
    n = e.i(19648);
  e.s(
    [
      "f",
      0,
      function (e, f) {
        let r, t;
        return (0, o.f)(
          ((r =
            "string" == typeof e
              ? (0, n.B)(e)
              : "string" == typeof e.raw
                ? e.raw
                : (0, n.v)(e.raw)),
          (t = (0, n.B)(`\x19Ethereum Signed Message:
${(0, s.f)(r)}`)),
          (0, a.w)([t, r])),
          f,
        );
      },
    ],
    541332,
  );
};
