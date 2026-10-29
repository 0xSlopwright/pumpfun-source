// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var n = t.i(753887);
  class i {
    constructor(t, e) {
      if (!Number.isInteger(t)) throw TypeError("span must be an integer");
      ((this.span = t), (this.property = e));
    }
    makeDestinationObject() {
      return {};
    }
    decode(t, e) {
      throw Error("Layout is abstract");
    }
    encode(t, e, r) {
      throw Error("Layout is abstract");
    }
    getSpan(t, e) {
      if (0 > this.span) throw RangeError("indeterminate span");
      return this.span;
    }
    replicate(t) {
      let e = Object.create(this.constructor.prototype);
      return (Object.assign(e, this), (e.property = t), e);
    }
    fromArray(t) {}
  }
  function o(t, e) {
    return e.property ? t + "[" + e.property + "]" : t;
  }
  ((r.Layout = i),
    (r.nameWithProperty = o),
    (r.bindConstructorLayout = function (t, e) {
      if ("function" != typeof t) throw TypeError("Class must be constructor");
      if (t.hasOwnProperty("layout_"))
        throw Error("Class is already bound to a layout");
      if (!(e && e instanceof i)) throw TypeError("layout must be a Layout");
      if (e.hasOwnProperty("boundConstructor_"))
        throw Error("layout is already bound to a constructor");
      ((t.layout_ = e),
        (e.boundConstructor_ = t),
        (e.makeDestinationObject = () => new t()),
        Object.defineProperty(t.prototype, "encode", {
          value: function (t, r) {
            return e.encode(this, t, r);
          },
          writable: !0,
        }),
        Object.defineProperty(t, "decode", {
          value: function (t, r) {
            return e.decode(t, r);
          },
          writable: !0,
        }));
    }));
  class s extends i {
    isCount() {
      throw Error("ExternalLayout is abstract");
    }
  }
  class a extends s {
    constructor(t, e) {
      if ((void 0 === t && (t = 1), !Number.isInteger(t) || 0 >= t))
        throw TypeError("elementSpan must be a (positive) integer");
      (super(-1, e), (this.elementSpan = t));
    }
    isCount() {
      return !0;
    }
    decode(t, e) {
      return (
        void 0 === e && (e = 0),
        Math.floor((t.length - e) / this.elementSpan)
      );
    }
    encode(t, e, r) {
      return 0;
    }
  }
  class u extends s {
    constructor(t, e, r) {
      if (!(t instanceof i)) throw TypeError("layout must be a Layout");
      if (void 0 === e) e = 0;
      else if (!Number.isInteger(e))
        throw TypeError("offset must be integer or undefined");
      (super(t.span, r || t.property), (this.layout = t), (this.offset = e));
    }
    isCount() {
      return this.layout instanceof l || this.layout instanceof h;
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), this.layout.decode(t, e + this.offset));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        this.layout.encode(t, e, r + this.offset)
      );
    }
  }
  class l extends i {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readUIntLE(e, this.span));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        e.writeUIntLE(t, r, this.span),
        this.span
      );
    }
  }
  class h extends i {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readUIntBE(e, this.span));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        e.writeUIntBE(t, r, this.span),
        this.span
      );
    }
  }
  class c extends i {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readIntLE(e, this.span));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        e.writeIntLE(t, r, this.span),
        this.span
      );
    }
  }
  class d extends i {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readIntBE(e, this.span));
    }
    encode(t, e, r) {
      return (
        void 0 === r && (r = 0),
        e.writeIntBE(t, r, this.span),
        this.span
      );
    }
  }
  function f(t) {
    let e = Math.floor(t / 0x100000000);
    return { hi32: e, lo32: t - 0x100000000 * e };
  }
  function p(t, e) {
    return 0x100000000 * t + e;
  }
  class m extends i {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = t.readUInt32LE(e);
      return p(t.readUInt32LE(e + 4), r);
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = f(t);
      return (e.writeUInt32LE(n.lo32, r), e.writeUInt32LE(n.hi32, r + 4), 8);
    }
  }
  class _ extends i {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      return (
        void 0 === e && (e = 0),
        p(t.readUInt32BE(e), t.readUInt32BE(e + 4))
      );
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = f(t);
      return (e.writeUInt32BE(n.hi32, r), e.writeUInt32BE(n.lo32, r + 4), 8);
    }
  }
  class g extends i {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = t.readUInt32LE(e);
      return p(t.readInt32LE(e + 4), r);
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = f(t);
      return (e.writeUInt32LE(n.lo32, r), e.writeInt32LE(n.hi32, r + 4), 8);
    }
  }
  class y extends i {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      return (
        void 0 === e && (e = 0),
        p(t.readInt32BE(e), t.readUInt32BE(e + 4))
      );
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = f(t);
      return (e.writeInt32BE(n.hi32, r), e.writeUInt32BE(n.lo32, r + 4), 8);
    }
  }
  class w extends i {
    constructor(t) {
      super(4, t);
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readFloatLE(e));
    }
    encode(t, e, r) {
      return (void 0 === r && (r = 0), e.writeFloatLE(t, r), 4);
    }
  }
  class v extends i {
    constructor(t) {
      super(4, t);
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readFloatBE(e));
    }
    encode(t, e, r) {
      return (void 0 === r && (r = 0), e.writeFloatBE(t, r), 4);
    }
  }
  class b extends i {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readDoubleLE(e));
    }
    encode(t, e, r) {
      return (void 0 === r && (r = 0), e.writeDoubleLE(t, r), 8);
    }
  }
  class R extends i {
    constructor(t) {
      super(8, t);
    }
    decode(t, e) {
      return (void 0 === e && (e = 0), t.readDoubleBE(e));
    }
    encode(t, e, r) {
      return (void 0 === r && (r = 0), e.writeDoubleBE(t, r), 8);
    }
  }
  class E extends i {
    constructor(t, e, r) {
      if (!(t instanceof i)) throw TypeError("elementLayout must be a Layout");
      if (!((e instanceof s && e.isCount()) || (Number.isInteger(e) && 0 <= e)))
        throw TypeError(
          "count must be non-negative integer or an unsigned integer ExternalLayout",
        );
      let n = -1;
      (e instanceof s || !(0 < t.span) || (n = e * t.span),
        super(n, r),
        (this.elementLayout = t),
        (this.count = e));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0,
        n = this.count;
      if ((n instanceof s && (n = n.decode(t, e)), 0 < this.elementLayout.span))
        r = n * this.elementLayout.span;
      else {
        let i = 0;
        for (; i < n; ) ((r += this.elementLayout.getSpan(t, e + r)), ++i);
      }
      return r;
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = [],
        n = 0,
        i = this.count;
      for (i instanceof s && (i = i.decode(t, e)); n < i; )
        (r.push(this.elementLayout.decode(t, e)),
          (e += this.elementLayout.getSpan(t, e)),
          (n += 1));
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = this.elementLayout,
        i = t.reduce((t, i) => t + n.encode(i, e, r + t), 0);
      return (this.count instanceof s && this.count.encode(t.length, e, r), i);
    }
  }
  class A extends i {
    constructor(t, e, r) {
      if (!(Array.isArray(t) && t.reduce((t, e) => t && e instanceof i, !0)))
        throw TypeError("fields must be array of Layout instances");
      for (let n of ("boolean" == typeof e &&
        void 0 === r &&
        ((r = e), (e = void 0)),
      t))
        if (0 > n.span && void 0 === n.property)
          throw Error("fields cannot contain unnamed variable-length layout");
      let n = -1;
      try {
        n = t.reduce((t, e) => t + e.getSpan(), 0);
      } catch (t) {}
      (super(n, e), (this.fields = t), (this.decodePrefixes = !!r));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0;
      try {
        r = this.fields.reduce((r, n) => {
          let i = n.getSpan(t, e);
          return ((e += i), r + i);
        }, 0);
      } catch (t) {
        throw RangeError("indeterminate span");
      }
      return r;
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = this.makeDestinationObject();
      for (let n of this.fields)
        if (
          (void 0 !== n.property && (r[n.property] = n.decode(t, e)),
          (e += n.getSpan(t, e)),
          this.decodePrefixes && t.length === e)
        )
          break;
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = r,
        i = 0,
        o = 0;
      for (let n of this.fields) {
        let s = n.span;
        if (((o = 0 < s ? s : 0), void 0 !== n.property)) {
          let i = t[n.property];
          void 0 !== i &&
            ((o = n.encode(i, e, r)), 0 > s && (s = n.getSpan(e, r)));
        }
        ((i = r), (r += s));
      }
      return i + o - n;
    }
    fromArray(t) {
      let e = this.makeDestinationObject();
      for (let r of this.fields)
        void 0 !== r.property && 0 < t.length && (e[r.property] = t.shift());
      return e;
    }
    layoutFor(t) {
      if ("string" != typeof t) throw TypeError("property must be string");
      for (let e of this.fields) if (e.property === t) return e;
    }
    offsetOf(t) {
      if ("string" != typeof t) throw TypeError("property must be string");
      let e = 0;
      for (let r of this.fields) {
        if (r.property === t) return e;
        0 > r.span ? (e = -1) : 0 <= e && (e += r.span);
      }
    }
  }
  class O {
    constructor(t) {
      this.property = t;
    }
    decode() {
      throw Error("UnionDiscriminator is abstract");
    }
    encode() {
      throw Error("UnionDiscriminator is abstract");
    }
  }
  class T extends O {
    constructor(t, e) {
      if (!(t instanceof s && t.isCount()))
        throw TypeError("layout must be an unsigned integer ExternalLayout");
      (super(e || t.property || "variant"), (this.layout = t));
    }
    decode(t, e) {
      return this.layout.decode(t, e);
    }
    encode(t, e, r) {
      return this.layout.encode(t, e, r);
    }
  }
  class N extends i {
    constructor(t, e, r) {
      let n = t instanceof l || t instanceof h;
      if (n) t = new T(new u(t));
      else if (t instanceof s && t.isCount()) t = new T(t);
      else if (!(t instanceof O))
        throw TypeError(
          "discr must be a UnionDiscriminator or an unsigned integer layout",
        );
      if ((void 0 === e && (e = null), !(null === e || e instanceof i)))
        throw TypeError("defaultLayout must be null or a Layout");
      if (null !== e) {
        if (0 > e.span) throw Error("defaultLayout must have constant span");
        void 0 === e.property && (e = e.replicate("content"));
      }
      let o = -1;
      (e && 0 <= (o = e.span) && n && (o += t.layout.span),
        super(o, r),
        (this.discriminator = t),
        (this.usesPrefixDiscriminator = n),
        (this.defaultLayout = e),
        (this.registry = {}));
      let a = this.defaultGetSourceVariant.bind(this);
      ((this.getSourceVariant = function (t) {
        return a(t);
      }),
        (this.configGetSourceVariant = function (t) {
          a = t.bind(this);
        }));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = this.getVariant(t, e);
      if (!r) throw Error("unable to determine span for unrecognized variant");
      return r.getSpan(t, e);
    }
    defaultGetSourceVariant(t) {
      if (t.hasOwnProperty(this.discriminator.property)) {
        if (this.defaultLayout && t.hasOwnProperty(this.defaultLayout.property))
          return;
        let e = this.registry[t[this.discriminator.property]];
        if (e && (!e.layout || t.hasOwnProperty(e.property))) return e;
      } else
        for (let e in this.registry) {
          let r = this.registry[e];
          if (t.hasOwnProperty(r.property)) return r;
        }
      throw Error("unable to infer src variant");
    }
    decode(t, e) {
      let r;
      void 0 === e && (e = 0);
      let n = this.discriminator,
        i = n.decode(t, e),
        o = this.registry[i];
      if (void 0 === o) {
        let s = 0;
        ((o = this.defaultLayout),
          this.usesPrefixDiscriminator && (s = n.layout.span),
          ((r = this.makeDestinationObject())[n.property] = i),
          (r[o.property] = this.defaultLayout.decode(t, e + s)));
      } else r = o.decode(t, e);
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = this.getSourceVariant(t);
      if (void 0 === n) {
        let n = this.discriminator,
          i = this.defaultLayout,
          o = 0;
        return (
          this.usesPrefixDiscriminator && (o = n.layout.span),
          n.encode(t[n.property], e, r),
          o + i.encode(t[i.property], e, r + o)
        );
      }
      return n.encode(t, e, r);
    }
    addVariant(t, e, r) {
      let n = new M(this, t, e, r);
      return ((this.registry[t] = n), n);
    }
    getVariant(t, e) {
      let r = t;
      return (
        n.Buffer.isBuffer(t) &&
          (void 0 === e && (e = 0), (r = this.discriminator.decode(t, e))),
        this.registry[r]
      );
    }
  }
  class M extends i {
    constructor(t, e, r, n) {
      if (!(t instanceof N)) throw TypeError("union must be a Union");
      if (!Number.isInteger(e) || 0 > e)
        throw TypeError("variant must be a (non-negative) integer");
      if (("string" == typeof r && void 0 === n && ((n = r), (r = null)), r)) {
        if (!(r instanceof i)) throw TypeError("layout must be a Layout");
        if (
          null !== t.defaultLayout &&
          0 <= r.span &&
          r.span > t.defaultLayout.span
        )
          throw Error("variant span exceeds span of containing union");
        if ("string" != typeof n)
          throw TypeError("variant must have a String property");
      }
      let o = t.span;
      (0 > t.span &&
        0 <= (o = r ? r.span : 0) &&
        t.usesPrefixDiscriminator &&
        (o += t.discriminator.layout.span),
        super(o, n),
        (this.union = t),
        (this.variant = e),
        (this.layout = r || null));
    }
    getSpan(t, e) {
      if (0 <= this.span) return this.span;
      void 0 === e && (e = 0);
      let r = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (r = this.union.discriminator.layout.span),
        r + this.layout.getSpan(t, e + r)
      );
    }
    decode(t, e) {
      let r = this.makeDestinationObject();
      if ((void 0 === e && (e = 0), this !== this.union.getVariant(t, e)))
        throw Error("variant mismatch");
      let n = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (n = this.union.discriminator.layout.span),
        this.layout
          ? (r[this.property] = this.layout.decode(t, e + n))
          : this.property
            ? (r[this.property] = !0)
            : this.union.usesPrefixDiscriminator &&
              (r[this.union.discriminator.property] = this.variant),
        r
      );
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = 0;
      if (
        (this.union.usesPrefixDiscriminator &&
          (n = this.union.discriminator.layout.span),
        this.layout && !t.hasOwnProperty(this.property))
      )
        throw TypeError("variant lacks property " + this.property);
      this.union.discriminator.encode(this.variant, e, r);
      let i = n;
      if (
        this.layout &&
        (this.layout.encode(t[this.property], e, r + n),
        (i += this.layout.getSpan(e, r + n)),
        0 <= this.union.span && i > this.union.span)
      )
        throw Error("encoded variant overruns containing union");
      return i;
    }
    fromArray(t) {
      if (this.layout) return this.layout.fromArray(t);
    }
  }
  function I(t) {
    return (0 > t && (t += 0x100000000), t);
  }
  class x extends i {
    constructor(t, e, r) {
      if (!(t instanceof l || t instanceof h))
        throw TypeError("word must be a UInt or UIntBE layout");
      if (
        ("string" == typeof e && void 0 === r && ((r = e), (e = void 0)),
        4 < t.span)
      )
        throw RangeError("word cannot exceed 32 bits");
      (super(t.span, r), (this.word = t), (this.msb = !!e), (this.fields = []));
      let n = 0;
      ((this._packedSetValue = function (t) {
        return ((n = I(t)), this);
      }),
        (this._packedGetValue = function () {
          return n;
        }));
    }
    decode(t, e) {
      let r = this.makeDestinationObject();
      void 0 === e && (e = 0);
      let n = this.word.decode(t, e);
      for (let t of (this._packedSetValue(n), this.fields))
        void 0 !== t.property && (r[t.property] = t.decode(n));
      return r;
    }
    encode(t, e, r) {
      void 0 === r && (r = 0);
      let n = this.word.decode(e, r);
      for (let e of (this._packedSetValue(n), this.fields))
        if (void 0 !== e.property) {
          let r = t[e.property];
          void 0 !== r && e.encode(r);
        }
      return this.word.encode(this._packedGetValue(), e, r);
    }
    addField(t, e) {
      let r = new C(this, t, e);
      return (this.fields.push(r), r);
    }
    addBoolean(t) {
      let e = new S(this, t);
      return (this.fields.push(e), e);
    }
    fieldFor(t) {
      if ("string" != typeof t) throw TypeError("property must be string");
      for (let e of this.fields) if (e.property === t) return e;
    }
  }
  class C {
    constructor(t, e, r) {
      if (!(t instanceof x))
        throw TypeError("container must be a BitStructure");
      if (!Number.isInteger(e) || 0 >= e)
        throw TypeError("bits must be positive integer");
      let n = 8 * t.span,
        i = t.fields.reduce((t, e) => t + e.bits, 0);
      if (e + i > n)
        throw Error(
          "bits too long for span remainder (" +
            (n - i) +
            " of " +
            n +
            " remain)",
        );
      ((this.container = t),
        (this.bits = e),
        (this.valueMask = (1 << e) - 1),
        32 === e && (this.valueMask = 0xffffffff),
        (this.start = i),
        this.container.msb && (this.start = n - i - e),
        (this.wordMask = I(this.valueMask << this.start)),
        (this.property = r));
    }
    decode() {
      return I(this.container._packedGetValue() & this.wordMask) >>> this.start;
    }
    encode(t) {
      if (!Number.isInteger(t) || t !== I(t & this.valueMask))
        throw TypeError(
          o("BitField.encode", this) +
            " value must be integer not exceeding " +
            this.valueMask,
        );
      let e = this.container._packedGetValue(),
        r = I(t << this.start);
      this.container._packedSetValue(I(e & ~this.wordMask) | r);
    }
  }
  class S extends C {
    constructor(t, e) {
      super(t, 1, e);
    }
    decode(t, e) {
      return !!C.prototype.decode.call(this, t, e);
    }
    encode(t) {
      return (
        "boolean" == typeof t && (t *= 1),
        C.prototype.encode.call(this, t)
      );
    }
  }
  class k extends i {
    constructor(t, e) {
      if (!((t instanceof s && t.isCount()) || (Number.isInteger(t) && 0 <= t)))
        throw TypeError(
          "length must be positive integer or an unsigned integer ExternalLayout",
        );
      let r = -1;
      (t instanceof s || (r = t), super(r, e), (this.length = t));
    }
    getSpan(t, e) {
      let r = this.span;
      return (0 > r && (r = this.length.decode(t, e)), r);
    }
    decode(t, e) {
      void 0 === e && (e = 0);
      let r = this.span;
      return (0 > r && (r = this.length.decode(t, e)), t.slice(e, e + r));
    }
    encode(t, e, r) {
      let i = this.length;
      if (
        (this.length instanceof s && (i = t.length),
        !(n.Buffer.isBuffer(t) && i === t.length))
      )
        throw TypeError(
          o("Blob.encode", this) + " requires (length " + i + ") Buffer as src",
        );
      if (r + i > e.length) throw RangeError("encoding overruns Buffer");
      return (
        e.write(t.toString("hex"), r, i, "hex"),
        this.length instanceof s && this.length.encode(i, e, r),
        i
      );
    }
  }
  class L extends i {
    constructor(t) {
      super(-1, t);
    }
    getSpan(t, e) {
      if (!n.Buffer.isBuffer(t)) throw TypeError("b must be a Buffer");
      void 0 === e && (e = 0);
      let r = e;
      for (; r < t.length && 0 !== t[r]; ) r += 1;
      return 1 + r - e;
    }
    decode(t, e, r) {
      void 0 === e && (e = 0);
      let n = this.getSpan(t, e);
      return t.slice(e, e + n - 1).toString("utf-8");
    }
    encode(t, e, r) {
      (void 0 === r && (r = 0), "string" != typeof t && (t = t.toString()));
      let i = new n.Buffer(t, "utf8"),
        o = i.length;
      if (r + o > e.length) throw RangeError("encoding overruns Buffer");
      return (i.copy(e, r), (e[r + o] = 0), o + 1);
    }
  }
  class D extends i {
    constructor(t, e) {
      if (
        ("string" == typeof t && void 0 === e && ((e = t), (t = void 0)),
        void 0 === t)
      )
        t = -1;
      else if (!Number.isInteger(t))
        throw TypeError("maxSpan must be an integer");
      (super(-1, e), (this.maxSpan = t));
    }
    getSpan(t, e) {
      if (!n.Buffer.isBuffer(t)) throw TypeError("b must be a Buffer");
      return (void 0 === e && (e = 0), t.length - e);
    }
    decode(t, e, r) {
      void 0 === e && (e = 0);
      let n = this.getSpan(t, e);
      if (0 <= this.maxSpan && this.maxSpan < n)
        throw RangeError("text length exceeds maxSpan");
      return t.slice(e, e + n).toString("utf-8");
    }
    encode(t, e, r) {
      (void 0 === r && (r = 0), "string" != typeof t && (t = t.toString()));
      let i = new n.Buffer(t, "utf8"),
        o = i.length;
      if (0 <= this.maxSpan && this.maxSpan < o)
        throw RangeError("text length exceeds maxSpan");
      if (r + o > e.length) throw RangeError("encoding overruns Buffer");
      return (i.copy(e, r), o);
    }
  }
  class P extends i {
    constructor(t, e) {
      (super(0, e), (this.value = t));
    }
    decode(t, e, r) {
      return this.value;
    }
    encode(t, e, r) {
      return 0;
    }
  }
  ((r.ExternalLayout = s),
    (r.GreedyCount = a),
    (r.OffsetLayout = u),
    (r.UInt = l),
    (r.UIntBE = h),
    (r.Int = c),
    (r.IntBE = d),
    (r.Float = w),
    (r.FloatBE = v),
    (r.Double = b),
    (r.DoubleBE = R),
    (r.Sequence = E),
    (r.Structure = A),
    (r.UnionDiscriminator = O),
    (r.UnionLayoutDiscriminator = T),
    (r.Union = N),
    (r.VariantLayout = M),
    (r.BitStructure = x),
    (r.BitField = C),
    (r.Boolean = S),
    (r.Blob = k),
    (r.CString = L),
    (r.UTF8 = D),
    (r.Constant = P),
    (r.greedy = (t, e) => new a(t, e)),
    (r.offset = (t, e, r) => new u(t, e, r)),
    (r.u8 = (t) => new l(1, t)),
    (r.u16 = (t) => new l(2, t)),
    (r.u24 = (t) => new l(3, t)),
    (r.u32 = (t) => new l(4, t)),
    (r.u40 = (t) => new l(5, t)),
    (r.u48 = (t) => new l(6, t)),
    (r.nu64 = (t) => new m(t)),
    (r.u16be = (t) => new h(2, t)),
    (r.u24be = (t) => new h(3, t)),
    (r.u32be = (t) => new h(4, t)),
    (r.u40be = (t) => new h(5, t)),
    (r.u48be = (t) => new h(6, t)),
    (r.nu64be = (t) => new _(t)),
    (r.s8 = (t) => new c(1, t)),
    (r.s16 = (t) => new c(2, t)),
    (r.s24 = (t) => new c(3, t)),
    (r.s32 = (t) => new c(4, t)),
    (r.s40 = (t) => new c(5, t)),
    (r.s48 = (t) => new c(6, t)),
    (r.ns64 = (t) => new g(t)),
    (r.s16be = (t) => new d(2, t)),
    (r.s24be = (t) => new d(3, t)),
    (r.s32be = (t) => new d(4, t)),
    (r.s40be = (t) => new d(5, t)),
    (r.s48be = (t) => new d(6, t)),
    (r.ns64be = (t) => new y(t)),
    (r.f32 = (t) => new w(t)),
    (r.f32be = (t) => new v(t)),
    (r.f64 = (t) => new b(t)),
    (r.f64be = (t) => new R(t)),
    (r.struct = (t, e, r) => new A(t, e, r)),
    (r.bits = (t, e, r) => new x(t, e, r)),
    (r.seq = (t, e, r) => new E(t, e, r)),
    (r.union = (t, e, r) => new N(t, e, r)),
    (r.unionLayoutDiscriminator = (t, e) => new T(t, e)),
    (r.blob = (t, e) => new k(t, e)),
    (r.cstr = (t) => new L(t)),
    (r.utf8 = (t, e) => new D(t, e)),
    (r.const = (t, e) => new P(t, e)));
};
