// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    n = e.i(445242),
    r = e.i(352386),
    i = e.i(192),
    a = e.i(595673);
  let o = () => {
      let e = null,
        t = new Set();
      return {
        get: () => e,
        set: (n) => {
          for (let r of ((e = n), t)) r();
        },
        subscribe: (e) => (
          t.add(e),
          () => {
            t.delete(e);
          }
        ),
      };
    },
    l = () => null,
    s = (0, r.createContext)(void 0),
    u = "pump_session_data";
  function c(e) {
    try {
      localStorage.setItem(u, JSON.stringify(e));
    } catch {}
  }
  function d(e) {
    if (Date.now() - e.pump_session_start_time > 864e5) return !0;
    let t = (0, i.d)();
    return void 0 !== t && !(0, i.A)(t) && t !== e.pump_session_id;
  }
  function f() {
    let e = (0, i.r)(),
      t = (function () {
        try {
          let e = localStorage.getItem(u);
          if (!e) return null;
          let t = JSON.parse(e);
          return (
            t &&
              !Array.isArray(t.navigation_history) &&
              (t.navigation_history = []),
            t
          );
        } catch {
          return null;
        }
      })();
    return {
      pump_session_id: e,
      pump_session_start_time: (0, i.l)(e) ?? Date.now(),
      navigation_history: t?.pump_session_id === e ? t.navigation_history : [],
    };
  }
  e.s(
    [
      "SessionProvider",
      0,
      function (e) {
        let i,
          u,
          p,
          m,
          g,
          h,
          y,
          v,
          _,
          E,
          w,
          b,
          S,
          I,
          P,
          C = (0, n.c)(29),
          { children: A } = e,
          [k] = (0, r.useState)(o),
          T = (0, r.useSyncExternalStore)(k.subscribe, k.get, l);
        (C[0] !== k
          ? ((i = () => {
              if (null !== k.get()) return;
              let e = f();
              (c(e), k.set(e));
            }),
            (u = [k]),
            (C[0] = k),
            (C[1] = i),
            (C[2] = u))
          : ((i = C[1]), (u = C[2])),
          (0, r.useEffect)(i, u));
        let O = (0, r.useRef)(null);
        C[3] !== k
          ? ((p = () => {
              let e = f();
              (k.set(e), c(e));
            }),
            (C[3] = k),
            (C[4] = p))
          : (p = C[4]);
        let x = p;
        C[5] !== k
          ? ((m = (e, t) => {
              let n = k.get();
              if (null === n) return;
              let r = [
                  { type: e, name: t, timestamp: Date.now() },
                  ...(Array.isArray(n.navigation_history)
                    ? n.navigation_history
                    : []),
                ].slice(0, 20),
                i = { ...n, navigation_history: r };
              (c(i), k.set(i));
            }),
            (C[5] = k),
            (C[6] = m))
          : (m = C[6]);
        let L = m;
        C[7] !== k
          ? ((g = () => {
              let e = k.get();
              return null === e
                ? []
                : Array.isArray(e.navigation_history)
                  ? e.navigation_history
                  : [];
            }),
            (C[7] = k),
            (C[8] = g))
          : (g = C[8]);
        let j = g;
        (C[9] !== T
          ? ((h = () => {}), (y = [T]), (C[9] = T), (C[10] = h), (C[11] = y))
          : ((h = C[10]), (y = C[11])),
          (0, r.useEffect)(h, y),
          C[12] !== T
            ? ((v = () => {
                null === T ||
                  (O.current !== T.pump_session_id &&
                    ((O.current = T.pump_session_id),
                    (0, a.B2)(T.pump_session_id)));
              }),
              (_ = [T]),
              (C[12] = T),
              (C[13] = v),
              (C[14] = _))
            : ((v = C[13]), (_ = C[14])),
          (0, r.useEffect)(v, _),
          C[15] !== T || C[16] !== x
            ? ((E = () => {
                if (null === T) return;
                if (d(T)) return void x();
                let e = () => {
                  "visible" === document.visibilityState && d(T) && x();
                };
                return (
                  document.addEventListener("visibilitychange", e),
                  () => {
                    document.removeEventListener("visibilitychange", e);
                  }
                );
              }),
              (w = [T, x]),
              (C[15] = T),
              (C[16] = x),
              (C[17] = E),
              (C[18] = w))
            : ((E = C[17]), (w = C[18])),
          (0, r.useEffect)(E, w),
          C[19] !== T
            ? ((b = () => {
                if (null === T) return;
                let e = () => {
                  c(T);
                };
                return (
                  window.addEventListener("beforeunload", e),
                  () => window.removeEventListener("beforeunload", e)
                );
              }),
              (S = [T]),
              (C[19] = T),
              (C[20] = b),
              (C[21] = S))
            : ((b = C[20]), (S = C[21])),
          (0, r.useEffect)(b, S),
          C[22] !== L || C[23] !== j || C[24] !== k
            ? ((I = {
                store: k,
                addNavigationEntry: L,
                getNavigationHistory: j,
              }),
              (C[22] = L),
              (C[23] = j),
              (C[24] = k),
              (C[25] = I))
            : (I = C[25]));
        let R = I;
        return (
          C[26] !== A || C[27] !== R
            ? ((P = (0, t.jsx)(s.Provider, { value: R, children: A })),
              (C[26] = A),
              (C[27] = R),
              (C[28] = P))
            : (P = C[28]),
          P
        );
      },
      "useSession",
      0,
      function () {
        let e,
          t = (0, n.c)(4),
          i = (0, r.use)(s);
        if (!i) throw Error("useSession must be used within a SessionProvider");
        let a = (0, r.useSyncExternalStore)(i.store.subscribe, i.store.get, l);
        return (
          t[0] !== i.addNavigationEntry ||
          t[1] !== i.getNavigationHistory ||
          t[2] !== a
            ? ((e = {
                sessionData: a,
                addNavigationEntry: i.addNavigationEntry,
                getNavigationHistory: i.getNavigationHistory,
              }),
              (t[0] = i.addNavigationEntry),
              (t[1] = i.getNavigationHistory),
              (t[2] = a),
              (t[3] = e))
            : (e = t[3]),
          e
        );
      },
    ],
    293205,
  );
};
