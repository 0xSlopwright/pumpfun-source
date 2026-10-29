// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(359162),
    r = e.i(194672),
    n = e.i(895453);
  (e.s(
    [
      "A",
      0,
      function (e, r, i) {
        let o = e[r];
        (o &&
          !o.q &&
          o.version &&
          n.s.warn(
            "SDK is loaded more than once. This is unsupported and might have unexpected behavior.",
          ),
          (e[r] = i),
          o &&
            o.q &&
            o.q.forEach((e) =>
              (0, t.f)(e, "onReady callback threw an error:")(),
            ));
      },
      "R",
      0,
      function (e) {
        let t = {
          version: "6.22.0",
          onReady(e) {
            e();
          },
          ...e,
        };
        return (
          Object.defineProperty(t, "_setDebug", {
            get: () => r.d,
            enumerable: !1,
          }),
          t
        );
      },
    ],
    79523,
  ),
    e.s(
      [
        "I",
        0,
        {
          getContext: "getContext",
          setContext: "setContext",
          setContextProperty: "setContextProperty",
          removeContextProperty: "removeContextProperty",
          clearContext: "clearContext",
        },
        "W",
        0,
        {
          userContext: "userContext",
          globalContext: "globalContext",
          accountContext: "accountContext",
        },
      ],
      161626,
    ));
};
