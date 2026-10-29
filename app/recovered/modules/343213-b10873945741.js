// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  function t() {
    let e = () => void 0,
      t = () => void 0;
    return {
      promise: new Promise((r, o) => {
        ((e = r), (t = o));
      }),
      resolve: e,
      reject: t,
    };
  }
  e.s(["f", 0, t], 737219);
  let r = new Map();
  e.s(
    [
      "f",
      0,
      function ({ fn: e, id: o, shouldSplitBatch: s, wait: n = 0, sort: a }) {
        let i = async () => {
            let t = l();
            c();
            let r = t.map(({ args: e }) => e);
            0 !== r.length &&
              e(r)
                .then((e) => {
                  a && Array.isArray(e) && e.sort(a);
                  for (let r = 0; r < t.length; r++) {
                    let { resolve: o } = t[r];
                    o?.([e[r], e]);
                  }
                })
                .catch((e) => {
                  for (let r = 0; r < t.length; r++) {
                    let { reject: o } = t[r];
                    o?.(e);
                  }
                });
          },
          c = () => r.delete(o),
          l = () => r.get(o) || [],
          u = (e) => r.set(o, [...l(), e]);
        return {
          flush: c,
          async schedule(e) {
            let { promise: r, resolve: o, reject: a } = t();
            return (
              (s?.([...l().map(({ args: e }) => e), e]) && i(), l().length > 0)
                ? u({ args: e, resolve: o, reject: a })
                : (u({ args: e, resolve: o, reject: a }), setTimeout(i, n)),
              r
            );
          },
        };
      },
    ],
    343213,
  );
};
