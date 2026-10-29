// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var r = e.i(352386),
    s = e.i(351853),
    t = "u" > typeof window ? r.useLayoutEffect : r.useEffect;
  function o(e, s, o, a) {
    let n = (0, r.useRef)(s);
    (t(() => {
      n.current = s;
    }, [s]),
      (0, r.useEffect)(() => {
        let r = (null == o ? void 0 : o.current) ?? window;
        if (!(r && r.addEventListener)) return;
        let s = (e) => {
          n.current(e);
        };
        return (
          r.addEventListener(e, s, a),
          () => {
            r.removeEventListener(e, s, a);
          }
        );
      }, [e, o, a]));
  }
  function a(e) {
    let s = (0, r.useRef)(() => {
      throw Error("Cannot call an event handler while rendering.");
    });
    return (
      t(() => {
        s.current = e;
      }, [e]),
      (0, r.useCallback)(
        (...e) => {
          var r;
          return null == (r = s.current) ? void 0 : r.call(s, ...e);
        },
        [s],
      )
    );
  }
  var n = "u" < typeof window,
    i = "u" < typeof window;
  function c(e, t = 500, o) {
    var a;
    let n,
      i = (0, r.useRef)();
    ((a = () => {
      i.current && i.current.cancel();
    }),
      ((n = (0, r.useRef)(a)).current = a),
      (0, r.useEffect)(
        () => () => {
          n.current();
        },
        [],
      ));
    let d = (0, r.useMemo)(() => {
      let r = (0, s.default)(e, t, o),
        a = (...e) => r(...e);
      return (
        (a.cancel = () => {
          r.cancel();
        }),
        (a.isPending = () => !!i.current),
        (a.flush = () => r.flush()),
        a
      );
    }, [e, t, o]);
    return (
      (0, r.useEffect)(() => {
        i.current = (0, s.default)(e, t, o);
      }, [e, t, o]),
      d
    );
  }
  e.s([
    "t",
    0,
    c,
    "r",
    0,
    function (e, s, t) {
      let o = (null == t ? void 0 : t.equalityFn) ?? ((e, r) => e === r),
        a = e instanceof Function ? e() : e,
        [n, i] = (0, r.useState)(a),
        d = (0, r.useRef)(a),
        l = c(i, s, t);
      return (o(d.current, a) || (l(a), (d.current = a)), [n, l]);
    },
    "m",
    0,
    function () {
      let [e, s] = (0, r.useState)(!1);
      return (
        (0, r.useEffect)(() => {
          s(!0);
        }, []),
        e
      );
    },
    "j",
    0,
    function (e, s, t = {}) {
      let { initializeWithValue: i = !0 } = t,
        c = (0, r.useCallback)(
          (e) => (t.serializer ? t.serializer(e) : JSON.stringify(e)),
          [t],
        ),
        d = (0, r.useCallback)(
          (e) => {
            let r;
            if (t.deserializer) return t.deserializer(e);
            if ("undefined" === e) return;
            let o = s instanceof Function ? s() : s;
            try {
              r = JSON.parse(e);
            } catch (e) {
              return (console.error("Error parsing JSON:", e), o);
            }
            return r;
          },
          [t, s],
        ),
        l = (0, r.useCallback)(() => {
          let r = s instanceof Function ? s() : s;
          if (n) return r;
          try {
            let s = window.localStorage.getItem(e);
            return s ? d(s) : r;
          } catch (s) {
            return (
              console.warn(`Error reading localStorage key “${e}”:`, s),
              r
            );
          }
        }, [s, e, d]),
        [u, y] = (0, r.useState)(() =>
          i ? l() : s instanceof Function ? s() : s,
        ),
        f = a((r) => {
          n &&
            console.warn(
              `Tried setting localStorage key “${e}” even though environment is not a client`,
            );
          try {
            let s = r instanceof Function ? r(l()) : r;
            (window.localStorage.setItem(e, c(s)),
              y(s),
              window.dispatchEvent(
                new StorageEvent("local-storage", { key: e }),
              ));
          } catch (r) {
            console.warn(`Error setting localStorage key “${e}”:`, r);
          }
        }),
        B = a(() => {
          n &&
            console.warn(
              `Tried removing localStorage key “${e}” even though environment is not a client`,
            );
          let r = s instanceof Function ? s() : s;
          (window.localStorage.removeItem(e),
            y(r),
            window.dispatchEvent(
              new StorageEvent("local-storage", { key: e }),
            ));
        });
      (0, r.useEffect)(() => {
        y(l());
      }, [e]);
      let g = (0, r.useCallback)(
        (r) => {
          (r.key && r.key !== e) || y(l());
        },
        [e, l],
      );
      return (o("storage", g), o("local-storage", g), [u, f, B]);
    },
    "T",
    0,
    function (e, { defaultValue: s = !1, initializeWithValue: o = !0 } = {}) {
      let a = (e) => (i ? s : window.matchMedia(e).matches),
        [n, c] = (0, r.useState)(() => (o ? a(e) : s));
      function d() {
        c(a(e));
      }
      return (
        t(() => {
          let r = window.matchMedia(e);
          return (
            d(),
            r.addListener ? r.addListener(d) : r.addEventListener("change", d),
            () => {
              r.removeListener
                ? r.removeListener(d)
                : r.removeEventListener("change", d);
            }
          );
        }, [e]),
        n
      );
    },
  ]);
};
