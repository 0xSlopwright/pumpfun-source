// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(223336),
    i = e.r(992956),
    d = e.r(843831);
  function a(e) {
    if (!(this instanceof a)) return new a(e);
    ((this.hash = e.hash),
      (this.predResist = !!e.predResist),
      (this.outLen = this.hash.outSize),
      (this.minEntropy = e.minEntropy || this.hash.hmacStrength),
      (this._reseed = null),
      (this.reseedInterval = null),
      (this.K = null),
      (this.V = null));
    var t = i.toArray(e.entropy, e.entropyEnc || "hex"),
      f = i.toArray(e.nonce, e.nonceEnc || "hex"),
      r = i.toArray(e.pers, e.persEnc || "hex");
    (d(
      t.length >= this.minEntropy / 8,
      "Not enough entropy. Minimum is: " + this.minEntropy + " bits",
    ),
      this._init(t, f, r));
  }
  ((t.exports = a),
    (a.prototype._init = function (e, t, f) {
      var r = e.concat(t).concat(f);
      ((this.K = Array(this.outLen / 8)), (this.V = Array(this.outLen / 8)));
      for (var i = 0; i < this.V.length; i++)
        ((this.K[i] = 0), (this.V[i] = 1));
      (this._update(r),
        (this._reseed = 1),
        (this.reseedInterval = 0x1000000000000));
    }),
    (a.prototype._hmac = function () {
      return new r.hmac(this.hash, this.K);
    }),
    (a.prototype._update = function (e) {
      var t = this._hmac().update(this.V).update([0]);
      (e && (t = t.update(e)),
        (this.K = t.digest()),
        (this.V = this._hmac().update(this.V).digest()),
        e &&
          ((this.K = this._hmac()
            .update(this.V)
            .update([1])
            .update(e)
            .digest()),
          (this.V = this._hmac().update(this.V).digest())));
    }),
    (a.prototype.reseed = function (e, t, f, r) {
      ("string" != typeof t && ((r = f), (f = t), (t = null)),
        (e = i.toArray(e, t)),
        (f = i.toArray(f, r)),
        d(
          e.length >= this.minEntropy / 8,
          "Not enough entropy. Minimum is: " + this.minEntropy + " bits",
        ),
        this._update(e.concat(f || [])),
        (this._reseed = 1));
    }),
    (a.prototype.generate = function (e, t, f, r) {
      if (this._reseed > this.reseedInterval) throw Error("Reseed is required");
      ("string" != typeof t && ((r = f), (f = t), (t = null)),
        f && ((f = i.toArray(f, r || "hex")), this._update(f)));
      for (var d = []; d.length < e; )
        ((this.V = this._hmac().update(this.V).digest()),
          (d = d.concat(this.V)));
      var a = d.slice(0, e);
      return (this._update(f), this._reseed++, i.encode(a, t));
    }));
};
