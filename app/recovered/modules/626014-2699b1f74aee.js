// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(882469),
    r = t.i(944445);
  let n = BigInt(0),
    i = BigInt(1),
    o = BigInt(2),
    s = BigInt(7),
    f = BigInt(256),
    h = BigInt(113),
    a = [],
    u = [],
    c = [];
  for (let t = 0, e = i, r = 1, l = 0; t < 24; t++) {
    (([r, l] = [l, (2 * r + 3 * l) % 5]),
      a.push(2 * (5 * l + r)),
      u.push((((t + 1) * (t + 2)) / 2) % 64));
    let p = n;
    for (let t = 0; t < 7; t++)
      (e = ((e << i) ^ ((e >> s) * h)) % f) & o &&
        (p ^= i << ((i << BigInt(t)) - i));
    c.push(p);
  }
  let l = (0, e.$)(c, !0),
    p = l[0],
    d = l[1],
    y = (t, r, n) => (n > 32 ? (0, e.v)(t, r, n) : (0, e.C)(t, r, n)),
    b = (t, r, n) => (n > 32 ? (0, e.L)(t, r, n) : (0, e.t)(t, r, n));
  class g extends r.B {
    constructor(t, e, n, i = !1, o = 24) {
      if (
        (super(),
        (this.pos = 0),
        (this.posOut = 0),
        (this.finished = !1),
        (this.destroyed = !1),
        (this.enableXOF = !1),
        (this.blockLen = t),
        (this.suffix = e),
        (this.outputLen = n),
        (this.enableXOF = i),
        (this.rounds = o),
        (0, r.N)(n),
        !(0 < t && t < 200))
      )
        throw Error("only keccak-f1600 function is supported");
      ((this.state = new Uint8Array(200)),
        (this.state32 = (0, r.b)(this.state)));
    }
    clone() {
      return this._cloneInto();
    }
    keccak() {
      ((0, r.o)(this.state32),
        (function (t, e = 24) {
          let n = new Uint32Array(10);
          for (let r = 24 - e; r < 24; r++) {
            for (let e = 0; e < 10; e++)
              n[e] = t[e] ^ t[e + 10] ^ t[e + 20] ^ t[e + 30] ^ t[e + 40];
            for (let e = 0; e < 10; e += 2) {
              let r = (e + 8) % 10,
                i = (e + 2) % 10,
                o = n[i],
                s = n[i + 1],
                f = y(o, s, 1) ^ n[r],
                h = b(o, s, 1) ^ n[r + 1];
              for (let r = 0; r < 50; r += 10)
                ((t[e + r] ^= f), (t[e + r + 1] ^= h));
            }
            let e = t[2],
              i = t[3];
            for (let r = 0; r < 24; r++) {
              let n = u[r],
                o = y(e, i, n),
                s = b(e, i, n),
                f = a[r];
              ((e = t[f]), (i = t[f + 1]), (t[f] = o), (t[f + 1] = s));
            }
            for (let e = 0; e < 50; e += 10) {
              for (let r = 0; r < 10; r++) n[r] = t[e + r];
              for (let r = 0; r < 10; r++)
                t[e + r] ^= ~n[(r + 2) % 10] & n[(r + 4) % 10];
            }
            ((t[0] ^= p[r]), (t[1] ^= d[r]));
          }
          (0, r.f)(n);
        })(this.state32, this.rounds),
        (0, r.o)(this.state32),
        (this.posOut = 0),
        (this.pos = 0));
    }
    update(t) {
      ((0, r.s)(this), (t = (0, r.D)(t)), (0, r.C)(t));
      let { blockLen: e, state: n } = this,
        i = t.length;
      for (let r = 0; r < i; ) {
        let o = Math.min(e - this.pos, i - r);
        for (let e = 0; e < o; e++) n[this.pos++] ^= t[r++];
        this.pos === e && this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished) return;
      this.finished = !0;
      let { state: t, suffix: e, pos: r, blockLen: n } = this;
      ((t[r] ^= e),
        (128 & e) != 0 && r === n - 1 && this.keccak(),
        (t[n - 1] ^= 128),
        this.keccak());
    }
    writeInto(t) {
      ((0, r.s)(this, !1), (0, r.C)(t), this.finish());
      let e = this.state,
        { blockLen: n } = this;
      for (let r = 0, i = t.length; r < i; ) {
        this.posOut >= n && this.keccak();
        let o = Math.min(n - this.posOut, i - r);
        (t.set(e.subarray(this.posOut, this.posOut + o), r),
          (this.posOut += o),
          (r += o));
      }
      return t;
    }
    xofInto(t) {
      if (!this.enableXOF) throw Error("XOF is not possible for this instance");
      return this.writeInto(t);
    }
    xof(t) {
      return ((0, r.N)(t), this.xofInto(new Uint8Array(t)));
    }
    digestInto(t) {
      if (((0, r.W)(t, this), this.finished))
        throw Error("digest() was already called");
      return (this.writeInto(t), this.destroy(), t);
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      ((this.destroyed = !0), (0, r.f)(this.state));
    }
    _cloneInto(t) {
      let {
        blockLen: e,
        suffix: r,
        outputLen: n,
        rounds: i,
        enableXOF: o,
      } = this;
      return (
        t || (t = new g(e, r, n, o, i)),
        t.state32.set(this.state32),
        (t.pos = this.pos),
        (t.posOut = this.posOut),
        (t.finished = this.finished),
        (t.rounds = i),
        (t.suffix = r),
        (t.outputLen = n),
        (t.enableXOF = o),
        (t.destroyed = this.destroyed),
        t
      );
    }
  }
  let x = (0, r.O)(() => new g(136, 1, 32));
  t.s(["f", 0, x]);
};
