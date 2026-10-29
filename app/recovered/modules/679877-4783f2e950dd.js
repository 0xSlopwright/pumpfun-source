// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  var n,
    f = "object" == typeof Reflect ? Reflect : null,
    i =
      f && "function" == typeof f.apply
        ? f.apply
        : function (e, t, r) {
            return Function.prototype.apply.call(e, t, r);
          };
  n =
    f && "function" == typeof f.ownKeys
      ? f.ownKeys
      : Object.getOwnPropertySymbols
        ? function (e) {
            return Object.getOwnPropertyNames(e).concat(
              Object.getOwnPropertySymbols(e),
            );
          }
        : function (e) {
            return Object.getOwnPropertyNames(e);
          };
  var o =
    Number.isNaN ||
    function (e) {
      return e != e;
    };
  function a() {
    a.init.call(this);
  }
  ((t.exports = a),
    (t.exports.once = function (e, t) {
      return new Promise(function (r, n) {
        var f, i, o;
        function a(r) {
          (e.removeListener(t, s), n(r));
        }
        function s() {
          ("function" == typeof e.removeListener &&
            e.removeListener("error", a),
            r([].slice.call(arguments)));
        }
        (v(e, t, s, { once: !0 }),
          "error" !== t &&
            ((f = e),
            (i = a),
            (o = { once: !0 }),
            "function" == typeof f.on && v(f, "error", i, o)));
      });
    }),
    (a.EventEmitter = a),
    (a.prototype._events = void 0),
    (a.prototype._eventsCount = 0),
    (a.prototype._maxListeners = void 0));
  var s = 10;
  function c(e) {
    if ("function" != typeof e)
      throw TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof e,
      );
  }
  function u(e) {
    return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners;
  }
  function l(e, t, r, n) {
    if (
      (c(r),
      void 0 === (i = e._events)
        ? ((i = e._events = Object.create(null)), (e._eventsCount = 0))
        : (void 0 !== i.newListener &&
            (e.emit("newListener", t, r.listener ? r.listener : r),
            (i = e._events)),
          (o = i[t])),
      void 0 === o)
    )
      ((o = i[t] = r), ++e._eventsCount);
    else if (
      ("function" == typeof o
        ? (o = i[t] = n ? [r, o] : [o, r])
        : n
          ? o.unshift(r)
          : o.push(r),
      (f = u(e)) > 0 && o.length > f && !o.warned)
    ) {
      o.warned = !0;
      var f,
        i,
        o,
        a = Error(
          "Possible EventEmitter memory leak detected. " +
            o.length +
            " " +
            String(t) +
            " listeners added. Use emitter.setMaxListeners() to increase limit",
        );
      ((a.name = "MaxListenersExceededWarning"),
        (a.emitter = e),
        (a.type = t),
        (a.count = o.length),
        console && console.warn && console.warn(a));
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
  function p(e, t, r) {
    var n = { fired: !1, wrapFn: void 0, target: e, type: t, listener: r },
      f = d.bind(n);
    return ((f.listener = r), (n.wrapFn = f), f);
  }
  function h(e, t, r) {
    var n = e._events;
    if (void 0 === n) return [];
    var f = n[t];
    return void 0 === f
      ? []
      : "function" == typeof f
        ? r
          ? [f.listener || f]
          : [f]
        : r
          ? (function (e) {
              for (var t = Array(e.length), r = 0; r < t.length; ++r)
                t[r] = e[r].listener || e[r];
              return t;
            })(f)
          : y(f, f.length);
  }
  function m(e) {
    var t = this._events;
    if (void 0 !== t) {
      var r = t[e];
      if ("function" == typeof r) return 1;
      if (void 0 !== r) return r.length;
    }
    return 0;
  }
  function y(e, t) {
    for (var r = Array(t), n = 0; n < t; ++n) r[n] = e[n];
    return r;
  }
  function v(e, t, r, n) {
    if ("function" == typeof e.on) n.once ? e.once(t, r) : e.on(t, r);
    else if ("function" == typeof e.addEventListener)
      e.addEventListener(t, function f(i) {
        (n.once && e.removeEventListener(t, f), r(i));
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
      return s;
    },
    set: function (e) {
      if ("number" != typeof e || e < 0 || o(e))
        throw RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            e +
            ".",
        );
      s = e;
    },
  }),
    (a.init = function () {
      ((void 0 === this._events ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0));
    }),
    (a.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || o(e))
        throw RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            e +
            ".",
        );
      return ((this._maxListeners = e), this);
    }),
    (a.prototype.getMaxListeners = function () {
      return u(this);
    }),
    (a.prototype.emit = function (e) {
      for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
      var n = "error" === e,
        f = this._events;
      if (void 0 !== f) n = n && void 0 === f.error;
      else if (!n) return !1;
      if (n) {
        if ((t.length > 0 && (o = t[0]), o instanceof Error)) throw o;
        var o,
          a = Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
        throw ((a.context = o), a);
      }
      var s = f[e];
      if (void 0 === s) return !1;
      if ("function" == typeof s) i(s, this, t);
      else
        for (var c = s.length, u = y(s, c), r = 0; r < c; ++r) i(u[r], this, t);
      return !0;
    }),
    (a.prototype.addListener = function (e, t) {
      return l(this, e, t, !1);
    }),
    (a.prototype.on = a.prototype.addListener),
    (a.prototype.prependListener = function (e, t) {
      return l(this, e, t, !0);
    }),
    (a.prototype.once = function (e, t) {
      return (c(t), this.on(e, p(this, e, t)), this);
    }),
    (a.prototype.prependOnceListener = function (e, t) {
      return (c(t), this.prependListener(e, p(this, e, t)), this);
    }),
    (a.prototype.removeListener = function (e, t) {
      var r, n, f, i, o;
      if ((c(t), void 0 === (n = this._events) || void 0 === (r = n[e])))
        return this;
      if (r === t || r.listener === t)
        0 == --this._eventsCount
          ? (this._events = Object.create(null))
          : (delete n[e],
            n.removeListener &&
              this.emit("removeListener", e, r.listener || t));
      else if ("function" != typeof r) {
        for (f = -1, i = r.length - 1; i >= 0; i--)
          if (r[i] === t || r[i].listener === t) {
            ((o = r[i].listener), (f = i));
            break;
          }
        if (f < 0) return this;
        (0 === f
          ? r.shift()
          : (function (e, t) {
              for (; t + 1 < e.length; t++) e[t] = e[t + 1];
              e.pop();
            })(r, f),
          1 === r.length && (n[e] = r[0]),
          void 0 !== n.removeListener &&
            this.emit("removeListener", e, o || t));
      }
      return this;
    }),
    (a.prototype.off = a.prototype.removeListener),
    (a.prototype.removeAllListeners = function (e) {
      var t, r, n;
      if (void 0 === (r = this._events)) return this;
      if (void 0 === r.removeListener)
        return (
          0 == arguments.length
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : void 0 !== r[e] &&
              (0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : delete r[e]),
          this
        );
      if (0 == arguments.length) {
        var f,
          i = Object.keys(r);
        for (n = 0; n < i.length; ++n)
          "removeListener" !== (f = i[n]) && this.removeAllListeners(f);
        return (
          this.removeAllListeners("removeListener"),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        );
      }
      if ("function" == typeof (t = r[e])) this.removeListener(e, t);
      else if (void 0 !== t)
        for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
      return this;
    }),
    (a.prototype.listeners = function (e) {
      return h(this, e, !0);
    }),
    (a.prototype.rawListeners = function (e) {
      return h(this, e, !1);
    }),
    (a.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount
        ? e.listenerCount(t)
        : m.call(e, t);
    }),
    (a.prototype.listenerCount = m),
    (a.prototype.eventNames = function () {
      return this._eventsCount > 0 ? n(this._events) : [];
    }));
};
