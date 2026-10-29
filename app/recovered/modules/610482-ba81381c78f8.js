// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    s = "~";
  function i() {}
  function a(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function o(e, t, n, r, i) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var o = new a(n, r || e, i),
      l = s ? s + t : t;
    return (
      e._events[l]
        ? e._events[l].fn
          ? (e._events[l] = [e._events[l], o])
          : e._events[l].push(o)
        : ((e._events[l] = o), e._eventsCount++),
      e
    );
  }
  function l(e, t) {
    0 == --e._eventsCount ? (e._events = new i()) : delete e._events[t];
  }
  function u() {
    ((this._events = new i()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((i.prototype = Object.create(null)), new i().__proto__ || (s = !1)),
    (u.prototype.eventNames = function () {
      var e,
        t,
        n = [];
      if (0 === this._eventsCount) return n;
      for (t in (e = this._events)) r.call(e, t) && n.push(s ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(e))
        : n;
    }),
    (u.prototype.listeners = function (e) {
      var t = s ? s + e : e,
        n = this._events[t];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, i = n.length, a = Array(i); r < i; r++) a[r] = n[r].fn;
      return a;
    }),
    (u.prototype.listenerCount = function (e) {
      var t = s ? s + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (u.prototype.emit = function (e, t, n, r, i, a) {
      var o = s ? s + e : e;
      if (!this._events[o]) return !1;
      var l,
        u,
        c = this._events[o],
        d = arguments.length;
      if (c.fn) {
        switch ((c.once && this.removeListener(e, c.fn, void 0, !0), d)) {
          case 1:
            return (c.fn.call(c.context), !0);
          case 2:
            return (c.fn.call(c.context, t), !0);
          case 3:
            return (c.fn.call(c.context, t, n), !0);
          case 4:
            return (c.fn.call(c.context, t, n, r), !0);
          case 5:
            return (c.fn.call(c.context, t, n, r, i), !0);
          case 6:
            return (c.fn.call(c.context, t, n, r, i, a), !0);
        }
        for (u = 1, l = Array(d - 1); u < d; u++) l[u - 1] = arguments[u];
        c.fn.apply(c.context, l);
      } else {
        var f,
          m = c.length;
        for (u = 0; u < m; u++)
          switch (
            (c[u].once && this.removeListener(e, c[u].fn, void 0, !0), d)
          ) {
            case 1:
              c[u].fn.call(c[u].context);
              break;
            case 2:
              c[u].fn.call(c[u].context, t);
              break;
            case 3:
              c[u].fn.call(c[u].context, t, n);
              break;
            case 4:
              c[u].fn.call(c[u].context, t, n, r);
              break;
            default:
              if (!l)
                for (f = 1, l = Array(d - 1); f < d; f++)
                  l[f - 1] = arguments[f];
              c[u].fn.apply(c[u].context, l);
          }
      }
      return !0;
    }),
    (u.prototype.on = function (e, t, n) {
      return o(this, e, t, n, !1);
    }),
    (u.prototype.once = function (e, t, n) {
      return o(this, e, t, n, !0);
    }),
    (u.prototype.removeListener = function (e, t, n, r) {
      var i = s ? s + e : e;
      if (!this._events[i]) return this;
      if (!t) return (l(this, i), this);
      var a = this._events[i];
      if (a.fn)
        a.fn !== t || (r && !a.once) || (n && a.context !== n) || l(this, i);
      else {
        for (var o = 0, u = [], c = a.length; o < c; o++)
          (a[o].fn !== t || (r && !a[o].once) || (n && a[o].context !== n)) &&
            u.push(a[o]);
        u.length ? (this._events[i] = 1 === u.length ? u[0] : u) : l(this, i);
      }
      return this;
    }),
    (u.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = s ? s + e : e), this._events[t] && l(this, t))
          : ((this._events = new i()), (this._eventsCount = 0)),
        this
      );
    }),
    (u.prototype.off = u.prototype.removeListener),
    (u.prototype.addListener = u.prototype.on),
    (u.prefixed = s),
    (u.EventEmitter = u),
    (t.exports = u));
};
