// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(985526),
    r = e.i(755793),
    i = e.i(352386);
  let n = () => !0;
  e.s([
    "f",
    0,
    ({
      instance: e,
      enabled: a = !0,
      onReconnect: l,
      resyncOnFirstConnect: o = n,
    }) => {
      let u = (0, i.useRef)(l);
      u.current = l;
      let s = (0, i.useRef)(o);
      ((s.current = o),
        (0, i.useEffect)(() => {
          if (!a) return;
          let i = (0, r.B)(e) !== t.m.CONNECTED,
            n = i,
            l = (0, r.k)((r, a) => {
              if (r !== e) return;
              if (a !== t.m.CONNECTED) {
                i = !0;
                return;
              }
              if (!i) return;
              i = !1;
              let l = n;
              ((n = !1), (!l || s.current()) && u.current());
            });
          return () => {
            (0, r.t)(l);
          };
        }, [e, a]));
    },
  ]);
};
