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
      for (var r = 0, i = n.length, s = Array(i); r < i; r++) s[r] = n[r].fn;
      return s;
    }),
    (c.prototype.listenerCount = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (c.prototype.emit = function (e, t, n, r, i, s) {
      var a = o ? o + e : e;
      if (!this._events[a]) return !1;
      var l,
        c,
        u = this._events[a],
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
            return (u.fn.call(u.context, t, n, r, i, s), !0);
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
      return a(this, e, t, n, !1);
    }),
    (c.prototype.once = function (e, t, n) {
      return a(this, e, t, n, !0);
    }),
    (c.prototype.removeListener = function (e, t, n, r) {
      var i = o ? o + e : e;
      if (!this._events[i]) return this;
      if (!t) return (l(this, i), this);
      var s = this._events[i];
      if (s.fn)
        s.fn !== t || (r && !s.once) || (n && s.context !== n) || l(this, i);
      else {
        for (var a = 0, c = [], u = s.length; a < u; a++)
          (s[a].fn !== t || (r && !s[a].once) || (n && s[a].context !== n)) &&
            c.push(s[a]);
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
