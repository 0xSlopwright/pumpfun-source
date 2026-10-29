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
  var s =
    Number.isNaN ||
    function (e) {
      return e != e;
    };
  function a() {
    a.init.call(this);
  }
  ((t.exports = a),
    (t.exports.once = function (e, t) {
      return new Promise(function (n, r) {
        var o, i, s;
        function a(n) {
          (e.removeListener(t, l), r(n));
        }
        function l() {
          ("function" == typeof e.removeListener &&
            e.removeListener("error", a),
            n([].slice.call(arguments)));
        }
        (m(e, t, l, { once: !0 }),
          "error" !== t &&
            ((o = e),
            (i = a),
            (s = { once: !0 }),
            "function" == typeof o.on && m(o, "error", i, s)));
      });
    }),
    (a.EventEmitter = a),
    (a.prototype._events = void 0),
    (a.prototype._eventsCount = 0),
    (a.prototype._maxListeners = void 0));
  var l = 10;
  function u(e) {
    if ("function" != typeof e)
      throw TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof e,
      );
  }
  function c(e) {
    return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners;
  }
  function f(e, t, n, r) {
    if (
      (u(n),
      void 0 === (i = e._events)
        ? ((i = e._events = Object.create(null)), (e._eventsCount = 0))
        : (void 0 !== i.newListener &&
            (e.emit("newListener", t, n.listener ? n.listener : n),
            (i = e._events)),
          (s = i[t])),
      void 0 === s)
    )
      ((s = i[t] = n), ++e._eventsCount);
    else if (
      ("function" == typeof s
        ? (s = i[t] = r ? [n, s] : [s, n])
        : r
          ? s.unshift(n)
          : s.push(n),
      (o = c(e)) > 0 && s.length > o && !s.warned)
    ) {
      s.warned = !0;
      var o,
        i,
        s,
        a = Error(
          "Possible EventEmitter memory leak detected. " +
            s.length +
            " " +
            String(t) +
            " listeners added. Use emitter.setMaxListeners() to increase limit",
        );
      ((a.name = "MaxListenersExceededWarning"),
        (a.emitter = e),
        (a.type = t),
        (a.count = s.length),
        console && console.warn && console.warn(a));
    }
    return e;
  }
  function h() {
    if (!this.fired)
      return (this.target.removeListener(this.type, this.wrapFn),
      (this.fired = !0),
      0 == arguments.length)
        ? this.listener.call(this.target)
        : this.listener.apply(this.target, arguments);
  }
  function p(e, t, n) {
    var r = { fired: !1, wrapFn: void 0, target: e, type: t, listener: n },
      o = h.bind(r);
    return ((o.listener = n), (r.wrapFn = o), o);
  }
  function d(e, t, n) {
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
          : y(o, o.length);
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
  function y(e, t) {
    for (var n = Array(t), r = 0; r < t; ++r) n[r] = e[r];
    return n;
  }
  function m(e, t, n, r) {
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
  (Object.defineProperty(a, "defaultMaxListeners", {
    enumerable: !0,
    get: function () {
      return l;
    },
    set: function (e) {
      if ("number" != typeof e || e < 0 || s(e))
        throw RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            e +
            ".",
        );
      l = e;
    },
  }),
    (a.init = function () {
      ((void 0 === this._events ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0));
    }),
    (a.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || s(e))
        throw RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            e +
            ".",
        );
      return ((this._maxListeners = e), this);
    }),
    (a.prototype.getMaxListeners = function () {
      return c(this);
    }),
    (a.prototype.emit = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
      var r = "error" === e,
        o = this._events;
      if (void 0 !== o) r = r && void 0 === o.error;
      else if (!r) return !1;
      if (r) {
        if ((t.length > 0 && (s = t[0]), s instanceof Error)) throw s;
        var s,
          a = Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
        throw ((a.context = s), a);
      }
      var l = o[e];
      if (void 0 === l) return !1;
      if ("function" == typeof l) i(l, this, t);
      else
        for (var u = l.length, c = y(l, u), n = 0; n < u; ++n) i(c[n], this, t);
      return !0;
    }),
    (a.prototype.addListener = function (e, t) {
      return f(this, e, t, !1);
    }),
    (a.prototype.on = a.prototype.addListener),
    (a.prototype.prependListener = function (e, t) {
      return f(this, e, t, !0);
    }),
    (a.prototype.once = function (e, t) {
      return (u(t), this.on(e, p(this, e, t)), this);
    }),
    (a.prototype.prependOnceListener = function (e, t) {
      return (u(t), this.prependListener(e, p(this, e, t)), this);
    }),
    (a.prototype.removeListener = function (e, t) {
      var n, r, o, i, s;
      if ((u(t), void 0 === (r = this._events) || void 0 === (n = r[e])))
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
            ((s = n[i].listener), (o = i));
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
            this.emit("removeListener", e, s || t));
      }
      return this;
    }),
    (a.prototype.off = a.prototype.removeListener),
    (a.prototype.removeAllListeners = function (e) {
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
    (a.prototype.listeners = function (e) {
      return d(this, e, !0);
    }),
    (a.prototype.rawListeners = function (e) {
      return d(this, e, !1);
    }),
    (a.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount
        ? e.listenerCount(t)
        : v.call(e, t);
    }),
    (a.prototype.listenerCount = v),
    (a.prototype.eventNames = function () {
      return this._eventsCount > 0 ? r(this._events) : [];
    }));
};
