// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    o = "~";
  function i() {}
  function a(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function s(e, t, n, r, i) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var s = new a(n, r || e, i),
      l = o ? o + t : t;
    return (
      e._events[l]
        ? e._events[l].fn
          ? (e._events[l] = [e._events[l], s])
          : e._events[l].push(s)
        : ((e._events[l] = s), e._eventsCount++),
      e
    );
  }
  function l(e, t) {
    0 == --e._eventsCount ? (e._events = new i()) : delete e._events[t];
  }
  function c() {
    ((this._events = new i()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((i.prototype = Object.create(null)), new i().__proto__ || (o = !1)),
    (c.prototype.eventNames = function () {
      var e,
        t,
        n = [];
      if (0 === this._eventsCount) return n;
      for (t in (e = this._events)) r.call(e, t) && n.push(o ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(e))
        : n;
    }),
    (c.prototype.listeners = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, i = n.length, a = Array(i); r < i; r++) a[r] = n[r].fn;
      return a;
    }),
    (c.prototype.listenerCount = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (c.prototype.emit = function (e, t, n, r, i, a) {
      var s = o ? o + e : e;
      if (!this._events[s]) return !1;
      var l,
        c,
        u = this._events[s],
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
            return (u.fn.call(u.context, t, n, r, i), !0);
          case 6:
            return (u.fn.call(u.context, t, n, r, i, a), !0);
        }
        for (c = 1, l = Array(f - 1); c < f; c++) l[c - 1] = arguments[c];
        u.fn.apply(u.context, l);
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
              if (!l)
                for (d = 1, l = Array(f - 1); d < f; d++)
                  l[d - 1] = arguments[d];
              u[c].fn.apply(u[c].context, l);
          }
      }
      return !0;
    }),
    (c.prototype.on = function (e, t, n) {
      return s(this, e, t, n, !1);
    }),
    (c.prototype.once = function (e, t, n) {
      return s(this, e, t, n, !0);
    }),
    (c.prototype.removeListener = function (e, t, n, r) {
      var i = o ? o + e : e;
      if (!this._events[i]) return this;
      if (!t) return (l(this, i), this);
      var a = this._events[i];
      if (a.fn)
        a.fn !== t || (r && !a.once) || (n && a.context !== n) || l(this, i);
      else {
        for (var s = 0, c = [], u = a.length; s < u; s++)
          (a[s].fn !== t || (r && !a[s].once) || (n && a[s].context !== n)) &&
            c.push(a[s]);
        c.length ? (this._events[i] = 1 === c.length ? c[0] : c) : l(this, i);
      }
      return this;
    }),
    (c.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = o ? o + e : e), this._events[t] && l(this, t))
          : ((this._events = new i()), (this._eventsCount = 0)),
        this
      );
    }),
    (c.prototype.off = c.prototype.removeListener),
    (c.prototype.addListener = c.prototype.on),
    (c.prefixed = o),
    (c.EventEmitter = c),
    (t.exports = c));
};
