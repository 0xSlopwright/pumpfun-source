// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = e.r(127142),
    o = {
      childContextTypes: !0,
      contextType: !0,
      contextTypes: !0,
      defaultProps: !0,
      displayName: !0,
      getDefaultProps: !0,
      getDerivedStateFromError: !0,
      getDerivedStateFromProps: !0,
      mixins: !0,
      propTypes: !0,
      type: !0,
    },
    i = {
      name: !0,
      length: !0,
      prototype: !0,
      caller: !0,
      callee: !0,
      arguments: !0,
      arity: !0,
    },
    a = {
      $$typeof: !0,
      compare: !0,
      defaultProps: !0,
      displayName: !0,
      propTypes: !0,
      type: !0,
    },
    l = {};
  function s(e) {
    return r.isMemo(e) ? a : l[e.$$typeof] || o;
  }
  ((l[r.ForwardRef] = {
    $$typeof: !0,
    render: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0,
  }),
    (l[r.Memo] = a));
  var u = Object.defineProperty,
    c = Object.getOwnPropertyNames,
    f = Object.getOwnPropertySymbols,
    d = Object.getOwnPropertyDescriptor,
    p = Object.getPrototypeOf,
    g = Object.prototype;
  t.exports = function e(t, n, r) {
    if ("string" != typeof n) {
      if (g) {
        var o = p(n);
        o && o !== g && e(t, o, r);
      }
      var a = c(n);
      f && (a = a.concat(f(n)));
      for (var l = s(t), v = s(n), m = 0; m < a.length; ++m) {
        var h = a[m];
        if (!i[h] && !(r && r[h]) && !(v && v[h]) && !(l && l[h])) {
          var y = d(n, h);
          try {
            u(t, h, y);
          } catch (e) {}
        }
      }
    }
    return t;
  };
};
