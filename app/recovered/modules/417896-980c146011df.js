// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e = t.i(944445);
  class r extends e.B {
    constructor(t, r) {
      (super(), (this.finished = !1), (this.destroyed = !1), (0, e.v)(t));
      let n = (0, e.D)(r);
      if (((this.iHash = t.create()), "function" != typeof this.iHash.update))
        throw Error("Expected instance of class which extends utils.Hash");
      ((this.blockLen = this.iHash.blockLen),
        (this.outputLen = this.iHash.outputLen));
      let i = this.blockLen,
        o = new Uint8Array(i);
      o.set(n.length > i ? t.create().update(n).digest() : n);
      for (let t = 0; t < o.length; t++) o[t] ^= 54;
      (this.iHash.update(o), (this.oHash = t.create()));
      for (let t = 0; t < o.length; t++) o[t] ^= 106;
      (this.oHash.update(o), (0, e.f)(o));
    }
    update(t) {
      return ((0, e.s)(this), this.iHash.update(t), this);
    }
    digestInto(t) {
      ((0, e.s)(this),
        (0, e.C)(t, this.outputLen),
        (this.finished = !0),
        this.iHash.digestInto(t),
        this.oHash.update(t),
        this.oHash.digestInto(t),
        this.destroy());
    }
    digest() {
      let t = new Uint8Array(this.oHash.outputLen);
      return (this.digestInto(t), t);
    }
    _cloneInto(t) {
      t || (t = Object.create(Object.getPrototypeOf(this), {}));
      let {
        oHash: e,
        iHash: r,
        finished: n,
        destroyed: i,
        blockLen: o,
        outputLen: f,
      } = this;
      return (
        (t.finished = n),
        (t.destroyed = i),
        (t.blockLen = o),
        (t.outputLen = f),
        (t.oHash = e._cloneInto(t.oHash)),
        (t.iHash = r._cloneInto(t.iHash)),
        t
      );
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      ((this.destroyed = !0), this.oHash.destroy(), this.iHash.destroy());
    }
  }
  let n = (t, e, n) => new r(t, e).update(n).digest();
  ((n.create = (t, e) => new r(t, e)), t.s(["f", 0, n]));
};
