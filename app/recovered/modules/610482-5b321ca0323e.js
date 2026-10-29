// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r = Object.prototype.hasOwnProperty,
    o = "~";
  function i() {}
  function s(e, t, n) {
    ((this.fn = e), (this.context = t), (this.once = n || !1));
  }
  function c(e, t, n, r, i) {
    if ("function" != typeof n)
      throw TypeError("The listener must be a function");
    var c = new s(n, r || e, i),
      a = o ? o + t : t;
    return (
      e._events[a]
        ? e._events[a].fn
          ? (e._events[a] = [e._events[a], c])
          : e._events[a].push(c)
        : ((e._events[a] = c), e._eventsCount++),
      e
    );
  }
  function a(e, t) {
    0 == --e._eventsCount ? (e._events = new i()) : delete e._events[t];
  }
  function f() {
    ((this._events = new i()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((i.prototype = Object.create(null)), new i().__proto__ || (o = !1)),
    (f.prototype.eventNames = function () {
      var e,
        t,
        n = [];
      if (0 === this._eventsCount) return n;
      for (t in (e = this._events)) r.call(e, t) && n.push(o ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? n.concat(Object.getOwnPropertySymbols(e))
        : n;
    }),
    (f.prototype.listeners = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      if (!n) return [];
      if (n.fn) return [n.fn];
      for (var r = 0, i = n.length, s = Array(i); r < i; r++) s[r] = n[r].fn;
      return s;
    }),
    (f.prototype.listenerCount = function (e) {
      var t = o ? o + e : e,
        n = this._events[t];
      return n ? (n.fn ? 1 : n.length) : 0;
    }),
    (f.prototype.emit = function (e, t, n, r, i, s) {
      var c = o ? o + e : e;
      if (!this._events[c]) return !1;
      var a,
        f,
        l = this._events[c],
        p = arguments.length;
      if (l.fn) {
        switch ((l.once && this.removeListener(e, l.fn, void 0, !0), p)) {
          case 1:
            return (l.fn.call(l.context), !0);
          case 2:
            return (l.fn.call(l.context, t), !0);
          case 3:
            return (l.fn.call(l.context, t, n), !0);
          case 4:
            return (l.fn.call(l.context, t, n, r), !0);
          case 5:
            return (l.fn.call(l.context, t, n, r, i), !0);
          case 6:
            return (l.fn.call(l.context, t, n, r, i, s), !0);
        }
        for (f = 1, a = Array(p - 1); f < p; f++) a[f - 1] = arguments[f];
        l.fn.apply(l.context, a);
      } else {
        var u,
          h = l.length;
        for (f = 0; f < h; f++)
          switch (
            (l[f].once && this.removeListener(e, l[f].fn, void 0, !0), p)
          ) {
            case 1:
              l[f].fn.call(l[f].context);
              break;
            case 2:
              l[f].fn.call(l[f].context, t);
              break;
            case 3:
              l[f].fn.call(l[f].context, t, n);
              break;
            case 4:
              l[f].fn.call(l[f].context, t, n, r);
              break;
            default:
              if (!a)
                for (u = 1, a = Array(p - 1); u < p; u++)
                  a[u - 1] = arguments[u];
              l[f].fn.apply(l[f].context, a);
          }
      }
      return !0;
    }),
    (f.prototype.on = function (e, t, n) {
      return c(this, e, t, n, !1);
    }),
    (f.prototype.once = function (e, t, n) {
      return c(this, e, t, n, !0);
    }),
    (f.prototype.removeListener = function (e, t, n, r) {
      var i = o ? o + e : e;
      if (!this._events[i]) return this;
      if (!t) return (a(this, i), this);
      var s = this._events[i];
      if (s.fn)
        s.fn !== t || (r && !s.once) || (n && s.context !== n) || a(this, i);
      else {
        for (var c = 0, f = [], l = s.length; c < l; c++)
          (s[c].fn !== t || (r && !s[c].once) || (n && s[c].context !== n)) &&
            f.push(s[c]);
        f.length ? (this._events[i] = 1 === f.length ? f[0] : f) : a(this, i);
      }
      return this;
    }),
    (f.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = o ? o + e : e), this._events[t] && a(this, t))
          : ((this._events = new i()), (this._eventsCount = 0)),
        this
      );
    }),
    (f.prototype.off = f.prototype.removeListener),
    (f.prototype.addListener = f.prototype.on),
    (f.prefixed = o),
    (f.EventEmitter = f),
    (t.exports = f));
};
