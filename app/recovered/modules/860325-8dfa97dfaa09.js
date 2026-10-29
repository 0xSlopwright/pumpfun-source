// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let { ObjectSetPrototypeOf: n, Symbol: i } = e.r(763323);
  t.exports = u;
  let { ERR_METHOD_NOT_IMPLEMENTED: o } = e.r(561079).codes,
    a = e.r(654547),
    { getHighWaterMark: s } = e.r(929772);
  (n(u.prototype, a.prototype), n(u, a));
  let l = i("kCallback");
  function u(e) {
    if (!(this instanceof u)) return new u(e);
    let t = e ? s(this, e, "readableHighWaterMark", !0) : null;
    (0 === t &&
      (e = {
        ...e,
        highWaterMark: null,
        readableHighWaterMark: t,
        writableHighWaterMark: e.writableHighWaterMark || 0,
      }),
      a.call(this, e),
      (this._readableState.sync = !1),
      (this[l] = null),
      e &&
        ("function" == typeof e.transform && (this._transform = e.transform),
        "function" == typeof e.flush && (this._flush = e.flush)),
      this.on("prefinish", c));
  }
  function d(e) {
    "function" != typeof this._flush || this.destroyed
      ? (this.push(null), e && e())
      : this._flush((t, r) => {
          t
            ? e
              ? e(t)
              : this.destroy(t)
            : (null != r && this.push(r), this.push(null), e && e());
        });
  }
  function c() {
    this._final !== d && d.call(this);
  }
  ((u.prototype._final = d),
    (u.prototype._transform = function (e, t, r) {
      throw new o("_transform()");
    }),
    (u.prototype._write = function (e, t, r) {
      let n = this._readableState,
        i = this._writableState,
        o = n.length;
      this._transform(e, t, (e, t) => {
        e
          ? r(e)
          : (null != t && this.push(t),
            i.ended || o === n.length || n.length < n.highWaterMark
              ? r()
              : (this[l] = r));
      });
    }),
    (u.prototype._read = function () {
      if (this[l]) {
        let e = this[l];
        ((this[l] = null), e());
      }
    }));
};
