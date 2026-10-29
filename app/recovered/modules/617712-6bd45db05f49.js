// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  (t.i(74812),
    t.i(825717),
    t.i(887583),
    t.i(164631),
    t.i(514186),
    t.s(
      [
        "n",
        0,
        function (t) {
          return (
            ("signTransactions" in t &&
              "function" == typeof t.signTransactions) ||
            ("modifyAndSignTransactions" in t &&
              "function" == typeof t.modifyAndSignTransactions) ||
            ("signAndSendTransactions" in t &&
              "function" == typeof t.signAndSendTransactions)
          );
        },
        "I",
        0,
        function (t, e) {
          Object.freeze(t);
          let s = { ...e, feePayer: t };
          return (Object.freeze(s), s);
        },
      ],
      617712,
    ));
  var e = t.i(970260);
  t.s(
    [
      "g",
      0,
      function (t) {
        return (0, e.E)().decode(t);
      },
    ],
    296158,
  );
};
