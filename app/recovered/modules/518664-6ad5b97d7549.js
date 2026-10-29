// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(811005);
  e.s([
    "f",
    0,
    function (e, r, { isEqual: a = Object.is } = {}) {
      let [s] = (0, t.useState)(() => {
        let t;
        return (t = {
          value: r(e.getState()),
          selector: r,
          isEqual: a,
          notify: null,
          emittedThisFrame: !1,
          emit: () => {
            let n = t.selector(e.getState());
            t.isEqual(n, t.value) || ((t.value = n), t.notify?.());
          },
          onCommit: () => {
            t.emittedThisFrame
              ? (0, n._)(t.flushEmit)
              : ((t.emittedThisFrame = !0), (0, n._)(t.endFrame), t.emit());
          },
          flushEmit: () => {
            ((t.emittedThisFrame = !0), (0, n._)(t.endFrame), t.emit());
          },
          endFrame: () => {
            t.emittedThisFrame = !1;
          },
          adopt: (n, r) => {
            let a = n !== t.selector;
            ((t.selector = n),
              (t.isEqual = r),
              a && (t.value = n(e.getState())));
          },
        });
      });
      s.adopt(r, a);
      let i = (0, t.useCallback)(
          (t) => {
            ((s.notify = t), s.emit());
            let n = e.subscribe(s.onCommit);
            return () => {
              (n(), (s.notify = null));
            };
          },
          [e, s],
        ),
        o = (0, t.useCallback)(() => s.value, [s]),
        l = (0, t.useCallback)(
          () => r((e.getInitialState ?? e.getState)()),
          [e, r],
        );
      return (0, t.useSyncExternalStore)(i, o, l);
    },
  ]);
};
