// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(613677),
    n = e.i(637782),
    r = e.i(297865),
    a = e.i(342463),
    s = e.i(866890),
    i = e.i(418096),
    o = e.i(169119),
    l = e.i(727464),
    c = e.i(609926),
    u = e.i(313017),
    d = e.i(503630),
    f = e.i(992829),
    m = e.i(22675),
    p = e.i(371047),
    g = e.i(233404),
    h = e.i(25572);
  let b = ({ transactions: e, prep_transaction: t, transaction: n }) =>
      e?.length === 2
        ? { prep: e[0], main: e[1] }
        : e?.length === 1
          ? { prep: void 0, main: e[0] }
          : { prep: t, main: n },
    y = t.z.object({
      required_atomic: n.z.number().optional(),
      gas_reserve_atomic: n.z.number().optional(),
      account_rent_atomic: n.z.number().optional(),
      ata_creations: n.z.number().optional(),
      user_volume_accumulator_needed: r.z.boolean().optional(),
      input_balance_atomic: n.z.number().optional(),
    }),
    w = t.z.object({
      transaction: a.z.string(),
      prep_transaction: a.z.string().optional(),
      transactions: s.z
        .array(a.z.string())
        .nullish()
        .catch(void 0),
      venue: i.z.enum(["bonding_curve", "pump_swap", "jupiter"]),
      amount_out: t.z.object({ ui: n.z.number(), atomic: n.z.number() }),
      min_amount_out: t.z.object({ ui: n.z.number(), atomic: n.z.number() }),
      slippage_bps: n.z.number(),
      insufficient_funds: r.z.boolean(),
      price_impact: n.z.number().nullish(),
      network_fees: n.z.number().int().nonnegative().nullish(),
      network_fee_denomination: i.z.enum(["sol", "usdc"]).nullish(),
      clamped_amount_in: n.z.number().optional(),
      transfer_fee_bps: n.z.number().int().nonnegative().nullish(),
      route: a.z.string().nullish(),
      options_for_send: o.z.record(a.z.string(), l.z.unknown()).nullish(),
      partial_sign: r.z.boolean().default(!1),
      tip_lamports: n.z
        .number()
        .int()
        .nonnegative()
        .nullish()
        .catch(void 0),
      user_states: y.nullish().catch(void 0),
      referral_fee: t.z
        .object({ kind: i.z.enum(["protocol", "referrer"]) })
        .nullish()
        .catch(null),
    }),
    _ = (e) =>
      e
        ? {
            requiredAtomic: e.required_atomic,
            gasReserveAtomic: e.gas_reserve_atomic,
            accountRentAtomic: e.account_rent_atomic,
            ataCreations: e.ata_creations,
            userVolumeAccumulatorNeeded: e.user_volume_accumulator_needed,
            inputBalanceAtomic: e.input_balance_atomic,
          }
        : void 0,
    v = (e) => {
      let t;
      if (null === e) return null;
      let n = e.trim();
      if (!n) return null;
      try {
        t = JSON.parse(n);
      } catch {
        return n;
      }
      if (!t || "object" != typeof t) return n;
      let r = t;
      return "string" == typeof r.message
        ? r.message
        : Array.isArray(r.message)
          ? r.message.join(", ")
          : "string" == typeof r.error
            ? r.error
            : n;
    },
    k = { reasonCode: null, retryable: void 0 },
    x = (e) => {
      let t;
      if (null === e) return k;
      try {
        t = JSON.parse(e);
      } catch {
        return k;
      }
      if (!t || "object" != typeof t) return k;
      let n = t.data;
      if (!n || "object" != typeof n) return k;
      let { reason: r, retryable: a } = n;
      return {
        reasonCode: "string" == typeof r ? r : null,
        retryable: "boolean" == typeof a ? a : void 0,
      };
    },
    j = (e) => {
      let t = e.match(
        /^\S+ unexpected response: status \d+[^{]*(\{[\s\S]*\})\s*$/,
      );
      if (!t) return e;
      let n = v(t[1]);
      return n && n !== t[1] ? n : e;
    };
  async function $(e, t = {}) {
    let { signal: n, retries: r = 1 } = t,
      a = (0, d.t)().replace(/\/+$/, ""),
      s = `${a}/transactions/swap-build`,
      i = (0, h.n)(e.user),
      o = "network error";
    for (let t = 0; t <= r; t++) {
      let a, l, d, h;
      t > 0 && (await new Promise((e) => setTimeout(e, 600 * 2 ** (t - 1))));
      try {
        a = await fetch(s, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(0, p.c)(),
            ...(0, u.z)(),
          },
          body: JSON.stringify(
            (0, g.Y)({ ...e, ...i, has_support_for_sending_options: !0 }),
          ),
          signal: n ?? AbortSignal.timeout(6e4),
        });
      } catch (e) {
        if (n?.aborted) throw e;
        o = e instanceof Error ? e.message : "network error";
        continue;
      }
      if (!a.ok) {
        let e = await a.text().catch(() => null),
          n = v(e);
        if (n === c.R) return { kind: "insufficient_funds" };
        let { reasonCode: s, retryable: i } = x(e),
          l = (0, f.D)({ status: a.status, message: n, reasonCode: s }),
          u = n ? j(n) : `request failed (${a.status})`;
        if ("unauthenticated" === l)
          return { kind: "unauthenticated", message: u };
        if ((0, f.n)(l)) return { kind: "expected", reason: l, message: u };
        if (a.status >= 500 && !1 !== i && t < r) {
          o = u;
          continue;
        }
        return { kind: "error", message: u, status: a.status };
      }
      try {
        l = await a.json();
      } catch {
        return { kind: "error", message: "invalid JSON response" };
      }
      let y = w.safeParse(l);
      if (!y.success)
        return { kind: "error", message: "unexpected response shape" };
      if (y.data.insufficient_funds)
        return {
          kind: "insufficient_funds",
          userStates: _(y.data.user_states),
        };
      let k = b(y.data);
      try {
        ((d = (0, m.m)(k.main)), (h = k.prep ? (0, m.m)(k.prep) : void 0));
      } catch {
        return { kind: "error", message: "could not decode built transaction" };
      }
      let $ =
        null != y.data.network_fees && null != y.data.network_fee_denomination
          ? {
              atomicAmount: y.data.network_fees,
              denomination: y.data.network_fee_denomination,
            }
          : null;
      return {
        kind: "ok",
        data: {
          transaction: d,
          prepTransaction: h,
          venue: y.data.venue,
          amountOut: {
            ui: y.data.amount_out.ui,
            atomic: y.data.amount_out.atomic,
          },
          minAmountOut: {
            ui: y.data.min_amount_out.ui,
            atomic: y.data.min_amount_out.atomic,
          },
          slippageBps: y.data.slippage_bps,
          priceImpact: y.data.price_impact ?? null,
          networkFee: $,
          clampedAmountIn: y.data.clamped_amount_in,
          transferFeeBps: y.data.transfer_fee_bps ?? null,
          tipLamports: y.data.tip_lamports ?? null,
          userStates: _(y.data.user_states),
          route: y.data.route ?? void 0,
          optionsForSend: y.data.options_for_send ?? void 0,
          partialSign: y.data.partial_sign,
          referralFeeKind: y.data.referral_fee?.kind ?? null,
        },
      };
    }
    return { kind: "error", message: o };
  }
  e.s(
    [
      "y",
      0,
      $,
      "d",
      0,
      (e) => (e <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(e) : e.toString()),
    ],
    349417,
  );
  var S = e.i(445242),
    A = e.i(426091),
    I = e.i(78436),
    B = e.i(634103);
  let T = (0, I.$)()(
    (0, B.V)(
      (e, t) => ({
        wallets: [],
        recordFailure: (n) => {
          let r = n?.trim().toLowerCase();
          !r || t().wallets.includes(r) || e({ wallets: [...t().wallets, r] });
        },
      }),
      {
        name: "wallet-sponsored-signing",
        version: 1,
        migrate: () => ({ wallets: [] }),
        storage: (0, B.j)(() => localStorage),
        partialize: (e) => ({ wallets: e.wallets }),
      },
    ),
  );
  function z(e) {
    return e.wallets;
  }
  e.s(
    [
      "R",
      0,
      () => {
        T.getState().recordFailure((0, A.Y)());
      },
      "o",
      0,
      () => {
        let e,
          t = (0, S.c)(2),
          n = T(z);
        if (0 === n.length) return !1;
        if (t[0] !== n) {
          let r = (0, A.Y)()?.trim().toLowerCase();
          ((e = !!r && n.includes(r)), (t[0] = n), (t[1] = e));
        } else e = t[1];
        return e;
      },
    ],
    102250,
  );
};
