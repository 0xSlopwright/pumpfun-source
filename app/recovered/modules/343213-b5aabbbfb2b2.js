// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function f() {
    let e = () => void 0,
      f = () => void 0;
    return {
      promise: new Promise((r, t) => {
        ((e = r), (f = t));
      }),
      resolve: e,
      reject: f,
    };
  }
  e.s(["f", 0, f], 737219);
  let r = new Map();
  e.s(
    [
      "f",
      0,
      function ({ fn: e, id: t, shouldSplitBatch: o, wait: a = 0, sort: s }) {
        let n = async () => {
            let f = i();
            c();
            let r = f.map(({ args: e }) => e);
            0 !== r.length &&
              e(r)
                .then((e) => {
                  s && Array.isArray(e) && e.sort(s);
                  for (let r = 0; r < f.length; r++) {
                    let { resolve: t } = f[r];
                    t?.([e[r], e]);
                  }
                })
                .catch((e) => {
                  for (let r = 0; r < f.length; r++) {
                    let { reject: t } = f[r];
                    t?.(e);
                  }
                });
          },
          c = () => r.delete(t),
          i = () => r.get(t) || [],
          d = (e) => r.set(t, [...i(), e]);
        return {
          flush: c,
          async schedule(e) {
            let { promise: r, resolve: t, reject: s } = f();
            return (
              (o?.([...i().map(({ args: e }) => e), e]) && n(), i().length > 0)
                ? d({ args: e, resolve: t, reject: s })
                : (d({ args: e, resolve: t, reject: s }), setTimeout(n, a)),
              r
            );
          },
        };
      },
    ],
    343213,
  );
};
