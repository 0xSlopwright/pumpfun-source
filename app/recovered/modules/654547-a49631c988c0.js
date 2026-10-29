// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let n,
    i,
    {
      ObjectDefineProperties: o,
      ObjectGetOwnPropertyDescriptor: a,
      ObjectKeys: s,
      ObjectSetPrototypeOf: l,
    } = e.r(763323);
  t.exports = c;
  let u = e.r(631284),
    d = e.r(713386);
  (l(c.prototype, u.prototype), l(c, u));
  {
    let e = s(d.prototype);
    for (let t = 0; t < e.length; t++) {
      let r = e[t];
      c.prototype[r] || (c.prototype[r] = d.prototype[r]);
    }
  }
  function c(e) {
    if (!(this instanceof c)) return new c(e);
    (u.call(this, e),
      d.call(this, e),
      e
        ? ((this.allowHalfOpen = !1 !== e.allowHalfOpen),
          !1 === e.readable &&
            ((this._readableState.readable = !1),
            (this._readableState.ended = !0),
            (this._readableState.endEmitted = !0)),
          !1 === e.writable &&
            ((this._writableState.writable = !1),
            (this._writableState.ending = !0),
            (this._writableState.ended = !0),
            (this._writableState.finished = !0)))
        : (this.allowHalfOpen = !0));
  }
  function f() {
    return (void 0 === n && (n = {}), n);
  }
  (o(c.prototype, {
    writable: { __proto__: null, ...a(d.prototype, "writable") },
    writableHighWaterMark: {
      __proto__: null,
      ...a(d.prototype, "writableHighWaterMark"),
    },
    writableObjectMode: {
      __proto__: null,
      ...a(d.prototype, "writableObjectMode"),
    },
    writableBuffer: { __proto__: null, ...a(d.prototype, "writableBuffer") },
    writableLength: { __proto__: null, ...a(d.prototype, "writableLength") },
    writableFinished: {
      __proto__: null,
      ...a(d.prototype, "writableFinished"),
    },
    writableCorked: { __proto__: null, ...a(d.prototype, "writableCorked") },
    writableEnded: { __proto__: null, ...a(d.prototype, "writableEnded") },
    writableNeedDrain: {
      __proto__: null,
      ...a(d.prototype, "writableNeedDrain"),
    },
    destroyed: {
      __proto__: null,
      get() {
        return (
          void 0 !== this._readableState &&
          void 0 !== this._writableState &&
          this._readableState.destroyed &&
          this._writableState.destroyed
        );
      },
      set(e) {
        this._readableState &&
          this._writableState &&
          ((this._readableState.destroyed = e),
          (this._writableState.destroyed = e));
      },
    },
  }),
    (c.fromWeb = function (e, t) {
      return f().newStreamDuplexFromReadableWritablePair(e, t);
    }),
    (c.toWeb = function (e) {
      return f().newReadableWritablePairFromDuplex(e);
    }),
    (c.from = function (t) {
      return (i || (i = e.r(988048)), i(t, "body"));
    }));
};
