// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(811005);
  e.s([
    "f",
    0,
    function (e, r, { isEqual: o = Object.is } = {}) {
      let [i] = (0, t.useState)(() => {
        let t;
        return (t = {
          value: r(e.getState()),
          selector: r,
          isEqual: o,
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
            let o = n !== t.selector;
            ((t.selector = n),
              (t.isEqual = r),
              o && (t.value = n(e.getState())));
          },
        });
      });
      i.adopt(r, o);
      let a = (0, t.useCallback)(
          (t) => {
            ((i.notify = t), i.emit());
            let n = e.subscribe(i.onCommit);
            return () => {
              (n(), (i.notify = null));
            };
          },
          [e, i],
        ),
        s = (0, t.useCallback)(() => i.value, [i]),
        l = (0, t.useCallback)(
          () => r((e.getInitialState ?? e.getState)()),
          [e, r],
        );
      return (0, t.useSyncExternalStore)(a, s, l);
    },
  ]);
};
