// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var n = Object.prototype.hasOwnProperty,
    i = "~";
  function o() {}
  function f(t, e, r) {
    ((this.fn = t), (this.context = e), (this.once = r || !1));
  }
  function s(t, e, r, n, o) {
    if ("function" != typeof r)
      throw TypeError("The listener must be a function");
    var s = new f(r, n || t, o),
      h = i ? i + e : e;
    return (
      t._events[h]
        ? t._events[h].fn
          ? (t._events[h] = [t._events[h], s])
          : t._events[h].push(s)
        : ((t._events[h] = s), t._eventsCount++),
      t
    );
  }
  function h(t, e) {
    0 == --t._eventsCount ? (t._events = new o()) : delete t._events[e];
  }
  function a() {
    ((this._events = new o()), (this._eventsCount = 0));
  }
  (Object.create &&
    ((o.prototype = Object.create(null)), new o().__proto__ || (i = !1)),
    (a.prototype.eventNames = function () {
      var t,
        e,
        r = [];
      if (0 === this._eventsCount) return r;
      for (e in (t = this._events)) n.call(t, e) && r.push(i ? e.slice(1) : e);
      return Object.getOwnPropertySymbols
        ? r.concat(Object.getOwnPropertySymbols(t))
        : r;
    }),
    (a.prototype.listeners = function (t) {
      var e = i ? i + t : t,
        r = this._events[e];
      if (!r) return [];
      if (r.fn) return [r.fn];
      for (var n = 0, o = r.length, f = Array(o); n < o; n++) f[n] = r[n].fn;
      return f;
    }),
    (a.prototype.listenerCount = function (t) {
      var e = i ? i + t : t,
        r = this._events[e];
      return r ? (r.fn ? 1 : r.length) : 0;
    }),
    (a.prototype.emit = function (t, e, r, n, o, f) {
      var s = i ? i + t : t;
      if (!this._events[s]) return !1;
      var h,
        a,
        u = this._events[s],
        c = arguments.length;
      if (u.fn) {
        switch ((u.once && this.removeListener(t, u.fn, void 0, !0), c)) {
          case 1:
            return (u.fn.call(u.context), !0);
          case 2:
            return (u.fn.call(u.context, e), !0);
          case 3:
            return (u.fn.call(u.context, e, r), !0);
          case 4:
            return (u.fn.call(u.context, e, r, n), !0);
          case 5:
            return (u.fn.call(u.context, e, r, n, o), !0);
          case 6:
            return (u.fn.call(u.context, e, r, n, o, f), !0);
        }
        for (a = 1, h = Array(c - 1); a < c; a++) h[a - 1] = arguments[a];
        u.fn.apply(u.context, h);
      } else {
        var l,
          p = u.length;
        for (a = 0; a < p; a++)
          switch (
            (u[a].once && this.removeListener(t, u[a].fn, void 0, !0), c)
          ) {
            case 1:
              u[a].fn.call(u[a].context);
              break;
            case 2:
              u[a].fn.call(u[a].context, e);
              break;
            case 3:
              u[a].fn.call(u[a].context, e, r);
              break;
            case 4:
              u[a].fn.call(u[a].context, e, r, n);
              break;
            default:
              if (!h)
                for (l = 1, h = Array(c - 1); l < c; l++)
                  h[l - 1] = arguments[l];
              u[a].fn.apply(u[a].context, h);
          }
      }
      return !0;
    }),
    (a.prototype.on = function (t, e, r) {
      return s(this, t, e, r, !1);
    }),
    (a.prototype.once = function (t, e, r) {
      return s(this, t, e, r, !0);
    }),
    (a.prototype.removeListener = function (t, e, r, n) {
      var o = i ? i + t : t;
      if (!this._events[o]) return this;
      if (!e) return (h(this, o), this);
      var f = this._events[o];
      if (f.fn)
        f.fn !== e || (n && !f.once) || (r && f.context !== r) || h(this, o);
      else {
        for (var s = 0, a = [], u = f.length; s < u; s++)
          (f[s].fn !== e || (n && !f[s].once) || (r && f[s].context !== r)) &&
            a.push(f[s]);
        a.length ? (this._events[o] = 1 === a.length ? a[0] : a) : h(this, o);
      }
      return this;
    }),
    (a.prototype.removeAllListeners = function (t) {
      var e;
      return (
        t
          ? ((e = i ? i + t : t), this._events[e] && h(this, e))
          : ((this._events = new o()), (this._eventsCount = 0)),
        this
      );
    }),
    (a.prototype.off = a.prototype.removeListener),
    (a.prototype.addListener = a.prototype.on),
    (a.prefixed = i),
    (a.EventEmitter = a),
    (e.exports = a));
};
