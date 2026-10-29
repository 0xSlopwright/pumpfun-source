// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    a =
      (((t = {}).LOGIN_NOT_ALLOWED = "LOGIN_NOT_ALLOWED"),
      (t.LOGIN_FAILED = "LOGIN_FAILED"),
      (t.PRIVY_ACCOUNT_EXISTS = "PRIVY_ACCOUNT_EXISTS"),
      (t.LOGIN_WALLET_SIGNUP_BLOCKED = "LOGIN_WALLET_SIGNUP_BLOCKED"),
      (t.SESSION_COOKIE_REJECTED = "SESSION_COOKIE_REJECTED"),
      t);
  e.s([
    "$",
    () => a,
    "D",
    0,
    class extends Error {
      errorName;
      message;
      cause;
      constructor(e, t, a) {
        (super(), (this.errorName = e), (this.message = t), (this.cause = a));
      }
    },
  ]);
};
