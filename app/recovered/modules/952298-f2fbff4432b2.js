// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  e.s([
    "f",
    0,
    function (e) {
      var t;
      if (
        null === e ||
        "object" != typeof e ||
        ("buy" !== (t = e.type) && "sell" !== t)
      )
        return null;
      let i = e.amountSol,
        r = 0 / 0;
      return ("number" == typeof i
        ? (r = i)
        : "string" == typeof i && (r = Number(i)),
      Number.isFinite(r))
        ? { side: e.type, amountFormatted: r.toFixed(3) }
        : null;
    },
  ]);
};
