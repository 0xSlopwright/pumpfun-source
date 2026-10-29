// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(520417),
    r = e.i(703114);
  let i = {
      0: "legacy",
      1: "eip2930",
      2: "eip1559",
      3: "eip4844",
      4: "eip7702",
    },
    a = (e) => (void 0 === e ? void 0 : BigInt(e)),
    n = "tempo",
    s = (e, t) => {
      if (void 0 === e) return;
      let r = Number(e);
      if (!Number.isSafeInteger(r) || r < 0)
        throw Error(`Invalid Tempo ${t}: ${String(e)}`);
      return r;
    };
  e.s([
    "s",
    0,
    { legacy: 0, eip2930: 1, eip1559: 2, eip4844: 3, eip7702: 4 },
    "C",
    0,
    118,
    "w",
    0,
    n,
    "c",
    0,
    function (e) {
      if (!e || "object" != typeof e) return !1;
      let t = e.type;
      if (118 !== t && ("string" != typeof t || "tempo" !== t.toLowerCase()))
        return !1;
      let r = e.calls;
      return Array.isArray(r) && r.length > 0;
    },
    "E",
    0,
    function (e, t) {
      let { chain: r, gas: i, ...a } = e;
      return { ...a, ...(void 0 !== i && void 0 === t ? { gasLimit: i } : {}) };
    },
    "y",
    0,
    function (e) {
      let t, r;
      if ("string" == typeof e)
        try {
          t = JSON.parse(e);
        } catch (t) {
          let e = t instanceof Error ? t.message : String(t);
          throw Error(`Invalid Tempo transaction JSON: ${e}`);
        }
      else t = e;
      if (
        (t.accessList && Array.isArray(t.accessList)
          ? (r = t.accessList.map((e) =>
              Array.isArray(e) ? { address: e[0], storageKeys: e[1] } : e,
            ))
          : t.accessList &&
            (r = Object.entries(t.accessList).map((e) => ({
              address: e[0],
              storageKeys: e[1],
            }))),
        void 0 === t.chainId || null === t.chainId)
      )
        throw Error("Tempo transactions require a chainId");
      let i = Number(t.chainId);
      if (!Number.isSafeInteger(i) || i <= 0)
        throw Error(`Invalid Tempo chainId: ${String(t.chainId)}`);
      let o = s(t.nonce, "nonce");
      if (!Array.isArray(t.calls) || 0 === t.calls.length)
        throw Error("Tempo transactions require at least one call");
      let d = t.calls.map((e) => ({
        to: e.to,
        data: e.data,
        value: a(e.value),
      }));
      return {
        type: n,
        chainId: i,
        from: t.from,
        nonce: o,
        gas: a(t.gasLimit),
        maxFeePerGas: a(t.maxFeePerGas),
        maxPriorityFeePerGas: a(t.maxPriorityFeePerGas),
        calls: d,
        feeToken: t.feeToken,
        nonceKey: a(t.nonceKey),
        validBefore: s(t.validBefore, "validBefore"),
        validAfter: s(t.validAfter, "validAfter"),
        feePayerSignature: t.feePayerSignature,
        accessList: r,
      };
    },
    "W",
    0,
    function (e) {
      let {
          type: n = 2,
          authorizationList: s,
          ...o
        } = "string" == typeof e ? JSON.parse(e) : e,
        d;
      o.accessList && Array.isArray(o.accessList)
        ? (d = o.accessList.map((e) =>
            Array.isArray(e) ? { address: e[0], storageKeys: e[1] } : e,
          ))
        : o.accessList &&
          (d = Object.entries(o.accessList).map((e) => ({
            address: e[0],
            storageKeys: e[1],
          })));
      let l = Number(o.chainId ?? 1),
        c = (0, t.f)(o.data)
          ? o.data
          : o.data
            ? (0, r.g)(Uint8Array.from(o.data))
            : void 0,
        u = o.nonce ? Number(o.nonce) : void 0,
        h = {
          chainId: l,
          data: c,
          nonce: u,
          value: a(o.value),
          gas: a(o.gas ?? o.gasLimit),
        },
        p = Number(n);
      if (0 === p)
        return {
          ...o,
          type: i[p],
          ...h,
          gasPrice: a(o.gasPrice),
          accessList: void 0,
          maxFeePerGas: void 0,
          maxPriorityFeePerGas: void 0,
        };
      if (1 === p)
        return {
          ...o,
          type: i[p],
          ...h,
          gasPrice: a(o.gasPrice),
          accessList: d,
          maxFeePerGas: void 0,
          maxPriorityFeePerGas: void 0,
        };
      if (2 === p)
        return {
          ...o,
          type: i[p],
          ...h,
          nonce: u,
          accessList: d,
          maxFeePerGas: a(o.maxFeePerGas),
          maxPriorityFeePerGas: a(o.maxPriorityFeePerGas),
          gasPrice: void 0,
          maxFeePerBlobGas: void 0,
        };
      if (4 === p) {
        let e = (s ?? []).map((e) => ({
          address: e.address,
          chainId: Number(e.chainId),
          nonce: Number(e.nonce),
          r: e.r,
          s: e.s,
          yParity: e.yParity ?? (void 0 === e.v ? 0 : Number(e.v) - 27),
        }));
        return {
          ...o,
          type: i[p],
          ...h,
          nonce: u,
          accessList: d,
          maxFeePerGas: a(o.maxFeePerGas),
          maxPriorityFeePerGas: a(o.maxPriorityFeePerGas),
          authorizationList: e,
          gasPrice: void 0,
          maxFeePerBlobGas: void 0,
        };
      }
      throw Error(`Unsupported transaction type: ${n}`);
    },
  ]);
};
