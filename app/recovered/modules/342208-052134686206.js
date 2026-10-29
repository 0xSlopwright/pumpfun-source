// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(344160),
    i = e.r(508396),
    d = e.r(816217),
    a = e.r(454434),
    n = e.r(314822),
    c = d.assert,
    h = e.r(434028),
    s = e.r(285921);
  function o(e) {
    if (!(this instanceof o)) return new o(e);
    ("string" == typeof e &&
      (c(Object.prototype.hasOwnProperty.call(a, e), "Unknown curve " + e),
      (e = a[e])),
      e instanceof a.PresetCurve && (e = { curve: e }),
      (this.curve = e.curve.curve),
      (this.n = this.curve.n),
      (this.nh = this.n.ushrn(1)),
      (this.g = this.curve.g),
      (this.g = e.curve.g),
      this.g.precompute(e.curve.n.bitLength() + 1),
      (this.hash = e.hash || e.curve.hash));
  }
  ((t.exports = o),
    (o.prototype.keyPair = function (e) {
      return new h(this, e);
    }),
    (o.prototype.keyFromPrivate = function (e, t) {
      return h.fromPrivate(this, e, t);
    }),
    (o.prototype.keyFromPublic = function (e, t) {
      return h.fromPublic(this, e, t);
    }),
    (o.prototype.genKeyPair = function (e) {
      e || (e = {});
      for (
        var t = new i({
            hash: this.hash,
            pers: e.pers,
            persEnc: e.persEnc || "utf8",
            entropy: e.entropy || n(this.hash.hmacStrength),
            entropyEnc: (e.entropy && e.entropyEnc) || "utf8",
            nonce: this.n.toArray(),
          }),
          f = this.n.byteLength(),
          d = this.n.sub(new r(2));
        ;

      ) {
        var a = new r(t.generate(f));
        if (!(a.cmp(d) > 0)) return (a.iaddn(1), this.keyFromPrivate(a));
      }
    }),
    (o.prototype._truncateToN = function (e, t, f) {
      if (r.isBN(e) || "number" == typeof e)
        i = (e = new r(e, 16)).byteLength();
      else if ("object" == typeof e) ((i = e.length), (e = new r(e, 16)));
      else {
        var i,
          d = e.toString();
        ((i = (d.length + 1) >>> 1), (e = new r(d, 16)));
      }
      "number" != typeof f && (f = 8 * i);
      var a = f - this.n.bitLength();
      return (a > 0 && (e = e.ushrn(a)), !t && e.cmp(this.n) >= 0)
        ? e.sub(this.n)
        : e;
    }),
    (o.prototype.sign = function (e, t, f, d) {
      if (
        ("object" == typeof f && ((d = f), (f = null)),
        d || (d = {}),
        "string" != typeof e && "number" != typeof e && !r.isBN(e))
      ) {
        (c(
          "object" == typeof e && e && "number" == typeof e.length,
          "Expected message to be an array-like, a hex string, or a BN instance",
        ),
          c(e.length >>> 0 === e.length));
        for (var a = 0; a < e.length; a++) c((255 & e[a]) === e[a]);
      }
      ((t = this.keyFromPrivate(t, f)),
        c(
          !(e = this._truncateToN(e, !1, d.msgBitLength)).isNeg(),
          "Can not sign a negative message",
        ));
      var n = this.n.byteLength(),
        h = t.getPrivate().toArray("be", n),
        o = e.toArray("be", n);
      c(new r(o).eq(e), "Can not sign message");
      for (
        var u = new i({
            hash: this.hash,
            entropy: h,
            nonce: o,
            pers: d.pers,
            persEnc: d.persEnc || "utf8",
          }),
          b = this.n.sub(new r(1)),
          l = 0;
        ;
        l++
      ) {
        var p = d.k ? d.k(l) : new r(u.generate(this.n.byteLength()));
        if (0 >= (p = this._truncateToN(p, !0)).cmpn(1) || p.cmp(b) >= 0)
          continue;
        var m = this.g.mul(p);
        if (!m.isInfinity()) {
          var v = m.getX(),
            g = v.umod(this.n);
          if (0 !== g.cmpn(0)) {
            var y = p.invm(this.n).mul(g.mul(t.getPrivate()).iadd(e));
            if (0 !== (y = y.umod(this.n)).cmpn(0)) {
              var x = !!m.getY().isOdd() | (2 * (0 !== v.cmp(g)));
              return (
                d.canonical &&
                  y.cmp(this.nh) > 0 &&
                  ((y = this.n.sub(y)), (x ^= 1)),
                new s({ r: g, s: y, recoveryParam: x })
              );
            }
          }
        }
      }
    }),
    (o.prototype.verify = function (e, t, f, r, i) {
      (i || (i = {}),
        (e = this._truncateToN(e, !1, i.msgBitLength)),
        (f = this.keyFromPublic(f, r)));
      var d,
        a = (t = new s(t, "hex")).r,
        n = t.s;
      if (
        0 > a.cmpn(1) ||
        a.cmp(this.n) >= 0 ||
        0 > n.cmpn(1) ||
        n.cmp(this.n) >= 0
      )
        return !1;
      var c = n.invm(this.n),
        h = c.mul(e).umod(this.n),
        o = c.mul(a).umod(this.n);
      return this.curve._maxwellTrick
        ? !(d = this.g.jmulAdd(h, f.getPublic(), o)).isInfinity() && d.eqXToP(a)
        : !(d = this.g.mulAdd(h, f.getPublic(), o)).isInfinity() &&
            0 === d.getX().umod(this.n).cmp(a);
    }),
    (o.prototype.recoverPubKey = function (e, t, f, i) {
      (c((3 & f) === f, "The recovery param is more than two bits"),
        (t = new s(t, i)));
      var d = this.n,
        a = new r(e),
        n = t.r,
        h = t.s,
        o = 1 & f,
        u = f >> 1;
      if (n.cmp(this.curve.p.umod(this.curve.n)) >= 0 && u)
        throw Error("Unable to find sencond key candinate");
      n = u
        ? this.curve.pointFromX(n.add(this.curve.n), o)
        : this.curve.pointFromX(n, o);
      var b = t.r.invm(d),
        l = d.sub(a).mul(b).umod(d),
        p = h.mul(b).umod(d);
      return this.g.mulAdd(l, n, p);
    }),
    (o.prototype.getKeyRecoveryParam = function (e, t, f, r) {
      if (null !== (t = new s(t, r)).recoveryParam) return t.recoveryParam;
      for (var i, d = 0; d < 4; d++) {
        try {
          i = this.recoverPubKey(e, t, d);
        } catch (e) {
          continue;
        }
        if (i.eq(f)) return d;
      }
      throw Error("Unable to find valid recovery factor");
    }));
};
