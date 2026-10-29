// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(323886),
    r = e.i(841087);
  e.s([
    "f",
    0,
    function (
      {
        key: e,
        methods: o,
        name: s,
        request: n,
        retryCount: a = 3,
        retryDelay: i = 150,
        timeout: c,
        type: l,
      },
      u,
    ) {
      let d = (0, r.f)();
      return {
        config: {
          key: e,
          methods: o,
          name: s,
          request: n,
          retryCount: a,
          retryDelay: i,
          timeout: c,
          type: l,
        },
        request: (0, t.f)(n, {
          methods: o,
          retryCount: a,
          retryDelay: i,
          uid: d,
        }),
        value: u,
      };
    },
  ]);
};
