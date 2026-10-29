// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n = e.r(443426);
  t.exports = u;
  let i =
    (function () {
      function e(e) {
        return void 0 !== e && e;
      }
      try {
        if ("u" > typeof globalThis) return globalThis;
        return (
          Object.defineProperty(Object.prototype, "globalThis", {
            get: function () {
              return (
                delete Object.prototype.globalThis,
                (this.globalThis = this)
              );
            },
            configurable: !0,
          }),
          globalThis
        );
      } catch (t) {
        return e(self) || e(window) || e(this) || {};
      }
    })().console || {};
  function s(e, t) {
    return "silent" === e ? 1 / 0 : t.levels.values[e];
  }
  let o = Symbol("pino.logFuncs"),
    a = Symbol("pino.hierarchy"),
    l = {
      error: "log",
      fatal: "error",
      warn: "error",
      info: "log",
      debug: "log",
      trace: "log",
    };
  function f(e, t) {
    let r = { logger: t, parent: e[a] };
    t[a] = r;
  }
  function u(e) {
    var t, r, n;
    let a, b, p;
    (e = e || {}).browser = e.browser || {};
    let g = e.browser.transmit;
    if (g && "function" != typeof g.send)
      throw Error("pino: transmit option must have a send function");
    let x = e.browser.write || i;
    e.browser.write && (e.browser.asObject = !0);
    let v = e.serializers || {},
      E =
        ((t = e.browser.serialize),
        Array.isArray(t)
          ? t.filter(function (e) {
              return "!stdSerializers.err" !== e;
            })
          : !0 === t && Object.keys(v)),
      O = e.browser.serialize;
    Array.isArray(e.browser.serialize) &&
      e.browser.serialize.indexOf("!stdSerializers.err") > -1 &&
      (O = !1);
    let A = Object.keys(e.customLevels || {}),
      I = ["error", "fatal", "warn", "info", "debug", "trace"].concat(A);
    ("function" == typeof x &&
      I.forEach(function (e) {
        x[e] = x;
      }),
      (!1 === e.enabled || e.browser.disabled) && (e.level = "silent"));
    let B = e.level || "info",
      _ = Object.create(x);
    (_.log || (_.log = y),
      (a = {}),
      I.forEach((e) => {
        a[e] = x[e] ? x[e] : i[e] || i[l[e] || "log"] || y;
      }),
      (_[o] = a),
      f({}, _),
      Object.defineProperty(_, "levelVal", {
        get: function () {
          return s(this.level, this);
        },
      }),
      Object.defineProperty(_, "level", {
        get: function () {
          return this._level;
        },
        set: function (e) {
          if ("silent" !== e && !this.levels.values[e])
            throw Error("unknown level " + e);
          ((this._level = e),
            c(this, S, _, "error"),
            c(this, S, _, "fatal"),
            c(this, S, _, "warn"),
            c(this, S, _, "info"),
            c(this, S, _, "debug"),
            c(this, S, _, "trace"),
            A.forEach((e) => {
              c(this, S, _, e);
            }));
        },
      }));
    let S = {
      transmit: g,
      serialize: E,
      asObject: e.browser.asObject,
      asObjectBindingsOnly: e.browser.asObjectBindingsOnly,
      formatters: e.browser.formatters,
      levels: I,
      timestamp:
        "function" == typeof (r = e).timestamp
          ? r.timestamp
          : !1 === r.timestamp
            ? w
            : m,
      messageKey: e.messageKey || "msg",
      onChild: e.onChild || y,
    };
    function U(t, r, n) {
      if (!r) throw Error("missing bindings for child Pino");
      ((n = n || {}), E && r.serializers && (n.serializers = r.serializers));
      let i = n.serializers;
      if (E && i) {
        var s = Object.assign({}, v, i),
          o = !0 === e.browser.serialize ? Object.keys(s) : E;
        (delete r.serializers, d([r], o, s, this._stdErrSerialize));
      }
      function a(e) {
        ((this._childLevel = (0 | e._childLevel) + 1),
          (this.bindings = r),
          s && ((this.serializers = s), (this._serialize = o)),
          g && (this._logEvent = h([].concat(e._logEvent.bindings, r))));
      }
      a.prototype = this;
      let l = new a(this);
      return (
        f(this, l),
        (l.child = function (...e) {
          return U.call(this, t, ...e);
        }),
        (l.level = n.level || this.level),
        t.onChild(l),
        l
      );
    }
    return (
      (b = e.customLevels || {}),
      (_.levels = {
        values: Object.assign({}, u.levels.values, b),
        labels: Object.assign(
          {},
          u.levels.labels,
          ((p = {}),
          Object.keys((n = b)).forEach(function (e) {
            p[n[e]] = e;
          }),
          p),
        ),
      }),
      (_.level = B),
      (_.isLevelEnabled = function (e) {
        return (
          !!this.levels.values[e] &&
          this.levels.values[e] >= this.levels.values[this.level]
        );
      }),
      (_.setMaxListeners =
        _.getMaxListeners =
        _.emit =
        _.addListener =
        _.on =
        _.prependListener =
        _.once =
        _.prependOnceListener =
        _.removeListener =
        _.removeAllListeners =
        _.listeners =
        _.listenerCount =
        _.eventNames =
        _.write =
        _.flush =
          y),
      (_.serializers = v),
      (_._serialize = E),
      (_._stdErrSerialize = O),
      (_.child = function (...e) {
        return U.call(this, S, ...e);
      }),
      g && (_._logEvent = h()),
      _
    );
  }
  function c(e, t, r, l) {
    var f, u, c, b, p, g, w;
    if (
      (Object.defineProperty(e, l, {
        value: s(e.level, r) > s(l, r) ? y : r[o][l],
        writable: !0,
        enumerable: !0,
        configurable: !0,
      }),
      e[l] === y)
    ) {
      if (!t.transmit) return;
      let n = s(t.transmit.level || e.level, r);
      if (s(l, r) < n) return;
    }
    e[l] =
      ((f = e),
      (u = t),
      (c = r),
      (b = l),
      (p = f[o][b]),
      function () {
        let e = u.timestamp(),
          t = Array(arguments.length),
          r =
            Object.getPrototypeOf && Object.getPrototypeOf(this) === i
              ? i
              : this;
        for (var o = 0; o < t.length; o++) t[o] = arguments[o];
        var a = !1;
        if (
          (u.serialize &&
            (d(t, this._serialize, this.serializers, this._stdErrSerialize),
            (a = !0)),
          u.asObject || u.formatters
            ? p.call(
                r,
                ...(function (e, t, r, i, s) {
                  let { level: o, log: a = (e) => e } = s.formatters || {},
                    l = r.slice(),
                    f = l[0],
                    u = {},
                    c = (0 | e._childLevel) + 1;
                  if (
                    (c < 1 && (c = 1),
                    i && (u.time = i),
                    o
                      ? Object.assign(u, o(t, e.levels.values[t]))
                      : (u.level = e.levels.values[t]),
                    s.asObjectBindingsOnly)
                  ) {
                    if (null !== f && "object" == typeof f)
                      for (; c-- && "object" == typeof l[0]; )
                        Object.assign(u, l.shift());
                    return [a(u), ...l];
                  }
                  if (null !== f && "object" == typeof f) {
                    for (; c-- && "object" == typeof l[0]; )
                      Object.assign(u, l.shift());
                    f = l.length ? n(l.shift(), l) : void 0;
                  } else "string" == typeof f && (f = n(l.shift(), l));
                  return (void 0 !== f && (u[s.messageKey] = f), [a(u)]);
                })(this, b, t, e, u),
              )
            : p.apply(r, t),
          u.transmit)
        ) {
          let r = u.transmit.level || f._level,
            n = s(r, c),
            i = s(b, c);
          if (i < n) return;
          !(function (e, t, r, n = !1) {
            let i = t.send,
              s = t.ts,
              o = t.methodLevel,
              a = t.methodValue,
              l = t.val,
              f = e._logEvent.bindings;
            (n ||
              d(
                r,
                e._serialize || Object.keys(e.serializers),
                e.serializers,
                void 0 === e._stdErrSerialize || e._stdErrSerialize,
              ),
              (e._logEvent.ts = s),
              (e._logEvent.messages = r.filter(function (e) {
                return -1 === f.indexOf(e);
              })),
              (e._logEvent.level.label = o),
              (e._logEvent.level.value = a),
              i(o, e._logEvent, l),
              (e._logEvent = h(f)));
          })(
            this,
            {
              ts: e,
              methodLevel: b,
              methodValue: i,
              transmitLevel: r,
              transmitValue: c.levels.values[u.transmit.level || f._level],
              send: u.transmit.send,
              val: s(f._level, c),
            },
            t,
            a,
          );
        }
      });
    let m = (function (e) {
      let t = [];
      e.bindings && t.push(e.bindings);
      let r = e[a];
      for (; r.parent; )
        (r = r.parent).logger.bindings && t.push(r.logger.bindings);
      return t.reverse();
    })(e);
    0 !== m.length &&
      (e[l] =
        ((g = m),
        (w = e[l]),
        function () {
          return w.apply(this, [...g, ...arguments]);
        }));
  }
  function d(e, t, r, n) {
    for (let i in e)
      if (n && e[i] instanceof Error) e[i] = u.stdSerializers.err(e[i]);
      else if ("object" == typeof e[i] && !Array.isArray(e[i]) && t)
        for (let n in e[i])
          t.indexOf(n) > -1 && n in r && (e[i][n] = r[n](e[i][n]));
  }
  function h(e) {
    return {
      ts: 0,
      messages: [],
      bindings: e || [],
      level: { label: "", value: 0 },
    };
  }
  function b(e) {
    let t = { type: e.constructor.name, msg: e.message, stack: e.stack };
    for (let r in e) void 0 === t[r] && (t[r] = e[r]);
    return t;
  }
  function p() {
    return {};
  }
  function g(e) {
    return e;
  }
  function y() {}
  function w() {
    return !1;
  }
  function m() {
    return Date.now();
  }
  ((u.levels = {
    values: { fatal: 60, error: 50, warn: 40, info: 30, debug: 20, trace: 10 },
    labels: {
      10: "trace",
      20: "debug",
      30: "info",
      40: "warn",
      50: "error",
      60: "fatal",
    },
  }),
    (u.stdSerializers = {
      mapHttpRequest: p,
      mapHttpResponse: p,
      wrapRequestSerializer: g,
      wrapResponseSerializer: g,
      wrapErrorSerializer: g,
      req: p,
      res: p,
      err: b,
      errWithCause: b,
    }),
    (u.stdTimeFunctions = Object.assign(
      {},
      {
        nullTime: w,
        epochTime: m,
        unixTime: function () {
          return Math.round(Date.now() / 1e3);
        },
        isoTime: function () {
          return new Date(Date.now()).toISOString();
        },
      },
    )),
    (t.exports.default = u),
    (t.exports.pino = u));
};
