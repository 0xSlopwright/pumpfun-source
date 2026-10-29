// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    a = "~";
  function s() {}
  function i(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function o(e, t, n, r, s) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var o = new i(n, r || e, s),
      l = a ? a + t : t;
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
    0 == --e._eventsCount ? (e._events = new s()) : delete e._events[t];
  }
  function c() {
    ((this._events = new s()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((s.prototype = Object.create(null)), new s().__proto__ || (a = !1)),
    (c.prototype.eventNames = function () {
      var e,
        t,
        n = [];
      if (0 === this._eventsCount) return n;
      for (t in (e = this._events)) r.call(e, t) && n.push(a ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(e))
        : n;
    }),
    (c.prototype.listeners = function (e) {
      var t = a ? a + e : e,
        n = this._events[t];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, s = n.length, i = Array(s); r < s; r++) i[r] = n[r].fn;
      return i;
    }),
    (c.prototype.listenerCount = function (e) {
      var t = a ? a + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (c.prototype.emit = function (e, t, n, r, s, i) {
      var o = a ? a + e : e;
      if (!this._events[o]) return !1;
      var l,
        c,
        u = this._events[o],
        d = arguments.length;
      if (u.fn) {
        switch ((u.once && this.removeListener(e, u.fn, void 0, !0), d)) {
          case 1:
            return (u.fn.call(u.context), !0);
          case 2:
            return (u.fn.call(u.context, t), !0);
          case 3:
            return (u.fn.call(u.context, t, n), !0);
          case 4:
            return (u.fn.call(u.context, t, n, r), !0);
          case 5:
            return (u.fn.call(u.context, t, n, r, s), !0);
          case 6:
            return (u.fn.call(u.context, t, n, r, s, i), !0);
        }
        for (c = 1, l = Array(d - 1); c < d; c++) l[c - 1] = arguments[c];
        u.fn.apply(u.context, l);
      } else {
        var f,
          m = u.length;
        for (c = 0; c < m; c++)
          switch (
            (u[c].once && this.removeListener(e, u[c].fn, void 0, !0), d)
          ) {
            case 1:
              u[c].fn.call(u[c].context);
              break;
            case 2:
              u[c].fn.call(u[c].context, t);
              break;
            case 3:
              u[c].fn.call(u[c].context, t, n);
              break;
            case 4:
              u[c].fn.call(u[c].context, t, n, r);
              break;
            default:
              if (!l)
                for (f = 1, l = Array(d - 1); f < d; f++)
                  l[f - 1] = arguments[f];
              u[c].fn.apply(u[c].context, l);
          }
      }
      return !0;
    }),
    (c.prototype.on = function (e, t, n) {
      return o(this, e, t, n, !1);
    }),
    (c.prototype.once = function (e, t, n) {
      return o(this, e, t, n, !0);
    }),
    (c.prototype.removeListener = function (e, t, n, r) {
      var s = a ? a + e : e;
      if (!this._events[s]) return this;
      if (!t) return (l(this, s), this);
      var i = this._events[s];
      if (i.fn)
        i.fn !== t || (r && !i.once) || (n && i.context !== n) || l(this, s);
      else {
        for (var o = 0, c = [], u = i.length; o < u; o++)
          (i[o].fn !== t || (r && !i[o].once) || (n && i[o].context !== n)) &&
            c.push(i[o]);
        c.length ? (this._events[s] = 1 === c.length ? c[0] : c) : l(this, s);
      }
      return this;
    }),
    (c.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = a ? a + e : e), this._events[t] && l(this, t))
          : ((this._events = new s()), (this._eventsCount = 0)),
        this
      );
    }),
    (c.prototype.off = c.prototype.removeListener),
    (c.prototype.addListener = c.prototype.on),
    (c.prefixed = a),
    (c.EventEmitter = c),
    (t.exports = c));
};
