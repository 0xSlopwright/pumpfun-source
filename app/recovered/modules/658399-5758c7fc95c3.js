// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = function (e, r) {
      return (t =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, t) {
            e.__proto__ = t;
          }) ||
        function (e, t) {
          for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
        })(e, r);
    },
    r = function () {
      return (r =
        Object.assign ||
        function (e) {
          for (var t, r = 1, n = arguments.length; r < n; r++)
            for (var i in (t = arguments[r]))
              Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
          return e;
        }).apply(this, arguments);
    };
  function n(e) {
    var t = "function" == typeof Symbol && Symbol.iterator,
      r = t && e[t],
      n = 0;
    if (r) return r.call(e);
    if (e && "number" == typeof e.length)
      return {
        next: function () {
          return (
            e && n >= e.length && (e = void 0),
            { value: e && e[n++], done: !e }
          );
        },
      };
    throw TypeError(
      t ? "Object is not iterable." : "Symbol.iterator is not defined.",
    );
  }
  function i(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) return e;
    var n,
      i,
      o = r.call(e),
      s = [];
    try {
      for (; (void 0 === t || t-- > 0) && !(n = o.next()).done; )
        s.push(n.value);
    } catch (e) {
      i = { error: e };
    } finally {
      try {
        n && !n.done && (r = o.return) && r.call(o);
      } finally {
        if (i) throw i.error;
      }
    }
    return s;
  }
  function o(e) {
    return this instanceof o ? ((this.v = e), this) : new o(e);
  }
  e.s([
    "__assign",
    () => r,
    "__asyncDelegator",
    0,
    function (e) {
      var t, r;
      return (
        (t = {}),
        n("next"),
        n("throw", function (e) {
          throw e;
        }),
        n("return"),
        (t[Symbol.iterator] = function () {
          return this;
        }),
        t
      );
      function n(n, i) {
        t[n] = e[n]
          ? function (t) {
              return (r = !r)
                ? { value: o(e[n](t)), done: "return" === n }
                : i
                  ? i(t)
                  : t;
            }
          : i;
      }
    },
    "__asyncGenerator",
    0,
    function (e, t, r) {
      if (!Symbol.asyncIterator)
        throw TypeError("Symbol.asyncIterator is not defined.");
      var n,
        i = r.apply(e, t || []),
        s = [];
      return (
        (n = {}),
        a("next"),
        a("throw"),
        a("return"),
        (n[Symbol.asyncIterator] = function () {
          return this;
        }),
        n
      );
      function a(e) {
        i[e] &&
          (n[e] = function (t) {
            return new Promise(function (r, n) {
              s.push([e, t, r, n]) > 1 || c(e, t);
            });
          });
      }
      function c(e, t) {
        try {
          var r;
          (r = i[e](t)).value instanceof o
            ? Promise.resolve(r.value.v).then(l, u)
            : f(s[0][2], r);
        } catch (e) {
          f(s[0][3], e);
        }
      }
      function l(e) {
        c("next", e);
      }
      function u(e) {
        c("throw", e);
      }
      function f(e, t) {
        (e(t), s.shift(), s.length && c(s[0][0], s[0][1]));
      }
    },
    "__asyncValues",
    0,
    function (e) {
      if (!Symbol.asyncIterator)
        throw TypeError("Symbol.asyncIterator is not defined.");
      var t,
        r = e[Symbol.asyncIterator];
      return r
        ? r.call(e)
        : ((e = n(e)),
          (t = {}),
          i("next"),
          i("throw"),
          i("return"),
          (t[Symbol.asyncIterator] = function () {
            return this;
          }),
          t);
      function i(r) {
        t[r] =
          e[r] &&
          function (t) {
            return new Promise(function (n, i) {
              var o, s, a;
              ((o = n),
                (s = i),
                (a = (t = e[r](t)).done),
                Promise.resolve(t.value).then(function (e) {
                  o({ value: e, done: a });
                }, s));
            });
          };
      }
    },
    "__await",
    0,
    o,
    "__awaiter",
    0,
    function (e, t, r, n) {
      return new (r || (r = Promise))(function (i, o) {
        function s(e) {
          try {
            c(n.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            c(n.throw(e));
          } catch (e) {
            o(e);
          }
        }
        function c(e) {
          var t;
          e.done
            ? i(e.value)
            : ((t = e.value) instanceof r
                ? t
                : new r(function (e) {
                    e(t);
                  })
              ).then(s, a);
        }
        c((n = n.apply(e, t || [])).next());
      });
    },
    "__classPrivateFieldGet",
    0,
    function (e, t) {
      if (!t.has(e))
        throw TypeError("attempted to get private field on non-instance");
      return t.get(e);
    },
    "__classPrivateFieldSet",
    0,
    function (e, t, r) {
      if (!t.has(e))
        throw TypeError("attempted to set private field on non-instance");
      return (t.set(e, r), r);
    },
    "__createBinding",
    0,
    function (e, t, r, n) {
      (void 0 === n && (n = r), (e[n] = t[r]));
    },
    "__decorate",
    0,
    function (e, t, r, n) {
      var i,
        o = arguments.length,
        s =
          o < 3
            ? t
            : null === n
              ? (n = Object.getOwnPropertyDescriptor(t, r))
              : n;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
        s = Reflect.decorate(e, t, r, n);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (i = e[a]) &&
            (s = (o < 3 ? i(s) : o > 3 ? i(t, r, s) : i(t, r)) || s);
      return (o > 3 && s && Object.defineProperty(t, r, s), s);
    },
    "__exportStar",
    0,
    function (e, t) {
      for (var r in e) "default" === r || t.hasOwnProperty(r) || (t[r] = e[r]);
    },
    "__extends",
    0,
    function (e, r) {
      function n() {
        this.constructor = e;
      }
      (t(e, r),
        (e.prototype =
          null === r
            ? Object.create(r)
            : ((n.prototype = r.prototype), new n())));
    },
    "__generator",
    0,
    function (e, t) {
      var r,
        n,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: [],
        };
      return (
        (o = { next: a(0), throw: a(1), return: a(2) }),
        "function" == typeof Symbol &&
          (o[Symbol.iterator] = function () {
            return this;
          }),
        o
      );
      function a(o) {
        return function (a) {
          var c = [o, a];
          if (r) throw TypeError("Generator is already executing.");
          for (; s; )
            try {
              if (
                ((r = 1),
                n &&
                  (i =
                    2 & c[0]
                      ? n.return
                      : c[0]
                        ? n.throw || ((i = n.return) && i.call(n), 0)
                        : n.next) &&
                  !(i = i.call(n, c[1])).done)
              )
                return i;
              switch (((n = 0), i && (c = [2 & c[0], i.value]), c[0])) {
                case 0:
                case 1:
                  i = c;
                  break;
                case 4:
                  return (s.label++, { value: c[1], done: !1 });
                case 5:
                  (s.label++, (n = c[1]), (c = [0]));
                  continue;
                case 7:
                  ((c = s.ops.pop()), s.trys.pop());
                  continue;
                default:
                  if (
                    !(i = (i = s.trys).length > 0 && i[i.length - 1]) &&
                    (6 === c[0] || 2 === c[0])
                  ) {
                    s = 0;
                    continue;
                  }
                  if (3 === c[0] && (!i || (c[1] > i[0] && c[1] < i[3]))) {
                    s.label = c[1];
                    break;
                  }
                  if (6 === c[0] && s.label < i[1]) {
                    ((s.label = i[1]), (i = c));
                    break;
                  }
                  if (i && s.label < i[2]) {
                    ((s.label = i[2]), s.ops.push(c));
                    break;
                  }
                  (i[2] && s.ops.pop(), s.trys.pop());
                  continue;
              }
              c = t.call(e, s);
            } catch (e) {
              ((c = [6, e]), (n = 0));
            } finally {
              r = i = 0;
            }
          if (5 & c[0]) throw c[1];
          return { value: c[0] ? c[1] : void 0, done: !0 };
        };
      }
    },
    "__importDefault",
    0,
    function (e) {
      return e && e.__esModule ? e : { default: e };
    },
    "__importStar",
    0,
    function (e) {
      if (e && e.__esModule) return e;
      var t = {};
      if (null != e)
        for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
      return ((t.default = e), t);
    },
    "__makeTemplateObject",
    0,
    function (e, t) {
      return (
        Object.defineProperty
          ? Object.defineProperty(e, "raw", { value: t })
          : (e.raw = t),
        e
      );
    },
    "__metadata",
    0,
    function (e, t) {
      if ("object" == typeof Reflect && "function" == typeof Reflect.metadata)
        return Reflect.metadata(e, t);
    },
    "__param",
    0,
    function (e, t) {
      return function (r, n) {
        t(r, n, e);
      };
    },
    "__read",
    0,
    i,
    "__rest",
    0,
    function (e, t) {
      var r = {};
      for (var n in e)
        Object.prototype.hasOwnProperty.call(e, n) &&
          0 > t.indexOf(n) &&
          (r[n] = e[n]);
      if (null != e && "function" == typeof Object.getOwnPropertySymbols)
        for (var i = 0, n = Object.getOwnPropertySymbols(e); i < n.length; i++)
          0 > t.indexOf(n[i]) &&
            Object.prototype.propertyIsEnumerable.call(e, n[i]) &&
            (r[n[i]] = e[n[i]]);
      return r;
    },
    "__spread",
    0,
    function () {
      for (var e = [], t = 0; t < arguments.length; t++)
        e = e.concat(i(arguments[t]));
      return e;
    },
    "__spreadArrays",
    0,
    function () {
      for (var e = 0, t = 0, r = arguments.length; t < r; t++)
        e += arguments[t].length;
      for (var n = Array(e), i = 0, t = 0; t < r; t++)
        for (var o = arguments[t], s = 0, a = o.length; s < a; s++, i++)
          n[i] = o[s];
      return n;
    },
    "__values",
    0,
    n,
  ]);
};
