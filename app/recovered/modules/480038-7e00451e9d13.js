// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var n,
    o = Symbol.for("react.element"),
    i = Symbol.for("react.portal"),
    a = Symbol.for("react.fragment"),
    u = Symbol.for("react.strict_mode"),
    c = Symbol.for("react.profiler"),
    l = Symbol.for("react.provider"),
    s = Symbol.for("react.context"),
    f = Symbol.for("react.server_context"),
    p = Symbol.for("react.forward_ref"),
    d = Symbol.for("react.suspense"),
    h = Symbol.for("react.suspense_list"),
    y = Symbol.for("react.memo"),
    v = Symbol.for("react.lazy"),
    m = Symbol.for("react.offscreen");
  function b(t) {
    if ("object" == typeof t && null !== t) {
      var e = t.$$typeof;
      switch (e) {
        case o:
          switch ((t = t.type)) {
            case a:
            case c:
            case u:
            case d:
            case h:
              return t;
            default:
              switch ((t = t && t.$$typeof)) {
                case f:
                case s:
                case p:
                case v:
                case y:
                case l:
                  return t;
                default:
                  return e;
              }
          }
        case i:
          return e;
      }
    }
  }
  ((n = Symbol.for("react.module.reference")),
    (r.ContextConsumer = s),
    (r.ContextProvider = l),
    (r.Element = o),
    (r.ForwardRef = p),
    (r.Fragment = a),
    (r.Lazy = v),
    (r.Memo = y),
    (r.Portal = i),
    (r.Profiler = c),
    (r.StrictMode = u),
    (r.Suspense = d),
    (r.SuspenseList = h),
    (r.isAsyncMode = function () {
      return !1;
    }),
    (r.isConcurrentMode = function () {
      return !1;
    }),
    (r.isContextConsumer = function (t) {
      return b(t) === s;
    }),
    (r.isContextProvider = function (t) {
      return b(t) === l;
    }),
    (r.isElement = function (t) {
      return "object" == typeof t && null !== t && t.$$typeof === o;
    }),
    (r.isForwardRef = function (t) {
      return b(t) === p;
    }),
    (r.isFragment = function (t) {
      return b(t) === a;
    }),
    (r.isLazy = function (t) {
      return b(t) === v;
    }),
    (r.isMemo = function (t) {
      return b(t) === y;
    }),
    (r.isPortal = function (t) {
      return b(t) === i;
    }),
    (r.isProfiler = function (t) {
      return b(t) === c;
    }),
    (r.isStrictMode = function (t) {
      return b(t) === u;
    }),
    (r.isSuspense = function (t) {
      return b(t) === d;
    }),
    (r.isSuspenseList = function (t) {
      return b(t) === h;
    }),
    (r.isValidElementType = function (t) {
      return (
        "string" == typeof t ||
        "function" == typeof t ||
        t === a ||
        t === c ||
        t === u ||
        t === d ||
        t === h ||
        t === m ||
        ("object" == typeof t &&
          null !== t &&
          (t.$$typeof === v ||
            t.$$typeof === y ||
            t.$$typeof === l ||
            t.$$typeof === s ||
            t.$$typeof === p ||
            t.$$typeof === n ||
            void 0 !== t.getModuleId)) ||
        !1
      );
    }),
    (r.typeOf = b));
};
