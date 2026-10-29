// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(449597);
  function i(e) {
    return (0, t.Y)(e) ? "usdc" : (0, t.i)(e) ? "unsupported" : "sol";
  }
  let o = ({ quoteMintAddress: e, hasRoutedSpend: t }) =>
    "unsupported" !== i(e) || t;
  e.s([
    "H",
    0,
    { sol: "/icons/sol-filled-logo.svg", usdc: "/usdc2.png" },
    "T",
    0,
    i,
    "r",
    0,
    o,
    "X",
    0,
    (e) =>
      o({
        quoteMintAddress: e.quote_mint,
        hasRoutedSpend: !1 !== e.initialized,
      }),
  ]);
};
