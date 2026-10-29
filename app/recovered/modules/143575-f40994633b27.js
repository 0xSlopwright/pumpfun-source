// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(952366);
  e.s([
    "z",
    0,
    "Sign up with Google, Apple, or email to get started — new accounts can't be created with X.",
    "W",
    0,
    (e) =>
      "linked_to_another_user" === e
        ? "That account is already linked to another pump.fun account. Try a different one, or contact support."
        : "Linking failed. Please try again.",
    "P",
    0,
    (e) =>
      "email" === e
        ? { kind: "email" }
        : (0, t.F)(e)
          ? { kind: "oauth", provider: e }
          : null,
  ]);
};
