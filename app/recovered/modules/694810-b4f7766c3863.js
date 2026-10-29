// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(370917),
    r = e.i(382772);
  let o = {
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
      chainId: e.chainId ? (0, r.T)(e.chainId) : void 0,
      gas: e.gas ? BigInt(e.gas) : void 0,
      gasPrice: e.gasPrice ? BigInt(e.gasPrice) : void 0,
      maxFeePerBlobGas: e.maxFeePerBlobGas
        ? BigInt(e.maxFeePerBlobGas)
        : void 0,
      maxFeePerGas: e.maxFeePerGas ? BigInt(e.maxFeePerGas) : void 0,
      maxPriorityFeePerGas: e.maxPriorityFeePerGas
        ? BigInt(e.maxPriorityFeePerGas)
        : void 0,
      nonce: e.nonce ? (0, r.T)(e.nonce) : void 0,
      to: e.to ? e.to : null,
      transactionIndex: e.transactionIndex ? Number(e.transactionIndex) : null,
      type: e.type ? o[e.type] : void 0,
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
  function a(e, t) {
    let r = (e.transactions ?? []).map((e) =>
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
      transactions: r,
      totalDifficulty: e.totalDifficulty ? BigInt(e.totalDifficulty) : null,
    };
  }
  e.s(["K", 0, n, "F", 0, s, "g", 0, o], 787821);
  let i = (0, t.f)("block", a);
  function c(e, { args: t, eventName: r } = {}) {
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
      ...(r ? { args: t, eventName: r } : {}),
    };
  }
  (e.s(["B", 0, i, "K", 0, a], 694810), e.s(["f", 0, c], 564099));
  let l = { "0x0": "reverted", "0x1": "success" };
  function u(e, t) {
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
      logs: e.logs ? e.logs.map((e) => c(e)) : null,
      to: e.to ? e.to : null,
      transactionIndex: e.transactionIndex
        ? (0, r.T)(e.transactionIndex)
        : null,
      status: e.status ? l[e.status] : null,
      type: e.type ? o[e.type] || e.type : null,
    };
    return (
      e.blobGasPrice && (s.blobGasPrice = BigInt(e.blobGasPrice)),
      e.blobGasUsed && (s.blobGasUsed = BigInt(e.blobGasUsed)),
      s
    );
  }
  let d = (0, t.f)("transactionReceipt", u);
  e.s(["l", 0, d, "L", 0, u, "b", 0, l], 767924);
};
