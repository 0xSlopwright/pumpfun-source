// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(631777);
  e.s([
    "f",
    0,
    function (
      e,
      { delay: r = 100, retryCount: t = 2, shouldRetry: o = () => !0 } = {},
    ) {
      return new Promise((a, s) => {
        let n = async ({ count: c = 0 } = {}) => {
          let i = async ({ error: e }) => {
            let t = "function" == typeof r ? r({ count: c, error: e }) : r;
            (t && (await (0, f.f)(t)), n({ count: c + 1 }));
          };
          try {
            let f = await e();
            a(f);
          } catch (e) {
            if (c < t && (await o({ count: c, error: e })))
              return i({ error: e });
            s(e);
          }
        };
        n();
      });
    },
  ]);
};
