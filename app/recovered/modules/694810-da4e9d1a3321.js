// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(370917),
    i = e.i(382772);
  let f = {
    "0x0": "legacy",
    "0x1": "eip2930",
    "0x2": "eip1559",
    "0x3": "eip4844",
    "0x4": "eip7702",
  };
  function s(e, t) {
    let s = {
      ...e,
      blockHash: e.blockHash ? e.blockHash : null,
      blockNumber: e.blockNumber ? BigInt(e.blockNumber) : null,
      chainId: e.chainId ? (0, i.T)(e.chainId) : void 0,
      gas: e.gas ? BigInt(e.gas) : void 0,
      gasPrice: e.gasPrice ? BigInt(e.gasPrice) : void 0,
      maxFeePerBlobGas: e.maxFeePerBlobGas
        ? BigInt(e.maxFeePerBlobGas)
        : void 0,
      maxFeePerGas: e.maxFeePerGas ? BigInt(e.maxFeePerGas) : void 0,
      maxPriorityFeePerGas: e.maxPriorityFeePerGas
        ? BigInt(e.maxPriorityFeePerGas)
        : void 0,
      nonce: e.nonce ? (0, i.T)(e.nonce) : void 0,
      to: e.to ? e.to : null,
      transactionIndex: e.transactionIndex ? Number(e.transactionIndex) : null,
      type: e.type ? f[e.type] : void 0,
      typeHex: e.type ? e.type : void 0,
      value: e.value ? BigInt(e.value) : void 0,
      v: e.v ? BigInt(e.v) : void 0,
    };
    return (
      e.authorizationList &&
        (s.authorizationList = e.authorizationList.map((e) => ({
          address: e.address,
          chainId: Number(e.chainId),
          nonce: Number(e.nonce),
          r: e.r,
          s: e.s,
          yParity: Number(e.yParity),
        }))),
      (s.yParity = (() => {
        if (e.yParity) return Number(e.yParity);
        if ("bigint" == typeof s.v) {
          if (0n === s.v || 27n === s.v) return 0;
          if (1n === s.v || 28n === s.v) return 1;
          if (s.v >= 35n) return +(s.v % 2n === 0n);
        }
      })()),
      "legacy" === s.type &&
        (delete s.accessList,
        delete s.maxFeePerBlobGas,
        delete s.maxFeePerGas,
        delete s.maxPriorityFeePerGas,
        delete s.yParity),
      "eip2930" === s.type &&
        (delete s.maxFeePerBlobGas,
        delete s.maxFeePerGas,
        delete s.maxPriorityFeePerGas),
      "eip1559" === s.type && delete s.maxFeePerBlobGas,
      s
    );
  }
  let n = (0, t.f)("transaction", s);
  function o(e, t) {
    let i = (e.transactions ?? []).map((e) =>
      "string" == typeof e ? e : s(e),
    );
    return {
      ...e,
      baseFeePerGas: e.baseFeePerGas ? BigInt(e.baseFeePerGas) : null,
      blobGasUsed: e.blobGasUsed ? BigInt(e.blobGasUsed) : void 0,
      difficulty: e.difficulty ? BigInt(e.difficulty) : void 0,
      excessBlobGas: e.excessBlobGas ? BigInt(e.excessBlobGas) : void 0,
      gasLimit: e.gasLimit ? BigInt(e.gasLimit) : void 0,
      gasUsed: e.gasUsed ? BigInt(e.gasUsed) : void 0,
      hash: e.hash ? e.hash : null,
      logsBloom: e.logsBloom ? e.logsBloom : null,
      nonce: e.nonce ? e.nonce : null,
      number: e.number ? BigInt(e.number) : null,
      size: e.size ? BigInt(e.size) : void 0,
      timestamp: e.timestamp ? BigInt(e.timestamp) : void 0,
      transactions: i,
      totalDifficulty: e.totalDifficulty ? BigInt(e.totalDifficulty) : null,
    };
  }
  e.s(["K", 0, n, "F", 0, s, "g", 0, f], 787821);
  let r = (0, t.f)("block", o);
  function a(e, { args: t, eventName: i } = {}) {
    return {
      ...e,
      blockHash: e.blockHash ? e.blockHash : null,
      blockNumber: e.blockNumber ? BigInt(e.blockNumber) : null,
      blockTimestamp: e.blockTimestamp
        ? BigInt(e.blockTimestamp)
        : null === e.blockTimestamp
          ? null
          : void 0,
      logIndex: e.logIndex ? Number(e.logIndex) : null,
      transactionHash: e.transactionHash ? e.transactionHash : null,
      transactionIndex: e.transactionIndex ? Number(e.transactionIndex) : null,
      ...(i ? { args: t, eventName: i } : {}),
    };
  }
  (e.s(["B", 0, r, "K", 0, o], 694810), e.s(["f", 0, a], 564099));
  let c = { "0x0": "reverted", "0x1": "success" };
  function l(e, t) {
    let s = {
      ...e,
      blockNumber: e.blockNumber ? BigInt(e.blockNumber) : null,
      contractAddress: e.contractAddress ? e.contractAddress : null,
      cumulativeGasUsed: e.cumulativeGasUsed
        ? BigInt(e.cumulativeGasUsed)
        : null,
      effectiveGasPrice: e.effectiveGasPrice
        ? BigInt(e.effectiveGasPrice)
        : null,
      gasUsed: e.gasUsed ? BigInt(e.gasUsed) : null,
      logs: e.logs ? e.logs.map((e) => a(e)) : null,
      to: e.to ? e.to : null,
      transactionIndex: e.transactionIndex
        ? (0, i.T)(e.transactionIndex)
        : null,
      status: e.status ? c[e.status] : null,
      type: e.type ? f[e.type] || e.type : null,
    };
    return (
      e.blobGasPrice && (s.blobGasPrice = BigInt(e.blobGasPrice)),
      e.blobGasUsed && (s.blobGasUsed = BigInt(e.blobGasUsed)),
      s
    );
  }
  let u = (0, t.f)("transactionReceipt", l);
  e.s(["l", 0, u, "L", 0, l, "b", 0, c], 767924);
};
