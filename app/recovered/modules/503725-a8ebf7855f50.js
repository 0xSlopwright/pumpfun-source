// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var f = e.i(393547),
    r = e.i(532617),
    t = e.i(575663);
  class o extends r.f {
    constructor({
      body: e,
      cause: r,
      details: o,
      headers: a,
      status: s,
      url: n,
    }) {
      (super("HTTP request failed.", {
        cause: r,
        details: o,
        metaMessages: [
          s && `Status: ${s}`,
          `URL: ${(0, t.p)(n)}`,
          e && `Request body: ${(0, f.f)(e)}`,
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
        (this.headers = a),
        (this.status = s),
        (this.url = n));
    }
  }
  r.f;
  class a extends r.f {
    constructor({ body: e, error: r, url: o }) {
      (super("RPC Request failed.", {
        cause: r,
        details: r.message,
        metaMessages: [`URL: ${(0, t.p)(o)}`, `Request body: ${(0, f.f)(e)}`],
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
        (this.url = o));
    }
  }
  r.f;
  class s extends r.f {
    constructor({ body: e, url: r }) {
      (super("The request took too long to respond.", {
        details: "The request timed out.",
        metaMessages: [`URL: ${(0, t.p)(r)}`, `Request body: ${(0, f.f)(e)}`],
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
  e.s(["y", 0, o, "V", 0, a, "t", 0, s]);
};
