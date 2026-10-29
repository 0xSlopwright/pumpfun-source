// Source-adapted original553301; SHA256 daab8eaf8a9c658f957e38a5748b14b24972bd7ba4d53ca758d83c48af094545.
// Decoder and clock are injected; these are browser UI predicates, not authorization.
export function createAuthStateKernel(t, Date) {
  return {
    U: e => (0, t.S)(e),
    K: ({
      decodedJwt: e,
      privyAuthenticated: t,
      publicKeyAddress: n,
      nowMs: i = Date.now()
    }) => !t && !!n && (!(e && "string" == typeof e.address && Number.isFinite(e.exp)) || 1e3 * e.exp <= i || e.address !== n),
    O: ({
      decodedJwt: e,
      privyAuthenticated: t,
      previousPublicKeyAddress: n,
      publicKeyAddress: i
    }) => !t && !!e && "string" == typeof e.address && !!i && n !== i && e.address !== i
  };
}
