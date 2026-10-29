// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.ethErrors = void 0));
  let n = e.r(416916),
    i = e.r(619468),
    o = e.r(948137);
  function a(e, t) {
    let [r, o] = l(t);
    return new n.EthereumRpcError(e, r || i.getMessageFromCode(e), o);
  }
  function s(e, t) {
    let [r, o] = l(t);
    return new n.EthereumProviderError(e, r || i.getMessageFromCode(e), o);
  }
  function l(e) {
    if (e) {
      if ("string" == typeof e) return [e];
      else if ("object" == typeof e && !Array.isArray(e)) {
        let { message: t, data: r } = e;
        if (t && "string" != typeof t)
          throw Error("Must specify string message.");
        return [t || void 0, r];
      }
    }
    return [];
  }
  r.ethErrors = {
    rpc: {
      parse: (e) => a(o.errorCodes.rpc.parse, e),
      invalidRequest: (e) => a(o.errorCodes.rpc.invalidRequest, e),
      invalidParams: (e) => a(o.errorCodes.rpc.invalidParams, e),
      methodNotFound: (e) => a(o.errorCodes.rpc.methodNotFound, e),
      internal: (e) => a(o.errorCodes.rpc.internal, e),
      server: (e) => {
        if (!e || "object" != typeof e || Array.isArray(e))
          throw Error(
            "Ethereum RPC Server errors must provide single object argument.",
          );
        let { code: t } = e;
        if (!Number.isInteger(t) || t > -32005 || t < -32099)
          throw Error(
            '"code" must be an integer such that: -32099 <= code <= -32005',
          );
        return a(t, e);
      },
      invalidInput: (e) => a(o.errorCodes.rpc.invalidInput, e),
      resourceNotFound: (e) => a(o.errorCodes.rpc.resourceNotFound, e),
      resourceUnavailable: (e) => a(o.errorCodes.rpc.resourceUnavailable, e),
      transactionRejected: (e) => a(o.errorCodes.rpc.transactionRejected, e),
      methodNotSupported: (e) => a(o.errorCodes.rpc.methodNotSupported, e),
      limitExceeded: (e) => a(o.errorCodes.rpc.limitExceeded, e),
    },
    provider: {
      userRejectedRequest: (e) =>
        s(o.errorCodes.provider.userRejectedRequest, e),
      unauthorized: (e) => s(o.errorCodes.provider.unauthorized, e),
      unsupportedMethod: (e) => s(o.errorCodes.provider.unsupportedMethod, e),
      disconnected: (e) => s(o.errorCodes.provider.disconnected, e),
      chainDisconnected: (e) => s(o.errorCodes.provider.chainDisconnected, e),
      custom: (e) => {
        if (!e || "object" != typeof e || Array.isArray(e))
          throw Error(
            "Ethereum Provider custom errors must provide single object argument.",
          );
        let { code: t, message: r, data: i } = e;
        if (!r || "string" != typeof r)
          throw Error('"message" must be a nonempty string');
        return new n.EthereumProviderError(t, r, i);
      },
    },
  };
};
