// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(105295),
    n = t.r(988775),
    i = t.r(960549),
    a = t.r(541920);
  function u(t) {
    return t.call.bind(t);
  }
  var p = "u" > typeof BigInt,
    c = "u" > typeof Symbol,
    y = u(Object.prototype.toString),
    f = u(Number.prototype.valueOf),
    l = u(String.prototype.valueOf),
    s = u(Boolean.prototype.valueOf);
  if (p) var g = u(BigInt.prototype.valueOf);
  if (c) var b = u(Symbol.prototype.valueOf);
  function v(t, r) {
    if ("object" != typeof t) return !1;
    try {
      return (r(t), !0);
    } catch (t) {
      return !1;
    }
  }
  function h(t) {
    return "[object Map]" === y(t);
  }
  function d(t) {
    return "[object Set]" === y(t);
  }
  function m(t) {
    return "[object WeakMap]" === y(t);
  }
  function A(t) {
    return "[object WeakSet]" === y(t);
  }
  function w(t) {
    return "[object ArrayBuffer]" === y(t);
  }
  function S(t) {
    return (
      !("u" < typeof ArrayBuffer) &&
      (w.working ? w(t) : t instanceof ArrayBuffer)
    );
  }
  function j(t) {
    return "[object DataView]" === y(t);
  }
  function O(t) {
    return (
      !("u" < typeof DataView) && (j.working ? j(t) : t instanceof DataView)
    );
  }
  ((e.isArgumentsObject = o),
    (e.isGeneratorFunction = n),
    (e.isTypedArray = a),
    (e.isPromise = function (t) {
      return (
        ("u" > typeof Promise && t instanceof Promise) ||
        (null !== t &&
          "object" == typeof t &&
          "function" == typeof t.then &&
          "function" == typeof t.catch)
      );
    }),
    (e.isArrayBufferView = function (t) {
      return "u" > typeof ArrayBuffer && ArrayBuffer.isView
        ? ArrayBuffer.isView(t)
        : a(t) || O(t);
    }),
    (e.isUint8Array = function (t) {
      return "Uint8Array" === i(t);
    }),
    (e.isUint8ClampedArray = function (t) {
      return "Uint8ClampedArray" === i(t);
    }),
    (e.isUint16Array = function (t) {
      return "Uint16Array" === i(t);
    }),
    (e.isUint32Array = function (t) {
      return "Uint32Array" === i(t);
    }),
    (e.isInt8Array = function (t) {
      return "Int8Array" === i(t);
    }),
    (e.isInt16Array = function (t) {
      return "Int16Array" === i(t);
    }),
    (e.isInt32Array = function (t) {
      return "Int32Array" === i(t);
    }),
    (e.isFloat32Array = function (t) {
      return "Float32Array" === i(t);
    }),
    (e.isFloat64Array = function (t) {
      return "Float64Array" === i(t);
    }),
    (e.isBigInt64Array = function (t) {
      return "BigInt64Array" === i(t);
    }),
    (e.isBigUint64Array = function (t) {
      return "BigUint64Array" === i(t);
    }),
    (h.working = "u" > typeof Map && h(new Map())),
    (e.isMap = function (t) {
      return !("u" < typeof Map) && (h.working ? h(t) : t instanceof Map);
    }),
    (d.working = "u" > typeof Set && d(new Set())),
    (e.isSet = function (t) {
      return !("u" < typeof Set) && (d.working ? d(t) : t instanceof Set);
    }),
    (m.working = "u" > typeof WeakMap && m(new WeakMap())),
    (e.isWeakMap = function (t) {
      return (
        !("u" < typeof WeakMap) && (m.working ? m(t) : t instanceof WeakMap)
      );
    }),
    (A.working = "u" > typeof WeakSet && A(new WeakSet())),
    (e.isWeakSet = function (t) {
      return A(t);
    }),
    (w.working = "u" > typeof ArrayBuffer && w(new ArrayBuffer())),
    (e.isArrayBuffer = S),
    (j.working =
      "u" > typeof ArrayBuffer &&
      "u" > typeof DataView &&
      j(new DataView(new ArrayBuffer(1), 0, 1))),
    (e.isDataView = O));
  var P = "u" > typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;
  function x(t) {
    return "[object SharedArrayBuffer]" === y(t);
  }
  function E(t) {
    return (
      void 0 !== P &&
      (void 0 === x.working && (x.working = x(new P())),
      x.working ? x(t) : t instanceof P)
    );
  }
  function F(t) {
    return v(t, f);
  }
  function I(t) {
    return v(t, l);
  }
  function U(t) {
    return v(t, s);
  }
  function B(t) {
    return p && v(t, g);
  }
  function R(t) {
    return c && v(t, b);
  }
  ((e.isSharedArrayBuffer = E),
    (e.isAsyncFunction = function (t) {
      return "[object AsyncFunction]" === y(t);
    }),
    (e.isMapIterator = function (t) {
      return "[object Map Iterator]" === y(t);
    }),
    (e.isSetIterator = function (t) {
      return "[object Set Iterator]" === y(t);
    }),
    (e.isGeneratorObject = function (t) {
      return "[object Generator]" === y(t);
    }),
    (e.isWebAssemblyCompiledModule = function (t) {
      return "[object WebAssembly.Module]" === y(t);
    }),
    (e.isNumberObject = F),
    (e.isStringObject = I),
    (e.isBooleanObject = U),
    (e.isBigIntObject = B),
    (e.isSymbolObject = R),
    (e.isBoxedPrimitive = function (t) {
      return F(t) || I(t) || U(t) || B(t) || R(t);
    }),
    (e.isAnyArrayBuffer = function (t) {
      return "u" > typeof Uint8Array && (S(t) || E(t));
    }),
    ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function (t) {
      Object.defineProperty(e, t, {
        enumerable: !1,
        value: function () {
          throw Error(t + " is not supported in userland");
        },
      });
    }));
};
