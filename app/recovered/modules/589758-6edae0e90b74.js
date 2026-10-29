// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = e.i(149502),
    o = Symbol.for("react.transitional.element"),
    u = Symbol.for("react.portal"),
    i = Symbol.for("react.fragment"),
    a = Symbol.for("react.strict_mode"),
    l = Symbol.for("react.profiler"),
    c = Symbol.for("react.consumer"),
    f = Symbol.for("react.context"),
    s = Symbol.for("react.forward_ref"),
    d = Symbol.for("react.suspense"),
    p = Symbol.for("react.memo"),
    y = Symbol.for("react.lazy"),
    _ = Symbol.for("react.activity"),
    b = Symbol.for("react.view_transition"),
    m = Symbol.iterator,
    v = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    h = Object.assign,
    g = {};
  function O(e, t, r) {
    ((this.props = e),
      (this.context = t),
      (this.refs = g),
      (this.updater = r || v));
  }
  function R() {}
  function P(e, t, r) {
    ((this.props = e),
      (this.context = t),
      (this.refs = g),
      (this.updater = r || v));
  }
  ((O.prototype.isReactComponent = {}),
    (O.prototype.setState = function (e, t) {
      if ("object" != typeof e && "function" != typeof e && null != e)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, e, t, "setState");
    }),
    (O.prototype.forceUpdate = function (e) {
      this.updater.enqueueForceUpdate(this, e, "forceUpdate");
    }),
    (R.prototype = O.prototype));
  var E = (P.prototype = new R());
  ((E.constructor = P), h(E, O.prototype), (E.isPureReactComponent = !0));
  var S = Array.isArray;
  function j() {}
  var T = { H: null, A: null, T: null, S: null },
    C = Object.prototype.hasOwnProperty;
  function x(e, t, r) {
    var n = r.ref;
    return {
      $$typeof: o,
      type: e,
      key: t,
      ref: void 0 !== n ? n : null,
      props: r,
    };
  }
  function w(e) {
    return "object" == typeof e && null !== e && e.$$typeof === o;
  }
  var M = /\/+/g;
  function A(e, t) {
    var r, n;
    return "object" == typeof e && null !== e && null != e.key
      ? ((r = "" + e.key),
        (n = { "=": "=0", ":": "=2" }),
        "$" +
          r.replace(/[=:]/g, function (e) {
            return n[e];
          }))
      : t.toString(36);
  }
  function L(e, t, r) {
    if (null == e) return e;
    var n = [],
      i = 0;
    return (
      !(function e(t, r, n, i, a) {
        var l,
          c,
          f,
          s = typeof t;
        ("undefined" === s || "boolean" === s) && (t = null);
        var d = !1;
        if (null === t) d = !0;
        else
          switch (s) {
            case "bigint":
            case "string":
            case "number":
              d = !0;
              break;
            case "object":
              switch (t.$$typeof) {
                case o:
                case u:
                  d = !0;
                  break;
                case y:
                  return e((d = t._init)(t._payload), r, n, i, a);
              }
          }
        if (d)
          return (
            (a = a(t)),
            (d = "" === i ? "." + A(t, 0) : i),
            S(a)
              ? ((n = ""),
                null != d && (n = d.replace(M, "$&/") + "/"),
                e(a, r, n, "", function (e) {
                  return e;
                }))
              : null != a &&
                (w(a) &&
                  ((l = a),
                  (c =
                    n +
                    (null == a.key || (t && t.key === a.key)
                      ? ""
                      : ("" + a.key).replace(M, "$&/") + "/") +
                    d),
                  (a = x(l.type, c, l.props))),
                r.push(a)),
            1
          );
        d = 0;
        var p = "" === i ? "." : i + ":";
        if (S(t))
          for (var _ = 0; _ < t.length; _++)
            ((s = p + A((i = t[_]), _)), (d += e(i, r, n, s, a)));
        else if (
          "function" ==
          typeof (_ =
            null === (f = t) || "object" != typeof f
              ? null
              : "function" == typeof (f = (m && f[m]) || f["@@iterator"])
                ? f
                : null)
        )
          for (t = _.call(t), _ = 0; !(i = t.next()).done; )
            ((s = p + A((i = i.value), _++)), (d += e(i, r, n, s, a)));
        else if ("object" === s) {
          if ("function" == typeof t.then)
            return e(
              (function (e) {
                switch (e.status) {
                  case "fulfilled":
                    return e.value;
                  case "rejected":
                    throw e.reason;
                  default:
                    switch (
                      ("string" == typeof e.status
                        ? e.then(j, j)
                        : ((e.status = "pending"),
                          e.then(
                            function (t) {
                              "pending" === e.status &&
                                ((e.status = "fulfilled"), (e.value = t));
                            },
                            function (t) {
                              "pending" === e.status &&
                                ((e.status = "rejected"), (e.reason = t));
                            },
                          )),
                      e.status)
                    ) {
                      case "fulfilled":
                        return e.value;
                      case "rejected":
                        throw e.reason;
                    }
                }
                throw e;
              })(t),
              r,
              n,
              i,
              a,
            );
          throw Error(
            "Objects are not valid as a React child (found: " +
              ("[object Object]" === (r = String(t))
                ? "object with keys {" + Object.keys(t).join(", ") + "}"
                : r) +
              "). If you meant to render a collection of children, use an array instead.",
          );
        }
        return d;
      })(e, n, "", "", function (e) {
        return t.call(r, e, i++);
      }),
      n
    );
  }
  function D(e) {
    if (-1 === e._status) {
      var t = (0, e._result)();
      (t.then(
        function (r) {
          (0 === e._status || -1 === e._status) &&
            ((e._status = 1),
            (e._result = r),
            void 0 === t.status && ((t.status = "fulfilled"), (t.value = r)));
        },
        function (r) {
          (0 === e._status || -1 === e._status) &&
            ((e._status = 2),
            (e._result = r),
            void 0 === t.status && ((t.status = "rejected"), (t.reason = r)));
        },
      ),
        -1 === e._status && ((e._status = 0), (e._result = t)));
    }
    if (1 === e._status) return e._result.default;
    throw e._result;
  }
  var N =
    "function" == typeof reportError
      ? reportError
      : function (e) {
          if (
            "object" == typeof window &&
            "function" == typeof window.ErrorEvent
          ) {
            var t = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                "object" == typeof e &&
                null !== e &&
                "string" == typeof e.message
                  ? String(e.message)
                  : String(e),
              error: e,
            });
            if (!window.dispatchEvent(t)) return;
          } else if (
            "object" == typeof n.default &&
            "function" == typeof n.default.emit
          )
            return void n.default.emit("uncaughtException", e);
          console.error(e);
        };
  function H(e) {
    var t = T.T,
      r = {};
    ((r.types = null !== t ? t.types : null), (T.T = r));
    try {
      var n = e(),
        o = T.S;
      (null !== o && o(r, n),
        "object" == typeof n &&
          null !== n &&
          "function" == typeof n.then &&
          n.then(j, N));
    } catch (e) {
      N(e);
    } finally {
      (null !== t && null !== r.types && (t.types = r.types), (T.T = t));
    }
  }
  function k(e) {
    var t = T.T;
    if (null !== t) {
      var r = t.types;
      null === r ? (t.types = [e]) : -1 === r.indexOf(e) && r.push(e);
    } else H(k.bind(null, e));
  }
  ((r.Activity = _),
    (r.Children = {
      map: L,
      forEach: function (e, t, r) {
        L(
          e,
          function () {
            t.apply(this, arguments);
          },
          r,
        );
      },
      count: function (e) {
        var t = 0;
        return (
          L(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          L(e, function (e) {
            return e;
          }) || []
        );
      },
      only: function (e) {
        if (!w(e))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return e;
      },
    }),
    (r.Component = O),
    (r.Fragment = i),
    (r.Profiler = l),
    (r.PureComponent = P),
    (r.StrictMode = a),
    (r.Suspense = d),
    (r.ViewTransition = b),
    (r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T),
    (r.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (e) {
        return T.H.useMemoCache(e);
      },
    }),
    (r.addTransitionType = k),
    (r.cache = function (e) {
      return function () {
        return e.apply(null, arguments);
      };
    }),
    (r.cacheSignal = function () {
      return null;
    }),
    (r.cloneElement = function (e, t, r) {
      if (null == e)
        throw Error(
          "The argument must be a React element, but you passed " + e + ".",
        );
      var n = h({}, e.props),
        o = e.key;
      if (null != t)
        for (u in (void 0 !== t.key && (o = "" + t.key), t))
          C.call(t, u) &&
            "key" !== u &&
            "__self" !== u &&
            "__source" !== u &&
            ("ref" !== u || void 0 !== t.ref) &&
            (n[u] = t[u]);
      var u = arguments.length - 2;
      if (1 === u) n.children = r;
      else if (1 < u) {
        for (var i = Array(u), a = 0; a < u; a++) i[a] = arguments[a + 2];
        n.children = i;
      }
      return x(e.type, o, n);
    }),
    (r.createContext = function (e) {
      return (
        ((e = {
          $$typeof: f,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }).Provider = e),
        (e.Consumer = { $$typeof: c, _context: e }),
        e
      );
    }),
    (r.createElement = function (e, t, r) {
      var n,
        o = {},
        u = null;
      if (null != t)
        for (n in (void 0 !== t.key && (u = "" + t.key), t))
          C.call(t, n) &&
            "key" !== n &&
            "__self" !== n &&
            "__source" !== n &&
            (o[n] = t[n]);
      var i = arguments.length - 2;
      if (1 === i) o.children = r;
      else if (1 < i) {
        for (var a = Array(i), l = 0; l < i; l++) a[l] = arguments[l + 2];
        o.children = a;
      }
      if (e && e.defaultProps)
        for (n in (i = e.defaultProps)) void 0 === o[n] && (o[n] = i[n]);
      return x(e, u, o);
    }),
    (r.createRef = function () {
      return { current: null };
    }),
    (r.forwardRef = function (e) {
      return { $$typeof: s, render: e };
    }),
    (r.isValidElement = w),
    (r.lazy = function (e) {
      return { $$typeof: y, _payload: { _status: -1, _result: e }, _init: D };
    }),
    (r.memo = function (e, t) {
      return { $$typeof: p, type: e, compare: void 0 === t ? null : t };
    }),
    (r.startTransition = H),
    (r.unstable_useCacheRefresh = function () {
      return T.H.useCacheRefresh();
    }),
    (r.use = function (e) {
      return T.H.use(e);
    }),
    (r.useActionState = function (e, t, r) {
      return T.H.useActionState(e, t, r);
    }),
    (r.useCallback = function (e, t) {
      return T.H.useCallback(e, t);
    }),
    (r.useContext = function (e) {
      return T.H.useContext(e);
    }),
    (r.useDebugValue = function () {}),
    (r.useDeferredValue = function (e, t) {
      return T.H.useDeferredValue(e, t);
    }),
    (r.useEffect = function (e, t) {
      return T.H.useEffect(e, t);
    }),
    (r.useEffectEvent = function (e) {
      return T.H.useEffectEvent(e);
    }),
    (r.useId = function () {
      return T.H.useId();
    }),
    (r.useImperativeHandle = function (e, t, r) {
      return T.H.useImperativeHandle(e, t, r);
    }),
    (r.useInsertionEffect = function (e, t) {
      return T.H.useInsertionEffect(e, t);
    }),
    (r.useLayoutEffect = function (e, t) {
      return T.H.useLayoutEffect(e, t);
    }),
    (r.useMemo = function (e, t) {
      return T.H.useMemo(e, t);
    }),
    (r.useOptimistic = function (e, t) {
      return T.H.useOptimistic(e, t);
    }),
    (r.useReducer = function (e, t, r) {
      return T.H.useReducer(e, t, r);
    }),
    (r.useRef = function (e) {
      return T.H.useRef(e);
    }),
    (r.useState = function (e) {
      return T.H.useState(e);
    }),
    (r.useSyncExternalStore = function (e, t, r) {
      return T.H.useSyncExternalStore(e, t, r);
    }),
    (r.useTransition = function () {
      return T.H.useTransition();
    }),
    (r.version = "19.3.0-canary-278794d7-20261002"));
};
