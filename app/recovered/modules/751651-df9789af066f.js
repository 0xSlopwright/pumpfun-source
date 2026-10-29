// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  t.s(
    [
      "f",
      0,
      function ({
        atomicAmount: t,
        paymentAsset: e,
        solBalanceLamports: s,
        solBalanceLoaded: i,
        usdcBalanceRaw: n,
      }) {
        return (
          null !== t &&
          ("usdc" === e ? null !== n && t > n : i && t > BigInt(Math.floor(s)))
        );
      },
    ],
    751651,
  );
  var e = t.i(958083);
  let s = BigInt(0);
  t.s(
    [
      "L",
      0,
      function (t) {
        if (!Number.isFinite(t) || t <= 0) return "";
        if (t >= 0.01) return t.toFixed(2);
        let e = t.toPrecision(2);
        return e.includes("e") ? t.toFixed(8) : e;
      },
      "o",
      0,
      function ({ atomicAmount: t, tokenUsdPrice: s, tokenDecimals: i }) {
        return !Number.isFinite(s) || s <= 0
          ? 0
          : new e.U(t.toString()).div(e.U.pow(10, i)).mul(s).toNumber();
      },
      "R",
      0,
      function ({ usd: t, tokenUsdPrice: i, tokenDecimals: n, balanceRaw: a }) {
        if (
          !Number.isFinite(t) ||
          t <= 0 ||
          !Number.isFinite(i) ||
          i <= 0 ||
          !Number.isInteger(n) ||
          n < 0
        )
          return null;
        let l = e.U.pow(10, n),
          u = BigInt(new e.U(t).div(i).mul(l).floor().toFixed(0));
        if (null === a || a <= s)
          return u > s ? { atomicAmount: u, isSellAll: !1 } : null;
        let r = new e.U(a.toString()).div(l).mul(i),
          m = new e.U(t)
            .toDecimalPlaces(2)
            .greaterThanOrEqualTo(r.toDecimalPlaces(2));
        return u >= a || m
          ? { atomicAmount: a, isSellAll: !0 }
          : u > s
            ? { atomicAmount: u, isSellAll: !1 }
            : null;
      },
    ],
    214957,
  );
};
