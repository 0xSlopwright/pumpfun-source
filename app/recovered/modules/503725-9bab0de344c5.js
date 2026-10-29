// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(393547),
    r = e.i(532617),
    o = e.i(575663);
  class s extends r.f {
    constructor({
      body: e,
      cause: r,
      details: s,
      headers: n,
      status: a,
      url: i,
    }) {
      (super("HTTP request failed.", {
        cause: r,
        details: s,
        metaMessages: [
          a && `Status: ${a}`,
          `URL: ${(0, o.p)(i)}`,
          e && `Request body: ${(0, t.f)(e)}`,
        ].filter(Boolean),
        name: "HttpRequestError",
      }),
        Object.defineProperty(this, "body", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "headers", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "status", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "url", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.body = e),
        (this.headers = n),
        (this.status = a),
        (this.url = i));
    }
  }
  r.f;
  class n extends r.f {
    constructor({ body: e, error: r, url: s }) {
      (super("RPC Request failed.", {
        cause: r,
        details: r.message,
        metaMessages: [`URL: ${(0, o.p)(s)}`, `Request body: ${(0, t.f)(e)}`],
        name: "RpcRequestError",
      }),
        Object.defineProperty(this, "code", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "data", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "url", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.code = r.code),
        (this.data = r.data),
        (this.url = s));
    }
  }
  r.f;
  class a extends r.f {
    constructor({ body: e, url: r }) {
      (super("The request took too long to respond.", {
        details: "The request timed out.",
        metaMessages: [`URL: ${(0, o.p)(r)}`, `Request body: ${(0, t.f)(e)}`],
        name: "TimeoutError",
      }),
        Object.defineProperty(this, "url", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.url = r));
    }
  }
  e.s(["y", 0, s, "V", 0, n, "t", 0, a]);
};
