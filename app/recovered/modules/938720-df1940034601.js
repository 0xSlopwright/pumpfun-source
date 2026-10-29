// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  let {
      ArrayIsArray: n,
      ArrayPrototypeIncludes: i,
      ArrayPrototypeJoin: o,
      ArrayPrototypeMap: a,
      NumberIsInteger: s,
      NumberIsNaN: l,
      NumberMAX_SAFE_INTEGER: u,
      NumberMIN_SAFE_INTEGER: d,
      NumberParseInt: c,
      ObjectPrototypeHasOwnProperty: f,
      RegExpPrototypeExec: h,
      String: p,
      StringPrototypeToUpperCase: g,
      StringPrototypeTrim: b,
    } = e.r(763323),
    {
      hideStackFrames: m,
      codes: {
        ERR_SOCKET_BAD_PORT: y,
        ERR_INVALID_ARG_TYPE: w,
        ERR_INVALID_ARG_VALUE: v,
        ERR_OUT_OF_RANGE: _,
        ERR_UNKNOWN_SIGNAL: S,
      },
    } = e.r(561079),
    { normalizeEncoding: E } = e.r(984651),
    { isAsyncFunction: A, isArrayBufferView: x } = e.r(984651).types,
    M = {},
    k = /^[0-7]+$/,
    P = m((e, t, r = d, n = u) => {
      if ("number" != typeof e) throw new w(t, "number", e);
      if (!s(e)) throw new _(t, "an integer", e);
      if (e < r || e > n) throw new _(t, `>= ${r} && <= ${n}`, e);
    }),
    O = m((e, t, r = -0x80000000, n = 0x7fffffff) => {
      if ("number" != typeof e) throw new w(t, "number", e);
      if (!s(e)) throw new _(t, "an integer", e);
      if (e < r || e > n) throw new _(t, `>= ${r} && <= ${n}`, e);
    }),
    B = m((e, t, r = !1) => {
      if ("number" != typeof e) throw new w(t, "number", e);
      if (!s(e)) throw new _(t, "an integer", e);
      let n = +!!r;
      if (e < n || e > 0xffffffff)
        throw new _(t, `>= ${n} && <= 4294967295`, e);
    });
  function I(e, t) {
    if ("string" != typeof e) throw new w(t, "string", e);
  }
  let R = m((e, t, r) => {
    if (!i(r, e))
      throw new v(
        t,
        e,
        "must be one of: " +
          o(
            a(r, (e) => ("string" == typeof e ? `'${e}'` : p(e))),
            ", ",
          ),
      );
  });
  function T(e, t) {
    if ("boolean" != typeof e) throw new w(t, "boolean", e);
  }
  function C(e, t, r) {
    return null != e && f(e, t) ? e[t] : r;
  }
  let j = m((e, t, r = null) => {
      let i = C(r, "allowArray", !1),
        o = C(r, "allowFunction", !1);
      if (
        (!C(r, "nullable", !1) && null === e) ||
        (!i && n(e)) ||
        ("object" != typeof e && (!o || "function" != typeof e))
      )
        throw new w(t, "Object", e);
    }),
    N = m((e, t) => {
      if (null != e && "object" != typeof e && "function" != typeof e)
        throw new w(t, "a dictionary", e);
    }),
    L = m((e, t, r = 0) => {
      if (!n(e)) throw new w(t, "Array", e);
      if (e.length < r) throw new v(t, e, `must be longer than ${r}`);
    }),
    F = m((e, t = "buffer") => {
      if (!x(e)) throw new w(t, ["Buffer", "TypedArray", "DataView"], e);
    }),
    q = m((e, t) => {
      if (
        void 0 !== e &&
        (null === e || "object" != typeof e || !("aborted" in e))
      )
        throw new w(t, "AbortSignal", e);
    }),
    D = m((e, t) => {
      if ("function" != typeof e) throw new w(t, "Function", e);
    }),
    U = m((e, t) => {
      if ("function" != typeof e || A(e)) throw new w(t, "Function", e);
    }),
    W = m((e, t) => {
      if (void 0 !== e) throw new w(t, "undefined", e);
    }),
    $ = /^(?:<[^>]*>)(?:\s*;\s*[^;"\s]+(?:=(")?[^;"\s]*\1)?)*$/;
  function z(e, t) {
    if (void 0 === e || !h($, e))
      throw new v(
        t,
        e,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"',
      );
  }
  t.exports = {
    isInt32: function (e) {
      return e === (0 | e);
    },
    isUint32: function (e) {
      return e === e >>> 0;
    },
    parseFileMode: function (e, t, r) {
      if ((void 0 === e && (e = r), "string" == typeof e)) {
        if (null === h(k, e))
          throw new v(
            t,
            e,
            "must be a 32-bit unsigned integer or an octal string",
          );
        e = c(e, 8);
      }
      return (B(e, t), e);
    },
    validateArray: L,
    validateStringArray: function (e, t) {
      L(e, t);
      for (let r = 0; r < e.length; r++) I(e[r], `${t}[${r}]`);
    },
    validateBooleanArray: function (e, t) {
      L(e, t);
      for (let r = 0; r < e.length; r++) T(e[r], `${t}[${r}]`);
    },
    validateAbortSignalArray: function (e, t) {
      L(e, t);
      for (let r = 0; r < e.length; r++) {
        let n = e[r],
          i = `${t}[${r}]`;
        if (null == n) throw new w(i, "AbortSignal", n);
        q(n, i);
      }
    },
    validateBoolean: T,
    validateBuffer: F,
    validateDictionary: N,
    validateEncoding: function (e, t) {
      let r = E(t),
        n = e.length;
      if ("hex" === r && n % 2 != 0)
        throw new v("encoding", t, `is invalid for data of length ${n}`);
    },
    validateFunction: D,
    validateInt32: O,
    validateInteger: P,
    validateNumber: function (e, t, r, n) {
      if ("number" != typeof e) throw new w(t, "number", e);
      if (
        (null != r && e < r) ||
        (null != n && e > n) ||
        ((null != r || null != n) && l(e))
      )
        throw new _(
          t,
          `${null != r ? `>= ${r}` : ""}${null != r && null != n ? " && " : ""}${null != n ? `<= ${n}` : ""}`,
          e,
        );
    },
    validateObject: j,
    validateOneOf: R,
    validatePlainFunction: U,
    validatePort: function (e, t = "Port", r = !0) {
      if (
        ("number" != typeof e && "string" != typeof e) ||
        ("string" == typeof e && 0 === b(e).length) ||
        +e != e >>> 0 ||
        e > 65535 ||
        (0 === e && !r)
      )
        throw new y(t, e, r);
      return 0 | e;
    },
    validateSignalName: function (e, t = "signal") {
      if ((I(e, t), void 0 === M[e])) {
        if (void 0 !== M[g(e)])
          throw new S(e + " (signals must use all capital letters)");
        throw new S(e);
      }
    },
    validateString: I,
    validateUint32: B,
    validateUndefined: W,
    validateUnion: function (e, t, r) {
      if (!i(r, e)) throw new w(t, `('${o(r, "|")}')`, e);
    },
    validateAbortSignal: q,
    validateLinkHeaderValue: function (e) {
      if ("string" == typeof e) return (z(e, "hints"), e);
      if (n(e)) {
        let t = e.length,
          r = "";
        if (0 === t) return r;
        for (let n = 0; n < t; n++) {
          let i = e[n];
          (z(i, "hints"), (r += i), n !== t - 1 && (r += ", "));
        }
        return r;
      }
      throw new v(
        "hints",
        e,
        'must be an array or string of format "</styles.css>; rel=preload; as=style"',
      );
    },
  };
};
