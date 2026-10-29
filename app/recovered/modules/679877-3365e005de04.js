// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, n) => {
  var r,
    o = "object" == typeof Reflect ? Reflect : null,
    i =
      o && "function" == typeof o.apply
        ? o.apply
        : function (e, t, n) {
            return Function.prototype.apply.call(e, t, n);
          };
  r =
    o && "function" == typeof o.ownKeys
      ? o.ownKeys
      : Object.getOwnPropertySymbols
        ? function (e) {
            return Object.getOwnPropertyNames(e).concat(
              Object.getOwnPropertySymbols(e),
            );
          }
        : function (e) {
            return Object.getOwnPropertyNames(e);
          };
  var a =
    Number.isNaN ||
    function (e) {
      return e != e;
    };
  function s() {
    s.init.call(this);
  }
  ((t.exports = s),
    (t.exports.once = function (e, t) {
      return new Promise(function (n, r) {
        var o, i, a;
        function s(n) {
          (e.removeListener(t, l), r(n));
        }
        function l() {
          ("function" == typeof e.removeListener &&
            e.removeListener("error", s),
            n([].slice.call(arguments)));
        }
        (y(e, t, l, { once: !0 }),
          "error" !== t &&
            ((o = e),
            (i = s),
            (a = { once: !0 }),
            "function" == typeof o.on && y(o, "error", i, a)));
      });
    }),
    (s.EventEmitter = s),
    (s.prototype._events = void 0),
    (s.prototype._eventsCount = 0),
    (s.prototype._maxListeners = void 0));
  var l = 10;
  function c(e) {
    if ("function" != typeof e)
      throw TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof e,
      );
  }
  function u(e) {
    return void 0 === e._maxListeners ? s.defaultMaxListeners : e._maxListeners;
  }
  function f(e, t, n, r) {
    if (
      (c(n),
      void 0 === (i = e._events)
        ? ((i = e._events = Object.create(null)), (e._eventsCount = 0))
        : (void 0 !== i.newListener &&
            (e.emit("newListener", t, n.listener ? n.listener : n),
            (i = e._events)),
          (a = i[t])),
      void 0 === a)
    )
      ((a = i[t] = n), ++e._eventsCount);
    else if (
      ("function" == typeof a
        ? (a = i[t] = r ? [n, a] : [a, n])
        : r
          ? a.unshift(n)
          : a.push(n),
      (o = u(e)) > 0 && a.length > o && !a.warned)
    ) {
      a.warned = !0;
      var o,
        i,
        a,
        s = Error(
          "Possible EventEmitter memory leak detected. " +
            a.length +
            " " +
            String(t) +
            " listeners added. Use emitter.setMaxListeners() to increase limit",
        );
      ((s.name = "MaxListenersExceededWarning"),
        (s.emitter = e),
        (s.type = t),
        (s.count = a.length),
        console && console.warn && console.warn(s));
    }
    return e;
  }
  function d() {
    if (!this.fired)
      return (this.target.removeListener(this.type, this.wrapFn),
      (this.fired = !0),
      0 == arguments.length)
        ? this.listener.call(this.target)
        : this.listener.apply(this.target, arguments);
  }
  function h(e, t, n) {
    var r = { fired: !1, wrapFn: void 0, target: e, type: t, listener: n },
      o = d.bind(r);
    return ((o.listener = n), (r.wrapFn = o), o);
  }
  function p(e, t, n) {
    var r = e._events;
    if (void 0 === r) return [];
    var o = r[t];
    return void 0 === o
      ? []
      : "function" == typeof o
        ? n
          ? [o.listener || o]
          : [o]
        : n
          ? (function (e) {
              for (var t = Array(e.length), n = 0; n < t.length; ++n)
                t[n] = e[n].listener || e[n];
              return t;
            })(o)
          : m(o, o.length);
  }
  function v(e) {
    var t = this._events;
    if (void 0 !== t) {
      var n = t[e];
      if ("function" == typeof n) return 1;
      if (void 0 !== n) return n.length;
    }
    return 0;
  }
  function m(e, t) {
    for (var n = Array(t), r = 0; r < t; ++r) n[r] = e[r];
    return n;
  }
  function y(e, t, n, r) {
    if ("function" == typeof e.on) r.once ? e.once(t, n) : e.on(t, n);
    else if ("function" == typeof e.addEventListener)
      e.addEventListener(t, function o(i) {
        (r.once && e.removeEventListener(t, o), n(i));
      });
    else
      throw TypeError(
        'The "emitter" argument must be of type EventEmitter. Received type ' +
          typeof e,
      );
  }
  (Object.defineProperty(s, "defaultMaxListeners", {
    enumerable: !0,
    get: function () {
      return l;
    },
    set: function (e) {
      if ("number" != typeof e || e < 0 || a(e))
        throw RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            e +
            ".",
        );
      l = e;
    },
  }),
    (s.init = function () {
      ((void 0 === this._events ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0));
    }),
    (s.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || a(e))
        throw RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            e +
            ".",
        );
      return ((this._maxListeners = e), this);
    }),
    (s.prototype.getMaxListeners = function () {
      return u(this);
    }),
    (s.prototype.emit = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
      var r = "error" === e,
        o = this._events;
      if (void 0 !== o) r = r && void 0 === o.error;
      else if (!r) return !1;
      if (r) {
        if ((t.length > 0 && (a = t[0]), a instanceof Error)) throw a;
        var a,
          s = Error("Unhandled error." + (a ? " (" + a.message + ")" : ""));
        throw ((s.context = a), s);
      }
      var l = o[e];
      if (void 0 === l) return !1;
      if ("function" == typeof l) i(l, this, t);
      else
        for (var c = l.length, u = m(l, c), n = 0; n < c; ++n) i(u[n], this, t);
      return !0;
    }),
    (s.prototype.addListener = function (e, t) {
      return f(this, e, t, !1);
    }),
    (s.prototype.on = s.prototype.addListener),
    (s.prototype.prependListener = function (e, t) {
      return f(this, e, t, !0);
    }),
    (s.prototype.once = function (e, t) {
      return (c(t), this.on(e, h(this, e, t)), this);
    }),
    (s.prototype.prependOnceListener = function (e, t) {
      return (c(t), this.prependListener(e, h(this, e, t)), this);
    }),
    (s.prototype.removeListener = function (e, t) {
      var n, r, o, i, a;
      if ((c(t), void 0 === (r = this._events) || void 0 === (n = r[e])))
        return this;
      if (n === t || n.listener === t)
        0 == --this._eventsCount
          ? (this._events = Object.create(null))
          : (delete r[e],
            r.removeListener &&
              this.emit("removeListener", e, n.listener || t));
      else if ("function" != typeof n) {
        for (o = -1, i = n.length - 1; i >= 0; i--)
          if (n[i] === t || n[i].listener === t) {
            ((a = n[i].listener), (o = i));
            break;
          }
        if (o < 0) return this;
        (0 === o
          ? n.shift()
          : (function (e, t) {
              for (; t + 1 < e.length; t++) e[t] = e[t + 1];
              e.pop();
            })(n, o),
          1 === n.length && (r[e] = n[0]),
          void 0 !== r.removeListener &&
            this.emit("removeListener", e, a || t));
      }
      return this;
    }),
    (s.prototype.off = s.prototype.removeListener),
    (s.prototype.removeAllListeners = function (e) {
      var t, n, r;
      if (void 0 === (n = this._events)) return this;
      if (void 0 === n.removeListener)
        return (
          0 == arguments.length
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : void 0 !== n[e] &&
              (0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : delete n[e]),
          this
        );
      if (0 == arguments.length) {
        var o,
          i = Object.keys(n);
        for (r = 0; r < i.length; ++r)
          "removeListener" !== (o = i[r]) && this.removeAllListeners(o);
        return (
          this.removeAllListeners("removeListener"),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        );
      }
      if ("function" == typeof (t = n[e])) this.removeListener(e, t);
      else if (void 0 !== t)
        for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
      return this;
    }),
    (s.prototype.listeners = function (e) {
      return p(this, e, !0);
    }),
    (s.prototype.rawListeners = function (e) {
      return p(this, e, !1);
    }),
    (s.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount
        ? e.listenerCount(t)
        : v.call(e, t);
    }),
    (s.prototype.listenerCount = v),
    (s.prototype.eventNames = function () {
      return this._eventsCount > 0 ? r(this._events) : [];
    }));
};
