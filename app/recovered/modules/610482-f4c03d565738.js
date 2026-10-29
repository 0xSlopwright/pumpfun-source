// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    a = "~";
  function l() {}
  function i(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function o(e, t, n, r, l) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var o = new i(n, r || e, l),
      s = a ? a + t : t;
    return (
      e._events[s]
        ? e._events[s].fn
          ? (e._events[s] = [e._events[s], o])
          : e._events[s].push(o)
        : ((e._events[s] = o), e._eventsCount++),
      e
    );
  }
  function s(e, t) {
    0 == --e._eventsCount ? (e._events = new l()) : delete e._events[t];
  }
  function c() {
    ((this._events = new l()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((l.prototype = Object.create(null)), new l().__proto__ || (a = !1)),
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
      for (var r = 0, l = n.length, i = Array(l); r < l; r++) i[r] = n[r].fn;
      return i;
    }),
    (c.prototype.listenerCount = function (e) {
      var t = a ? a + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (c.prototype.emit = function (e, t, n, r, l, i) {
      var o = a ? a + e : e;
      if (!this._events[o]) return !1;
      var s,
        c,
        u = this._events[o],
        f = arguments.length;
      if (u.fn) {
        switch ((u.once && this.removeListener(e, u.fn, void 0, !0), f)) {
          case 1:
            return (u.fn.call(u.context), !0);
          case 2:
            return (u.fn.call(u.context, t), !0);
          case 3:
            return (u.fn.call(u.context, t, n), !0);
          case 4:
            return (u.fn.call(u.context, t, n, r), !0);
          case 5:
            return (u.fn.call(u.context, t, n, r, l), !0);
          case 6:
            return (u.fn.call(u.context, t, n, r, l, i), !0);
        }
        for (c = 1, s = Array(f - 1); c < f; c++) s[c - 1] = arguments[c];
        u.fn.apply(u.context, s);
      } else {
        var d,
          h = u.length;
        for (c = 0; c < h; c++)
          switch (
            (u[c].once && this.removeListener(e, u[c].fn, void 0, !0), f)
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
              if (!s)
                for (d = 1, s = Array(f - 1); d < f; d++)
                  s[d - 1] = arguments[d];
              u[c].fn.apply(u[c].context, s);
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
      var l = a ? a + e : e;
      if (!this._events[l]) return this;
      if (!t) return (s(this, l), this);
      var i = this._events[l];
      if (i.fn)
        i.fn !== t || (r && !i.once) || (n && i.context !== n) || s(this, l);
      else {
        for (var o = 0, c = [], u = i.length; o < u; o++)
          (i[o].fn !== t || (r && !i[o].once) || (n && i[o].context !== n)) &&
            c.push(i[o]);
        c.length ? (this._events[l] = 1 === c.length ? c[0] : c) : s(this, l);
      }
      return this;
    }),
    (c.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = a ? a + e : e), this._events[t] && s(this, t))
          : ((this._events = new l()), (this._eventsCount = 0)),
        this
      );
    }),
    (c.prototype.off = c.prototype.removeListener),
    (c.prototype.addListener = c.prototype.on),
    (c.prefixed = a),
    (c.EventEmitter = c),
    (t.exports = c));
};
