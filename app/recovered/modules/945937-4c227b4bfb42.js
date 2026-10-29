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
      function (e, t, i, o) {
        return (0, r.l)(
          (...r) => (o && (0, n.x)({ feature: o }), e()[t][i](...r)),
        );
      },
    ],
    141452,
  );
  var i = e.i(526658),
    o = e.i(973447),
    s = e.i(775975),
    a = e.i(305918),
    l = e.i(63794),
    c = e.i(80400),
    u = e.i(393386);
  function d() {
    return new i.S((e) => {
      var t, n;
      let r = (t, n) => {
          let r = (0, c.K)({
            stackTrace: n,
            originalError: t,
            startClocks: (0, s.o)(),
            nonErrorPrefix: "Uncaught",
            source: u.f.SOURCE,
            handling: "unhandled",
          });
          e.notify(r);
        },
        { stop: i } =
          ((t = r),
          (0, o.m)((0, l.K)(), "onerror", ({ parameters: [e, n, r, i, o] }) => {
            let s;
            ((0, c.b)(o) || (s = (0, a.c)(e, n, r, i)),
              t(null != o ? o : e, s));
          })),
        { stop: d } =
          ((n = r),
          (0, o.m)(
            (0, l.K)(),
            "onunhandledrejection",
            ({ parameters: [e] }) => {
              n(e.reason || "Empty reason");
            },
          ));
      return () => {
        (i(), d());
      };
    });
  }
  e.s(
    [
      "f",
      0,
      function (e = d) {
        let t = new i.O(500),
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
  var m = e.i(667611);
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
            (0, m.i)(e, t);
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
