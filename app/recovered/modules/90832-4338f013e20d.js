// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.i(267146);
  var t = e.i(540805),
    n = e.i(815612);
  function r(e, t = 6) {
    return isNaN(e) || !isFinite(e)
      ? "0"
      : new Intl.NumberFormat("en-US", {
          useGrouping: !0,
          minimumFractionDigits: 0,
          maximumFractionDigits: t,
        }).format(e);
  }
  function a(e) {
    return e.toFixed(1).replace(/\.0$/, "");
  }
  let i = t.l,
    l = t.l;
  e.s([
    "p",
    0,
    function (e, t = 4) {
      return isNaN(e) || !isFinite(e)
        ? "0"
        : new Intl.NumberFormat("en-US", {
            useGrouping: !0,
            minimumFractionDigits: 0,
            maximumFractionDigits: t,
          }).format(e);
    },
    "m",
    0,
    r,
    "S",
    0,
    function (e) {
      if (isNaN(e) || !isFinite(e)) return "0";
      let t = e < 0,
        n = Math.abs(e);
      return n >= 1e9
        ? `${t ? "-" : ""}${a(n / 1e9)}B`
        : n >= 1e6
          ? `${t ? "-" : ""}${a(n / 1e6)}M`
          : n >= 1e3
            ? `${t ? "-" : ""}${a(n / 1e3)}K`
            : (t ? "-" : "") + r(n, 4);
    },
    "w",
    0,
    function (e) {
      return isNaN(e) || !isFinite(e)
        ? "$0.00"
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(e);
    },
    "v",
    0,
    l,
    "c",
    0,
    function (e) {
      if (isNaN(e) || !isFinite(e)) return "$0.00";
      let t = Math.round(100 * e),
        n = 0 !== t ? t % 100 == 0 : 0 === e;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2 * !n,
        maximumFractionDigits: 2,
      }).format(e);
    },
    "N",
    0,
    i,
    "T",
    0,
    function ({ value: e, significantDigits: t = 3 }) {
      return isNaN(e) || !isFinite(e)
        ? "$0.00"
        : `$${(0, n.a)({ value: e, precision: t })}`;
    },
  ]);
};
