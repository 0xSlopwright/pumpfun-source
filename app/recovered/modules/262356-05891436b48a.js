// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(323886),
    r = e.i(841087);
  e.s([
    "f",
    0,
    function (
      {
        key: e,
        methods: t,
        name: o,
        request: a,
        retryCount: s = 3,
        retryDelay: n = 150,
        timeout: c,
        type: i,
      },
      d,
    ) {
      let u = (0, r.f)();
      return {
        config: {
          key: e,
          methods: t,
          name: o,
          request: a,
          retryCount: s,
          retryDelay: n,
          timeout: c,
          type: i,
        },
        request: (0, f.f)(a, {
          methods: t,
          retryCount: s,
          retryDelay: n,
          uid: u,
        }),
        value: d,
      };
    },
  ]);
};
