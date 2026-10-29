// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    o = "~";
  function a() {}
  function l(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function i(e, t, n, r, a) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var i = new l(n, r || e, a),
      c = o ? o + t : t;
    return (
      e._events[c]
        ? e._events[c].fn
          ? (e._events[c] = [e._events[c], i])
          : e._events[c].push(i)
        : ((e._events[c] = i), e._eventsCount++),
      e
    );
  }
  function c(e, t) {
    0 == --e._eventsCount ? (e._events = new a()) : delete e._events[t];
  }
  function s() {
    ((this._events = new a()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((a.prototype = Object.create(null)), new a().__proto__ || (o = !1)),
    (s.prototype.eventNames = function () {
      var e,
        t,
        n = [];
      if (0 === this._eventsCount) return n;
      for (t in (e = this._events)) r.call(e, t) && n.push(o ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(e))
        : n;
    }),
    (s.prototype.listeners = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, a = n.length, l = Array(a); r < a; r++) l[r] = n[r].fn;
      return l;
    }),
    (s.prototype.listenerCount = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (s.prototype.emit = function (e, t, n, r, a, l) {
      var i = o ? o + e : e;
      if (!this._events[i]) return !1;
      var c,
        s,
        u = this._events[i],
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
            return (u.fn.call(u.context, t, n, r, a), !0);
          case 6:
            return (u.fn.call(u.context, t, n, r, a, l), !0);
        }
        for (s = 1, c = Array(f - 1); s < f; s++) c[s - 1] = arguments[s];
        u.fn.apply(u.context, c);
      } else {
        var h,
          d = u.length;
        for (s = 0; s < d; s++)
          switch (
            (u[s].once && this.removeListener(e, u[s].fn, void 0, !0), f)
          ) {
            case 1:
              u[s].fn.call(u[s].context);
              break;
            case 2:
              u[s].fn.call(u[s].context, t);
              break;
            case 3:
              u[s].fn.call(u[s].context, t, n);
              break;
            case 4:
              u[s].fn.call(u[s].context, t, n, r);
              break;
            default:
              if (!c)
                for (h = 1, c = Array(f - 1); h < f; h++)
                  c[h - 1] = arguments[h];
              u[s].fn.apply(u[s].context, c);
          }
      }
      return !0;
    }),
    (s.prototype.on = function (e, t, n) {
      return i(this, e, t, n, !1);
    }),
    (s.prototype.once = function (e, t, n) {
      return i(this, e, t, n, !0);
    }),
    (s.prototype.removeListener = function (e, t, n, r) {
      var a = o ? o + e : e;
      if (!this._events[a]) return this;
      if (!t) return (c(this, a), this);
      var l = this._events[a];
      if (l.fn)
        l.fn !== t || (r && !l.once) || (n && l.context !== n) || c(this, a);
      else {
        for (var i = 0, s = [], u = l.length; i < u; i++)
          (l[i].fn !== t || (r && !l[i].once) || (n && l[i].context !== n)) &&
            s.push(l[i]);
        s.length ? (this._events[a] = 1 === s.length ? s[0] : s) : c(this, a);
      }
      return this;
    }),
    (s.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = o ? o + e : e), this._events[t] && c(this, t))
          : ((this._events = new a()), (this._eventsCount = 0)),
        this
      );
    }),
    (s.prototype.off = s.prototype.removeListener),
    (s.prototype.addListener = s.prototype.on),
    (s.prefixed = o),
    (s.EventEmitter = s),
    (t.exports = s));
};
