// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  let e = "totp";
  t.s([
    "Z",
    0,
    e,
    "e",
    0,
    (t) => {
      let s = (t?.mfaMethods ?? []).filter((t) => "email" !== t);
      return {
        isOn: s.length > 0,
        totpOn: s.includes(e),
        methods: s,
        otherMethods: s.filter((t) => t !== e),
      };
    },
    "H",
    0,
    (t, e) =>
      t.length === e.length && t.every((t) => e.includes(t))
        ? "unchanged"
        : 0 === t.length
          ? "enrolled"
          : 0 === e.length
            ? "unenrolled"
            : "changed",
  ]);
};
