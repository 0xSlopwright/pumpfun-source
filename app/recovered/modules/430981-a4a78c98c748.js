// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(837474),
    r = e.i(944445),
    n = e.i(365490),
    f = e.i(878660),
    i = e.i(288667);
  let o = BigInt(0),
    a = BigInt(1),
    s = BigInt(2),
    c = BigInt(8);
  class u {
    constructor(e) {
      this.ep = e;
    }
    static fromBytes(e) {
      (0, f.U)();
    }
    static fromHex(e) {
      (0, f.U)();
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    clearCofactor() {
      return this;
    }
    assertValidity() {
      this.ep.assertValidity();
    }
    toAffine(e) {
      return this.ep.toAffine(e);
    }
    toHex() {
      return (0, r.w)(this.toBytes());
    }
    toString() {
      return this.toHex();
    }
    isTorsionFree() {
      return !0;
    }
    isSmallOrder() {
      return !1;
    }
    add(e) {
      return (this.assertSame(e), this.init(this.ep.add(e.ep)));
    }
    subtract(e) {
      return (this.assertSame(e), this.init(this.ep.subtract(e.ep)));
    }
    multiply(e) {
      return this.init(this.ep.multiply(e));
    }
    multiplyUnsafe(e) {
      return this.init(this.ep.multiplyUnsafe(e));
    }
    double() {
      return this.init(this.ep.double());
    }
    negate() {
      return this.init(this.ep.negate());
    }
    precompute(e, t) {
      return this.init(this.ep.precompute(e, t));
    }
    toRawBytes() {
      return this.toBytes();
    }
  }
  var l = e.i(79262);
  (BigInt(0), BigInt(1), BigInt(2));
  let d = BigInt(0),
    p = BigInt(1),
    h = BigInt(2),
    m = BigInt(3),
    y = BigInt(5),
    v = BigInt(8),
    g = BigInt(
      "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
    ),
    b = {
      p: g,
      n: BigInt(
        "0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed",
      ),
      h: v,
      a: BigInt(
        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec",
      ),
      d: BigInt(
        "0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3",
      ),
      Gx: BigInt(
        "0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
      ),
      Gy: BigInt(
        "0x6666666666666666666666666666666666666666666666666666666666666658",
      ),
    },
    B = BigInt(
      "19681161376707505956807079304988542015446066515923890162744021073123829784752",
    );
  function x(e, t) {
    var r;
    let n,
      f,
      o,
      a,
      s,
      c,
      u,
      l,
      d,
      m,
      v,
      b,
      x,
      E,
      w = (0, i.K)(t * t * t, g),
      I = ((r = e * (0, i.K)(w * w * t, g)),
      (n = BigInt(10)),
      (f = BigInt(20)),
      (o = BigInt(40)),
      (a = BigInt(80)),
      (s = (((r * r) % g) * r) % g),
      (c = ((0, i.m)(s, h, g) * s) % g),
      (u = ((0, i.m)(c, p, g) * r) % g),
      (l = ((0, i.m)(u, y, g) * u) % g),
      (d = ((0, i.m)(l, n, g) * l) % g),
      (m = ((0, i.m)(d, f, g) * d) % g),
      (v = ((0, i.m)(m, o, g) * m) % g),
      (b = ((0, i.m)(v, a, g) * v) % g),
      (x = ((0, i.m)(b, a, g) * v) % g),
      (E = ((0, i.m)(x, n, g) * l) % g),
      { pow_p_5_8: ((0, i.m)(E, h, g) * r) % g, b2: s }).pow_p_5_8,
      _ = (0, i.K)(e * w * I, g),
      O = (0, i.K)(t * _ * _, g),
      L = _,
      S = (0, i.K)(_ * B, g),
      R = O === e,
      T = O === (0, i.K)(-e, g),
      A = O === (0, i.K)(-e * B, g);
    return (
      R && (_ = L),
      (T || A) && (_ = S),
      (0, i.f)(_, g) && (_ = (0, i.K)(-_, g)),
      { isValid: R || T, value: _ }
    );
  }
  let E = (0, i.N)(b.p, { isLE: !0 }),
    w = (0, i.N)(b.n, { isLE: !0 }),
    I = (function (e) {
      let t,
        u,
        l,
        d,
        {
          CURVE: p,
          curveOpts: h,
          hash: m,
          eddsaOpts: y,
        } = ((t = {
          a: e.a,
          d: e.d,
          p: e.Fp.ORDER,
          n: e.n,
          h: e.h,
          Gx: e.Gx,
          Gy: e.Gy,
        }),
        (u = {
          Fp: e.Fp,
          Fn: (0, i.N)(t.n, e.nBitLength, !0),
          uvRatio: e.uvRatio,
        }),
        (l = {
          randomBytes: e.randomBytes,
          adjustScalarBytes: e.adjustScalarBytes,
          domain: e.domain,
          prehash: e.prehash,
          mapToCurve: e.mapToCurve,
        }),
        { CURVE: t, curveOpts: u, hash: e.hash, eddsaOpts: l }),
        v = (function (e, t, n = {}) {
          if ("function" != typeof t)
            throw Error('"hash" function param is required');
          (0, f.S)(
            n,
            {},
            {
              adjustScalarBytes: "function",
              randomBytes: "function",
              domain: "function",
              prehash: "function",
              mapToCurve: "function",
            },
          );
          let { prehash: i } = n,
            { BASE: o, Fp: s, Fn: c } = e,
            u = n.randomBytes || r.a,
            l = n.adjustScalarBytes || ((e) => e),
            d =
              n.domain ||
              ((e, t, r) => {
                if (((0, f.Y)(r, "phflag"), t.length || r))
                  throw Error("Contexts/pre-hash are not supported");
                return e;
              });
          function p(e) {
            return c.create((0, f.F)(e));
          }
          function h(e) {
            var r;
            let n,
              i,
              a,
              s,
              c,
              {
                head: u,
                prefix: d,
                scalar: h,
              } = ((r = e),
              (n = b.secretKey),
              (r = (0, f.z)("private key", r, n)),
              (a = l(
                (i = (0, f.z)("hashed private key", t(r), 2 * n)).slice(0, n),
              )),
              (s = i.slice(n, 2 * n)),
              (c = p(a)),
              { head: a, prefix: s, scalar: c }),
              m = o.multiply(h),
              y = m.toBytes();
            return { head: u, prefix: d, scalar: h, point: m, pointBytes: y };
          }
          function m(e) {
            return h(e).pointBytes;
          }
          function y(e = Uint8Array.of(), ...n) {
            return p(t(d((0, r.t)(...n), (0, f.z)("context", e), !!i)));
          }
          let v = { zip215: !0 },
            g = s.BYTES,
            b = { secretKey: g, publicKey: g, signature: 2 * g, seed: g };
          function B(e = u(b.seed)) {
            return (0, f.G)(e, b.seed, "seed");
          }
          let x = {
            getExtendedPublicKey: h,
            randomSecretKey: B,
            isValidSecretKey: function (e) {
              return (0, r.g)(e) && e.length === c.BYTES;
            },
            isValidPublicKey: function (t, r) {
              try {
                return !!e.fromBytes(t, r);
              } catch (e) {
                return !1;
              }
            },
            toMontgomery(t) {
              let { y: r } = e.fromBytes(t),
                n = b.publicKey,
                f = 32 === n;
              if (!f && 57 !== n) throw Error("only defined for 25519 and 448");
              let i = f ? s.div(a + r, a - r) : s.div(r - a, r + a);
              return s.toBytes(i);
            },
            toMontgomerySecret(e) {
              let r = b.secretKey;
              return ((0, f.G)(e, r), l(t(e.subarray(0, r))).subarray(0, r));
            },
            randomPrivateKey: B,
            precompute: (t = 8, r = e.BASE) => r.precompute(t, !1),
          };
          return Object.freeze({
            keygen: function (e) {
              let t = x.randomSecretKey(e);
              return { secretKey: t, publicKey: m(t) };
            },
            getPublicKey: m,
            sign: function (e, t, n = {}) {
              ((e = (0, f.z)("message", e)), i && (e = i(e)));
              let { prefix: a, scalar: s, pointBytes: u } = h(t),
                l = y(n.context, a, e),
                d = o.multiply(l).toBytes(),
                p = y(n.context, d, u, e),
                m = c.create(l + p * s);
              if (!c.isValid(m)) throw Error("sign failed: invalid s");
              let v = (0, r.t)(d, c.toBytes(m));
              return (0, f.G)(v, b.signature, "result");
            },
            verify: function (t, r, n, a = v) {
              let s,
                c,
                u,
                { context: l, zip215: d } = a,
                p = b.signature;
              ((t = (0, f.z)("signature", t, p)),
                (r = (0, f.z)("message", r)),
                (n = (0, f.z)("publicKey", n, b.publicKey)),
                void 0 !== d && (0, f.Y)(d, "zip215"),
                i && (r = i(r)));
              let h = p / 2,
                m = t.subarray(0, h),
                g = (0, f.F)(t.subarray(h, p));
              try {
                ((s = e.fromBytes(n, d)),
                  (c = e.fromBytes(m, d)),
                  (u = o.multiplyUnsafe(g)));
              } catch (e) {
                return !1;
              }
              if (!d && s.isSmallOrder()) return !1;
              let B = y(l, c.toBytes(), s.toBytes(), r);
              return c
                .add(s.multiplyUnsafe(B))
                .subtract(u)
                .clearCofactor()
                .is0();
            },
            utils: x,
            Point: e,
            lengths: b,
          });
        })(
          (function (e, t = {}) {
            var i, u;
            let l,
              d,
              p,
              h,
              m,
              y = (0, n.o)("edwards", e, t, t.FpFnLE),
              { Fp: v, Fn: g } = y,
              b = y.CURVE,
              { h: B } = b;
            (0, f.S)(t, {}, { uvRatio: "function" });
            let x = s << (BigInt(8 * g.BYTES) - a),
              E =
                t.uvRatio ||
                ((e, t) => {
                  try {
                    return { isValid: !0, value: v.sqrt(v.div(e, t)) };
                  } catch (e) {
                    return { isValid: !1, value: o };
                  }
                });
            if (
              ((i = b.Gx),
              (u = b.Gy),
              (l = v.sqr(i)),
              (d = v.sqr(u)),
              (p = v.add(v.mul(b.a, l), d)),
              (h = v.add(v.ONE, v.mul(b.d, v.mul(l, d)))),
              !v.eql(p, h))
            )
              throw Error("bad curve params: generator point");
            function w(e, t, r = !1) {
              let n = r ? a : o;
              return ((0, f._)("coordinate " + e, t, n, x), t);
            }
            function I(e) {
              if (!(e instanceof L)) throw Error("ExtendedPoint expected");
            }
            let _ = (0, f.W)((e, t) => {
                let r,
                  n,
                  { X: f, Y: i, Z: s } = e,
                  u = e.is0();
                null == t && (t = u ? c : v.inv(s));
                let l = ((r = f * t), v.create(r)),
                  d = ((n = i * t), v.create(n)),
                  p = v.mul(s, t);
                if (u) return { x: o, y: a };
                if (p !== a) throw Error("invZ was invalid");
                return { x: l, y: d };
              }),
              O = (0, f.W)((e) => {
                let t,
                  r,
                  n,
                  f,
                  i,
                  o,
                  a,
                  s,
                  c,
                  u,
                  l,
                  d,
                  { a: p, d: h } = b;
                if (e.is0()) throw Error("bad point: ZERO");
                let { X: m, Y: y, Z: g, T: B } = e,
                  x = ((t = m * m), v.create(t)),
                  E = ((r = y * y), v.create(r)),
                  w = ((n = g * g), v.create(n)),
                  I = ((f = w * w), v.create(f));
                if (
                  ((a = w * ((i = x * p), (o = v.create(i) + E), v.create(o))),
                  v.create(a) !==
                    ((u =
                      I + ((c = h * ((s = x * E), v.create(s))), v.create(c))),
                    v.create(u)))
                )
                  throw Error("bad point: equation left != right (1)");
                if (((l = m * y), v.create(l) !== ((d = g * B), v.create(d))))
                  throw Error("bad point: equation left != right (2)");
                return !0;
              });
            class L {
              constructor(e, t, r, n) {
                ((this.X = w("x", e)),
                  (this.Y = w("y", t)),
                  (this.Z = w("z", r, !0)),
                  (this.T = w("t", n)),
                  Object.freeze(this));
              }
              static CURVE() {
                return b;
              }
              static fromAffine(e) {
                let t;
                if (e instanceof L) throw Error("extended point not allowed");
                let { x: r, y: n } = e || {};
                return (
                  w("x", r),
                  w("y", n),
                  new L(r, n, a, ((t = r * n), v.create(t)))
                );
              }
              static fromBytes(e, t = !1) {
                let r,
                  n,
                  i,
                  s,
                  c = v.BYTES,
                  { a: u, d: l } = b;
                ((e = (0, f.t)((0, f.G)(e, c, "point"))),
                  (0, f.Y)(t, "zip215"));
                let d = (0, f.t)(e),
                  p = e[c - 1];
                d[c - 1] = -129 & p;
                let h = (0, f.F)(d),
                  m = t ? x : v.ORDER;
                (0, f._)("point.y", h, o, m);
                let y = ((r = h * h), v.create(r)),
                  { isValid: g, value: B } = E(
                    ((n = y - a), v.create(n)),
                    ((i = l * y - u), v.create(i)),
                  );
                if (!g) throw Error("bad point: invalid y coordinate");
                let w = (B & a) === a,
                  I = (128 & p) != 0;
                if (!t && B === o && I) throw Error("bad point: x=0 and x_0=1");
                return (
                  I !== w && ((s = -B), (B = v.create(s))),
                  L.fromAffine({ x: B, y: h })
                );
              }
              static fromHex(e, t = !1) {
                return L.fromBytes((0, f.z)("point", e), t);
              }
              get x() {
                return this.toAffine().x;
              }
              get y() {
                return this.toAffine().y;
              }
              precompute(e = 8, t = !0) {
                return (S.createCache(this, e), t || this.multiply(s), this);
              }
              assertValidity() {
                O(this);
              }
              equals(e) {
                let t, r, n, f;
                I(e);
                let { X: i, Y: o, Z: a } = this,
                  { X: s, Y: c, Z: u } = e,
                  l = ((t = i * u), v.create(t)),
                  d = ((r = s * a), v.create(r)),
                  p = ((n = o * u), v.create(n)),
                  h = ((f = c * a), v.create(f));
                return l === d && p === h;
              }
              is0() {
                return this.equals(L.ZERO);
              }
              negate() {
                let e, t;
                return new L(
                  ((e = -this.X), v.create(e)),
                  this.Y,
                  this.Z,
                  ((t = -this.T), v.create(t)),
                );
              }
              double() {
                let e,
                  t,
                  r,
                  n,
                  f,
                  i,
                  o,
                  a,
                  c,
                  u,
                  l,
                  { a: d } = b,
                  { X: p, Y: h, Z: m } = this,
                  y = ((e = p * p), v.create(e)),
                  g = ((t = h * h), v.create(t)),
                  B = ((n = s * ((r = m * m), v.create(r))), v.create(n)),
                  x = ((f = d * y), v.create(f)),
                  E = p + h,
                  w = ((i = E * E), (o = v.create(i) - y - g), v.create(o)),
                  I = x + g,
                  _ = I - B,
                  O = x - g,
                  S = ((a = w * _), v.create(a)),
                  R = ((c = I * O), v.create(c)),
                  T = ((u = w * O), v.create(u));
                return new L(S, R, ((l = _ * I), v.create(l)), T);
              }
              add(e) {
                let t, r, n, f, i, o, a, s, c, u;
                I(e);
                let { a: l, d } = b,
                  { X: p, Y: h, Z: m, T: y } = this,
                  { X: g, Y: B, Z: x, T: E } = e,
                  w = ((t = p * g), v.create(t)),
                  _ = ((r = h * B), v.create(r)),
                  O = ((n = y * d * E), v.create(n)),
                  S = ((f = m * x), v.create(f)),
                  R = ((i = (p + h) * (g + B) - w - _), v.create(i)),
                  T = S - O,
                  A = S + O,
                  C = ((o = _ - l * w), v.create(o)),
                  q = ((a = R * T), v.create(a)),
                  P = ((s = A * C), v.create(s)),
                  F = ((c = R * C), v.create(c));
                return new L(q, P, ((u = T * A), v.create(u)), F);
              }
              subtract(e) {
                return this.add(e.negate());
              }
              multiply(e) {
                if (!g.isValidNot0(e))
                  throw Error("invalid scalar: expected 1 <= sc < curve.n");
                let { p: t, f: r } = S.cached(this, e, (e) => (0, n.s)(L, e));
                return (0, n.s)(L, [t, r])[0];
              }
              multiplyUnsafe(e, t = L.ZERO) {
                if (!g.isValid(e))
                  throw Error("invalid scalar: expected 0 <= sc < curve.n");
                return e === o
                  ? L.ZERO
                  : this.is0() || e === a
                    ? this
                    : S.unsafe(this, e, (e) => (0, n.s)(L, e), t);
              }
              isSmallOrder() {
                return this.multiplyUnsafe(B).is0();
              }
              isTorsionFree() {
                return S.unsafe(this, b.n).is0();
              }
              toAffine(e) {
                return _(this, e);
              }
              clearCofactor() {
                return B === a ? this : this.multiplyUnsafe(B);
              }
              toBytes() {
                let { x: e, y: t } = this.toAffine(),
                  r = v.toBytes(t);
                return ((r[r.length - 1] |= e & a ? 128 : 0), r);
              }
              toHex() {
                return (0, r.w)(this.toBytes());
              }
              toString() {
                return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
              }
              get ex() {
                return this.X;
              }
              get ey() {
                return this.Y;
              }
              get ez() {
                return this.Z;
              }
              get et() {
                return this.T;
              }
              static normalizeZ(e) {
                return (0, n.s)(L, e);
              }
              static msm(e, t) {
                return (0, n.g)(L, g, e, t);
              }
              _setWindowSize(e) {
                this.precompute(e);
              }
              toRawBytes() {
                return this.toBytes();
              }
            }
            ((L.BASE = new L(b.Gx, b.Gy, a, ((m = b.Gx * b.Gy), v.create(m)))),
              (L.ZERO = new L(o, a, a, o)),
              (L.Fp = v),
              (L.Fn = g));
            let S = new n.p(L, g.BITS);
            return (L.BASE.precompute(8), L);
          })(p, h),
          m,
          y,
        );
      return (
        (d = v.Point),
        Object.assign({}, v, {
          ExtendedPoint: d,
          CURVE: e,
          nBitLength: d.Fn.BITS,
          nByteLength: d.Fn.BYTES,
        })
      );
    })({
      ...b,
      Fp: E,
      hash: t.s,
      adjustScalarBytes: function (e) {
        return ((e[0] &= 248), (e[31] &= 127), (e[31] |= 64), e);
      },
      uvRatio: x,
    }),
    _ = (g + m) / v,
    O = E.pow(h, _),
    L = E.sqrt(E.neg(E.ONE)),
    S = (0, i.s)(E, E.neg(BigInt(486664)));
  (0, l.O)(
    I.Point,
    (e) =>
      (function (e) {
        let t,
          r,
          n,
          f,
          o,
          a,
          s,
          c,
          u,
          l,
          d,
          m,
          b,
          B,
          x,
          w,
          I,
          _,
          R,
          T,
          A,
          C,
          q,
          {
            xMn: P,
            xMd: F,
            yMn: j,
            yMd: K,
          } = ((t = (g - y) / v),
          (r = BigInt(486662)),
          (n = E.sqr(e)),
          (n = E.mul(n, h)),
          (f = E.add(n, E.ONE)),
          (o = E.neg(r)),
          (a = E.sqr(f)),
          (s = E.mul(a, f)),
          (c = E.mul(n, r)),
          (c = E.mul(c, o)),
          (c = E.add(c, a)),
          (c = E.mul(c, o)),
          (u = E.sqr(s)),
          (a = E.sqr(u)),
          (u = E.mul(u, s)),
          (u = E.mul(u, c)),
          (a = E.mul(a, u)),
          (l = E.pow(a, t)),
          (l = E.mul(l, u)),
          (d = E.mul(l, L)),
          (a = E.sqr(l)),
          (a = E.mul(a, s)),
          (m = E.eql(a, c)),
          (b = E.cmov(d, l, m)),
          (B = E.mul(o, n)),
          (x = E.mul(l, e)),
          (x = E.mul(x, O)),
          (w = E.mul(x, L)),
          (I = E.mul(c, n)),
          (a = E.sqr(x)),
          (a = E.mul(a, s)),
          (_ = E.eql(a, I)),
          (R = E.cmov(w, x, _)),
          (a = E.sqr(b)),
          (a = E.mul(a, s)),
          (T = E.eql(a, c)),
          (A = E.cmov(B, o, T)),
          (C = E.cmov(R, b, T)),
          (q = E.isOdd(C)),
          { xMn: A, xMd: f, yMn: (C = E.cmov(C, E.neg(C), T !== q)), yMd: p }),
          Z = E.mul(P, K);
        Z = E.mul(Z, S);
        let U = E.mul(F, j),
          z = E.sub(P, F),
          N = E.add(P, F),
          G = E.mul(U, N),
          Y = E.eql(G, E.ZERO);
        ((Z = E.cmov(Z, E.ZERO, Y)),
          (U = E.cmov(U, E.ONE, Y)),
          (z = E.cmov(z, E.ONE, Y)),
          (N = E.cmov(N, E.ONE, Y)));
        let [M, V] = (0, i.R)(E, [U, N], !0);
        return { x: E.mul(Z, M), y: E.mul(z, V) };
      })(e[0]),
    {
      DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
      encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
      p: g,
      m: 1,
      k: 128,
      expand: "xmd",
      hash: t.s,
    },
  );
  let R = BigInt(
      "25063068953384623474111414158702152701244531502492656460079210482610430750235",
    ),
    T = BigInt(
      "54469307008909316920995813868745141605393597292927456921205312896311721017578",
    ),
    A = BigInt(
      "1159843021668779879193775521855586647937357759715417654439879720876111806838",
    ),
    C = BigInt(
      "40440834346308536858101042469323190826248399146238708352240133220865137265952",
    ),
    q = BigInt(
      "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    ),
    P = (e) => I.Point.Fp.create((0, f.F)(e) & q);
  function F(e) {
    let t,
      r,
      n,
      f,
      o,
      a,
      s,
      c,
      u,
      l,
      d,
      h,
      m,
      y,
      v,
      { d: w } = b,
      _ = ((t = B * e * e), E.create(t)),
      O = ((r = (_ + p) * A), E.create(r)),
      L = BigInt(-1),
      S = ((f = (L - w * _) * ((n = _ + w), E.create(n))), E.create(f)),
      { isValid: T, value: q } = x(O, S),
      P = ((o = q * e), E.create(o));
    ((0, i.f)(P, g) || ((a = -P), (P = E.create(a))),
      T || (q = P),
      T || (L = _));
    let F = ((s = L * (_ - p) * C - S), E.create(s)),
      j = q * q,
      K = ((c = (q + q) * S), E.create(c)),
      Z = ((u = F * R), E.create(u)),
      U = ((l = p - j), E.create(l)),
      z = ((d = p + j), E.create(d));
    return new I.Point(
      ((h = K * z), E.create(h)),
      ((m = U * Z), E.create(m)),
      ((y = Z * z), E.create(y)),
      ((v = K * U), E.create(v)),
    );
  }
  class j extends u {
    constructor(e) {
      super(e);
    }
    static fromAffine(e) {
      return new j(I.Point.fromAffine(e));
    }
    assertSame(e) {
      if (!(e instanceof j)) throw Error("RistrettoPoint expected");
    }
    init(e) {
      return new j(e);
    }
    static hashToCurve(e) {
      var t;
      let n, i;
      return (
        (t = (0, f.z)("ristrettoHash", e, 64)),
        (0, r.C)(t, 64),
        (n = F(P(t.subarray(0, 32)))),
        (i = F(P(t.subarray(32, 64)))),
        new j(n.add(i))
      );
    }
    static fromBytes(e) {
      let t, n, o, a, s, c, u, l, h, m, y, v, B;
      (0, r.C)(e, 32);
      let { a: w, d: _ } = b,
        O = P(e);
      if (!(0, f.v)(E.toBytes(O), e) || (0, i.f)(O, g))
        throw Error("invalid ristretto255 encoding 1");
      let L = ((t = O * O), E.create(t)),
        S = ((n = p + w * L), E.create(n)),
        R = ((o = p - w * L), E.create(o)),
        T = ((a = S * S), E.create(a)),
        A = ((s = R * R), E.create(s)),
        C = ((c = w * _ * T - A), E.create(c)),
        { isValid: q, value: F } = ((u = C * A), x(p, E.create(u))),
        K = ((l = F * R), E.create(l)),
        Z = ((h = F * K * C), E.create(h)),
        U = ((m = (O + O) * K), E.create(m));
      (0, i.f)(U, g) && ((y = -U), (U = E.create(y)));
      let z = ((v = S * Z), E.create(v)),
        N = ((B = U * z), E.create(B));
      if (!q || (0, i.f)(N, g) || z === d)
        throw Error("invalid ristretto255 encoding 2");
      return new j(new I.Point(U, z, p, N));
    }
    static fromHex(e) {
      return j.fromBytes((0, f.z)("ristrettoHex", e, 32));
    }
    static msm(e, t) {
      return (0, n.g)(j, I.Point.Fn, e, t);
    }
    toBytes() {
      let e,
        t,
        r,
        n,
        f,
        o,
        a,
        s,
        c,
        u,
        l,
        d,
        h,
        { X: m, Y: y, Z: v, T: b } = this.ep,
        w =
          ((e = v + y),
          (r = E.create(e) * ((t = v - y), E.create(t))),
          E.create(r)),
        I = ((n = m * y), E.create(n)),
        { value: _ } =
          ((o = w * ((f = I * I), E.create(f))), x(p, E.create(o))),
        O = ((a = _ * w), E.create(a)),
        L = ((s = _ * I), E.create(s)),
        S = ((c = O * L * b), E.create(c));
      if ((0, i.f)(b * S, g)) {
        let e,
          t,
          r = ((e = y * B), E.create(e)),
          n = ((t = m * B), E.create(t));
        ((m = r), (y = n), (h = E.create(O * T)));
      } else h = L;
      (0, i.f)(m * S, g) && ((u = -y), (y = E.create(u)));
      let R = ((l = (v - y) * h), E.create(l));
      return ((0, i.f)(R, g) && ((d = -R), (R = E.create(d))), E.toBytes(R));
    }
    equals(e) {
      let t, r, n, f;
      this.assertSame(e);
      let { X: i, Y: o } = this.ep,
        { X: a, Y: s } = e.ep,
        c = ((t = i * s), E.create(t) === ((r = o * a), E.create(r))),
        u = ((n = o * s), E.create(n) === ((f = i * a), E.create(f)));
      return c || u;
    }
    is0() {
      return this.equals(j.ZERO);
    }
  }
  ((j.BASE = new j(I.Point.BASE)),
    (j.ZERO = new j(I.Point.ZERO)),
    (j.Fp = E),
    (j.Fn = w),
    e.s(["f", 0, I], 430981));
};
