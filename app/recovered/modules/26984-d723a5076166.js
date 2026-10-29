// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, e, r) => {
  var n = t.i(753887),
    i =
      (t.e && t.e.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      };
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.struct =
      r.f64 =
      r.f32 =
      r.i32 =
      r.u32 =
      r.i16 =
      r.u16 =
      r.i8 =
      r.u8 =
        void 0),
    (r.u64 = h),
    (r.i64 = function (t) {
      return new l(8, !0, t);
    }),
    (r.u128 = function (t) {
      return new l(16, !1, t);
    }),
    (r.i128 = function (t) {
      return new l(16, !0, t);
    }),
    (r.u256 = function (t) {
      return new l(32, !1, t);
    }),
    (r.i256 = function (t) {
      return new l(32, !0, t);
    }),
    (r.publicKey = function (t) {
      return new c(
        (0, o.blob)(32),
        (t) => new s.PublicKey(t),
        (t) => t.toBuffer(),
        t,
      );
    }),
    (r.option = function (t, e) {
      return new d(t, e);
    }),
    (r.bool = function (t) {
      return new c((0, o.u8)(), f, p, t);
    }),
    (r.vec = function (t, e) {
      let r = (0, o.u32)("length");
      return new c(
        (0, o.struct)([r, (0, o.seq)(t, (0, o.offset)(r, -r.span), "values")]),
        ({ values: t }) => t,
        (t) => ({ values: t }),
        e,
      );
    }),
    (r.tagged = function (t, e, r) {
      return new c(
        (0, o.struct)([h("tag"), e.replicate("data")]),
        function ({ tag: e, data: r }) {
          if (!e.eq(t))
            throw Error(
              "Invalid tag, expected: " +
                t.toString("hex") +
                ", got: " +
                e.toString("hex"),
            );
          return r;
        },
        (e) => ({ tag: t, data: e }),
        r,
      );
    }),
    (r.vecU8 = m),
    (r.str = function (t) {
      return new c(
        m(),
        (t) => t.toString("utf-8"),
        (t) => n.Buffer.from(t, "utf-8"),
        t,
      );
    }),
    (r.rustEnum = function (t, e, r) {
      let n = (0, o.union)(null != r ? r : (0, o.u8)(), e);
      return (t.forEach((t, e) => n.addVariant(e, t, t.property)), n);
    }),
    (r.array = function (t, e, r) {
      return new c(
        (0, o.struct)([(0, o.seq)(t, e, "values")]),
        ({ values: t }) => t,
        (t) => ({ values: t }),
        r,
      );
    }),
    (r.map = function (t, e, r) {
      let n = (0, o.u32)("length");
      return new c(
        (0, o.struct)([
          n,
          (0, o.seq)(new _(t, e), (0, o.offset)(n, -n.span), "values"),
        ]),
        ({ values: t }) => new Map(t),
        (t) => ({ values: Array.from(t.entries()) }),
        r,
      );
    }));
  let o = t.r(323809),
    s = t.r(971370),
    a = i(t.r(424509));
  var u = t.r(323809);
  (Object.defineProperty(r, "u8", {
    enumerable: !0,
    get: function () {
      return u.u8;
    },
  }),
    Object.defineProperty(r, "i8", {
      enumerable: !0,
      get: function () {
        return u.s8;
      },
    }),
    Object.defineProperty(r, "u16", {
      enumerable: !0,
      get: function () {
        return u.u16;
      },
    }),
    Object.defineProperty(r, "i16", {
      enumerable: !0,
      get: function () {
        return u.s16;
      },
    }),
    Object.defineProperty(r, "u32", {
      enumerable: !0,
      get: function () {
        return u.u32;
      },
    }),
    Object.defineProperty(r, "i32", {
      enumerable: !0,
      get: function () {
        return u.s32;
      },
    }),
    Object.defineProperty(r, "f32", {
      enumerable: !0,
      get: function () {
        return u.f32;
      },
    }),
    Object.defineProperty(r, "f64", {
      enumerable: !0,
      get: function () {
        return u.f64;
      },
    }),
    Object.defineProperty(r, "struct", {
      enumerable: !0,
      get: function () {
        return u.struct;
      },
    }));
  class l extends o.Layout {
    constructor(t, e, r) {
      (super(t, r), (this.blob = (0, o.blob)(t)), (this.signed = e));
    }
    decode(t, e = 0) {
      let r = new a.default(this.blob.decode(t, e), 10, "le");
      return this.signed ? r.fromTwos(8 * this.span).clone() : r;
    }
    encode(t, e, r = 0) {
      return (
        this.signed && (t = t.toTwos(8 * this.span)),
        this.blob.encode(t.toArrayLike(n.Buffer, "le", this.span), e, r)
      );
    }
  }
  function h(t) {
    return new l(8, !1, t);
  }
  class c extends o.Layout {
    constructor(t, e, r, n) {
      (super(t.span, n),
        (this.layout = t),
        (this.decoder = e),
        (this.encoder = r));
    }
    decode(t, e) {
      return this.decoder(this.layout.decode(t, e));
    }
    encode(t, e, r) {
      return this.layout.encode(this.encoder(t), e, r);
    }
    getSpan(t, e) {
      return this.layout.getSpan(t, e);
    }
  }
  class d extends o.Layout {
    constructor(t, e) {
      (super(-1, e), (this.layout = t), (this.discriminator = (0, o.u8)()));
    }
    encode(t, e, r = 0) {
      return null == t
        ? this.discriminator.encode(0, e, r)
        : (this.discriminator.encode(1, e, r),
          this.layout.encode(t, e, r + 1) + 1);
    }
    decode(t, e = 0) {
      let r = this.discriminator.decode(t, e);
      if (0 === r) return null;
      if (1 === r) return this.layout.decode(t, e + 1);
      throw Error("Invalid option " + this.property);
    }
    getSpan(t, e = 0) {
      let r = this.discriminator.decode(t, e);
      if (0 === r) return 1;
      if (1 === r) return this.layout.getSpan(t, e + 1) + 1;
      throw Error("Invalid option " + this.property);
    }
  }
  function f(t) {
    if (0 === t) return !1;
    if (1 === t) return !0;
    throw Error("Invalid bool: " + t);
  }
  function p(t) {
    return +!!t;
  }
  function m(t) {
    let e = (0, o.u32)("length");
    return new c(
      (0, o.struct)([e, (0, o.blob)((0, o.offset)(e, -e.span), "data")]),
      ({ data: t }) => t,
      (t) => ({ data: t }),
      t,
    );
  }
  class _ extends o.Layout {
    constructor(t, e, r) {
      (super(t.span + e.span, r), (this.keyLayout = t), (this.valueLayout = e));
    }
    decode(t, e) {
      return (
        (e = e || 0),
        [
          this.keyLayout.decode(t, e),
          this.valueLayout.decode(t, e + this.keyLayout.getSpan(t, e)),
        ]
      );
    }
    encode(t, e, r) {
      r = r || 0;
      let n = this.keyLayout.encode(t[0], e, r),
        i = this.valueLayout.encode(t[1], e, r + n);
      return n + i;
    }
    getSpan(t, e) {
      return this.keyLayout.getSpan(t, e) + this.valueLayout.getSpan(t, e);
    }
  }
};
