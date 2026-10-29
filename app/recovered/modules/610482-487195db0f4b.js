// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    o = "~";
  function i() {}
  function s(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function a(e, t, n, r, i) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var a = new s(n, r || e, i),
      l = o ? o + t : t;
    return (
      e._events[l]
        ? e._events[l].fn
          ? (e._events[l] = [e._events[l], a])
          : e._events[l].push(a)
        : ((e._events[l] = a), e._eventsCount++),
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
    ((i.prototype = Object.create(null)), new i().__proto__ || (o = !1)),
    (u.prototype.eventNames = function () {
      var e,
        t,
        n = [];
      if (0 === this._eventsCount) return n;
      for (t in (e = this._events)) r.call(e, t) && n.push(o ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(e))
        : n;
    }),
    (u.prototype.listeners = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, i = n.length, s = Array(i); r < i; r++) s[r] = n[r].fn;
      return s;
    }),
    (u.prototype.listenerCount = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (u.prototype.emit = function (e, t, n, r, i, s) {
      var a = o ? o + e : e;
      if (!this._events[a]) return !1;
      var l,
        u,
        c = this._events[a],
        f = arguments.length;
      if (c.fn) {
        switch ((c.once && this.removeListener(e, c.fn, void 0, !0), f)) {
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
            return (c.fn.call(c.context, t, n, r, i, s), !0);
        }
        for (u = 1, l = Array(f - 1); u < f; u++) l[u - 1] = arguments[u];
        c.fn.apply(c.context, l);
      } else {
        var h,
          p = c.length;
        for (u = 0; u < p; u++)
          switch (
            (c[u].once && this.removeListener(e, c[u].fn, void 0, !0), f)
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
                for (h = 1, l = Array(f - 1); h < f; h++)
                  l[h - 1] = arguments[h];
              c[u].fn.apply(c[u].context, l);
          }
      }
      return !0;
    }),
    (u.prototype.on = function (e, t, n) {
      return a(this, e, t, n, !1);
    }),
    (u.prototype.once = function (e, t, n) {
      return a(this, e, t, n, !0);
    }),
    (u.prototype.removeListener = function (e, t, n, r) {
      var i = o ? o + e : e;
      if (!this._events[i]) return this;
      if (!t) return (l(this, i), this);
      var s = this._events[i];
      if (s.fn)
        s.fn !== t || (r && !s.once) || (n && s.context !== n) || l(this, i);
      else {
        for (var a = 0, u = [], c = s.length; a < c; a++)
          (s[a].fn !== t || (r && !s[a].once) || (n && s[a].context !== n)) &&
            u.push(s[a]);
        u.length ? (this._events[i] = 1 === u.length ? u[0] : u) : l(this, i);
      }
      return this;
    }),
    (u.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = o ? o + e : e), this._events[t] && l(this, t))
          : ((this._events = new i()), (this._eventsCount = 0)),
        this
      );
    }),
    (u.prototype.off = u.prototype.removeListener),
    (u.prototype.addListener = u.prototype.on),
    (u.prefixed = o),
    (u.EventEmitter = u),
    (t.exports = u));
};
