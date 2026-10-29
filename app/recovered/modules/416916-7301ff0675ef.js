// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.EthereumProviderError = r.EthereumRpcError = void 0));
  let n = e.r(87131);
  class i extends Error {
    constructor(e, t, r) {
      if (!Number.isInteger(e)) throw Error('"code" must be an integer.');
      if (!t || "string" != typeof t)
        throw Error('"message" must be a nonempty string.');
      (super(t), (this.code = e), void 0 !== r && (this.data = r));
    }
    serialize() {
      let e = { code: this.code, message: this.message };
      return (
        void 0 !== this.data && (e.data = this.data),
        this.stack && (e.stack = this.stack),
        e
      );
    }
    toString() {
      return n.default(this.serialize(), o, 2);
    }
  }
  function o(e, t) {
    if ("[Circular]" !== t) return t;
  }
  ((r.EthereumRpcError = i),
    (r.EthereumProviderError = class extends i {
      constructor(e, t, r) {
        var n;
        if (!(Number.isInteger((n = e)) && n >= 1e3 && n <= 4999))
          throw Error(
            '"code" must be an integer such that: 1000 <= code <= 4999',
          );
        super(e, t, r);
      }
    }));
};
