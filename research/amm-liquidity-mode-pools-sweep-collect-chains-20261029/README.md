# liquidity on cashback and mayhem pools chained into sweep -> collect

## Problem

2nd #44 pinned the trade-path mode gates: v2 trades reject
cashback pools with 6079 CashbackCoinNotSupported, legacy sell
accepts cashback pools but rejects mayhem pools with 6013
InvalidProtocolFeeRecipient, and mayhem v2 trades force the
buyback leg to 0. 3rd #18 chained liquidity-first sweep/collect
on a plain pool. Nobody chained LIQUIDITY on a mode-flagged
pool into the fee pipes. If deposit and withdraw take no mode
check, then on a cashback pool a deposit should still move
exactly the seed buckets into sweep/collect even though the
very next v2 trade fails 6079, and on a mayhem pool a deposit
should still sweep/collect the seed even though the protocol
sweep itself fails 6013. This packet measures that order
directly -- liquidity first, then sweep -> collect, then (for
cashback legacy trades) claim -- in single VMs, one signed
transaction per step, on three program images (original, #424
control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. Mode flags are patched on the pool account
only: is_mayhem_mode byte 243, is_cashback_coin byte 244.
Cashback cases pre-create the user volume accumulator (137 bytes,
lamports 10^9, all fields zero) and its ATA (2,039,280 lamports,
0 tokens); the protocol and creator recipient ATAs and the
collect destination DEST are pre-created with 0 tokens, so every
sweep and collect costs only the 5,000 fee. A v2 trade step funds
the user volume accumulator on the first trade of a VM
(1,844,400 lamports, 137 bytes); later steps reuse it and cost
5,000 only. Legacy buy uses the `buy` instruction with arguments
(amount, limit) plus a track byte 0; legacy sell uses `sell`
with (amount, minquote); the cashback remaining layout is
[accumulator ATA, accumulator PDA, pool-v2 PDA, buyback owner,
buyback dest] for both.

Event layouts (offsets as read from the receipts; verify.py
decodes only the fields its expectations name):
- DepositEvent / WithdrawEvent, 264 bytes, disc `78f83d531f8e6b90` /
  `1609851aa02c47c0`: base leg @72, quote leg @80.
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`: curve @64,
  lp_bps @72, lp_fee @80, proto_bps @88, proto_fee @96, quote
  @104, user_quote_in @112.
- SellEvent (v2), 449 bytes, disc `3e2f370aa503dc2a`: same
  slots, quote @104, user_out @112.
- BuyEvent (legacy cashback buy, 497 bytes, disc
  `67f4521f2cf57777`): out @16, max @24, curve @64, lp_bps @72,
  lp_fee @80, proto_bps @88, proto_fee @96, quote @104,
  user_quote_in @112, creator_bps @344, creator_fee @352 (0 on
  cashback pools), track @360, cashback_bps @408,
  cashback @416, buyback_bps @424, buyback_fee @432.
- SellEvent (legacy cashback sell, 449 bytes, disc
  `3e2f370aa503dc2a`): curve @64, lp_fee @80, protocol_fee
  @96 (gross 1,698), quote @104, user_out @112, creator_bps
  @344, creator_fee @352 (0), cashback_bps @360, cashback
  @368, buyback_fee @384.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.
- ClaimCashbackEvent, 72 bytes, disc `e2d6f62107f293e5`:
  user @8..40, amount @40..48, timestamp @48..56,
  total_claimed @56..64, total_cashback_earned @64..72.

Pool states below are (virtual_quote_reserves, protocol_fees,
creator_fees); lp_supply is 4,194,352,106,721 unless noted.

## Cases (21 cases, 81 steps per image, 243 receipts)

Family A -- cashback liquidity anchors (volume pre-created,
accumulator fields 0/0 throughout unless a legacy trade runs):
- `a-dep-swc-col`: dep-1e9 (-160,619,895,224 base /
  -29,312,410 quote, LP +10^9), sweep creator 123,394 (pool
  (-2,488, 2,488, 0)), collect drains exactly 123,394 to DEST.
- `a-wd-swc-col`: wd-1e9 (+160,619,895,223 / +29,312,409,
  LP -10^9), sweep 123,394, collect 123,394.
- `a-dep-wd-swc-col`: dep-1e9, wd-1e9 (round trip nets -1
  base / -1 quote, pool back to (-125,882, 2,488, 123,394)),
  sweep 123,394, collect 123,394. The round trip leaves the
  seed intact.
- `a-dep-swp-colnoop`: dep-1e9, protocol sweep 2,488 (pool
  (-123,394, 0, 123,394)) -- the protocol sweep SUCCEEDS on a
  cashback pool -- then collect is a SILENT NO-OP (0 events,
  payer 5,000 only, DEST 0; verify.py checks every other
  watched account is unchanged). The swept 2,488 stays in the
  protocol ATA.
- `a-wd-swp-swc-col`: wd-1e9, protocol sweep 2,488, creator
  sweep 123,394 (pool (0, 0, 0)), collect 123,394. The two
  sweeps compose; collect moves only the creator leg (creator
  vault ATA -123,394, DEST +123,394).

Family B -- mayhem liquidity (volume absent; no trade runs):
- `b-dep-swc-col`: dep-1e9, sweep creator 123,394, collect
  123,394 -- the same legs and amounts as the cashback case
  `a-dep-swc-col`.
- `b-wd-swc-col`: wd-1e9, sweep 123,394, collect 123,394.
- `b-dep-swp-fail-swc-col`: dep-1e9, protocol sweep fails
  6013 InvalidProtocolFeeRecipient with full rollback
  (payer -5,000 only, pool unchanged), then creator sweep
  123,394, collect 123,394. The creator sweep and collect
  moved the same amounts as in `b-dep-swc-col`.
- `b-wd-swp-fail-colnoop`: wd-1e9, protocol sweep fails
  6013, collect is a silent no-op (creator vault ATA empty).

Family C -- cashback v2 gates after liquidity (volume
pre-created; the failed trades fund nothing):
- `c-dep-buy-fail-swc-col`: dep-1e9, buy_v2 10^10 fails
  6079 CashbackCoinNotSupported with full rollback, sweep
  123,394, collect 123,394.
- `c-wd-sell-fail-swc-col`: wd-1e9, sell_v2 10^10 fails
  6079, sweep 123,394, collect 123,394.
- `c-dep-exact-fail-swc-col`: dep-1e9, buy_exact_quote_in_v2
  10^7 fails 6079, sweep 123,394, collect 123,394. Each of
  the three v2 entry points measured here (buy and exact after
  a deposit, sell after a withdraw) failed 6079, the code 2nd
  #44 recorded for them without a preceding liquidity step.

Family D -- mayhem v2 trades into sweep/collect (volume
funded by the first trade, 1,844,400 lamports, 137 bytes):
- `d-buy-swc-col`: buy_v2 10^10 on a mayhem pool: spend
  1,847,796, vault takes the FULL spend (+1,847,796),
  buyback 0, pool (-148,330, 19,461, 128,869). Sweep creator
  128,869 (pool (-19,461, 19,461, 0)), collect 128,869.
- `d-dep-buy-swc-col`: dep-1e9, then the buy settles with
  the same token deltas, pool deltas and decoded event
  fields as the fresh mayhem buy in `d-buy-swc-col` (only LP
  supply differs), sweep 128,869, collect 128,869.
- `d-dep-sell-swc-col`: dep-1e9, sell_v2 10^10: receipt
  1,802,115 (the receipt the plain-pool sell 10^10 recorded
  in research/amm-trade-sweep-collect-loops-20261029; no
  fresh mayhem sell is run here), and the vault sends only
  the receipt (-1,802,115, no
  buyback leg), buyback 0, pool (-148,329, 19,460, 128,869).
  Sweep 128,869, collect 128,869.
- `d-dep-buy-buy-swc-col`: dep-1e9, buy, second buy (spend
  1,847,852, curve 1,825,037, pool (-170,779, 36,434,
  134,345)), sweep 134,345, collect 134,345. The second
  buy's creator accrual is 5,476 (134,345 - 128,869), the
  same figure research/amm-trade-sweep-collect-loops-20261029
  recorded for its plain-pool second buy; buyback is 0 here.

Family E -- cashback legacy trades after a deposit (volume
pre-created; pool fields never move under legacy trades):
- `e-dep-cbbuy-claim-swc-col`: dep-1e9, cashback buy 10^10
  (spend 1,847,796, vault +1,825,348, protocol ATA +8,487,
  buyback +8,486, uvata +5,475, earned 5,475, pool fields
  unchanged), claim pays 5,475 (claimed 5,475), sweep
  123,394, collect 123,394. Total: 5,475 + 123,394 =
  128,869, equal to what sweep/collect drained after the
  non-cashback (mayhem) buy in `d-buy-swc-col`.
- `e-cbbuy-dep-claim-swc-col`: cashback buy first, then
  dep-1e9 with MOVED legs (base 160,617,511,066 / quote
  29,312,845 -- the post-buy available legs, as in 3rd #18)
  but the same buckets, claim 5,475, sweep 123,394,
  collect 123,394. The deposit leg moves with the vault;
  the fee buckets do not.
- `e-dep-cbsell-claim-swc-col`: dep-1e9, cashback sell 10^9
  (receipt 180,212, vault -182,458, protocol ATA +849,
  buyback +849, uvata +548, earned 548, creator leg 0),
  claim pays 548, sweep 123,394, collect 123,394. Total:
  548 + 123,394 = 123,942, equal to the non-cashback sell
  total recorded in
  research/amm-cashback-legacy-sell-sweep-collect-claim-20261029
  (not re-run here).

Family F -- both flags, and mayhem legacy sell after a
deposit:
- `f-dep-buy-fail-swc-col`: both flags set, dep-1e9,
  buy_v2 fails 6079 (the cashback code, not 6013), sweep
  123,394, collect 123,394.
- `f-dep-msell-fail-swc-col`: mayhem pool, dep-1e9, legacy
  sell 10^9 fails 6013 with full rollback after a
  deposit, sweep 123,394, collect 123,394.

## Result

- In every case measured, dep-1e9 and wd-1e9 settled with
  the same legs on cashback and mayhem pools (dep-1e9 also on
  the both-flags pool; wd was not run there), left the pool
  fee buckets unchanged, and the following creator sweep
  moved the 123,394 seed, drained in full by collect. The
  dep->wd round trip measured left the seed intact.
- The protocol sweep was the mode-sensitive step measured: it
  succeeded on the cashback pool (2,488, then collect no-op)
  and failed 6013 on the mayhem pool with full rollback after
  a deposit or withdraw, matching what
  research/amm-cashback-legacy-sell-sweep-collect-claim-20261029
  recorded after trades; the creator sweep and collect after
  the failure moved the same amounts as without it.
- The v2 cashback gate held after liquidity in the three
  orders run (dep->buy, wd->sell, dep->exact): each failed
  6079 with full rollback and the seed sweep/collect
  unchanged. With both flags set, buy_v2 failed 6079.
- Mayhem v2 trades chained into the pipes with buyback 0:
  the buy's vault quote leg is the full spend and the sell's
  vault quote leg is exactly the receipt, while the pool
  accrued the full protocol fee (buy: pf 2,488 -> 19,461;
  sell: pf 2,488 -> 19,460) and a 5,475 creator fee per first
  trade (5,476 on the second buy). A deposit before the buy
  left the buy's token deltas, pool deltas and event fields
  equal to the fresh buy; no fresh mayhem sell was run for
  comparison.
- Cashback legacy trades next to a deposit: cbbuy before and
  after a deposit produced the same buy deltas and event
  fields; cbbuy->dep moved only the deposit legs (available
  reserves) and left the fee buckets unchanged; claim +
  sweep + collect summed to 128,869 for the buy (the mayhem
  v2 buy total measured here) and 123,942 for the sell (the
  non-cashback sell total from the earlier sell packet).

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts, error codes, and site lines are exact values
  for this fixture state, not claims about other pool states.
  Error site line numbers differ between the original and the
  rebuilt images (6079 at trade_v2.rs:103 on the original,
  :59 on the rebuilt images; 6013 at swap/mod.rs:164 on the
  original, :23 on the rebuilt images); verify.py checks each
  image's recorded site line against that image's own logs
  and never compares site lines across images (2nd #36
  lesson). The README cites error codes, which agree across
  images.
- The mode flags are patched post-hoc on the pool account (as
  in 2nd #44); this pins handler behavior on flagged pools,
  not a reachable mainnet state.
- Transfer-fee variants of mode-pool liquidity chains, and
  deposit/withdraw on cashback/mayhem pools under a transfer
  fee, were not chained here; the tf dimension for sweep
  chains was pinned in 3rd #5/#8/#9/#11/#15/#19 and the mode
  gates in 2nd #44.
- Multi-hop trades on mode pools were pinned in 2nd #44 and
  are not re-chained here.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-liquidity-mode-pools-sweep-collect-chains-20261029/verify.py

`verify.py` needs only `solders` plus files in the repository: this
packet, `evidence/original/pump_amm/deployed.so`, and the two
retained rebuilt images
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
(control, #424) and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(candidate, #427), whose decompressed sha256 values match the
`images` block of `runtime/report.json.gz`. It re-checks the
recorded receipts against the report's expected values; it does
not re-execute any transaction.

`producer.py` is the script that generated the receipts and is
kept as a provenance record. It is not runnable as committed: it
hard-codes a private workspace layout (`~/workspace/pumpfun-sparse`
for the harness scripts and `~/workspace/slop-verify` for the
control/candidate `.so` files) and chdirs there on start. Run in a
staged copy of that layout (solders 0.26.0), all of its per-image
assertions passed and it regenerated the same transactions, logs,
errors, events and snapshots, except that the absent user volume
accumulator in mayhem cases was recorded as a 0-lamport empty
account instead of `null` (a LiteSVM/solders version difference);
the gzip part files differ in bytes because gzip headers carry a
timestamp.
