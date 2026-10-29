// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  (Object.defineProperty(r, "__esModule", { value: !0 }),
    (r.serializeError =
      r.isValidCode =
      r.getMessageFromCode =
      r.JSON_RPC_SERVER_ERROR_MESSAGE =
        void 0));
  let n = e.r(948137),
    i = e.r(416916),
    o = n.errorCodes.rpc.internal,
    a = { code: o, message: s(o) };
  function s(
    e,
    t = "Unspecified error message. This is a bug, please report it.",
  ) {
    if (Number.isInteger(e)) {
      var i;
      let t = e.toString();
      if (d(n.errorValues, t)) return n.errorValues[t].message;
      if ((i = e) >= -32099 && i <= -32e3)
        return r.JSON_RPC_SERVER_ERROR_MESSAGE;
    }
    return t;
  }
  function l(e) {
    var t;
    if (!Number.isInteger(e)) return !1;
    let r = e.toString();
    return !!(n.errorValues[r] || ((t = e) >= -32099 && t <= -32e3));
  }
  ((r.JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error."),
    (r.getMessageFromCode = s),
    (r.isValidCode = l));
  function u(e) {
    return e && "object" == typeof e && !Array.isArray(e)
      ? Object.assign({}, e)
      : e;
  }
  function d(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  r.serializeError = function (
    e,
    { fallbackError: t = a, shouldIncludeStack: r = !1 } = {},
  ) {
    if (!t || !Number.isInteger(t.code) || "string" != typeof t.message)
      throw Error(
        "Must provide fallback error with integer number code and string message.",
      );
    if (e instanceof i.EthereumRpcError) return e.serialize();
    let n = {};
    if (
      e &&
      "object" == typeof e &&
      !Array.isArray(e) &&
      d(e, "code") &&
      l(e.code)
    )
      ((n.code = e.code),
        e.message && "string" == typeof e.message
          ? ((n.message = e.message), d(e, "data") && (n.data = e.data))
          : ((n.message = s(n.code)), (n.data = { originalError: u(e) })));
    else {
      n.code = t.code;
      let r = null == e ? void 0 : e.message;
      ((n.message = r && "string" == typeof r ? r : t.message),
        (n.data = { originalError: u(e) }));
    }
    let o = null == e ? void 0 : e.stack;
    return (r && e && o && "string" == typeof o && (n.stack = o), n);
  };
};
