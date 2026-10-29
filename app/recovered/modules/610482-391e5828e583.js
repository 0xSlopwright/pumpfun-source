// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n = Object.prototype.hasOwnProperty,
    a = "~";
  function l() {}
  function i(e, t, r) {
    ((this.fn = e), (this.context = t), (this.once = r || !1));
  }
  function s(e, t, r, n, l) {
    if ("function" != typeof r)
      throw TypeError("The listener must be a function");
    var s = new i(r, n || e, l),
      o = a ? a + t : t;
    return (
      e._events[o]
        ? e._events[o].fn
          ? (e._events[o] = [e._events[o], s])
          : e._events[o].push(s)
        : ((e._events[o] = s), e._eventsCount++),
      e
    );
  }
  function o(e, t) {
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
        r = [];
      if (0 === this._eventsCount) return r;
      for (t in (e = this._events)) n.call(e, t) && r.push(a ? t.slice(1) : t);
      return Object.getOwnPropertySymbols
        ? r.concat(Object.getOwnPropertySymbols(e))
        : r;
    }),
    (c.prototype.listeners = function (e) {
      var t = a ? a + e : e,
        r = this._events[t];
      if (!r) return [];
      if (r.fn) return [r.fn];
      for (var n = 0, l = r.length, i = Array(l); n < l; n++) i[n] = r[n].fn;
      return i;
    }),
    (c.prototype.listenerCount = function (e) {
      var t = a ? a + e : e,
        r = this._events[t];
      return r ? (r.fn ? 1 : r.length) : 0;
    }),
    (c.prototype.emit = function (e, t, r, n, l, i) {
      var s = a ? a + e : e;
      if (!this._events[s]) return !1;
      var o,
        c,
        d = this._events[s],
        u = arguments.length;
      if (d.fn) {
        switch ((d.once && this.removeListener(e, d.fn, void 0, !0), u)) {
          case 1:
            return (d.fn.call(d.context), !0);
          case 2:
            return (d.fn.call(d.context, t), !0);
          case 3:
            return (d.fn.call(d.context, t, r), !0);
          case 4:
            return (d.fn.call(d.context, t, r, n), !0);
          case 5:
            return (d.fn.call(d.context, t, r, n, l), !0);
          case 6:
            return (d.fn.call(d.context, t, r, n, l, i), !0);
        }
        for (c = 1, o = Array(u - 1); c < u; c++) o[c - 1] = arguments[c];
        d.fn.apply(d.context, o);
      } else {
        var f,
          h = d.length;
        for (c = 0; c < h; c++)
          switch (
            (d[c].once && this.removeListener(e, d[c].fn, void 0, !0), u)
          ) {
            case 1:
              d[c].fn.call(d[c].context);
              break;
            case 2:
              d[c].fn.call(d[c].context, t);
              break;
            case 3:
              d[c].fn.call(d[c].context, t, r);
              break;
            case 4:
              d[c].fn.call(d[c].context, t, r, n);
              break;
            default:
              if (!o)
                for (f = 1, o = Array(u - 1); f < u; f++)
                  o[f - 1] = arguments[f];
              d[c].fn.apply(d[c].context, o);
          }
      }
      return !0;
    }),
    (c.prototype.on = function (e, t, r) {
      return s(this, e, t, r, !1);
    }),
    (c.prototype.once = function (e, t, r) {
      return s(this, e, t, r, !0);
    }),
    (c.prototype.removeListener = function (e, t, r, n) {
      var l = a ? a + e : e;
      if (!this._events[l]) return this;
      if (!t) return (o(this, l), this);
      var i = this._events[l];
      if (i.fn)
        i.fn !== t || (n && !i.once) || (r && i.context !== r) || o(this, l);
      else {
        for (var s = 0, c = [], d = i.length; s < d; s++)
          (i[s].fn !== t || (n && !i[s].once) || (r && i[s].context !== r)) &&
            c.push(i[s]);
        c.length ? (this._events[l] = 1 === c.length ? c[0] : c) : o(this, l);
      }
      return this;
    }),
    (c.prototype.removeAllListeners = function (e) {
      var t;
      return (
        e
          ? ((t = a ? a + e : e), this._events[t] && o(this, t))
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
