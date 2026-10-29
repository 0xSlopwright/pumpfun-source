// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(895453);
  e.s(
    [
      "f",
      0,
      function (e, r) {
        r.silentMultipleInit || t.s.error(`${e} is already initialized.`);
      },
    ],
    945937,
  );
  var r = e.i(354878),
    n = e.i(194672);
  e.s(
    [
      "f",
      0,
      function (e, t, r) {
        e.changeObservable.subscribe(() => {
          let n = e.getContext();
          r.add((e) => e[t].setContext(n));
        });
      },
      "i",
      0,
      function (e, t, i, o) {
        return (0, n.l)(
          (...n) => (o && (0, r.x)({ feature: o }), e()[t][i](...n)),
        );
      },
    ],
    141452,
  );
  var i = e.i(526658),
    o = e.i(973447),
    s = e.i(775975),
    a = e.i(305918),
    c = e.i(63794),
    l = e.i(80400),
    u = e.i(393386);
  function d() {
    return new i.S((e) => {
      var t, r;
      let n = (t, r) => {
          let n = (0, l.K)({
            stackTrace: r,
            originalError: t,
            startClocks: (0, s.o)(),
            nonErrorPrefix: "Uncaught",
            source: u.f.SOURCE,
            handling: "unhandled",
          });
          e.notify(n);
        },
        { stop: i } =
          ((t = n),
          (0, o.m)((0, c.K)(), "onerror", ({ parameters: [e, r, n, i, o] }) => {
            let s;
            ((0, l.b)(o) || (s = (0, a.c)(e, r, n, i)),
              t(null != o ? o : e, s));
          })),
        { stop: d } =
          ((r = n),
          (0, o.m)(
            (0, c.K)(),
            "onunhandledrejection",
            ({ parameters: [e] }) => {
              r(e.reason || "Empty reason");
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
          r = e().subscribe((e) => {
            t.notify({ type: 0, error: e });
          });
        return {
          observable: t,
          stop: () => {
            r.unsubscribe();
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
