// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.s16 =
      r.s8 =
      r.nu64be =
      r.u48be =
      r.u40be =
      r.u32be =
      r.u24be =
      r.u16be =
      r.nu64 =
      r.u48 =
      r.u40 =
      r.u32 =
      r.u24 =
      r.u16 =
      r.u8 =
      r.offset =
      r.greedy =
      r.Constant =
      r.UTF8 =
      r.CString =
      r.Blob =
      r.Boolean =
      r.BitField =
      r.BitStructure =
      r.VariantLayout =
      r.Union =
      r.UnionLayoutDiscriminator =
      r.UnionDiscriminator =
      r.Structure =
      r.Sequence =
      r.DoubleBE =
      r.Double =
      r.FloatBE =
      r.Float =
      r.NearInt64BE =
      r.NearInt64 =
      r.NearUInt64BE =
      r.NearUInt64 =
      r.IntBE =
      r.Int =
      r.UIntBE =
      r.UInt =
      r.OffsetLayout =
      r.GreedyCount =
      r.ExternalLayout =
      r.bindConstructorLayout =
      r.nameWithProperty =
      r.Layout =
      r.uint8ArrayToBuffer =
      r.checkUint8Array =
        void 0),
    (r.constant =
      r.utf8 =
      r.cstr =
      r.blob =
      r.unionLayoutDiscriminator =
      r.union =
      r.seq =
      r.bits =
      r.struct =
      r.f64be =
      r.f64 =
      r.f32be =
      r.f32 =
      r.ns64be =
      r.s48be =
      r.s40be =
      r.s32be =
      r.s24be =
      r.s16be =
      r.ns64 =
      r.s48 =
      r.s40 =
      r.s32 =
      r.s24 =
        void 0));
  let i = t.r(259390);
  function n(t) {
    if (!(t instanceof Uint8Array)) throw TypeError("b must be a Uint8Array");
  }
  function s(t) {
    return (n(t), i.Buffer.from(t.buffer, t.byteOffset, t.length));
  }
  ((r.checkUint8Array = n), (r.uint8ArrayToBuffer = s));
  class o {
    constructor(t, e) {
      if (!Number.isInteger(t)) throw TypeError("span must be an integer");
      ((this.span = t), (this.property = e));
    }
    makeDestinationObject() {
      return {};
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
  function a(t, e) {
    return e.property ? t + "[" + e.property + "]" : t;
  }
  ((r.Layout = o),
    (r.nameWithProperty = a),
    (r.bindConstructorLayout = function (t, e) {
      if ("function" != typeof t) throw TypeError("Class must be constructor");
      if (Object.prototype.hasOwnProperty.call(t, "layout_"))
        throw Error("Class is already bound to a layout");
      if (!(e && e instanceof o)) throw TypeError("layout must be a Layout");
      if (Object.prototype.hasOwnProperty.call(e, "boundConstructor_"))
        throw Error("layout is already bound to a constructor");
      ((t.layout_ = e),
        (e.boundConstructor_ = t),
        (e.makeDestinationObject = () => new t()),
        Object.defineProperty(t.prototype, "encode", {
          value(t, r) {
            return e.encode(this, t, r);
          },
          writable: !0,
        }),
        Object.defineProperty(t, "decode", {
          value: (t, r) => e.decode(t, r),
          writable: !0,
        }));
    }));
  class u extends o {
    isCount() {
      throw Error("ExternalLayout is abstract");
    }
  }
  r.ExternalLayout = u;
  class c extends u {
    constructor(t = 1, e) {
      if (!Number.isInteger(t) || 0 >= t)
        throw TypeError("elementSpan must be a (positive) integer");
      (super(-1, e), (this.elementSpan = t));
    }
    isCount() {
      return !0;
    }
    decode(t, e = 0) {
      return (n(t), Math.floor((t.length - e) / this.elementSpan));
    }
    encode(t, e, r) {
      return 0;
    }
  }
  r.GreedyCount = c;
  class l extends u {
    constructor(t, e = 0, r) {
      if (!(t instanceof o)) throw TypeError("layout must be a Layout");
      if (!Number.isInteger(e))
        throw TypeError("offset must be integer or undefined");
      (super(t.span, r || t.property), (this.layout = t), (this.offset = e));
    }
    isCount() {
      return this.layout instanceof h || this.layout instanceof f;
    }
    decode(t, e = 0) {
      return this.layout.decode(t, e + this.offset);
    }
    encode(t, e, r = 0) {
      return this.layout.encode(t, e, r + this.offset);
    }
  }
  r.OffsetLayout = l;
  class h extends o {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e = 0) {
      return s(t).readUIntLE(e, this.span);
    }
    encode(t, e, r = 0) {
      return (s(e).writeUIntLE(t, r, this.span), this.span);
    }
  }
  r.UInt = h;
  class f extends o {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e = 0) {
      return s(t).readUIntBE(e, this.span);
    }
    encode(t, e, r = 0) {
      return (s(e).writeUIntBE(t, r, this.span), this.span);
    }
  }
  r.UIntBE = f;
  class d extends o {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e = 0) {
      return s(t).readIntLE(e, this.span);
    }
    encode(t, e, r = 0) {
      return (s(e).writeIntLE(t, r, this.span), this.span);
    }
  }
  r.Int = d;
  class p extends o {
    constructor(t, e) {
      if ((super(t, e), 6 < this.span))
        throw RangeError("span must not exceed 6 bytes");
    }
    decode(t, e = 0) {
      return s(t).readIntBE(e, this.span);
    }
    encode(t, e, r = 0) {
      return (s(e).writeIntBE(t, r, this.span), this.span);
    }
  }
  function g(t) {
    let e = Math.floor(t / 0x100000000);
    return { hi32: e, lo32: t - 0x100000000 * e };
  }
  function m(t, e) {
    return 0x100000000 * t + e;
  }
  r.IntBE = p;
  class y extends o {
    constructor(t) {
      super(8, t);
    }
    decode(t, e = 0) {
      let r = s(t),
        i = r.readUInt32LE(e);
      return m(r.readUInt32LE(e + 4), i);
    }
    encode(t, e, r = 0) {
      let i = g(t),
        n = s(e);
      return (n.writeUInt32LE(i.lo32, r), n.writeUInt32LE(i.hi32, r + 4), 8);
    }
  }
  r.NearUInt64 = y;
  class b extends o {
    constructor(t) {
      super(8, t);
    }
    decode(t, e = 0) {
      let r = s(t);
      return m(r.readUInt32BE(e), r.readUInt32BE(e + 4));
    }
    encode(t, e, r = 0) {
      let i = g(t),
        n = s(e);
      return (n.writeUInt32BE(i.hi32, r), n.writeUInt32BE(i.lo32, r + 4), 8);
    }
  }
  r.NearUInt64BE = b;
  class w extends o {
    constructor(t) {
      super(8, t);
    }
    decode(t, e = 0) {
      let r = s(t),
        i = r.readUInt32LE(e);
      return m(r.readInt32LE(e + 4), i);
    }
    encode(t, e, r = 0) {
      let i = g(t),
        n = s(e);
      return (n.writeUInt32LE(i.lo32, r), n.writeInt32LE(i.hi32, r + 4), 8);
    }
  }
  r.NearInt64 = w;
  class k extends o {
    constructor(t) {
      super(8, t);
    }
    decode(t, e = 0) {
      let r = s(t);
      return m(r.readInt32BE(e), r.readUInt32BE(e + 4));
    }
    encode(t, e, r = 0) {
      let i = g(t),
        n = s(e);
      return (n.writeInt32BE(i.hi32, r), n.writeUInt32BE(i.lo32, r + 4), 8);
    }
  }
  r.NearInt64BE = k;
  class v extends o {
    constructor(t) {
      super(4, t);
    }
    decode(t, e = 0) {
      return s(t).readFloatLE(e);
    }
    encode(t, e, r = 0) {
      return (s(e).writeFloatLE(t, r), 4);
    }
  }
  r.Float = v;
  class S extends o {
    constructor(t) {
      super(4, t);
    }
    decode(t, e = 0) {
      return s(t).readFloatBE(e);
    }
    encode(t, e, r = 0) {
      return (s(e).writeFloatBE(t, r), 4);
    }
  }
  r.FloatBE = S;
  class _ extends o {
    constructor(t) {
      super(8, t);
    }
    decode(t, e = 0) {
      return s(t).readDoubleLE(e);
    }
    encode(t, e, r = 0) {
      return (s(e).writeDoubleLE(t, r), 8);
    }
  }
  r.Double = _;
  class I extends o {
    constructor(t) {
      super(8, t);
    }
    decode(t, e = 0) {
      return s(t).readDoubleBE(e);
    }
    encode(t, e, r = 0) {
      return (s(e).writeDoubleBE(t, r), 8);
    }
  }
  r.DoubleBE = I;
  class A extends o {
    constructor(t, e, r) {
      if (!(t instanceof o)) throw TypeError("elementLayout must be a Layout");
      if (!((e instanceof u && e.isCount()) || (Number.isInteger(e) && 0 <= e)))
        throw TypeError(
          "count must be non-negative integer or an unsigned integer ExternalLayout",
        );
      let i = -1;
      (e instanceof u || !(0 < t.span) || (i = e * t.span),
        super(i, r),
        (this.elementLayout = t),
        (this.count = e));
    }
    getSpan(t, e = 0) {
      if (0 <= this.span) return this.span;
      let r = 0,
        i = this.count;
      if ((i instanceof u && (i = i.decode(t, e)), 0 < this.elementLayout.span))
        r = i * this.elementLayout.span;
      else {
        let n = 0;
        for (; n < i; ) ((r += this.elementLayout.getSpan(t, e + r)), ++n);
      }
      return r;
    }
    decode(t, e = 0) {
      let r = [],
        i = 0,
        n = this.count;
      for (n instanceof u && (n = n.decode(t, e)); i < n; )
        (r.push(this.elementLayout.decode(t, e)),
          (e += this.elementLayout.getSpan(t, e)),
          (i += 1));
      return r;
    }
    encode(t, e, r = 0) {
      let i = this.elementLayout,
        n = t.reduce((t, n) => t + i.encode(n, e, r + t), 0);
      return (this.count instanceof u && this.count.encode(t.length, e, r), n);
    }
  }
  r.Sequence = A;
  class E extends o {
    constructor(t, e, r) {
      if (!(Array.isArray(t) && t.reduce((t, e) => t && e instanceof o, !0)))
        throw TypeError("fields must be array of Layout instances");
      for (let i of ("boolean" == typeof e &&
        void 0 === r &&
        ((r = e), (e = void 0)),
      t))
        if (0 > i.span && void 0 === i.property)
          throw Error("fields cannot contain unnamed variable-length layout");
      let i = -1;
      try {
        i = t.reduce((t, e) => t + e.getSpan(), 0);
      } catch (t) {}
      (super(i, e), (this.fields = t), (this.decodePrefixes = !!r));
    }
    getSpan(t, e = 0) {
      if (0 <= this.span) return this.span;
      let r = 0;
      try {
        r = this.fields.reduce((r, i) => {
          let n = i.getSpan(t, e);
          return ((e += n), r + n);
        }, 0);
      } catch (t) {
        throw RangeError("indeterminate span");
      }
      return r;
    }
    decode(t, e = 0) {
      n(t);
      let r = this.makeDestinationObject();
      for (let i of this.fields)
        if (
          (void 0 !== i.property && (r[i.property] = i.decode(t, e)),
          (e += i.getSpan(t, e)),
          this.decodePrefixes && t.length === e)
        )
          break;
      return r;
    }
    encode(t, e, r = 0) {
      let i = r,
        n = 0,
        s = 0;
      for (let i of this.fields) {
        let o = i.span;
        if (((s = 0 < o ? o : 0), void 0 !== i.property)) {
          let n = t[i.property];
          void 0 !== n &&
            ((s = i.encode(n, e, r)), 0 > o && (o = i.getSpan(e, r)));
        }
        ((n = r), (r += o));
      }
      return n + s - i;
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
  r.Structure = E;
  class x {
    constructor(t) {
      this.property = t;
    }
    decode(t, e) {
      throw Error("UnionDiscriminator is abstract");
    }
    encode(t, e, r) {
      throw Error("UnionDiscriminator is abstract");
    }
  }
  r.UnionDiscriminator = x;
  class B extends x {
    constructor(t, e) {
      if (!(t instanceof u && t.isCount()))
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
  r.UnionLayoutDiscriminator = B;
  class M extends o {
    constructor(t, e, r) {
      let i;
      if (t instanceof h || t instanceof f) i = new B(new l(t));
      else if (t instanceof u && t.isCount()) i = new B(t);
      else if (t instanceof x) i = t;
      else
        throw TypeError(
          "discr must be a UnionDiscriminator or an unsigned integer layout",
        );
      if ((void 0 === e && (e = null), !(null === e || e instanceof o)))
        throw TypeError("defaultLayout must be null or a Layout");
      if (null !== e) {
        if (0 > e.span) throw Error("defaultLayout must have constant span");
        void 0 === e.property && (e = e.replicate("content"));
      }
      let n = -1;
      (e &&
        0 <= (n = e.span) &&
        (t instanceof h || t instanceof f) &&
        (n += i.layout.span),
        super(n, r),
        (this.discriminator = i),
        (this.usesPrefixDiscriminator = t instanceof h || t instanceof f),
        (this.defaultLayout = e),
        (this.registry = {}));
      let s = this.defaultGetSourceVariant.bind(this);
      ((this.getSourceVariant = function (t) {
        return s(t);
      }),
        (this.configGetSourceVariant = function (t) {
          s = t.bind(this);
        }));
    }
    getSpan(t, e = 0) {
      if (0 <= this.span) return this.span;
      let r = this.getVariant(t, e);
      if (!r) throw Error("unable to determine span for unrecognized variant");
      return r.getSpan(t, e);
    }
    defaultGetSourceVariant(t) {
      if (
        Object.prototype.hasOwnProperty.call(t, this.discriminator.property)
      ) {
        if (
          this.defaultLayout &&
          this.defaultLayout.property &&
          Object.prototype.hasOwnProperty.call(t, this.defaultLayout.property)
        )
          return;
        let e = this.registry[t[this.discriminator.property]];
        if (
          e &&
          (!e.layout ||
            (e.property && Object.prototype.hasOwnProperty.call(t, e.property)))
        )
          return e;
      } else
        for (let e in this.registry) {
          let r = this.registry[e];
          if (r.property && Object.prototype.hasOwnProperty.call(t, r.property))
            return r;
        }
      throw Error("unable to infer src variant");
    }
    decode(t, e = 0) {
      let r,
        i = this.discriminator,
        n = i.decode(t, e),
        s = this.registry[n];
      if (void 0 === s) {
        let s = this.defaultLayout,
          o = 0;
        (this.usesPrefixDiscriminator && (o = i.layout.span),
          ((r = this.makeDestinationObject())[i.property] = n),
          (r[s.property] = s.decode(t, e + o)));
      } else r = s.decode(t, e);
      return r;
    }
    encode(t, e, r = 0) {
      let i = this.getSourceVariant(t);
      if (void 0 === i) {
        let i = this.discriminator,
          n = this.defaultLayout,
          s = 0;
        return (
          this.usesPrefixDiscriminator && (s = i.layout.span),
          i.encode(t[i.property], e, r),
          s + n.encode(t[n.property], e, r + s)
        );
      }
      return i.encode(t, e, r);
    }
    addVariant(t, e, r) {
      let i = new P(this, t, e, r);
      return ((this.registry[t] = i), i);
    }
    getVariant(t, e = 0) {
      let r;
      return (
        (r = t instanceof Uint8Array ? this.discriminator.decode(t, e) : t),
        this.registry[r]
      );
    }
  }
  r.Union = M;
  class P extends o {
    constructor(t, e, r, i) {
      if (!(t instanceof M)) throw TypeError("union must be a Union");
      if (!Number.isInteger(e) || 0 > e)
        throw TypeError("variant must be a (non-negative) integer");
      if (("string" == typeof r && void 0 === i && ((i = r), (r = null)), r)) {
        if (!(r instanceof o)) throw TypeError("layout must be a Layout");
        if (
          null !== t.defaultLayout &&
          0 <= r.span &&
          r.span > t.defaultLayout.span
        )
          throw Error("variant span exceeds span of containing union");
        if ("string" != typeof i)
          throw TypeError("variant must have a String property");
      }
      let n = t.span;
      (0 > t.span &&
        0 <= (n = r ? r.span : 0) &&
        t.usesPrefixDiscriminator &&
        (n += t.discriminator.layout.span),
        super(n, i),
        (this.union = t),
        (this.variant = e),
        (this.layout = r || null));
    }
    getSpan(t, e = 0) {
      if (0 <= this.span) return this.span;
      let r = 0;
      this.union.usesPrefixDiscriminator &&
        (r = this.union.discriminator.layout.span);
      let i = 0;
      return (this.layout && (i = this.layout.getSpan(t, e + r)), r + i);
    }
    decode(t, e = 0) {
      let r = this.makeDestinationObject();
      if (this !== this.union.getVariant(t, e)) throw Error("variant mismatch");
      let i = 0;
      return (
        this.union.usesPrefixDiscriminator &&
          (i = this.union.discriminator.layout.span),
        this.layout
          ? (r[this.property] = this.layout.decode(t, e + i))
          : this.property
            ? (r[this.property] = !0)
            : this.union.usesPrefixDiscriminator &&
              (r[this.union.discriminator.property] = this.variant),
        r
      );
    }
    encode(t, e, r = 0) {
      let i = 0;
      if (
        (this.union.usesPrefixDiscriminator &&
          (i = this.union.discriminator.layout.span),
        this.layout && !Object.prototype.hasOwnProperty.call(t, this.property))
      )
        throw TypeError("variant lacks property " + this.property);
      this.union.discriminator.encode(this.variant, e, r);
      let n = i;
      if (
        this.layout &&
        (this.layout.encode(t[this.property], e, r + i),
        (n += this.layout.getSpan(e, r + i)),
        0 <= this.union.span && n > this.union.span)
      )
        throw Error("encoded variant overruns containing union");
      return n;
    }
    fromArray(t) {
      if (this.layout) return this.layout.fromArray(t);
    }
  }
  function T(t) {
    return (0 > t && (t += 0x100000000), t);
  }
  r.VariantLayout = P;
  class R extends o {
    constructor(t, e, r) {
      if (!(t instanceof h || t instanceof f))
        throw TypeError("word must be a UInt or UIntBE layout");
      if (
        ("string" == typeof e && void 0 === r && ((r = e), (e = !1)),
        4 < t.span)
      )
        throw RangeError("word cannot exceed 32 bits");
      (super(t.span, r), (this.word = t), (this.msb = !!e), (this.fields = []));
      let i = 0;
      ((this._packedSetValue = function (t) {
        return ((i = T(t)), this);
      }),
        (this._packedGetValue = function () {
          return i;
        }));
    }
    decode(t, e = 0) {
      let r = this.makeDestinationObject(),
        i = this.word.decode(t, e);
      for (let e of (this._packedSetValue(i), this.fields))
        void 0 !== e.property && (r[e.property] = e.decode(t));
      return r;
    }
    encode(t, e, r = 0) {
      let i = this.word.decode(e, r);
      for (let e of (this._packedSetValue(i), this.fields))
        if (void 0 !== e.property) {
          let r = t[e.property];
          void 0 !== r && e.encode(r);
        }
      return this.word.encode(this._packedGetValue(), e, r);
    }
    addField(t, e) {
      let r = new L(this, t, e);
      return (this.fields.push(r), r);
    }
    addBoolean(t) {
      let e = new C(this, t);
      return (this.fields.push(e), e);
    }
    fieldFor(t) {
      if ("string" != typeof t) throw TypeError("property must be string");
      for (let e of this.fields) if (e.property === t) return e;
    }
  }
  r.BitStructure = R;
  class L {
    constructor(t, e, r) {
      if (!(t instanceof R))
        throw TypeError("container must be a BitStructure");
      if (!Number.isInteger(e) || 0 >= e)
        throw TypeError("bits must be positive integer");
      let i = 8 * t.span,
        n = t.fields.reduce((t, e) => t + e.bits, 0);
      if (e + n > i)
        throw Error(
          "bits too long for span remainder (" +
            (i - n) +
            " of " +
            i +
            " remain)",
        );
      ((this.container = t),
        (this.bits = e),
        (this.valueMask = (1 << e) - 1),
        32 === e && (this.valueMask = 0xffffffff),
        (this.start = n),
        this.container.msb && (this.start = i - n - e),
        (this.wordMask = T(this.valueMask << this.start)),
        (this.property = r));
    }
    decode(t, e) {
      return T(this.container._packedGetValue() & this.wordMask) >>> this.start;
    }
    encode(t) {
      if (
        "number" != typeof t ||
        !Number.isInteger(t) ||
        t !== T(t & this.valueMask)
      )
        throw TypeError(
          a("BitField.encode", this) +
            " value must be integer not exceeding " +
            this.valueMask,
        );
      let e = this.container._packedGetValue(),
        r = T(t << this.start);
      this.container._packedSetValue(T(e & ~this.wordMask) | r);
    }
  }
  r.BitField = L;
  class C extends L {
    constructor(t, e) {
      super(t, 1, e);
    }
    decode(t, e) {
      return !!super.decode(t, e);
    }
    encode(t) {
      ("boolean" == typeof t && (t *= 1), super.encode(t));
    }
  }
  r.Boolean = C;
  class O extends o {
    constructor(t, e) {
      if (!((t instanceof u && t.isCount()) || (Number.isInteger(t) && 0 <= t)))
        throw TypeError(
          "length must be positive integer or an unsigned integer ExternalLayout",
        );
      let r = -1;
      (t instanceof u || (r = t), super(r, e), (this.length = t));
    }
    getSpan(t, e) {
      let r = this.span;
      return (0 > r && (r = this.length.decode(t, e)), r);
    }
    decode(t, e = 0) {
      let r = this.span;
      return (0 > r && (r = this.length.decode(t, e)), s(t).slice(e, e + r));
    }
    encode(t, e, r) {
      let i = this.length;
      if (
        (this.length instanceof u && (i = t.length),
        !(t instanceof Uint8Array && i === t.length))
      )
        throw TypeError(
          a("Blob.encode", this) +
            " requires (length " +
            i +
            ") Uint8Array as src",
        );
      if (r + i > e.length) throw RangeError("encoding overruns Uint8Array");
      let n = s(t);
      return (
        s(e).write(n.toString("hex"), r, i, "hex"),
        this.length instanceof u && this.length.encode(i, e, r),
        i
      );
    }
  }
  r.Blob = O;
  class U extends o {
    constructor(t) {
      super(-1, t);
    }
    getSpan(t, e = 0) {
      n(t);
      let r = e;
      for (; r < t.length && 0 !== t[r]; ) r += 1;
      return 1 + r - e;
    }
    decode(t, e = 0) {
      let r = this.getSpan(t, e);
      return s(t)
        .slice(e, e + r - 1)
        .toString("utf-8");
    }
    encode(t, e, r = 0) {
      "string" != typeof t && (t = String(t));
      let n = i.Buffer.from(t, "utf8"),
        o = n.length;
      if (r + o > e.length) throw RangeError("encoding overruns Buffer");
      let a = s(e);
      return (n.copy(a, r), (a[r + o] = 0), o + 1);
    }
  }
  r.CString = U;
  class N extends o {
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
    getSpan(t, e = 0) {
      return (n(t), t.length - e);
    }
    decode(t, e = 0) {
      let r = this.getSpan(t, e);
      if (0 <= this.maxSpan && this.maxSpan < r)
        throw RangeError("text length exceeds maxSpan");
      return s(t)
        .slice(e, e + r)
        .toString("utf-8");
    }
    encode(t, e, r = 0) {
      "string" != typeof t && (t = String(t));
      let n = i.Buffer.from(t, "utf8"),
        o = n.length;
      if (0 <= this.maxSpan && this.maxSpan < o)
        throw RangeError("text length exceeds maxSpan");
      if (r + o > e.length) throw RangeError("encoding overruns Buffer");
      return (n.copy(s(e), r), o);
    }
  }
  r.UTF8 = N;
  class z extends o {
    constructor(t, e) {
      (super(0, e), (this.value = t));
    }
    decode(t, e) {
      return this.value;
    }
    encode(t, e, r) {
      return 0;
    }
  }
  ((r.Constant = z),
    (r.greedy = (t, e) => new c(t, e)),
    (r.offset = (t, e, r) => new l(t, e, r)),
    (r.u8 = (t) => new h(1, t)),
    (r.u16 = (t) => new h(2, t)),
    (r.u24 = (t) => new h(3, t)),
    (r.u32 = (t) => new h(4, t)),
    (r.u40 = (t) => new h(5, t)),
    (r.u48 = (t) => new h(6, t)),
    (r.nu64 = (t) => new y(t)),
    (r.u16be = (t) => new f(2, t)),
    (r.u24be = (t) => new f(3, t)),
    (r.u32be = (t) => new f(4, t)),
    (r.u40be = (t) => new f(5, t)),
    (r.u48be = (t) => new f(6, t)),
    (r.nu64be = (t) => new b(t)),
    (r.s8 = (t) => new d(1, t)),
    (r.s16 = (t) => new d(2, t)),
    (r.s24 = (t) => new d(3, t)),
    (r.s32 = (t) => new d(4, t)),
    (r.s40 = (t) => new d(5, t)),
    (r.s48 = (t) => new d(6, t)),
    (r.ns64 = (t) => new w(t)),
    (r.s16be = (t) => new p(2, t)),
    (r.s24be = (t) => new p(3, t)),
    (r.s32be = (t) => new p(4, t)),
    (r.s40be = (t) => new p(5, t)),
    (r.s48be = (t) => new p(6, t)),
    (r.ns64be = (t) => new k(t)),
    (r.f32 = (t) => new v(t)),
    (r.f32be = (t) => new S(t)),
    (r.f64 = (t) => new _(t)),
    (r.f64be = (t) => new I(t)),
    (r.struct = (t, e, r) => new E(t, e, r)),
    (r.bits = (t, e, r) => new R(t, e, r)),
    (r.seq = (t, e, r) => new A(t, e, r)),
    (r.union = (t, e, r) => new M(t, e, r)),
    (r.unionLayoutDiscriminator = (t, e) => new B(t, e)),
    (r.blob = (t, e) => new O(t, e)),
    (r.cstr = (t) => new U(t)),
    (r.utf8 = (t, e) => new N(t, e)),
    (r.constant = (t, e) => new z(t, e)));
};
