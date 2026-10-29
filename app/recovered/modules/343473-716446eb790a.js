// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(121572),
    n = t.r(892715),
    i = t.r(607829),
    a = t.r(498493),
    u = t.r(167914),
    p = t.r(26857),
    c = t.r(231473),
    y = t.r(991878),
    f = t.r(978866),
    l = t.r(365335),
    s = t.r(922083),
    g = t.r(640465),
    b = t.r(18849),
    v = t.r(97988),
    h = t.r(366205),
    d = Function,
    m = function (t) {
      try {
        return d('"use strict"; return (' + t + ").constructor;")();
      } catch (t) {}
    },
    A = t.r(83585),
    w = t.r(393155),
    S = function () {
      throw new c();
    },
    j = A
      ? (function () {
          try {
            return (arguments.callee, S);
          } catch (t) {
            try {
              return A(arguments, "callee").get;
            } catch (t) {
              return S;
            }
          }
        })()
      : S,
    O = t.r(811880)(),
    P = t.r(211915),
    x = t.r(818991),
    E = t.r(277146),
    F = t.r(996077),
    I = t.r(487957),
    U = {},
    B = "u" > typeof Uint8Array && P ? P(Uint8Array) : void 0,
    R = {
      __proto__: null,
      "%AggregateError%": "u" < typeof AggregateError ? void 0 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": "u" < typeof ArrayBuffer ? void 0 : ArrayBuffer,
      "%ArrayIteratorPrototype%": O && P ? P([][Symbol.iterator]()) : void 0,
      "%AsyncFromSyncIteratorPrototype%": void 0,
      "%AsyncFunction%": U,
      "%AsyncGenerator%": U,
      "%AsyncGeneratorFunction%": U,
      "%AsyncIteratorPrototype%": U,
      "%Atomics%": "u" < typeof Atomics ? void 0 : Atomics,
      "%BigInt%": "u" < typeof BigInt ? void 0 : BigInt,
      "%BigInt64Array%": "u" < typeof BigInt64Array ? void 0 : BigInt64Array,
      "%BigUint64Array%": "u" < typeof BigUint64Array ? void 0 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": "u" < typeof DataView ? void 0 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": n,
      "%eval%": eval,
      "%EvalError%": i,
      "%Float16Array%": "u" < typeof Float16Array ? void 0 : Float16Array,
      "%Float32Array%": "u" < typeof Float32Array ? void 0 : Float32Array,
      "%Float64Array%": "u" < typeof Float64Array ? void 0 : Float64Array,
      "%FinalizationRegistry%":
        "u" < typeof FinalizationRegistry ? void 0 : FinalizationRegistry,
      "%Function%": d,
      "%GeneratorFunction%": U,
      "%Int8Array%": "u" < typeof Int8Array ? void 0 : Int8Array,
      "%Int16Array%": "u" < typeof Int16Array ? void 0 : Int16Array,
      "%Int32Array%": "u" < typeof Int32Array ? void 0 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": O && P ? P(P([][Symbol.iterator]())) : void 0,
      "%JSON%": "object" == typeof JSON ? JSON : void 0,
      "%Map%": "u" < typeof Map ? void 0 : Map,
      "%MapIteratorPrototype%":
        "u" > typeof Map && O && P ? P(new Map()[Symbol.iterator]()) : void 0,
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": o,
      "%Object.getOwnPropertyDescriptor%": A,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": "u" < typeof Promise ? void 0 : Promise,
      "%Proxy%": "u" < typeof Proxy ? void 0 : Proxy,
      "%RangeError%": a,
      "%ReferenceError%": u,
      "%Reflect%": "u" < typeof Reflect ? void 0 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": "u" < typeof Set ? void 0 : Set,
      "%SetIteratorPrototype%":
        "u" > typeof Set && O && P ? P(new Set()[Symbol.iterator]()) : void 0,
      "%SharedArrayBuffer%":
        "u" < typeof SharedArrayBuffer ? void 0 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": O && P ? P(""[Symbol.iterator]()) : void 0,
      "%Symbol%": O ? Symbol : void 0,
      "%SyntaxError%": p,
      "%ThrowTypeError%": j,
      "%TypedArray%": B,
      "%TypeError%": c,
      "%Uint8Array%": "u" < typeof Uint8Array ? void 0 : Uint8Array,
      "%Uint8ClampedArray%":
        "u" < typeof Uint8ClampedArray ? void 0 : Uint8ClampedArray,
      "%Uint16Array%": "u" < typeof Uint16Array ? void 0 : Uint16Array,
      "%Uint32Array%": "u" < typeof Uint32Array ? void 0 : Uint32Array,
      "%URIError%": y,
      "%WeakMap%": "u" < typeof WeakMap ? void 0 : WeakMap,
      "%WeakRef%": "u" < typeof WeakRef ? void 0 : WeakRef,
      "%WeakSet%": "u" < typeof WeakSet ? void 0 : WeakSet,
      "%Function.prototype.call%": I,
      "%Function.prototype.apply%": F,
      "%Object.defineProperty%": w,
      "%Object.getPrototypeOf%": x,
      "%Math.abs%": f,
      "%Math.floor%": l,
      "%Math.max%": s,
      "%Math.min%": g,
      "%Math.pow%": b,
      "%Math.round%": v,
      "%Math.sign%": h,
      "%Reflect.getPrototypeOf%": E,
    };
  if (P)
    try {
      null.error;
    } catch (t) {
      var M = P(P(t));
      R["%Error.prototype%"] = M;
    }
  var k = function t(r) {
      var e;
      if ("%AsyncFunction%" === r) e = m("async function () {}");
      else if ("%GeneratorFunction%" === r) e = m("function* () {}");
      else if ("%AsyncGeneratorFunction%" === r) e = m("async function* () {}");
      else if ("%AsyncGenerator%" === r) {
        var o = t("%AsyncGeneratorFunction%");
        o && (e = o.prototype);
      } else if ("%AsyncIteratorPrototype%" === r) {
        var n = t("%AsyncGenerator%");
        n && P && (e = P(n.prototype));
      }
      return ((R[r] = e), e);
    },
    T = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": [
        "AsyncGeneratorFunction",
        "prototype",
        "prototype",
      ],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"],
    },
    _ = t.r(78387),
    D = t.r(701054),
    N = _.call(I, Array.prototype.concat),
    W = _.call(F, Array.prototype.splice),
    C = _.call(I, String.prototype.replace),
    G = _.call(I, String.prototype.slice),
    z = _.call(I, RegExp.prototype.exec),
    $ =
      /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,
    V = /\\(\\)?/g,
    J = function (t) {
      var r = G(t, 0, 1),
        e = G(t, -1);
      if ("%" === r && "%" !== e)
        throw new p("invalid intrinsic syntax, expected closing `%`");
      if ("%" === e && "%" !== r)
        throw new p("invalid intrinsic syntax, expected opening `%`");
      var o = [];
      return (
        C(t, $, function (t, r, e, n) {
          o[o.length] = e ? C(n, V, "$1") : r || t;
        }),
        o
      );
    },
    H = function (t, r) {
      var e,
        o = t;
      if ((D(T, o) && (o = "%" + (e = T[o])[0] + "%"), D(R, o))) {
        var n = R[o];
        if ((n === U && (n = k(o)), void 0 === n && !r))
          throw new c(
            "intrinsic " +
              t +
              " exists, but is not available. Please file an issue!",
          );
        return { alias: e, name: o, value: n };
      }
      throw new p("intrinsic " + t + " does not exist!");
    };
  r.exports = function (t, r) {
    if ("string" != typeof t || 0 === t.length)
      throw new c("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && "boolean" != typeof r)
      throw new c('"allowMissing" argument must be a boolean');
    if (null === z(/^%?[^%]*%?$/, t))
      throw new p(
        "`%` may not be present anywhere but at the beginning and end of the intrinsic name",
      );
    var e = J(t),
      o = e.length > 0 ? e[0] : "",
      n = H("%" + o + "%", r),
      i = n.name,
      a = n.value,
      u = !1,
      y = n.alias;
    y && ((o = y[0]), W(e, N([0, 1], y)));
    for (var f = 1, l = !0; f < e.length; f += 1) {
      var s = e[f],
        g = G(s, 0, 1),
        b = G(s, -1);
      if (
        ('"' === g ||
          "'" === g ||
          "`" === g ||
          '"' === b ||
          "'" === b ||
          "`" === b) &&
        g !== b
      )
        throw new p("property names with quotes must have matching quotes");
      if (
        (("constructor" !== s && l) || (u = !0),
        (o += "." + s),
        D(R, (i = "%" + o + "%")))
      )
        a = R[i];
      else if (null != a) {
        if (!(s in a)) {
          if (!r)
            throw new c(
              "base intrinsic for " +
                t +
                " exists, but the property is not available.",
            );
          return;
        }
        if (A && f + 1 >= e.length) {
          var v = A(a, s);
          a =
            (l = !!v) && "get" in v && !("originalValue" in v.get)
              ? v.get
              : a[s];
        } else ((l = D(a, s)), (a = a[s]));
        l && !u && (R[i] = a);
      }
    }
    return a;
  };
};
