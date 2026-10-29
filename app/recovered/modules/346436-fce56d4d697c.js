// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, a) => {
  (e.i(149502),
    Object.defineProperty(a, "__esModule", { value: !0 }),
    Object.defineProperty(a, "HTTPAccessFallbackBoundary", {
      enumerable: !0,
      get: function () {
        return c;
      },
    }));
  let n = e.r(56421),
    u = e.r(732486),
    r = n._(e.r(352386)),
    l = e.r(497279),
    s = e.r(835932),
    i = e.r(8001);
  class o extends r.default.Component {
    constructor(e) {
      (super(e),
        (this.state = {
          triggeredStatus: void 0,
          previousPathname: e.pathname,
        }));
    }
    componentDidCatch() {}
    static getDerivedStateFromError(e) {
      if ((0, s.isHTTPAccessFallbackError)(e))
        return { triggeredStatus: (0, s.getAccessFallbackHTTPStatus)(e) };
      throw e;
    }
    static getDerivedStateFromProps(e, t) {
      return e.pathname !== t.previousPathname && t.triggeredStatus
        ? { triggeredStatus: void 0, previousPathname: e.pathname }
        : { triggeredStatus: t.triggeredStatus, previousPathname: e.pathname };
    }
    render() {
      let {
          notFound: e,
          forbidden: t,
          unauthorized: a,
          children: n,
        } = this.props,
        { triggeredStatus: r } = this.state,
        l = {
          [s.HTTPAccessErrorStatus.NOT_FOUND]: e,
          [s.HTTPAccessErrorStatus.FORBIDDEN]: t,
          [s.HTTPAccessErrorStatus.UNAUTHORIZED]: a,
        };
      if (r) {
        let i = r === s.HTTPAccessErrorStatus.NOT_FOUND && e,
          o = r === s.HTTPAccessErrorStatus.FORBIDDEN && t,
          c = r === s.HTTPAccessErrorStatus.UNAUTHORIZED && a;
        return i || o || c
          ? (0, u.jsxs)(u.Fragment, {
              children: [
                (0, u.jsx)("meta", { name: "robots", content: "noindex" }),
                !1,
                l[r],
              ],
            })
          : n;
      }
      return n;
    }
  }
  function c({ notFound: e, forbidden: t, unauthorized: a, children: n }) {
    let s = (0, l.useUntrackedPathname)(),
      d = (0, r.useContext)(i.MissingSlotContext);
    return e || t || a
      ? (0, u.jsx)(o, {
          pathname: s,
          notFound: e,
          forbidden: t,
          unauthorized: a,
          missingSlots: d,
          children: n,
        })
      : (0, u.jsx)(u.Fragment, { children: n });
  }
  ("function" == typeof a.default ||
    ("object" == typeof a.default && null !== a.default)) &&
    void 0 === a.default.__esModule &&
    (Object.defineProperty(a.default, "__esModule", { value: !0 }),
    Object.assign(a.default, a),
    (t.exports = a.default));
};
