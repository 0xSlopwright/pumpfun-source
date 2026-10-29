// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(352386),
    n = e.i(811005);
  e.s([
    "f",
    0,
    function (e, r, { isEqual: a = Object.is } = {}) {
      let [o] = (0, t.useState)(() => {
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
      o.adopt(r, a);
      let l = (0, t.useCallback)(
          (t) => {
            ((o.notify = t), o.emit());
            let n = e.subscribe(o.onCommit);
            return () => {
              (n(), (o.notify = null));
            };
          },
          [e, o],
        ),
        i = (0, t.useCallback)(() => o.value, [o]),
        c = (0, t.useCallback)(
          () => r((e.getInitialState ?? e.getState)()),
          [e, r],
        );
      return (0, t.useSyncExternalStore)(l, i, c);
    },
  ]);
};
