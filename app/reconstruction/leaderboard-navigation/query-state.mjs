// Source-adapted USED enum/single-query/queue path, not the whole URL-state library.
export function createQueryState({
  useUrlAdapter,
  react,
  logDebug,
  logParseError,
  formatError,
  console,
  window,
  navigator,
  location,
  performance,
  setTimeout,
}) {
  var t;
  const r = { J: useUrlAdapter, h: logDebug, S: logParseError, C: formatError },
    p = react;
  function l(e, t, l) {
    try {
      return e(t);
    } catch (e) {
      return (
        (0, r.S)(
          "[nuqs] Error while parsing value `%s`: %O" +
            (l ? " (for key `%s`)" : ""),
          t,
          e,
          l,
        ),
        null
      );
    }
  }
  function c(e, t, l, u) {
    let o = null === t ? null : l(t);
    return (
      (0, r.h)("[nuqs queue] Enqueueing %s=%s %O", e, o, u),
      a.set(e, o),
      "push" === u.history && (i.history = "push"),
      u.scroll && (i.scroll = !0),
      !1 === u.shallow && (i.shallow = !1),
      u.startTransition && s.add(u.startTransition),
      (i.throttleMs = Math.max(
        u.throttleMs ?? n,
        Number.isFinite(i.throttleMs) ? i.throttleMs : 0,
      )),
      o
    );
  }
  function d() {
    return new URLSearchParams(location.search);
  }
  function f({
    getSearchParamsSnapshot: e = d,
    updateUrl: t,
    rateLimitFactor: l = 1,
  }) {
    return (
      null === o &&
        (o = new Promise((c, d) => {
          if (!Number.isFinite(i.throttleMs)) {
            ((0, r.h)("[nuqs queue] Skipping flush due to throttleMs=Infinity"),
              c(e()),
              setTimeout(() => {
                o = null;
              }, 0));
            return;
          }
          function f() {
            u = performance.now();
            let [l, f] = (function ({
              updateUrl: e,
              getSearchParamsSnapshot: t,
            }) {
              let l = t();
              if (0 === a.size) return [l, null];
              let u = Array.from(a.entries()),
                o = { ...i },
                c = Array.from(s);
              for (let [e, t] of (a.clear(),
              s.clear(),
              (i.history = "replace"),
              (i.scroll = !1),
              (i.shallow = !0),
              (i.throttleMs = n),
              (0, r.h)("[nuqs queue] Flushing queue %O with options %O", u, o),
              u))
                null === t ? l.delete(e) : l.set(e, t);
              try {
                var d, f;
                let t;
                return (
                  (d = c),
                  (f = () => {
                    e(l, {
                      history: o.history,
                      scroll: o.scroll,
                      shallow: o.shallow,
                    });
                  }),
                  (t = (e) => {
                    if (e === d.length) return f();
                    let r = d[e];
                    if (!r) throw Error("Invalid transition function");
                    r(() => t(e + 1));
                  })(0),
                  [l, null]
                );
              } catch (e) {
                return (
                  console.error((0, r.C)(429), u.map(([e]) => e).join(), e),
                  [l, e]
                );
              }
            })({ updateUrl: t, getSearchParamsSnapshot: e });
            (null === f ? c(l) : d(l), (o = null));
          }
          setTimeout(function () {
            let e = performance.now() - u,
              t = i.throttleMs,
              n = l * Math.max(0, Math.min(t, t - e));
            ((0, r.h)(
              "[nuqs queue] Scheduling flush in %f ms. Throttled at %f ms",
              n,
              t,
            ),
              0 === n ? f() : setTimeout(f, n));
          }, 0);
        })),
      o
    );
  }
  function m(e) {
    function t(t) {
      if (void 0 === t) return null;
      let r = "";
      if (Array.isArray(t)) {
        if (void 0 === t[0]) return null;
        r = t[0];
      }
      return ("string" == typeof t && (r = t), l(e.parse, r));
    }
    return {
      eq: (e, t) => e === t,
      ...e,
      parseServerSide: t,
      withDefault(e) {
        return { ...this, defaultValue: e, parseServerSide: (r) => t(r) ?? e };
      },
      withOptions(e) {
        return { ...this, ...e };
      },
    };
  }
  var n = (function () {
      if ("u" < typeof window || !window.GestureEvent) return 50;
      try {
        let e = navigator.userAgent?.match(/version\/([\d\.]+) safari/i);
        return parseFloat(e[1]) >= 17 ? 120 : 320;
      } catch {
        return 320;
      }
    })(),
    a = new Map(),
    i = { history: "replace", scroll: !1, shallow: !0, throttleMs: n },
    s = new Set(),
    u = 0,
    o = null,
    v = {
      all: (t = t || new Map()),
      on: function (e, r) {
        var l = t.get(e);
        l ? l.push(r) : t.set(e, [r]);
      },
      off: function (e, r) {
        var l = t.get(e);
        l && (r ? l.splice(l.indexOf(r) >>> 0, 1) : t.set(e, []));
      },
      emit: function (e, r) {
        var l = t.get(e);
        (l &&
          l.slice().map(function (e) {
            e(r);
          }),
          (l = t.get("*")) &&
            l.slice().map(function (t) {
              t(e, r);
            }));
      },
    };
  return {
    parseEnum: function (e) {
      return m({
        parse: (t) => (e.includes(t) ? t : null),
        serialize: (e) => e.toString(),
      });
    },
    useQueryState: function (
      e,
      {
        history: t = "replace",
        shallow: i = !0,
        scroll: s = !1,
        throttleMs: u = n,
        parse: o = (e) => e,
        serialize: d = String,
        eq: m = (e, t) => e === t,
        defaultValue: h,
        clearOnDefault: b = !0,
        startTransition: g,
      } = {
        history: "replace",
        scroll: !1,
        shallow: !0,
        throttleMs: n,
        parse: (e) => e,
        serialize: String,
        eq: (e, t) => e === t,
        clearOnDefault: !0,
        defaultValue: void 0,
      },
    ) {
      let y = (0, r.J)(),
        S = y.searchParams,
        x = (0, p.useRef)(S?.get(e) ?? null),
        [w, N] = (0, p.useState)(() => {
          let t = a.get(e),
            r = void 0 === t ? (S?.get(e) ?? null) : t;
          return null === r ? null : l(o, r, e);
        }),
        E = (0, p.useRef)(w);
      ((0, r.h)(
        "[nuqs `%s`] render - state: %O, iSP: %s",
        e,
        w,
        S?.get(e) ?? null,
      ),
        (0, p.useEffect)(() => {
          let t = S?.get(e) ?? null;
          if (t === x.current) return;
          let n = null === t ? null : l(o, t, e);
          ((0, r.h)("[nuqs `%s`] syncFromUseSearchParams %O", e, n),
            (E.current = n),
            (x.current = t),
            N(n));
        }, [S?.get(e), e]),
        (0, p.useEffect)(() => {
          function t({ state: l, query: n }) {
            ((0, r.h)("[nuqs `%s`] updateInternalState %O", e, l),
              (E.current = l),
              (x.current = n),
              N(l));
          }
          return (
            (0, r.h)("[nuqs `%s`] subscribing to sync", e),
            v.on(e, t),
            () => {
              ((0, r.h)("[nuqs `%s`] unsubscribing from sync", e), v.off(e, t));
            }
          );
        }, [e]));
      let M = (0, p.useCallback)(
        (r, l = {}) => {
          let n = "function" == typeof r ? r(E.current ?? h ?? null) : r;
          (l.clearOnDefault ?? b) &&
            null !== n &&
            void 0 !== h &&
            m(n, h) &&
            (n = null);
          let a = c(e, n, d, {
            history: l.history ?? t,
            shallow: l.shallow ?? i,
            scroll: l.scroll ?? s,
            throttleMs: l.throttleMs ?? u,
            startTransition: l.startTransition ?? g,
          });
          return (v.emit(e, { state: n, query: a }), f(y));
        },
        [
          e,
          t,
          i,
          s,
          u,
          g,
          y.updateUrl,
          y.getSearchParamsSnapshot,
          y.rateLimitFactor,
        ],
      );
      return [w ?? h ?? null, M];
    },
  };
}
