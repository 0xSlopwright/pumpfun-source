// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(895453);
  e.s(
    [
      "f",
      0,
      function (e, n) {
        n.silentMultipleInit || t.s.error(`${e} is already initialized.`);
      },
    ],
    945937,
  );
  var n = e.i(354878),
    r = e.i(194672);
  e.s(
    [
      "f",
      0,
      function (e, t, n) {
        e.changeObservable.subscribe(() => {
          let r = e.getContext();
          n.add((e) => e[t].setContext(r));
        });
      },
      "i",
      0,
      function (e, t, o, i) {
        return (0, r.l)(
          (...r) => (i && (0, n.x)({ feature: i }), e()[t][o](...r)),
        );
      },
    ],
    141452,
  );
  var o = e.i(526658),
    i = e.i(973447),
    s = e.i(775975),
    a = e.i(305918),
    u = e.i(63794),
    c = e.i(80400),
    l = e.i(393386);
  function f() {
    return new o.S((e) => {
      var t, n;
      let r = (t, n) => {
          let r = (0, c.K)({
            stackTrace: n,
            originalError: t,
            startClocks: (0, s.o)(),
            nonErrorPrefix: "Uncaught",
            source: l.f.SOURCE,
            handling: "unhandled",
          });
          e.notify(r);
        },
        { stop: o } =
          ((t = r),
          (0, i.m)((0, u.K)(), "onerror", ({ parameters: [e, n, r, o, i] }) => {
            let s;
            ((0, c.b)(i) || (s = (0, a.c)(e, n, r, o)),
              t(null != i ? i : e, s));
          })),
        { stop: f } =
          ((n = r),
          (0, i.m)(
            (0, u.K)(),
            "onunhandledrejection",
            ({ parameters: [e] }) => {
              n(e.reason || "Empty reason");
            },
          ));
      return () => {
        (o(), f());
      };
    });
  }
  e.s(
    [
      "f",
      0,
      function (e = f) {
        let t = new o.O(500),
          n = e().subscribe((e) => {
            t.notify({ type: 0, error: e });
          });
        return {
          observable: t,
          stop: () => {
            n.unsubscribe();
          },
        };
      },
    ],
    364682,
  );
  var d = e.i(667611);
  e.s(
    [
      "f",
      0,
      function () {
        let e = [];
        return {
          add: (t) => {
            e.push(t) > 500 && e.splice(0, 1);
          },
          remove: (t) => {
            (0, d.i)(e, t);
          },
          drain: (t) => {
            (e.forEach((e) => e(t)), (e.length = 0));
          },
        };
      },
    ],
    670432,
  );
};
