// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var i = t.i(753887),
    n =
      (t.e && t.e.__createBinding) ||
      (Object.create
        ? function (t, e, r, i) {
            (void 0 === i && (i = r),
              Object.defineProperty(t, i, {
                enumerable: !0,
                get: function () {
                  return e[r];
                },
              }));
          }
        : function (t, e, r, i) {
            (void 0 === i && (i = r), (t[i] = e[r]));
          }),
    s =
      (t.e && t.e.__setModuleDefault) ||
      (Object.create
        ? function (t, e) {
            Object.defineProperty(t, "default", { enumerable: !0, value: e });
          }
        : function (t, e) {
            t.default = e;
          }),
    o =
      (t.e && t.e.__decorate) ||
      function (t, e, r, i) {
        var n,
          s = arguments.length,
          o =
            s < 3
              ? e
              : null === i
                ? (i = Object.getOwnPropertyDescriptor(e, r))
                : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          o = Reflect.decorate(t, e, r, i);
        else
          for (var a = t.length - 1; a >= 0; a--)
            (n = t[a]) &&
              (o = (s < 3 ? n(o) : s > 3 ? n(e, r, o) : n(e, r)) || o);
        return (s > 3 && o && Object.defineProperty(e, r, o), o);
      },
    a =
      (t.e && t.e.__importStar) ||
      function (t) {
        if (t && t.__esModule) return t;
        var e = {};
        if (null != t)
          for (var r in t)
            "default" !== r && Object.hasOwnProperty.call(t, r) && n(e, t, r);
        return (s(e, t), e);
      },
    u =
      (t.e && t.e.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.deserializeUnchecked =
      r.deserialize =
      r.serialize =
      r.BinaryReader =
      r.BinaryWriter =
      r.BorshError =
      r.baseDecode =
      r.baseEncode =
        void 0));
  let c = u(t.r(579015)),
    l = u(t.r(315141)),
    h = a(t.r(227861)),
    f = new ("function" != typeof TextDecoder ? h.TextDecoder : TextDecoder)(
      "utf-8",
      { fatal: !0 },
    );
  ((r.baseEncode = function (t) {
    return (
      "string" == typeof t && (t = i.Buffer.from(t, "utf8")),
      l.default.encode(i.Buffer.from(t))
    );
  }),
    (r.baseDecode = function (t) {
      return i.Buffer.from(l.default.decode(t));
    }));
  class d extends Error {
    constructor(t) {
      (super(t), (this.fieldPath = []), (this.originalMessage = t));
    }
    addToFieldPath(t) {
      (this.fieldPath.splice(0, 0, t),
        (this.message =
          this.originalMessage + ": " + this.fieldPath.join(".")));
    }
  }
  r.BorshError = d;
  class p {
    constructor() {
      ((this.buf = i.Buffer.alloc(1024)), (this.length = 0));
    }
    maybeResize() {
      this.buf.length < 16 + this.length &&
        (this.buf = i.Buffer.concat([this.buf, i.Buffer.alloc(1024)]));
    }
    writeU8(t) {
      (this.maybeResize(),
        this.buf.writeUInt8(t, this.length),
        (this.length += 1));
    }
    writeU16(t) {
      (this.maybeResize(),
        this.buf.writeUInt16LE(t, this.length),
        (this.length += 2));
    }
    writeU32(t) {
      (this.maybeResize(),
        this.buf.writeUInt32LE(t, this.length),
        (this.length += 4));
    }
    writeU64(t) {
      (this.maybeResize(),
        this.writeBuffer(i.Buffer.from(new c.default(t).toArray("le", 8))));
    }
    writeU128(t) {
      (this.maybeResize(),
        this.writeBuffer(i.Buffer.from(new c.default(t).toArray("le", 16))));
    }
    writeU256(t) {
      (this.maybeResize(),
        this.writeBuffer(i.Buffer.from(new c.default(t).toArray("le", 32))));
    }
    writeU512(t) {
      (this.maybeResize(),
        this.writeBuffer(i.Buffer.from(new c.default(t).toArray("le", 64))));
    }
    writeBuffer(t) {
      ((this.buf = i.Buffer.concat([
        i.Buffer.from(this.buf.subarray(0, this.length)),
        t,
        i.Buffer.alloc(1024),
      ])),
        (this.length += t.length));
    }
    writeString(t) {
      this.maybeResize();
      let e = i.Buffer.from(t, "utf8");
      (this.writeU32(e.length), this.writeBuffer(e));
    }
    writeFixedArray(t) {
      this.writeBuffer(i.Buffer.from(t));
    }
    writeArray(t, e) {
      for (let r of (this.maybeResize(), this.writeU32(t.length), t))
        (this.maybeResize(), e(r));
    }
    toArray() {
      return this.buf.subarray(0, this.length);
    }
  }
  function g(t, e, r) {
    let i = r.value;
    r.value = function (...t) {
      try {
        return i.apply(this, t);
      } catch (t) {
        if (
          t instanceof RangeError &&
          ["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(t.code) >= 0
        )
          throw new d("Reached the end of buffer when deserializing");
        throw t;
      }
    };
  }
  r.BinaryWriter = p;
  class m {
    constructor(t) {
      ((this.buf = t), (this.offset = 0));
    }
    readU8() {
      let t = this.buf.readUInt8(this.offset);
      return ((this.offset += 1), t);
    }
    readU16() {
      let t = this.buf.readUInt16LE(this.offset);
      return ((this.offset += 2), t);
    }
    readU32() {
      let t = this.buf.readUInt32LE(this.offset);
      return ((this.offset += 4), t);
    }
    readU64() {
      let t = this.readBuffer(8);
      return new c.default(t, "le");
    }
    readU128() {
      let t = this.readBuffer(16);
      return new c.default(t, "le");
    }
    readU256() {
      let t = this.readBuffer(32);
      return new c.default(t, "le");
    }
    readU512() {
      let t = this.readBuffer(64);
      return new c.default(t, "le");
    }
    readBuffer(t) {
      if (this.offset + t > this.buf.length)
        throw new d(`Expected buffer length ${t} isn't within bounds`);
      let e = this.buf.slice(this.offset, this.offset + t);
      return ((this.offset += t), e);
    }
    readString() {
      let t = this.readU32(),
        e = this.readBuffer(t);
      try {
        return f.decode(e);
      } catch (t) {
        throw new d(`Error decoding UTF-8 string: ${t}`);
      }
    }
    readFixedArray(t) {
      return new Uint8Array(this.readBuffer(t));
    }
    readArray(t) {
      let e = this.readU32(),
        r = [];
      for (let i = 0; i < e; ++i) r.push(t());
      return r;
    }
  }
  function y(t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function b(t, e, r, i, n) {
    try {
      if ("string" == typeof i) n[`write${y(i)}`](r);
      else if (i instanceof Array)
        if ("number" == typeof i[0]) {
          if (r.length !== i[0])
            throw new d(
              `Expecting byte array of length ${i[0]}, but got ${r.length} bytes`,
            );
          n.writeFixedArray(r);
        } else if (2 === i.length && "number" == typeof i[1]) {
          if (r.length !== i[1])
            throw new d(
              `Expecting byte array of length ${i[1]}, but got ${r.length} bytes`,
            );
          for (let e = 0; e < i[1]; e++) b(t, null, r[e], i[0], n);
        } else
          n.writeArray(r, (r) => {
            b(t, e, r, i[0], n);
          });
      else if (void 0 !== i.kind)
        switch (i.kind) {
          case "option":
            null == r ? n.writeU8(0) : (n.writeU8(1), b(t, e, r, i.type, n));
            break;
          case "map":
            (n.writeU32(r.size),
              r.forEach((r, s) => {
                (b(t, e, s, i.key, n), b(t, e, r, i.value, n));
              }));
            break;
          default:
            throw new d(`FieldType ${i} unrecognized`);
        }
      else w(t, r, n);
    } catch (t) {
      throw (t instanceof d && t.addToFieldPath(e), t);
    }
  }
  function w(t, e, r) {
    if ("function" == typeof e.borshSerialize) return void e.borshSerialize(r);
    let i = t.get(e.constructor);
    if (!i) throw new d(`Class ${e.constructor.name} is missing in schema`);
    if ("struct" === i.kind)
      i.fields.map(([i, n]) => {
        b(t, i, e[i], n, r);
      });
    else if ("enum" === i.kind) {
      let n = e[i.field];
      for (let s = 0; s < i.values.length; ++s) {
        let [o, a] = i.values[s];
        if (o === n) {
          (r.writeU8(s), b(t, o, e[o], a, r));
          break;
        }
      }
    } else
      throw new d(
        `Unexpected schema kind: ${i.kind} for ${e.constructor.name}`,
      );
  }
  function k(t, e, r, i) {
    try {
      if ("string" == typeof r) return i[`read${y(r)}`]();
      if (r instanceof Array)
        if ("number" == typeof r[0]) return i.readFixedArray(r[0]);
        else {
          if ("number" != typeof r[1])
            return i.readArray(() => k(t, e, r[0], i));
          let n = [];
          for (let e = 0; e < r[1]; e++) n.push(k(t, null, r[0], i));
          return n;
        }
      if ("option" === r.kind) {
        if (i.readU8()) return k(t, e, r.type, i);
        return;
      }
      if ("map" === r.kind) {
        let n = new Map(),
          s = i.readU32();
        for (let o = 0; o < s; o++) {
          let s = k(t, e, r.key, i),
            o = k(t, e, r.value, i);
          n.set(s, o);
        }
        return n;
      }
      return v(t, r, i);
    } catch (t) {
      throw (t instanceof d && t.addToFieldPath(e), t);
    }
  }
  function v(t, e, r) {
    if ("function" == typeof e.borshDeserialize) return e.borshDeserialize(r);
    let i = t.get(e);
    if (!i) throw new d(`Class ${e.name} is missing in schema`);
    if ("struct" === i.kind) {
      let i = {};
      for (let [n, s] of t.get(e).fields) i[n] = k(t, n, s, r);
      return new e(i);
    }
    if ("enum" === i.kind) {
      let n = r.readU8();
      if (n >= i.values.length) throw new d(`Enum index: ${n} is out of range`);
      let [s, o] = i.values[n],
        a = k(t, s, o, r);
      return new e({ [s]: a });
    }
    throw new d(`Unexpected schema kind: ${i.kind} for ${e.constructor.name}`);
  }
  (o([g], m.prototype, "readU8", null),
    o([g], m.prototype, "readU16", null),
    o([g], m.prototype, "readU32", null),
    o([g], m.prototype, "readU64", null),
    o([g], m.prototype, "readU128", null),
    o([g], m.prototype, "readU256", null),
    o([g], m.prototype, "readU512", null),
    o([g], m.prototype, "readString", null),
    o([g], m.prototype, "readFixedArray", null),
    o([g], m.prototype, "readArray", null),
    (r.BinaryReader = m),
    (r.serialize = function (t, e, r = p) {
      let i = new r();
      return (w(t, e, i), i.toArray());
    }),
    (r.deserialize = function (t, e, r, i = m) {
      let n = new i(r),
        s = v(t, e, n);
      if (n.offset < r.length)
        throw new d(
          `Unexpected ${r.length - n.offset} bytes after deserialized data`,
        );
      return s;
    }),
    (r.deserializeUnchecked = function (t, e, r, i = m) {
      return v(t, e, new i(r));
    }));
};
