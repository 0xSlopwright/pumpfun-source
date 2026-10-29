// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  function e(t) {
    return null !== t && ("object" == typeof t || "function" == typeof t);
  }
  var s = new WeakMap();
  async function a(t) {
    let a,
      i = new Promise((i, l) => {
        for (let n of ((a = { reject: l, resolve: i }), t)) {
          if (!e(n)) {
            Promise.resolve(n).then(i, l);
            continue;
          }
          let t = s.get(n);
          void 0 === t
            ? ((t = (function (t) {
                let e = new Set(),
                  s = { deferreds: e, settled: !1 };
                return (
                  Promise.resolve(t).then(
                    (t) => {
                      for (let { resolve: s } of e) s(t);
                      (e.clear(), (s.settled = !0));
                    },
                    (t) => {
                      for (let { reject: s } of e) s(t);
                      (e.clear(), (s.settled = !0));
                    },
                  ),
                  s
                );
              })(n)).deferreds.add(a),
              s.set(n, t))
            : t.settled
              ? Promise.resolve(n).then(i, l)
              : t.deferreds.add(a);
        }
      });
    return await i.finally(() => {
      for (let i of t) e(i) && s.get(i).deferreds.delete(a);
    });
  }
  t.s(["f", 0, a]);
};
