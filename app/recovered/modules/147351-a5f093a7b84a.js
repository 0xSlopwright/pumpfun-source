// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t, r, n, i;
  var o,
    a,
    s,
    l,
    u,
    d,
    c,
    f,
    h,
    p,
    g,
    b,
    m = e.i(753887);
  function y(e) {
    return (y =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function w(e, t, r) {
    var n;
    return (
      ((n = (function (e, t) {
        if ("object" != y(e) || !e) return e;
        var r = e[Symbol.toPrimitive];
        if (void 0 !== r) {
          var n = r.call(e, t || "default");
          if ("object" != y(n)) return n;
          throw TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === t ? String : Number)(e);
      })(t, "string")),
      (t = "symbol" == y(n) ? n : n + "") in e)
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  function v(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      (t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, n));
    }
    return r;
  }
  function _(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? v(Object(r), !0).forEach(function (t) {
            w(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
          : v(Object(r)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(r, t),
              );
            });
    }
    return e;
  }
  var S = e.i(971370),
    E = e.i(862120),
    A = e.i(87131),
    x = e.i(679877),
    M = e.i(124719),
    k = e.i(353188),
    P = e.i(421262);
  function O() {}
  class B extends E.Duplex {
    constructor(e) {
      let {
        name: t,
        target: r,
        targetWindow: n = window,
        targetOrigin: i = "*",
      } = e;
      if (
        (super({ objectMode: !0 }),
        w(this, "_init", void 0),
        w(this, "_haveSyn", void 0),
        w(this, "_name", void 0),
        w(this, "_target", void 0),
        w(this, "_targetWindow", void 0),
        w(this, "_targetOrigin", void 0),
        w(this, "_onMessage", void 0),
        w(this, "_synIntervalId", void 0),
        !t || !r)
      )
        throw Error("Invalid input.");
      ((this._init = !1),
        (this._haveSyn = !1),
        (this._name = t),
        (this._target = r),
        (this._targetWindow = n),
        (this._targetOrigin = i),
        (this._onMessage = this.onMessage.bind(this)),
        (this._synIntervalId = null),
        window.addEventListener("message", this._onMessage, !1),
        this._handShake());
    }
    _break() {
      (this.cork(),
        this._write("BRK", null, O),
        (this._haveSyn = !1),
        (this._init = !1));
    }
    _handShake() {
      (this._write("SYN", null, O), this.cork());
    }
    _onData(e) {
      if (this._init)
        if ("BRK" === e) this._break();
        else
          try {
            this.push(e);
          } catch (e) {
            this.emit("error", e);
          }
      else
        "SYN" === e
          ? ((this._haveSyn = !0), this._write("ACK", null, O))
          : "ACK" === e &&
            ((this._init = !0),
            this._haveSyn || this._write("ACK", null, O),
            this.uncork());
    }
    _postMessage(e) {
      let t = this._targetOrigin;
      this._targetWindow.postMessage({ target: this._target, data: e }, t);
    }
    onMessage(e) {
      let t = e.data;
      ("*" === this._targetOrigin || e.origin === this._targetOrigin) &&
        e.source === this._targetWindow &&
        "object" == typeof t &&
        t.target === this._name &&
        t.data &&
        this._onData(t.data);
    }
    _read() {}
    _write(e, t, r) {
      (this._postMessage(e), r());
    }
    _destroy() {
      window.removeEventListener("message", this._onMessage, !1);
    }
  }
  let I = {
    "-32700": {
      standard: "JSON RPC 2.0",
      message:
        "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.",
    },
    "-32600": {
      standard: "JSON RPC 2.0",
      message: "The JSON sent is not a valid Request object.",
    },
    "-32601": {
      standard: "JSON RPC 2.0",
      message: "The method does not exist / is not available.",
    },
    "-32602": {
      standard: "JSON RPC 2.0",
      message: "Invalid method parameter(s).",
    },
    "-32603": { standard: "JSON RPC 2.0", message: "Internal JSON-RPC error." },
    "-32000": { standard: "EIP-1474", message: "Invalid input." },
    "-32001": { standard: "EIP-1474", message: "Resource not found." },
    "-32002": { standard: "EIP-1474", message: "Resource unavailable." },
    "-32003": { standard: "EIP-1474", message: "Transaction rejected." },
    "-32004": { standard: "EIP-1474", message: "Method not supported." },
    "-32005": { standard: "EIP-1474", message: "Request limit exceeded." },
    4001: { standard: "EIP-1193", message: "User rejected the request." },
    4100: {
      standard: "EIP-1193",
      message:
        "The requested account and/or method has not been authorized by the user.",
    },
    4200: {
      standard: "EIP-1193",
      message:
        "The requested method is not supported by this Ethereum provider.",
    },
    4900: {
      standard: "EIP-1193",
      message: "The provider is disconnected from all chains.",
    },
    4901: {
      standard: "EIP-1193",
      message: "The provider is disconnected from the specified chain.",
    },
  };
  function R(e) {
    return Number.isInteger(e);
  }
  function T(e) {
    return "string" == typeof e && e.length > 0;
  }
  function C(e) {
    return !!e && "object" == typeof e && !Array.isArray(e);
  }
  function j(e) {
    return !!e && !!R(e.code) && !!T(e.message) && (!e.stack || !!T(e.stack));
  }
  let N = {
    code: -32603,
    message: (function (e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : "Unspecified error message. This is a bug, please report it.";
      if (R(e)) {
        let t = e.toString();
        if (Object.hasOwn(I, t)) return I[t].message;
        if (e >= -32099 && e <= -32e3) return "Unspecified server error.";
      }
      return t;
    })(-32603),
  };
  function L(e) {
    try {
      JSON.parse(
        JSON.stringify(e, (e, t) => {
          if (
            "__proto__" === e ||
            "constructor" === e ||
            "function" == typeof t ||
            "symbol" == typeof t
          )
            throw Error("Not valid json");
          return t;
        }),
        (e, t) => {
          if ("__proto__" !== e && "constructor" !== e) return t;
        },
      );
    } catch (e) {
      return !1;
    }
    return !0;
  }
  function F(e) {
    return Object.getOwnPropertyNames(e).reduce((t, r) => {
      let n = e[r];
      return (L(n) && (t[r] = n), t);
    }, {});
  }
  function q(e) {
    let { fallbackError: t = N, shouldIncludeStack: r = !0 } =
      arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (!j(t))
      throw Error(
        "Must provide fallback error with integer number code and string message.",
      );
    let n = (function (e, t) {
      if (
        e &&
        "object" == typeof e &&
        "serialize" in e &&
        "function" == typeof e.serialize
      )
        return e.serialize();
      if (j(e)) return e;
      let r = Array.isArray(e)
        ? e.map((e) => (L(e) ? e : C(e) ? F(e) : null))
        : C(e)
          ? F(e)
          : L(e)
            ? e
            : null;
      return _(_({}, t), {}, { data: { cause: r } });
    })(e, t);
    return (r || delete n.stack, n);
  }
  function D(e, t, r) {
    try {
      Reflect.apply(e, t, r);
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  }
  class U extends x.EventEmitter {
    emit(e) {
      let t = "error" === e,
        r = this._events;
      if (void 0 !== r) t = t && void 0 === r.error;
      else if (!t) return !1;
      for (
        var n = arguments.length, i = Array(n > 1 ? n - 1 : 0), o = 1;
        o < n;
        o++
      )
        i[o - 1] = arguments[o];
      if (t) {
        let e;
        if ((i.length > 0 && ([e] = i), e instanceof Error)) throw e;
        let t = Error(`Unhandled error.${e ? ` (${e.message})` : ""}`);
        throw ((t.context = e), t);
      }
      let a = r[e];
      if (void 0 === a) return !1;
      if ("function" == typeof a) D(a, this, i);
      else {
        let e = a.length,
          t = (function (e) {
            let t = e.length,
              r = Array(t);
            for (let n = 0; n < t; n += 1) r[n] = e[n];
            return r;
          })(a);
        for (let r = 0; r < e; r += 1) D(t[r], this, i);
      }
      return !0;
    }
  }
  class W extends Error {
    constructor(e) {
      let { code: t, message: r, data: n } = e;
      if (!Number.isInteger(t)) throw Error("code must be an integer");
      if (!r || "string" != typeof r) throw Error("message must be string");
      (super(r),
        w(this, "code", void 0),
        w(this, "data", void 0),
        (this.code = t),
        void 0 !== n && (this.data = n));
    }
    toString() {
      return (0, A.default)({
        code: this.code,
        message: this.message,
        data: this.data,
        stack: this.stack,
      });
    }
  }
  let $ = function (e, t) {
    let r = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
    return (n, i) => {
      n || i.error
        ? t(n || i.error)
        : !r || Array.isArray(i)
          ? e(i)
          : e(i.result);
    };
  };
  class z extends U {
    constructor() {
      (super(), w(this, "_middleware", void 0), (this._middleware = []));
    }
    static async _runAllMiddleware(e, t, r) {
      let n = [],
        i = null,
        o = !1;
      for (let a of r)
        if ((([i, o] = await z._runMiddleware(e, t, a, n)), o)) break;
      return [i, o, n.reverse()];
    }
    static _runMiddleware(e, t, r, n) {
      return new Promise((i) => {
        let o = (e) => {
          let r = e || t.error;
          (r &&
            ("object" == typeof r &&
              !1 === Object.keys(r).includes("stack") &&
              (r.stack = "Stack trace is not available."),
            (t.error = q(r, {
              shouldIncludeStack: !0,
              fallbackError: {
                message:
                  (null == r ? void 0 : r.message) ||
                  (null == r ? void 0 : r.toString()),
                code: (null == r ? void 0 : r.code) || -32603,
                stack:
                  (null == r ? void 0 : r.stack) ||
                  "Stack trace is not available.",
                data:
                  (null == r ? void 0 : r.data) ||
                  (null == r ? void 0 : r.message) ||
                  (null == r ? void 0 : r.toString()),
              },
            }))),
            i([r, !0]));
        };
        try {
          r(
            e,
            t,
            (e) => {
              t.error
                ? o(t.error)
                : (e &&
                    ("function" != typeof e &&
                      o(
                        new W({
                          code: -32603,
                          message:
                            "JRPCEngine: 'next' return handlers must be functions",
                        }),
                      ),
                    n.push(e)),
                  i([null, !1]));
            },
            o,
          );
        } catch (e) {
          o(e);
        }
      });
    }
    static async _runReturnHandlers(e) {
      for (let t of e)
        await new Promise((e, r) => {
          t((t) => (t ? r(t) : e()));
        });
    }
    static _checkForCompletion(e, t, r) {
      if (!("result" in t) && !("error" in t))
        throw new W({
          code: -32603,
          message: "Response has no error or result for request",
        });
      if (!r) throw new W({ code: -32603, message: "Nothing ended request" });
    }
    push(e) {
      this._middleware.push(e);
    }
    handle(e, t) {
      if (t && "function" != typeof t)
        throw Error('"callback" must be a function if provided.');
      return Array.isArray(e)
        ? t
          ? this._handleBatch(e, t)
          : this._handleBatch(e)
        : t
          ? this._handle(e, t)
          : this._promiseHandle(e);
    }
    asMiddleware() {
      return async (e, t, r, n) => {
        try {
          let [i, o, a] = await z._runAllMiddleware(e, t, this._middleware);
          if (o) return (await z._runReturnHandlers(a), n(i));
          return r(async (e) => {
            try {
              await z._runReturnHandlers(a);
            } catch (t) {
              return e(t);
            }
            return e();
          });
        } catch (e) {
          return n(e);
        }
      };
    }
    async _handleBatch(e, t) {
      try {
        let r = await Promise.all(e.map(this._promiseHandle.bind(this)));
        if (t) return t(null, r);
        return r;
      } catch (e) {
        if (t) return t(e);
        throw e;
      }
    }
    _promiseHandle(e) {
      return new Promise((t, r) => {
        this._handle(e, (e, n) => {
          e && void 0 === n ? r(e) : t(n);
        }).catch(r);
      });
    }
    async _handle(e, t) {
      if (!e || Array.isArray(e) || "object" != typeof e) {
        let e = new W({
          code: -32603,
          message: "request must be plain object",
        });
        return t(e, { id: void 0, jsonrpc: "2.0", error: e });
      }
      if ("string" != typeof e.method) {
        let r = new W({ code: -32603, message: "method must be string" });
        return t(r, { id: e.id, jsonrpc: "2.0", error: r });
      }
      let r = _({}, e),
        n = { id: r.id, jsonrpc: r.jsonrpc },
        i = null;
      try {
        await this._processRequest(r, n);
      } catch (e) {
        i = e;
      }
      if (i && (delete n.result, !n.error)) {
        var o, a, s, l, u, d, c;
        ("object" == typeof i &&
          !1 === Object.keys(i).includes("stack") &&
          (i.stack = "Stack trace is not available."),
          (n.error = q(i, {
            shouldIncludeStack: !0,
            fallbackError: {
              message:
                (null == (o = i) ? void 0 : o.message) ||
                (null == (a = i) ? void 0 : a.toString()),
              code: (null == (s = i) ? void 0 : s.code) || -32603,
              stack:
                (null == (l = i) ? void 0 : l.stack) ||
                "Stack trace is not available.",
              data:
                (null == (u = i) ? void 0 : u.data) ||
                (null == (d = i) ? void 0 : d.message) ||
                (null == (c = i) ? void 0 : c.toString()),
            },
          })));
      }
      return t(i, n);
    }
    async _processRequest(e, t) {
      let [r, n, i] = await z._runAllMiddleware(e, t, this._middleware);
      if ((z._checkForCompletion(e, t, n), await z._runReturnHandlers(i), r))
        throw r;
    }
  }
  class H extends E.Duplex {
    constructor(e) {
      let { parent: t, name: r } = e;
      (super({ objectMode: !0 }),
        w(this, "_parent", void 0),
        w(this, "_name", void 0),
        (this._parent = t),
        (this._name = r));
    }
    _read() {}
    _write(e, t, r) {
      (this._parent.push({ name: this._name, data: e }), r());
    }
  }
  let V = Symbol("IGNORE_SUBSTREAM");
  class K extends E.Duplex {
    constructor() {
      let e =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      (super(_(_({}, e), {}, { objectMode: !0 })),
        w(this, "_substreams", void 0),
        w(this, "getStream", void 0),
        (this._substreams = {}));
    }
    createStream(e) {
      var t, r;
      let n;
      if (!e) throw Error("ObjectMultiplex - name must not be empty");
      if (this._substreams[e])
        throw Error(
          `ObjectMultiplex - Substream for name "${e}" already exists`,
        );
      let i = new H({ parent: this, name: e });
      return (
        (this._substreams[e] = i),
        (t = this),
        (r = (e) => i.destroy(e || void 0)),
        (n = (0, k.default)(r)),
        (0, M.default)(t, { readable: !1 }, n),
        (0, M.default)(t, { writable: !1 }, n),
        i
      );
    }
    ignoreStream(e) {
      if (!e) throw Error("ObjectMultiplex - name must not be empty");
      if (this._substreams[e])
        throw Error(
          `ObjectMultiplex - Substream for name "${e}" already exists`,
        );
      this._substreams[e] = V;
    }
    _read() {}
    _write(e, t, r) {
      let { name: n, data: i } = e;
      if (!n)
        return (
          window.console.warn(
            `ObjectMultiplex - malformed chunk without name "${e}"`,
          ),
          r()
        );
      let o = this._substreams[n];
      return (
        o
          ? o !== V && o.push(i)
          : window.console.warn(
              `ObjectMultiplex - orphaned data for stream "${n}"`,
            ),
        r()
      );
    }
  }
  e.i(547393);
  var G = e.i(105524);
  function J(e) {
    if (!Number.isSafeInteger(e) || e < 0)
      throw Error(`positive integer expected, not ${e}`);
  }
  function Z(e, ...t) {
    if (
      !(
        e instanceof Uint8Array ||
        (null != e &&
          "object" == typeof e &&
          "Uint8Array" === e.constructor.name)
      )
    )
      throw Error("Uint8Array expected");
    if (t.length > 0 && !t.includes(e.length))
      throw Error(
        `Uint8Array expected of length ${t}, not of length=${e.length}`,
      );
  }
  G.default.getLogger("http-helpers").setLevel(G.levels.INFO);
  function Y(e, t = !0) {
    if (e.destroyed) throw Error("Hash instance has been destroyed");
    if (t && e.finished) throw Error("Hash#digest() has already been called");
  }
  function Q(e, t) {
    Z(e);
    let r = t.outputLen;
    if (e.length < r)
      throw Error(`digestInto() expects output buffer of length at least ${r}`);
  }
  let X =
      "object" == typeof globalThis && "crypto" in globalThis
        ? globalThis.crypto
        : void 0,
    ee = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength),
    et = (e, t) => (e << (32 - t)) | (e >>> t),
    er = 68 === new Uint8Array(new Uint32Array([0x11223344]).buffer)[0],
    en = (e) =>
      ((e << 24) & 0xff000000) |
      ((e << 8) & 0xff0000) |
      ((e >>> 8) & 65280) |
      ((e >>> 24) & 255);
  function ei(e) {
    for (let t = 0; t < e.length; t++) e[t] = en(e[t]);
  }
  function eo(e) {
    return (
      "string" == typeof e &&
        (e = (function (e) {
          if ("string" != typeof e)
            throw Error(`utf8ToBytes expected string, got ${typeof e}`);
          return new Uint8Array(new TextEncoder().encode(e));
        })(e)),
      Z(e),
      e
    );
  }
  class ea {
    clone() {
      return this._cloneInto();
    }
  }
  function es(e) {
    let t = (t) => e().update(eo(t)).digest(),
      r = e();
    return (
      (t.outputLen = r.outputLen),
      (t.blockLen = r.blockLen),
      (t.create = () => e()),
      t
    );
  }
  function el(e = 32) {
    if (X && "function" == typeof X.getRandomValues)
      return X.getRandomValues(new Uint8Array(e));
    throw Error("crypto.getRandomValues must be defined");
  }
  let eu = (e, t, r) => (e & t) ^ (~e & r),
    ed = (e, t, r) => (e & t) ^ (e & r) ^ (t & r);
  class ec extends ea {
    constructor(e, t, r, n) {
      (super(),
        (this.blockLen = e),
        (this.outputLen = t),
        (this.padOffset = r),
        (this.isLE = n),
        (this.finished = !1),
        (this.length = 0),
        (this.pos = 0),
        (this.destroyed = !1),
        (this.buffer = new Uint8Array(e)),
        (this.view = ee(this.buffer)));
    }
    update(e) {
      Y(this);
      let { view: t, buffer: r, blockLen: n } = this,
        i = (e = eo(e)).length;
      for (let o = 0; o < i; ) {
        let a = Math.min(n - this.pos, i - o);
        if (a === n) {
          let t = ee(e);
          for (; n <= i - o; o += n) this.process(t, o);
          continue;
        }
        (r.set(e.subarray(o, o + a), this.pos),
          (this.pos += a),
          (o += a),
          this.pos === n && (this.process(t, 0), (this.pos = 0)));
      }
      return ((this.length += e.length), this.roundClean(), this);
    }
    digestInto(e) {
      (Y(this), Q(e, this), (this.finished = !0));
      let { buffer: t, view: r, blockLen: n, isLE: i } = this,
        { pos: o } = this;
      ((t[o++] = 128),
        this.buffer.subarray(o).fill(0),
        this.padOffset > n - o && (this.process(r, 0), (o = 0)));
      for (let e = o; e < n; e++) t[e] = 0;
      (!(function (e, t, r, n) {
        if ("function" == typeof e.setBigUint64) return e.setBigUint64(t, r, n);
        let i = BigInt(32),
          o = BigInt(0xffffffff),
          a = Number((r >> i) & o),
          s = Number(r & o),
          l = 4 * !!n,
          u = 4 * !n;
        (e.setUint32(t + l, a, n), e.setUint32(t + u, s, n));
      })(r, n - 8, BigInt(8 * this.length), i),
        this.process(r, 0));
      let a = ee(e),
        s = this.outputLen;
      if (s % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
      let l = s / 4,
        u = this.get();
      if (l > u.length) throw Error("_sha2: outputLen bigger than state");
      for (let e = 0; e < l; e++) a.setUint32(4 * e, u[e], i);
    }
    digest() {
      let { buffer: e, outputLen: t } = this;
      this.digestInto(e);
      let r = e.slice(0, t);
      return (this.destroy(), r);
    }
    _cloneInto(e) {
      (e || (e = new this.constructor()), e.set(...this.get()));
      let {
        blockLen: t,
        buffer: r,
        length: n,
        finished: i,
        destroyed: o,
        pos: a,
      } = this;
      return (
        (e.length = n),
        (e.pos = a),
        (e.finished = i),
        (e.destroyed = o),
        n % t && e.buffer.set(r),
        e
      );
    }
  }
  let ef = new Uint32Array([
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
      0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
      0xfc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
      0x6ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
      0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ]),
    eh = new Uint32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19,
    ]),
    ep = new Uint32Array(64);
  class eg extends ec {
    constructor() {
      (super(64, 32, 8, !1),
        (this.A = 0 | eh[0]),
        (this.B = 0 | eh[1]),
        (this.C = 0 | eh[2]),
        (this.D = 0 | eh[3]),
        (this.E = 0 | eh[4]),
        (this.F = 0 | eh[5]),
        (this.G = 0 | eh[6]),
        (this.H = 0 | eh[7]));
    }
    get() {
      let { A: e, B: t, C: r, D: n, E: i, F: o, G: a, H: s } = this;
      return [e, t, r, n, i, o, a, s];
    }
    set(e, t, r, n, i, o, a, s) {
      ((this.A = 0 | e),
        (this.B = 0 | t),
        (this.C = 0 | r),
        (this.D = 0 | n),
        (this.E = 0 | i),
        (this.F = 0 | o),
        (this.G = 0 | a),
        (this.H = 0 | s));
    }
    process(e, t) {
      for (let r = 0; r < 16; r++, t += 4) ep[r] = e.getUint32(t, !1);
      for (let e = 16; e < 64; e++) {
        let t = ep[e - 15],
          r = ep[e - 2],
          n = et(t, 7) ^ et(t, 18) ^ (t >>> 3),
          i = et(r, 17) ^ et(r, 19) ^ (r >>> 10);
        ep[e] = (i + ep[e - 7] + n + ep[e - 16]) | 0;
      }
      let { A: r, B: n, C: i, D: o, E: a, F: s, G: l, H: u } = this;
      for (let e = 0; e < 64; e++) {
        let t =
            (u +
              (et(a, 6) ^ et(a, 11) ^ et(a, 25)) +
              eu(a, s, l) +
              ef[e] +
              ep[e]) |
            0,
          d = ((et(r, 2) ^ et(r, 13) ^ et(r, 22)) + ed(r, n, i)) | 0;
        ((u = l),
          (l = s),
          (s = a),
          (a = (o + t) | 0),
          (o = i),
          (i = n),
          (n = r),
          (r = (t + d) | 0));
      }
      ((r = (r + this.A) | 0),
        (n = (n + this.B) | 0),
        (i = (i + this.C) | 0),
        (o = (o + this.D) | 0),
        (a = (a + this.E) | 0),
        (s = (s + this.F) | 0),
        (l = (l + this.G) | 0),
        (u = (u + this.H) | 0),
        this.set(r, n, i, o, a, s, l, u));
    }
    roundClean() {
      ep.fill(0);
    }
    destroy() {
      (this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0));
    }
  }
  let eb = es(() => new eg());
  class em extends ea {
    constructor(e, t) {
      (super(),
        (this.finished = !1),
        (this.destroyed = !1),
        (function (e) {
          if ("function" != typeof e || "function" != typeof e.create)
            throw Error("Hash should be wrapped by utils.wrapConstructor");
          (J(e.outputLen), J(e.blockLen));
        })(e));
      let r = eo(t);
      if (((this.iHash = e.create()), "function" != typeof this.iHash.update))
        throw Error("Expected instance of class which extends utils.Hash");
      ((this.blockLen = this.iHash.blockLen),
        (this.outputLen = this.iHash.outputLen));
      let n = this.blockLen,
        i = new Uint8Array(n);
      i.set(r.length > n ? e.create().update(r).digest() : r);
      for (let e = 0; e < i.length; e++) i[e] ^= 54;
      (this.iHash.update(i), (this.oHash = e.create()));
      for (let e = 0; e < i.length; e++) i[e] ^= 106;
      (this.oHash.update(i), i.fill(0));
    }
    update(e) {
      return (Y(this), this.iHash.update(e), this);
    }
    digestInto(e) {
      (Y(this),
        Z(e, this.outputLen),
        (this.finished = !0),
        this.iHash.digestInto(e),
        this.oHash.update(e),
        this.oHash.digestInto(e),
        this.destroy());
    }
    digest() {
      let e = new Uint8Array(this.oHash.outputLen);
      return (this.digestInto(e), e);
    }
    _cloneInto(e) {
      e || (e = Object.create(Object.getPrototypeOf(this), {}));
      let {
        oHash: t,
        iHash: r,
        finished: n,
        destroyed: i,
        blockLen: o,
        outputLen: a,
      } = this;
      return (
        (e.finished = n),
        (e.destroyed = i),
        (e.blockLen = o),
        (e.outputLen = a),
        (e.oHash = t._cloneInto(e.oHash)),
        (e.iHash = r._cloneInto(e.iHash)),
        e
      );
    }
    destroy() {
      ((this.destroyed = !0), this.oHash.destroy(), this.iHash.destroy());
    }
  }
  let ey = (e, t, r) => new em(e, t).update(r).digest();
  ey.create = (e, t) => new em(e, t);
  let ew = BigInt(0),
    ev = BigInt(1),
    e_ = BigInt(2);
  function eS(e) {
    return (
      e instanceof Uint8Array ||
      (null != e && "object" == typeof e && "Uint8Array" === e.constructor.name)
    );
  }
  function eE(e) {
    if (!eS(e)) throw Error("Uint8Array expected");
  }
  let eA = Array.from({ length: 256 }, (e, t) =>
    t.toString(16).padStart(2, "0"),
  );
  function ex(e) {
    eE(e);
    let t = "";
    for (let r = 0; r < e.length; r++) t += eA[e[r]];
    return t;
  }
  function eM(e) {
    let t = e.toString(16);
    return 1 & t.length ? `0${t}` : t;
  }
  function ek(e) {
    if ("string" != typeof e)
      throw Error("hex string expected, got " + typeof e);
    return BigInt("" === e ? "0" : `0x${e}`);
  }
  function eP(e) {
    return e >= 48 && e <= 57
      ? e - 48
      : e >= 65 && e <= 70
        ? e - 55
        : e >= 97 && e <= 102
          ? e - 87
          : void 0;
  }
  function eO(e) {
    if ("string" != typeof e)
      throw Error("hex string expected, got " + typeof e);
    let t = e.length,
      r = t / 2;
    if (t % 2)
      throw Error(
        "padded hex string expected, got unpadded hex of length " + t,
      );
    let n = new Uint8Array(r);
    for (let t = 0, i = 0; t < r; t++, i += 2) {
      let r = eP(e.charCodeAt(i)),
        o = eP(e.charCodeAt(i + 1));
      if (void 0 === r || void 0 === o)
        throw Error(
          'hex string expected, got non-hex character "' +
            (e[i] + e[i + 1]) +
            '" at index ' +
            i,
        );
      n[t] = 16 * r + o;
    }
    return n;
  }
  function eB(e) {
    return ek(ex(e));
  }
  function eI(e) {
    return (eE(e), ek(ex(Uint8Array.from(e).reverse())));
  }
  function eR(e, t) {
    return eO(e.toString(16).padStart(2 * t, "0"));
  }
  function eT(e, t) {
    return eR(e, t).reverse();
  }
  function eC(e, t, r) {
    let n;
    if ("string" == typeof t)
      try {
        n = eO(t);
      } catch (r) {
        throw Error(`${e} must be valid hex string, got "${t}". Cause: ${r}`);
      }
    else if (eS(t)) n = Uint8Array.from(t);
    else throw Error(`${e} must be hex string or Uint8Array`);
    let i = n.length;
    if ("number" == typeof r && i !== r)
      throw Error(`${e} expected ${r} bytes, got ${i}`);
    return n;
  }
  function ej(...e) {
    let t = 0;
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      (eE(n), (t += n.length));
    }
    let r = new Uint8Array(t);
    for (let t = 0, n = 0; t < e.length; t++) {
      let i = e[t];
      (r.set(i, n), (n += i.length));
    }
    return r;
  }
  function eN(e) {
    if ("string" != typeof e)
      throw Error(`utf8ToBytes expected string, got ${typeof e}`);
    return new Uint8Array(new TextEncoder().encode(e));
  }
  let eL = (e) => (e_ << BigInt(e - 1)) - ev,
    eF = (e) => new Uint8Array(e),
    eq = {
      bigint: (e) => "bigint" == typeof e,
      function: (e) => "function" == typeof e,
      boolean: (e) => "boolean" == typeof e,
      string: (e) => "string" == typeof e,
      stringOrUint8Array: (e) => "string" == typeof e || eS(e),
      isSafeInteger: (e) => Number.isSafeInteger(e),
      array: (e) => Array.isArray(e),
      field: (e, t) => t.Fp.isValid(e),
      hash: (e) => "function" == typeof e && Number.isSafeInteger(e.outputLen),
    };
  function eD(e, t, r = {}) {
    let n = (t, r, n) => {
      let i = eq[r];
      if ("function" != typeof i)
        throw Error(`Invalid validator "${r}", expected function`);
      let o = e[t];
      if ((!n || void 0 !== o) && !i(o, e))
        throw Error(
          `Invalid param ${String(t)}=${o} (${typeof o}), expected ${r}`,
        );
    };
    for (let [e, r] of Object.entries(t)) n(e, r, !1);
    for (let [e, t] of Object.entries(r)) n(e, t, !0);
    return e;
  }
  e.s(
    [
      "abytes",
      0,
      eE,
      "bitGet",
      0,
      function (e, t) {
        return (e >> BigInt(t)) & ev;
      },
      "bitLen",
      0,
      function (e) {
        let t;
        for (t = 0; e > ew; e >>= ev, t += 1);
        return t;
      },
      "bitMask",
      0,
      eL,
      "bitSet",
      0,
      function (e, t, r) {
        return e | ((r ? ev : ew) << BigInt(t));
      },
      "bytesToHex",
      0,
      ex,
      "bytesToNumberBE",
      0,
      eB,
      "bytesToNumberLE",
      0,
      eI,
      "concatBytes",
      0,
      ej,
      "createHmacDrbg",
      0,
      function (e, t, r) {
        if ("number" != typeof e || e < 2)
          throw Error("hashLen must be a number");
        if ("number" != typeof t || t < 2)
          throw Error("qByteLen must be a number");
        if ("function" != typeof r) throw Error("hmacFn must be a function");
        let n = eF(e),
          i = eF(e),
          o = 0,
          a = () => {
            (n.fill(1), i.fill(0), (o = 0));
          },
          s = (...e) => r(i, n, ...e),
          l = (e = eF()) => {
            let t;
            if (
              ((i = s(((t = [0]), Uint8Array.from(t)), e)),
              (n = s()),
              0 !== e.length)
            ) {
              let t;
              ((i = s(((t = [1]), Uint8Array.from(t)), e)), (n = s()));
            }
          },
          u = () => {
            if (o++ >= 1e3) throw Error("drbg: tried 1000 values");
            let e = 0,
              r = [];
            for (; e < t; ) {
              let t = (n = s()).slice();
              (r.push(t), (e += n.length));
            }
            return ej(...r);
          };
        return (e, t) => {
          let r;
          for (a(), l(e); !(r = t(u())); ) l();
          return (a(), r);
        };
      },
      "ensureBytes",
      0,
      eC,
      "equalBytes",
      0,
      function (e, t) {
        if (e.length !== t.length) return !1;
        let r = 0;
        for (let n = 0; n < e.length; n++) r |= e[n] ^ t[n];
        return 0 === r;
      },
      "hexToBytes",
      0,
      eO,
      "hexToNumber",
      0,
      ek,
      "isBytes",
      0,
      eS,
      "numberToBytesBE",
      0,
      eR,
      "numberToBytesLE",
      0,
      eT,
      "numberToHexUnpadded",
      0,
      eM,
      "numberToVarBytesBE",
      0,
      function (e) {
        return eO(eM(e));
      },
      "utf8ToBytes",
      0,
      eN,
      "validateObject",
      0,
      eD,
    ],
    146454,
  );
  let eU = BigInt(0),
    eW = BigInt(1),
    e$ = BigInt(2),
    ez = BigInt(3),
    eH = BigInt(4),
    eV = BigInt(5),
    eK = BigInt(8);
  function eG(e, t) {
    let r = e % t;
    return r >= eU ? r : t + r;
  }
  function eJ(e, t, r) {
    let n = e;
    for (; t-- > eU; ) ((n *= n), (n %= r));
    return n;
  }
  function eZ(e, t) {
    if (e === eU || t <= eU)
      throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);
    let r = eG(e, t),
      n = t,
      i = eU,
      o = eW,
      a = eW,
      s = eU;
    for (; r !== eU; ) {
      let e = n / r,
        t = n % r,
        l = i - a * e,
        u = o - s * e;
      ((n = r), (r = t), (i = a), (o = s), (a = l), (s = u));
    }
    if (n !== eW) throw Error("invert: does not exist");
    return eG(i, t);
  }
  (BigInt(9), BigInt(16));
  let eY = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN",
  ];
  function eQ(e) {
    return eD(
      e,
      eY.reduce((e, t) => ((e[t] = "function"), e), {
        ORDER: "bigint",
        MASK: "bigint",
        BYTES: "isSafeInteger",
        BITS: "isSafeInteger",
      }),
    );
  }
  function eX(e, t) {
    let r = void 0 !== t ? t : e.toString(2).length,
      n = Math.ceil(r / 8);
    return { nBitLength: r, nByteLength: n };
  }
  function e0(e) {
    if ("bigint" != typeof e) throw Error("field order must be bigint");
    return Math.ceil(e.toString(2).length / 8);
  }
  function e1(e) {
    let t = e0(e);
    return t + Math.ceil(t / 2);
  }
  let e2 = BigInt(0),
    e5 = BigInt(1);
  function e3(e) {
    return (
      eQ(e.Fp),
      eD(
        e,
        { n: "bigint", h: "bigint", Gx: "field", Gy: "field" },
        { nBitLength: "isSafeInteger", nByteLength: "isSafeInteger" },
      ),
      Object.freeze({ ...eX(e.n, e.nBitLength), ...e, ...{ p: e.Fp.ORDER } })
    );
  }
  var e4 = e.i(146454);
  let { bytesToNumberBE: e6, hexToBytes: e8 } = e4,
    e7 = {
      Err: class extends Error {
        constructor(e = "") {
          super(e);
        }
      },
      _parseInt(e) {
        let { Err: t } = e7;
        if (e.length < 2 || 2 !== e[0])
          throw new t("Invalid signature integer tag");
        let r = e[1],
          n = e.subarray(2, r + 2);
        if (!r || n.length !== r)
          throw new t("Invalid signature integer: wrong length");
        if (128 & n[0]) throw new t("Invalid signature integer: negative");
        if (0 === n[0] && !(128 & n[1]))
          throw new t("Invalid signature integer: unnecessary leading zero");
        return { d: e6(n), l: e.subarray(r + 2) };
      },
      toSig(e) {
        let { Err: t } = e7,
          r = "string" == typeof e ? e8(e) : e;
        e4.abytes(r);
        let n = r.length;
        if (n < 2 || 48 != r[0]) throw new t("Invalid signature tag");
        if (r[1] !== n - 2) throw new t("Invalid signature: incorrect length");
        let { d: i, l: o } = e7._parseInt(r.subarray(2)),
          { d: a, l: s } = e7._parseInt(o);
        if (s.length)
          throw new t("Invalid signature: left bytes after parsing");
        return { r: i, s: a };
      },
      hexFromSig(e) {
        let t = (e) => (8 & Number.parseInt(e[0], 16) ? "00" + e : e),
          r = (e) => {
            let t = e.toString(16);
            return 1 & t.length ? `0${t}` : t;
          },
          n = t(r(e.s)),
          i = t(r(e.r)),
          o = n.length / 2,
          a = i.length / 2,
          s = r(o),
          l = r(a);
        return `30${r(a + o + 4)}02${l}${i}02${s}${n}`;
      },
    },
    e9 = BigInt(0),
    te = BigInt(1),
    tt = BigInt(2),
    tr = BigInt(3),
    tn = BigInt(4),
    ti = BigInt(
      "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
    ),
    to = BigInt(
      "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
    ),
    ta = BigInt(1),
    ts = BigInt(2),
    tl = (e, t) => (e + t / ts) / t,
    tu = (function (e, t, r = !1, n = {}) {
      if (e <= eU) throw Error(`Expected Field ORDER > 0, got ${e}`);
      let { nBitLength: i, nByteLength: o } = eX(e, t);
      if (o > 2048)
        throw Error("Field lengths over 2048 bytes are not supported");
      let a = (function (e) {
          if (e % eH === ez) {
            let t = (e + eW) / eH;
            return function (e, r) {
              let n = e.pow(r, t);
              if (!e.eql(e.sqr(n), r)) throw Error("Cannot find square root");
              return n;
            };
          }
          if (e % eK === eV) {
            let t = (e - eV) / eK;
            return function (e, r) {
              let n = e.mul(r, e$),
                i = e.pow(n, t),
                o = e.mul(r, i),
                a = e.mul(e.mul(o, e$), i),
                s = e.mul(o, e.sub(a, e.ONE));
              if (!e.eql(e.sqr(s), r)) throw Error("Cannot find square root");
              return s;
            };
          }
          return (function (e) {
            let t,
              r,
              n,
              i = (e - eW) / e$;
            for (t = e - eW, r = 0; t % e$ === eU; t /= e$, r++);
            for (
              n = e$;
              n < e &&
              (function (e, t, r) {
                if (r <= eU || t < eU) throw Error("Expected power/modulo > 0");
                if (r === eW) return eU;
                let n = eW;
                for (; t > eU; )
                  (t & eW && (n = (n * e) % r), (e = (e * e) % r), (t >>= eW));
                return n;
              })(n, i, e) !==
                e - eW;
              n++
            );
            if (1 === r) {
              let t = (e + eW) / eH;
              return function (e, r) {
                let n = e.pow(r, t);
                if (!e.eql(e.sqr(n), r)) throw Error("Cannot find square root");
                return n;
              };
            }
            let o = (t + eW) / e$;
            return function (e, a) {
              if (e.pow(a, i) === e.neg(e.ONE))
                throw Error("Cannot find square root");
              let s = r,
                l = e.pow(e.mul(e.ONE, n), t),
                u = e.pow(a, o),
                d = e.pow(a, t);
              for (; !e.eql(d, e.ONE); ) {
                if (e.eql(d, e.ZERO)) return e.ZERO;
                let t = 1;
                for (let r = e.sqr(d); t < s && !e.eql(r, e.ONE); t++)
                  r = e.sqr(r);
                let r = e.pow(l, eW << BigInt(s - t - 1));
                ((l = e.sqr(r)), (u = e.mul(u, r)), (d = e.mul(d, l)), (s = t));
              }
              return u;
            };
          })(e);
        })(e),
        s = Object.freeze({
          ORDER: e,
          BITS: i,
          BYTES: o,
          MASK: eL(i),
          ZERO: eU,
          ONE: eW,
          create: (t) => eG(t, e),
          isValid: (t) => {
            if ("bigint" != typeof t)
              throw Error(
                `Invalid field element: expected bigint, got ${typeof t}`,
              );
            return eU <= t && t < e;
          },
          is0: (e) => e === eU,
          isOdd: (e) => (e & eW) === eW,
          neg: (t) => eG(-t, e),
          eql: (e, t) => e === t,
          sqr: (t) => eG(t * t, e),
          add: (t, r) => eG(t + r, e),
          sub: (t, r) => eG(t - r, e),
          mul: (t, r) => eG(t * r, e),
          pow: (e, t) =>
            (function (e, t, r) {
              if (r < eU) throw Error("Expected power > 0");
              if (r === eU) return e.ONE;
              if (r === eW) return t;
              let n = e.ONE,
                i = t;
              for (; r > eU; )
                (r & eW && (n = e.mul(n, i)), (i = e.sqr(i)), (r >>= eW));
              return n;
            })(s, e, t),
          div: (t, r) => eG(t * eZ(r, e), e),
          sqrN: (e) => e * e,
          addN: (e, t) => e + t,
          subN: (e, t) => e - t,
          mulN: (e, t) => e * t,
          inv: (t) => eZ(t, e),
          sqrt: n.sqrt || ((e) => a(s, e)),
          invertBatch: (e) => {
            let t, r, n;
            return (
              (t = Array(e.length)),
              (r = e.reduce(
                (e, r, n) => (s.is0(r) ? e : ((t[n] = e), s.mul(e, r))),
                s.ONE,
              )),
              (n = s.inv(r)),
              e.reduceRight(
                (e, r, n) =>
                  s.is0(r) ? e : ((t[n] = s.mul(e, t[n])), s.mul(e, r)),
                n,
              ),
              t
            );
          },
          cmov: (e, t, r) => (r ? t : e),
          toBytes: (e) => (r ? eT(e, o) : eR(e, o)),
          fromBytes: (e) => {
            if (e.length !== o)
              throw Error(`Fp.fromBytes: expected ${o}, got ${e.length}`);
            return r ? eI(e) : eB(e);
          },
        });
      return Object.freeze(s);
    })(ti, void 0, void 0, {
      sqrt: function (e) {
        let t = BigInt(3),
          r = BigInt(6),
          n = BigInt(11),
          i = BigInt(22),
          o = BigInt(23),
          a = BigInt(44),
          s = BigInt(88),
          l = (e * e * e) % ti,
          u = (l * l * e) % ti,
          d = (eJ(u, t, ti) * u) % ti,
          c = (eJ(d, t, ti) * u) % ti,
          f = (eJ(c, ts, ti) * l) % ti,
          h = (eJ(f, n, ti) * f) % ti,
          p = (eJ(h, i, ti) * h) % ti,
          g = (eJ(p, a, ti) * p) % ti,
          b = (eJ(g, s, ti) * g) % ti,
          m = (eJ(b, a, ti) * p) % ti,
          y = (eJ(m, t, ti) * u) % ti,
          w = (eJ(y, o, ti) * h) % ti,
          v = (eJ(w, r, ti) * l) % ti,
          _ = eJ(v, ts, ti);
        if (!tu.eql(tu.sqr(_), e)) throw Error("Cannot find square root");
        return _;
      },
    }),
    td =
      ((o = {
        a: BigInt(0),
        b: BigInt(7),
        Fp: tu,
        n: to,
        Gx: BigInt(
          "55066263022277343669578718895168534326250603453777594175500187360389116729240",
        ),
        Gy: BigInt(
          "32670510020758816978083085130507043184471273380659243275938904335757337482424",
        ),
        h: BigInt(1),
        lowS: !0,
        endo: {
          beta: BigInt(
            "0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
          ),
          splitScalar: (e) => {
            let t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
              r = -ta * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
              n = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
              i = BigInt("0x100000000000000000000000000000000"),
              o = tl(t * e, to),
              a = tl(-r * e, to),
              s = eG(e - o * t - a * n, to),
              l = eG(-o * r - a * t, to),
              u = s > i,
              d = l > i;
            if ((u && (s = to - s), d && (l = to - l), s > i || l > i))
              throw Error("splitScalar: Endomorphism failed, k=" + e);
            return { k1neg: u, k1: s, k2neg: d, k2: l };
          },
        },
      }),
      Object.freeze({
        ...(r = (e) =>
          (function (e) {
            let t,
              r =
                ((t = e3(e)),
                e4.validateObject(
                  t,
                  { hash: "hash", hmac: "function", randomBytes: "function" },
                  {
                    bits2int: "function",
                    bits2int_modN: "function",
                    lowS: "boolean",
                  },
                ),
                Object.freeze({ lowS: !0, ...t })),
              { Fp: n, n: i } = r,
              o = n.BYTES + 1,
              a = 2 * n.BYTES + 1;
            function s(e) {
              return eG(e, i);
            }
            let {
                ProjectivePoint: l,
                normPrivateKeyToScalar: u,
                weierstrassEquation: d,
                isWithinCurveOrder: c,
              } = (function (e) {
                var t;
                let r,
                  n,
                  i = (function (e) {
                    let t = e3(e);
                    e4.validateObject(
                      t,
                      { a: "field", b: "field" },
                      {
                        allowedPrivateKeyLengths: "array",
                        wrapPrivateKey: "boolean",
                        isTorsionFree: "function",
                        clearCofactor: "function",
                        allowInfinityPoint: "boolean",
                        fromBytes: "function",
                        toBytes: "function",
                      },
                    );
                    let { endo: r, Fp: n, a: i } = t;
                    if (r) {
                      if (!n.eql(i, n.ZERO))
                        throw Error(
                          "Endomorphism can only be defined for Koblitz curves that have a=0",
                        );
                      if (
                        "object" != typeof r ||
                        "bigint" != typeof r.beta ||
                        "function" != typeof r.splitScalar
                      )
                        throw Error(
                          "Expected endomorphism with beta: bigint and splitScalar: function",
                        );
                    }
                    return Object.freeze({ ...t });
                  })(e),
                  { Fp: o } = i,
                  a =
                    i.toBytes ||
                    ((e, t, r) => {
                      let n = t.toAffine();
                      return e4.concatBytes(
                        Uint8Array.from([4]),
                        o.toBytes(n.x),
                        o.toBytes(n.y),
                      );
                    }),
                  s =
                    i.fromBytes ||
                    ((e) => {
                      let t = e.subarray(1);
                      return {
                        x: o.fromBytes(t.subarray(0, o.BYTES)),
                        y: o.fromBytes(t.subarray(o.BYTES, 2 * o.BYTES)),
                      };
                    });
                function l(e) {
                  let { a: t, b: r } = i,
                    n = o.sqr(e),
                    a = o.mul(n, e);
                  return o.add(o.add(a, o.mul(e, t)), r);
                }
                if (!o.eql(o.sqr(i.Gy), l(i.Gx)))
                  throw Error("bad generator point: equation left != right");
                function u(e) {
                  return "bigint" == typeof e && e9 < e && e < i.n;
                }
                function d(e) {
                  if (!u(e))
                    throw Error("Expected valid bigint: 0 < bigint < curve.n");
                }
                function c(e) {
                  let t,
                    {
                      allowedPrivateKeyLengths: r,
                      nByteLength: n,
                      wrapPrivateKey: o,
                      n: a,
                    } = i;
                  if (r && "bigint" != typeof e) {
                    if (
                      (e4.isBytes(e) && (e = e4.bytesToHex(e)),
                      "string" != typeof e || !r.includes(e.length))
                    )
                      throw Error("Invalid key");
                    e = e.padStart(2 * n, "0");
                  }
                  try {
                    t =
                      "bigint" == typeof e
                        ? e
                        : e4.bytesToNumberBE(eC("private key", e, n));
                  } catch (t) {
                    throw Error(
                      `private key must be ${n} bytes, hex or bigint, not ${typeof e}`,
                    );
                  }
                  return (o && (t = eG(t, a)), d(t), t);
                }
                let f = new Map();
                function h(e) {
                  if (!(e instanceof p))
                    throw Error("ProjectivePoint expected");
                }
                class p {
                  constructor(e, t, r) {
                    if (
                      ((this.px = e),
                      (this.py = t),
                      (this.pz = r),
                      null == e || !o.isValid(e))
                    )
                      throw Error("x required");
                    if (null == t || !o.isValid(t)) throw Error("y required");
                    if (null == r || !o.isValid(r)) throw Error("z required");
                  }
                  static fromAffine(e) {
                    let { x: t, y: r } = e || {};
                    if (!e || !o.isValid(t) || !o.isValid(r))
                      throw Error("invalid affine point");
                    if (e instanceof p)
                      throw Error("projective point not allowed");
                    let n = (e) => o.eql(e, o.ZERO);
                    return n(t) && n(r) ? p.ZERO : new p(t, r, o.ONE);
                  }
                  get x() {
                    return this.toAffine().x;
                  }
                  get y() {
                    return this.toAffine().y;
                  }
                  static normalizeZ(e) {
                    let t = o.invertBatch(e.map((e) => e.pz));
                    return e.map((e, r) => e.toAffine(t[r])).map(p.fromAffine);
                  }
                  static fromHex(e) {
                    let t = p.fromAffine(s(eC("pointHex", e)));
                    return (t.assertValidity(), t);
                  }
                  static fromPrivateKey(e) {
                    return p.BASE.multiply(c(e));
                  }
                  _setWindowSize(e) {
                    ((this._WINDOW_SIZE = e), f.delete(this));
                  }
                  assertValidity() {
                    if (this.is0()) {
                      if (i.allowInfinityPoint && !o.is0(this.py)) return;
                      throw Error("bad point: ZERO");
                    }
                    let { x: e, y: t } = this.toAffine();
                    if (!o.isValid(e) || !o.isValid(t))
                      throw Error("bad point: x or y not FE");
                    let r = o.sqr(t),
                      n = l(e);
                    if (!o.eql(r, n))
                      throw Error("bad point: equation left != right");
                    if (!this.isTorsionFree())
                      throw Error("bad point: not in prime-order subgroup");
                  }
                  hasEvenY() {
                    let { y: e } = this.toAffine();
                    if (o.isOdd) return !o.isOdd(e);
                    throw Error("Field doesn't support isOdd");
                  }
                  equals(e) {
                    h(e);
                    let { px: t, py: r, pz: n } = this,
                      { px: i, py: a, pz: s } = e,
                      l = o.eql(o.mul(t, s), o.mul(i, n)),
                      u = o.eql(o.mul(r, s), o.mul(a, n));
                    return l && u;
                  }
                  negate() {
                    return new p(this.px, o.neg(this.py), this.pz);
                  }
                  double() {
                    let { a: e, b: t } = i,
                      r = o.mul(t, tr),
                      { px: n, py: a, pz: s } = this,
                      l = o.ZERO,
                      u = o.ZERO,
                      d = o.ZERO,
                      c = o.mul(n, n),
                      f = o.mul(a, a),
                      h = o.mul(s, s),
                      g = o.mul(n, a);
                    return (
                      (g = o.add(g, g)),
                      (d = o.mul(n, s)),
                      (d = o.add(d, d)),
                      (l = o.mul(e, d)),
                      (u = o.mul(r, h)),
                      (u = o.add(l, u)),
                      (l = o.sub(f, u)),
                      (u = o.add(f, u)),
                      (u = o.mul(l, u)),
                      (l = o.mul(g, l)),
                      (d = o.mul(r, d)),
                      (h = o.mul(e, h)),
                      (g = o.sub(c, h)),
                      (g = o.mul(e, g)),
                      (g = o.add(g, d)),
                      (d = o.add(c, c)),
                      (c = o.add(d, c)),
                      (c = o.add(c, h)),
                      (c = o.mul(c, g)),
                      (u = o.add(u, c)),
                      (h = o.mul(a, s)),
                      (h = o.add(h, h)),
                      (c = o.mul(h, g)),
                      (l = o.sub(l, c)),
                      (d = o.mul(h, f)),
                      (d = o.add(d, d)),
                      new p(l, u, (d = o.add(d, d)))
                    );
                  }
                  add(e) {
                    h(e);
                    let { px: t, py: r, pz: n } = this,
                      { px: a, py: s, pz: l } = e,
                      u = o.ZERO,
                      d = o.ZERO,
                      c = o.ZERO,
                      f = i.a,
                      g = o.mul(i.b, tr),
                      b = o.mul(t, a),
                      m = o.mul(r, s),
                      y = o.mul(n, l),
                      w = o.add(t, r),
                      v = o.add(a, s);
                    ((w = o.mul(w, v)),
                      (v = o.add(b, m)),
                      (w = o.sub(w, v)),
                      (v = o.add(t, n)));
                    let _ = o.add(a, l);
                    return (
                      (v = o.mul(v, _)),
                      (_ = o.add(b, y)),
                      (v = o.sub(v, _)),
                      (_ = o.add(r, n)),
                      (u = o.add(s, l)),
                      (_ = o.mul(_, u)),
                      (u = o.add(m, y)),
                      (_ = o.sub(_, u)),
                      (c = o.mul(f, v)),
                      (u = o.mul(g, y)),
                      (c = o.add(u, c)),
                      (u = o.sub(m, c)),
                      (c = o.add(m, c)),
                      (d = o.mul(u, c)),
                      (m = o.add(b, b)),
                      (m = o.add(m, b)),
                      (y = o.mul(f, y)),
                      (v = o.mul(g, v)),
                      (m = o.add(m, y)),
                      (y = o.sub(b, y)),
                      (y = o.mul(f, y)),
                      (v = o.add(v, y)),
                      (b = o.mul(m, v)),
                      (d = o.add(d, b)),
                      (b = o.mul(_, v)),
                      (u = o.mul(w, u)),
                      (u = o.sub(u, b)),
                      (b = o.mul(w, m)),
                      (c = o.mul(_, c)),
                      new p(u, d, (c = o.add(c, b)))
                    );
                  }
                  subtract(e) {
                    return this.add(e.negate());
                  }
                  is0() {
                    return this.equals(p.ZERO);
                  }
                  wNAF(e) {
                    return b.wNAFCached(this, f, e, (e) => {
                      let t = o.invertBatch(e.map((e) => e.pz));
                      return e
                        .map((e, r) => e.toAffine(t[r]))
                        .map(p.fromAffine);
                    });
                  }
                  multiplyUnsafe(e) {
                    let t = p.ZERO;
                    if (e === e9) return t;
                    if ((d(e), e === te)) return this;
                    let { endo: r } = i;
                    if (!r) return b.unsafeLadder(this, e);
                    let { k1neg: n, k1: a, k2neg: s, k2: l } = r.splitScalar(e),
                      u = t,
                      c = t,
                      f = this;
                    for (; a > e9 || l > e9; )
                      (a & te && (u = u.add(f)),
                        l & te && (c = c.add(f)),
                        (f = f.double()),
                        (a >>= te),
                        (l >>= te));
                    return (
                      n && (u = u.negate()),
                      s && (c = c.negate()),
                      (c = new p(o.mul(c.px, r.beta), c.py, c.pz)),
                      u.add(c)
                    );
                  }
                  multiply(e) {
                    let t, r;
                    d(e);
                    let { endo: n } = i;
                    if (n) {
                      let {
                          k1neg: i,
                          k1: a,
                          k2neg: s,
                          k2: l,
                        } = n.splitScalar(e),
                        { p: u, f: d } = this.wNAF(a),
                        { p: c, f: f } = this.wNAF(l);
                      ((u = b.constTimeNegate(i, u)),
                        (c = b.constTimeNegate(s, c)),
                        (c = new p(o.mul(c.px, n.beta), c.py, c.pz)),
                        (t = u.add(c)),
                        (r = d.add(f)));
                    } else {
                      let { p: n, f: i } = this.wNAF(e);
                      ((t = n), (r = i));
                    }
                    return p.normalizeZ([t, r])[0];
                  }
                  multiplyAndAddUnsafe(e, t, r) {
                    let n = p.BASE,
                      i = (e, t) =>
                        t !== e9 && t !== te && e.equals(n)
                          ? e.multiply(t)
                          : e.multiplyUnsafe(t),
                      o = i(this, t).add(i(e, r));
                    return o.is0() ? void 0 : o;
                  }
                  toAffine(e) {
                    let { px: t, py: r, pz: n } = this,
                      i = this.is0();
                    null == e && (e = i ? o.ONE : o.inv(n));
                    let a = o.mul(t, e),
                      s = o.mul(r, e),
                      l = o.mul(n, e);
                    if (i) return { x: o.ZERO, y: o.ZERO };
                    if (!o.eql(l, o.ONE)) throw Error("invZ was invalid");
                    return { x: a, y: s };
                  }
                  isTorsionFree() {
                    let { h: e, isTorsionFree: t } = i;
                    if (e === te) return !0;
                    if (t) return t(p, this);
                    throw Error(
                      "isTorsionFree() has not been declared for the elliptic curve",
                    );
                  }
                  clearCofactor() {
                    let { h: e, clearCofactor: t } = i;
                    return e === te
                      ? this
                      : t
                        ? t(p, this)
                        : this.multiplyUnsafe(i.h);
                  }
                  toRawBytes(e = !0) {
                    return (this.assertValidity(), a(p, this, e));
                  }
                  toHex(e = !0) {
                    return e4.bytesToHex(this.toRawBytes(e));
                  }
                }
                ((p.BASE = new p(i.Gx, i.Gy, o.ONE)),
                  (p.ZERO = new p(o.ZERO, o.ONE, o.ZERO)));
                let g = i.nBitLength,
                  b =
                    ((t = i.endo ? Math.ceil(g / 2) : g),
                    (r = (e, t) => {
                      let r = t.negate();
                      return e ? r : t;
                    }),
                    (n = (e) => ({
                      windows: Math.ceil(t / e) + 1,
                      windowSize: 2 ** (e - 1),
                    })),
                    {
                      constTimeNegate: r,
                      unsafeLadder(e, t) {
                        let r = p.ZERO,
                          n = e;
                        for (; t > e2; )
                          (t & e5 && (r = r.add(n)),
                            (n = n.double()),
                            (t >>= e5));
                        return r;
                      },
                      precomputeWindow(e, t) {
                        let { windows: r, windowSize: i } = n(t),
                          o = [],
                          a = e,
                          s = a;
                        for (let e = 0; e < r; e++) {
                          ((s = a), o.push(s));
                          for (let e = 1; e < i; e++)
                            ((s = s.add(a)), o.push(s));
                          a = s.double();
                        }
                        return o;
                      },
                      wNAF(e, t, i) {
                        let { windows: o, windowSize: a } = n(e),
                          s = p.ZERO,
                          l = p.BASE,
                          u = BigInt(2 ** e - 1),
                          d = 2 ** e,
                          c = BigInt(e);
                        for (let e = 0; e < o; e++) {
                          let n = e * a,
                            o = Number(i & u);
                          ((i >>= c), o > a && ((o -= d), (i += e5)));
                          let f = n + Math.abs(o) - 1,
                            h = e % 2 != 0,
                            p = o < 0;
                          0 === o
                            ? (l = l.add(r(h, t[n])))
                            : (s = s.add(r(p, t[f])));
                        }
                        return { p: s, f: l };
                      },
                      wNAFCached(e, t, r, n) {
                        let i = e._WINDOW_SIZE || 1,
                          o = t.get(e);
                        return (
                          o ||
                            ((o = this.precomputeWindow(e, i)),
                            1 !== i && t.set(e, n(o))),
                          this.wNAF(i, o, r)
                        );
                      },
                    });
                return {
                  CURVE: i,
                  ProjectivePoint: p,
                  normPrivateKeyToScalar: c,
                  weierstrassEquation: l,
                  isWithinCurveOrder: u,
                };
              })({
                ...r,
                toBytes(e, t, r) {
                  let i = t.toAffine(),
                    o = n.toBytes(i.x),
                    a = e4.concatBytes;
                  return r
                    ? a(Uint8Array.from([t.hasEvenY() ? 2 : 3]), o)
                    : a(Uint8Array.from([4]), o, n.toBytes(i.y));
                },
                fromBytes(e) {
                  let t = e.length,
                    r = e[0],
                    i = e.subarray(1);
                  if (t === o && (2 === r || 3 === r)) {
                    let e,
                      t = e4.bytesToNumberBE(i);
                    if (!(e9 < t && t < n.ORDER))
                      throw Error("Point is not on curve");
                    let o = d(t);
                    try {
                      e = n.sqrt(o);
                    } catch (e) {
                      throw Error(
                        "Point is not on curve" +
                          (e instanceof Error ? ": " + e.message : ""),
                      );
                    }
                    return (
                      ((1 & r) == 1) != ((e & te) === te) && (e = n.neg(e)),
                      { x: t, y: e }
                    );
                  }
                  if (t === a && 4 === r)
                    return {
                      x: n.fromBytes(i.subarray(0, n.BYTES)),
                      y: n.fromBytes(i.subarray(n.BYTES, 2 * n.BYTES)),
                    };
                  throw Error(
                    `Point of length ${t} was invalid. Expected ${o} compressed bytes or ${a} uncompressed bytes`,
                  );
                },
              }),
              f = (e) => e4.bytesToHex(e4.numberToBytesBE(e, r.nByteLength)),
              h = (e, t, r) => e4.bytesToNumberBE(e.slice(t, r));
            class p {
              constructor(e, t, r) {
                ((this.r = e),
                  (this.s = t),
                  (this.recovery = r),
                  this.assertValidity());
              }
              static fromCompact(e) {
                let t = r.nByteLength;
                return new p(
                  h((e = eC("compactSignature", e, 2 * t)), 0, t),
                  h(e, t, 2 * t),
                );
              }
              static fromDER(e) {
                let { r: t, s: r } = e7.toSig(eC("DER", e));
                return new p(t, r);
              }
              assertValidity() {
                if (!c(this.r)) throw Error("r must be 0 < r < CURVE.n");
                if (!c(this.s)) throw Error("s must be 0 < s < CURVE.n");
              }
              addRecoveryBit(e) {
                return new p(this.r, this.s, e);
              }
              recoverPublicKey(e) {
                let { r: t, s: o, recovery: a } = this,
                  u = m(eC("msgHash", e));
                if (null == a || ![0, 1, 2, 3].includes(a))
                  throw Error("recovery id invalid");
                let d = 2 === a || 3 === a ? t + r.n : t;
                if (d >= n.ORDER) throw Error("recovery id 2 or 3 invalid");
                let c = (1 & a) == 0 ? "02" : "03",
                  h = l.fromHex(c + f(d)),
                  p = eZ(d, i),
                  g = s(-u * p),
                  b = s(o * p),
                  y = l.BASE.multiplyAndAddUnsafe(h, g, b);
                if (!y) throw Error("point at infinify");
                return (y.assertValidity(), y);
              }
              hasHighS() {
                return this.s > i >> te;
              }
              normalizeS() {
                return this.hasHighS()
                  ? new p(this.r, s(-this.s), this.recovery)
                  : this;
              }
              toDERRawBytes() {
                return e4.hexToBytes(this.toDERHex());
              }
              toDERHex() {
                return e7.hexFromSig({ r: this.r, s: this.s });
              }
              toCompactRawBytes() {
                return e4.hexToBytes(this.toCompactHex());
              }
              toCompactHex() {
                return f(this.r) + f(this.s);
              }
            }
            function g(e) {
              let t = e4.isBytes(e),
                r = "string" == typeof e,
                n = (t || r) && e.length;
              return t
                ? n === o || n === a
                : r
                  ? n === 2 * o || n === 2 * a
                  : e instanceof l;
            }
            let b =
                r.bits2int ||
                function (e) {
                  let t = e4.bytesToNumberBE(e),
                    n = 8 * e.length - r.nBitLength;
                  return n > 0 ? t >> BigInt(n) : t;
                },
              m =
                r.bits2int_modN ||
                function (e) {
                  return s(b(e));
                },
              y = e4.bitMask(r.nBitLength);
            function w(e) {
              if ("bigint" != typeof e) throw Error("bigint expected");
              if (!(e9 <= e && e < y))
                throw Error(`bigint expected < 2^${r.nBitLength}`);
              return e4.numberToBytesBE(e, r.nByteLength);
            }
            let v = { lowS: r.lowS, prehash: !1 },
              _ = { lowS: r.lowS, prehash: !1 };
            return (
              l.BASE._setWindowSize(8),
              {
                CURVE: r,
                getPublicKey: function (e, t = !0) {
                  return l.fromPrivateKey(e).toRawBytes(t);
                },
                getSharedSecret: function (e, t, r = !0) {
                  if (g(e)) throw Error("first arg must be private key");
                  if (!g(t)) throw Error("second arg must be public key");
                  return l.fromHex(t).multiply(u(e)).toRawBytes(r);
                },
                sign: function (e, t, o = v) {
                  let { seed: a, k2sig: d } = (function (e, t, o = v) {
                    if (["recovered", "canonical"].some((e) => e in o))
                      throw Error("sign() legacy options not supported");
                    let { hash: a, randomBytes: d } = r,
                      { lowS: f, prehash: h, extraEntropy: g } = o;
                    (null == f && (f = !0),
                      (e = eC("msgHash", e)),
                      h && (e = eC("prehashed msgHash", a(e))));
                    let y = m(e),
                      _ = u(t),
                      S = [w(_), w(y)];
                    if (null != g && !1 !== g) {
                      let e = !0 === g ? d(n.BYTES) : g;
                      S.push(eC("extraEntropy", e));
                    }
                    return {
                      seed: e4.concatBytes(...S),
                      k2sig: function (e) {
                        var t;
                        let r = b(e);
                        if (!c(r)) return;
                        let n = eZ(r, i),
                          o = l.BASE.multiply(r).toAffine(),
                          a = s(o.x);
                        if (a === e9) return;
                        let u = s(n * s(y + a * _));
                        if (u === e9) return;
                        let d = (2 * (o.x !== a)) | Number(o.y & te),
                          h = u;
                        return (
                          f &&
                            u > i >> te &&
                            ((h = (t = u) > i >> te ? s(-t) : t), (d ^= 1)),
                          new p(a, h, d)
                        );
                      },
                    };
                  })(e, t, o);
                  return e4.createHmacDrbg(
                    r.hash.outputLen,
                    r.nByteLength,
                    r.hmac,
                  )(a, d);
                },
                verify: function (e, t, n, o = _) {
                  let a, u;
                  if (
                    ((t = eC("msgHash", t)),
                    (n = eC("publicKey", n)),
                    "strict" in o)
                  )
                    throw Error("options.strict was renamed to lowS");
                  let { lowS: d, prehash: c } = o;
                  try {
                    if ("string" == typeof e || e4.isBytes(e))
                      try {
                        u = p.fromDER(e);
                      } catch (t) {
                        if (!(t instanceof e7.Err)) throw t;
                        u = p.fromCompact(e);
                      }
                    else if (
                      "object" == typeof e &&
                      "bigint" == typeof e.r &&
                      "bigint" == typeof e.s
                    ) {
                      let { r: t, s: r } = e;
                      u = new p(t, r);
                    } else throw Error("PARSE");
                    a = l.fromHex(n);
                  } catch (e) {
                    if ("PARSE" === e.message)
                      throw Error(
                        "signature must be Signature instance, Uint8Array or hex string",
                      );
                    return !1;
                  }
                  if (d && u.hasHighS()) return !1;
                  c && (t = r.hash(t));
                  let { r: f, s: h } = u,
                    g = m(t),
                    b = eZ(h, i),
                    y = s(g * b),
                    w = s(f * b),
                    v = l.BASE.multiplyAndAddUnsafe(a, y, w)?.toAffine();
                  return !!v && s(v.x) === f;
                },
                ProjectivePoint: l,
                Signature: p,
                utils: {
                  isValidPrivateKey(e) {
                    try {
                      return (u(e), !0);
                    } catch (e) {
                      return !1;
                    }
                  },
                  normPrivateKeyToScalar: u,
                  randomPrivateKey: () => {
                    let e = e1(r.n);
                    return (function (e, t, r = !1) {
                      let n = e.length,
                        i = e0(t),
                        o = e1(t);
                      if (n < 16 || n < o || n > 1024)
                        throw Error(
                          `expected ${o}-1024 bytes of input, got ${n}`,
                        );
                      let a = eG(r ? eB(e) : eI(e), t - eW) + eW;
                      return r ? eT(a, i) : eR(a, i);
                    })(r.randomBytes(e), r.n);
                  },
                  precompute: (e = 8, t = l.BASE) => (
                    t._setWindowSize(e),
                    t.multiply(BigInt(3)),
                    t
                  ),
                },
              }
            );
          })({
            ...o,
            hash: e,
            hmac: (t, ...r) =>
              ey(
                e,
                t,
                (function (...e) {
                  let t = 0;
                  for (let r = 0; r < e.length; r++) {
                    let n = e[r];
                    (Z(n), (t += n.length));
                  }
                  let r = new Uint8Array(t);
                  for (let t = 0, n = 0; t < e.length; t++) {
                    let i = e[t];
                    (r.set(i, n), (n += i.length));
                  }
                  return r;
                })(...r),
              ),
            randomBytes: el,
          }))(eb),
        create: r,
      })),
    tc = BigInt(0);
  td.ProjectivePoint;
  let tf =
      ((n = [
        [
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
          "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
          "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c",
        ],
        [
          "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
          "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ],
        [
          "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
          "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
          "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
          "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84",
        ],
        [
          "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
          "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
          "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ],
      ]
        .map((e) => e.map((e) => BigInt(e)))
        .map((e) => Array.from(e).reverse())),
      (e, t) => {
        let [r, i, o, a] = n.map((t) =>
          t.reduce((t, r) => tu.add(tu.mul(t, e), r)),
        );
        return (
          (e = tu.div(r, i)),
          (t = tu.mul(t, tu.div(o, a))),
          { x: e, y: t }
        );
      }),
    th = (function (e, t) {
      if ((eQ(e), !e.isValid(t.A) || !e.isValid(t.B) || !e.isValid(t.Z)))
        throw Error("mapToCurveSimpleSWU: invalid opts");
      let r = (function (e, t) {
        let r = e.ORDER,
          n = e9;
        for (let e = r - te; e % tt === e9; e /= tt) n += te;
        let i = n,
          o = tt << (i - te - te),
          a = o * tt,
          s = (r - te) / a,
          l = (s - te) / tt,
          u = a - te,
          d = e.pow(t, s),
          c = e.pow(t, (s + te) / tt),
          f = (t, r) => {
            let n = d,
              a = e.pow(r, u),
              s = e.sqr(a);
            s = e.mul(s, r);
            let f = e.mul(t, s);
            ((f = e.pow(f, l)),
              (f = e.mul(f, a)),
              (a = e.mul(f, r)),
              (s = e.mul(f, t)));
            let h = e.mul(s, a);
            f = e.pow(h, o);
            let p = e.eql(f, e.ONE);
            ((a = e.mul(s, c)),
              (f = e.mul(h, n)),
              (s = e.cmov(a, s, p)),
              (h = e.cmov(f, h, p)));
            for (let t = i; t > te; t--) {
              let r = t - tt;
              r = tt << (r - te);
              let i = e.pow(h, r),
                o = e.eql(i, e.ONE);
              ((a = e.mul(s, n)),
                (n = e.mul(n, n)),
                (i = e.mul(h, n)),
                (s = e.cmov(a, s, o)),
                (h = e.cmov(i, h, o)));
            }
            return { isValid: p, value: s };
          };
        if (e.ORDER % tn === tr) {
          let r = (e.ORDER - tr) / tn,
            n = e.sqrt(e.neg(t));
          f = (t, i) => {
            let o = e.sqr(i),
              a = e.mul(t, i);
            o = e.mul(o, a);
            let s = e.pow(o, r);
            s = e.mul(s, a);
            let l = e.mul(s, n),
              u = e.mul(e.sqr(s), i),
              d = e.eql(u, t),
              c = e.cmov(l, s, d);
            return { isValid: d, value: c };
          };
        }
        return f;
      })(e, t.Z);
      if (!e.isOdd) throw Error("Fp.isOdd is not implemented!");
      return (n) => {
        let i, o, a, s, l, u, d, c;
        ((i = e.sqr(n)),
          (i = e.mul(i, t.Z)),
          (o = e.sqr(i)),
          (o = e.add(o, i)),
          (a = e.add(o, e.ONE)),
          (a = e.mul(a, t.B)),
          (s = e.cmov(t.Z, e.neg(o), !e.eql(o, e.ZERO))),
          (s = e.mul(s, t.A)),
          (o = e.sqr(a)),
          (u = e.sqr(s)),
          (l = e.mul(u, t.A)),
          (o = e.add(o, l)),
          (o = e.mul(o, a)),
          (u = e.mul(u, s)),
          (l = e.mul(u, t.B)),
          (o = e.add(o, l)),
          (d = e.mul(i, a)));
        let { isValid: f, value: h } = r(o, u);
        ((c = e.mul(i, n)),
          (c = e.mul(c, h)),
          (d = e.cmov(d, a, f)),
          (c = e.cmov(c, h, f)));
        let p = e.isOdd(n) === e.isOdd(c);
        return ((c = e.cmov(e.neg(c), c, p)), { x: (d = e.div(d, s)), y: c });
      };
    })(tu, {
      A: BigInt(
        "0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533",
      ),
      B: BigInt("1771"),
      Z: tu.create(BigInt("-11")),
    });
  function tp(e) {
    return (t) => (Z(t), e(t));
  }
  (!(function (e, t, r) {
    if ("function" != typeof t) throw Error("mapToCurve() must be defined");
  })(
    td.ProjectivePoint,
    (e) => {
      let { x: t, y: r } = th(tu.create(e[0]));
      return tf(t, r);
    },
    tu.ORDER,
  ),
    BigInt(0));
  let tg = {},
    tb = {};
  for (let e = 0; e < 16; e++) {
    let t = e,
      r = 16 * e,
      n = e.toString(16).toLowerCase();
    ((tb[n] = t),
      (tb[n.toUpperCase()] = t),
      (tg[n] = r),
      (tg[n.toUpperCase()] = r));
  }
  Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
  let tm = [];
  for (let e = 0; e <= 65535; e++) tm[e] = BigInt(e);
  let ty = (e) => {
      if ("string" != typeof e)
        throw Error(`hex argument type ${typeof e} must be of type string`);
      if (!/^0x[0-9a-fA-F]*$/.test(e))
        throw Error(`Input must be a 0x-prefixed hexadecimal string, got ${e}`);
      let t = e.slice(2);
      return (function (e) {
        let t = e.length,
          r = new Uint8Array(t / 2);
        for (let n = 0; n < t; n += 2) r[n / 2] = tg[e[n]] + tb[e[n + 1]];
        return r;
      })(
        t.length % 2 == 0
          ? t
          : (function (e) {
              let t = e;
              if ("string" != typeof t)
                throw Error(
                  `[padToEven] value must be type 'string', received ${typeof t}`,
                );
              return (t.length % 2 && (t = `0${t}`), t);
            })(t),
      );
    },
    tw = (e) =>
      ty(
        ((e) => {
          if (!Number.isSafeInteger(e) || e < 0)
            throw Error(`Received an invalid integer type: ${e}`);
          return `0x${e.toString(16)}`;
        })(e),
      );
  (BigInt("0xffffffffffffffff"),
    BigInt(
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    ),
    BigInt(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    ),
    td.CURVE.n,
    td.CURVE.n,
    BigInt(2),
    BigInt(
      "0x10000000000000000000000000000000000000000000000000000000000000000",
    ),
    ty("0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"),
    ty("0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"),
    ty("0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"),
    Uint8Array.from([128]),
    BigInt(-1),
    BigInt(0),
    BigInt(1),
    BigInt(2),
    BigInt(3),
    BigInt(7),
    BigInt(8),
    BigInt(27),
    BigInt(28),
    BigInt(31),
    BigInt(32),
    BigInt(64),
    BigInt(128),
    BigInt(255),
    BigInt(256),
    BigInt(96),
    BigInt(100),
    BigInt(160),
    BigInt(224),
    BigInt(7922816251426434e13),
    BigInt(1461501637330903e33),
    BigInt(2695994666715064e52),
    BigInt(1e9));
  Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
  let tv = BigInt(0xffffffff),
    t_ = BigInt(32),
    tS = [],
    tE = [],
    tA = [],
    tx = BigInt(0),
    tM = BigInt(1),
    tk = BigInt(2),
    tP = BigInt(7),
    tO = BigInt(256),
    tB = BigInt(113);
  for (let e = 0, t = tM, r = 1, n = 0; e < 24; e++) {
    (([r, n] = [n, (2 * r + 3 * n) % 5]),
      tS.push(2 * (5 * n + r)),
      tE.push((((e + 1) * (e + 2)) / 2) % 64));
    let i = tx;
    for (let e = 0; e < 7; e++)
      (t = ((t << tM) ^ ((t >> tP) * tB)) % tO) & tk &&
        (i ^= tM << ((tM << BigInt(e)) - tM));
    tA.push(i);
  }
  let [tI, tR] = (function (e, t = !1) {
      let r = new Uint32Array(e.length),
        n = new Uint32Array(e.length);
      for (let i = 0; i < e.length; i++) {
        let { h: o, l: a } = (function (e, t = !1) {
          return t
            ? { h: Number(e & tv), l: Number((e >> t_) & tv) }
            : { h: 0 | Number((e >> t_) & tv), l: 0 | Number(e & tv) };
        })(e[i], t);
        [r[i], n[i]] = [o, a];
      }
      return [r, n];
    })(tA, !0),
    tT = (e, t, r) =>
      r > 32 ? (t << (r - 32)) | (e >>> (64 - r)) : (e << r) | (t >>> (32 - r)),
    tC = (e, t, r) =>
      r > 32 ? (e << (r - 32)) | (t >>> (64 - r)) : (t << r) | (e >>> (32 - r));
  class tj extends ea {
    constructor(e, t, r, n = !1, i = 24) {
      let o;
      if (
        (super(),
        (this.blockLen = e),
        (this.suffix = t),
        (this.outputLen = r),
        (this.enableXOF = n),
        (this.rounds = i),
        (this.pos = 0),
        (this.posOut = 0),
        (this.finished = !1),
        (this.destroyed = !1),
        J(r),
        0 >= this.blockLen || this.blockLen >= 200)
      )
        throw Error("Sha3 supports only keccak-f1600 function");
      ((this.state = new Uint8Array(200)),
        (this.state32 = new Uint32Array(
          (o = this.state).buffer,
          o.byteOffset,
          Math.floor(o.byteLength / 4),
        )));
    }
    keccak() {
      (er || ei(this.state32),
        (function (e, t = 24) {
          let r = new Uint32Array(10);
          for (let n = 24 - t; n < 24; n++) {
            for (let t = 0; t < 10; t++)
              r[t] = e[t] ^ e[t + 10] ^ e[t + 20] ^ e[t + 30] ^ e[t + 40];
            for (let t = 0; t < 10; t += 2) {
              let n = (t + 8) % 10,
                i = (t + 2) % 10,
                o = r[i],
                a = r[i + 1],
                s = tT(o, a, 1) ^ r[n],
                l = tC(o, a, 1) ^ r[n + 1];
              for (let r = 0; r < 50; r += 10)
                ((e[t + r] ^= s), (e[t + r + 1] ^= l));
            }
            let t = e[2],
              i = e[3];
            for (let r = 0; r < 24; r++) {
              let n = tE[r],
                o = tT(t, i, n),
                a = tC(t, i, n),
                s = tS[r];
              ((t = e[s]), (i = e[s + 1]), (e[s] = o), (e[s + 1] = a));
            }
            for (let t = 0; t < 50; t += 10) {
              for (let n = 0; n < 10; n++) r[n] = e[t + n];
              for (let n = 0; n < 10; n++)
                e[t + n] ^= ~r[(n + 2) % 10] & r[(n + 4) % 10];
            }
            ((e[0] ^= tI[n]), (e[1] ^= tR[n]));
          }
          r.fill(0);
        })(this.state32, this.rounds),
        er || ei(this.state32),
        (this.posOut = 0),
        (this.pos = 0));
    }
    update(e) {
      Y(this);
      let { blockLen: t, state: r } = this,
        n = (e = eo(e)).length;
      for (let i = 0; i < n; ) {
        let o = Math.min(t - this.pos, n - i);
        for (let t = 0; t < o; t++) r[this.pos++] ^= e[i++];
        this.pos === t && this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished) return;
      this.finished = !0;
      let { state: e, suffix: t, pos: r, blockLen: n } = this;
      ((e[r] ^= t),
        (128 & t) != 0 && r === n - 1 && this.keccak(),
        (e[n - 1] ^= 128),
        this.keccak());
    }
    writeInto(e) {
      (Y(this, !1), Z(e), this.finish());
      let t = this.state,
        { blockLen: r } = this;
      for (let n = 0, i = e.length; n < i; ) {
        this.posOut >= r && this.keccak();
        let o = Math.min(r - this.posOut, i - n);
        (e.set(t.subarray(this.posOut, this.posOut + o), n),
          (this.posOut += o),
          (n += o));
      }
      return e;
    }
    xofInto(e) {
      if (!this.enableXOF) throw Error("XOF is not possible for this instance");
      return this.writeInto(e);
    }
    xof(e) {
      return (J(e), this.xofInto(new Uint8Array(e)));
    }
    digestInto(e) {
      if ((Q(e, this), this.finished))
        throw Error("digest() was already called");
      return (this.writeInto(e), this.destroy(), e);
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      ((this.destroyed = !0), this.state.fill(0));
    }
    _cloneInto(e) {
      let {
        blockLen: t,
        suffix: r,
        outputLen: n,
        rounds: i,
        enableXOF: o,
      } = this;
      return (
        e || (e = new tj(t, r, n, o, i)),
        e.state32.set(this.state32),
        (e.pos = this.pos),
        (e.posOut = this.posOut),
        (e.finished = this.finished),
        (e.rounds = i),
        (e.suffix = r),
        (e.outputLen = n),
        (e.enableXOF = o),
        (e.destroyed = this.destroyed),
        e
      );
    }
  }
  let tN = (e, t, r) => es(() => new tj(t, e, r)),
    tL = tN(1, 144, 28),
    tF = tN(1, 136, 32),
    tq = tN(1, 104, 48),
    tD = tN(1, 72, 64);
  tp(tL);
  let tU = (((i = tp(tF)).create = tF.create), i);
  (tp(tq),
    tp(tD),
    new Uint8Array(0),
    ((a = f || (f = {})).String = "string"),
    (a.Bytes = "view"),
    (a.Number = "number"),
    ((s = h || (h = {})).String = "string"),
    (s.Bytes = "view"),
    (s.JSON = "json"),
    ((l = p || (p = {}))[(l.Number = 0)] = "Number"),
    (l[(l.BigInt = 1)] = "BigInt"),
    (l[(l.Uint8Array = 2)] = "Uint8Array"),
    (l[(l.PrefixedHexString = 3)] = "PrefixedHexString"));
  (x.EventEmitter,
    tp(eb),
    ((u = g || (g = {}))[(u.Deposit = 0)] = "Deposit"),
    (u[(u.Withdrawal = 1)] = "Withdrawal"),
    (u[(u.Consolidation = 2)] = "Consolidation"),
    ((d = b || (b = {}))[(d.Version = 0)] = "Version"),
    (d[(d.Balance = 1)] = "Balance"),
    (d[(d.Nonce = 2)] = "Nonce"),
    (d[(d.CodeHash = 3)] = "CodeHash"),
    (d[(d.CodeSize = 4)] = "CodeSize"),
    tw(b.Version),
    tw(b.Balance),
    tw(b.Nonce),
    tw(b.CodeHash),
    tw(b.CodeSize),
    BigInt(256),
    BigInt(31));
  var tW = e.i(335249);
  let t$ = {
      MAINNET: "mainnet",
      TESTNET: "testnet",
      CYAN: "cyan",
      AQUA: "aqua",
      CELESTE: "celeste",
    },
    tz = {
      SAPPHIRE_DEVNET: "sapphire_devnet",
      SAPPHIRE_MAINNET: "sapphire_mainnet",
    };
  function tH(e) {
    let t,
      r = !1,
      n = 0;
    try {
      ((t = window[e]), (r = !0), (n = t.length));
      let i = "__storage_test__";
      return (t.setItem(i, i), t.removeItem(i), !0);
    } catch (e) {
      return (
        e &&
        (22 === e.code ||
          1014 === e.code ||
          "QuotaExceededError" === e.name ||
          "NS_ERROR_DOM_QUOTA_REACHED" === e.name) &&
        r &&
        0 !== n
      );
    }
  }
  (t$.MAINNET,
    t$.TESTNET,
    t$.CYAN,
    t$.AQUA,
    t$.CELESTE,
    t$.AQUA,
    tz.SAPPHIRE_MAINNET,
    t$.CELESTE,
    tz.SAPPHIRE_MAINNET,
    t$.CYAN,
    tz.SAPPHIRE_MAINNET,
    t$.MAINNET,
    tz.SAPPHIRE_MAINNET,
    t$.TESTNET,
    tz.SAPPHIRE_DEVNET,
    t$.MAINNET,
    t$.TESTNET,
    t$.CYAN,
    t$.AQUA,
    t$.CELESTE,
    tz.SAPPHIRE_MAINNET,
    tz.SAPPHIRE_DEVNET,
    t$.MAINNET,
    t$.TESTNET,
    t$.CYAN,
    t$.AQUA,
    t$.CELESTE,
    t$.MAINNET,
    t$.TESTNET,
    t$.CYAN,
    t$.AQUA,
    t$.CELESTE,
    e.i(889878),
    tW.default);
  class tV {
    constructor() {
      w(this, "store", new Map());
    }
    getItem(e) {
      return this.store.get(e) || null;
    }
    setItem(e, t) {
      this.store.set(e, t);
    }
    removeItem(e) {
      this.store.delete(e);
    }
  }
  (w(
    class {
      constructor(e, t) {
        (w(this, "storage", void 0),
          w(this, "_storeKey", void 0),
          (this.storage = t),
          (this._storeKey = e));
        try {
          t.getItem(e) || this.resetStore();
        } catch (e) {}
      }
      static getInstance(e) {
        let t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "local";
        if (!this.instanceMap.has(e)) {
          let r;
          ((r =
            "local" === t && tH("localStorage")
              ? window.localStorage
              : "session" === t && tH("sessionStorage")
                ? window.sessionStorage
                : new tV()),
            this.instanceMap.set(e, new this(e, r)));
        }
        return this.instanceMap.get(e);
      }
      toJSON() {
        return this.storage.getItem(this._storeKey);
      }
      resetStore() {
        let e = this.getStore();
        return (this.storage.removeItem(this._storeKey), e);
      }
      getStore() {
        return JSON.parse(this.storage.getItem(this._storeKey) || "{}");
      }
      get(e) {
        return JSON.parse(this.storage.getItem(this._storeKey) || "{}")[e];
      }
      set(e, t) {
        let r = JSON.parse(this.storage.getItem(this._storeKey) || "{}");
        ((r[e] = t), this.storage.setItem(this._storeKey, JSON.stringify(r)));
      }
    },
    "instanceMap",
    new Map(),
  ),
    _(_({}, tz), t$),
    e.i(703405));
  class tK {
    ttl;
    map = new Map();
    _to = !1;
    constructor(e) {
      this.ttl = e;
    }
    has(e) {
      return this.map.has(e);
    }
    add(e) {
      (this.map.set(e, tG()),
        this._to ||
          ((this._to = !0),
          setTimeout(() => {
            ((this._to = !1),
              (function (e) {
                let t = tG() - e.ttl,
                  r = e.map[Symbol.iterator]();
                for (;;) {
                  let n = r.next().value;
                  if (!n) return;
                  let i = n[0];
                  if (!(n[1] < t)) return;
                  e.map.delete(i);
                }
              })(this));
          }, 0)));
    }
    clear() {
      this.map.clear();
    }
  }
  function tG() {
    return Date.now();
  }
  var tJ = e.i(429914),
    tZ = e.i(489442),
    tY = e.i(895886);
  let tQ = new tY.ec("secp256k1"),
    tX = e.g.crypto || e.g.msCrypto || {},
    t0 = tX.subtle || tX.webkitSubtle,
    t1 = m.Buffer.from(
      "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
      "hex",
    ),
    t2 = m.Buffer.alloc(32, 0);
  function t5(e, t) {
    if (!e) throw Error(t || "Assertion failed");
  }
  function t3(e) {
    return (
      !!m.Buffer.isBuffer(e) &&
      32 === e.length &&
      e.compare(t2) > 0 &&
      0 > e.compare(t1)
    );
  }
  function t4(e) {
    let t = new Uint8Array(e);
    return void 0 === tX.getRandomValues
      ? m.Buffer.from(tZ.default.randomBytes(e))
      : (tX.getRandomValues(t), m.Buffer.from(t));
  }
  async function t6(e) {
    return new Uint8Array(
      t0
        ? await t0.digest("SHA-512", e)
        : tZ.default.createHash("sha512").update(e).digest(),
    );
  }
  function t8(e) {
    return async function (t, r, n) {
      if (t0) {
        let i = await t0.importKey("raw", r, { name: "AES-CBC" }, !1, [e]),
          o = await t0[e]({ name: "AES-CBC", iv: t }, i, n);
        return m.Buffer.from(new Uint8Array(o));
      }
      if ("encrypt" === e) {
        let e = tZ.default.createCipheriv("aes-256-cbc", r, t),
          i = e.update(n),
          o = e.final();
        return m.Buffer.concat([i, o]);
      }
      if ("decrypt" === e) {
        let e = tZ.default.createDecipheriv("aes-256-cbc", r, t),
          i = e.update(n),
          o = e.final();
        return m.Buffer.concat([i, o]);
      }
      throw Error(`Unsupported operation: ${e}`);
    };
  }
  let t7 = t8("encrypt"),
    t9 = t8("decrypt");
  async function re(e, t) {
    if (t0) {
      let r = await t0.importKey(
          "raw",
          new Uint8Array(e),
          { name: "HMAC", hash: { name: "SHA-256" } },
          !1,
          ["sign", "verify"],
        ),
        n = await t0.sign("HMAC", r, t);
      return m.Buffer.from(new Uint8Array(n));
    }
    let r = tZ.default.createHmac("sha256", m.Buffer.from(e));
    return (r.update(t), r.digest());
  }
  async function rt(e, t, r) {
    var n = await re(e, t);
    if (n.length !== r.length) return !1;
    let i = 0;
    for (let e = 0; e < n.length; e++) i |= n[e] ^ r[e];
    return 0 === i;
  }
  let rr = function (e) {
      return (
        t5(32 === e.length, "Bad private key"),
        t5(t3(e), "Bad private key"),
        m.Buffer.from(tQ.keyFromPrivate(e).getPublic("array"))
      );
    },
    rn = async function (e, t) {
      return (
        t5(32 === e.length, "Bad private key"),
        t5(t3(e), "Bad private key"),
        t5(t.length > 0, "Message should not be empty"),
        t5(t.length <= 32, "Message is too long"),
        m.Buffer.from(tQ.sign(t, e, { canonical: !0 }).toDER())
      );
    },
    ri = async function (e, t) {
      (t5(m.Buffer.isBuffer(e), "Bad private key"),
        t5(m.Buffer.isBuffer(t), "Bad public key"),
        t5(32 === e.length, "Bad private key"),
        t5(t3(e), "Bad private key"),
        t5(65 === t.length || 33 === t.length, "Bad public key"),
        65 === t.length && t5(4 === t[0], "Bad public key"),
        33 === t.length && t5(2 === t[0] || 3 === t[0], "Bad public key"));
      let r = tQ.keyFromPrivate(e),
        n = tQ.keyFromPublic(t),
        i = r.derive(n.getPublic());
      return m.Buffer.from(i.toArray());
    },
    ro = async function (e, t) {
      (t5(m.Buffer.isBuffer(e), "Bad private key"),
        t5(m.Buffer.isBuffer(t), "Bad public key"),
        t5(32 === e.length, "Bad private key"),
        t5(t3(e), "Bad private key"),
        t5(65 === t.length || 33 === t.length, "Bad public key"),
        65 === t.length && t5(4 === t[0], "Bad public key"),
        33 === t.length && t5(2 === t[0] || 3 === t[0], "Bad public key"));
      let r = tQ.keyFromPrivate(e),
        n = tQ.keyFromPublic(t),
        i = r.derive(n.getPublic());
      return m.Buffer.from(i.toString(16, 64), "hex");
    },
    ra = async function (e, t, r) {
      let n = (r = r || {}).ephemPrivateKey || t4(32);
      for (; !t3(n); ) n = r.ephemPrivateKey || t4(32);
      let i = rr(n),
        o = await ri(n, e),
        a = await t6(o),
        s = r.iv || t4(16),
        l = a.slice(0, 32),
        u = a.slice(32),
        d = await t7(s, m.Buffer.from(l), t),
        c = m.Buffer.concat([s, i, d]);
      return {
        iv: s,
        ephemPublicKey: i,
        ciphertext: d,
        mac: await re(m.Buffer.from(u), c),
      };
    },
    rs = async function (e, t, r) {
      let n = null != r && r,
        i = await (n ? ro : ri)(e, t.ephemPublicKey),
        o = await t6(i),
        a = o.slice(0, 32),
        s = o.slice(32),
        l = m.Buffer.concat([t.iv, t.ephemPublicKey, t.ciphertext]),
        u = await rt(m.Buffer.from(s), l, t.mac);
      if (!u && !1 === n) return rs(e, t, !0);
      if (!u && !0 === n) throw Error("bad MAC after trying padded");
      let d = await t9(t.iv, m.Buffer.from(a), t.ciphertext);
      return m.Buffer.from(new Uint8Array(d));
    };
  function rl(e) {
    return m.Buffer.from(tU(e));
  }
  e.i(745876);
  let ru = new tY.ec("secp256k1");
  async function rd(e, t) {
    var r;
    let n = JSON.stringify(t),
      i = m.Buffer.from(n, "utf-8");
    return JSON.stringify(
      ((r = await ra(rr(m.Buffer.from(e, "hex")), i)),
      {
        iv: m.Buffer.from(r.iv).toString("hex"),
        ephemPublicKey: m.Buffer.from(r.ephemPublicKey).toString("hex"),
        ciphertext: m.Buffer.from(r.ciphertext).toString("hex"),
        mac: m.Buffer.from(r.mac).toString("hex"),
      }),
    );
  }
  async function rc(e, t) {
    var r;
    let n =
        ((r = JSON.parse(t)),
        {
          iv: m.Buffer.from(r.iv, "hex"),
          ephemPublicKey: m.Buffer.from(r.ephemPublicKey, "hex"),
          ciphertext: m.Buffer.from(r.ciphertext, "hex"),
          mac: m.Buffer.from(r.mac, "hex"),
        }),
      i = ru.keyFromPrivate(e);
    return JSON.parse(
      (
        await rs(m.Buffer.from(i.getPrivate().toString("hex", 64), "hex"), n)
      ).toString("utf-8"),
    );
  }
  (Promise.resolve(!1), Promise.resolve(!0));
  let rf = Promise.resolve();
  function rh(e, t) {
    return (e || (e = 0), new Promise((r) => setTimeout(() => r(t), e)));
  }
  function rp() {
    return Math.random().toString(36).substring(2);
  }
  let rg = 0;
  function rb() {
    let e = 1e3 * Date.now();
    return (e <= rg && (e = rg + 1), (rg = e), e);
  }
  let rm = G.default.getLogger("broadcast-channel");
  function ry() {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      t = JSON.parse(JSON.stringify(e));
    return (
      void 0 === t.webWorkerSupport && (t.webWorkerSupport = !0),
      t.idb || (t.idb = {}),
      t.idb.ttl || (t.idb.ttl = 45e3),
      t.idb.fallbackInterval || (t.idb.fallbackInterval = 150),
      e.idb &&
        "function" == typeof e.idb.onclose &&
        (t.idb.onclose = e.idb.onclose),
      t.localstorage || (t.localstorage = {}),
      t.localstorage.removeTimeout || (t.localstorage.removeTimeout = 6e4),
      t.server || (t.server = {}),
      t.server.url || (t.server.url = "https://session.web3auth.io"),
      t.server.removeTimeout || (t.server.removeTimeout = 3e5),
      e.methods && (t.methods = e.methods),
      t
    );
  }
  rm.setLevel("error");
  let rw = "messages",
    rv = { durability: "relaxed" };
  function r_() {
    if ("u" > typeof indexedDB) return indexedDB;
    if ("u" > typeof window) {
      if (void 0 !== window.mozIndexedDB) return window.mozIndexedDB;
      if (void 0 !== window.webkitIndexedDB) return window.webkitIndexedDB;
      if (void 0 !== window.msIndexedDB) return window.msIndexedDB;
    }
    return !1;
  }
  function rS(e) {
    e.commit && e.commit();
  }
  function rE(e) {
    let t = r_().open("pubkey.broadcast-channel-0-" + e);
    return (
      (t.onupgradeneeded = (e) => {
        e.target.result.createObjectStore(rw, {
          keyPath: "id",
          autoIncrement: !0,
        });
      }),
      new Promise((e, r) => {
        ((t.onerror = (e) => r(e)),
          (t.onsuccess = () => {
            e(t.result);
          }));
      })
    );
  }
  function rA(e, t, r) {
    let n = { uuid: t, time: Date.now(), data: r },
      i = e.transaction([rw], "readwrite", rv);
    return new Promise((e, t) => {
      ((i.oncomplete = () => e()),
        (i.onerror = (e) => t(e)),
        i.objectStore(rw).add(n),
        rS(i));
    });
  }
  function rx(e, t) {
    let r = e.transaction(rw, "readonly", rv),
      n = r.objectStore(rw),
      i = [],
      o = IDBKeyRange.bound(t + 1, 1 / 0);
    if (n.getAll) {
      let e = n.getAll(o);
      return new Promise((t, r) => {
        ((e.onerror = (e) => r(e)),
          (e.onsuccess = function (e) {
            t(e.target.result);
          }));
      });
    }
    return new Promise((e, a) => {
      let s = (function () {
        try {
          return ((o = IDBKeyRange.bound(t + 1, 1 / 0)), n.openCursor(o));
        } catch (e) {
          return n.openCursor();
        }
      })();
      ((s.onerror = (e) => a(e)),
        (s.onsuccess = (n) => {
          let o = n.target.result;
          o
            ? o.value.id < t + 1
              ? o.continue(t + 1)
              : (i.push(o.value), o.continue())
            : (rS(r), e(i));
        }));
    });
  }
  function rM(e, t) {
    let r = Date.now() - t,
      n = e.transaction(rw, "readonly", rv),
      i = n.objectStore(rw),
      o = [];
    return new Promise((e) => {
      i.openCursor().onsuccess = (t) => {
        let i = t.target.result;
        if (i) {
          let t = i.value;
          if (t.time < r) (o.push(t), i.continue());
          else {
            (rS(n), e(o));
            return;
          }
        } else e(o);
      };
    });
  }
  function rk(e, t) {
    return rM(e, t).then((t) => {
      var r;
      let n;
      return (
        (r = t.map((e) => e.id)),
        (n = e.transaction([rw], "readwrite", rv).objectStore(rw)),
        Promise.all(
          r.map((e) => {
            let t = n.delete(e);
            return new Promise((e) => {
              t.onsuccess = () => e();
            });
          }),
        )
      );
    });
  }
  function rP(e) {
    return e.closed || !e.messagesCallback
      ? rf
      : rx(e.db, e.lastCursorId).then(
          (t) => (
            t
              .filter((e) => !!e)
              .map((t) => (t.id > e.lastCursorId && (e.lastCursorId = t.id), t))
              .filter(
                (t) =>
                  !(t.uuid === e.uuid || e.eMIs.has(t.id)) &&
                  !(t.data.time < e.messagesCallbackTime),
              )
              .sort((e, t) => e.time - t.time)
              .forEach((t) => {
                e.messagesCallback &&
                  (e.eMIs.add(t.id), e.messagesCallback(t.data));
              }),
            rf
          ),
        );
  }
  function rO() {
    let e;
    if ("u" < typeof window) return null;
    try {
      ((e = window.localStorage),
        (e = window["ie8-eventlistener/storage"] || window.localStorage));
    } catch (e) {}
    return e;
  }
  function rB(e) {
    return "pubkey.broadcastChannel-" + e;
  }
  function rI(e, t) {
    let r = rB(e),
      n = (e) => {
        e.key === r && t(JSON.parse(e.newValue));
      };
    return (window.addEventListener("storage", n), n);
  }
  function rR(e) {
    window.removeEventListener("storage", e);
  }
  function rT() {
    let e = rO();
    if (!e) return !1;
    try {
      let t = "__broadcastchannel_check";
      (e.setItem(t, "works"), e.removeItem(t));
    } catch (e) {
      return !1;
    }
    return !0;
  }
  let rC = null,
    rj = new Set();
  function rN(e) {
    return "pubkey.broadcastChannel-" + e;
  }
  let rL = new Set();
  var rF = {
    create: function (e) {
      let t = { time: rb(), name: e, messagesCallback: null };
      return (rL.add(t), t);
    },
    close: function (e) {
      rL.delete(e);
    },
    onMessage: function (e, t) {
      e.messagesCallback = t;
    },
    postMessage: function (e, t) {
      return new Promise((r) =>
        setTimeout(() => {
          (Array.from(rL).forEach((r) => {
            r.name === e.name &&
              r !== e &&
              r.messagesCallback &&
              r.time < t.time &&
              r.messagesCallback(t);
          }),
            r());
        }, 5),
      );
    },
    canBeUsed: function () {
      return !0;
    },
    type: "simulate",
    averageResponseTime: function () {
      return 5;
    },
    microSeconds: rb,
  };
  let rq = [
      {
        create: function (e) {
          let t = {
            time: rb(),
            messagesCallback: null,
            bc: new BroadcastChannel(e),
            subFns: [],
          };
          return (
            (t.bc.onmessage = (e) => {
              t.messagesCallback && t.messagesCallback(e.data);
            }),
            t
          );
        },
        close: function (e) {
          (e.bc.close(), (e.subFns = []));
        },
        onMessage: function (e, t) {
          e.messagesCallback = t;
        },
        postMessage: function (e, t) {
          try {
            return (e.bc.postMessage(t, !1), rf);
          } catch (e) {
            return Promise.reject(e);
          }
        },
        canBeUsed: function () {
          if ("u" < typeof window || "function" != typeof BroadcastChannel)
            return !1;
          if (BroadcastChannel._pubkey)
            throw Error(
              "BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill",
            );
          return !0;
        },
        type: "native",
        averageResponseTime: function () {
          return 150;
        },
        microSeconds: rb,
      },
      {
        getIdb: r_,
        createDatabase: rE,
        create: function (e, t) {
          return (
            (t = ry(t)),
            rE(e).then((r) => {
              let n = {
                closed: !1,
                lastCursorId: 0,
                channelName: e,
                options: t,
                uuid: rp(),
                eMIs: new tK(2 * t.idb.ttl),
                writeBlockPromise: rf,
                messagesCallback: null,
                readQueuePromises: [],
                db: r,
                time: rb(),
              };
              return (
                (r.onclose = function () {
                  ((n.closed = !0), t.idb.onclose && t.idb.onclose());
                }),
                (function e(t) {
                  t.closed ||
                    rP(t)
                      .then(() => rh(t.options.idb.fallbackInterval))
                      .then(() => e(t));
                })(n),
                n
              );
            })
          );
        },
        close: function (e) {
          ((e.closed = !0), e.db.close());
        },
        onMessage: function (e, t, r) {
          ((e.messagesCallbackTime = r), (e.messagesCallback = t), rP(e));
        },
        postMessage: function (e, t) {
          return (
            (e.writeBlockPromise = e.writeBlockPromise
              .then(() => rA(e.db, e.uuid, t))
              .then(() => {
                0 === Math.floor(11 * Math.random() + 0) &&
                  rk(e.db, e.options.idb.ttl);
              })),
            e.writeBlockPromise
          );
        },
        canBeUsed: function () {
          return !!r_();
        },
        type: "idb",
        averageResponseTime: function (e) {
          return 2 * e.idb.fallbackInterval;
        },
        microSeconds: rb,
        writeMessage: rA,
        getAllMessages: function (e) {
          let t = e.transaction(rw, "readonly", rv),
            r = t.objectStore(rw),
            n = [];
          return new Promise((e) => {
            r.openCursor().onsuccess = (r) => {
              let i = r.target.result;
              i ? (n.push(i.value), i.continue()) : (rS(t), e(n));
            };
          });
        },
        cleanOldMessages: rk,
        getMessagesHigherThan: rx,
        getOldMessages: rM,
      },
      {
        getLocalStorage: rO,
        create: function (e, t) {
          if (((t = ry(t)), !rT()))
            throw Error("BroadcastChannel: localstorage cannot be used");
          let r = rp(),
            n = new tK(t.localstorage.removeTimeout),
            i = { channelName: e, uuid: r, time: rb(), eMIs: n };
          return (
            (i.listener = rI(e, (e) => {
              !i.messagesCallback ||
                e.uuid === r ||
                !e.token ||
                n.has(e.token) ||
                (e.data.time && e.data.time < i.messagesCallbackTime) ||
                (n.add(e.token), i.messagesCallback(e.data));
            })),
            i
          );
        },
        close: function (e) {
          rR(e.listener);
        },
        onMessage: function (e, t, r) {
          ((e.messagesCallbackTime = r), (e.messagesCallback = t));
        },
        postMessage: function (e, t) {
          return new Promise((r) => {
            rh().then(() => {
              let n = rB(e.channelName),
                i = JSON.stringify({
                  token: rp(),
                  time: Date.now(),
                  data: t,
                  uuid: e.uuid,
                });
              rO().setItem(n, i);
              let o = document.createEvent("Event");
              (o.initEvent("storage", !0, !0),
                (o.key = n),
                (o.newValue = i),
                window.dispatchEvent(o),
                r());
            });
          });
        },
        canBeUsed: rT,
        type: "localstorage",
        averageResponseTime: function () {
          let e = navigator.userAgent.toLowerCase();
          return e.includes("safari") && !e.includes("chrome") ? 240 : 120;
        },
        microSeconds: rb,
        storageKey: rB,
        addStorageEventListener: rI,
        removeStorageEventListener: rR,
      },
      {
        create: function (e, t) {
          var r, n;
          let i, o, a, s, l, u, d;
          t = ry(t);
          let c = {
            channelName: e,
            uuid: rp(),
            eMIs: new tK(t.server.removeTimeout),
            serverUrl: t.server.url,
            time: rb(),
          };
          return (
            t.server.timeout && (c.timeout = t.server.timeout),
            (r = t.server.url),
            (n = (e) => {
              !c.messagesCallback ||
                e.uuid === c.uuid ||
                !e.token ||
                c.eMIs.has(e.token) ||
                (c.eMIs.add(e.token), c.messagesCallback(e.data));
            }),
            (i = (function (e) {
              if (rC) return rC;
              let t = (0, tJ.f)(e, {
                transports: ["websocket", "polling"],
                withCredentials: !0,
                reconnectionDelayMax: 1e4,
                reconnectionAttempts: 10,
              });
              return (
                t.on("connect_error", (e) => {
                  ((t.io.opts.transports = ["polling", "websocket"]),
                    rm.error("connect error", e));
                }),
                t.on("connect", async () => {
                  let { engine: e } = t.io;
                  (rm.debug("initially connected to", e.transport.name),
                    e.once("upgrade", () => {
                      rm.debug("upgraded", e.transport.name);
                    }),
                    e.once("close", (e) => {
                      rm.debug("connection closed", e);
                    }));
                }),
                t.on("error", (e) => {
                  (rm.error("socket errored", e), t.disconnect());
                }),
                (rC = t),
                t
              );
            })(r)),
            (o = rN(c.channelName)),
            (s = rr((a = rl(m.Buffer.from(o, "utf8")))).toString("hex")),
            i.connected
              ? i.emit("check_auth_status", s, {
                  sameOriginCheck: !0,
                  sameIpCheck: !0,
                })
              : i.once("connect", () => {
                  (rm.debug("connected with socket"),
                    i.emit("check_auth_status", s, {
                      sameOriginCheck: !0,
                      sameIpCheck: !0,
                    }));
                }),
            (l = () => {
              i.once("connect", async () => {
                rj.has(c.channelName) &&
                  i.emit("check_auth_status", s, {
                    sameOriginCheck: !0,
                    sameIpCheck: !0,
                  });
              });
            }),
            (u = () => {
              i && rj.has(c.channelName)
                ? i.connected || "visible" !== document.visibilityState || l()
                : document.removeEventListener("visibilitychange", u);
            }),
            (d = async (e) => {
              try {
                let t = await rc(a.toString("hex"), e);
                (rm.info(t), n(t));
              } catch (e) {
                rm.error(e);
              }
            }),
            i.on("disconnect", () => {
              (rm.debug("socket disconnected"),
                rj.has(c.channelName) &&
                  (rm.error(
                    "socket disconnected unexpectedly, reconnecting socket",
                  ),
                  l()));
            }),
            i.on(`${s}_success`, d),
            "u" > typeof document &&
              document.addEventListener("visibilitychange", u),
            rj.add(e),
            c
          );
        },
        close: function (e) {
          rj.delete(e.channelName);
        },
        onMessage: function (e, t, r) {
          ((e.messagesCallbackTime = r), (e.messagesCallback = t));
        },
        postMessage: function (e, t) {
          return new Promise((r, n) => {
            rh().then(async () => {
              let i = rN(e.channelName),
                o = rl(m.Buffer.from(i, "utf8")),
                a = await rd(o.toString("hex"), {
                  token: rp(),
                  time: Date.now(),
                  data: t,
                  uuid: e.uuid,
                }),
                s = {
                  sameOriginCheck: !0,
                  sameIpCheck: !0,
                  key: rr(o).toString("hex"),
                  data: a,
                  signature: (
                    await rn(o, rl(m.Buffer.from(a, "utf8")))
                  ).toString("hex"),
                };
              return (
                e.timeout && (s.timeout = e.timeout),
                fetch(e.serverUrl + "/channel/set", {
                  method: "POST",
                  body: JSON.stringify(s),
                  headers: {
                    "Content-Type": "application/json; charset=utf-8",
                  },
                })
                  .then(r)
                  .catch(n)
              );
            });
          });
        },
        canBeUsed: function () {
          return !0;
        },
        type: "server",
        averageResponseTime: function () {
          return 500;
        },
        microSeconds: rb,
      },
    ],
    rD = new Set(),
    rU = 0,
    rW = function (e, r) {
      ((this.id = rU++),
        rD.add(this),
        (this.name = e),
        t && (r = t),
        (this.options = ry(r)),
        (this.method = (function (e) {
          let t = [].concat(e.methods, rq).filter(Boolean);
          if (e.type) {
            if ("simulate" === e.type) return rF;
            let r = t.find((t) => t.type === e.type);
            if (r) return r;
            throw Error("method-type " + e.type + " not found");
          }
          e.webWorkerSupport || (t = t.filter((e) => "idb" !== e.type));
          let r = t.find((t) => t.canBeUsed(e));
          if (r) return r;
          throw Error(
            `No useable method found in ${JSON.stringify(rq.map((e) => e.type))}`,
          );
        })(this.options)),
        (this._iL = !1),
        (this._onML = null),
        (this._addEL = { message: [], internal: [] }),
        (this._uMP = new Set()),
        (this._befC = []),
        (this._prepP = null),
        (function (e) {
          let t = e.method.create(e.name, e.options);
          (t && "function" == typeof t.then ? 0 : 1)
            ? (e._state = t)
            : ((e._prepP = t),
              t.then((t) => {
                e._state = t;
              }));
        })(this));
    };
  function r$(e, t, r) {
    let n = { time: e.method.microSeconds(), type: t, data: r };
    return (e._prepP ? e._prepP : rf).then(() => {
      let t = e.method.postMessage(e._state, n);
      return (e._uMP.add(t), t.catch().then(() => e._uMP.delete(t)), t);
    });
  }
  function rz(e) {
    return !!(e._addEL.message.length > 0) || !!(e._addEL.internal.length > 0);
  }
  function rH(e, t, r) {
    (e._addEL[t].push(r),
      (function (e) {
        if (!e._iL && rz(e)) {
          let t = (t) => {
              e._addEL[t.type].forEach((r) => {
                t.time >= r.time
                  ? r.fn(t.data)
                  : "server" === e.method.type && r.fn(t.data);
              });
            },
            r = e.method.microSeconds();
          e._prepP
            ? e._prepP.then(() => {
                ((e._iL = !0), e.method.onMessage(e._state, t, r));
              })
            : ((e._iL = !0), e.method.onMessage(e._state, t, r));
        }
      })(e));
  }
  function rV(e, t, r) {
    ((e._addEL[t] = e._addEL[t].filter((e) => e !== r)),
      (function (e) {
        if (e._iL && !rz(e)) {
          e._iL = !1;
          let t = e.method.microSeconds();
          e.method.onMessage(e._state, null, t);
        }
      })(e));
  }
  ((rW._pubkey = !0),
    (rW.prototype = {
      postMessage(e) {
        if (this.closed)
          throw Error(
            "BroadcastChannel.postMessage(): Cannot post message after channel has closed " +
              JSON.stringify(e),
          );
        return r$(this, "message", e);
      },
      postInternal(e) {
        return r$(this, "internal", e);
      },
      set onmessage(e) {
        let t = { time: this.method.microSeconds(), fn: e };
        (rV(this, "message", this._onML),
          e && "function" == typeof e
            ? ((this._onML = t), rH(this, "message", t))
            : (this._onML = null));
      },
      addEventListener(e, t) {
        rH(this, e, { time: this.method.microSeconds(), fn: t });
      },
      removeEventListener(e, t) {
        let r = this._addEL[e].find((e) => e.fn === t);
        rV(this, e, r);
      },
      close() {
        if (this.closed) return;
        (rD.delete(this), (this.closed = !0));
        let e = this._prepP ? this._prepP : rf;
        return (
          (this._onML = null),
          (this._addEL.message = []),
          e
            .then(() => Promise.all(Array.from(this._uMP)))
            .then(() => Promise.all(this._befC.map((e) => e())))
            .then(() => this.method.close(this._state))
        );
      },
      get type() {
        return this.method.type;
      },
      get isClosed() {
        return this.closed;
      },
    }),
    e.i(990804),
    (class extends Error {}.prototype.name = "InvalidTokenError"));
  let rK = "set_provider";
  var rG =
      (((c = rG || {})[(c.GET = 0)] = "GET"),
      (c[(c.POST = 1)] = "POST"),
      (c[(c.PUT = 2)] = "PUT"),
      (c[(c.PATCH = 3)] = "PATCH"),
      (c[(c.DELETE = 4)] = "DELETE"),
      c),
    rJ = e.i(437639),
    rZ = e.i(65932);
  function rY(e) {
    return null !== e && "object" == typeof e && "function" == typeof e.pipe;
  }
  var rQ = () => "Torus: Lost connection to Torus.",
    rX = () => "Torus: Disconnected from iframe. Page reload required.",
    r0 = () => "Must provide a Node.js-style duplex stream.",
    r1 = () => "Expected a single, non-array, object argument.",
    r2 = () => "'args.method' must be a non-empty string.",
    r5 = () => "'args.params' must be an object or array if provided.",
    r3 = (e) => `Torus: Connected to chain with ID "${e}".`,
    r4 = {
      en: {
        embed: {
          continue: "Continue",
          actionRequired: "Authorization required",
          pendingAction:
            "Click continue to proceed with your request in a popup",
          cookiesRequired: "Cookies Required",
          enableCookies:
            "Please enable cookies in your browser preferences to access Torus",
          clickHere: "More Info",
        },
      },
      de: {
        embed: {
          continue: "Fortsetzen",
          actionRequired: "Autorisierung erforderlich",
          pendingAction:
            "Klicken Sie in einem Popup auf Weiter, um mit Ihrer Anfrage fortzufahren",
          cookiesRequired: "Cookies benötigt",
          enableCookies:
            "Bitte aktivieren Sie Cookies in Ihren Browsereinstellungen, um auf Torus zuzugreifen",
          clickHere: "Mehr Info",
        },
      },
      ja: {
        embed: {
          continue: "継続する",
          actionRequired: "認証が必要です",
          pendingAction:
            "続行をクリックして、ポップアップでリクエストを続行します",
          cookiesRequired: "必要なクッキー",
          enableCookies:
            "Torusにアクセスするには、ブラウザの設定でCookieを有効にしてください。",
          clickHere: "詳しくは",
        },
      },
      ko: {
        embed: {
          continue: "계속하다",
          actionRequired: "승인 필요",
          pendingAction: "팝업에서 요청을 진행하려면 계속을 클릭하십시오.",
          cookiesRequired: "쿠키 필요",
          enableCookies:
            "브라우저 환경 설정에서 쿠키를 활성화하여 Torus에 액세스하십시오.",
          clickHere: "더 많은 정보",
        },
      },
      zh: {
        embed: {
          continue: "继续",
          actionRequired: "需要授权",
          pendingAction: "单击继续以在弹出窗口中继续您的请求",
          cookiesRequired: "必填Cookie",
          enableCookies: "请在您的浏览器首选项中启用cookie以访问Torus。",
          clickHere: "更多信息",
        },
      },
    },
    r6 = G.default.getLogger("solana-embed");
  let r8 = () => Math.random().toString(36).slice(2),
    r7 = async (e) => {
      let t, r;
      switch (e) {
        case "testing":
          ((t = "https://solana-testing.tor.us"), (r = "debug"));
          break;
        case "development":
          ((t = "http://localhost:8080"), (r = "debug"));
          break;
        default:
          ((t = "https://solana.tor.us"), (r = "error"));
      }
      return { torusUrl: t, logLevel: r };
    },
    r9 = { height: 660, width: 375 },
    ne = { height: 740, width: 1315 },
    nt = { height: 700, width: 1200 },
    nr = { height: 600, width: 400 };
  function nn(e) {
    let { width: t, height: r } = e,
      n = void 0 !== window.screenLeft ? window.screenLeft : window.screenX,
      i = void 0 !== window.screenTop ? window.screenTop : window.screenY,
      o = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : window.screen.width,
      a = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : window.screen.height,
      s = Math.abs((o - t) / 2 / 1 + n),
      l = Math.abs((a - r) / 2 / 1 + i);
    return `titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=${r / 1},width=${t / 1},top=${l},left=${s}`;
  }
  class ni extends U {
    constructor(e, t) {
      var r, n;
      let i,
        o,
        a,
        { maxEventListeners: s = 100, jsonRpcStreamName: l = "provider" } = t;
      if (
        (super(),
        w(this, "isTorus", void 0),
        w(this, "_rpcEngine", void 0),
        w(this, "jsonRpcConnectionEvents", void 0),
        w(this, "_state", void 0),
        !(
          rY(e) &&
          !1 !== e.writable &&
          "function" == typeof e._write &&
          "object" == typeof e._writableState &&
          rY((r = e)) &&
          !1 !== r.readable &&
          "function" == typeof r._read &&
          "object" == typeof r._readableState
        ))
      )
        throw Error(r0());
      ((this.isTorus = !0),
        this.setMaxListeners(s),
        (this._handleConnect = this._handleConnect.bind(this)),
        (this._handleDisconnect = this._handleDisconnect.bind(this)),
        (this._handleStreamDisconnect =
          this._handleStreamDisconnect.bind(this)),
        (this._rpcRequest = this._rpcRequest.bind(this)),
        (this._initializeState = this._initializeState.bind(this)),
        (this.request = this.request.bind(this)),
        (this.sendAsync = this.sendAsync.bind(this)));
      let u = new K();
      ((0, P.default)(
        e,
        u,
        e,
        this._handleStreamDisconnect.bind(this, "Torus"),
      ),
        u.ignoreStream("phishing"));
      let d =
        ((i = {}),
        (o = new U()),
        (a = new E.Duplex({
          objectMode: !0,
          read: function () {
            return !1;
          },
          write: function (e, t, r) {
            let n;
            try {
              if (e.id) {
                let t = i[e.id];
                if (!t)
                  throw Error(
                    `StreamMiddleware - Unknown response id "${e.id}"`,
                  );
                (delete i[e.id], Object.assign(t.res, e), setTimeout(t.end));
              } else o.emit("notification", e);
            } catch (e) {
              n = e;
            }
            r(n);
          },
        })),
        {
          events: o,
          middleware: (e, t, r, n) => {
            (a.push(e), (i[e.id] = { req: e, res: t, next: r, end: n }));
          },
          stream: a,
        });
      (0, P.default)(
        d.stream,
        u.createStream(l),
        d.stream,
        this._handleStreamDisconnect.bind(this, "Torus RpcProvider"),
      );
      let c = new z();
      (c.push((e, t, r, n) => {
        let i = e.id,
          o = Math.random().toString(36).slice(2);
        ((e.id = o),
          (t.id = o),
          r((r) => {
            ((e.id = i), (t.id = i), r());
          }));
      }),
        c.push((e, t, r) => {
          (("string" == typeof e.method && e.method) ||
            (t.error = rJ.ethErrors.rpc.invalidRequest({
              message: "The request 'method' must be a non-empty string.",
              data: e,
            })),
            r((e) => {
              let { error: r } = t;
              return (r && r6.error(`Torus - RPC Error: ${r.message}`, r), e());
            }));
        }),
        c.push(
          ((n = { origin: location.origin }),
          function (e, t, r) {
            r((r) => {
              (t.error && G.default.warn("Error in RPC response:\n", t),
                e.isTorusInternal ||
                  (G.default.info(`RPC (${n.origin}):`, e, "->", t), r()));
            });
          }),
        ),
        c.push(d.middleware),
        (this._rpcEngine = c),
        (this.jsonRpcConnectionEvents = d.events));
    }
    async request(e) {
      if (!e || "object" != typeof e || Array.isArray(e))
        throw rJ.ethErrors.rpc.invalidRequest({ message: r1(), data: e });
      let { method: t, params: r } = e;
      if ("string" != typeof t || 0 === t.length)
        throw rJ.ethErrors.rpc.invalidRequest({ message: r2(), data: e });
      if (
        void 0 !== r &&
        !Array.isArray(r) &&
        ("object" != typeof r || null === r)
      )
        throw rJ.ethErrors.rpc.invalidRequest({ message: r5(), data: e });
      return new Promise((e, n) => {
        this._rpcRequest({ method: t, params: r }, $(e, n));
      });
    }
    send(e, t) {
      this._rpcRequest(e, t);
    }
    sendAsync(e) {
      return new Promise((t, r) => {
        this._rpcRequest(e, $(t, r));
      });
    }
    _handleStreamDisconnect(e, t) {
      let r;
      ((r = `Torus: Lost connection to "${e}".`),
        t?.stack &&
          (r += `
${t.stack}`),
        r6.warn(r),
        this && this.listenerCount("error") > 0 && this.emit("error", r),
        this._handleDisconnect(!1, t ? t.message : void 0));
    }
  }
  let no = (e) => {
    let t = window.document.createElement("template");
    return ((t.innerHTML = e.trim()), t.content.firstChild);
  };
  function na(e) {
    return void 0 === e.version;
  }
  class ns extends U {
    constructor(e) {
      let { url: t, target: r, features: n, timeout: i = 3e4 } = e;
      (super(),
        w(this, "url", void 0),
        w(this, "target", void 0),
        w(this, "features", void 0),
        w(this, "window", void 0),
        w(this, "windowTimer", void 0),
        w(this, "iClosedWindow", void 0),
        w(this, "timeout", void 0),
        (this.url = t),
        (this.target = r || "_blank"),
        (this.features = n || nn(nt)),
        (this.window = void 0),
        (this.windowTimer = void 0),
        (this.iClosedWindow = !1),
        (this.timeout = i),
        this._setupTimer());
    }
    _setupTimer() {
      this.windowTimer = Number(
        setInterval(() => {
          (this.window &&
            this.window.closed &&
            (clearInterval(this.windowTimer),
            setTimeout(() => {
              (this.iClosedWindow || this.emit("close"),
                (this.iClosedWindow = !1),
                (this.window = void 0));
            }, this.timeout)),
            void 0 === this.window && clearInterval(this.windowTimer));
        }, 500),
      );
    }
    open() {
      return (
        (this.window = window.open(this.url.href, this.target, this.features)),
        this.window?.focus && this.window.focus(),
        Promise.resolve()
      );
    }
    close() {
      ((this.iClosedWindow = !0), this.window && this.window.close());
    }
    redirect(e) {
      e
        ? window.location.replace(this.url.href)
        : (window.location.href = this.url.href);
    }
  }
  class nl extends ni {
    constructor(e, t) {
      let r,
        { maxEventListeners: n = 100, jsonRpcStreamName: i = "provider" } = t;
      (super(e, { maxEventListeners: n, jsonRpcStreamName: i }),
        w(this, "embedTranslations", void 0),
        w(this, "torusUrl", void 0),
        w(this, "dappStorageKey", void 0),
        w(this, "windowRefs", void 0),
        w(this, "tryWindowHandle", void 0),
        w(this, "torusAlertContainer", void 0),
        w(this, "torusIframe", void 0),
        (this._state = _({}, nl._defaultState)),
        (this.torusUrl = ""),
        (this.dappStorageKey = ""));
      let o =
        r4[
          ((r = (window.navigator.language || "en-US").split("-")),
          Object.prototype.hasOwnProperty.call(r4, r[0]) ? r[0] : "en")
        ];
      ((this.embedTranslations = o.embed),
        (this.windowRefs = {}),
        this.on("connect", () => {
          this._state.isConnected = !0;
        }));
      let a = (e) => {
        let { method: t, params: r } = e;
        if ("iframe_status" === t) {
          let { isFullScreen: e, rid: t } = r;
          this._displayIframe({ isFull: e, rid: t });
        } else if ("create_window" === t) {
          let { windowId: e, url: t } = r;
          this._createPopupBlockAlert(e, t);
        } else if ("close_window" === t) this._handleCloseWindow(r);
        else if ("user_logged_in" === t) {
          let { currentLoginProvider: e } = r;
          ((this._state.isLoggedIn = !0),
            (this._state.currentLoginProvider = e));
        } else
          "user_logged_out" === t &&
            ((this._state.isLoggedIn = !1),
            (this._state.currentLoginProvider = null),
            this._displayIframe());
      };
      this.jsonRpcConnectionEvents.on("notification", a);
    }
    get isLoggedIn() {
      return this._state.isLoggedIn;
    }
    get isIFrameFullScreen() {
      return this._state.isIFrameFullScreen;
    }
    isConnected() {
      return this._state.isConnected;
    }
    async _initializeState(e) {
      try {
        let {
          torusUrl: t,
          dappStorageKey: r,
          torusAlertContainer: n,
          torusIframe: i,
        } = e;
        ((this.torusUrl = t),
          (this.dappStorageKey = r),
          (this.torusAlertContainer = n),
          (this.torusIframe = i),
          this.torusIframe.addEventListener("load", () => {
            this._state.isIFrameFullScreen || this._displayIframe();
          }));
        let { currentLoginProvider: o, isLoggedIn: a } = await this.request({
          method: "get_provider_state",
          params: [],
        });
        this._handleConnect(o, a);
      } catch (e) {
        r6.error(
          "Torus: Failed to get initial state. Please report this bug.",
          e,
        );
      } finally {
        (r6.info("initialized communication state"),
          (this._state.initialized = !0),
          this.emit("_initialized"));
      }
    }
    _handleWindow(e) {
      let {
          url: t,
          target: r,
          features: n,
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        i = new URL(t || `${this.torusUrl}/redirect?windowId=${e}`);
      this.dappStorageKey &&
        (i.hash
          ? (i.hash += `&dappStorageKey=${this.dappStorageKey}`)
          : (i.hash = `#dappStorageKey=${this.dappStorageKey}`));
      let o = new ns({ url: i, target: r, features: n });
      (o.open(), o.window)
        ? ((this.windowRefs[e] = o),
          this.request({ method: "opened_window", params: { windowId: e } }),
          o.once("close", () => {
            (delete this.windowRefs[e],
              this.request({
                method: "closed_window",
                params: { windowId: e },
              }));
          }))
        : this._createPopupBlockAlert(e, i.href);
    }
    _displayIframe() {
      let { isFull: e = !1, rid: t = "" } =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        r = {};
      if (e)
        ((r.display = "block"),
          (r.width = "100%"),
          (r.height = "100%"),
          (r.top = "0px"),
          (r.right = "0px"),
          (r.left = "0px"),
          (r.bottom = "0px"));
      else
        switch (
          ((r.display = this._state.torusWidgetVisibility ? "block" : "none"),
          (r.height = "70px"),
          (r.width = "70px"),
          this._state.buttonPosition)
        ) {
          case "top-left":
            ((r.top = "0px"),
              (r.left = "0px"),
              (r.right = "auto"),
              (r.bottom = "auto"));
            break;
          case "top-right":
            ((r.top = "0px"),
              (r.right = "0px"),
              (r.left = "auto"),
              (r.bottom = "auto"));
            break;
          case "bottom-right":
            ((r.bottom = "0px"),
              (r.right = "0px"),
              (r.top = "auto"),
              (r.left = "auto"));
            break;
          default:
            ((r.bottom = "0px"),
              (r.left = "0px"),
              (r.top = "auto"),
              (r.right = "auto"));
        }
      (Object.assign(this.torusIframe.style, r),
        (this._state.isIFrameFullScreen = e),
        this.request({
          method: "iframe_status",
          params: { isIFrameFullScreen: e, rid: t },
        }));
    }
    hideTorusButton() {
      ((this._state.torusWidgetVisibility = !1), this._displayIframe());
    }
    showTorusButton() {
      ((this._state.torusWidgetVisibility = !0), this._displayIframe());
    }
    _rpcRequest(e, t) {
      (Array.isArray(e) || e.jsonrpc || (e.jsonrpc = "2.0"),
        this.tryWindowHandle(e, t));
    }
    _handleConnect(e, t) {
      this._state.isConnected ||
        ((this._state.isConnected = !0),
        this.emit("connect", { currentLoginProvider: e, isLoggedIn: t }),
        r6.debug(r3(e)));
    }
    _handleDisconnect(e, t) {
      if (
        this._state.isConnected ||
        (!this._state.isPermanentlyDisconnected && !e)
      ) {
        let r;
        ((this._state.isConnected = !1),
          e
            ? ((r = new rJ.EthereumRpcError(1013, t || rQ())), r6.debug(r))
            : ((r = new rJ.EthereumRpcError(1011, t || rX())),
              r6.error(r),
              (this._state.currentLoginProvider = null),
              (this._state.isLoggedIn = !1),
              (this._state.torusWidgetVisibility = !1),
              (this._state.isIFrameFullScreen = !1),
              (this._state.isPermanentlyDisconnected = !0)),
          this.emit("disconnect", r));
      }
    }
    _handleCloseWindow(e) {
      let { windowId: t } = e;
      this.windowRefs[t] &&
        (this.windowRefs[t].close(), delete this.windowRefs[t]);
    }
    async _createPopupBlockAlert(e, t) {
      let r = this.getLogoUrl(),
        n = no(
          `<div id="torusAlert" class="torus-alert--v2"><div id="torusAlert__logo"><img src="${r}" /></div><div><h1 id="torusAlert__title">${this.embedTranslations.actionRequired}</h1><p id="torusAlert__desc">${this.embedTranslations.pendingAction}</p></div></div>`,
        ),
        i = no(
          `<div><a id="torusAlert__btn">${this.embedTranslations.continue}</a></div>`,
        ),
        o = no('<div id="torusAlert__btn-container"></div>');
      (o.appendChild(i), n.appendChild(o));
      let a = () => {
        i.addEventListener("click", () => {
          (this._handleWindow(e, {
            url: t,
            target: "_blank",
            features: nn(nr),
          }),
            n.remove(),
            0 === this.torusAlertContainer.children.length &&
              (this.torusAlertContainer.style.display = "none"));
        });
      };
      (this.torusAlertContainer.appendChild(n),
        a(),
        (this.torusAlertContainer.style.display = "block"));
    }
    getLogoUrl() {
      return `${this.torusUrl}/images/torus_icon-blue.svg`;
    }
  }
  w(nl, "_defaultState", {
    buttonPosition: "bottom-left",
    currentLoginProvider: null,
    isIFrameFullScreen: !1,
    hasEmittedConnection: !1,
    torusWidgetVisibility: !1,
    initialized: !1,
    isLoggedIn: !1,
    isPermanentlyDisconnected: !1,
    isConnected: !1,
  });
  class nu extends ni {
    constructor(e, t) {
      let { maxEventListeners: r = 100, jsonRpcStreamName: n = "provider" } = t;
      (super(e, { maxEventListeners: r, jsonRpcStreamName: n }),
        w(this, "chainId", void 0),
        w(this, "selectedAddress", void 0),
        w(this, "tryWindowHandle", void 0),
        (this._state = _({}, nu._defaultState)),
        (this.selectedAddress = null),
        (this.chainId = null),
        (this._handleAccountsChanged = this._handleAccountsChanged.bind(this)),
        (this._handleChainChanged = this._handleChainChanged.bind(this)),
        (this._handleUnlockStateChanged =
          this._handleUnlockStateChanged.bind(this)),
        this.on("connect", () => {
          this._state.isConnected = !0;
        }));
      let i = (e) => {
        let { method: t, params: r } = e;
        "wallet_accounts_changed" === t
          ? this._handleAccountsChanged(r)
          : "wallet_unlock_state_changed" === t
            ? this._handleUnlockStateChanged(r)
            : "wallet_chain_changed" === t && this._handleChainChanged(r);
      };
      this.jsonRpcConnectionEvents.on("notification", i);
    }
    isConnected() {
      return this._state.isConnected;
    }
    async _initializeState() {
      try {
        let {
          accounts: e,
          chainId: t,
          isUnlocked: r,
        } = await this.request({
          method: "wallet_get_provider_state",
          params: [],
        });
        (this.emit("connect", { chainId: t }),
          this._handleChainChanged({ chainId: t }),
          this._handleUnlockStateChanged({ accounts: e, isUnlocked: r }),
          this._handleAccountsChanged(e));
      } catch (e) {
        r6.error(
          "Torus: Failed to get initial state. Please report this bug.",
          e,
        );
      } finally {
        (r6.info("initialized provider state"),
          (this._state.initialized = !0),
          this.emit("_initialized"));
      }
    }
    _rpcRequest(e, t) {
      let r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        n = t;
      if (!Array.isArray(e)) {
        if (
          (e.jsonrpc || (e.jsonrpc = "2.0"),
          "solana_accounts" === e.method ||
            "solana_requestAccounts" === e.method)
        )
          n = (n, i) => {
            (this._handleAccountsChanged(
              i.result || [],
              "solana_accounts" === e.method,
              r,
            ),
              t(n, i));
          };
        else if ("wallet_getProviderState" === e.method)
          return void this._rpcEngine.handle(e, n);
      }
      this.tryWindowHandle(e, n);
    }
    _handleConnect(e) {
      this._state.isConnected ||
        ((this._state.isConnected = !0),
        this.emit("connect", { chainId: e }),
        r6.debug(r3(e)));
    }
    _handleDisconnect(e, t) {
      if (
        this._state.isConnected ||
        (!this._state.isPermanentlyDisconnected && !e)
      ) {
        let r;
        ((this._state.isConnected = !1),
          e
            ? ((r = new rJ.EthereumRpcError(1013, t || rQ())), r6.debug(r))
            : ((r = new rJ.EthereumRpcError(1011, t || rX())),
              r6.error(r),
              (this.chainId = null),
              (this._state.accounts = null),
              (this.selectedAddress = null),
              (this._state.isUnlocked = !1),
              (this._state.isPermanentlyDisconnected = !0)),
          this.emit("disconnect", r));
      }
    }
    _handleAccountsChanged(e) {
      let t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        n = e;
      for (let t of (Array.isArray(n) ||
        (r6.error(
          "Torus: Received non-array accounts parameter. Please report this bug.",
          n,
        ),
        (n = [])),
      e))
        if ("string" != typeof t) {
          (r6.error(
            "Torus: Received non-string account. Please report this bug.",
            e,
          ),
            (n = []));
          break;
        }
      ((0, rZ.default)(this._state.accounts, n) ||
        (t &&
          Array.isArray(this._state.accounts) &&
          this._state.accounts.length > 0 &&
          !r &&
          r6.error(
            'Torus: "solana_accounts" unexpectedly updated accounts. Please report this bug.',
            n,
          ),
        (this._state.accounts = n),
        this.emit("accountsChanged", n)),
        this.selectedAddress !== n[0] && (this.selectedAddress = n[0] || null));
    }
    _handleChainChanged() {
      let { chainId: e } =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      e
        ? "loading" === e
          ? this._handleDisconnect(!0)
          : (this._handleConnect(e),
            e !== this.chainId &&
              ((this.chainId = e),
              this._state.initialized &&
                this.emit("chainChanged", this.chainId)))
        : r6.error(
            "Torus: Received invalid network parameters. Please report this bug.",
            { chainId: e },
          );
    }
    _handleUnlockStateChanged() {
      let { accounts: e, isUnlocked: t } =
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      "boolean" != typeof t
        ? r6.error(
            "Torus: Received invalid isUnlocked parameter. Please report this bug.",
            { isUnlocked: t },
          )
        : t !== this._state.isUnlocked &&
          ((this._state.isUnlocked = t), this._handleAccountsChanged(e || []));
    }
  }
  function nd(e) {
    return new Promise((t, r) => {
      try {
        let r = document.createElement("img");
        ((r.onload = () => t(!0)), (r.onerror = () => t(!1)), (r.src = e));
      } catch (e) {
        r(e);
      }
    });
  }
  async function nc(e) {
    try {
      let { document: t } = e,
        r = t.querySelector('head > link[rel="shortcut icon"]');
      if (
        (r && (await nd(r.href))) ||
        ((r = Array.from(t.querySelectorAll('head > link[rel="icon"]')).find(
          (e) => !!e.href,
        )) &&
          (await nd(r.href)))
      )
        return r.href;
      return "";
    } catch (e) {
      return "";
    }
  }
  w(nu, "_defaultState", {
    accounts: null,
    isConnected: !1,
    isUnlocked: !1,
    initialized: !1,
    isPermanentlyDisconnected: !1,
    hasEmittedConnection: !1,
  });
  let nf = async () => ({
      name: ((e) => {
        let { document: t } = e,
          r = t.querySelector('head > meta[property="og:site_name"]');
        if (r) return r.content;
        let n = t.querySelector('head > meta[name="title"]');
        return n
          ? n.content
          : t.title && t.title.length > 0
            ? t.title
            : e.location.hostname;
      })(window),
      icon: await nc(window),
    }),
    nh = [
      "send_transaction",
      "sign_transaction",
      "sign_all_transactions",
      "sign_message",
      "connect",
    ],
    np = [rK],
    ng = (function (e) {
      let t;
      try {
        t = window[e];
        let r = "__storage_test__";
        return (t.setItem(r, r), t.removeItem(r), !0);
      } catch (e) {
        return (
          e &&
          (22 === e.code ||
            1014 === e.code ||
            "QuotaExceededError" === e.name ||
            "NS_ERROR_DOM_QUOTA_REACHED" === e.name) &&
          t &&
          0 !== t.length
        );
      }
    })("localStorage");
  (!(async function () {
    try {
      if ("u" < typeof document) return;
      let e = document.createElement("link"),
        { torusUrl: t } = await r7("production");
      ((e.href = `${t}/frame`),
        (e.crossOrigin = "anonymous"),
        (e.type = "text/html"),
        (e.rel = "prefetch"),
        e.relList &&
          e.relList.supports &&
          e.relList.supports("prefetch") &&
          document.head.appendChild(e));
    } catch (e) {
      r6.warn(e);
    }
  })(),
    e.s(
      [
        "default",
        0,
        class {
          constructor() {
            let { modalZIndex: e = 99999 } =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            (w(this, "isInitialized", void 0),
              w(this, "torusAlert", void 0),
              w(this, "modalZIndex", void 0),
              w(this, "alertZIndex", void 0),
              w(this, "requestedLoginProvider", void 0),
              w(this, "provider", void 0),
              w(this, "communicationProvider", void 0),
              w(this, "dappStorageKey", void 0),
              w(this, "isTopupHidden", !1),
              w(this, "torusAlertContainer", void 0),
              w(this, "torusUrl", void 0),
              w(this, "torusIframe", void 0),
              w(this, "styleLink", void 0),
              (this.torusUrl = ""),
              (this.isInitialized = !1),
              (this.requestedLoginProvider = null),
              (this.modalZIndex = e),
              (this.alertZIndex = e + 1e3),
              (this.dappStorageKey = ""));
          }
          get isLoggedIn() {
            return (
              !!this.communicationProvider &&
              this.communicationProvider.isLoggedIn
            );
          }
          async init() {
            let {
              buildEnv: e = "production",
              enableLogging: t = !1,
              network: r,
              showTorusButton: n = !1,
              useLocalStorage: i = !1,
              buttonPosition: o = "bottom-left",
              apiKey: a = "torus-default",
              extraParams: s = {},
              whiteLabel: l,
            } = arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : {};
            if (this.isInitialized) throw Error("Already initialized");
            let { torusUrl: u, logLevel: d } = await r7(e);
            (r6.enableAll(),
              r6.info(u, "url loaded"),
              r6.info("Solana Embed Version :2.1.0"),
              (this.torusUrl = u),
              r6.setDefaultLevel(d),
              t ? r6.enableAll() : r6.disableAll());
            let c = this.handleDappStorageKey(i),
              f = new URL(u);
            f.pathname.endsWith("/")
              ? (f.pathname += "frame")
              : (f.pathname += "/frame");
            let h = new URLSearchParams();
            return (
              c && h.append("dappStorageKey", c),
              h.append("origin", window.location.origin),
              (f.hash = h.toString()),
              (this.torusIframe = no(`<iframe
        id="torusIframe"
        class="torusIframe"
        src="${f.href}"
        style="display: none; position: fixed; top: 0; right: 0; width: 100%;
        height: 100%; border: none; border-radius: 0; z-index: ${this.modalZIndex.toString()}"
      ></iframe>`)),
              (this.torusAlertContainer = no(
                `<div id="torusAlertContainer" style="display:none; z-index: ${this.alertZIndex.toString()}"></div>`,
              )),
              (this.styleLink = no(
                `<link href="${u}/css/widget.css" rel="stylesheet" type="text/css">`,
              )),
              new Promise((e, t) => {
                try {
                  (this.torusIframe.addEventListener("load", async () => {
                    let t = await nf();
                    (this.torusIframe.contentWindow.postMessage(
                      {
                        buttonPosition: o,
                        apiKey: a,
                        network: r,
                        dappMetadata: t,
                        extraParams: s,
                        whiteLabel: l,
                      },
                      f.origin,
                    ),
                      await this._setupWeb3({ torusUrl: u }),
                      n && this.showTorusButton(),
                      l?.topupHide
                        ? (this.isTopupHidden = l.topupHide)
                        : this.hideTorusButton(),
                      (this.isInitialized = !0),
                      (window.torus = this),
                      e());
                  }),
                    window.document.head.appendChild(this.styleLink),
                    window.document.body.appendChild(this.torusIframe),
                    window.document.body.appendChild(this.torusAlertContainer));
                } catch (e) {
                  t(e);
                }
              })
            );
          }
          async login() {
            let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            if (!this.isInitialized) throw Error("Call init() first");
            try {
              ((this.requestedLoginProvider = e.loginProvider || null),
                this.requestedLoginProvider ||
                  this.communicationProvider._displayIframe({ isFull: !0 }));
              let t = await new Promise((t, r) => {
                this.provider._rpcRequest(
                  {
                    method: "solana_requestAccounts",
                    params: [this.requestedLoginProvider, e.login_hint],
                  },
                  $(t, r),
                );
              });
              if (Array.isArray(t) && t.length > 0) return t;
              throw Error("Login failed");
            } catch (e) {
              throw (r6.error("login failed", e), e);
            } finally {
              this.communicationProvider.isIFrameFullScreen &&
                this.communicationProvider._displayIframe();
            }
          }
          async loginWithPrivateKey(e) {
            if (!this.isInitialized) throw Error("Call init() first");
            let { privateKey: t, userInfo: r } = e,
              { success: n } = await this.communicationProvider.request({
                method: "login_with_private_key",
                params: { privateKey: t, userInfo: r },
              });
            if (!n) throw Error("Login Failed");
          }
          async logout() {
            if (!this.communicationProvider.isLoggedIn)
              throw Error("Not logged in");
            (await this.communicationProvider.request({
              method: "logout",
              params: [],
            }),
              (this.requestedLoginProvider = null));
          }
          async cleanUp() {
            (this.communicationProvider.isLoggedIn && (await this.logout()),
              this.clearInit());
          }
          clearInit() {
            function e(e) {
              return e instanceof Element || e instanceof Document;
            }
            (e(this.styleLink) &&
              window.document.body.contains(this.styleLink) &&
              (this.styleLink.remove(), (this.styleLink = void 0)),
              e(this.torusIframe) &&
                window.document.body.contains(this.torusIframe) &&
                (this.torusIframe.remove(), (this.torusIframe = void 0)),
              e(this.torusAlertContainer) &&
                window.document.body.contains(this.torusAlertContainer) &&
                ((this.torusAlert = void 0),
                this.torusAlertContainer.remove(),
                (this.torusAlertContainer = void 0)),
              (this.isInitialized = !1));
          }
          hideTorusButton() {
            this.communicationProvider.hideTorusButton();
          }
          showTorusButton() {
            this.communicationProvider.showTorusButton();
          }
          async setProvider(e) {
            await this.communicationProvider.request({
              method: rK,
              params: _({}, e),
            });
          }
          async showWallet(e) {
            let t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              r = await this.communicationProvider.request({
                method: "wallet_instance_id",
                params: [],
              }),
              n = e ? `/${e}` : "",
              i = new URL(`${this.torusUrl}/wallet${n}`);
            (i.searchParams.append("instanceId", r),
              Object.keys(t).forEach((e) => {
                i.searchParams.append(e, t[e]);
              }),
              this.dappStorageKey &&
                (i.hash = `#dappStorageKey=${this.dappStorageKey}`),
              new ns({ url: i, features: nn(ne) }).open());
          }
          async getUserInfo() {
            return await this.communicationProvider.request({
              method: "user_info",
              params: [],
            });
          }
          async initiateTopup(e, t) {
            if (!this.isInitialized) throw Error("Torus is not initialized");
            let r = r8();
            return (
              this.communicationProvider._handleWindow(r),
              await this.communicationProvider.request({
                method: "topup",
                params: { provider: e, params: t, windowId: r },
              })
            );
          }
          async getAccounts() {
            return await this.provider.request({
              method: "getAccounts",
              params: [],
            });
          }
          async sendTransaction(e) {
            let t = na(e),
              r = t
                ? e.serialize({ requireAllSignatures: !1 }).toString("hex")
                : m.Buffer.from(e.serialize()).toString("hex");
            return await this.provider.request({
              method: "send_transaction",
              params: { message: r, isLegacyTransaction: t },
            });
          }
          async signAndSendTransaction(e, t) {
            let r = na(e),
              n = r
                ? e.serialize({ requireAllSignatures: !1 }).toString("hex")
                : m.Buffer.from(e.serialize()).toString("hex");
            return {
              signature: await this.provider.request({
                method: "send_transaction",
                params: { message: n, options: t, isLegacyTransaction: r },
              }),
            };
          }
          async signTransaction(e) {
            let t = na(e),
              r = t
                ? e.serializeMessage().toString("hex")
                : m.Buffer.from(e.message.serialize()).toString("hex"),
              n = JSON.parse(
                await this.provider.request({
                  method: "sign_transaction",
                  params: {
                    message: r,
                    messageOnly: !0,
                    isLegacyTransaction: t,
                  },
                }),
              ),
              i = {
                publicKey: new S.PublicKey(n.publicKey),
                signature: m.Buffer.from(n.signature, "hex"),
              };
            return (e.addSignature(i.publicKey, i.signature), e);
          }
          async signAllTransactions(e) {
            let t,
              r = e.map((e) =>
                (t = na(e))
                  ? e.serializeMessage().toString("hex")
                  : m.Buffer.from(e.message.serialize()).toString("hex"),
              ),
              n = (
                await this.provider.request({
                  method: "sign_all_transactions",
                  params: {
                    message: r,
                    messageOnly: !0,
                    isLegacyTransaction: t,
                  },
                })
              ).map((e) => {
                let t = JSON.parse(e);
                return {
                  publicKey: new S.PublicKey(t.publicKey),
                  signature: m.Buffer.from(t.signature, "hex"),
                };
              });
            return (
              e.forEach(
                (e, t) => (e.addSignature(n[t].publicKey, n[t].signature), e),
              ),
              e
            );
          }
          async signMessage(e) {
            return await this.provider.request({
              method: "sign_message",
              params: { data: e },
            });
          }
          async getGaslessPublicKey() {
            return await this.provider.request({
              method: "get_gasless_public_key",
              params: [],
            });
          }
          handleDappStorageKey(e) {
            let t = `torus-${window.location.hostname}`,
              r = "";
            if (ng && e) {
              let e = window.localStorage.getItem(t);
              if (e) r = e;
              else {
                let e = `torus-app-${r8()}`;
                (window.localStorage.setItem(t, e), (r = e));
              }
            }
            return ((this.dappStorageKey = r), r);
          }
          async _setupWeb3(e) {
            r6.info("setupWeb3 running");
            let t = new B({
                name: "embed_torus",
                target: "iframe_torus",
                targetWindow: this.torusIframe.contentWindow,
              }),
              r = new B({
                name: "embed_communication",
                target: "iframe_communication",
                targetWindow: this.torusIframe.contentWindow,
              }),
              n = new nu(t, {}),
              i = new nl(r, {});
            ((n.tryWindowHandle = (e, t) => {
              if (!Array.isArray(e) && nh.includes(e.method)) {
                if (!this.communicationProvider.isLoggedIn)
                  throw Error("User Not Logged In");
                let t = r8();
                (i._handleWindow(t, { target: "_blank", features: nn(nr) }),
                  (e.windowId = t));
              }
              n._rpcEngine.handle(e, t);
            }),
              (i.tryWindowHandle = (e, t) => {
                if (!Array.isArray(e) && np.includes(e.method)) {
                  let t = r8();
                  (i._handleWindow(t, { target: "_blank", features: nn(r9) }),
                    (e.params.windowId = t));
                }
                i._rpcEngine.handle(e, t);
              }));
            let o = (e) => {
              let t = n[e],
                r = this;
              n[e] = function (e, n) {
                let { method: i, params: o = [] } = e;
                if ("solana_requestAccounts" === i) {
                  if (!n) return r.login({ loginProvider: o[0] });
                  r.login({ loginProvider: o[0] })
                    .then((e) => n(null, e))
                    .catch((e) => n(e));
                }
                return t.apply(this, [e, n]);
              };
            };
            (o("request"), o("sendAsync"), o("send"));
            let a = new Proxy(n, { deleteProperty: () => !0 }),
              s = new Proxy(i, { deleteProperty: () => !0 });
            ((this.provider = a),
              (this.communicationProvider = s),
              await Promise.all([
                n._initializeState(),
                i._initializeState(
                  _(
                    _({}, e),
                    {},
                    {
                      dappStorageKey: this.dappStorageKey,
                      torusAlertContainer: this.torusAlertContainer,
                      torusIframe: this.torusIframe,
                    },
                  ),
                ),
              ]),
              r6.debug("Torus - injected provider"));
          }
        },
      ],
      147351,
    ));
};
