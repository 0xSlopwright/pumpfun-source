// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(690877),
    a = e.i(352386),
    r = e.i(4911),
    n = e.i(639374);
  let i = /^(\d+)?(?:\.(\d*))?$/,
    l = ({ amount: e, decimals: t }) => {
      let a = e.trim().match(i);
      if (!a || (void 0 === a[1] && !a[2])) return null;
      let r = a[1] ?? "0",
        n = (a[2] ?? "").replace(/0+$/, "");
      return n.length > t ? null : BigInt(r + n.padEnd(t, "0"));
    };
  e.s(
    [
      "f",
      0,
      9,
      "$",
      0,
      ({ value: e, decimals: t }) => {
        if (!Number.isFinite(e) || e <= 0) return "0";
        let a = e.toFixed(t);
        return a.includes(".") ? a.replace(/\.?0+$/, "") : a;
      },
      "s",
      0,
      ({
        amount: e,
        recipient: t,
        ownerAddress: a,
        asset: s,
        feeLamports: o,
      }) => {
        let d,
          c = ((e) => {
            let t = e.trim();
            if (!t) return null;
            if (!/^\d*\.?\d*$/.test(t)) return 0 / 0;
            let a = Number.parseFloat(t);
            return Number.isFinite(a) ? a : 0 / 0;
          })(e);
        if (null === c) return "enter_amount";
        if (Number.isNaN(c) || c <= 0) return "invalid_amount";
        let u = "sol" === s.kind ? 9 : s.decimals;
        if (
          null !== u &&
          (((d = e.trim().match(i)) && (void 0 !== d[1] || d[2])
            ? (d[2] ?? "").replace(/0+$/, "").length
            : null) ?? 0) > u
        )
          return "too_many_decimals";
        let f = t.trim();
        if (!f) return "enter_address";
        if ("evm" === s.kind)
          return (({ amount: e, recipient: t, asset: a }) => {
            if (!(0, r.f)(t))
              return (0, n.f)(t) ? "solana_address" : "invalid_evm_address";
            if (null === a.ownerEvmAddress) return "evm_wallet_not_ready";
            if (t.toLowerCase() === a.ownerEvmAddress.toLowerCase())
              return "own_address";
            if (null === a.balanceRaw) return "balance_loading";
            let i = l({ amount: e, decimals: a.decimals });
            if (null === i || i <= BigInt(0)) return "invalid_amount";
            if (i > a.balanceRaw) return "insufficient_balance";
            switch (a.fee.status) {
              case "idle":
              case "loading":
                return "fee_estimating";
              case "failed":
                return "transfer_estimation_reverted" === a.fee.reason
                  ? "transfer_rejected_by_token"
                  : "fee_estimate_failed";
              case "ready":
                return a.fee.shortfallWei > BigInt(0)
                  ? "insufficient_gas"
                  : null;
            }
          })({ amount: e, recipient: f, asset: s });
        if (/^0x[0-9a-f]*$/i.test(f.trim()) && f.trim().length > 2)
          return "evm_address";
        if (!(0, n.f)(f)) return "invalid_address";
        if (a && f === a) return "own_address";
        if ("sol" === s.kind) {
          if (null === s.lamports) return "balance_loading";
          let e = Math.floor(1e9 * c);
          if (e > s.lamports) return "insufficient_balance";
          if (e + o > s.lamports) return "insufficient_sol_for_fee";
        } else {
          if (c > s.balance) return "insufficient_balance";
          if (null !== s.solLamports && s.solLamports < o)
            return "insufficient_sol_for_fee";
        }
        return null;
      },
      "Z",
      0,
      l,
    ],
    847756,
  );
  var s = e.i(85324),
    o = e.i(613677),
    d = e.i(342463),
    c = e.i(637782),
    u = e.i(342652),
    f = e.i(27820);
  let m = o.z.object({
      required_wei: d.z.string(),
      balance_wei: d.z.string(),
      shortfall_wei: d.z.string(),
    }),
    h = o.z.object({
      transaction: o.z.object({
        chain_id: c.z.number(),
        to: d.z.string(),
        value: d.z.string(),
        data: d.z.string(),
        nonce: c.z.number(),
        gas: c.z.number(),
        max_fee_per_gas: d.z.string(),
        max_priority_fee_per_gas: d.z.string(),
      }),
      gas: m,
    }),
    p = o.z.object({ tx_hash: d.z.string() }),
    g = o.z.object({ error: d.z.string().optional(), gas: m.optional() });
  class w extends Error {
    status;
    reason;
    requiredWei;
    balanceWei;
    shortfallWei;
    constructor(e) {
      (super(e.message ?? e.reason ?? "EVM transfer failed"),
        (this.name = "EvmTransferError"),
        (this.status = e.status),
        (this.reason = e.reason),
        e.gas &&
          ((this.requiredWei = b(e.gas.required_wei)),
          (this.balanceWei = b(e.gas.balance_wei)),
          (this.shortfallWei = b(e.gas.shortfall_wei))));
    }
    get isInsufficientGas() {
      return "insufficient_gas" === this.reason;
    }
    get isRejectedByToken() {
      return "transfer_estimation_reverted" === this.reason;
    }
    get isUnauthenticated() {
      return 401 === this.status;
    }
  }
  let b = (e) => {
      try {
        return BigInt(e);
      } catch {
        return;
      }
    },
    y = (e, t, a) => {
      let r = g.safeParse(t),
        n = r.success ? r.data : void 0;
      return new w({
        status: e,
        reason: n?.error,
        message: n?.error ?? `${a} (${e})`,
        gas: n?.gas,
      });
    },
    v = async (e) => {
      let t;
      try {
        t = await (0, u.b)("evm/build-transfer", {
          chain_id: e.chainId,
          evm_wallet: e.evmWallet,
          to: e.to,
          token: e.token ?? null,
          amount: e.amount,
        });
      } catch (e) {
        throw new w({
          reason: "network",
          message:
            e instanceof Error
              ? e.message
              : "Network error building the transfer",
        });
      }
      if (t.status < 200 || t.status >= 300)
        throw y(t.status, t.body, "EVM transfer build failed");
      let a = h.safeParse(t.body);
      if (!a.success)
        throw new w({
          reason: "unexpected_response",
          message: "Failed to build EVM transfer: unexpected response shape",
        });
      try {
        let e = a.data.transaction;
        return {
          transaction: {
            chainId: e.chain_id,
            to: e.to,
            value: BigInt(e.value),
            data: e.data,
            nonce: e.nonce,
            gas: BigInt(e.gas),
            maxFeePerGas: BigInt(e.max_fee_per_gas),
            maxPriorityFeePerGas: BigInt(e.max_priority_fee_per_gas),
          },
          requiredWei: BigInt(a.data.gas.required_wei),
          balanceWei: BigInt(a.data.gas.balance_wei),
          shortfallWei: BigInt(a.data.gas.shortfall_wei),
        };
      } catch {
        throw new w({
          reason: "unexpected_response",
          message: "Failed to build EVM transfer: unparseable numeric field",
        });
      }
    },
    x = async (e) => {
      let t;
      try {
        t = await (0, u.b)(
          "evm/send-raw-transaction",
          { chain_id: e.chainId, signed_transaction: e.signedTransaction },
          { retryLimit: 0 },
        );
      } catch (e) {
        throw new w({
          reason: "network",
          message:
            e instanceof Error
              ? e.message
              : "Network error broadcasting the transfer",
        });
      }
      if (t.status < 200 || t.status >= 300)
        throw y(t.status, t.body, "EVM transfer broadcast failed");
      let a = p.safeParse(t.body);
      if (!a.success || !/^0x[0-9a-fA-F]{64}$/.test(a.data.tx_hash))
        throw new w({
          reason: "unexpected_response",
          message: "Failed to send EVM transfer: unexpected response shape",
        });
      return a.data.tx_hash;
    },
    _ = 9e4,
    S = 1500,
    j = async ({
      chainId: e,
      txHash: t,
      timeoutMs: a = _,
      pollMs: r = S,
      sleep: n = N,
      now: i = Date.now,
    }) => {
      let l = (0, f.getEvmPublicClient)(e),
        s = i() + a;
      for (;;) {
        try {
          let e = await l.getTransactionReceipt({ hash: t });
          return "success" === e.status
            ? { status: "success", receipt: e }
            : { status: "reverted", receipt: e };
        } catch {}
        if (i() >= s) return { status: "indeterminate" };
        await n(r);
      }
    },
    N = (e) => new Promise((t) => setTimeout(t, e));
  e.s(["f", 0, w, "$", 0, v, "V", 0, x, "_", 0, j], 124645);
  let k = BigInt(0),
    E = "evmWithdrawTransferPreview",
    I = (e) => [
      E,
      e?.chainId ?? null,
      e?.evmWallet?.toLowerCase() ?? null,
      e?.to?.toLowerCase() ?? null,
      e?.token?.toLowerCase() ?? null,
      e?.amount ?? null,
    ],
    C = ({ holding: e, evmWalletAddress: t, recipient: a, amount: n }) => {
      if (!e || !t) return null;
      let i = a.trim();
      if (!(0, r.f)(i) || i.toLowerCase() === t.toLowerCase()) return null;
      let s = l({ amount: n, decimals: e.decimals });
      return null === s || s <= k || (null !== e.balanceRaw && s > e.balanceRaw)
        ? null
        : {
            chainId: e.chainId,
            evmWallet: t,
            to: i,
            token: e.contract ?? void 0,
            amount: s.toString(),
          };
    },
    T = (e, t) => {
      let [r, n] = (0, a.useState)(e);
      return (
        (0, a.useEffect)(() => {
          let a = setTimeout(() => n(e), t);
          return () => clearTimeout(a);
        }, [e, t]),
        r
      );
    };
  e.s(
    [
      "y",
      0,
      E,
      "r",
      0,
      function ({
        holding: e,
        evmWalletAddress: a,
        recipient: r,
        amount: n,
        pollMs: i,
      }) {
        let l,
          o,
          d = T(n, 400),
          c = C({
            holding: e,
            evmWalletAddress: a,
            recipient: T(r, 400),
            amount: d,
          }),
          u = C({ holding: e, evmWalletAddress: a, recipient: r, amount: n }),
          f = (0, s.q)(i),
          m = (0, t.useQuery)({
            queryKey: I(c),
            enabled: null !== c,
            staleTime: 15e3,
            retry: !1,
            refetchInterval: f,
            queryFn: async () => {
              if (!c) throw Error("missing transfer request");
              let e = c.token ? k : BigInt(c.amount),
                t = (t) => (t > e ? t - e : k);
              try {
                let e = await v(c);
                return { feeWei: t(e.requiredWei), shortfallWei: k };
              } catch (e) {
                if (e instanceof w && e.isInsufficientGas)
                  return {
                    feeWei: t(e.requiredWei ?? k),
                    shortfallWei: e.shortfallWei ?? k,
                  };
                throw e;
              }
            },
          }),
          h = () => {
            m.refetch();
          };
        if (null === u) return { status: "idle", refetch: h };
        let p = m.isRefetching && !m.isError && (m.data?.shortfallWei ?? k) > k;
        return ((l = I(u)),
        (o = I(c)),
        !l.every((e, t) => e === o[t]) || m.isPending || (m.isFetching && !p))
          ? { status: "loading", refetch: h }
          : m.isError
            ? {
                status: "failed",
                reason: m.error instanceof w ? m.error.reason : void 0,
                refetch: h,
              }
            : m.data
              ? {
                  status: "ready",
                  feeWei: m.data.feeWei,
                  shortfallWei: m.data.shortfallWei,
                  refetch: h,
                }
              : { status: "loading", refetch: h };
      },
    ],
    159060,
  );
  var R = e.i(445242),
    P = e.i(38279),
    M = e.i(541710),
    $ = e.i(130732);
  let z = (e) => ["evmWithdrawChainState", e],
    W = (e) => ["evmWithdrawNativeBalances", e],
    A = [],
    L = new Map(),
    D = async (e, t, a) => {
      let r = await fetch(
        `${P.C.PROFILE}/balance/tokens/${e}?page=1&size=200&chain=all`,
        { signal: a },
      );
      if (404 === r.status) return A;
      if (!r.ok) throw Error(`Failed to fetch EVM holdings: ${r.status}`);
      let n = await r.json();
      return (0, $.I)(n.data?.tokens ?? [], t);
    },
    B = async (e, t) =>
      new Map(
        await Promise.all(
          (0, $.N)(t).map(async (t) => {
            let a = t.evmChainId ?? 0;
            try {
              let t = await (0, f.getEvmPublicClient)(a).getBalance({
                address: e,
              });
              return [a, t];
            } catch {
              return [a, null];
            }
          }),
        ),
      );
  e.s(
    [
      "u",
      0,
      z,
      "n",
      0,
      W,
      "W",
      0,
      function (e) {
        let a,
          r,
          n,
          i,
          l,
          o,
          d,
          c,
          u,
          f = (0, R.c)(32),
          {
            solanaAddress: m,
            evmWalletAddress: h,
            enabled: p,
            nativePollMs: g,
          } = e,
          w = (0, M.l)();
        f[0] !== w || f[1] !== m
          ? ((a = [...z(m), w]), (f[0] = w), (f[1] = m), (f[2] = a))
          : (a = f[2]);
        let b = p && !!m;
        (f[3] !== w || f[4] !== m
          ? ((r = (e) => {
              let { signal: t } = e;
              return D(m ?? "", w, t);
            }),
            (f[3] = w),
            (f[4] = m),
            (f[5] = r))
          : (r = f[5]),
          f[6] !== a || f[7] !== b || f[8] !== r
            ? ((n = {
                queryKey: a,
                enabled: b,
                staleTime: 3e4,
                retry: 1,
                queryFn: r,
              }),
              (f[6] = a),
              (f[7] = b),
              (f[8] = r),
              (f[9] = n))
            : (n = f[9]));
        let y = (0, t.useQuery)(n),
          v = (0, s.q)(g, p);
        f[10] !== h || f[11] !== w
          ? ((i = [...W(h), w]), (f[10] = h), (f[11] = w), (f[12] = i))
          : (i = f[12]);
        let x = p && !!h;
        (f[13] !== h || f[14] !== w
          ? ((l = () => B(h ?? "0x", w)), (f[13] = h), (f[14] = w), (f[15] = l))
          : (l = f[15]),
          f[16] !== v || f[17] !== i || f[18] !== x || f[19] !== l
            ? ((o = {
                queryKey: i,
                enabled: x,
                staleTime: 15e3,
                retry: !1,
                refetchInterval: v,
                queryFn: l,
              }),
              (f[16] = v),
              (f[17] = i),
              (f[18] = x),
              (f[19] = l),
              (f[20] = o))
            : (o = f[20]));
        let _ = (0, t.useQuery)(o),
          S = y.data ?? A,
          j = _.data ?? L;
        f[21] !== w || f[22] !== j || f[23] !== S
          ? ((d = (0, $.A)({
              chainStateHoldings: S,
              nativeBalances: j,
              exposure: w,
            })),
            (f[21] = w),
            (f[22] = j),
            (f[23] = S),
            (f[24] = d))
          : (d = f[24]);
        let N = d,
          k =
            (y.isLoading && "idle" !== y.fetchStatus) ||
            (_.isLoading && "idle" !== _.fetchStatus);
        return (
          f[25] !== y || f[26] !== _
            ? ((c = () => {
                (y.refetch(), _.refetch());
              }),
              (f[25] = y),
              (f[26] = _),
              (f[27] = c))
            : (c = f[27]),
          f[28] !== N || f[29] !== k || f[30] !== c
            ? ((u = { holdings: N, isLoading: k, refetch: c }),
              (f[28] = N),
              (f[29] = k),
              (f[30] = c),
              (f[31] = u))
            : (u = f[31]),
          u
        );
      },
    ],
    362895,
  );
  var F = e.i(107956);
  let O = () => null,
    U = () => () => {},
    q = () => null;
  e.s(
    [
      "f",
      0,
      function () {
        let e,
          t,
          n = (0, R.c)(8),
          { evmWalletAddress: i, isReady: l, mappedEvmAddress: s } = (0, F.f)(),
          o = (0, a.useSyncExternalStore)(U, O, q);
        if (o) {
          let e;
          return (
            n[0] !== o
              ? ((e = {
                  evmWalletAddress: o,
                  isReady: !0,
                  mappedEvmAddress: null,
                  isPreview: !0,
                }),
                (n[0] = o),
                (n[1] = e))
              : (e = n[1]),
            e
          );
        }
        return (
          n[2] !== i
            ? ((e = i && (0, r.f)(i) ? i : null), (n[2] = i), (n[3] = e))
            : (e = n[3]),
          n[4] !== l || n[5] !== s || n[6] !== e
            ? ((t = {
                evmWalletAddress: e,
                isReady: l,
                mappedEvmAddress: s,
                isPreview: !1,
              }),
              (n[4] = l),
              (n[5] = s),
              (n[6] = e),
              (n[7] = t))
            : (t = n[7]),
          t
        );
      },
    ],
    61687,
  );
};
