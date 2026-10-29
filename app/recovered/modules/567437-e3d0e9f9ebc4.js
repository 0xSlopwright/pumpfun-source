// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e,
    s =
      (((e = {}).LOGIN_NOT_ALLOWED = "LOGIN_NOT_ALLOWED"),
      (e.LOGIN_FAILED = "LOGIN_FAILED"),
      (e.PRIVY_ACCOUNT_EXISTS = "PRIVY_ACCOUNT_EXISTS"),
      (e.LOGIN_WALLET_SIGNUP_BLOCKED = "LOGIN_WALLET_SIGNUP_BLOCKED"),
      (e.SESSION_COOKIE_REJECTED = "SESSION_COOKIE_REJECTED"),
      e);
  t.s([
    "$",
    () => s,
    "D",
    0,
    class extends Error {
      errorName;
      message;
      cause;
      constructor(t, e, s) {
        (super(), (this.errorName = t), (this.message = e), (this.cause = s));
      }
    },
  ]);
};
