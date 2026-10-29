// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(944445);
  function r(t, e, r) {
    return (t & e) ^ (~t & r);
  }
  function n(t, e, r) {
    return (t & e) ^ (t & r) ^ (e & r);
  }
  class i extends e.B {
    constructor(t, r, n, i) {
      (super(),
        (this.finished = !1),
        (this.length = 0),
        (this.pos = 0),
        (this.destroyed = !1),
        (this.blockLen = t),
        (this.outputLen = r),
        (this.padOffset = n),
        (this.isLE = i),
        (this.buffer = new Uint8Array(t)),
        (this.view = (0, e.y)(this.buffer)));
    }
    update(t) {
      ((0, e.s)(this), (t = (0, e.D)(t)), (0, e.C)(t));
      let { view: r, buffer: n, blockLen: i } = this,
        o = t.length;
      for (let f = 0; f < o; ) {
        let s = Math.min(i - this.pos, o - f);
        if (s === i) {
          let r = (0, e.y)(t);
          for (; i <= o - f; f += i) this.process(r, f);
          continue;
        }
        (n.set(t.subarray(f, f + s), this.pos),
          (this.pos += s),
          (f += s),
          this.pos === i && (this.process(r, 0), (this.pos = 0)));
      }
      return ((this.length += t.length), this.roundClean(), this);
    }
    digestInto(t) {
      ((0, e.s)(this), (0, e.W)(t, this), (this.finished = !0));
      let { buffer: r, view: n, blockLen: i, isLE: o } = this,
        { pos: f } = this;
      ((r[f++] = 128),
        (0, e.f)(this.buffer.subarray(f)),
        this.padOffset > i - f && (this.process(n, 0), (f = 0)));
      for (let t = f; t < i; t++) r[t] = 0;
      (!(function (t, e, r, n) {
        if ("function" == typeof t.setBigUint64) return t.setBigUint64(e, r, n);
        let i = BigInt(32),
          o = BigInt(0xffffffff),
          f = Number((r >> i) & o),
          s = Number(r & o),
          h = 4 * !!n,
          a = 4 * !n;
        (t.setUint32(e + h, f, n), t.setUint32(e + a, s, n));
      })(n, i - 8, BigInt(8 * this.length), o),
        this.process(n, 0));
      let s = (0, e.y)(t),
        h = this.outputLen;
      if (h % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
      let a = h / 4,
        u = this.get();
      if (a > u.length) throw Error("_sha2: outputLen bigger than state");
      for (let t = 0; t < a; t++) s.setUint32(4 * t, u[t], o);
    }
    digest() {
      let { buffer: t, outputLen: e } = this;
      this.digestInto(t);
      let r = t.slice(0, e);
      return (this.destroy(), r);
    }
    _cloneInto(t) {
      (t || (t = new this.constructor()), t.set(...this.get()));
      let {
        blockLen: e,
        buffer: r,
        length: n,
        finished: i,
        destroyed: o,
        pos: f,
      } = this;
      return (
        (t.destroyed = o),
        (t.finished = i),
        (t.length = n),
        (t.pos = f),
        n % e && t.buffer.set(r),
        t
      );
    }
    clone() {
      return this._cloneInto();
    }
  }
  let o = Uint32Array.from([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19,
    ]),
    f = Uint32Array.from([
      0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511,
      0x64f98fa7, 0xbefa4fa4,
    ]),
    s = Uint32Array.from([
      0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507, 0x9159015a, 0x3070dd17,
      0x152fecd8, 0xf70e5939, 0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511,
      0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4,
    ]),
    h = Uint32Array.from([
      0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b,
      0xa54ff53a, 0x5f1d36f1, 0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
      0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179,
    ]);
  t.s(
    [
      "F",
      0,
      r,
      "u",
      0,
      i,
      "O",
      0,
      n,
      "h",
      0,
      f,
      "n",
      0,
      o,
      "D",
      0,
      s,
      "s",
      0,
      h,
    ],
    853197,
  );
  var a = t.i(882469);
  let u = Uint32Array.from([
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
    c = new Uint32Array(64);
  class l extends i {
    constructor(t = 32) {
      (super(64, t, 8, !1),
        (this.A = 0 | o[0]),
        (this.B = 0 | o[1]),
        (this.C = 0 | o[2]),
        (this.D = 0 | o[3]),
        (this.E = 0 | o[4]),
        (this.F = 0 | o[5]),
        (this.G = 0 | o[6]),
        (this.H = 0 | o[7]));
    }
    get() {
      let { A: t, B: e, C: r, D: n, E: i, F: o, G: f, H: s } = this;
      return [t, e, r, n, i, o, f, s];
    }
    set(t, e, r, n, i, o, f, s) {
      ((this.A = 0 | t),
        (this.B = 0 | e),
        (this.C = 0 | r),
        (this.D = 0 | n),
        (this.E = 0 | i),
        (this.F = 0 | o),
        (this.G = 0 | f),
        (this.H = 0 | s));
    }
    process(t, i) {
      for (let e = 0; e < 16; e++, i += 4) c[e] = t.getUint32(i, !1);
      for (let t = 16; t < 64; t++) {
        let r = c[t - 15],
          n = c[t - 2],
          i = (0, e.M)(r, 7) ^ (0, e.M)(r, 18) ^ (r >>> 3),
          o = (0, e.M)(n, 17) ^ (0, e.M)(n, 19) ^ (n >>> 10);
        c[t] = (o + c[t - 7] + i + c[t - 16]) | 0;
      }
      let { A: o, B: f, C: s, D: h, E: a, F: l, G: p, H: b } = this;
      for (let t = 0; t < 64; t++) {
        let i =
            (b +
              ((0, e.M)(a, 6) ^ (0, e.M)(a, 11) ^ (0, e.M)(a, 25)) +
              r(a, l, p) +
              u[t] +
              c[t]) |
            0,
          d =
            (((0, e.M)(o, 2) ^ (0, e.M)(o, 13) ^ (0, e.M)(o, 22)) +
              n(o, f, s)) |
            0;
        ((b = p),
          (p = l),
          (l = a),
          (a = (h + i) | 0),
          (h = s),
          (s = f),
          (f = o),
          (o = (i + d) | 0));
      }
      ((o = (o + this.A) | 0),
        (f = (f + this.B) | 0),
        (s = (s + this.C) | 0),
        (h = (h + this.D) | 0),
        (a = (a + this.E) | 0),
        (l = (l + this.F) | 0),
        (p = (p + this.G) | 0),
        (b = (b + this.H) | 0),
        this.set(o, f, s, h, a, l, p, b));
    }
    roundClean() {
      (0, e.f)(c);
    }
    destroy() {
      (this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, e.f)(this.buffer));
    }
  }
  class p extends l {
    constructor() {
      (super(28),
        (this.A = 0 | f[0]),
        (this.B = 0 | f[1]),
        (this.C = 0 | f[2]),
        (this.D = 0 | f[3]),
        (this.E = 0 | f[4]),
        (this.F = 0 | f[5]),
        (this.G = 0 | f[6]),
        (this.H = 0 | f[7]));
    }
  }
  let b = a.$(
      [
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817",
      ].map((t) => BigInt(t)),
    ),
    d = b[0],
    y = b[1],
    x = new Uint32Array(80),
    g = new Uint32Array(80);
  class v extends i {
    constructor(t = 64) {
      (super(128, t, 16, !1),
        (this.Ah = 0 | h[0]),
        (this.Al = 0 | h[1]),
        (this.Bh = 0 | h[2]),
        (this.Bl = 0 | h[3]),
        (this.Ch = 0 | h[4]),
        (this.Cl = 0 | h[5]),
        (this.Dh = 0 | h[6]),
        (this.Dl = 0 | h[7]),
        (this.Eh = 0 | h[8]),
        (this.El = 0 | h[9]),
        (this.Fh = 0 | h[10]),
        (this.Fl = 0 | h[11]),
        (this.Gh = 0 | h[12]),
        (this.Gl = 0 | h[13]),
        (this.Hh = 0 | h[14]),
        (this.Hl = 0 | h[15]));
    }
    get() {
      let {
        Ah: t,
        Al: e,
        Bh: r,
        Bl: n,
        Ch: i,
        Cl: o,
        Dh: f,
        Dl: s,
        Eh: h,
        El: a,
        Fh: u,
        Fl: c,
        Gh: l,
        Gl: p,
        Hh: b,
        Hl: d,
      } = this;
      return [t, e, r, n, i, o, f, s, h, a, u, c, l, p, b, d];
    }
    set(t, e, r, n, i, o, f, s, h, a, u, c, l, p, b, d) {
      ((this.Ah = 0 | t),
        (this.Al = 0 | e),
        (this.Bh = 0 | r),
        (this.Bl = 0 | n),
        (this.Ch = 0 | i),
        (this.Cl = 0 | o),
        (this.Dh = 0 | f),
        (this.Dl = 0 | s),
        (this.Eh = 0 | h),
        (this.El = 0 | a),
        (this.Fh = 0 | u),
        (this.Fl = 0 | c),
        (this.Gh = 0 | l),
        (this.Gl = 0 | p),
        (this.Hh = 0 | b),
        (this.Hl = 0 | d));
    }
    process(t, e) {
      for (let r = 0; r < 16; r++, e += 4)
        ((x[r] = t.getUint32(e)), (g[r] = t.getUint32((e += 4))));
      for (let t = 16; t < 80; t++) {
        let e = 0 | x[t - 15],
          r = 0 | g[t - 15],
          n = a.q(e, r, 1) ^ a.q(e, r, 8) ^ a.a(e, r, 7),
          i = a.h(e, r, 1) ^ a.h(e, r, 8) ^ a.I(e, r, 7),
          o = 0 | x[t - 2],
          f = 0 | g[t - 2],
          s = a.q(o, f, 19) ^ a.u(o, f, 61) ^ a.a(o, f, 6),
          h = a.h(o, f, 19) ^ a.N(o, f, 61) ^ a.I(o, f, 6),
          u = a.Z(i, h, g[t - 7], g[t - 16]),
          c = a.l(u, n, s, x[t - 7], x[t - 16]);
        ((x[t] = 0 | c), (g[t] = 0 | u));
      }
      let {
        Ah: r,
        Al: n,
        Bh: i,
        Bl: o,
        Ch: f,
        Cl: s,
        Dh: h,
        Dl: u,
        Eh: c,
        El: l,
        Fh: p,
        Fl: b,
        Gh: v,
        Gl: w,
        Hh: m,
        Hl: E,
      } = this;
      for (let t = 0; t < 80; t++) {
        let e = a.q(c, l, 14) ^ a.q(c, l, 18) ^ a.u(c, l, 41),
          A = a.h(c, l, 14) ^ a.h(c, l, 18) ^ a.N(c, l, 41),
          B = (c & p) ^ (~c & v),
          U = (l & b) ^ (~l & w),
          I = a.c(E, A, U, y[t], g[t]),
          C = a.p(I, m, e, B, d[t], x[t]),
          L = 0 | I,
          O = a.q(r, n, 28) ^ a.u(r, n, 34) ^ a.u(r, n, 39),
          _ = a.h(r, n, 28) ^ a.N(r, n, 34) ^ a.N(r, n, 39),
          T = (r & i) ^ (r & f) ^ (i & f),
          S = (n & o) ^ (n & s) ^ (o & s);
        ((m = 0 | v),
          (E = 0 | w),
          (v = 0 | p),
          (w = 0 | b),
          (p = 0 | c),
          (b = 0 | l),
          ({ h: c, l: l } = a.s(0 | h, 0 | u, 0 | C, 0 | L)),
          (h = 0 | f),
          (u = 0 | s),
          (f = 0 | i),
          (s = 0 | o),
          (i = 0 | r),
          (o = 0 | n));
        let M = a.d(L, _, S);
        ((r = a.H(M, C, O, T)), (n = 0 | M));
      }
      (({ h: r, l: n } = a.s(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)),
        ({ h: i, l: o } = a.s(0 | this.Bh, 0 | this.Bl, 0 | i, 0 | o)),
        ({ h: f, l: s } = a.s(0 | this.Ch, 0 | this.Cl, 0 | f, 0 | s)),
        ({ h: h, l: u } = a.s(0 | this.Dh, 0 | this.Dl, 0 | h, 0 | u)),
        ({ h: c, l: l } = a.s(0 | this.Eh, 0 | this.El, 0 | c, 0 | l)),
        ({ h: p, l: b } = a.s(0 | this.Fh, 0 | this.Fl, 0 | p, 0 | b)),
        ({ h: v, l: w } = a.s(0 | this.Gh, 0 | this.Gl, 0 | v, 0 | w)),
        ({ h: m, l: E } = a.s(0 | this.Hh, 0 | this.Hl, 0 | m, 0 | E)),
        this.set(r, n, i, o, f, s, h, u, c, l, p, b, v, w, m, E));
    }
    roundClean() {
      (0, e.f)(x, g);
    }
    destroy() {
      ((0, e.f)(this.buffer),
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    }
  }
  class w extends v {
    constructor() {
      (super(48),
        (this.Ah = 0 | s[0]),
        (this.Al = 0 | s[1]),
        (this.Bh = 0 | s[2]),
        (this.Bl = 0 | s[3]),
        (this.Ch = 0 | s[4]),
        (this.Cl = 0 | s[5]),
        (this.Dh = 0 | s[6]),
        (this.Dl = 0 | s[7]),
        (this.Eh = 0 | s[8]),
        (this.El = 0 | s[9]),
        (this.Fh = 0 | s[10]),
        (this.Fl = 0 | s[11]),
        (this.Gh = 0 | s[12]),
        (this.Gl = 0 | s[13]),
        (this.Hh = 0 | s[14]),
        (this.Hl = 0 | s[15]));
    }
  }
  let m = (0, e.O)(() => new l()),
    E = (0, e.O)(() => new p()),
    A = (0, e.O)(() => new v()),
    B = (0, e.O)(() => new w());
  t.s(
    ["h", 0, p, "i", 0, l, "z", 0, E, "E", 0, m, "u", 0, B, "s", 0, A],
    837474,
  );
};
