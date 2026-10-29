// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(732486),
    r = e.i(445242),
    n = e.i(352386),
    a = e.i(466931),
    i = e.i(266300);
  let o = null,
    s = new Set(),
    l = (e) => {
      for (let t of ((o = e), s)) t();
    },
    c = (e) => (
      s.add(e),
      () => {
        s.delete(e);
      }
    ),
    u = () => o,
    d = () => null,
    f = (0, n.createContext)(!1),
    p = Symbol.for("react.context"),
    m = (e) => "object" == typeof e && null !== e && e.$$typeof === p;
  function g({ contexts: e }) {
    let t = [];
    for (let r of e) t.push((0, n.use)(r));
    return (
      (0, n.useLayoutEffect)(() => {
        let r;
        (o?.contexts === e &&
          ((r = o.values),
          r.length === t.length && r.every((e, r) => Object.is(e, t[r])))) ||
          (l({ contexts: e, values: t }), (0, i.d)());
      }),
      (0, n.useLayoutEffect)(() => () => l(null), []),
      null
    );
  }
  function h(e) {
    let t,
      i,
      o = (0, r.c)(3),
      { onUnavailable: s } = e;
    return (
      o[0] !== s
        ? ((t = () => {
            ((0, a.l)({
              error: Error("Privy tree providers not found above the capture"),
              feature: "auth",
              operation: "privy-context-bridge",
            }),
              s());
          }),
          (i = [s]),
          (o[0] = s),
          (o[1] = t),
          (o[2] = i))
        : ((t = o[1]), (i = o[2])),
      (0, n.useLayoutEffect)(t, i),
      null
    );
  }
  class y extends n.Component {
    contexts;
    render() {
      return (
        void 0 === this.contexts &&
          (this.contexts = ((e) => {
            let t = new Set();
            for (let r = e?.return ?? null; r; r = r.return) {
              if (r.type === f) return [...t].reverse();
              m(r.type) && t.add(r.type);
            }
            return null;
          })(this._reactInternals)),
        this.contexts?.length
          ? (0, t.jsx)(g, { contexts: this.contexts })
          : (0, t.jsx)(h, { onUnavailable: this.props.onUnavailable })
      );
    }
  }
  function b() {
    (0, i.d)();
  }
  function x() {}
  e.s([
    "p",
    0,
    y,
    "R",
    0,
    function (e) {
      let { children: r, fallback: a } = e,
        i = (0, n.use)(f),
        o = (0, n.useSyncExternalStore)(c, u, d);
      if (i) return r;
      if (!o) return void 0 === a ? null : a;
      let s = r;
      for (let e = o.contexts.length - 1; e >= 0; e -= 1) {
        let r = o.contexts[e];
        s = (0, t.jsx)(r, { value: o.values[e], children: s });
      }
      return s;
    },
    "_",
    0,
    f,
    "j",
    0,
    function () {
      let e,
        t = (0, r.c)(1);
      return (
        t[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((e = []), (t[0] = e))
          : (e = t[0]),
        (0, n.useEffect)(b, e),
        null
      );
    },
    "m",
    0,
    function (e) {
      let t,
        a = (0, r.c)(2);
      return (
        a[0] !== e
          ? ((t = () =>
              ((e) => {
                if (!o) return;
                let t = o.contexts.indexOf(e);
                return -1 === t ? void 0 : o.values[t];
              })(e)),
            (a[0] = e),
            (a[1] = t))
          : (t = a[1]),
        (0, n.useSyncExternalStore)(c, t, x)
      );
    },
  ]);
};
