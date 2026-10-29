// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = "function" == typeof Symbol && Symbol.for,
    o = r ? Symbol.for("react.element") : 60103,
    i = r ? Symbol.for("react.portal") : 60106,
    a = r ? Symbol.for("react.fragment") : 60107,
    l = r ? Symbol.for("react.strict_mode") : 60108,
    s = r ? Symbol.for("react.profiler") : 60114,
    u = r ? Symbol.for("react.provider") : 60109,
    c = r ? Symbol.for("react.context") : 60110,
    f = r ? Symbol.for("react.async_mode") : 60111,
    d = r ? Symbol.for("react.concurrent_mode") : 60111,
    p = r ? Symbol.for("react.forward_ref") : 60112,
    g = r ? Symbol.for("react.suspense") : 60113,
    v = r ? Symbol.for("react.suspense_list") : 60120,
    m = r ? Symbol.for("react.memo") : 60115,
    h = r ? Symbol.for("react.lazy") : 60116,
    y = r ? Symbol.for("react.block") : 60121,
    b = r ? Symbol.for("react.fundamental") : 60117,
    w = r ? Symbol.for("react.responder") : 60118,
    x = r ? Symbol.for("react.scope") : 60119;
  function k(e) {
    if ("object" == typeof e && null !== e) {
      var t = e.$$typeof;
      switch (t) {
        case o:
          switch ((e = e.type)) {
            case f:
            case d:
            case a:
            case s:
            case l:
            case g:
              return e;
            default:
              switch ((e = e && e.$$typeof)) {
                case c:
                case p:
                case h:
                case m:
                case u:
                  return e;
                default:
                  return t;
              }
          }
        case i:
          return t;
      }
    }
  }
  function E(e) {
    return k(e) === d;
  }
  ((n.AsyncMode = f),
    (n.ConcurrentMode = d),
    (n.ContextConsumer = c),
    (n.ContextProvider = u),
    (n.Element = o),
    (n.ForwardRef = p),
    (n.Fragment = a),
    (n.Lazy = h),
    (n.Memo = m),
    (n.Portal = i),
    (n.Profiler = s),
    (n.StrictMode = l),
    (n.Suspense = g),
    (n.isAsyncMode = function (e) {
      return E(e) || k(e) === f;
    }),
    (n.isConcurrentMode = E),
    (n.isContextConsumer = function (e) {
      return k(e) === c;
    }),
    (n.isContextProvider = function (e) {
      return k(e) === u;
    }),
    (n.isElement = function (e) {
      return "object" == typeof e && null !== e && e.$$typeof === o;
    }),
    (n.isForwardRef = function (e) {
      return k(e) === p;
    }),
    (n.isFragment = function (e) {
      return k(e) === a;
    }),
    (n.isLazy = function (e) {
      return k(e) === h;
    }),
    (n.isMemo = function (e) {
      return k(e) === m;
    }),
    (n.isPortal = function (e) {
      return k(e) === i;
    }),
    (n.isProfiler = function (e) {
      return k(e) === s;
    }),
    (n.isStrictMode = function (e) {
      return k(e) === l;
    }),
    (n.isSuspense = function (e) {
      return k(e) === g;
    }),
    (n.isValidElementType = function (e) {
      return (
        "string" == typeof e ||
        "function" == typeof e ||
        e === a ||
        e === d ||
        e === s ||
        e === l ||
        e === g ||
        e === v ||
        ("object" == typeof e &&
          null !== e &&
          (e.$$typeof === h ||
            e.$$typeof === m ||
            e.$$typeof === u ||
            e.$$typeof === c ||
            e.$$typeof === p ||
            e.$$typeof === b ||
            e.$$typeof === w ||
            e.$$typeof === x ||
            e.$$typeof === y))
      );
    }),
    (n.typeOf = k));
};
