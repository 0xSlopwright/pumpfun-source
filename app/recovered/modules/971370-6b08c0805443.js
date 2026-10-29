// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e,
    r,
    i,
    n,
    s = t.i(259390),
    o = t.i(430981),
    a = t.i(579015),
    u = t.i(344048),
    c = t.i(403893),
    l = t.i(894119),
    h = t.i(742542),
    f = t.i(736504);
  class d extends TypeError {
    constructor(t, e) {
      let r,
        { message: i, explanation: n, ...s } = t,
        { path: o } = t,
        a = 0 === o.length ? i : `At path: ${o.join(".")} -- ${i}`;
      (super(n ?? a),
        null != n && (this.cause = a),
        Object.assign(this, s),
        (this.name = this.constructor.name),
        (this.failures = () => r ?? (r = [t, ...e()])));
    }
  }
  function p(t) {
    return "object" == typeof t && null != t;
  }
  function g(t) {
    return p(t) && !Array.isArray(t);
  }
  function m(t) {
    return "symbol" == typeof t
      ? t.toString()
      : "string" == typeof t
        ? JSON.stringify(t)
        : `${t}`;
  }
  function* y(t, e, r, i) {
    var n;
    for (let s of ((p((n = t)) && "function" == typeof n[Symbol.iterator]) ||
      (t = [t]),
    t)) {
      let t = (function (t, e, r, i) {
        if (!0 === t) return;
        !1 === t ? (t = {}) : "string" == typeof t && (t = { message: t });
        let { path: n, branch: s } = e,
          { type: o } = r,
          {
            refinement: a,
            message:
              u = `Expected a value of type \`${o}\`${a ? ` with refinement \`${a}\`` : ""}, but received: \`${m(i)}\``,
          } = t;
        return {
          value: i,
          type: o,
          refinement: a,
          key: n[n.length - 1],
          path: n,
          branch: s,
          ...t,
          message: u,
        };
      })(s, e, r, i);
      t && (yield t);
    }
  }
  function* b(t, e, r = {}) {
    let { path: i = [], branch: n = [t], coerce: s = !1, mask: o = !1 } = r,
      a = { path: i, branch: n, mask: o };
    s && (t = e.coercer(t, a));
    let u = "valid";
    for (let i of e.validator(t, a))
      ((i.explanation = r.message), (u = "not_valid"), yield [i, void 0]);
    for (let [c, l, h] of e.entries(t, a))
      for (let e of b(l, h, {
        path: void 0 === c ? i : [...i, c],
        branch: void 0 === c ? n : [...n, l],
        coerce: s,
        mask: o,
        message: r.message,
      }))
        e[0]
          ? ((u = null != e[0].refinement ? "not_refined" : "not_valid"),
            yield [e[0], void 0])
          : s &&
            ((l = e[1]),
            void 0 === c
              ? (t = l)
              : t instanceof Map
                ? t.set(c, l)
                : t instanceof Set
                  ? t.add(l)
                  : p(t) && (void 0 !== l || c in t) && (t[c] = l));
    if ("not_valid" !== u)
      for (let i of e.refiner(t, a))
        ((i.explanation = r.message), (u = "not_refined"), yield [i, void 0]);
    "valid" === u && (yield [void 0, t]);
  }
  class w {
    constructor(t) {
      let {
        type: e,
        schema: r,
        validator: i,
        refiner: n,
        coercer: s = (t) => t,
        entries: o = function* () {},
      } = t;
      ((this.type = e),
        (this.schema = r),
        (this.entries = o),
        (this.coercer = s),
        i
          ? (this.validator = (t, e) => y(i(t, e), e, this, t))
          : (this.validator = () => []),
        n
          ? (this.refiner = (t, e) => y(n(t, e), e, this, t))
          : (this.refiner = () => []));
    }
    assert(t, e) {
      return k(t, this, e);
    }
    create(t, e) {
      return v(t, this, e);
    }
    is(t) {
      var e, r;
      return ((e = t), (r = this), !S(e, r)[0]);
    }
    mask(t, e) {
      var r = t,
        i = this,
        n = e;
      let s = S(r, i, { coerce: !0, mask: !0, message: n });
      if (!s[0]) return s[1];
      throw s[0];
    }
    validate(t, e = {}) {
      return S(t, this, e);
    }
  }
  function k(t, e, r) {
    let i = S(t, e, { message: r });
    if (i[0]) throw i[0];
  }
  function v(t, e, r) {
    let i = S(t, e, { coerce: !0, message: r });
    if (!i[0]) return i[1];
    throw i[0];
  }
  function S(t, e, r = {}) {
    let i = b(t, e, r),
      n = (function (t) {
        let { done: e, value: r } = t.next();
        return e ? void 0 : r;
      })(i);
    return n[0]
      ? [
          new d(n[0], function* () {
            for (let t of i) t[0] && (yield t[0]);
          }),
          void 0,
        ]
      : [void 0, n[1]];
  }
  function _(t, e) {
    return new w({ type: t, schema: null, validator: e });
  }
  function I(t) {
    return new w({
      type: "array",
      schema: t,
      *entries(e) {
        if (t && Array.isArray(e))
          for (let [r, i] of e.entries()) yield [r, i, t];
      },
      coercer: (t) => (Array.isArray(t) ? t.slice() : t),
      validator: (t) =>
        Array.isArray(t) || `Expected an array value, but received: ${m(t)}`,
    });
  }
  function A() {
    return _("boolean", (t) => "boolean" == typeof t);
  }
  function E(t) {
    return _(
      "instance",
      (e) =>
        e instanceof t ||
        `Expected a \`${t.name}\` instance, but received: ${m(e)}`,
    );
  }
  function x(t) {
    let e = m(t),
      r = typeof t;
    return new w({
      type: "literal",
      schema: "string" === r || "number" === r || "boolean" === r ? t : null,
      validator: (r) =>
        r === t || `Expected the literal \`${e}\`, but received: ${m(r)}`,
    });
  }
  function B(t) {
    return new w({
      ...t,
      validator: (e, r) => null === e || t.validator(e, r),
      refiner: (e, r) => null === e || t.refiner(e, r),
    });
  }
  function M() {
    return _(
      "number",
      (t) =>
        ("number" == typeof t && !isNaN(t)) ||
        `Expected a number, but received: ${m(t)}`,
    );
  }
  function P(t) {
    return new w({
      ...t,
      validator: (e, r) => void 0 === e || t.validator(e, r),
      refiner: (e, r) => void 0 === e || t.refiner(e, r),
    });
  }
  function T(t, e) {
    return new w({
      type: "record",
      schema: null,
      *entries(r) {
        if (p(r))
          for (let i in r) {
            let n = r[i];
            (yield [i, i, t], yield [i, n, e]);
          }
      },
      validator: (t) => g(t) || `Expected an object, but received: ${m(t)}`,
      coercer: (t) => (g(t) ? { ...t } : t),
    });
  }
  function R() {
    return _(
      "string",
      (t) => "string" == typeof t || `Expected a string, but received: ${m(t)}`,
    );
  }
  function L(t) {
    let e = _("never", () => !1);
    return new w({
      type: "tuple",
      schema: null,
      *entries(r) {
        if (Array.isArray(r)) {
          let i = Math.max(t.length, r.length);
          for (let n = 0; n < i; n++) yield [n, r[n], t[n] || e];
        }
      },
      validator: (t) =>
        Array.isArray(t) || `Expected an array, but received: ${m(t)}`,
      coercer: (t) => (Array.isArray(t) ? t.slice() : t),
    });
  }
  function C(t) {
    let e = Object.keys(t);
    return new w({
      type: "type",
      schema: t,
      *entries(r) {
        if (p(r)) for (let i of e) yield [i, r[i], t[i]];
      },
      validator: (t) => g(t) || `Expected an object, but received: ${m(t)}`,
      coercer: (t) => (g(t) ? { ...t } : t),
    });
  }
  function O(t) {
    let e = t.map((t) => t.type).join(" | ");
    return new w({
      type: "union",
      schema: null,
      coercer(e, r) {
        for (let i of t) {
          let [t, n] = i.validate(e, { coerce: !0, mask: r.mask });
          if (!t) return n;
        }
        return e;
      },
      validator(r, i) {
        let n = [];
        for (let e of t) {
          let [...t] = b(r, e, i),
            [s] = t;
          if (!s[0]) return [];
          for (let [e] of t) e && n.push(e);
        }
        return [
          `Expected the value to satisfy a union of \`${e}\`, but received: ${m(r)}`,
          ...n,
        ];
      },
    });
  }
  function U() {
    return _("unknown", () => !0);
  }
  function N(t, e, r) {
    return new w({
      ...t,
      coercer: (i, n) => (S(i, e)[0] ? t.coercer(i, n) : t.coercer(r(i, n), n)),
    });
  }
  var z = t.i(476407);
  t.i(785373);
  var W = t.i(50158),
    K = class extends W.EventEmitter {
      socket;
      constructor(t, e) {
        (super(),
          (this.socket = new window.WebSocket(t, e.protocols)),
          (this.socket.onopen = () => this.emit("open")),
          (this.socket.onmessage = (t) => this.emit("message", t.data)),
          (this.socket.onerror = (t) => this.emit("error", t)),
          (this.socket.onclose = (t) => {
            this.emit("close", t.code, t.reason);
          }));
      }
      send(t, e, r) {
        let i = r || e;
        try {
          (this.socket.send(t), i());
        } catch (t) {
          i(t);
        }
      }
      close(t, e) {
        this.socket.close(t, e);
      }
      addEventListener(t, e, r) {
        this.socket.addEventListener(t, e, r);
      }
    },
    q = class {
      encode(t) {
        return JSON.stringify(t);
      }
      decode(t) {
        return JSON.parse(t);
      }
    },
    D = class extends W.EventEmitter {
      address;
      rpc_id;
      queue;
      options;
      autoconnect;
      ready;
      reconnect;
      reconnect_timer_id;
      reconnect_interval;
      max_reconnects;
      rest_options;
      current_reconnects;
      generate_request_id;
      socket;
      webSocketFactory;
      dataPack;
      constructor(
        t,
        e = "ws://localhost:8080",
        {
          autoconnect: r = !0,
          reconnect: i = !0,
          reconnect_interval: n = 1e3,
          max_reconnects: s = 5,
          ...o
        } = {},
        a,
        u,
      ) {
        (super(),
          (this.webSocketFactory = t),
          (this.queue = {}),
          (this.rpc_id = 0),
          (this.address = e),
          (this.autoconnect = r),
          (this.ready = !1),
          (this.reconnect = i),
          (this.reconnect_timer_id = void 0),
          (this.reconnect_interval = n),
          (this.max_reconnects = s),
          (this.rest_options = o),
          (this.current_reconnects = 0),
          (this.generate_request_id =
            a ||
            (() =>
              "number" == typeof this.rpc_id
                ? ++this.rpc_id
                : Number(this.rpc_id) + 1)),
          u ? (this.dataPack = u) : (this.dataPack = new q()),
          this.autoconnect &&
            this._connect(this.address, {
              autoconnect: this.autoconnect,
              reconnect: this.reconnect,
              reconnect_interval: this.reconnect_interval,
              max_reconnects: this.max_reconnects,
              ...this.rest_options,
            }));
      }
      connect() {
        this.socket ||
          this._connect(this.address, {
            autoconnect: this.autoconnect,
            reconnect: this.reconnect,
            reconnect_interval: this.reconnect_interval,
            max_reconnects: this.max_reconnects,
            ...this.rest_options,
          });
      }
      call(t, e, r, i) {
        return (
          i || "object" != typeof r || ((i = r), (r = null)),
          new Promise((n, s) => {
            if (!this.ready) return s(Error("socket not ready"));
            let o = this.generate_request_id(t, e);
            this.socket.send(
              this.dataPack.encode({
                jsonrpc: "2.0",
                method: t,
                params: e || void 0,
                id: o,
              }),
              i,
              (t) => {
                if (t) return s(t);
                ((this.queue[o] = { promise: [n, s] }),
                  r &&
                    (this.queue[o].timeout = setTimeout(() => {
                      (delete this.queue[o], s(Error("reply timeout")));
                    }, r)));
              },
            );
          })
        );
      }
      async login(t) {
        let e = await this.call("rpc.login", t);
        if (!e) throw Error("authentication failed");
        return e;
      }
      async listMethods() {
        return await this.call("__listMethods");
      }
      notify(t, e) {
        return new Promise((r, i) => {
          if (!this.ready) return i(Error("socket not ready"));
          this.socket.send(
            this.dataPack.encode({ jsonrpc: "2.0", method: t, params: e }),
            (t) => {
              if (t) return i(t);
              r();
            },
          );
        });
      }
      async subscribe(t) {
        "string" == typeof t && (t = [t]);
        let e = await this.call("rpc.on", t);
        if ("string" == typeof t && "ok" !== e[t])
          throw Error(
            "Failed subscribing to an event '" + t + "' with: " + e[t],
          );
        return e;
      }
      async unsubscribe(t) {
        "string" == typeof t && (t = [t]);
        let e = await this.call("rpc.off", t);
        if ("string" == typeof t && "ok" !== e[t])
          throw Error("Failed unsubscribing from an event with: " + e);
        return e;
      }
      close(t, e) {
        this.socket && this.socket.close(t || 1e3, e);
      }
      setAutoReconnect(t) {
        this.reconnect = t;
      }
      setReconnectInterval(t) {
        this.reconnect_interval = t;
      }
      setMaxReconnects(t) {
        this.max_reconnects = t;
      }
      getCurrentReconnects() {
        return this.current_reconnects;
      }
      getMaxReconnects() {
        return this.max_reconnects;
      }
      isReconnecting() {
        return void 0 !== this.reconnect_timer_id;
      }
      willReconnect() {
        return (
          this.reconnect &&
          (0 === this.max_reconnects ||
            this.current_reconnects < this.max_reconnects)
        );
      }
      _connect(t, e) {
        (clearTimeout(this.reconnect_timer_id),
          (this.socket = this.webSocketFactory(t, e)),
          this.socket.addEventListener("open", () => {
            ((this.ready = !0),
              this.emit("open"),
              (this.current_reconnects = 0));
          }),
          this.socket.addEventListener("message", ({ data: t }) => {
            t instanceof ArrayBuffer && (t = s.Buffer.from(t).toString());
            try {
              t = this.dataPack.decode(t);
            } catch (t) {
              return;
            }
            if (t.notification && this.listeners(t.notification).length) {
              if (!Object.keys(t.params).length)
                return this.emit(t.notification);
              let e = [t.notification];
              if (t.params.constructor === Object) e.push(t.params);
              else
                for (let r = 0; r < t.params.length; r++) e.push(t.params[r]);
              return Promise.resolve().then(() => {
                this.emit.apply(this, e);
              });
            }
            if (!this.queue[t.id])
              return t.method
                ? Promise.resolve().then(() => {
                    this.emit(t.method, t?.params);
                  })
                : void 0;
            ("error" in t == "result" in t &&
              this.queue[t.id].promise[1](
                Error(
                  'Server response malformed. Response must include either "result" or "error", but not both.',
                ),
              ),
              this.queue[t.id].timeout &&
                clearTimeout(this.queue[t.id].timeout),
              t.error
                ? this.queue[t.id].promise[1](t.error)
                : this.queue[t.id].promise[0](t.result),
              delete this.queue[t.id]);
          }),
          this.socket.addEventListener("error", (t) => this.emit("error", t)),
          this.socket.addEventListener("close", ({ code: r, reason: i }) => {
            (this.ready && setTimeout(() => this.emit("close", r, i), 0),
              (this.ready = !1),
              (this.socket = void 0),
              1e3 !== r &&
                (this.current_reconnects++,
                this.reconnect &&
                (this.max_reconnects > this.current_reconnects ||
                  0 === this.max_reconnects)
                  ? (this.reconnect_timer_id = setTimeout(
                      () => this._connect(t, e),
                      this.reconnect_interval,
                    ))
                  : this.reconnect &&
                    this.max_reconnects > 0 &&
                    this.current_reconnects >= this.max_reconnects &&
                    setTimeout(
                      () => this.emit("max_reconnects_reached", r, i),
                      1,
                    )));
          }));
      }
    },
    $ = t.i(626014),
    F = t.i(563488);
  let V = o.f.utils.randomPrivateKey,
    j = () => {
      let t = o.f.utils.randomPrivateKey(),
        e = H(t),
        r = new Uint8Array(64);
      return (r.set(t), r.set(e, 32), { publicKey: e, secretKey: r });
    },
    H = o.f.getPublicKey;
  function J(t) {
    try {
      return (o.f.ExtendedPoint.fromHex(t), !0);
    } catch {
      return !1;
    }
  }
  let G = (t, e) => o.f.sign(t, e.slice(0, 32)),
    Y = o.f.verify,
    Z = (t) =>
      s.Buffer.isBuffer(t)
        ? t
        : t instanceof Uint8Array
          ? s.Buffer.from(t.buffer, t.byteOffset, t.byteLength)
          : s.Buffer.from(t);
  class X {
    constructor(t) {
      Object.assign(this, t);
    }
    encode() {
      return s.Buffer.from((0, l.serialize)(Q, this));
    }
    static decode(t) {
      return (0, l.deserialize)(Q, this, t);
    }
    static decodeUnchecked(t) {
      return (0, l.deserializeUnchecked)(Q, this, t);
    }
  }
  let Q = new Map(),
    tt = 1;
  class te extends X {
    constructor(t) {
      if ((super({}), (this._bn = void 0), void 0 !== t._bn)) this._bn = t._bn;
      else {
        if ("string" == typeof t) {
          let e = u.f.decode(t);
          if (32 != e.length) throw Error("Invalid public key input");
          this._bn = new a.default(e);
        } else this._bn = new a.default(t);
        if (this._bn.byteLength() > 32) throw Error("Invalid public key input");
      }
    }
    static unique() {
      let t = new te(tt);
      return ((tt += 1), new te(t.toBuffer()));
    }
    equals(t) {
      return this._bn.eq(t._bn);
    }
    toBase58() {
      return u.f.encode(this.toBytes());
    }
    toJSON() {
      return this.toBase58();
    }
    toBytes() {
      let t = this.toBuffer();
      return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
    }
    toBuffer() {
      let t = this._bn.toArrayLike(s.Buffer);
      if (32 === t.length) return t;
      let e = s.Buffer.alloc(32);
      return (t.copy(e, 32 - t.length), e);
    }
    get [Symbol.toStringTag]() {
      return `PublicKey(${this.toString()})`;
    }
    toString() {
      return this.toBase58();
    }
    static async createWithSeed(t, e, r) {
      let i = s.Buffer.concat([t.toBuffer(), s.Buffer.from(e), r.toBuffer()]);
      return new te((0, c.f)(i));
    }
    static createProgramAddressSync(t, e) {
      let r = s.Buffer.alloc(0);
      (t.forEach(function (t) {
        if (t.length > 32) throw TypeError("Max seed length exceeded");
        r = s.Buffer.concat([r, Z(t)]);
      }),
        (r = s.Buffer.concat([
          r,
          e.toBuffer(),
          s.Buffer.from("ProgramDerivedAddress"),
        ])));
      let i = (0, c.f)(r);
      if (J(i)) throw Error("Invalid seeds, address must fall off the curve");
      return new te(i);
    }
    static async createProgramAddress(t, e) {
      return this.createProgramAddressSync(t, e);
    }
    static findProgramAddressSync(t, e) {
      let r,
        i = 255;
      for (; 0 != i; ) {
        try {
          let n = t.concat(s.Buffer.from([i]));
          r = this.createProgramAddressSync(n, e);
        } catch (t) {
          if (t instanceof TypeError) throw t;
          i--;
          continue;
        }
        return [r, i];
      }
      throw Error("Unable to find a viable program address nonce");
    }
    static async findProgramAddress(t, e) {
      return this.findProgramAddressSync(t, e);
    }
    static isOnCurve(t) {
      return J(new te(t).toBytes());
    }
  }
  ((te.default = new te("11111111111111111111111111111111")),
    Q.set(te, { kind: "struct", fields: [["_bn", "u256"]] }));
  let tr = new te("BPFLoader1111111111111111111111111111111111");
  class ti extends Error {
    constructor(t) {
      (super(`Signature ${t} has expired: block height exceeded.`),
        (this.signature = void 0),
        (this.signature = t));
    }
  }
  Object.defineProperty(ti.prototype, "name", {
    value: "TransactionExpiredBlockheightExceededError",
  });
  class tn extends Error {
    constructor(t, e) {
      (super(
        `Transaction was not confirmed in ${e.toFixed(2)} seconds. It is unknown if it succeeded or failed. Check signature ${t} using the Solana Explorer or CLI tools.`,
      ),
        (this.signature = void 0),
        (this.signature = t));
    }
  }
  Object.defineProperty(tn.prototype, "name", {
    value: "TransactionExpiredTimeoutError",
  });
  class ts extends Error {
    constructor(t) {
      (super(`Signature ${t} has expired: the nonce is no longer valid.`),
        (this.signature = void 0),
        (this.signature = t));
    }
  }
  Object.defineProperty(ts.prototype, "name", {
    value: "TransactionExpiredNonceInvalidError",
  });
  class to {
    constructor(t, e) {
      ((this.staticAccountKeys = void 0),
        (this.accountKeysFromLookups = void 0),
        (this.staticAccountKeys = t),
        (this.accountKeysFromLookups = e));
    }
    keySegments() {
      let t = [this.staticAccountKeys];
      return (
        this.accountKeysFromLookups &&
          (t.push(this.accountKeysFromLookups.writable),
          t.push(this.accountKeysFromLookups.readonly)),
        t
      );
    }
    get(t) {
      for (let e of this.keySegments())
        if (t < e.length) return e[t];
        else t -= e.length;
    }
    get length() {
      return this.keySegments().flat().length;
    }
    compileInstructions(t) {
      if (this.length > 256)
        throw Error("Account index overflow encountered during compilation");
      let e = new Map();
      this.keySegments()
        .flat()
        .forEach((t, r) => {
          e.set(t.toBase58(), r);
        });
      let r = (t) => {
        let r = e.get(t.toBase58());
        if (void 0 === r)
          throw Error(
            "Encountered an unknown instruction account key during compilation",
          );
        return r;
      };
      return t.map((t) => ({
        programIdIndex: r(t.programId),
        accountKeyIndexes: t.keys.map((t) => r(t.pubkey)),
        data: t.data,
      }));
    }
  }
  let ta = (t = "publicKey") => h.blob(32, t),
    tu = (t = "string") => {
      let e = h.struct(
          [
            h.u32("length"),
            h.u32("lengthPadding"),
            h.blob(h.offset(h.u32(), -8), "chars"),
          ],
          t,
        ),
        r = e.decode.bind(e),
        i = e.encode.bind(e);
      return (
        (e.decode = (t, e) => r(t, e).chars.toString()),
        (e.encode = (t, e, r) => i({ chars: s.Buffer.from(t, "utf8") }, e, r)),
        (e.alloc = (t) =>
          h.u32().span + h.u32().span + s.Buffer.from(t, "utf8").length),
        e
      );
    };
  function tc(t) {
    let e = 0,
      r = 0;
    for (;;) {
      let i = t.shift();
      if (((e |= (127 & i) << (7 * r)), (r += 1), (128 & i) == 0)) break;
    }
    return e;
  }
  function tl(t, e) {
    let r = e;
    for (;;) {
      let e = 127 & r;
      if (0 == (r >>= 7)) {
        t.push(e);
        break;
      }
      ((e |= 128), t.push(e));
    }
  }
  function th(t, e) {
    if (!t) throw Error(e || "Assertion failed");
  }
  class tf {
    constructor(t, e) {
      ((this.payer = void 0),
        (this.keyMetaMap = void 0),
        (this.payer = t),
        (this.keyMetaMap = e));
    }
    static compile(t, e) {
      let r = new Map(),
        i = (t) => {
          let e = t.toBase58(),
            i = r.get(e);
          return (
            void 0 === i &&
              ((i = { isSigner: !1, isWritable: !1, isInvoked: !1 }),
              r.set(e, i)),
            i
          );
        },
        n = i(e);
      for (let e of ((n.isSigner = !0), (n.isWritable = !0), t))
        for (let t of ((i(e.programId).isInvoked = !0), e.keys)) {
          let e = i(t.pubkey);
          ((e.isSigner ||= t.isSigner), (e.isWritable ||= t.isWritable));
        }
      return new tf(e, r);
    }
    getMessageComponents() {
      let t = [...this.keyMetaMap.entries()];
      th(t.length <= 256, "Max static account keys length exceeded");
      let e = t.filter(([, t]) => t.isSigner && t.isWritable),
        r = t.filter(([, t]) => t.isSigner && !t.isWritable),
        i = t.filter(([, t]) => !t.isSigner && t.isWritable),
        n = t.filter(([, t]) => !t.isSigner && !t.isWritable),
        s = {
          numRequiredSignatures: e.length + r.length,
          numReadonlySignedAccounts: r.length,
          numReadonlyUnsignedAccounts: n.length,
        };
      {
        th(e.length > 0, "Expected at least one writable signer key");
        let [t] = e[0];
        th(
          t === this.payer.toBase58(),
          "Expected first writable signer key to be the fee payer",
        );
      }
      return [
        s,
        [
          ...e.map(([t]) => new te(t)),
          ...r.map(([t]) => new te(t)),
          ...i.map(([t]) => new te(t)),
          ...n.map(([t]) => new te(t)),
        ],
      ];
    }
    extractTableLookup(t) {
      let [e, r] = this.drainKeysFoundInLookupTable(
          t.state.addresses,
          (t) => !t.isSigner && !t.isInvoked && t.isWritable,
        ),
        [i, n] = this.drainKeysFoundInLookupTable(
          t.state.addresses,
          (t) => !t.isSigner && !t.isInvoked && !t.isWritable,
        );
      if (0 !== e.length || 0 !== i.length)
        return [
          { accountKey: t.key, writableIndexes: e, readonlyIndexes: i },
          { writable: r, readonly: n },
        ];
    }
    drainKeysFoundInLookupTable(t, e) {
      let r = [],
        i = [];
      for (let [n, s] of this.keyMetaMap.entries())
        if (e(s)) {
          let e = new te(n),
            s = t.findIndex((t) => t.equals(e));
          s >= 0 &&
            (th(s < 256, "Max lookup table index exceeded"),
            r.push(s),
            i.push(e),
            this.keyMetaMap.delete(n));
        }
      return [r, i];
    }
  }
  let td = "Reached end of buffer unexpectedly";
  function tp(t) {
    if (0 === t.length) throw Error(td);
    return t.shift();
  }
  function tg(t, ...e) {
    let [r] = e;
    if (2 === e.length ? r + (e[1] ?? 0) > t.length : r >= t.length)
      throw Error(td);
    return t.splice(...e);
  }
  class tm {
    constructor(t) {
      ((this.header = void 0),
        (this.accountKeys = void 0),
        (this.recentBlockhash = void 0),
        (this.instructions = void 0),
        (this.indexToProgramIds = new Map()),
        (this.header = t.header),
        (this.accountKeys = t.accountKeys.map((t) => new te(t))),
        (this.recentBlockhash = t.recentBlockhash),
        (this.instructions = t.instructions),
        this.instructions.forEach((t) =>
          this.indexToProgramIds.set(
            t.programIdIndex,
            this.accountKeys[t.programIdIndex],
          ),
        ));
    }
    get version() {
      return "legacy";
    }
    get staticAccountKeys() {
      return this.accountKeys;
    }
    get compiledInstructions() {
      return this.instructions.map((t) => ({
        programIdIndex: t.programIdIndex,
        accountKeyIndexes: t.accounts,
        data: u.f.decode(t.data),
      }));
    }
    get addressTableLookups() {
      return [];
    }
    getAccountKeys() {
      return new to(this.staticAccountKeys);
    }
    static compile(t) {
      let [e, r] = tf
          .compile(t.instructions, t.payerKey)
          .getMessageComponents(),
        i = new to(r)
          .compileInstructions(t.instructions)
          .map((t) => ({
            programIdIndex: t.programIdIndex,
            accounts: t.accountKeyIndexes,
            data: u.f.encode(t.data),
          }));
      return new tm({
        header: e,
        accountKeys: r,
        recentBlockhash: t.recentBlockhash,
        instructions: i,
      });
    }
    isAccountSigner(t) {
      return t < this.header.numRequiredSignatures;
    }
    isAccountWritable(t) {
      let e = this.header.numRequiredSignatures;
      if (!(t >= this.header.numRequiredSignatures))
        return t < e - this.header.numReadonlySignedAccounts;
      {
        let r =
          this.accountKeys.length - e - this.header.numReadonlyUnsignedAccounts;
        return t - e < r;
      }
    }
    isProgramId(t) {
      return this.indexToProgramIds.has(t);
    }
    programIds() {
      return [...this.indexToProgramIds.values()];
    }
    nonProgramIds() {
      return this.accountKeys.filter((t, e) => !this.isProgramId(e));
    }
    serialize() {
      let t = this.accountKeys.length,
        e = [];
      tl(e, t);
      let r = this.instructions.map((t) => {
          let { accounts: e, programIdIndex: r } = t,
            i = Array.from(u.f.decode(t.data)),
            n = [];
          tl(n, e.length);
          let o = [];
          return (
            tl(o, i.length),
            {
              programIdIndex: r,
              keyIndicesCount: s.Buffer.from(n),
              keyIndices: e,
              dataLength: s.Buffer.from(o),
              data: i,
            }
          );
        }),
        i = [];
      tl(i, r.length);
      let n = s.Buffer.alloc(1232);
      s.Buffer.from(i).copy(n);
      let o = i.length;
      (r.forEach((t) => {
        let e = h
          .struct([
            h.u8("programIdIndex"),
            h.blob(t.keyIndicesCount.length, "keyIndicesCount"),
            h.seq(h.u8("keyIndex"), t.keyIndices.length, "keyIndices"),
            h.blob(t.dataLength.length, "dataLength"),
            h.seq(h.u8("userdatum"), t.data.length, "data"),
          ])
          .encode(t, n, o);
        o += e;
      }),
        (n = n.slice(0, o)));
      let a = h.struct([
          h.blob(1, "numRequiredSignatures"),
          h.blob(1, "numReadonlySignedAccounts"),
          h.blob(1, "numReadonlyUnsignedAccounts"),
          h.blob(e.length, "keyCount"),
          h.seq(ta("key"), t, "keys"),
          ta("recentBlockhash"),
        ]),
        c = {
          numRequiredSignatures: s.Buffer.from([
            this.header.numRequiredSignatures,
          ]),
          numReadonlySignedAccounts: s.Buffer.from([
            this.header.numReadonlySignedAccounts,
          ]),
          numReadonlyUnsignedAccounts: s.Buffer.from([
            this.header.numReadonlyUnsignedAccounts,
          ]),
          keyCount: s.Buffer.from(e),
          keys: this.accountKeys.map((t) => Z(t.toBytes())),
          recentBlockhash: u.f.decode(this.recentBlockhash),
        },
        l = s.Buffer.alloc(2048),
        f = a.encode(c, l);
      return (n.copy(l, f), l.slice(0, f + n.length));
    }
    static from(t) {
      let e = [...t],
        r = tp(e);
      if (r !== (127 & r))
        throw Error(
          "Versioned messages must be deserialized with VersionedMessage.deserialize()",
        );
      let i = tp(e),
        n = tp(e),
        o = tc(e),
        a = [];
      for (let t = 0; t < o; t++) {
        let t = tg(e, 0, 32);
        a.push(new te(s.Buffer.from(t)));
      }
      let c = tg(e, 0, 32),
        l = tc(e),
        h = [];
      for (let t = 0; t < l; t++) {
        let t = tp(e),
          r = tc(e),
          i = tg(e, 0, r),
          n = tc(e),
          o = tg(e, 0, n),
          a = u.f.encode(s.Buffer.from(o));
        h.push({ programIdIndex: t, accounts: i, data: a });
      }
      return new tm({
        header: {
          numRequiredSignatures: r,
          numReadonlySignedAccounts: i,
          numReadonlyUnsignedAccounts: n,
        },
        recentBlockhash: u.f.encode(s.Buffer.from(c)),
        accountKeys: a,
        instructions: h,
      });
    }
  }
  class ty {
    constructor(t) {
      ((this.header = void 0),
        (this.staticAccountKeys = void 0),
        (this.recentBlockhash = void 0),
        (this.compiledInstructions = void 0),
        (this.addressTableLookups = void 0),
        (this.header = t.header),
        (this.staticAccountKeys = t.staticAccountKeys),
        (this.recentBlockhash = t.recentBlockhash),
        (this.compiledInstructions = t.compiledInstructions),
        (this.addressTableLookups = t.addressTableLookups));
    }
    get version() {
      return 0;
    }
    get numAccountKeysFromLookups() {
      let t = 0;
      for (let e of this.addressTableLookups)
        t += e.readonlyIndexes.length + e.writableIndexes.length;
      return t;
    }
    getAccountKeys(t) {
      let e;
      if (t && "accountKeysFromLookups" in t && t.accountKeysFromLookups) {
        if (
          this.numAccountKeysFromLookups !=
          t.accountKeysFromLookups.writable.length +
            t.accountKeysFromLookups.readonly.length
        )
          throw Error(
            "Failed to get account keys because of a mismatch in the number of account keys from lookups",
          );
        e = t.accountKeysFromLookups;
      } else if (
        t &&
        "addressLookupTableAccounts" in t &&
        t.addressLookupTableAccounts
      )
        e = this.resolveAddressTableLookups(t.addressLookupTableAccounts);
      else if (this.addressTableLookups.length > 0)
        throw Error(
          "Failed to get account keys because address table lookups were not resolved",
        );
      return new to(this.staticAccountKeys, e);
    }
    isAccountSigner(t) {
      return t < this.header.numRequiredSignatures;
    }
    isAccountWritable(t) {
      let e = this.header.numRequiredSignatures,
        r = this.staticAccountKeys.length;
      if (t >= r)
        return (
          t - r <
          this.addressTableLookups.reduce(
            (t, e) => t + e.writableIndexes.length,
            0,
          )
        );
      if (!(t >= this.header.numRequiredSignatures))
        return t < e - this.header.numReadonlySignedAccounts;
      {
        let i = r - e - this.header.numReadonlyUnsignedAccounts;
        return t - e < i;
      }
    }
    resolveAddressTableLookups(t) {
      let e = { writable: [], readonly: [] };
      for (let r of this.addressTableLookups) {
        let i = t.find((t) => t.key.equals(r.accountKey));
        if (!i)
          throw Error(
            `Failed to find address lookup table account for table key ${r.accountKey.toBase58()}`,
          );
        for (let t of r.writableIndexes)
          if (t < i.state.addresses.length)
            e.writable.push(i.state.addresses[t]);
          else
            throw Error(
              `Failed to find address for index ${t} in address lookup table ${r.accountKey.toBase58()}`,
            );
        for (let t of r.readonlyIndexes)
          if (t < i.state.addresses.length)
            e.readonly.push(i.state.addresses[t]);
          else
            throw Error(
              `Failed to find address for index ${t} in address lookup table ${r.accountKey.toBase58()}`,
            );
      }
      return e;
    }
    static compile(t) {
      let e = tf.compile(t.instructions, t.payerKey),
        r = [],
        i = { writable: [], readonly: [] };
      for (let n of t.addressLookupTableAccounts || []) {
        let t = e.extractTableLookup(n);
        if (void 0 !== t) {
          let [e, { writable: n, readonly: s }] = t;
          (r.push(e), i.writable.push(...n), i.readonly.push(...s));
        }
      }
      let [n, s] = e.getMessageComponents(),
        o = new to(s, i).compileInstructions(t.instructions);
      return new ty({
        header: n,
        staticAccountKeys: s,
        recentBlockhash: t.recentBlockhash,
        compiledInstructions: o,
        addressTableLookups: r,
      });
    }
    serialize() {
      let t = [];
      tl(t, this.staticAccountKeys.length);
      let e = this.serializeInstructions(),
        r = [];
      tl(r, this.compiledInstructions.length);
      let i = this.serializeAddressTableLookups(),
        n = [];
      tl(n, this.addressTableLookups.length);
      let s = h.struct([
          h.u8("prefix"),
          h.struct(
            [
              h.u8("numRequiredSignatures"),
              h.u8("numReadonlySignedAccounts"),
              h.u8("numReadonlyUnsignedAccounts"),
            ],
            "header",
          ),
          h.blob(t.length, "staticAccountKeysLength"),
          h.seq(ta(), this.staticAccountKeys.length, "staticAccountKeys"),
          ta("recentBlockhash"),
          h.blob(r.length, "instructionsLength"),
          h.blob(e.length, "serializedInstructions"),
          h.blob(n.length, "addressTableLookupsLength"),
          h.blob(i.length, "serializedAddressTableLookups"),
        ]),
        o = new Uint8Array(1232),
        a = s.encode(
          {
            prefix: 128,
            header: this.header,
            staticAccountKeysLength: new Uint8Array(t),
            staticAccountKeys: this.staticAccountKeys.map((t) => t.toBytes()),
            recentBlockhash: u.f.decode(this.recentBlockhash),
            instructionsLength: new Uint8Array(r),
            serializedInstructions: e,
            addressTableLookupsLength: new Uint8Array(n),
            serializedAddressTableLookups: i,
          },
          o,
        );
      return o.slice(0, a);
    }
    serializeInstructions() {
      let t = 0,
        e = new Uint8Array(1232);
      for (let r of this.compiledInstructions) {
        let i = [];
        tl(i, r.accountKeyIndexes.length);
        let n = [];
        tl(n, r.data.length);
        let s = h.struct([
          h.u8("programIdIndex"),
          h.blob(i.length, "encodedAccountKeyIndexesLength"),
          h.seq(h.u8(), r.accountKeyIndexes.length, "accountKeyIndexes"),
          h.blob(n.length, "encodedDataLength"),
          h.blob(r.data.length, "data"),
        ]);
        t += s.encode(
          {
            programIdIndex: r.programIdIndex,
            encodedAccountKeyIndexesLength: new Uint8Array(i),
            accountKeyIndexes: r.accountKeyIndexes,
            encodedDataLength: new Uint8Array(n),
            data: r.data,
          },
          e,
          t,
        );
      }
      return e.slice(0, t);
    }
    serializeAddressTableLookups() {
      let t = 0,
        e = new Uint8Array(1232);
      for (let r of this.addressTableLookups) {
        let i = [];
        tl(i, r.writableIndexes.length);
        let n = [];
        tl(n, r.readonlyIndexes.length);
        let s = h.struct([
          ta("accountKey"),
          h.blob(i.length, "encodedWritableIndexesLength"),
          h.seq(h.u8(), r.writableIndexes.length, "writableIndexes"),
          h.blob(n.length, "encodedReadonlyIndexesLength"),
          h.seq(h.u8(), r.readonlyIndexes.length, "readonlyIndexes"),
        ]);
        t += s.encode(
          {
            accountKey: r.accountKey.toBytes(),
            encodedWritableIndexesLength: new Uint8Array(i),
            writableIndexes: r.writableIndexes,
            encodedReadonlyIndexesLength: new Uint8Array(n),
            readonlyIndexes: r.readonlyIndexes,
          },
          e,
          t,
        );
      }
      return e.slice(0, t);
    }
    static deserialize(t) {
      let e = [...t],
        r = tp(e),
        i = 127 & r;
      (th(r !== i, "Expected versioned message but received legacy message"),
        th(
          0 === i,
          `Expected versioned message with version 0 but found version ${i}`,
        ));
      let n = {
          numRequiredSignatures: tp(e),
          numReadonlySignedAccounts: tp(e),
          numReadonlyUnsignedAccounts: tp(e),
        },
        s = [],
        o = tc(e);
      for (let t = 0; t < o; t++) s.push(new te(tg(e, 0, 32)));
      let a = u.f.encode(tg(e, 0, 32)),
        c = tc(e),
        l = [];
      for (let t = 0; t < c; t++) {
        let t = tp(e),
          r = tc(e),
          i = tg(e, 0, r),
          n = tc(e),
          s = new Uint8Array(tg(e, 0, n));
        l.push({ programIdIndex: t, accountKeyIndexes: i, data: s });
      }
      let h = tc(e),
        f = [];
      for (let t = 0; t < h; t++) {
        let t = new te(tg(e, 0, 32)),
          r = tc(e),
          i = tg(e, 0, r),
          n = tc(e),
          s = tg(e, 0, n);
        f.push({ accountKey: t, writableIndexes: i, readonlyIndexes: s });
      }
      return new ty({
        header: n,
        staticAccountKeys: s,
        recentBlockhash: a,
        compiledInstructions: l,
        addressTableLookups: f,
      });
    }
  }
  function tb(t) {
    let e = tg(t, 0, 4);
    return e[0] + 256 * e[1] + 65536 * e[2] + 0x1000000 * e[3];
  }
  class tw {
    constructor(t) {
      ((this.header = void 0),
        (this.staticAccountKeys = void 0),
        (this.recentBlockhash = void 0),
        (this.compiledInstructions = void 0),
        (this.transactionConfig = void 0),
        (this.header = t.header),
        (this.staticAccountKeys = t.staticAccountKeys),
        (this.recentBlockhash = t.recentBlockhash),
        (this.compiledInstructions = t.compiledInstructions),
        (this.transactionConfig = t.transactionConfig ?? {
          computeUnitLimit: null,
          heapSize: null,
          loadedAccountsDataSizeLimit: null,
          priorityFee: null,
        }));
    }
    get version() {
      return 1;
    }
    get addressTableLookups() {
      return [];
    }
    getAccountKeys() {
      return new to(this.staticAccountKeys);
    }
    isAccountSigner(t) {
      return t < this.header.numRequiredSignatures;
    }
    isAccountWritable(t) {
      let e = this.header.numRequiredSignatures,
        r = this.staticAccountKeys.length;
      if (t >= r) return !1;
      if (!(t >= this.header.numRequiredSignatures))
        return t < e - this.header.numReadonlySignedAccounts;
      {
        let i = r - e - this.header.numReadonlyUnsignedAccounts;
        return t - e < i;
      }
    }
    serialize() {
      if (this._serializedBytes) return this._serializedBytes;
      throw Error(
        "Serialization of version 1 transaction messages is not supported",
      );
    }
    static deserialize(t) {
      let e = [...t],
        r = tp(e),
        i = 127 & r;
      (th(r !== i, "Expected versioned message but received legacy message"),
        th(
          1 === i,
          `Expected versioned message with version 1 but found version ${i}`,
        ));
      let n = {
          numRequiredSignatures: tp(e),
          numReadonlySignedAccounts: tp(e),
          numReadonlyUnsignedAccounts: tp(e),
        },
        o = tb(e);
      th((-32 & o) == 0, "Unexpected bits set in the transaction config mask");
      let a = 3 & o;
      th(
        0 === a || 3 === a,
        "Expected both or neither of the priority fee bits to be set in the transaction config mask",
      );
      let c = u.f.encode(tg(e, 0, 32)),
        l = tp(e),
        h = tp(e),
        f = [];
      for (let t = 0; t < h; t++) f.push(new te(tg(e, 0, 32)));
      let d = {
        computeUnitLimit: null,
        heapSize: null,
        loadedAccountsDataSizeLimit: null,
        priorityFee: null,
      };
      (0 !== a &&
        (d.priorityFee = (function (t) {
          let e = tg(t, 0, 8),
            r = BigInt(0);
          for (let t = e.length - 1; t >= 0; t--)
            r = (r << BigInt(8)) | BigInt(e[t]);
          return (
            th(
              r <= BigInt(Number.MAX_SAFE_INTEGER),
              "Expected u64 value to be within the safe integer range",
            ),
            Number(r)
          );
        })(e)),
        4 & o && (d.computeUnitLimit = tb(e)),
        8 & o && (d.loadedAccountsDataSizeLimit = tb(e)),
        16 & o && (d.heapSize = tb(e)));
      let p = [];
      for (let t = 0; t < l; t++) {
        let t = tp(e),
          r = tp(e),
          i = tp(e) + 256 * tp(e);
        p.push({
          accountKeyIndexesLength: r,
          dataLength: i,
          programIdIndex: t,
        });
      }
      let g = [];
      for (let t of p)
        g.push({
          programIdIndex: t.programIdIndex,
          accountKeyIndexes: tg(e, 0, t.accountKeyIndexesLength),
          data: new Uint8Array(tg(e, 0, t.dataLength)),
        });
      th(
        0 === e.length,
        "Expected no bytes to remain after deserializing a version 1 message",
      );
      let m = new tw({
        header: n,
        staticAccountKeys: f,
        recentBlockhash: c,
        compiledInstructions: g,
        transactionConfig: d,
      });
      return ((m._serializedBytes = s.Buffer.from(t)), m);
    }
  }
  let tk = {
      deserializeMessageVersion(t) {
        let e = t[0],
          r = 127 & e;
        return r === e ? "legacy" : r;
      },
      deserialize: (t) => {
        let e = tk.deserializeMessageVersion(t);
        if ("legacy" === e) return tm.from(t);
        if (0 === e) return ty.deserialize(t);
        if (1 === e) return tw.deserialize(t);
        throw Error(
          `Transaction message version ${e} deserialization is not supported`,
        );
      },
    },
    tv =
      (((e = {})[(e.BLOCKHEIGHT_EXCEEDED = 0)] = "BLOCKHEIGHT_EXCEEDED"),
      (e[(e.PROCESSED = 1)] = "PROCESSED"),
      (e[(e.TIMED_OUT = 2)] = "TIMED_OUT"),
      (e[(e.NONCE_INVALID = 3)] = "NONCE_INVALID"),
      e),
    tS = s.Buffer.alloc(64).fill(0);
  class t_ {
    constructor(t) {
      ((this.keys = void 0),
        (this.programId = void 0),
        (this.data = s.Buffer.alloc(0)),
        (this.programId = t.programId),
        (this.keys = t.keys),
        t.data && (this.data = t.data));
    }
    toJSON() {
      return {
        keys: this.keys.map(({ pubkey: t, isSigner: e, isWritable: r }) => ({
          pubkey: t.toJSON(),
          isSigner: e,
          isWritable: r,
        })),
        programId: this.programId.toJSON(),
        data: [...this.data],
      };
    }
  }
  class tI {
    get signature() {
      return this.signatures.length > 0 ? this.signatures[0].signature : null;
    }
    constructor(t) {
      if (
        ((this.signatures = []),
        (this.feePayer = void 0),
        (this.instructions = []),
        (this.recentBlockhash = void 0),
        (this.lastValidBlockHeight = void 0),
        (this.nonceInfo = void 0),
        (this.minNonceContextSlot = void 0),
        (this._message = void 0),
        (this._json = void 0),
        !t)
      )
        return;
      if (
        (t.feePayer && (this.feePayer = t.feePayer),
        t.signatures && (this.signatures = t.signatures),
        Object.prototype.hasOwnProperty.call(t, "nonceInfo"))
      ) {
        let { minContextSlot: e, nonceInfo: r } = t;
        ((this.minNonceContextSlot = e), (this.nonceInfo = r));
      } else if (
        Object.prototype.hasOwnProperty.call(t, "lastValidBlockHeight")
      ) {
        let { blockhash: e, lastValidBlockHeight: r } = t;
        ((this.recentBlockhash = e), (this.lastValidBlockHeight = r));
      } else {
        let { recentBlockhash: e, nonceInfo: r } = t;
        (r && (this.nonceInfo = r), (this.recentBlockhash = e));
      }
    }
    toJSON() {
      return {
        recentBlockhash: this.recentBlockhash || null,
        feePayer: this.feePayer ? this.feePayer.toJSON() : null,
        nonceInfo: this.nonceInfo
          ? {
              nonce: this.nonceInfo.nonce,
              nonceInstruction: this.nonceInfo.nonceInstruction.toJSON(),
            }
          : null,
        instructions: this.instructions.map((t) => t.toJSON()),
        signers: this.signatures.map(({ publicKey: t }) => t.toJSON()),
      };
    }
    add(...t) {
      if (0 === t.length) throw Error("No instructions");
      return (
        t.forEach((t) => {
          "instructions" in t
            ? (this.instructions = this.instructions.concat(t.instructions))
            : "data" in t && "programId" in t && "keys" in t
              ? this.instructions.push(t)
              : this.instructions.push(new t_(t));
        }),
        this
      );
    }
    compileMessage() {
      let t, e, r;
      if (
        this._message &&
        JSON.stringify(this.toJSON()) === JSON.stringify(this._json)
      )
        return this._message;
      if (
        (this.nonceInfo
          ? ((t = this.nonceInfo.nonce),
            (e =
              this.instructions[0] != this.nonceInfo.nonceInstruction
                ? [this.nonceInfo.nonceInstruction, ...this.instructions]
                : this.instructions))
          : ((t = this.recentBlockhash), (e = this.instructions)),
        !t)
      )
        throw Error("Transaction recentBlockhash required");
      if (
        (e.length < 1 && console.warn("No instructions provided"),
        this.feePayer)
      )
        r = this.feePayer;
      else if (this.signatures.length > 0 && this.signatures[0].publicKey)
        r = this.signatures[0].publicKey;
      else throw Error("Transaction fee payer required");
      for (let t = 0; t < e.length; t++)
        if (void 0 === e[t].programId)
          throw Error(
            `Transaction instruction index ${t} has undefined program id`,
          );
      let i = [],
        n = [];
      (e.forEach((t) => {
        t.keys.forEach((t) => {
          n.push({ ...t });
        });
        let e = t.programId.toString();
        i.includes(e) || i.push(e);
      }),
        i.forEach((t) => {
          n.push({ pubkey: new te(t), isSigner: !1, isWritable: !1 });
        }));
      let s = [];
      (n.forEach((t) => {
        let e = t.pubkey.toString(),
          r = s.findIndex((t) => t.pubkey.toString() === e);
        r > -1
          ? ((s[r].isWritable = s[r].isWritable || t.isWritable),
            (s[r].isSigner = s[r].isSigner || t.isSigner))
          : s.push(t);
      }),
        s.sort(function (t, e) {
          return t.isSigner !== e.isSigner
            ? t.isSigner
              ? -1
              : 1
            : t.isWritable !== e.isWritable
              ? t.isWritable
                ? -1
                : 1
              : t.pubkey
                  .toBase58()
                  .localeCompare(e.pubkey.toBase58(), "en", {
                    localeMatcher: "best fit",
                    usage: "sort",
                    sensitivity: "variant",
                    ignorePunctuation: !1,
                    numeric: !1,
                    caseFirst: "lower",
                  });
        }));
      let o = s.findIndex((t) => t.pubkey.equals(r));
      if (o > -1) {
        let [t] = s.splice(o, 1);
        ((t.isSigner = !0), (t.isWritable = !0), s.unshift(t));
      } else s.unshift({ pubkey: r, isSigner: !0, isWritable: !0 });
      for (let t of this.signatures) {
        let e = s.findIndex((e) => e.pubkey.equals(t.publicKey));
        if (e > -1)
          s[e].isSigner ||
            ((s[e].isSigner = !0),
            console.warn(
              "Transaction references a signature that is unnecessary, only the fee payer and instruction signer accounts should sign a transaction. This behavior is deprecated and will throw an error in the next major version release.",
            ));
        else throw Error(`unknown signer: ${t.publicKey.toString()}`);
      }
      let a = 0,
        c = 0,
        l = 0,
        h = [],
        f = [];
      s.forEach(({ pubkey: t, isSigner: e, isWritable: r }) => {
        e
          ? (h.push(t.toString()), (a += 1), r || (c += 1))
          : (f.push(t.toString()), r || (l += 1));
      });
      let d = h.concat(f),
        p = e.map((t) => {
          let { data: e, programId: r } = t;
          return {
            programIdIndex: d.indexOf(r.toString()),
            accounts: t.keys.map((t) => d.indexOf(t.pubkey.toString())),
            data: u.f.encode(e),
          };
        });
      return (
        p.forEach((t) => {
          (th(t.programIdIndex >= 0), t.accounts.forEach((t) => th(t >= 0)));
        }),
        new tm({
          header: {
            numRequiredSignatures: a,
            numReadonlySignedAccounts: c,
            numReadonlyUnsignedAccounts: l,
          },
          accountKeys: d,
          recentBlockhash: t,
          instructions: p,
        })
      );
    }
    _compile() {
      let t = this.compileMessage(),
        e = t.accountKeys.slice(0, t.header.numRequiredSignatures);
      return this.signatures.length === e.length &&
        this.signatures.every((t, r) => e[r].equals(t.publicKey))
        ? t
        : ((this.signatures = e.map((t) => ({
            signature: null,
            publicKey: t,
          }))),
          t);
    }
    serializeMessage() {
      return this._compile().serialize();
    }
    async getEstimatedFee(t) {
      return (await t.getFeeForMessage(this.compileMessage())).value;
    }
    setSigners(...t) {
      if (0 === t.length) throw Error("No signers");
      let e = new Set();
      this.signatures = t
        .filter((t) => {
          let r = t.toString();
          return !e.has(r) && (e.add(r), !0);
        })
        .map((t) => ({ signature: null, publicKey: t }));
    }
    sign(...t) {
      if (0 === t.length) throw Error("No signers");
      let e = new Set(),
        r = [];
      for (let i of t) {
        let t = i.publicKey.toString();
        e.has(t) || (e.add(t), r.push(i));
      }
      this.signatures = r.map((t) => ({
        signature: null,
        publicKey: t.publicKey,
      }));
      let i = this._compile();
      this._partialSign(i, ...r);
    }
    partialSign(...t) {
      if (0 === t.length) throw Error("No signers");
      let e = new Set(),
        r = [];
      for (let i of t) {
        let t = i.publicKey.toString();
        e.has(t) || (e.add(t), r.push(i));
      }
      let i = this._compile();
      this._partialSign(i, ...r);
    }
    _partialSign(t, ...e) {
      let r = t.serialize();
      e.forEach((t) => {
        let e = G(r, t.secretKey);
        this._addSignature(t.publicKey, Z(e));
      });
    }
    addSignature(t, e) {
      (this._compile(), this._addSignature(t, e));
    }
    _addSignature(t, e) {
      th(64 === e.length);
      let r = this.signatures.findIndex((e) => t.equals(e.publicKey));
      if (r < 0) throw Error(`unknown signer: ${t.toString()}`);
      this.signatures[r].signature = s.Buffer.from(e);
    }
    verifySignatures(t = !0) {
      return !this._getMessageSignednessErrors(this.serializeMessage(), t);
    }
    _getMessageSignednessErrors(t, e) {
      let r = {};
      for (let { signature: i, publicKey: n } of this.signatures)
        null === i
          ? e && (r.missing ||= []).push(n)
          : Y(i, t, n.toBytes()) || (r.invalid ||= []).push(n);
      return r.invalid || r.missing ? r : void 0;
    }
    serialize(t) {
      let { requireAllSignatures: e, verifySignatures: r } = Object.assign(
          { requireAllSignatures: !0, verifySignatures: !0 },
          t,
        ),
        i = this.serializeMessage();
      if (r) {
        let t = this._getMessageSignednessErrors(i, e);
        if (t) {
          let e = "Signature verification failed.";
          throw (
            t.invalid &&
              (e += `
Invalid signature for public key${1 === t.invalid.length ? "" : "(s)"} [\`${t.invalid.map((t) => t.toBase58()).join("`, `")}\`].`),
            t.missing &&
              (e += `
Missing signature for public key${1 === t.missing.length ? "" : "(s)"} [\`${t.missing.map((t) => t.toBase58()).join("`, `")}\`].`),
            Error(e)
          );
        }
      }
      return this._serialize(i);
    }
    _serialize(t) {
      let { signatures: e } = this,
        r = [];
      tl(r, e.length);
      let i = r.length + 64 * e.length + t.length,
        n = s.Buffer.alloc(i);
      return (
        th(e.length < 256),
        s.Buffer.from(r).copy(n, 0),
        e.forEach(({ signature: t }, e) => {
          null !== t &&
            (th(64 === t.length, "signature has invalid length"),
            s.Buffer.from(t).copy(n, r.length + 64 * e));
        }),
        t.copy(n, r.length + 64 * e.length),
        th(n.length <= 1232, `Transaction too large: ${n.length} > 1232`),
        n
      );
    }
    get keys() {
      return (
        th(1 === this.instructions.length),
        this.instructions[0].keys.map((t) => t.pubkey)
      );
    }
    get programId() {
      return (
        th(1 === this.instructions.length),
        this.instructions[0].programId
      );
    }
    get data() {
      return (th(1 === this.instructions.length), this.instructions[0].data);
    }
    static from(t) {
      let e = [...t],
        r = tc(e),
        i = [];
      for (let t = 0; t < r; t++) {
        let t = tg(e, 0, 64);
        i.push(u.f.encode(s.Buffer.from(t)));
      }
      return tI.populate(tm.from(e), i);
    }
    static populate(t, e = []) {
      let r = new tI();
      return (
        (r.recentBlockhash = t.recentBlockhash),
        t.header.numRequiredSignatures > 0 && (r.feePayer = t.accountKeys[0]),
        e.forEach((e, i) => {
          let n = {
            signature: e == u.f.encode(tS) ? null : u.f.decode(e),
            publicKey: t.accountKeys[i],
          };
          r.signatures.push(n);
        }),
        t.instructions.forEach((e) => {
          let i = e.accounts.map((e) => {
            let i = t.accountKeys[e];
            return {
              pubkey: i,
              isSigner:
                r.signatures.some(
                  (t) => t.publicKey.toString() === i.toString(),
                ) || t.isAccountSigner(e),
              isWritable: t.isAccountWritable(e),
            };
          });
          r.instructions.push(
            new t_({
              keys: i,
              programId: t.accountKeys[e.programIdIndex],
              data: u.f.decode(e.data),
            }),
          );
        }),
        (r._message = t),
        (r._json = r.toJSON()),
        r
      );
    }
  }
  let tA = new te("SysvarC1ock11111111111111111111111111111111"),
    tE = new te("SysvarEpochSchedu1e111111111111111111111111"),
    tx = new te("Sysvar1nstructions1111111111111111111111111"),
    tB = new te("SysvarRecentB1ockHashes11111111111111111111"),
    tM = new te("SysvarRent111111111111111111111111111111111"),
    tP = new te("SysvarRewards111111111111111111111111111111"),
    tT = new te("SysvarS1otHashes111111111111111111111111111"),
    tR = new te("SysvarS1otHistory11111111111111111111111111"),
    tL = new te("SysvarStakeHistory1111111111111111111111111");
  class tC extends Error {
    constructor({ action: t, signature: e, transactionMessage: r, logs: i }) {
      let n,
        s = i
          ? `Logs: 
${JSON.stringify(i.slice(-10), null, 2)}. `
          : "",
        o =
          "\nCatch the `SendTransactionError` and call `getLogs()` on it for full details.";
      switch (t) {
        case "send":
          n =
            `Transaction ${e} resulted in an error. 
${r}. ` +
            s +
            o;
          break;
        case "simulate":
          n =
            `Simulation failed. 
Message: ${r}. 
` +
            s +
            o;
          break;
        default:
          n = `Unknown action '${t}'`;
      }
      (super(n),
        (this.signature = void 0),
        (this.transactionMessage = void 0),
        (this.transactionLogs = void 0),
        (this.signature = e),
        (this.transactionMessage = r),
        (this.transactionLogs = i || void 0));
    }
    get transactionError() {
      return {
        message: this.transactionMessage,
        logs: Array.isArray(this.transactionLogs)
          ? this.transactionLogs
          : void 0,
      };
    }
    get logs() {
      let t = this.transactionLogs;
      if (null == t || "object" != typeof t || !("then" in t)) return t;
    }
    async getLogs(t) {
      return (
        Array.isArray(this.transactionLogs) ||
          (this.transactionLogs = new Promise((e, r) => {
            t.getTransaction(this.signature)
              .then((t) => {
                if (t && t.meta && t.meta.logMessages) {
                  let r = t.meta.logMessages;
                  ((this.transactionLogs = r), e(r));
                } else r(Error("Log messages not found"));
              })
              .catch(r);
          })),
        await this.transactionLogs
      );
    }
  }
  class tO extends Error {
    constructor({ code: t, message: e, data: r }, i) {
      (super(null != i ? `${i}: ${e}` : e),
        (this.code = void 0),
        (this.data = void 0),
        (this.code = t),
        (this.data = r),
        (this.name = "SolanaJSONRPCError"));
    }
  }
  async function tU(t, e, r, i) {
    let n,
      s = i && {
        skipPreflight: i.skipPreflight,
        preflightCommitment: i.preflightCommitment || i.commitment,
        maxRetries: i.maxRetries,
        minContextSlot: i.minContextSlot,
      },
      o = await t.sendTransaction(e, r, s);
    if (null != e.recentBlockhash && null != e.lastValidBlockHeight)
      n = (
        await t.confirmTransaction(
          {
            abortSignal: i?.abortSignal,
            signature: o,
            blockhash: e.recentBlockhash,
            lastValidBlockHeight: e.lastValidBlockHeight,
          },
          i && i.commitment,
        )
      ).value;
    else if (null != e.minNonceContextSlot && null != e.nonceInfo) {
      let { nonceInstruction: r } = e.nonceInfo,
        s = r.keys[0].pubkey;
      n = (
        await t.confirmTransaction(
          {
            abortSignal: i?.abortSignal,
            minContextSlot: e.minNonceContextSlot,
            nonceAccountPubkey: s,
            nonceValue: e.nonceInfo.nonce,
            signature: o,
          },
          i && i.commitment,
        )
      ).value;
    } else
      (i?.abortSignal != null &&
        console.warn(
          "sendAndConfirmTransaction(): A transaction with a deprecated confirmation strategy was supplied along with an `abortSignal`. Only transactions having `lastValidBlockHeight` or a combination of `nonceInfo` and `minNonceContextSlot` are abortable.",
        ),
        (n = (await t.confirmTransaction(o, i && i.commitment)).value));
    if (n.err) {
      if (null != o)
        throw new tC({
          action: "send",
          signature: o,
          transactionMessage: `Status: (${JSON.stringify(n)})`,
        });
      throw Error(`Transaction ${o} failed (${JSON.stringify(n)})`);
    }
    return o;
  }
  function tN(t) {
    return new Promise((e) => setTimeout(e, t));
  }
  function tz(t, e) {
    let r =
        t.layout.span >= 0
          ? t.layout.span
          : (function t(e, r) {
              let i = (e) => {
                  if (e.span >= 0) return e.span;
                  if ("function" == typeof e.alloc)
                    return e.alloc(r[e.property]);
                  if ("count" in e && "elementLayout" in e) {
                    let t = r[e.property];
                    if (Array.isArray(t)) return t.length * i(e.elementLayout);
                  } else if ("fields" in e)
                    return t({ layout: e }, r[e.property]);
                  return 0;
                },
                n = 0;
              return (
                e.layout.fields.forEach((t) => {
                  n += i(t);
                }),
                n
              );
            })(t, e),
      i = s.Buffer.alloc(r),
      n = Object.assign({ instruction: t.index }, e);
    return (t.layout.encode(n, i), i);
  }
  function tW(t, e) {
    let r;
    try {
      r = t.layout.decode(e);
    } catch (t) {
      throw Error("invalid instruction; " + t);
    }
    if (r.instruction !== t.index)
      throw Error(
        `invalid instruction; instruction index mismatch ${r.instruction} != ${t.index}`,
      );
    return r;
  }
  let tK = h.nu64("lamportsPerSignature"),
    tq = h.struct([
      h.u32("version"),
      h.u32("state"),
      ta("authorizedPubkey"),
      ta("nonce"),
      h.struct([tK], "feeCalculator"),
    ]),
    tD = tq.span;
  class t$ {
    constructor(t) {
      ((this.authorizedPubkey = void 0),
        (this.nonce = void 0),
        (this.feeCalculator = void 0),
        (this.authorizedPubkey = t.authorizedPubkey),
        (this.nonce = t.nonce),
        (this.feeCalculator = t.feeCalculator));
    }
    static fromAccountData(t) {
      let e = tq.decode(Z(t), 0);
      return new t$({
        authorizedPubkey: new te(e.authorizedPubkey),
        nonce: new te(e.nonce).toString(),
        feeCalculator: e.feeCalculator,
      });
    }
  }
  function tF(t) {
    let e = (0, h.blob)(8, t),
      r = e.decode.bind(e),
      i = e.encode.bind(e),
      n = (0, f.w)();
    return (
      (e.decode = (t, e) => {
        let i = r(t, e);
        return n.decode(i);
      }),
      (e.encode = (t, e, r) => i(n.encode(t), e, r)),
      e
    );
  }
  let tV = Object.freeze({
    Create: {
      index: 0,
      layout: h.struct([
        h.u32("instruction"),
        h.ns64("lamports"),
        h.ns64("space"),
        ta("programId"),
      ]),
    },
    Assign: {
      index: 1,
      layout: h.struct([h.u32("instruction"), ta("programId")]),
    },
    Transfer: {
      index: 2,
      layout: h.struct([h.u32("instruction"), tF("lamports")]),
    },
    CreateWithSeed: {
      index: 3,
      layout: h.struct([
        h.u32("instruction"),
        ta("base"),
        tu("seed"),
        h.ns64("lamports"),
        h.ns64("space"),
        ta("programId"),
      ]),
    },
    AdvanceNonceAccount: { index: 4, layout: h.struct([h.u32("instruction")]) },
    WithdrawNonceAccount: {
      index: 5,
      layout: h.struct([h.u32("instruction"), h.ns64("lamports")]),
    },
    InitializeNonceAccount: {
      index: 6,
      layout: h.struct([h.u32("instruction"), ta("authorized")]),
    },
    AuthorizeNonceAccount: {
      index: 7,
      layout: h.struct([h.u32("instruction"), ta("authorized")]),
    },
    Allocate: {
      index: 8,
      layout: h.struct([h.u32("instruction"), h.ns64("space")]),
    },
    AllocateWithSeed: {
      index: 9,
      layout: h.struct([
        h.u32("instruction"),
        ta("base"),
        tu("seed"),
        h.ns64("space"),
        ta("programId"),
      ]),
    },
    AssignWithSeed: {
      index: 10,
      layout: h.struct([
        h.u32("instruction"),
        ta("base"),
        tu("seed"),
        ta("programId"),
      ]),
    },
    TransferWithSeed: {
      index: 11,
      layout: h.struct([
        h.u32("instruction"),
        tF("lamports"),
        tu("seed"),
        ta("programId"),
      ]),
    },
    UpgradeNonceAccount: {
      index: 12,
      layout: h.struct([h.u32("instruction")]),
    },
  });
  class tj {
    static createAccount(t) {
      let e = tz(tV.Create, {
        lamports: t.lamports,
        space: t.space,
        programId: Z(t.programId.toBuffer()),
      });
      return new t_({
        keys: [
          { pubkey: t.fromPubkey, isSigner: !0, isWritable: !0 },
          { pubkey: t.newAccountPubkey, isSigner: !0, isWritable: !0 },
        ],
        programId: this.programId,
        data: e,
      });
    }
    static transfer(t) {
      let e, r;
      return (
        "basePubkey" in t
          ? ((e = tz(tV.TransferWithSeed, {
              lamports: BigInt(t.lamports),
              seed: t.seed,
              programId: Z(t.programId.toBuffer()),
            })),
            (r = [
              { pubkey: t.fromPubkey, isSigner: !1, isWritable: !0 },
              { pubkey: t.basePubkey, isSigner: !0, isWritable: !1 },
              { pubkey: t.toPubkey, isSigner: !1, isWritable: !0 },
            ]))
          : ((e = tz(tV.Transfer, { lamports: BigInt(t.lamports) })),
            (r = [
              { pubkey: t.fromPubkey, isSigner: !0, isWritable: !0 },
              { pubkey: t.toPubkey, isSigner: !1, isWritable: !0 },
            ])),
        new t_({ keys: r, programId: this.programId, data: e })
      );
    }
    static assign(t) {
      let e, r;
      return (
        "basePubkey" in t
          ? ((e = tz(tV.AssignWithSeed, {
              base: Z(t.basePubkey.toBuffer()),
              seed: t.seed,
              programId: Z(t.programId.toBuffer()),
            })),
            (r = [
              { pubkey: t.accountPubkey, isSigner: !1, isWritable: !0 },
              { pubkey: t.basePubkey, isSigner: !0, isWritable: !1 },
            ]))
          : ((e = tz(tV.Assign, { programId: Z(t.programId.toBuffer()) })),
            (r = [{ pubkey: t.accountPubkey, isSigner: !0, isWritable: !0 }])),
        new t_({ keys: r, programId: this.programId, data: e })
      );
    }
    static createAccountWithSeed(t) {
      let e = tz(tV.CreateWithSeed, {
          base: Z(t.basePubkey.toBuffer()),
          seed: t.seed,
          lamports: t.lamports,
          space: t.space,
          programId: Z(t.programId.toBuffer()),
        }),
        r = [
          { pubkey: t.fromPubkey, isSigner: !0, isWritable: !0 },
          { pubkey: t.newAccountPubkey, isSigner: !1, isWritable: !0 },
        ];
      return (
        t.basePubkey.equals(t.fromPubkey) ||
          r.push({ pubkey: t.basePubkey, isSigner: !0, isWritable: !1 }),
        new t_({ keys: r, programId: this.programId, data: e })
      );
    }
    static createNonceAccount(t) {
      let e = new tI();
      "basePubkey" in t && "seed" in t
        ? e.add(
            tj.createAccountWithSeed({
              fromPubkey: t.fromPubkey,
              newAccountPubkey: t.noncePubkey,
              basePubkey: t.basePubkey,
              seed: t.seed,
              lamports: t.lamports,
              space: tD,
              programId: this.programId,
            }),
          )
        : e.add(
            tj.createAccount({
              fromPubkey: t.fromPubkey,
              newAccountPubkey: t.noncePubkey,
              lamports: t.lamports,
              space: tD,
              programId: this.programId,
            }),
          );
      let r = {
        noncePubkey: t.noncePubkey,
        authorizedPubkey: t.authorizedPubkey,
      };
      return (e.add(this.nonceInitialize(r)), e);
    }
    static nonceInitialize(t) {
      let e = tz(tV.InitializeNonceAccount, {
        authorized: Z(t.authorizedPubkey.toBuffer()),
      });
      return new t_({
        keys: [
          { pubkey: t.noncePubkey, isSigner: !1, isWritable: !0 },
          { pubkey: tB, isSigner: !1, isWritable: !1 },
          { pubkey: tM, isSigner: !1, isWritable: !1 },
        ],
        programId: this.programId,
        data: e,
      });
    }
    static nonceAdvance(t) {
      let e = tz(tV.AdvanceNonceAccount);
      return new t_({
        keys: [
          { pubkey: t.noncePubkey, isSigner: !1, isWritable: !0 },
          { pubkey: tB, isSigner: !1, isWritable: !1 },
          { pubkey: t.authorizedPubkey, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: e,
      });
    }
    static nonceWithdraw(t) {
      let e = tz(tV.WithdrawNonceAccount, { lamports: t.lamports });
      return new t_({
        keys: [
          { pubkey: t.noncePubkey, isSigner: !1, isWritable: !0 },
          { pubkey: t.toPubkey, isSigner: !1, isWritable: !0 },
          { pubkey: tB, isSigner: !1, isWritable: !1 },
          { pubkey: tM, isSigner: !1, isWritable: !1 },
          { pubkey: t.authorizedPubkey, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: e,
      });
    }
    static nonceAuthorize(t) {
      let e = tz(tV.AuthorizeNonceAccount, {
        authorized: Z(t.newAuthorizedPubkey.toBuffer()),
      });
      return new t_({
        keys: [
          { pubkey: t.noncePubkey, isSigner: !1, isWritable: !0 },
          { pubkey: t.authorizedPubkey, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: e,
      });
    }
    static allocate(t) {
      let e, r;
      return (
        "basePubkey" in t
          ? ((e = tz(tV.AllocateWithSeed, {
              base: Z(t.basePubkey.toBuffer()),
              seed: t.seed,
              space: t.space,
              programId: Z(t.programId.toBuffer()),
            })),
            (r = [
              { pubkey: t.accountPubkey, isSigner: !1, isWritable: !0 },
              { pubkey: t.basePubkey, isSigner: !0, isWritable: !1 },
            ]))
          : ((e = tz(tV.Allocate, { space: t.space })),
            (r = [{ pubkey: t.accountPubkey, isSigner: !0, isWritable: !0 }])),
        new t_({ keys: r, programId: this.programId, data: e })
      );
    }
  }
  tj.programId = new te("11111111111111111111111111111111");
  class tH {
    static getMinNumSignatures(t) {
      return 2 * (Math.ceil(t / tH.chunkSize) + 1 + 1);
    }
    static async load(t, e, r, i, n) {
      {
        let s = await t.getMinimumBalanceForRentExemption(n.length),
          o = await t.getAccountInfo(r.publicKey, "confirmed"),
          a = null;
        if (null !== o) {
          if (o.executable)
            return (
              console.error(
                "Program load failed, account is already executable",
              ),
              !1
            );
          (o.data.length !== n.length &&
            (a = a || new tI()).add(
              tj.allocate({ accountPubkey: r.publicKey, space: n.length }),
            ),
            o.owner.equals(i) ||
              (a = a || new tI()).add(
                tj.assign({ accountPubkey: r.publicKey, programId: i }),
              ),
            o.lamports < s &&
              (a = a || new tI()).add(
                tj.transfer({
                  fromPubkey: e.publicKey,
                  toPubkey: r.publicKey,
                  lamports: s - o.lamports,
                }),
              ));
        } else
          a = new tI().add(
            tj.createAccount({
              fromPubkey: e.publicKey,
              newAccountPubkey: r.publicKey,
              lamports: s > 0 ? s : 1,
              space: n.length,
              programId: i,
            }),
          );
        null !== a && (await tU(t, a, [e, r], { commitment: "confirmed" }));
      }
      let o = h.struct([
          h.u32("instruction"),
          h.u32("offset"),
          h.u32("bytesLength"),
          h.u32("bytesLengthPadding"),
          h.seq(h.u8("byte"), h.offset(h.u32(), -8), "bytes"),
        ]),
        a = tH.chunkSize,
        u = 0,
        c = n,
        l = [];
      for (; c.length > 0; ) {
        let n = c.slice(0, a),
          h = s.Buffer.alloc(a + 16);
        o.encode(
          {
            instruction: 0,
            offset: u,
            bytes: n,
            bytesLength: 0,
            bytesLengthPadding: 0,
          },
          h,
        );
        let f = new tI().add({
          keys: [{ pubkey: r.publicKey, isSigner: !0, isWritable: !0 }],
          programId: i,
          data: h,
        });
        (l.push(tU(t, f, [e, r], { commitment: "confirmed" })),
          t._rpcEndpoint.includes("solana.com") && (await tN(250)),
          (u += a),
          (c = c.slice(a)));
      }
      await Promise.all(l);
      {
        let n = h.struct([h.u32("instruction")]),
          o = s.Buffer.alloc(n.span);
        n.encode({ instruction: 1 }, o);
        let a = new tI().add({
            keys: [
              { pubkey: r.publicKey, isSigner: !0, isWritable: !0 },
              { pubkey: tM, isSigner: !1, isWritable: !1 },
            ],
            programId: i,
            data: o,
          }),
          u = "processed",
          c = await t.sendTransaction(a, [e, r], { preflightCommitment: u }),
          { context: l, value: f } = await t.confirmTransaction(
            {
              signature: c,
              lastValidBlockHeight: a.lastValidBlockHeight,
              blockhash: a.recentBlockhash,
            },
            u,
          );
        if (f.err)
          throw Error(`Transaction ${c} failed (${JSON.stringify(f)})`);
        for (;;) {
          try {
            if ((await t.getSlot({ commitment: u })) > l.slot) break;
          } catch {}
          await new Promise((t) => setTimeout(t, Math.round(200)));
        }
      }
      return !0;
    }
  }
  tH.chunkSize = 932;
  let tJ = new te("BPFLoader2111111111111111111111111111111111");
  var tG =
    (r = (function () {
      if (n) return i;
      n = 1;
      var t = Object.prototype.toString,
        e =
          Object.keys ||
          function (t) {
            var e = [];
            for (var r in t) e.push(r);
            return e;
          };
      return (i = function (r) {
        var i = (function r(i, n) {
          var s, o, a, u, c, l, h;
          if (!0 === i) return "true";
          if (!1 === i) return "false";
          switch (typeof i) {
            case "object":
              if (null === i) return null;
              if (i.toJSON && "function" == typeof i.toJSON)
                return r(i.toJSON(), n);
              if ("[object Array]" === (h = t.call(i))) {
                for (a = "[", o = i.length - 1, s = 0; s < o; s++)
                  a += r(i[s], !0) + ",";
                return (o > -1 && (a += r(i[s], !0)), a + "]");
              }
              if ("[object Object]" !== h) return JSON.stringify(i);
              for (o = (u = e(i).sort()).length, a = "", s = 0; s < o; )
                (void 0 !== (l = r(i[(c = u[s])], !1)) &&
                  (a && (a += ","), (a += JSON.stringify(c) + ":" + l)),
                  s++);
              return "{" + a + "}";
            case "function":
            case "undefined":
              return n ? null : void 0;
            case "string":
              return JSON.stringify(i);
            default:
              return isFinite(i) ? i : null;
          }
        })(r, !1);
        if (void 0 !== i) return "" + i;
      });
    })()) &&
    r.__esModule &&
    Object.prototype.hasOwnProperty.call(r, "default")
      ? r.default
      : r;
  function tY(t) {
    let e = 0;
    for (; t > 1; ) ((t /= 2), e++);
    return e;
  }
  class tZ {
    constructor(t, e, r, i, n) {
      ((this.slotsPerEpoch = void 0),
        (this.leaderScheduleSlotOffset = void 0),
        (this.warmup = void 0),
        (this.firstNormalEpoch = void 0),
        (this.firstNormalSlot = void 0),
        (this.slotsPerEpoch = t),
        (this.leaderScheduleSlotOffset = e),
        (this.warmup = r),
        (this.firstNormalEpoch = i),
        (this.firstNormalSlot = n));
    }
    getEpoch(t) {
      return this.getEpochAndSlotIndex(t)[0];
    }
    getEpochAndSlotIndex(t) {
      if (t < this.firstNormalSlot) {
        var e;
        let r =
            tY(
              0 === (e = t + 32 + 1)
                ? 1
                : (e--,
                  (e |= e >> 1),
                  (e |= e >> 2),
                  (e |= e >> 4),
                  (e |= e >> 8),
                  (e |= e >> 16),
                  (e |= e >> 32) + 1),
            ) -
            tY(32) -
            1,
          i = this.getSlotsInEpoch(r);
        return [r, t - (i - 32)];
      }
      {
        let e = t - this.firstNormalSlot,
          r = Math.floor(e / this.slotsPerEpoch);
        return [this.firstNormalEpoch + r, e % this.slotsPerEpoch];
      }
    }
    getFirstSlotInEpoch(t) {
      return t <= this.firstNormalEpoch
        ? (Math.pow(2, t) - 1) * 32
        : (t - this.firstNormalEpoch) * this.slotsPerEpoch +
            this.firstNormalSlot;
    }
    getLastSlotInEpoch(t) {
      return this.getFirstSlotInEpoch(t) + this.getSlotsInEpoch(t) - 1;
    }
    getSlotsInEpoch(t) {
      return t < this.firstNormalEpoch
        ? Math.pow(2, t + tY(32))
        : this.slotsPerEpoch;
    }
  }
  var tX = globalThis.fetch;
  class tQ extends D {
    constructor(t, e, r) {
      (super(
        (t) => {
          let r = new K(t, {
            autoconnect: !0,
            max_reconnects: 5,
            reconnect: !0,
            reconnect_interval: 1e3,
            ...e,
          });
          return (
            "socket" in r
              ? (this.underlyingSocket = r.socket)
              : (this.underlyingSocket = r),
            r
          );
        },
        t,
        e,
        r,
      ),
        (this.underlyingSocket = void 0));
    }
    call(...t) {
      let e = this.underlyingSocket?.readyState;
      return 1 === e
        ? super.call(...t)
        : Promise.reject(
            Error(
              "Tried to call a JSON-RPC method `" +
                t[0] +
                "` but the socket was not `CONNECTING` or `OPEN` (`readyState` was " +
                e +
                ")",
            ),
          );
    }
    notify(...t) {
      let e = this.underlyingSocket?.readyState;
      return 1 === e
        ? super.notify(...t)
        : Promise.reject(
            Error(
              "Tried to send a JSON-RPC notification `" +
                t[0] +
                "` but the socket was not `CONNECTING` or `OPEN` (`readyState` was " +
                e +
                ")",
            ),
          );
    }
  }
  class t0 {
    constructor(t) {
      ((this.key = void 0),
        (this.state = void 0),
        (this.key = t.key),
        (this.state = t.state));
    }
    isActive() {
      let t = BigInt("0xffffffffffffffff");
      return this.state.deactivationSlot === t;
    }
    static deserialize(t) {
      let e = (function (t, e) {
          let r;
          try {
            r = t.layout.decode(e);
          } catch (t) {
            throw Error("invalid instruction; " + t);
          }
          if (r.typeIndex !== t.index)
            throw Error(
              `invalid account data; account type mismatch ${r.typeIndex} != ${t.index}`,
            );
          return r;
        })(t1, t),
        r = t.length - 56;
      (th(r >= 0, "lookup table is invalid"),
        th(r % 32 == 0, "lookup table is invalid"));
      let { addresses: i } = h
        .struct([h.seq(ta(), r / 32, "addresses")])
        .decode(t.slice(56));
      return {
        deactivationSlot: e.deactivationSlot,
        lastExtendedSlot: e.lastExtendedSlot,
        lastExtendedSlotStartIndex: e.lastExtendedStartIndex,
        authority: 0 !== e.authority.length ? new te(e.authority[0]) : void 0,
        addresses: i.map((t) => new te(t)),
      };
    }
  }
  let t1 = {
      index: 1,
      layout: h.struct([
        h.u32("typeIndex"),
        tF("deactivationSlot"),
        h.nu64("lastExtendedSlot"),
        h.u8("lastExtendedStartIndex"),
        h.u8(),
        h.seq(ta(), h.offset(h.u8(), -1), "authority"),
      ]),
    },
    t2 = /^[^:]+:\/\/([^:[]+|\[[^\]]+\])(:\d+)?(.*)/i,
    t3 = N(E(te), R(), (t) => new te(t)),
    t6 = L([R(), x("base64")]),
    t5 = N(E(s.Buffer), t6, (t) => s.Buffer.from(t[0], "base64"));
  function t8(t) {
    let e, r;
    if ("string" == typeof t) e = t;
    else if (t) {
      let { commitment: i, ...n } = t;
      ((e = i), (r = n));
    }
    return { commitment: e, config: r };
  }
  function t4(t) {
    return t.map((t) =>
      "memcmp" in t
        ? {
            ...t,
            memcmp: { ...t.memcmp, encoding: t.memcmp.encoding ?? "base58" },
          }
        : t,
    );
  }
  function t9(t) {
    return O([
      C({ jsonrpc: x("2.0"), id: R(), result: t }),
      C({
        jsonrpc: x("2.0"),
        id: R(),
        error: C({ code: U(), message: R(), data: P(_("any", () => !0)) }),
      }),
    ]);
  }
  let t7 = t9(U());
  function et(t) {
    return N(t9(t), t7, (e) =>
      "error" in e ? e : { ...e, result: v(e.result, t) },
    );
  }
  function ee(t) {
    return et(C({ context: C({ slot: M() }), value: t }));
  }
  function er(t) {
    return C({ context: C({ slot: M() }), value: t });
  }
  function ei(t, e) {
    if (0 === t)
      return new ty({
        header: e.header,
        staticAccountKeys: e.accountKeys.map((t) => new te(t)),
        recentBlockhash: e.recentBlockhash,
        compiledInstructions: e.instructions.map((t) => ({
          programIdIndex: t.programIdIndex,
          accountKeyIndexes: t.accounts,
          data: u.f.decode(t.data),
        })),
        addressTableLookups: e.addressTableLookups,
      });
    if (1 !== t) return new tm(e);
    {
      let t = e.transactionConfig;
      if (null == t)
        throw Error(
          "Expected a version 1 transaction message response to have a `transactionConfig`",
        );
      return new tw({
        header: e.header,
        staticAccountKeys: e.accountKeys.map((t) => new te(t)),
        recentBlockhash: e.recentBlockhash,
        compiledInstructions: e.instructions.map((t) => ({
          programIdIndex: t.programIdIndex,
          accountKeyIndexes: t.accounts,
          data: u.f.decode(t.data),
        })),
        transactionConfig: t,
      });
    }
  }
  let en = C({
      foundation: M(),
      foundationTerm: M(),
      initial: M(),
      taper: M(),
      terminal: M(),
    }),
    es = et(
      I(
        B(
          C({
            epoch: M(),
            effectiveSlot: M(),
            amount: M(),
            postBalance: M(),
            commission: P(B(M())),
          }),
        ),
      ),
    ),
    eo = I(C({ slot: M(), prioritizationFee: M() })),
    ea = C({ total: M(), validator: M(), foundation: M(), epoch: M() }),
    eu = C({
      epoch: M(),
      slotIndex: M(),
      slotsInEpoch: M(),
      absoluteSlot: M(),
      blockHeight: P(M()),
      transactionCount: P(M()),
    }),
    ec = C({
      slotsPerEpoch: M(),
      leaderScheduleSlotOffset: M(),
      warmup: A(),
      firstNormalEpoch: M(),
      firstNormalSlot: M(),
    }),
    el = T(R(), I(M())),
    eh = B(O([C({}), R()])),
    ef = C({ err: eh }),
    ed = x("receivedSignature"),
    ep = C({ "solana-core": R(), "feature-set": P(M()) }),
    eg = C({ program: R(), programId: t3, parsed: U() }),
    em = C({ programId: t3, accounts: I(t3), data: R() }),
    ey = ee(
      C({
        err: B(O([C({}), R()])),
        logs: B(I(R())),
        accounts: P(
          B(
            I(
              B(
                C({
                  executable: A(),
                  owner: R(),
                  lamports: M(),
                  data: I(R()),
                  rentEpoch: P(M()),
                }),
              ),
            ),
          ),
        ),
        unitsConsumed: P(M()),
        returnData: P(B(C({ programId: R(), data: L([R(), x("base64")]) }))),
        innerInstructions: P(
          B(I(C({ index: M(), instructions: I(O([eg, em])) }))),
        ),
      }),
    ),
    eb = ee(
      C({
        byIdentity: T(R(), I(M())),
        range: C({ firstSlot: M(), lastSlot: M() }),
      }),
    ),
    ew = et(en),
    ek = et(ea),
    ev = et(eo),
    eS = et(eu),
    e_ = et(ec),
    eI = et(el),
    eA = et(M()),
    eE = ee(
      C({
        total: M(),
        circulating: M(),
        nonCirculating: M(),
        nonCirculatingAccounts: I(t3),
      }),
    ),
    ex = C({
      amount: R(),
      uiAmount: B(M()),
      decimals: M(),
      uiAmountString: P(R()),
    }),
    eB = ee(
      I(
        C({
          address: t3,
          amount: R(),
          uiAmount: B(M()),
          decimals: M(),
          uiAmountString: P(R()),
        }),
      ),
    ),
    eM = ee(
      I(
        C({
          pubkey: t3,
          account: C({
            executable: A(),
            owner: t3,
            lamports: M(),
            data: t5,
            rentEpoch: M(),
          }),
        }),
      ),
    ),
    eP = C({ program: R(), parsed: U(), space: M() }),
    eT = ee(
      I(
        C({
          pubkey: t3,
          account: C({
            executable: A(),
            owner: t3,
            lamports: M(),
            data: eP,
            rentEpoch: M(),
          }),
        }),
      ),
    ),
    eR = ee(I(C({ lamports: M(), address: t3 }))),
    eL = C({
      executable: A(),
      owner: t3,
      lamports: M(),
      data: t5,
      rentEpoch: M(),
    }),
    eC = C({ pubkey: t3, account: eL }),
    eO = N(O([E(s.Buffer), eP]), O([t6, eP]), (t) =>
      Array.isArray(t) ? v(t, t5) : t,
    ),
    eU = C({
      executable: A(),
      owner: t3,
      lamports: M(),
      data: eO,
      rentEpoch: M(),
    }),
    eN = C({ pubkey: t3, account: eU }),
    ez = C({
      state: O([
        x("active"),
        x("inactive"),
        x("activating"),
        x("deactivating"),
      ]),
      active: M(),
      inactive: M(),
    }),
    eW = et(
      I(
        C({
          signature: R(),
          slot: M(),
          err: eh,
          memo: B(R()),
          blockTime: P(B(M())),
        }),
      ),
    ),
    eK = et(
      I(
        C({
          signature: R(),
          slot: M(),
          err: eh,
          memo: B(R()),
          blockTime: P(B(M())),
        }),
      ),
    ),
    eq = C({ subscription: M(), result: er(eL) }),
    eD = C({ pubkey: t3, account: eL }),
    e$ = C({ subscription: M(), result: er(eD) }),
    eF = C({ parent: M(), slot: M(), root: M() }),
    eV = C({ subscription: M(), result: eF }),
    ej = O([
      C({
        type: O([
          x("firstShredReceived"),
          x("completed"),
          x("optimisticConfirmation"),
          x("root"),
        ]),
        slot: M(),
        timestamp: M(),
      }),
      C({ type: x("createdBank"), parent: M(), slot: M(), timestamp: M() }),
      C({
        type: x("frozen"),
        slot: M(),
        timestamp: M(),
        stats: C({
          numTransactionEntries: M(),
          numSuccessfulTransactions: M(),
          numFailedTransactions: M(),
          maxTransactionsPerEntry: M(),
        }),
      }),
      C({ type: x("dead"), slot: M(), timestamp: M(), err: R() }),
    ]),
    eH = C({ subscription: M(), result: ej }),
    eJ = C({ subscription: M(), result: er(O([ef, ed])) }),
    eG = C({ subscription: M(), result: M() }),
    eY = C({
      pubkey: R(),
      gossip: B(R()),
      tpu: B(R()),
      rpc: B(R()),
      version: B(R()),
    }),
    eZ = C({
      votePubkey: R(),
      nodePubkey: R(),
      activatedStake: M(),
      epochVoteAccount: A(),
      epochCredits: I(L([M(), M(), M()])),
      commission: M(),
      lastVote: M(),
      rootSlot: B(M()),
    }),
    eX = et(C({ current: I(eZ), delinquent: I(eZ) })),
    eQ = O([x("processed"), x("confirmed"), x("finalized")]),
    e0 = C({
      slot: M(),
      confirmations: B(M()),
      err: eh,
      confirmationStatus: P(eQ),
    }),
    e1 = ee(I(B(e0))),
    e2 = et(M()),
    e3 = C({
      accountKey: t3,
      writableIndexes: I(M()),
      readonlyIndexes: I(M()),
    }),
    e6 = C({
      computeUnitLimit: B(M()),
      heapSize: B(M()),
      loadedAccountsDataSizeLimit: B(M()),
      priorityFee: B(M()),
    }),
    e5 = C({
      signatures: I(R()),
      message: C({
        accountKeys: I(R()),
        header: C({
          numRequiredSignatures: M(),
          numReadonlySignedAccounts: M(),
          numReadonlyUnsignedAccounts: M(),
        }),
        instructions: I(
          C({ accounts: I(M()), data: R(), programIdIndex: M() }),
        ),
        recentBlockhash: R(),
        addressTableLookups: P(I(e3)),
        transactionConfig: P(B(e6)),
      }),
    }),
    e8 = C({
      pubkey: t3,
      signer: A(),
      writable: A(),
      source: P(O([x("transaction"), x("lookupTable")])),
    }),
    e4 = C({ accountKeys: I(e8), signatures: I(R()) }),
    e9 = C({ parsed: U(), program: R(), programId: t3 }),
    e7 = C({ accounts: I(t3), data: R(), programId: t3 }),
    rt = N(
      O([e7, e9]),
      O([
        C({ parsed: U(), program: R(), programId: R() }),
        C({ accounts: I(R()), data: R(), programId: R() }),
      ]),
      (t) => ("accounts" in t ? v(t, e7) : v(t, e9)),
    ),
    re = C({
      signatures: I(R()),
      message: C({
        accountKeys: I(e8),
        instructions: I(rt),
        recentBlockhash: R(),
        addressTableLookups: P(B(I(e3))),
        transactionConfig: P(B(e6)),
      }),
    }),
    rr = C({
      accountIndex: M(),
      mint: R(),
      owner: P(R()),
      programId: P(R()),
      uiTokenAmount: ex,
    }),
    ri = C({ writable: I(t3), readonly: I(t3) }),
    rn = C({
      err: eh,
      fee: M(),
      innerInstructions: P(
        B(
          I(
            C({
              index: M(),
              instructions: I(
                C({ accounts: I(M()), data: R(), programIdIndex: M() }),
              ),
            }),
          ),
        ),
      ),
      preBalances: I(M()),
      postBalances: I(M()),
      logMessages: P(B(I(R()))),
      preTokenBalances: P(B(I(rr))),
      postTokenBalances: P(B(I(rr))),
      loadedAddresses: P(ri),
      computeUnitsConsumed: P(M()),
      costUnits: P(M()),
    }),
    rs = C({
      err: eh,
      fee: M(),
      innerInstructions: P(B(I(C({ index: M(), instructions: I(rt) })))),
      preBalances: I(M()),
      postBalances: I(M()),
      logMessages: P(B(I(R()))),
      preTokenBalances: P(B(I(rr))),
      postTokenBalances: P(B(I(rr))),
      loadedAddresses: P(ri),
      computeUnitsConsumed: P(M()),
      costUnits: P(M()),
    }),
    ro = O([x(0), x(1), x("legacy")]),
    ra = C({
      pubkey: R(),
      lamports: M(),
      postBalance: B(M()),
      rewardType: B(R()),
      commission: P(B(M())),
    }),
    ru = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          transactions: I(C({ transaction: e5, meta: B(rn), version: P(ro) })),
          rewards: P(I(ra)),
          blockTime: B(M()),
          blockHeight: B(M()),
        }),
      ),
    ),
    rc = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          rewards: P(I(ra)),
          blockTime: B(M()),
          blockHeight: B(M()),
        }),
      ),
    ),
    rl = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          transactions: I(C({ transaction: e4, meta: B(rn), version: P(ro) })),
          rewards: P(I(ra)),
          blockTime: B(M()),
          blockHeight: B(M()),
        }),
      ),
    ),
    rh = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          transactions: I(C({ transaction: re, meta: B(rs), version: P(ro) })),
          rewards: P(I(ra)),
          blockTime: B(M()),
          blockHeight: B(M()),
        }),
      ),
    ),
    rf = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          transactions: I(C({ transaction: e4, meta: B(rs), version: P(ro) })),
          rewards: P(I(ra)),
          blockTime: B(M()),
          blockHeight: B(M()),
        }),
      ),
    ),
    rd = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          rewards: P(I(ra)),
          blockTime: B(M()),
          blockHeight: B(M()),
        }),
      ),
    ),
    rp = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          transactions: I(C({ transaction: e5, meta: B(rn) })),
          rewards: P(I(ra)),
          blockTime: B(M()),
        }),
      ),
    ),
    rg = et(
      B(
        C({
          blockhash: R(),
          previousBlockhash: R(),
          parentSlot: M(),
          signatures: I(R()),
          blockTime: B(M()),
        }),
      ),
    ),
    rm = et(
      B(
        C({
          slot: M(),
          meta: B(rn),
          blockTime: P(B(M())),
          transaction: e5,
          version: P(ro),
        }),
      ),
    ),
    ry = et(
      B(
        C({
          slot: M(),
          transaction: re,
          meta: B(rs),
          blockTime: P(B(M())),
          version: P(ro),
        }),
      ),
    ),
    rb = ee(C({ blockhash: R(), lastValidBlockHeight: M() })),
    rw = ee(A()),
    rk = et(
      I(
        C({
          slot: M(),
          numTransactions: M(),
          numSlots: M(),
          samplePeriodSecs: M(),
        }),
      ),
    ),
    rv = ee(B(C({ feeCalculator: C({ lamportsPerSignature: M() }) }))),
    rS = et(R()),
    r_ = et(R()),
    rI = C({ err: eh, logs: I(R()), signature: R() }),
    rA = C({ result: er(rI), subscription: M() }),
    rE = { "solana-client": "js/1.99.0" };
  class rx {
    constructor(t) {
      ((this._keypair = void 0), (this._keypair = t ?? j()));
    }
    static generate() {
      return new rx(j());
    }
    static fromSecretKey(t, e) {
      if (64 !== t.byteLength) throw Error("bad secret key size");
      let r = t.slice(32, 64);
      if (!e || !e.skipValidation) {
        let e = H(t.slice(0, 32));
        for (let t = 0; t < 32; t++)
          if (r[t] !== e[t]) throw Error("provided secretKey is invalid");
      }
      return new rx({ publicKey: r, secretKey: t });
    }
    static fromSeed(t) {
      let e = H(t),
        r = new Uint8Array(64);
      return (r.set(t), r.set(e, 32), new rx({ publicKey: e, secretKey: r }));
    }
    get publicKey() {
      return new te(this._keypair.publicKey);
    }
    get secretKey() {
      return new Uint8Array(this._keypair.secretKey);
    }
  }
  let rB = Object.freeze({
    CreateLookupTable: {
      index: 0,
      layout: h.struct([
        h.u32("instruction"),
        tF("recentSlot"),
        h.u8("bumpSeed"),
      ]),
    },
    FreezeLookupTable: { index: 1, layout: h.struct([h.u32("instruction")]) },
    ExtendLookupTable: {
      index: 2,
      layout: h.struct([
        h.u32("instruction"),
        tF(),
        h.seq(ta(), h.offset(h.u32(), -8), "addresses"),
      ]),
    },
    DeactivateLookupTable: {
      index: 3,
      layout: h.struct([h.u32("instruction")]),
    },
    CloseLookupTable: { index: 4, layout: h.struct([h.u32("instruction")]) },
  });
  class rM {
    static createLookupTable(t) {
      let [e, r] = te.findProgramAddressSync(
          [t.authority.toBuffer(), (0, f.f)().encode(t.recentSlot)],
          this.programId,
        ),
        i = tz(rB.CreateLookupTable, {
          recentSlot: BigInt(t.recentSlot),
          bumpSeed: r,
        }),
        n = [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: t.authority, isSigner: !0, isWritable: !1 },
          { pubkey: t.payer, isSigner: !0, isWritable: !0 },
          { pubkey: tj.programId, isSigner: !1, isWritable: !1 },
        ];
      return [new t_({ programId: this.programId, keys: n, data: i }), e];
    }
    static freezeLookupTable(t) {
      let e = tz(rB.FreezeLookupTable),
        r = [
          { pubkey: t.lookupTable, isSigner: !1, isWritable: !0 },
          { pubkey: t.authority, isSigner: !0, isWritable: !1 },
        ];
      return new t_({ programId: this.programId, keys: r, data: e });
    }
    static extendLookupTable(t) {
      let e = tz(rB.ExtendLookupTable, {
          addresses: t.addresses.map((t) => t.toBytes()),
        }),
        r = [
          { pubkey: t.lookupTable, isSigner: !1, isWritable: !0 },
          { pubkey: t.authority, isSigner: !0, isWritable: !1 },
        ];
      return (
        t.payer &&
          r.push(
            { pubkey: t.payer, isSigner: !0, isWritable: !0 },
            { pubkey: tj.programId, isSigner: !1, isWritable: !1 },
          ),
        new t_({ programId: this.programId, keys: r, data: e })
      );
    }
    static deactivateLookupTable(t) {
      let e = tz(rB.DeactivateLookupTable),
        r = [
          { pubkey: t.lookupTable, isSigner: !1, isWritable: !0 },
          { pubkey: t.authority, isSigner: !0, isWritable: !1 },
        ];
      return new t_({ programId: this.programId, keys: r, data: e });
    }
    static closeLookupTable(t) {
      let e = tz(rB.CloseLookupTable),
        r = [
          { pubkey: t.lookupTable, isSigner: !1, isWritable: !0 },
          { pubkey: t.authority, isSigner: !0, isWritable: !1 },
          { pubkey: t.recipient, isSigner: !1, isWritable: !0 },
        ];
      return new t_({ programId: this.programId, keys: r, data: e });
    }
  }
  rM.programId = new te("AddressLookupTab1e1111111111111111111111111");
  let rP = Object.freeze({
    RequestUnits: {
      index: 0,
      layout: h.struct([
        h.u8("instruction"),
        h.u32("units"),
        h.u32("additionalFee"),
      ]),
    },
    RequestHeapFrame: {
      index: 1,
      layout: h.struct([h.u8("instruction"), h.u32("bytes")]),
    },
    SetComputeUnitLimit: {
      index: 2,
      layout: h.struct([h.u8("instruction"), h.u32("units")]),
    },
    SetComputeUnitPrice: {
      index: 3,
      layout: h.struct([h.u8("instruction"), tF("microLamports")]),
    },
  });
  class rT {
    static requestUnits(t) {
      let e = tz(rP.RequestUnits, t);
      return new t_({ keys: [], programId: this.programId, data: e });
    }
    static requestHeapFrame(t) {
      let e = tz(rP.RequestHeapFrame, t);
      return new t_({ keys: [], programId: this.programId, data: e });
    }
    static setComputeUnitLimit(t) {
      let e = tz(rP.SetComputeUnitLimit, t);
      return new t_({ keys: [], programId: this.programId, data: e });
    }
    static setComputeUnitPrice(t) {
      let e = tz(rP.SetComputeUnitPrice, {
        microLamports: BigInt(t.microLamports),
      });
      return new t_({ keys: [], programId: this.programId, data: e });
    }
  }
  rT.programId = new te("ComputeBudget111111111111111111111111111111");
  let rR = h.struct([
    h.u8("numSignatures"),
    h.u8("padding"),
    h.u16("signatureOffset"),
    h.u16("signatureInstructionIndex"),
    h.u16("publicKeyOffset"),
    h.u16("publicKeyInstructionIndex"),
    h.u16("messageDataOffset"),
    h.u16("messageDataSize"),
    h.u16("messageInstructionIndex"),
  ]);
  class rL {
    static createInstructionWithPublicKey(t) {
      let { publicKey: e, message: r, signature: i, instructionIndex: n } = t;
      (th(
        32 === e.length,
        `Public Key must be 32 bytes but received ${e.length} bytes`,
      ),
        th(
          64 === i.length,
          `Signature must be 64 bytes but received ${i.length} bytes`,
        ));
      let o = rR.span,
        a = o + e.length,
        u = a + i.length,
        c = s.Buffer.alloc(u + r.length),
        l = null == n ? 65535 : n;
      return (
        rR.encode(
          {
            numSignatures: 1,
            padding: 0,
            signatureOffset: a,
            signatureInstructionIndex: l,
            publicKeyOffset: o,
            publicKeyInstructionIndex: l,
            messageDataOffset: u,
            messageDataSize: r.length,
            messageInstructionIndex: l,
          },
          c,
        ),
        c.fill(e, o),
        c.fill(i, a),
        c.fill(r, u),
        new t_({ keys: [], programId: rL.programId, data: c })
      );
    }
    static createInstructionWithPrivateKey(t) {
      let { privateKey: e, message: r, instructionIndex: i } = t;
      th(
        64 === e.length,
        `Private key must be 64 bytes but received ${e.length} bytes`,
      );
      try {
        let t = rx.fromSecretKey(e),
          n = t.publicKey.toBytes(),
          s = G(r, t.secretKey);
        return this.createInstructionWithPublicKey({
          publicKey: n,
          message: r,
          signature: s,
          instructionIndex: i,
        });
      } catch (t) {
        throw Error(`Error creating instruction; ${t}`);
      }
    }
  }
  ((rL.programId = new te("Ed25519SigVerify111111111111111111111111111")),
    F.f.utils.isValidPrivateKey);
  let rC = F.f.getPublicKey,
    rO = h.struct([
      h.u8("numSignatures"),
      h.u16("signatureOffset"),
      h.u8("signatureInstructionIndex"),
      h.u16("ethAddressOffset"),
      h.u8("ethAddressInstructionIndex"),
      h.u16("messageDataOffset"),
      h.u16("messageDataSize"),
      h.u8("messageInstructionIndex"),
      h.blob(20, "ethAddress"),
      h.blob(64, "signature"),
      h.u8("recoveryId"),
    ]);
  class rU {
    static publicKeyToEthAddress(t) {
      th(
        64 === t.length,
        `Public key must be 64 bytes but received ${t.length} bytes`,
      );
      try {
        return s.Buffer.from((0, $.f)(Z(t))).slice(-20);
      } catch (t) {
        throw Error(`Error constructing Ethereum address: ${t}`);
      }
    }
    static createInstructionWithPublicKey(t) {
      let {
        publicKey: e,
        message: r,
        signature: i,
        recoveryId: n,
        instructionIndex: s,
      } = t;
      return rU.createInstructionWithEthAddress({
        ethAddress: rU.publicKeyToEthAddress(e),
        message: r,
        signature: i,
        recoveryId: n,
        instructionIndex: s,
      });
    }
    static createInstructionWithEthAddress(t) {
      let e,
        {
          ethAddress: r,
          message: i,
          signature: n,
          recoveryId: o,
          instructionIndex: a = 0,
        } = t;
      th(
        20 ===
          (e =
            "string" == typeof r
              ? r.startsWith("0x")
                ? s.Buffer.from(r.substr(2), "hex")
                : s.Buffer.from(r, "hex")
              : r).length,
        `Address must be 20 bytes but received ${e.length} bytes`,
      );
      let u = 12 + e.length,
        c = u + n.length + 1,
        l = s.Buffer.alloc(rO.span + i.length);
      return (
        rO.encode(
          {
            numSignatures: 1,
            signatureOffset: u,
            signatureInstructionIndex: a,
            ethAddressOffset: 12,
            ethAddressInstructionIndex: a,
            messageDataOffset: c,
            messageDataSize: i.length,
            messageInstructionIndex: a,
            signature: Z(n),
            ethAddress: Z(e),
            recoveryId: o,
          },
          l,
        ),
        l.fill(Z(i), rO.span),
        new t_({ keys: [], programId: rU.programId, data: l })
      );
    }
    static createInstructionWithPrivateKey(t) {
      let { privateKey: e, message: r, instructionIndex: i } = t;
      th(
        32 === e.length,
        `Private key must be 32 bytes but received ${e.length} bytes`,
      );
      try {
        var n;
        let t,
          o = Z(e),
          a = rC(o, !1).slice(1),
          [u, c] =
            ((n = s.Buffer.from((0, $.f)(Z(r)))),
            [(t = F.f.sign(n, o)).toCompactRawBytes(), t.recovery]);
        return this.createInstructionWithPublicKey({
          publicKey: a,
          message: r,
          signature: u,
          recoveryId: c,
          instructionIndex: i,
        });
      } catch (t) {
        throw Error(`Error creating instruction; ${t}`);
      }
    }
  }
  rU.programId = new te("KeccakSecp256k11111111111111111111111111111");
  let rN = new te("StakeConfig11111111111111111111111111111111");
  class rz {
    constructor(t, e) {
      ((this.staker = void 0),
        (this.withdrawer = void 0),
        (this.staker = t),
        (this.withdrawer = e));
    }
  }
  class rW {
    constructor(t, e, r) {
      ((this.unixTimestamp = void 0),
        (this.epoch = void 0),
        (this.custodian = void 0),
        (this.unixTimestamp = t),
        (this.epoch = e),
        (this.custodian = r));
    }
  }
  rW.default = new rW(0, 0, te.default);
  let rK = Object.freeze({
      Initialize: {
        index: 0,
        layout: h.struct([
          h.u32("instruction"),
          ((t = "authorized") =>
            h.struct([ta("staker"), ta("withdrawer")], t))(),
          ((t = "lockup") =>
            h.struct(
              [h.ns64("unixTimestamp"), h.ns64("epoch"), ta("custodian")],
              t,
            ))(),
        ]),
      },
      Authorize: {
        index: 1,
        layout: h.struct([
          h.u32("instruction"),
          ta("newAuthorized"),
          h.u32("stakeAuthorizationType"),
        ]),
      },
      Delegate: { index: 2, layout: h.struct([h.u32("instruction")]) },
      Split: {
        index: 3,
        layout: h.struct([h.u32("instruction"), h.ns64("lamports")]),
      },
      Withdraw: {
        index: 4,
        layout: h.struct([h.u32("instruction"), h.ns64("lamports")]),
      },
      Deactivate: { index: 5, layout: h.struct([h.u32("instruction")]) },
      Merge: { index: 7, layout: h.struct([h.u32("instruction")]) },
      AuthorizeWithSeed: {
        index: 8,
        layout: h.struct([
          h.u32("instruction"),
          ta("newAuthorized"),
          h.u32("stakeAuthorizationType"),
          tu("authoritySeed"),
          ta("authorityOwner"),
        ]),
      },
    }),
    rq = Object.freeze({ Staker: { index: 0 }, Withdrawer: { index: 1 } });
  class rD {
    static initialize(t) {
      let { stakePubkey: e, authorized: r, lockup: i } = t,
        n = i || rW.default,
        s = tz(rK.Initialize, {
          authorized: {
            staker: Z(r.staker.toBuffer()),
            withdrawer: Z(r.withdrawer.toBuffer()),
          },
          lockup: {
            unixTimestamp: n.unixTimestamp,
            epoch: n.epoch,
            custodian: Z(n.custodian.toBuffer()),
          },
        });
      return new t_({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: tM, isSigner: !1, isWritable: !1 },
        ],
        programId: this.programId,
        data: s,
      });
    }
    static createAccountWithSeed(t) {
      let e = new tI();
      e.add(
        tj.createAccountWithSeed({
          fromPubkey: t.fromPubkey,
          newAccountPubkey: t.stakePubkey,
          basePubkey: t.basePubkey,
          seed: t.seed,
          lamports: t.lamports,
          space: this.space,
          programId: this.programId,
        }),
      );
      let { stakePubkey: r, authorized: i, lockup: n } = t;
      return e.add(
        this.initialize({ stakePubkey: r, authorized: i, lockup: n }),
      );
    }
    static createAccount(t) {
      let e = new tI();
      e.add(
        tj.createAccount({
          fromPubkey: t.fromPubkey,
          newAccountPubkey: t.stakePubkey,
          lamports: t.lamports,
          space: this.space,
          programId: this.programId,
        }),
      );
      let { stakePubkey: r, authorized: i, lockup: n } = t;
      return e.add(
        this.initialize({ stakePubkey: r, authorized: i, lockup: n }),
      );
    }
    static delegate(t) {
      let { stakePubkey: e, authorizedPubkey: r, votePubkey: i } = t,
        n = tz(rK.Delegate);
      return new tI().add({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: i, isSigner: !1, isWritable: !1 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: tL, isSigner: !1, isWritable: !1 },
          { pubkey: rN, isSigner: !1, isWritable: !1 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: n,
      });
    }
    static authorize(t) {
      let {
          stakePubkey: e,
          authorizedPubkey: r,
          newAuthorizedPubkey: i,
          stakeAuthorizationType: n,
          custodianPubkey: s,
        } = t,
        o = tz(rK.Authorize, {
          newAuthorized: Z(i.toBuffer()),
          stakeAuthorizationType: n.index,
        }),
        a = [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: tA, isSigner: !1, isWritable: !0 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ];
      return (
        s && a.push({ pubkey: s, isSigner: !0, isWritable: !1 }),
        new tI().add({ keys: a, programId: this.programId, data: o })
      );
    }
    static authorizeWithSeed(t) {
      let {
          stakePubkey: e,
          authorityBase: r,
          authoritySeed: i,
          authorityOwner: n,
          newAuthorizedPubkey: s,
          stakeAuthorizationType: o,
          custodianPubkey: a,
        } = t,
        u = tz(rK.AuthorizeWithSeed, {
          newAuthorized: Z(s.toBuffer()),
          stakeAuthorizationType: o.index,
          authoritySeed: i,
          authorityOwner: Z(n.toBuffer()),
        }),
        c = [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
        ];
      return (
        a && c.push({ pubkey: a, isSigner: !0, isWritable: !1 }),
        new tI().add({ keys: c, programId: this.programId, data: u })
      );
    }
    static splitInstruction(t) {
      let {
          stakePubkey: e,
          authorizedPubkey: r,
          splitStakePubkey: i,
          lamports: n,
        } = t,
        s = tz(rK.Split, { lamports: n });
      return new t_({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: i, isSigner: !1, isWritable: !0 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: s,
      });
    }
    static split(t, e) {
      let r = new tI();
      return (
        r.add(
          tj.createAccount({
            fromPubkey: t.authorizedPubkey,
            newAccountPubkey: t.splitStakePubkey,
            lamports: e,
            space: this.space,
            programId: this.programId,
          }),
        ),
        r.add(this.splitInstruction(t))
      );
    }
    static splitWithSeed(t, e) {
      let {
          stakePubkey: r,
          authorizedPubkey: i,
          splitStakePubkey: n,
          basePubkey: s,
          seed: o,
          lamports: a,
        } = t,
        u = new tI();
      return (
        u.add(
          tj.allocate({
            accountPubkey: n,
            basePubkey: s,
            seed: o,
            space: this.space,
            programId: this.programId,
          }),
        ),
        e &&
          e > 0 &&
          u.add(
            tj.transfer({
              fromPubkey: t.authorizedPubkey,
              toPubkey: n,
              lamports: e,
            }),
          ),
        u.add(
          this.splitInstruction({
            stakePubkey: r,
            authorizedPubkey: i,
            splitStakePubkey: n,
            lamports: a,
          }),
        )
      );
    }
    static merge(t) {
      let { stakePubkey: e, sourceStakePubKey: r, authorizedPubkey: i } = t,
        n = tz(rK.Merge);
      return new tI().add({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: r, isSigner: !1, isWritable: !0 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: tL, isSigner: !1, isWritable: !1 },
          { pubkey: i, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: n,
      });
    }
    static withdraw(t) {
      let {
          stakePubkey: e,
          authorizedPubkey: r,
          toPubkey: i,
          lamports: n,
          custodianPubkey: s,
        } = t,
        o = tz(rK.Withdraw, { lamports: n }),
        a = [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: i, isSigner: !1, isWritable: !0 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: tL, isSigner: !1, isWritable: !1 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ];
      return (
        s && a.push({ pubkey: s, isSigner: !0, isWritable: !1 }),
        new tI().add({ keys: a, programId: this.programId, data: o })
      );
    }
    static deactivate(t) {
      let { stakePubkey: e, authorizedPubkey: r } = t,
        i = tz(rK.Deactivate);
      return new tI().add({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: i,
      });
    }
  }
  ((rD.programId = new te("Stake11111111111111111111111111111111111111")),
    (rD.space = 200));
  class r$ {
    constructor(t, e, r, i) {
      ((this.nodePubkey = void 0),
        (this.authorizedVoter = void 0),
        (this.authorizedWithdrawer = void 0),
        (this.commission = void 0),
        (this.nodePubkey = t),
        (this.authorizedVoter = e),
        (this.authorizedWithdrawer = r),
        (this.commission = i));
    }
  }
  let rF = Object.freeze({
      InitializeAccount: {
        index: 0,
        layout: h.struct([
          h.u32("instruction"),
          ((t = "voteInit") =>
            h.struct(
              [
                ta("nodePubkey"),
                ta("authorizedVoter"),
                ta("authorizedWithdrawer"),
                h.u8("commission"),
              ],
              t,
            ))(),
        ]),
      },
      Authorize: {
        index: 1,
        layout: h.struct([
          h.u32("instruction"),
          ta("newAuthorized"),
          h.u32("voteAuthorizationType"),
        ]),
      },
      Withdraw: {
        index: 3,
        layout: h.struct([h.u32("instruction"), h.ns64("lamports")]),
      },
      UpdateValidatorIdentity: {
        index: 4,
        layout: h.struct([h.u32("instruction")]),
      },
      AuthorizeWithSeed: {
        index: 10,
        layout: h.struct([
          h.u32("instruction"),
          ((t = "voteAuthorizeWithSeedArgs") =>
            h.struct(
              [
                h.u32("voteAuthorizationType"),
                ta("currentAuthorityDerivedKeyOwnerPubkey"),
                tu("currentAuthorityDerivedKeySeed"),
                ta("newAuthorized"),
              ],
              t,
            ))(),
        ]),
      },
    }),
    rV = Object.freeze({ Voter: { index: 0 }, Withdrawer: { index: 1 } });
  class rj {
    static initializeAccount(t) {
      let { votePubkey: e, nodePubkey: r, voteInit: i } = t,
        n = tz(rF.InitializeAccount, {
          voteInit: {
            nodePubkey: Z(i.nodePubkey.toBuffer()),
            authorizedVoter: Z(i.authorizedVoter.toBuffer()),
            authorizedWithdrawer: Z(i.authorizedWithdrawer.toBuffer()),
            commission: i.commission,
          },
        });
      return new t_({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: tM, isSigner: !1, isWritable: !1 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: n,
      });
    }
    static createAccount(t) {
      let e = new tI();
      return (
        e.add(
          tj.createAccount({
            fromPubkey: t.fromPubkey,
            newAccountPubkey: t.votePubkey,
            lamports: t.lamports,
            space: this.space,
            programId: this.programId,
          }),
        ),
        e.add(
          this.initializeAccount({
            votePubkey: t.votePubkey,
            nodePubkey: t.voteInit.nodePubkey,
            voteInit: t.voteInit,
          }),
        )
      );
    }
    static authorize(t) {
      let {
          votePubkey: e,
          authorizedPubkey: r,
          newAuthorizedPubkey: i,
          voteAuthorizationType: n,
        } = t,
        s = tz(rF.Authorize, {
          newAuthorized: Z(i.toBuffer()),
          voteAuthorizationType: n.index,
        }),
        o = [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ];
      return new tI().add({ keys: o, programId: this.programId, data: s });
    }
    static authorizeWithSeed(t) {
      let {
          currentAuthorityDerivedKeyBasePubkey: e,
          currentAuthorityDerivedKeyOwnerPubkey: r,
          currentAuthorityDerivedKeySeed: i,
          newAuthorizedPubkey: n,
          voteAuthorizationType: s,
          votePubkey: o,
        } = t,
        a = tz(rF.AuthorizeWithSeed, {
          voteAuthorizeWithSeedArgs: {
            currentAuthorityDerivedKeyOwnerPubkey: Z(r.toBuffer()),
            currentAuthorityDerivedKeySeed: i,
            newAuthorized: Z(n.toBuffer()),
            voteAuthorizationType: s.index,
          },
        }),
        u = [
          { pubkey: o, isSigner: !1, isWritable: !0 },
          { pubkey: tA, isSigner: !1, isWritable: !1 },
          { pubkey: e, isSigner: !0, isWritable: !1 },
        ];
      return new tI().add({ keys: u, programId: this.programId, data: a });
    }
    static withdraw(t) {
      let {
          votePubkey: e,
          authorizedWithdrawerPubkey: r,
          lamports: i,
          toPubkey: n,
        } = t,
        s = tz(rF.Withdraw, { lamports: i });
      return new tI().add({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: n, isSigner: !1, isWritable: !0 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: s,
      });
    }
    static safeWithdraw(t, e, r) {
      if (t.lamports > e - r)
        throw Error(
          "Withdraw will leave vote account with insufficient funds.",
        );
      return rj.withdraw(t);
    }
    static updateValidatorIdentity(t) {
      let { votePubkey: e, authorizedWithdrawerPubkey: r, nodePubkey: i } = t,
        n = tz(rF.UpdateValidatorIdentity);
      return new tI().add({
        keys: [
          { pubkey: e, isSigner: !1, isWritable: !0 },
          { pubkey: i, isSigner: !0, isWritable: !1 },
          { pubkey: r, isSigner: !0, isWritable: !1 },
        ],
        programId: this.programId,
        data: n,
      });
    }
  }
  ((rj.programId = new te("Vote111111111111111111111111111111111111111")),
    (rj.space = 3762));
  let rH = new te("Va1idator1nfo111111111111111111111111111111"),
    rJ = C({
      name: R(),
      website: P(R()),
      details: P(R()),
      iconUrl: P(R()),
      keybaseUsername: P(R()),
    }),
    rG = new te("Vote111111111111111111111111111111111111111"),
    rY = h.struct([
      ta("nodePubkey"),
      ta("authorizedWithdrawer"),
      h.u8("commission"),
      h.nu64(),
      h.seq(
        h.struct([h.nu64("slot"), h.u32("confirmationCount")]),
        h.offset(h.u32(), -8),
        "votes",
      ),
      h.u8("rootSlotValid"),
      h.nu64("rootSlot"),
      h.nu64(),
      h.seq(
        h.struct([h.nu64("epoch"), ta("authorizedVoter")]),
        h.offset(h.u32(), -8),
        "authorizedVoters",
      ),
      h.struct(
        [
          h.seq(
            h.struct([
              ta("authorizedPubkey"),
              h.nu64("epochOfLastAuthorizedSwitch"),
              h.nu64("targetEpoch"),
            ]),
            32,
            "buf",
          ),
          h.nu64("idx"),
          h.u8("isEmpty"),
        ],
        "priorVoters",
      ),
      h.nu64(),
      h.seq(
        h.struct([h.nu64("epoch"), h.nu64("credits"), h.nu64("prevCredits")]),
        h.offset(h.u32(), -8),
        "epochCredits",
      ),
      h.struct([h.nu64("slot"), h.nu64("timestamp")], "lastTimestamp"),
    ]);
  function rZ({ authorizedVoter: t, epoch: e }) {
    return { epoch: e, authorizedVoter: new te(t) };
  }
  function rX({
    authorizedPubkey: t,
    epochOfLastAuthorizedSwitch: e,
    targetEpoch: r,
  }) {
    return {
      authorizedPubkey: new te(t),
      epochOfLastAuthorizedSwitch: e,
      targetEpoch: r,
    };
  }
  let rQ = {
    http: {
      devnet: "http://api.devnet.solana.com",
      testnet: "http://api.testnet.solana.com",
      "mainnet-beta": "http://api.mainnet-beta.solana.com/",
    },
    https: {
      devnet: "https://api.devnet.solana.com",
      testnet: "https://api.testnet.solana.com",
      "mainnet-beta": "https://api.mainnet-beta.solana.com/",
    },
  };
  async function r0(t, e, r, i) {
    let n, s;
    (r && Object.prototype.hasOwnProperty.call(r, "lastValidBlockHeight")) ||
    (r && Object.prototype.hasOwnProperty.call(r, "nonceValue"))
      ? ((n = r), (s = i))
      : (s = r);
    let o = s && {
        skipPreflight: s.skipPreflight,
        preflightCommitment: s.preflightCommitment || s.commitment,
        minContextSlot: s.minContextSlot,
      },
      a = await t.sendRawTransaction(e, o),
      u = s && s.commitment,
      c = n ? t.confirmTransaction(n, u) : t.confirmTransaction(a, u),
      l = (await c).value;
    if (l.err) {
      if (null != a)
        throw new tC({
          action: o?.skipPreflight ? "send" : "simulate",
          signature: a,
          transactionMessage: `Status: (${JSON.stringify(l)})`,
        });
      throw Error(`Raw transaction ${a} failed (${JSON.stringify(l)})`);
    }
    return a;
  }
  t.s(
    [
      "Account",
      0,
      class {
        constructor(t) {
          if (((this._publicKey = void 0), (this._secretKey = void 0), t)) {
            let e = Z(t);
            if (64 !== t.length) throw Error("bad secret key size");
            ((this._publicKey = e.slice(32, 64)),
              (this._secretKey = e.slice(0, 32)));
          } else
            ((this._secretKey = Z(V())),
              (this._publicKey = Z(H(this._secretKey))));
        }
        get publicKey() {
          return new te(this._publicKey);
        }
        get secretKey() {
          return s.Buffer.concat([this._secretKey, this._publicKey], 64);
        }
      },
      "AddressLookupTableAccount",
      0,
      t0,
      "AddressLookupTableInstruction",
      0,
      class {
        static decodeInstructionType(t) {
          let e;
          this.checkProgramId(t.programId);
          let r = h.u32("instruction").decode(t.data);
          for (let [t, i] of Object.entries(rB))
            if (i.index == r) {
              e = t;
              break;
            }
          if (!e)
            throw Error(
              "Invalid Instruction. Should be a LookupTable Instruction",
            );
          return e;
        }
        static decodeCreateLookupTable(t) {
          (this.checkProgramId(t.programId), this.checkKeysLength(t.keys, 4));
          let { recentSlot: e } = tW(rB.CreateLookupTable, t.data);
          return {
            authority: t.keys[1].pubkey,
            payer: t.keys[2].pubkey,
            recentSlot: Number(e),
          };
        }
        static decodeExtendLookupTable(t) {
          if ((this.checkProgramId(t.programId), t.keys.length < 2))
            throw Error(
              `invalid instruction; found ${t.keys.length} keys, expected at least 2`,
            );
          let { addresses: e } = tW(rB.ExtendLookupTable, t.data);
          return {
            lookupTable: t.keys[0].pubkey,
            authority: t.keys[1].pubkey,
            payer: t.keys.length > 2 ? t.keys[2].pubkey : void 0,
            addresses: e.map((t) => new te(t)),
          };
        }
        static decodeCloseLookupTable(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeysLength(t.keys, 3),
            {
              lookupTable: t.keys[0].pubkey,
              authority: t.keys[1].pubkey,
              recipient: t.keys[2].pubkey,
            }
          );
        }
        static decodeFreezeLookupTable(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeysLength(t.keys, 2),
            { lookupTable: t.keys[0].pubkey, authority: t.keys[1].pubkey }
          );
        }
        static decodeDeactivateLookupTable(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeysLength(t.keys, 2),
            { lookupTable: t.keys[0].pubkey, authority: t.keys[1].pubkey }
          );
        }
        static checkProgramId(t) {
          if (!t.equals(rM.programId))
            throw Error(
              "invalid instruction; programId is not AddressLookupTable Program",
            );
        }
        static checkKeysLength(t, e) {
          if (t.length < e)
            throw Error(
              `invalid instruction; found ${t.length} keys, expected at least ${e}`,
            );
        }
      },
      "AddressLookupTableProgram",
      0,
      rM,
      "Authorized",
      0,
      rz,
      "BLOCKHASH_CACHE_TIMEOUT_MS",
      0,
      3e4,
      "BPF_LOADER_DEPRECATED_PROGRAM_ID",
      0,
      tr,
      "BPF_LOADER_PROGRAM_ID",
      0,
      tJ,
      "BpfLoader",
      0,
      class {
        static getMinNumSignatures(t) {
          return tH.getMinNumSignatures(t);
        }
        static load(t, e, r, i, n) {
          return tH.load(t, e, r, n, i);
        }
      },
      "COMPUTE_BUDGET_INSTRUCTION_LAYOUTS",
      0,
      rP,
      "ComputeBudgetInstruction",
      0,
      class {
        static decodeInstructionType(t) {
          let e;
          this.checkProgramId(t.programId);
          let r = h.u8("instruction").decode(t.data);
          for (let [t, i] of Object.entries(rP))
            if (i.index == r) {
              e = t;
              break;
            }
          if (!e)
            throw Error(
              "Instruction type incorrect; not a ComputeBudgetInstruction",
            );
          return e;
        }
        static decodeRequestUnits(t) {
          this.checkProgramId(t.programId);
          let { units: e, additionalFee: r } = tW(rP.RequestUnits, t.data);
          return { units: e, additionalFee: r };
        }
        static decodeRequestHeapFrame(t) {
          this.checkProgramId(t.programId);
          let { bytes: e } = tW(rP.RequestHeapFrame, t.data);
          return { bytes: e };
        }
        static decodeSetComputeUnitLimit(t) {
          this.checkProgramId(t.programId);
          let { units: e } = tW(rP.SetComputeUnitLimit, t.data);
          return { units: e };
        }
        static decodeSetComputeUnitPrice(t) {
          this.checkProgramId(t.programId);
          let { microLamports: e } = tW(rP.SetComputeUnitPrice, t.data);
          return { microLamports: e };
        }
        static checkProgramId(t) {
          if (!t.equals(rT.programId))
            throw Error(
              "invalid instruction; programId is not ComputeBudgetProgram",
            );
        }
      },
      "ComputeBudgetProgram",
      0,
      rT,
      "Connection",
      0,
      class {
        constructor(t, e) {
          var r, i, n, s, o, a, u;
          let c, l, h, f, d, p, g, m, y, b;
          ((this._commitment = void 0),
            (this._confirmTransactionInitialTimeout = void 0),
            (this._rpcEndpoint = void 0),
            (this._rpcWsEndpoint = void 0),
            (this._rpcClient = void 0),
            (this._rpcRequest = void 0),
            (this._rpcBatchRequest = void 0),
            (this._rpcWebSocket = void 0),
            (this._rpcWebSocketConnected = !1),
            (this._rpcWebSocketHeartbeat = null),
            (this._rpcWebSocketIdleTimeout = null),
            (this._rpcWebSocketGeneration = 0),
            (this._disableBlockhashCaching = !1),
            (this._pollingBlockhash = !1),
            (this._blockhashInfo = {
              latestBlockhash: null,
              lastFetch: 0,
              transactionSignatures: [],
              simulatedSignatures: [],
            }),
            (this._nextClientSubscriptionId = 0),
            (this._subscriptionDisposeFunctionsByClientSubscriptionId = {}),
            (this._subscriptionHashByClientSubscriptionId = {}),
            (this._subscriptionStateChangeCallbacksByHash = {}),
            (this._subscriptionCallbacksByServerSubscriptionId = {}),
            (this._subscriptionsByHash = {}),
            (this._subscriptionsAutoDisposedByRpc = new Set()),
            (this.getBlockHeight =
              ((g = {}),
              async (t) => {
                let { commitment: e, config: r } = t8(t),
                  i = this._buildArgs([], e, void 0, r),
                  n = tG(i);
                return (
                  (g[n] =
                    g[n] ??
                    (async () => {
                      try {
                        let t = await this._rpcRequest("getBlockHeight", i),
                          e = v(t, et(M()));
                        if ("error" in e)
                          throw new tO(
                            e.error,
                            "failed to get block height information",
                          );
                        return e.result;
                      } finally {
                        delete g[n];
                      }
                    })()),
                  await g[n]
                );
              })),
            e && "string" == typeof e
              ? (this._commitment = e)
              : e &&
                ((this._commitment = e.commitment),
                (this._confirmTransactionInitialTimeout =
                  e.confirmTransactionInitialTimeout),
                (c = e.wsEndpoint),
                (l = e.httpHeaders),
                (h = e.fetch),
                (f = e.fetchMiddleware),
                (d = e.disableRetryOnRateLimit),
                (p = e.httpAgent)),
            (this._rpcEndpoint = (function (t) {
              if (!1 === /^https?:/.test(t))
                throw TypeError(
                  "Endpoint URL must start with `http:` or `https:`.",
                );
              return t;
            })(t)),
            (this._rpcWsEndpoint =
              c ||
              (function (t) {
                let e = t.match(t2);
                if (null == e)
                  throw TypeError(`Failed to validate endpoint URL \`${t}\``);
                let [r, i, n, s] = e,
                  o = t.startsWith("https:") ? "wss:" : "ws:",
                  a = null == n ? null : parseInt(n.slice(1), 10),
                  u = null == a ? "" : `:${a + 1}`;
                return `${o}//${i}${u}${s}`;
              })(t)),
            (this._rpcClient =
              ((r = l),
              (i = h),
              (n = f),
              (s = d),
              (o = p),
              (b = i || tX),
              null != o &&
                console.warn(
                  "You have supplied an `httpAgent` when creating a `Connection` in a browser environment.It has been ignored; `httpAgent` is only used in Node environments.",
                ),
              n &&
                (y = async (t, e) => {
                  let r = await new Promise((r, i) => {
                    try {
                      n(t, e, (t, e) => r([t, e]));
                    } catch (t) {
                      i(t);
                    }
                  });
                  return await b(...r);
                }),
              new z.default(async (e, i) => {
                let n = {
                  method: "POST",
                  body: e,
                  agent: m,
                  headers: Object.assign(
                    { "Content-Type": "application/json" },
                    r || {},
                    rE,
                  ),
                };
                try {
                  let e,
                    r = 5,
                    o = 500;
                  for (
                    ;
                    ((e = y ? await y(t, n) : await b(t, n)),
                    429 === e.status && !0 !== s) && ((r -= 1), 0 !== r);

                  ) {
                    (console.error(
                      `Server responded with ${e.status} ${e.statusText}.  Retrying after ${o}ms delay...`,
                    ),
                      await tN(o),
                      (o *= 2));
                  }
                  let a = await e.text();
                  e.ok
                    ? i(null, a)
                    : i(Error(`${e.status} ${e.statusText}: ${a}`));
                } catch (t) {
                  t instanceof Error && i(t);
                }
              }, {}))),
            (this._rpcRequest =
              ((a = this._rpcClient),
              (t, e) =>
                new Promise((r, i) => {
                  a.request(t, e, (t, e) => {
                    t ? i(t) : r(e);
                  });
                }))),
            (this._rpcBatchRequest =
              ((u = this._rpcClient),
              (t) =>
                new Promise((e, r) => {
                  0 === t.length && e([]);
                  let i = t.map((t) => u.request(t.methodName, t.args));
                  u.request(i, (t, i) => {
                    t ? r(t) : e(i);
                  });
                }))),
            (this._rpcWebSocket = new tQ(this._rpcWsEndpoint, {
              autoconnect: !1,
              max_reconnects: 1 / 0,
            })),
            this._rpcWebSocket.on("open", this._wsOnOpen.bind(this)),
            this._rpcWebSocket.on("error", this._wsOnError.bind(this)),
            this._rpcWebSocket.on("close", this._wsOnClose.bind(this)),
            this._rpcWebSocket.on(
              "accountNotification",
              this._wsOnAccountNotification.bind(this),
            ),
            this._rpcWebSocket.on(
              "programNotification",
              this._wsOnProgramAccountNotification.bind(this),
            ),
            this._rpcWebSocket.on(
              "slotNotification",
              this._wsOnSlotNotification.bind(this),
            ),
            this._rpcWebSocket.on(
              "slotsUpdatesNotification",
              this._wsOnSlotUpdatesNotification.bind(this),
            ),
            this._rpcWebSocket.on(
              "signatureNotification",
              this._wsOnSignatureNotification.bind(this),
            ),
            this._rpcWebSocket.on(
              "rootNotification",
              this._wsOnRootNotification.bind(this),
            ),
            this._rpcWebSocket.on(
              "logsNotification",
              this._wsOnLogsNotification.bind(this),
            ));
        }
        get commitment() {
          return this._commitment;
        }
        get rpcEndpoint() {
          return this._rpcEndpoint;
        }
        async getBalanceAndContext(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgs([t.toBase58()], r, void 0, i),
            s = v(await this._rpcRequest("getBalance", n), ee(M()));
          if ("error" in s)
            throw new tO(s.error, `failed to get balance for ${t.toBase58()}`);
          return s.result;
        }
        async getBalance(t, e) {
          return await this.getBalanceAndContext(t, e)
            .then((t) => t.value)
            .catch((e) => {
              throw Error(
                "failed to get balance of account " + t.toBase58() + ": " + e,
              );
            });
        }
        async getBlockTime(t) {
          let e = v(await this._rpcRequest("getBlockTime", [t]), et(B(M())));
          if ("error" in e)
            throw new tO(e.error, `failed to get block time for slot ${t}`);
          return e.result;
        }
        async getMinimumLedgerSlot() {
          let t = v(await this._rpcRequest("minimumLedgerSlot", []), et(M()));
          if ("error" in t)
            throw new tO(t.error, "failed to get minimum ledger slot");
          return t.result;
        }
        async getFirstAvailableBlock() {
          let t = v(await this._rpcRequest("getFirstAvailableBlock", []), eA);
          if ("error" in t)
            throw new tO(t.error, "failed to get first available block");
          return t.result;
        }
        async getSupply(t) {
          let e = {};
          e =
            "string" == typeof t
              ? { commitment: t }
              : t
                ? { ...t, commitment: (t && t.commitment) || this.commitment }
                : { commitment: this.commitment };
          let r = v(await this._rpcRequest("getSupply", [e]), eE);
          if ("error" in r) throw new tO(r.error, "failed to get supply");
          return r.result;
        }
        async getTokenSupply(t, e) {
          let r = this._buildArgs([t.toBase58()], e),
            i = v(await this._rpcRequest("getTokenSupply", r), ee(ex));
          if ("error" in i) throw new tO(i.error, "failed to get token supply");
          return i.result;
        }
        async getTokenAccountBalance(t, e) {
          let r = this._buildArgs([t.toBase58()], e),
            i = v(await this._rpcRequest("getTokenAccountBalance", r), ee(ex));
          if ("error" in i)
            throw new tO(i.error, "failed to get token account balance");
          return i.result;
        }
        async getTokenAccountsByOwner(t, e, r) {
          let { commitment: i, config: n } = t8(r),
            s = [t.toBase58()];
          "mint" in e
            ? s.push({ mint: e.mint.toBase58() })
            : s.push({ programId: e.programId.toBase58() });
          let o = this._buildArgs(s, i, "base64", n),
            a = v(await this._rpcRequest("getTokenAccountsByOwner", o), eM);
          if ("error" in a)
            throw new tO(
              a.error,
              `failed to get token accounts owned by account ${t.toBase58()}`,
            );
          return a.result;
        }
        async getParsedTokenAccountsByOwner(t, e, r) {
          let i = [t.toBase58()];
          "mint" in e
            ? i.push({ mint: e.mint.toBase58() })
            : i.push({ programId: e.programId.toBase58() });
          let n = this._buildArgs(i, r, "jsonParsed"),
            s = v(await this._rpcRequest("getTokenAccountsByOwner", n), eT);
          if ("error" in s)
            throw new tO(
              s.error,
              `failed to get token accounts owned by account ${t.toBase58()}`,
            );
          return s.result;
        }
        async getLargestAccounts(t) {
          let e = { ...t, commitment: (t && t.commitment) || this.commitment },
            r = e.filter || e.commitment ? [e] : [],
            i = v(await this._rpcRequest("getLargestAccounts", r), eR);
          if ("error" in i)
            throw new tO(i.error, "failed to get largest accounts");
          return i.result;
        }
        async getTokenLargestAccounts(t, e) {
          let r = this._buildArgs([t.toBase58()], e),
            i = v(await this._rpcRequest("getTokenLargestAccounts", r), eB);
          if ("error" in i)
            throw new tO(i.error, "failed to get token largest accounts");
          return i.result;
        }
        async getAccountInfoAndContext(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgs([t.toBase58()], r, "base64", i),
            s = v(await this._rpcRequest("getAccountInfo", n), ee(B(eL)));
          if ("error" in s)
            throw new tO(
              s.error,
              `failed to get info about account ${t.toBase58()}`,
            );
          return s.result;
        }
        async getParsedAccountInfo(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgs([t.toBase58()], r, "jsonParsed", i),
            s = v(await this._rpcRequest("getAccountInfo", n), ee(B(eU)));
          if ("error" in s)
            throw new tO(
              s.error,
              `failed to get info about account ${t.toBase58()}`,
            );
          return s.result;
        }
        async getAccountInfo(t, e) {
          try {
            return (await this.getAccountInfoAndContext(t, e)).value;
          } catch (e) {
            throw Error(
              "failed to get info about account " + t.toBase58() + ": " + e,
            );
          }
        }
        async getMultipleParsedAccounts(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = t.map((t) => t.toBase58()),
            s = this._buildArgs([n], r, "jsonParsed", i),
            o = v(
              await this._rpcRequest("getMultipleAccounts", s),
              ee(I(B(eU))),
            );
          if ("error" in o)
            throw new tO(o.error, `failed to get info for accounts ${n}`);
          return o.result;
        }
        async getMultipleAccountsInfoAndContext(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = t.map((t) => t.toBase58()),
            s = this._buildArgs([n], r, "base64", i),
            o = v(
              await this._rpcRequest("getMultipleAccounts", s),
              ee(I(B(eL))),
            );
          if ("error" in o)
            throw new tO(o.error, `failed to get info for accounts ${n}`);
          return o.result;
        }
        async getMultipleAccountsInfo(t, e) {
          return (await this.getMultipleAccountsInfoAndContext(t, e)).value;
        }
        async getStakeActivation(t, e, r) {
          let { commitment: i, config: n } = t8(e),
            s = this._buildArgs([t.toBase58()], i, void 0, {
              ...n,
              epoch: null != r ? r : n?.epoch,
            }),
            o = v(await this._rpcRequest("getStakeActivation", s), et(ez));
          if ("error" in o)
            throw new tO(
              o.error,
              `failed to get Stake Activation ${t.toBase58()}`,
            );
          return o.result;
        }
        async getProgramAccounts(t, e) {
          let { commitment: r, config: i } = t8(e),
            { encoding: n, ...s } = i || {},
            o = this._buildArgs([t.toBase58()], r, n || "base64", {
              ...s,
              ...(s.filters ? { filters: t4(s.filters) } : null),
            }),
            a = await this._rpcRequest("getProgramAccounts", o),
            u = I(eC),
            c = !0 === s.withContext ? v(a, ee(u)) : v(a, et(u));
          if ("error" in c)
            throw new tO(
              c.error,
              `failed to get accounts owned by program ${t.toBase58()}`,
            );
          return c.result;
        }
        async getParsedProgramAccounts(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgs([t.toBase58()], r, "jsonParsed", i),
            s = v(await this._rpcRequest("getProgramAccounts", n), et(I(eN)));
          if ("error" in s)
            throw new tO(
              s.error,
              `failed to get accounts owned by program ${t.toBase58()}`,
            );
          return s.result;
        }
        async confirmTransaction(t, e) {
          let r, i;
          if ("string" == typeof t) r = t;
          else {
            if (t.abortSignal?.aborted)
              return Promise.reject(t.abortSignal.reason);
            r = t.signature;
          }
          try {
            i = u.f.decode(r);
          } catch (t) {
            throw Error("signature must be base58 encoded: " + r);
          }
          return (th(64 === i.length, "signature has invalid length"),
          "string" == typeof t)
            ? await this.confirmTransactionUsingLegacyTimeoutStrategy({
                commitment: e || this.commitment,
                signature: r,
              })
            : "lastValidBlockHeight" in t
              ? await this.confirmTransactionUsingBlockHeightExceedanceStrategy(
                  { commitment: e || this.commitment, strategy: t },
                )
              : await this.confirmTransactionUsingDurableNonceStrategy({
                  commitment: e || this.commitment,
                  strategy: t,
                });
        }
        getCancellationPromise(t) {
          return new Promise((e, r) => {
            null != t &&
              (t.aborted
                ? r(t.reason)
                : t.addEventListener("abort", () => {
                    r(t.reason);
                  }));
          });
        }
        getTransactionConfirmationPromise({ commitment: t, signature: e }) {
          let r,
            i,
            n = !1;
          return {
            abortConfirmation: () => {
              (i && (i(), (i = void 0)),
                null != r && (this.removeSignatureListener(r), (r = void 0)));
            },
            confirmationPromise: new Promise((s, o) => {
              try {
                r = this.onSignature(
                  e,
                  (t, e) => {
                    ((r = void 0),
                      s({
                        __type: tv.PROCESSED,
                        response: { context: e, value: t },
                      }));
                  },
                  t,
                );
                let a = new Promise((t) => {
                  null == r
                    ? t()
                    : (i = this._onSubscriptionStateChange(r, (e) => {
                        "subscribed" === e && t();
                      }));
                });
                (async () => {
                  if ((await a, n)) return;
                  let r = await this.getSignatureStatus(e);
                  if (n || null == r) return;
                  let { context: i, value: u } = r;
                  if (null != u)
                    if (u?.err) o(u.err);
                    else {
                      switch (t) {
                        case "confirmed":
                        case "single":
                        case "singleGossip":
                          if ("processed" === u.confirmationStatus) return;
                          break;
                        case "finalized":
                        case "max":
                        case "root":
                          if (
                            "processed" === u.confirmationStatus ||
                            "confirmed" === u.confirmationStatus
                          )
                            return;
                      }
                      ((n = !0),
                        s({
                          __type: tv.PROCESSED,
                          response: { context: i, value: u },
                        }));
                    }
                })();
              } catch (t) {
                o(t);
              }
            }),
          };
        }
        async confirmTransactionUsingBlockHeightExceedanceStrategy({
          commitment: t,
          strategy: { abortSignal: e, lastValidBlockHeight: r, signature: i },
        }) {
          let n,
            s = !1,
            o = new Promise((e) => {
              let i = async () => {
                try {
                  return await this.getBlockHeight(t);
                } catch (t) {
                  return -1;
                }
              };
              (async () => {
                let t = await i();
                if (!s) {
                  for (; t <= r; )
                    if ((await tN(1e3), s || ((t = await i()), s))) return;
                  e({ __type: tv.BLOCKHEIGHT_EXCEEDED });
                }
              })();
            }),
            { abortConfirmation: a, confirmationPromise: u } =
              this.getTransactionConfirmationPromise({
                commitment: t,
                signature: i,
              }),
            c = this.getCancellationPromise(e);
          try {
            let t = await Promise.race([c, u, o]);
            if (t.__type === tv.PROCESSED) n = t.response;
            else throw new ti(i);
          } finally {
            ((s = !0), a());
          }
          return n;
        }
        async confirmTransactionUsingDurableNonceStrategy({
          commitment: t,
          strategy: {
            abortSignal: e,
            minContextSlot: r,
            nonceAccountPubkey: i,
            nonceValue: n,
            signature: s,
          },
        }) {
          let o,
            a = !1,
            u = new Promise((e) => {
              let s = n,
                o = null,
                u = async () => {
                  try {
                    let { context: e, value: n } =
                      await this.getNonceAndContext(i, {
                        commitment: t,
                        minContextSlot: r,
                      });
                    return ((o = e.slot), n?.nonce);
                  } catch (t) {
                    return s;
                  }
                };
              (async () => {
                if (((s = await u()), !a))
                  for (;;) {
                    if (n !== s)
                      return void e({
                        __type: tv.NONCE_INVALID,
                        slotInWhichNonceDidAdvance: o,
                      });
                    if ((await tN(2e3), a || ((s = await u()), a))) return;
                  }
              })();
            }),
            { abortConfirmation: c, confirmationPromise: l } =
              this.getTransactionConfirmationPromise({
                commitment: t,
                signature: s,
              }),
            h = this.getCancellationPromise(e);
          try {
            let e = await Promise.race([h, l, u]);
            if (e.__type === tv.PROCESSED) o = e.response;
            else {
              let i;
              for (;;) {
                let t = await this.getSignatureStatus(s);
                if (null == t) break;
                if (t.context.slot < (e.slotInWhichNonceDidAdvance ?? r)) {
                  await tN(400);
                  continue;
                }
                i = t;
                break;
              }
              if (i?.value) {
                let e = t || "finalized",
                  { confirmationStatus: r } = i.value;
                switch (e) {
                  case "processed":
                  case "recent":
                    if (
                      "processed" !== r &&
                      "confirmed" !== r &&
                      "finalized" !== r
                    )
                      throw new ts(s);
                    break;
                  case "confirmed":
                  case "single":
                  case "singleGossip":
                    if ("confirmed" !== r && "finalized" !== r) throw new ts(s);
                    break;
                  case "finalized":
                  case "max":
                  case "root":
                    if ("finalized" !== r) throw new ts(s);
                }
                o = { context: i.context, value: { err: i.value.err } };
              } else throw new ts(s);
            }
          } finally {
            ((a = !0), c());
          }
          return o;
        }
        async confirmTransactionUsingLegacyTimeoutStrategy({
          commitment: t,
          signature: e,
        }) {
          let r,
            i,
            n = new Promise((e) => {
              let i = this._confirmTransactionInitialTimeout || 6e4;
              switch (t) {
                case "processed":
                case "recent":
                case "single":
                case "confirmed":
                case "singleGossip":
                  i = this._confirmTransactionInitialTimeout || 3e4;
              }
              r = setTimeout(
                () => e({ __type: tv.TIMED_OUT, timeoutMs: i }),
                i,
              );
            }),
            { abortConfirmation: s, confirmationPromise: o } =
              this.getTransactionConfirmationPromise({
                commitment: t,
                signature: e,
              });
          try {
            let t = await Promise.race([o, n]);
            if (t.__type === tv.PROCESSED) i = t.response;
            else throw new tn(e, t.timeoutMs / 1e3);
          } finally {
            (clearTimeout(r), s());
          }
          return i;
        }
        async getClusterNodes() {
          let t = v(await this._rpcRequest("getClusterNodes", []), et(I(eY)));
          if ("error" in t)
            throw new tO(t.error, "failed to get cluster nodes");
          return t.result;
        }
        async getVoteAccounts(t) {
          let e = this._buildArgs([], t),
            r = v(await this._rpcRequest("getVoteAccounts", e), eX);
          if ("error" in r)
            throw new tO(r.error, "failed to get vote accounts");
          return r.result;
        }
        async getSlot(t) {
          let { commitment: e, config: r } = t8(t),
            i = this._buildArgs([], e, void 0, r),
            n = v(await this._rpcRequest("getSlot", i), et(M()));
          if ("error" in n) throw new tO(n.error, "failed to get slot");
          return n.result;
        }
        async getSlotLeader(t) {
          let { commitment: e, config: r } = t8(t),
            i = this._buildArgs([], e, void 0, r),
            n = v(await this._rpcRequest("getSlotLeader", i), et(R()));
          if ("error" in n) throw new tO(n.error, "failed to get slot leader");
          return n.result;
        }
        async getSlotLeaders(t, e) {
          let r = v(
            await this._rpcRequest("getSlotLeaders", [t, e]),
            et(I(t3)),
          );
          if ("error" in r) throw new tO(r.error, "failed to get slot leaders");
          return r.result;
        }
        async getSignatureStatus(t, e) {
          let { context: r, value: i } = await this.getSignatureStatuses(
            [t],
            e,
          );
          return (th(1 === i.length), { context: r, value: i[0] });
        }
        async getSignatureStatuses(t, e) {
          let r = [t];
          e && r.push(e);
          let i = v(await this._rpcRequest("getSignatureStatuses", r), e1);
          if ("error" in i)
            throw new tO(i.error, "failed to get signature status");
          return i.result;
        }
        async getTransactionCount(t) {
          let { commitment: e, config: r } = t8(t),
            i = this._buildArgs([], e, void 0, r),
            n = v(await this._rpcRequest("getTransactionCount", i), et(M()));
          if ("error" in n)
            throw new tO(n.error, "failed to get transaction count");
          return n.result;
        }
        async getTotalSupply(t) {
          return (
            await this.getSupply({
              commitment: t,
              excludeNonCirculatingAccountsList: !0,
            })
          ).value.total;
        }
        async getInflationGovernor(t) {
          let e = this._buildArgs([], t),
            r = v(await this._rpcRequest("getInflationGovernor", e), ew);
          if ("error" in r) throw new tO(r.error, "failed to get inflation");
          return r.result;
        }
        async getInflationReward(t, e, r) {
          let { commitment: i, config: n } = t8(r),
            s = this._buildArgs([t.map((t) => t.toBase58())], i, void 0, {
              ...n,
              epoch: null != e ? e : n?.epoch,
            }),
            o = v(await this._rpcRequest("getInflationReward", s), es);
          if ("error" in o)
            throw new tO(o.error, "failed to get inflation reward");
          return o.result;
        }
        async getInflationRate() {
          let t = v(await this._rpcRequest("getInflationRate", []), ek);
          if ("error" in t)
            throw new tO(t.error, "failed to get inflation rate");
          return t.result;
        }
        async getEpochInfo(t) {
          let { commitment: e, config: r } = t8(t),
            i = this._buildArgs([], e, void 0, r),
            n = v(await this._rpcRequest("getEpochInfo", i), eS);
          if ("error" in n) throw new tO(n.error, "failed to get epoch info");
          return n.result;
        }
        async getEpochSchedule() {
          let t = v(await this._rpcRequest("getEpochSchedule", []), e_);
          if ("error" in t)
            throw new tO(t.error, "failed to get epoch schedule");
          let e = t.result;
          return new tZ(
            e.slotsPerEpoch,
            e.leaderScheduleSlotOffset,
            e.warmup,
            e.firstNormalEpoch,
            e.firstNormalSlot,
          );
        }
        async getLeaderSchedule() {
          let t = v(await this._rpcRequest("getLeaderSchedule", []), eI);
          if ("error" in t)
            throw new tO(t.error, "failed to get leader schedule");
          return t.result;
        }
        async getMinimumBalanceForRentExemption(t, e) {
          let r = this._buildArgs([t], e),
            i = v(
              await this._rpcRequest("getMinimumBalanceForRentExemption", r),
              e2,
            );
          return "error" in i
            ? (console.warn(
                "Unable to fetch minimum balance for rent exemption",
              ),
              0)
            : i.result;
        }
        async getRecentBlockhashAndContext(t) {
          let {
            context: e,
            value: { blockhash: r },
          } = await this.getLatestBlockhashAndContext(t);
          return {
            context: e,
            value: {
              blockhash: r,
              feeCalculator: {
                get lamportsPerSignature() {
                  throw Error(
                    "The capability to fetch `lamportsPerSignature` using the `getRecentBlockhash` API is no longer offered by the network. Use the `getFeeForMessage` API to obtain the fee for a given message.",
                  );
                },
                toJSON: () => ({}),
              },
            },
          };
        }
        async getRecentPerformanceSamples(t) {
          let e = v(
            await this._rpcRequest("getRecentPerformanceSamples", t ? [t] : []),
            rk,
          );
          if ("error" in e)
            throw new tO(e.error, "failed to get recent performance samples");
          return e.result;
        }
        async getFeeCalculatorForBlockhash(t, e) {
          let r = this._buildArgs([t], e),
            i = v(
              await this._rpcRequest("getFeeCalculatorForBlockhash", r),
              rv,
            );
          if ("error" in i)
            throw new tO(i.error, "failed to get fee calculator");
          let { context: n, value: s } = i.result;
          return { context: n, value: null !== s ? s.feeCalculator : null };
        }
        async getFeeForMessage(t, e) {
          let r = Z(t.serialize()).toString("base64"),
            i = this._buildArgs([r], e),
            n = v(await this._rpcRequest("getFeeForMessage", i), ee(B(M())));
          if ("error" in n)
            throw new tO(n.error, "failed to get fee for message");
          if (null === n.result) throw Error("invalid blockhash");
          return n.result;
        }
        async getRecentPrioritizationFees(t) {
          let e = t?.lockedWritableAccounts?.map((t) => t.toBase58()),
            r = e?.length ? [e] : [],
            i = v(await this._rpcRequest("getRecentPrioritizationFees", r), ev);
          if ("error" in i)
            throw new tO(i.error, "failed to get recent prioritization fees");
          return i.result;
        }
        async getRecentBlockhash(t) {
          try {
            return (await this.getRecentBlockhashAndContext(t)).value;
          } catch (t) {
            throw Error("failed to get recent blockhash: " + t);
          }
        }
        async getLatestBlockhash(t) {
          try {
            return (await this.getLatestBlockhashAndContext(t)).value;
          } catch (t) {
            throw Error("failed to get recent blockhash: " + t);
          }
        }
        async getLatestBlockhashAndContext(t) {
          let { commitment: e, config: r } = t8(t),
            i = this._buildArgs([], e, void 0, r),
            n = v(await this._rpcRequest("getLatestBlockhash", i), rb);
          if ("error" in n)
            throw new tO(n.error, "failed to get latest blockhash");
          return n.result;
        }
        async isBlockhashValid(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgs([t], r, void 0, i),
            s = v(await this._rpcRequest("isBlockhashValid", n), rw);
          if ("error" in s)
            throw new tO(
              s.error,
              "failed to determine if the blockhash `" + t + "`is valid",
            );
          return s.result;
        }
        async getVersion() {
          let t = v(await this._rpcRequest("getVersion", []), et(ep));
          if ("error" in t) throw new tO(t.error, "failed to get version");
          return t.result;
        }
        async getGenesisHash() {
          let t = v(await this._rpcRequest("getGenesisHash", []), et(R()));
          if ("error" in t) throw new tO(t.error, "failed to get genesis hash");
          return t.result;
        }
        async getBlock(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgsAtLeastConfirmed([t], r, void 0, i),
            s = await this._rpcRequest("getBlock", n);
          try {
            switch (i?.transactionDetails) {
              case "accounts": {
                let t = v(s, rl);
                if ("error" in t) throw t.error;
                return t.result;
              }
              case "none": {
                let t = v(s, rc);
                if ("error" in t) throw t.error;
                return t.result;
              }
              default: {
                let t = v(s, ru);
                if ("error" in t) throw t.error;
                let { result: e } = t;
                return e
                  ? {
                      ...e,
                      transactions: e.transactions.map(
                        ({ transaction: t, meta: e, version: r }) => ({
                          meta: e,
                          transaction: { ...t, message: ei(r, t.message) },
                          version: r,
                        }),
                      ),
                    }
                  : null;
              }
            }
          } catch (t) {
            throw new tO(t, "failed to get confirmed block");
          }
        }
        async getParsedBlock(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgsAtLeastConfirmed([t], r, "jsonParsed", i),
            s = await this._rpcRequest("getBlock", n);
          try {
            switch (i?.transactionDetails) {
              case "accounts": {
                let t = v(s, rf);
                if ("error" in t) throw t.error;
                return t.result;
              }
              case "none": {
                let t = v(s, rd);
                if ("error" in t) throw t.error;
                return t.result;
              }
              default: {
                let t = v(s, rh);
                if ("error" in t) throw t.error;
                return t.result;
              }
            }
          } catch (t) {
            throw new tO(t, "failed to get block");
          }
        }
        async getBlockProduction(t) {
          let e, r;
          if ("string" == typeof t) r = t;
          else if (t) {
            let { commitment: i, ...n } = t;
            ((r = i), (e = n));
          }
          let i = this._buildArgs([], r, "base64", e),
            n = v(await this._rpcRequest("getBlockProduction", i), eb);
          if ("error" in n)
            throw new tO(n.error, "failed to get block production information");
          return n.result;
        }
        async getTransaction(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgsAtLeastConfirmed([t], r, void 0, i),
            s = v(await this._rpcRequest("getTransaction", n), rm);
          if ("error" in s) throw new tO(s.error, "failed to get transaction");
          let o = s.result;
          return o
            ? {
                ...o,
                transaction: {
                  ...o.transaction,
                  message: ei(o.version, o.transaction.message),
                },
              }
            : o;
        }
        async getParsedTransaction(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = this._buildArgsAtLeastConfirmed([t], r, "jsonParsed", i),
            s = v(await this._rpcRequest("getTransaction", n), ry);
          if ("error" in s) throw new tO(s.error, "failed to get transaction");
          return s.result;
        }
        async getParsedTransactions(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = t.map((t) => ({
              methodName: "getTransaction",
              args: this._buildArgsAtLeastConfirmed([t], r, "jsonParsed", i),
            }));
          return (await this._rpcBatchRequest(n)).map((t) => {
            let e = v(t, ry);
            if ("error" in e)
              throw new tO(e.error, "failed to get transactions");
            return e.result;
          });
        }
        async getTransactions(t, e) {
          let { commitment: r, config: i } = t8(e),
            n = t.map((t) => ({
              methodName: "getTransaction",
              args: this._buildArgsAtLeastConfirmed([t], r, void 0, i),
            }));
          return (await this._rpcBatchRequest(n)).map((t) => {
            let e = v(t, rm);
            if ("error" in e)
              throw new tO(e.error, "failed to get transactions");
            let r = e.result;
            return r
              ? {
                  ...r,
                  transaction: {
                    ...r.transaction,
                    message: ei(r.version, r.transaction.message),
                  },
                }
              : r;
          });
        }
        async getConfirmedBlock(t, e) {
          let r = this._buildArgsAtLeastConfirmed([t], e),
            i = v(await this._rpcRequest("getBlock", r), rp);
          if ("error" in i)
            throw new tO(i.error, "failed to get confirmed block");
          let n = i.result;
          if (!n) throw Error("Confirmed block " + t + " not found");
          let s = {
            ...n,
            transactions: n.transactions.map(({ transaction: t, meta: e }) => {
              let r = new tm(t.message);
              return { meta: e, transaction: { ...t, message: r } };
            }),
          };
          return {
            ...s,
            transactions: s.transactions.map(({ transaction: t, meta: e }) => ({
              meta: e,
              transaction: tI.populate(t.message, t.signatures),
            })),
          };
        }
        async getBlocks(t, e, r) {
          let i = this._buildArgsAtLeastConfirmed(
              void 0 !== e ? [t, e] : [t],
              r,
            ),
            n = v(await this._rpcRequest("getBlocks", i), et(I(M())));
          if ("error" in n) throw new tO(n.error, "failed to get blocks");
          return n.result;
        }
        async getBlockSignatures(t, e) {
          let r = this._buildArgsAtLeastConfirmed([t], e, void 0, {
              transactionDetails: "signatures",
              rewards: !1,
            }),
            i = v(await this._rpcRequest("getBlock", r), rg);
          if ("error" in i) throw new tO(i.error, "failed to get block");
          let n = i.result;
          if (!n) throw Error("Block " + t + " not found");
          return n;
        }
        async getConfirmedBlockSignatures(t, e) {
          let r = this._buildArgsAtLeastConfirmed([t], e, void 0, {
              transactionDetails: "signatures",
              rewards: !1,
            }),
            i = v(await this._rpcRequest("getBlock", r), rg);
          if ("error" in i)
            throw new tO(i.error, "failed to get confirmed block");
          let n = i.result;
          if (!n) throw Error("Confirmed block " + t + " not found");
          return n;
        }
        async getConfirmedTransaction(t, e) {
          let r = this._buildArgsAtLeastConfirmed([t], e),
            i = v(await this._rpcRequest("getTransaction", r), rm);
          if ("error" in i) throw new tO(i.error, "failed to get transaction");
          let n = i.result;
          if (!n) return n;
          let s = new tm(n.transaction.message),
            o = n.transaction.signatures;
          return { ...n, transaction: tI.populate(s, o) };
        }
        async getParsedConfirmedTransaction(t, e) {
          let r = this._buildArgsAtLeastConfirmed([t], e, "jsonParsed"),
            i = v(await this._rpcRequest("getTransaction", r), ry);
          if ("error" in i)
            throw new tO(i.error, "failed to get confirmed transaction");
          return i.result;
        }
        async getParsedConfirmedTransactions(t, e) {
          let r = t.map((t) => ({
            methodName: "getTransaction",
            args: this._buildArgsAtLeastConfirmed([t], e, "jsonParsed"),
          }));
          return (await this._rpcBatchRequest(r)).map((t) => {
            let e = v(t, ry);
            if ("error" in e)
              throw new tO(e.error, "failed to get confirmed transactions");
            return e.result;
          });
        }
        async getConfirmedSignaturesForAddress(t, e, r) {
          let i = {},
            n = await this.getFirstAvailableBlock();
          for (; !("until" in i) && !(--e <= 0) && !(e < n); )
            try {
              let t = await this.getConfirmedBlockSignatures(e, "finalized");
              t.signatures.length > 0 &&
                (i.until = t.signatures[t.signatures.length - 1].toString());
            } catch (t) {
              if (t instanceof Error && t.message.includes("skipped")) continue;
              throw t;
            }
          let s = await this.getSlot("finalized");
          for (; !("before" in i) && !(++r > s); )
            try {
              let t = await this.getConfirmedBlockSignatures(r);
              t.signatures.length > 0 &&
                (i.before = t.signatures[t.signatures.length - 1].toString());
            } catch (t) {
              if (t instanceof Error && t.message.includes("skipped")) continue;
              throw t;
            }
          return (await this.getConfirmedSignaturesForAddress2(t, i)).map(
            (t) => t.signature,
          );
        }
        async getConfirmedSignaturesForAddress2(t, e, r) {
          let i = this._buildArgsAtLeastConfirmed([t.toBase58()], r, void 0, e),
            n = v(
              await this._rpcRequest("getConfirmedSignaturesForAddress2", i),
              eW,
            );
          if ("error" in n)
            throw new tO(
              n.error,
              "failed to get confirmed signatures for address",
            );
          return n.result;
        }
        async getSignaturesForAddress(t, e, r) {
          let i = this._buildArgsAtLeastConfirmed([t.toBase58()], r, void 0, e),
            n = v(await this._rpcRequest("getSignaturesForAddress", i), eK);
          if ("error" in n)
            throw new tO(n.error, "failed to get signatures for address");
          return n.result;
        }
        async getAddressLookupTable(t, e) {
          let { context: r, value: i } = await this.getAccountInfoAndContext(
              t,
              e,
            ),
            n = null;
          return (
            null !== i &&
              (n = new t0({ key: t, state: t0.deserialize(i.data) })),
            { context: r, value: n }
          );
        }
        async getNonceAndContext(t, e) {
          let { context: r, value: i } = await this.getAccountInfoAndContext(
              t,
              e,
            ),
            n = null;
          return (
            null !== i && (n = t$.fromAccountData(i.data)),
            { context: r, value: n }
          );
        }
        async getNonce(t, e) {
          return await this.getNonceAndContext(t, e)
            .then((t) => t.value)
            .catch((e) => {
              throw Error(
                "failed to get nonce for account " + t.toBase58() + ": " + e,
              );
            });
        }
        async requestAirdrop(t, e) {
          let r = v(
            await this._rpcRequest("requestAirdrop", [t.toBase58(), e]),
            rS,
          );
          if ("error" in r)
            throw new tO(r.error, `airdrop to ${t.toBase58()} failed`);
          return r.result;
        }
        async _blockhashWithExpiryBlockHeight(t) {
          if (!t) {
            for (; this._pollingBlockhash; ) await tN(100);
            let t = Date.now() - this._blockhashInfo.lastFetch;
            if (null !== this._blockhashInfo.latestBlockhash && !(t >= 3e4))
              return this._blockhashInfo.latestBlockhash;
          }
          return await this._pollNewBlockhash();
        }
        async _pollNewBlockhash() {
          this._pollingBlockhash = !0;
          try {
            let t = Date.now(),
              e = this._blockhashInfo.latestBlockhash,
              r = e ? e.blockhash : null;
            for (let t = 0; t < 50; t++) {
              let t = await this.getLatestBlockhash("finalized");
              if (r !== t.blockhash)
                return (
                  (this._blockhashInfo = {
                    latestBlockhash: t,
                    lastFetch: Date.now(),
                    transactionSignatures: [],
                    simulatedSignatures: [],
                  }),
                  t
                );
              await tN(200);
            }
            throw Error(
              `Unable to obtain a new blockhash after ${Date.now() - t}ms`,
            );
          } finally {
            this._pollingBlockhash = !1;
          }
        }
        async getStakeMinimumDelegation(t) {
          let { commitment: e, config: r } = t8(t),
            i = this._buildArgs([], e, "base64", r),
            n = v(
              await this._rpcRequest("getStakeMinimumDelegation", i),
              ee(M()),
            );
          if ("error" in n)
            throw new tO(n.error, "failed to get stake minimum delegation");
          return n.result;
        }
        async simulateTransaction(t, e, r) {
          let i;
          if ("message" in t) {
            let i = t.serialize(),
              n = s.Buffer.from(i).toString("base64");
            if (Array.isArray(e) || void 0 !== r)
              throw Error("Invalid arguments");
            let o = e || {};
            ((o.encoding = "base64"),
              "commitment" in o || (o.commitment = this.commitment),
              e &&
                "object" == typeof e &&
                "innerInstructions" in e &&
                (o.innerInstructions = e.innerInstructions));
            let a = [n, o],
              u = v(await this._rpcRequest("simulateTransaction", a), ey);
            if ("error" in u)
              throw Error("failed to simulate transaction: " + u.error.message);
            return u.result;
          }
          if (
            (t instanceof tI
              ? (((i = new tI()).feePayer = t.feePayer),
                (i.instructions = t.instructions),
                (i.nonceInfo = t.nonceInfo),
                (i.signatures = t.signatures))
              : ((i = tI.populate(t))._message = i._json = void 0),
            void 0 !== e && !Array.isArray(e))
          )
            throw Error("Invalid arguments");
          if (i.nonceInfo && e) i.sign(...e);
          else {
            let t = this._disableBlockhashCaching;
            for (;;) {
              let r = await this._blockhashWithExpiryBlockHeight(t);
              if (
                ((i.lastValidBlockHeight = r.lastValidBlockHeight),
                (i.recentBlockhash = r.blockhash),
                !e)
              )
                break;
              if ((i.sign(...e), !i.signature)) throw Error("!signature");
              let n = i.signature.toString("base64");
              if (
                this._blockhashInfo.simulatedSignatures.includes(n) ||
                this._blockhashInfo.transactionSignatures.includes(n)
              )
                t = !0;
              else {
                this._blockhashInfo.simulatedSignatures.push(n);
                break;
              }
            }
          }
          let n = i._compile(),
            o = n.serialize(),
            a = i._serialize(o).toString("base64"),
            u = { encoding: "base64", commitment: this.commitment };
          (r &&
            (u.accounts = {
              encoding: "base64",
              addresses: (Array.isArray(r) ? r : n.nonProgramIds()).map((t) =>
                t.toBase58(),
              ),
            }),
            e && (u.sigVerify = !0),
            e &&
              "object" == typeof e &&
              "innerInstructions" in e &&
              (u.innerInstructions = e.innerInstructions));
          let c = [a, u],
            l = v(await this._rpcRequest("simulateTransaction", c), ey);
          if ("error" in l) {
            let t;
            if (
              "data" in l.error &&
              (t = l.error.data.logs) &&
              Array.isArray(t)
            ) {
              let e = "\n    ",
                r = e + t.join(e);
              console.error(l.error.message, r);
            }
            throw new tC({
              action: "simulate",
              signature: "",
              transactionMessage: l.error.message,
              logs: t,
            });
          }
          return l.result;
        }
        async sendTransaction(t, e, r) {
          if ("version" in t) {
            if (e && Array.isArray(e)) throw Error("Invalid arguments");
            let r = t.serialize();
            return await this.sendRawTransaction(r, e);
          }
          if (void 0 === e || !Array.isArray(e))
            throw Error("Invalid arguments");
          if (t.nonceInfo) t.sign(...e);
          else {
            let r = this._disableBlockhashCaching;
            for (;;) {
              let i = await this._blockhashWithExpiryBlockHeight(r);
              if (
                ((t.lastValidBlockHeight = i.lastValidBlockHeight),
                (t.recentBlockhash = i.blockhash),
                t.sign(...e),
                !t.signature)
              )
                throw Error("!signature");
              let n = t.signature.toString("base64");
              if (this._blockhashInfo.transactionSignatures.includes(n)) r = !0;
              else {
                this._blockhashInfo.transactionSignatures.push(n);
                break;
              }
            }
          }
          let i = t.serialize();
          return await this.sendRawTransaction(i, r);
        }
        async sendRawTransaction(t, e) {
          let r = Z(t).toString("base64");
          return await this.sendEncodedTransaction(r, e);
        }
        async sendEncodedTransaction(t, e) {
          let r = { encoding: "base64" },
            i = e && e.skipPreflight,
            n =
              !0 === i
                ? "processed"
                : (e && e.preflightCommitment) || this.commitment;
          (e && null != e.maxRetries && (r.maxRetries = e.maxRetries),
            e &&
              null != e.minContextSlot &&
              (r.minContextSlot = e.minContextSlot),
            i && (r.skipPreflight = i),
            n && (r.preflightCommitment = n));
          let s = [t, r],
            o = v(await this._rpcRequest("sendTransaction", s), r_);
          if ("error" in o) {
            let t;
            throw (
              "data" in o.error && (t = o.error.data.logs),
              new tC({
                action: i ? "send" : "simulate",
                signature: "",
                transactionMessage: o.error.message,
                logs: t,
              })
            );
          }
          return o.result;
        }
        _wsOnOpen() {
          ((this._rpcWebSocketConnected = !0),
            (this._rpcWebSocketHeartbeat = setInterval(() => {
              (async () => {
                try {
                  await this._rpcWebSocket.notify("ping");
                } catch {}
              })();
            }, 5e3)),
            this._updateSubscriptions());
        }
        _wsOnError(t) {
          ((this._rpcWebSocketConnected = !1),
            console.error("ws error:", t.message));
        }
        _wsOnClose(t) {
          ((this._rpcWebSocketConnected = !1),
          (this._rpcWebSocketGeneration =
            (this._rpcWebSocketGeneration + 1) % Number.MAX_SAFE_INTEGER),
          this._rpcWebSocketIdleTimeout &&
            (clearTimeout(this._rpcWebSocketIdleTimeout),
            (this._rpcWebSocketIdleTimeout = null)),
          this._rpcWebSocketHeartbeat &&
            (clearInterval(this._rpcWebSocketHeartbeat),
            (this._rpcWebSocketHeartbeat = null)),
          1e3 === t)
            ? this._updateSubscriptions()
            : ((this._subscriptionCallbacksByServerSubscriptionId = {}),
              Object.entries(this._subscriptionsByHash).forEach(([t, e]) => {
                this._setSubscription(t, { ...e, state: "pending" });
              }));
        }
        _setSubscription(t, e) {
          let r = this._subscriptionsByHash[t]?.state;
          if (((this._subscriptionsByHash[t] = e), r !== e.state)) {
            let r = this._subscriptionStateChangeCallbacksByHash[t];
            r &&
              r.forEach((t) => {
                try {
                  t(e.state);
                } catch {}
              });
          }
        }
        _onSubscriptionStateChange(t, e) {
          let r = this._subscriptionHashByClientSubscriptionId[t];
          if (null == r) return () => {};
          let i = (this._subscriptionStateChangeCallbacksByHash[r] ||=
            new Set());
          return (
            i.add(e),
            () => {
              (i.delete(e),
                0 === i.size &&
                  delete this._subscriptionStateChangeCallbacksByHash[r]);
            }
          );
        }
        async _updateSubscriptions() {
          if (0 === Object.keys(this._subscriptionsByHash).length) {
            this._rpcWebSocketConnected &&
              ((this._rpcWebSocketConnected = !1),
              (this._rpcWebSocketIdleTimeout = setTimeout(() => {
                this._rpcWebSocketIdleTimeout = null;
                try {
                  this._rpcWebSocket.close();
                } catch (t) {
                  t instanceof Error &&
                    console.log(
                      `Error when closing socket connection: ${t.message}`,
                    );
                }
              }, 500)));
            return;
          }
          if (
            (null !== this._rpcWebSocketIdleTimeout &&
              (clearTimeout(this._rpcWebSocketIdleTimeout),
              (this._rpcWebSocketIdleTimeout = null),
              (this._rpcWebSocketConnected = !0)),
            !this._rpcWebSocketConnected)
          )
            return void this._rpcWebSocket.connect();
          let t = this._rpcWebSocketGeneration,
            e = () => t === this._rpcWebSocketGeneration;
          await Promise.all(
            Object.keys(this._subscriptionsByHash).map(async (t) => {
              let r = this._subscriptionsByHash[t];
              if (void 0 !== r)
                switch (r.state) {
                  case "pending":
                  case "unsubscribed":
                    if (0 === r.callbacks.size) {
                      (delete this._subscriptionsByHash[t],
                        "unsubscribed" === r.state &&
                          delete this
                            ._subscriptionCallbacksByServerSubscriptionId[
                            r.serverSubscriptionId
                          ],
                        await this._updateSubscriptions());
                      return;
                    }
                    await (async () => {
                      let { args: i, method: n } = r;
                      try {
                        this._setSubscription(t, {
                          ...r,
                          state: "subscribing",
                        });
                        let e = await this._rpcWebSocket.call(n, i);
                        (this._setSubscription(t, {
                          ...r,
                          serverSubscriptionId: e,
                          state: "subscribed",
                        }),
                          (this._subscriptionCallbacksByServerSubscriptionId[
                            e
                          ] = r.callbacks),
                          await this._updateSubscriptions());
                      } catch (s) {
                        if (
                          (console.error(
                            `Received ${s instanceof Error ? "" : "JSON-RPC "}error calling \`${n}\``,
                            { args: i, error: s },
                          ),
                          !e())
                        )
                          return;
                        (this._setSubscription(t, { ...r, state: "pending" }),
                          await this._updateSubscriptions());
                      }
                    })();
                    break;
                  case "subscribed":
                    0 === r.callbacks.size &&
                      (await (async () => {
                        let { serverSubscriptionId: i, unsubscribeMethod: n } =
                          r;
                        if (this._subscriptionsAutoDisposedByRpc.has(i))
                          this._subscriptionsAutoDisposedByRpc.delete(i);
                        else {
                          (this._setSubscription(t, {
                            ...r,
                            state: "unsubscribing",
                          }),
                            this._setSubscription(t, {
                              ...r,
                              state: "unsubscribing",
                            }));
                          try {
                            await this._rpcWebSocket.call(n, [i]);
                          } catch (i) {
                            if (
                              (i instanceof Error &&
                                console.error(`${n} error:`, i.message),
                              !e())
                            )
                              return;
                            (this._setSubscription(t, {
                              ...r,
                              state: "subscribed",
                            }),
                              await this._updateSubscriptions());
                            return;
                          }
                        }
                        (this._setSubscription(t, {
                          ...r,
                          state: "unsubscribed",
                        }),
                          await this._updateSubscriptions());
                      })());
                }
            }),
          );
        }
        _handleServerNotification(t, e) {
          let r = this._subscriptionCallbacksByServerSubscriptionId[t];
          void 0 !== r &&
            r.forEach((t) => {
              try {
                t(...e);
              } catch (t) {
                console.error(t);
              }
            });
        }
        _wsOnAccountNotification(t) {
          let { result: e, subscription: r } = v(t, eq);
          this._handleServerNotification(r, [e.value, e.context]);
        }
        _makeSubscription(t, e) {
          let r = this._nextClientSubscriptionId++,
            i = tG([t.method, e]),
            n = this._subscriptionsByHash[i];
          return (
            void 0 === n
              ? (this._subscriptionsByHash[i] = {
                  ...t,
                  args: e,
                  callbacks: new Set([t.callback]),
                  state: "pending",
                })
              : n.callbacks.add(t.callback),
            (this._subscriptionHashByClientSubscriptionId[r] = i),
            (this._subscriptionDisposeFunctionsByClientSubscriptionId[r] =
              async () => {
                (delete this
                  ._subscriptionDisposeFunctionsByClientSubscriptionId[r],
                  delete this._subscriptionHashByClientSubscriptionId[r]);
                let e = this._subscriptionsByHash[i];
                (th(
                  void 0 !== e,
                  `Could not find a \`Subscription\` when tearing down client subscription #${r}`,
                ),
                  e.callbacks.delete(t.callback),
                  await this._updateSubscriptions());
              }),
            this._updateSubscriptions(),
            r
          );
        }
        onAccountChange(t, e, r) {
          let { commitment: i, config: n } = t8(r),
            s = this._buildArgs(
              [t.toBase58()],
              i || this._commitment || "finalized",
              "base64",
              n,
            );
          return this._makeSubscription(
            {
              callback: e,
              method: "accountSubscribe",
              unsubscribeMethod: "accountUnsubscribe",
            },
            s,
          );
        }
        async removeAccountChangeListener(t) {
          await this._unsubscribeClientSubscription(t, "account change");
        }
        _wsOnProgramAccountNotification(t) {
          let { result: e, subscription: r } = v(t, e$);
          this._handleServerNotification(r, [
            { accountId: e.value.pubkey, accountInfo: e.value.account },
            e.context,
          ]);
        }
        onProgramAccountChange(t, e, r, i) {
          let { commitment: n, config: s } = t8(r),
            o = this._buildArgs(
              [t.toBase58()],
              n || this._commitment || "finalized",
              "base64",
              s || (i ? { filters: t4(i) } : void 0),
            );
          return this._makeSubscription(
            {
              callback: e,
              method: "programSubscribe",
              unsubscribeMethod: "programUnsubscribe",
            },
            o,
          );
        }
        async removeProgramAccountChangeListener(t) {
          await this._unsubscribeClientSubscription(
            t,
            "program account change",
          );
        }
        onLogs(t, e, r) {
          let i = this._buildArgs(
            ["object" == typeof t ? { mentions: [t.toString()] } : t],
            r || this._commitment || "finalized",
          );
          return this._makeSubscription(
            {
              callback: e,
              method: "logsSubscribe",
              unsubscribeMethod: "logsUnsubscribe",
            },
            i,
          );
        }
        async removeOnLogsListener(t) {
          await this._unsubscribeClientSubscription(t, "logs");
        }
        _wsOnLogsNotification(t) {
          let { result: e, subscription: r } = v(t, rA);
          this._handleServerNotification(r, [e.value, e.context]);
        }
        _wsOnSlotNotification(t) {
          let { result: e, subscription: r } = v(t, eV);
          this._handleServerNotification(r, [e]);
        }
        onSlotChange(t) {
          return this._makeSubscription(
            {
              callback: t,
              method: "slotSubscribe",
              unsubscribeMethod: "slotUnsubscribe",
            },
            [],
          );
        }
        async removeSlotChangeListener(t) {
          await this._unsubscribeClientSubscription(t, "slot change");
        }
        _wsOnSlotUpdatesNotification(t) {
          let { result: e, subscription: r } = v(t, eH);
          this._handleServerNotification(r, [e]);
        }
        onSlotUpdate(t) {
          return this._makeSubscription(
            {
              callback: t,
              method: "slotsUpdatesSubscribe",
              unsubscribeMethod: "slotsUpdatesUnsubscribe",
            },
            [],
          );
        }
        async removeSlotUpdateListener(t) {
          await this._unsubscribeClientSubscription(t, "slot update");
        }
        async _unsubscribeClientSubscription(t, e) {
          let r = this._subscriptionDisposeFunctionsByClientSubscriptionId[t];
          r
            ? await r()
            : console.warn(
                `Ignored unsubscribe request because an active subscription with id \`${t}\` for '${e}' events could not be found.`,
              );
        }
        _buildArgs(t, e, r, i) {
          let n = e || this._commitment;
          if (n || r || i) {
            let e = {};
            (r && (e.encoding = r),
              n && (e.commitment = n),
              i && (e = Object.assign(e, i)),
              t.push(e));
          }
          return t;
        }
        _buildArgsAtLeastConfirmed(t, e, r, i) {
          let n = e || this._commitment;
          if (n && !["confirmed", "finalized"].includes(n))
            throw Error(
              "Using Connection with default commitment: `" +
                this._commitment +
                "`, but method requires at least `confirmed`",
            );
          return this._buildArgs(t, e, r, i);
        }
        _wsOnSignatureNotification(t) {
          let { result: e, subscription: r } = v(t, eJ);
          ("receivedSignature" !== e.value &&
            this._subscriptionsAutoDisposedByRpc.add(r),
            this._handleServerNotification(
              r,
              "receivedSignature" === e.value
                ? [{ type: "received" }, e.context]
                : [{ type: "status", result: e.value }, e.context],
            ));
        }
        onSignature(t, e, r) {
          let i = this._buildArgs([t], r || this._commitment || "finalized"),
            n = this._makeSubscription(
              {
                callback: (t, r) => {
                  if ("status" === t.type) {
                    e(t.result, r);
                    try {
                      this.removeSignatureListener(n);
                    } catch (t) {}
                  }
                },
                method: "signatureSubscribe",
                unsubscribeMethod: "signatureUnsubscribe",
              },
              i,
            );
          return n;
        }
        onSignatureWithOptions(t, e, r) {
          let { commitment: i, ...n } = {
              ...r,
              commitment:
                (r && r.commitment) || this._commitment || "finalized",
            },
            s = this._buildArgs([t], i, void 0, n),
            o = this._makeSubscription(
              {
                callback: (t, r) => {
                  e(t, r);
                  try {
                    this.removeSignatureListener(o);
                  } catch (t) {}
                },
                method: "signatureSubscribe",
                unsubscribeMethod: "signatureUnsubscribe",
              },
              s,
            );
          return o;
        }
        async removeSignatureListener(t) {
          await this._unsubscribeClientSubscription(t, "signature result");
        }
        _wsOnRootNotification(t) {
          let { result: e, subscription: r } = v(t, eG);
          this._handleServerNotification(r, [e]);
        }
        onRootChange(t) {
          return this._makeSubscription(
            {
              callback: t,
              method: "rootSubscribe",
              unsubscribeMethod: "rootUnsubscribe",
            },
            [],
          );
        }
        async removeRootChangeListener(t) {
          await this._unsubscribeClientSubscription(t, "root change");
        }
      },
      "Ed25519Program",
      0,
      rL,
      "Enum",
      0,
      class extends X {
        constructor(t) {
          if ((super(t), (this.enum = ""), 1 !== Object.keys(t).length))
            throw Error("Enum can only take single value");
          Object.keys(t).map((t) => {
            this.enum = t;
          });
        }
      },
      "EpochSchedule",
      0,
      tZ,
      "FeeCalculatorLayout",
      0,
      tK,
      "Keypair",
      0,
      rx,
      "LAMPORTS_PER_SOL",
      0,
      1e9,
      "LOOKUP_TABLE_INSTRUCTION_LAYOUTS",
      0,
      rB,
      "Loader",
      0,
      tH,
      "Lockup",
      0,
      rW,
      "MAX_SEED_LENGTH",
      0,
      32,
      "Message",
      0,
      tm,
      "MessageAccountKeys",
      0,
      to,
      "MessageV0",
      0,
      ty,
      "MessageV1",
      0,
      tw,
      "NONCE_ACCOUNT_LENGTH",
      0,
      tD,
      "NonceAccount",
      0,
      t$,
      "PACKET_DATA_SIZE",
      0,
      1232,
      "PUBLIC_KEY_LENGTH",
      0,
      32,
      "PublicKey",
      0,
      te,
      "SIGNATURE_LENGTH_IN_BYTES",
      0,
      64,
      "SOLANA_SCHEMA",
      0,
      Q,
      "STAKE_CONFIG_ID",
      0,
      rN,
      "STAKE_INSTRUCTION_LAYOUTS",
      0,
      rK,
      "SYSTEM_INSTRUCTION_LAYOUTS",
      0,
      tV,
      "SYSVAR_CLOCK_PUBKEY",
      0,
      tA,
      "SYSVAR_EPOCH_SCHEDULE_PUBKEY",
      0,
      tE,
      "SYSVAR_INSTRUCTIONS_PUBKEY",
      0,
      tx,
      "SYSVAR_RECENT_BLOCKHASHES_PUBKEY",
      0,
      tB,
      "SYSVAR_RENT_PUBKEY",
      0,
      tM,
      "SYSVAR_REWARDS_PUBKEY",
      0,
      tP,
      "SYSVAR_SLOT_HASHES_PUBKEY",
      0,
      tT,
      "SYSVAR_SLOT_HISTORY_PUBKEY",
      0,
      tR,
      "SYSVAR_STAKE_HISTORY_PUBKEY",
      0,
      tL,
      "Secp256k1Program",
      0,
      rU,
      "SendTransactionError",
      0,
      tC,
      "SolanaJSONRPCError",
      0,
      tO,
      "SolanaJSONRPCErrorCode",
      0,
      {
        JSON_RPC_SERVER_ERROR_BLOCK_CLEANED_UP: -32001,
        JSON_RPC_SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE: -32002,
        JSON_RPC_SERVER_ERROR_TRANSACTION_SIGNATURE_VERIFICATION_FAILURE:
          -32003,
        JSON_RPC_SERVER_ERROR_BLOCK_NOT_AVAILABLE: -32004,
        JSON_RPC_SERVER_ERROR_NODE_UNHEALTHY: -32005,
        JSON_RPC_SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE:
          -32006,
        JSON_RPC_SERVER_ERROR_SLOT_SKIPPED: -32007,
        JSON_RPC_SERVER_ERROR_NO_SNAPSHOT: -32008,
        JSON_RPC_SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED: -32009,
        JSON_RPC_SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX: -32010,
        JSON_RPC_SERVER_ERROR_TRANSACTION_HISTORY_NOT_AVAILABLE: -32011,
        JSON_RPC_SCAN_ERROR: -32012,
        JSON_RPC_SERVER_ERROR_TRANSACTION_SIGNATURE_LEN_MISMATCH: -32013,
        JSON_RPC_SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET: -32014,
        JSON_RPC_SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION: -32015,
        JSON_RPC_SERVER_ERROR_MIN_CONTEXT_SLOT_NOT_REACHED: -32016,
      },
      "StakeAuthorizationLayout",
      0,
      rq,
      "StakeInstruction",
      0,
      class {
        static decodeInstructionType(t) {
          let e;
          this.checkProgramId(t.programId);
          let r = h.u32("instruction").decode(t.data);
          for (let [t, i] of Object.entries(rK))
            if (i.index == r) {
              e = t;
              break;
            }
          if (!e)
            throw Error("Instruction type incorrect; not a StakeInstruction");
          return e;
        }
        static decodeInitialize(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 2));
          let { authorized: e, lockup: r } = tW(rK.Initialize, t.data);
          return {
            stakePubkey: t.keys[0].pubkey,
            authorized: new rz(new te(e.staker), new te(e.withdrawer)),
            lockup: new rW(r.unixTimestamp, r.epoch, new te(r.custodian)),
          };
        }
        static decodeDelegate(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeyLength(t.keys, 6),
            tW(rK.Delegate, t.data),
            {
              stakePubkey: t.keys[0].pubkey,
              votePubkey: t.keys[1].pubkey,
              authorizedPubkey: t.keys[5].pubkey,
            }
          );
        }
        static decodeAuthorize(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let { newAuthorized: e, stakeAuthorizationType: r } = tW(
              rK.Authorize,
              t.data,
            ),
            i = {
              stakePubkey: t.keys[0].pubkey,
              authorizedPubkey: t.keys[2].pubkey,
              newAuthorizedPubkey: new te(e),
              stakeAuthorizationType: { index: r },
            };
          return (
            t.keys.length > 3 && (i.custodianPubkey = t.keys[3].pubkey),
            i
          );
        }
        static decodeAuthorizeWithSeed(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 2));
          let {
              newAuthorized: e,
              stakeAuthorizationType: r,
              authoritySeed: i,
              authorityOwner: n,
            } = tW(rK.AuthorizeWithSeed, t.data),
            s = {
              stakePubkey: t.keys[0].pubkey,
              authorityBase: t.keys[1].pubkey,
              authoritySeed: i,
              authorityOwner: new te(n),
              newAuthorizedPubkey: new te(e),
              stakeAuthorizationType: { index: r },
            };
          return (
            t.keys.length > 3 && (s.custodianPubkey = t.keys[3].pubkey),
            s
          );
        }
        static decodeSplit(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let { lamports: e } = tW(rK.Split, t.data);
          return {
            stakePubkey: t.keys[0].pubkey,
            splitStakePubkey: t.keys[1].pubkey,
            authorizedPubkey: t.keys[2].pubkey,
            lamports: e,
          };
        }
        static decodeMerge(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeyLength(t.keys, 3),
            tW(rK.Merge, t.data),
            {
              stakePubkey: t.keys[0].pubkey,
              sourceStakePubKey: t.keys[1].pubkey,
              authorizedPubkey: t.keys[4].pubkey,
            }
          );
        }
        static decodeWithdraw(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 5));
          let { lamports: e } = tW(rK.Withdraw, t.data),
            r = {
              stakePubkey: t.keys[0].pubkey,
              toPubkey: t.keys[1].pubkey,
              authorizedPubkey: t.keys[4].pubkey,
              lamports: e,
            };
          return (
            t.keys.length > 5 && (r.custodianPubkey = t.keys[5].pubkey),
            r
          );
        }
        static decodeDeactivate(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeyLength(t.keys, 3),
            tW(rK.Deactivate, t.data),
            {
              stakePubkey: t.keys[0].pubkey,
              authorizedPubkey: t.keys[2].pubkey,
            }
          );
        }
        static checkProgramId(t) {
          if (!t.equals(rD.programId))
            throw Error("invalid instruction; programId is not StakeProgram");
        }
        static checkKeyLength(t, e) {
          if (t.length < e)
            throw Error(
              `invalid instruction; found ${t.length} keys, expected at least ${e}`,
            );
        }
      },
      "StakeProgram",
      0,
      rD,
      "Struct",
      0,
      X,
      "SystemInstruction",
      0,
      class {
        static decodeInstructionType(t) {
          let e;
          this.checkProgramId(t.programId);
          let r = h.u32("instruction").decode(t.data);
          for (let [t, i] of Object.entries(tV))
            if (i.index == r) {
              e = t;
              break;
            }
          if (!e)
            throw Error("Instruction type incorrect; not a SystemInstruction");
          return e;
        }
        static decodeCreateAccount(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 2));
          let { lamports: e, space: r, programId: i } = tW(tV.Create, t.data);
          return {
            fromPubkey: t.keys[0].pubkey,
            newAccountPubkey: t.keys[1].pubkey,
            lamports: e,
            space: r,
            programId: new te(i),
          };
        }
        static decodeTransfer(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 2));
          let { lamports: e } = tW(tV.Transfer, t.data);
          return {
            fromPubkey: t.keys[0].pubkey,
            toPubkey: t.keys[1].pubkey,
            lamports: e,
          };
        }
        static decodeTransferWithSeed(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let {
            lamports: e,
            seed: r,
            programId: i,
          } = tW(tV.TransferWithSeed, t.data);
          return {
            fromPubkey: t.keys[0].pubkey,
            basePubkey: t.keys[1].pubkey,
            toPubkey: t.keys[2].pubkey,
            lamports: e,
            seed: r,
            programId: new te(i),
          };
        }
        static decodeAllocate(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 1));
          let { space: e } = tW(tV.Allocate, t.data);
          return { accountPubkey: t.keys[0].pubkey, space: e };
        }
        static decodeAllocateWithSeed(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 1));
          let {
            base: e,
            seed: r,
            space: i,
            programId: n,
          } = tW(tV.AllocateWithSeed, t.data);
          return {
            accountPubkey: t.keys[0].pubkey,
            basePubkey: new te(e),
            seed: r,
            space: i,
            programId: new te(n),
          };
        }
        static decodeAssign(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 1));
          let { programId: e } = tW(tV.Assign, t.data);
          return { accountPubkey: t.keys[0].pubkey, programId: new te(e) };
        }
        static decodeAssignWithSeed(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 1));
          let {
            base: e,
            seed: r,
            programId: i,
          } = tW(tV.AssignWithSeed, t.data);
          return {
            accountPubkey: t.keys[0].pubkey,
            basePubkey: new te(e),
            seed: r,
            programId: new te(i),
          };
        }
        static decodeCreateWithSeed(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 2));
          let {
            base: e,
            seed: r,
            lamports: i,
            space: n,
            programId: s,
          } = tW(tV.CreateWithSeed, t.data);
          return {
            fromPubkey: t.keys[0].pubkey,
            newAccountPubkey: t.keys[1].pubkey,
            basePubkey: new te(e),
            seed: r,
            lamports: i,
            space: n,
            programId: new te(s),
          };
        }
        static decodeNonceInitialize(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let { authorized: e } = tW(tV.InitializeNonceAccount, t.data);
          return { noncePubkey: t.keys[0].pubkey, authorizedPubkey: new te(e) };
        }
        static decodeNonceAdvance(t) {
          return (
            this.checkProgramId(t.programId),
            this.checkKeyLength(t.keys, 3),
            tW(tV.AdvanceNonceAccount, t.data),
            {
              noncePubkey: t.keys[0].pubkey,
              authorizedPubkey: t.keys[2].pubkey,
            }
          );
        }
        static decodeNonceWithdraw(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 5));
          let { lamports: e } = tW(tV.WithdrawNonceAccount, t.data);
          return {
            noncePubkey: t.keys[0].pubkey,
            toPubkey: t.keys[1].pubkey,
            authorizedPubkey: t.keys[4].pubkey,
            lamports: e,
          };
        }
        static decodeNonceAuthorize(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 2));
          let { authorized: e } = tW(tV.AuthorizeNonceAccount, t.data);
          return {
            noncePubkey: t.keys[0].pubkey,
            authorizedPubkey: t.keys[1].pubkey,
            newAuthorizedPubkey: new te(e),
          };
        }
        static checkProgramId(t) {
          if (!t.equals(tj.programId))
            throw Error("invalid instruction; programId is not SystemProgram");
        }
        static checkKeyLength(t, e) {
          if (t.length < e)
            throw Error(
              `invalid instruction; found ${t.length} keys, expected at least ${e}`,
            );
        }
      },
      "SystemProgram",
      0,
      tj,
      "Transaction",
      0,
      tI,
      "TransactionExpiredBlockheightExceededError",
      0,
      ti,
      "TransactionExpiredNonceInvalidError",
      0,
      ts,
      "TransactionExpiredTimeoutError",
      0,
      tn,
      "TransactionInstruction",
      0,
      t_,
      "TransactionMessage",
      0,
      class t {
        constructor(t) {
          ((this.payerKey = void 0),
            (this.instructions = void 0),
            (this.recentBlockhash = void 0),
            (this.payerKey = t.payerKey),
            (this.instructions = t.instructions),
            (this.recentBlockhash = t.recentBlockhash));
        }
        static decompile(e, r) {
          let { header: i, compiledInstructions: n, recentBlockhash: s } = e,
            {
              numRequiredSignatures: o,
              numReadonlySignedAccounts: a,
              numReadonlyUnsignedAccounts: u,
            } = i,
            c = o - a;
          th(c > 0, "Message header is invalid");
          let l = e.staticAccountKeys.length - o - u;
          th(l >= 0, "Message header is invalid");
          let h = e.getAccountKeys(r),
            f = h.get(0);
          if (void 0 === f)
            throw Error(
              "Failed to decompile message because no account keys were found",
            );
          let d = [];
          for (let t of n) {
            let e = [];
            for (let r of t.accountKeyIndexes) {
              let t,
                n = h.get(r);
              if (void 0 === n)
                throw Error(`Failed to find key for account key index ${r}`);
              ((t =
                r < o
                  ? r < c
                  : r < h.staticAccountKeys.length
                    ? r - o < l
                    : r - h.staticAccountKeys.length <
                      h.accountKeysFromLookups.writable.length),
                e.push({
                  pubkey: n,
                  isSigner: r < i.numRequiredSignatures,
                  isWritable: t,
                }));
            }
            let r = h.get(t.programIdIndex);
            if (void 0 === r)
              throw Error(
                `Failed to find program id for program id index ${t.programIdIndex}`,
              );
            d.push(new t_({ programId: r, data: Z(t.data), keys: e }));
          }
          return new t({ payerKey: f, instructions: d, recentBlockhash: s });
        }
        compileToLegacyMessage() {
          return tm.compile({
            payerKey: this.payerKey,
            recentBlockhash: this.recentBlockhash,
            instructions: this.instructions,
          });
        }
        compileToV0Message(t) {
          return ty.compile({
            payerKey: this.payerKey,
            recentBlockhash: this.recentBlockhash,
            instructions: this.instructions,
            addressLookupTableAccounts: t,
          });
        }
      },
      "TransactionStatus",
      0,
      tv,
      "V1_TRANSACTION_SIZE_LIMIT",
      0,
      4096,
      "VALIDATOR_INFO_KEY",
      0,
      rH,
      "VERSION_1_MESSAGE_PREFIX",
      0,
      129,
      "VERSION_PREFIX_MASK",
      0,
      127,
      "VOTE_PROGRAM_ID",
      0,
      rG,
      "ValidatorInfo",
      0,
      class t {
        constructor(t, e) {
          ((this.key = void 0),
            (this.info = void 0),
            (this.key = t),
            (this.info = e));
        }
        static fromConfigData(e) {
          let r = [...e];
          if (2 !== tc(r)) return null;
          let i = [];
          for (let t = 0; t < 2; t++) {
            let t = new te(tg(r, 0, 32)),
              e = 1 === tp(r);
            i.push({ publicKey: t, isSigner: e });
          }
          if (i[0].publicKey.equals(rH) && i[1].isSigner) {
            let e = JSON.parse(tu().decode(s.Buffer.from(r)));
            return (k(e, rJ), new t(i[1].publicKey, e));
          }
          return null;
        }
      },
      "VersionedMessage",
      0,
      tk,
      "VersionedTransaction",
      0,
      class t {
        get version() {
          return this.message.version;
        }
        constructor(t, e) {
          if (
            ((this.signatures = void 0), (this.message = void 0), void 0 !== e)
          )
            (th(
              e.length === t.header.numRequiredSignatures,
              "Expected signatures length to be equal to the number of required signatures",
            ),
              (this.signatures = e));
          else {
            let e = [];
            for (let r = 0; r < t.header.numRequiredSignatures; r++)
              e.push(new Uint8Array(64));
            this.signatures = e;
          }
          this.message = t;
        }
        serialize() {
          let t = this.message.serialize(),
            e = [];
          tl(e, this.signatures.length);
          let r = h.struct([
              h.blob(e.length, "encodedSignaturesLength"),
              h.seq(
                ((t = "signature") => h.blob(64, t))(),
                this.signatures.length,
                "signatures",
              ),
              h.blob(t.length, "serializedMessage"),
            ]),
            i = new Uint8Array(2048),
            n = r.encode(
              {
                encodedSignaturesLength: new Uint8Array(e),
                signatures: this.signatures,
                serializedMessage: t,
              },
              i,
            );
          return i.slice(0, n);
        }
        static deserialize(e) {
          if (129 === e[0]) return this.deserializeV1(e);
          let r = [...e],
            i = [],
            n = tc(r);
          for (let t = 0; t < n; t++) i.push(new Uint8Array(tg(r, 0, 64)));
          return new t(tk.deserialize(new Uint8Array(r)), i);
        }
        static deserializeV1(e) {
          let r = e[1],
            i = e.length - 64 * r;
          th(
            i > 0,
            "Expected transaction to have enough bytes for its signatures",
          );
          let n = tk.deserialize(e.slice(0, i)),
            s = [];
          for (let t = 0; t < r; t++) {
            let r = i + 64 * t;
            s.push(e.slice(r, r + 64));
          }
          return new t(n, s);
        }
        sign(t) {
          let e = this.message.serialize(),
            r = this.message.staticAccountKeys.slice(
              0,
              this.message.header.numRequiredSignatures,
            );
          for (let i of t) {
            let t = r.findIndex((t) => t.equals(i.publicKey));
            (th(
              t >= 0,
              `Cannot sign with non signer key ${i.publicKey.toBase58()}`,
            ),
              (this.signatures[t] = G(e, i.secretKey)));
          }
        }
        addSignature(t, e) {
          th(64 === e.byteLength, "Signature must be 64 bytes long");
          let r = this.message.staticAccountKeys
            .slice(0, this.message.header.numRequiredSignatures)
            .findIndex((e) => e.equals(t));
          (th(
            r >= 0,
            `Can not add signature; \`${t.toBase58()}\` is not required to sign this transaction`,
          ),
            (this.signatures[r] = e));
        }
      },
      "VoteAccount",
      0,
      class t {
        constructor(t) {
          ((this.nodePubkey = void 0),
            (this.authorizedWithdrawer = void 0),
            (this.commission = void 0),
            (this.rootSlot = void 0),
            (this.votes = void 0),
            (this.authorizedVoters = void 0),
            (this.priorVoters = void 0),
            (this.epochCredits = void 0),
            (this.lastTimestamp = void 0),
            (this.nodePubkey = t.nodePubkey),
            (this.authorizedWithdrawer = t.authorizedWithdrawer),
            (this.commission = t.commission),
            (this.rootSlot = t.rootSlot),
            (this.votes = t.votes),
            (this.authorizedVoters = t.authorizedVoters),
            (this.priorVoters = t.priorVoters),
            (this.epochCredits = t.epochCredits),
            (this.lastTimestamp = t.lastTimestamp));
        }
        static fromAccountData(e) {
          let r = rY.decode(Z(e), 4),
            i = r.rootSlot;
          return (
            r.rootSlotValid || (i = null),
            new t({
              nodePubkey: new te(r.nodePubkey),
              authorizedWithdrawer: new te(r.authorizedWithdrawer),
              commission: r.commission,
              votes: r.votes,
              rootSlot: i,
              authorizedVoters: r.authorizedVoters.map(rZ),
              priorVoters: (function ({ buf: t, idx: e, isEmpty: r }) {
                return r
                  ? []
                  : [...t.slice(e + 1).map(rX), ...t.slice(0, e).map(rX)];
              })(r.priorVoters),
              epochCredits: r.epochCredits,
              lastTimestamp: r.lastTimestamp,
            })
          );
        }
      },
      "VoteAuthorizationLayout",
      0,
      rV,
      "VoteInit",
      0,
      r$,
      "VoteInstruction",
      0,
      class {
        static decodeInstructionType(t) {
          let e;
          this.checkProgramId(t.programId);
          let r = h.u32("instruction").decode(t.data);
          for (let [t, i] of Object.entries(rF))
            if (i.index == r) {
              e = t;
              break;
            }
          if (!e)
            throw Error("Instruction type incorrect; not a VoteInstruction");
          return e;
        }
        static decodeInitializeAccount(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 4));
          let { voteInit: e } = tW(rF.InitializeAccount, t.data);
          return {
            votePubkey: t.keys[0].pubkey,
            nodePubkey: t.keys[3].pubkey,
            voteInit: new r$(
              new te(e.nodePubkey),
              new te(e.authorizedVoter),
              new te(e.authorizedWithdrawer),
              e.commission,
            ),
          };
        }
        static decodeAuthorize(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let { newAuthorized: e, voteAuthorizationType: r } = tW(
            rF.Authorize,
            t.data,
          );
          return {
            votePubkey: t.keys[0].pubkey,
            authorizedPubkey: t.keys[2].pubkey,
            newAuthorizedPubkey: new te(e),
            voteAuthorizationType: { index: r },
          };
        }
        static decodeAuthorizeWithSeed(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let {
            voteAuthorizeWithSeedArgs: {
              currentAuthorityDerivedKeyOwnerPubkey: e,
              currentAuthorityDerivedKeySeed: r,
              newAuthorized: i,
              voteAuthorizationType: n,
            },
          } = tW(rF.AuthorizeWithSeed, t.data);
          return {
            currentAuthorityDerivedKeyBasePubkey: t.keys[2].pubkey,
            currentAuthorityDerivedKeyOwnerPubkey: new te(e),
            currentAuthorityDerivedKeySeed: r,
            newAuthorizedPubkey: new te(i),
            voteAuthorizationType: { index: n },
            votePubkey: t.keys[0].pubkey,
          };
        }
        static decodeWithdraw(t) {
          (this.checkProgramId(t.programId), this.checkKeyLength(t.keys, 3));
          let { lamports: e } = tW(rF.Withdraw, t.data);
          return {
            votePubkey: t.keys[0].pubkey,
            authorizedWithdrawerPubkey: t.keys[2].pubkey,
            lamports: e,
            toPubkey: t.keys[1].pubkey,
          };
        }
        static checkProgramId(t) {
          if (!t.equals(rj.programId))
            throw Error("invalid instruction; programId is not VoteProgram");
        }
        static checkKeyLength(t, e) {
          if (t.length < e)
            throw Error(
              `invalid instruction; found ${t.length} keys, expected at least ${e}`,
            );
        }
      },
      "VoteProgram",
      0,
      rj,
      "clusterApiUrl",
      0,
      function (t, e) {
        let r = !1 === e ? "http" : "https";
        if (!t) return rQ[r].devnet;
        let i = rQ[r][t];
        if (!i) throw Error(`Unknown ${r} cluster: ${t}`);
        return i;
      },
      "sendAndConfirmRawTransaction",
      0,
      r0,
      "sendAndConfirmTransaction",
      0,
      tU,
    ],
    971370,
  );
};
