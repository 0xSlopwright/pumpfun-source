// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(683023);
  e.s([
    "U",
    0,
    (e) => (0, t.S)(e),
    "K",
    0,
    ({
      decodedJwt: e,
      privyAuthenticated: t,
      publicKeyAddress: n,
      nowMs: r = Date.now(),
    }) =>
      !t &&
      !!n &&
      (!(e && "string" == typeof e.address && Number.isFinite(e.exp)) ||
        1e3 * e.exp <= r ||
        e.address !== n),
    "O",
    0,
    ({
      decodedJwt: e,
      privyAuthenticated: t,
      previousPublicKeyAddress: n,
      publicKeyAddress: r,
    }) =>
      !t &&
      !!e &&
      "string" == typeof e.address &&
      !!r &&
      n !== r &&
      e.address !== r,
  ]);
};
