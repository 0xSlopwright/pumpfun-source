// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, f) => {
  var r = e.r(129767),
    i = e.r(843831);
  function d(e, t, f) {
    if (!(this instanceof d)) return new d(e, t, f);
    ((this.Hash = e),
      (this.blockSize = e.blockSize / 8),
      (this.outSize = e.outSize / 8),
      (this.inner = null),
      (this.outer = null),
      this._init(r.toArray(t, f)));
  }
  ((t.exports = d),
    (d.prototype._init = function (e) {
      (e.length > this.blockSize && (e = new this.Hash().update(e).digest()),
        i(e.length <= this.blockSize));
      for (var t = e.length; t < this.blockSize; t++) e.push(0);
      for (t = 0; t < e.length; t++) e[t] ^= 54;
      for (this.inner = new this.Hash().update(e), t = 0; t < e.length; t++)
        e[t] ^= 106;
      this.outer = new this.Hash().update(e);
    }),
    (d.prototype.update = function (e, t) {
      return (this.inner.update(e, t), this);
    }),
    (d.prototype.digest = function (e) {
      return (this.outer.update(this.inner.digest()), this.outer.digest(e));
    }));
};
