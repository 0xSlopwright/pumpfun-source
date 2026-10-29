// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, n) => {
  var r = Object.prototype.hasOwnProperty,
    i = "~";
  function o() {}
  function s(t, e, n) {
    ((this.fn = t), (this.context = e), (this.once = n || !1));
  }
  function a(t, e, n, r, o) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var a = new s(n, r || t, o),
      u = i ? i + e : e;
    return (
      t._events[u]
        ? t._events[u].fn
          ? (t._events[u] = [t._events[u], a])
          : t._events[u].push(a)
        : ((t._events[u] = a), t._eventsCount++),
      t
    );
  }
  function u(t, e) {
    0 == --t._eventsCount ? (t._events = new o()) : delete t._events[e];
  }
  function c() {
    ((this._events = new o()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((o.prototype = Object.create(null)), new o().__proto__ || (i = !1)),
    (c.prototype.eventNames = function () {
      var t,
        e,
        n = [];
      if (0 === this._eventsCount) return n;
      for (e in (t = this._events)) r.call(t, e) && n.push(i ? e.slice(1) : e);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(t))
        : n;
    }),
    (c.prototype.listeners = function (t) {
      var e = i ? i + t : t,
        n = this._events[e];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, o = n.length, s = Array(o); r < o; r++) s[r] = n[r].fn;
      return s;
    }),
    (c.prototype.listenerCount = function (t) {
      var e = i ? i + t : t,
        n = this._events[e];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (c.prototype.emit = function (t, e, n, r, o, s) {
      var a = i ? i + t : t;
      if (!this._events[a]) return !1;
      var u,
        c,
        l = this._events[a],
        f = arguments.length;
      if (l.fn) {
        switch ((l.once && this.removeListener(t, l.fn, void 0, !0), f)) {
          case 1:
            return (l.fn.call(l.context), !0);
          case 2:
            return (l.fn.call(l.context, e), !0);
          case 3:
            return (l.fn.call(l.context, e, n), !0);
          case 4:
            return (l.fn.call(l.context, e, n, r), !0);
          case 5:
            return (l.fn.call(l.context, e, n, r, o), !0);
          case 6:
            return (l.fn.call(l.context, e, n, r, o, s), !0);
        }
        for (c = 1, u = Array(f - 1); c < f; c++) u[c - 1] = arguments[c];
        l.fn.apply(l.context, u);
      } else {
        var h,
          p = l.length;
        for (c = 0; c < p; c++)
          switch (
            (l[c].once && this.removeListener(t, l[c].fn, void 0, !0), f)
          ) {
            case 1:
              l[c].fn.call(l[c].context);
              break;
            case 2:
              l[c].fn.call(l[c].context, e);
              break;
            case 3:
              l[c].fn.call(l[c].context, e, n);
              break;
            case 4:
              l[c].fn.call(l[c].context, e, n, r);
              break;
            default:
              if (!u)
                for (h = 1, u = Array(f - 1); h < f; h++)
                  u[h - 1] = arguments[h];
              l[c].fn.apply(l[c].context, u);
          }
      }
      return !0;
    }),
    (c.prototype.on = function (t, e, n) {
      return a(this, t, e, n, !1);
    }),
    (c.prototype.once = function (t, e, n) {
      return a(this, t, e, n, !0);
    }),
    (c.prototype.removeListener = function (t, e, n, r) {
      var o = i ? i + t : t;
      if (!this._events[o]) return this;
      if (!e) return (u(this, o), this);
      var s = this._events[o];
      if (s.fn)
        s.fn !== e || (r && !s.once) || (n && s.context !== n) || u(this, o);
      else {
        for (var a = 0, c = [], l = s.length; a < l; a++)
          (s[a].fn !== e || (r && !s[a].once) || (n && s[a].context !== n)) &&
            c.push(s[a]);
        c.length ? (this._events[o] = 1 === c.length ? c[0] : c) : u(this, o);
      }
      return this;
    }),
    (c.prototype.removeAllListeners = function (t) {
      var e;
      return (
        t
          ? ((e = i ? i + t : t), this._events[e] && u(this, e))
          : ((this._events = new o()), (this._eventsCount = 0)),
        this
      );
    }),
    (c.prototype.off = c.prototype.removeListener),
    (c.prototype.addListener = c.prototype.on),
    (c.prefixed = i),
    (c.EventEmitter = c),
    (e.exports = c));
};
