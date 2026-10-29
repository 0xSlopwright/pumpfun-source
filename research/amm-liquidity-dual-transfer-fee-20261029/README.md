# Liquidity with quote AND base transfer fees at once

## Problem

The single-leg packets fixed each leg alone: #33 pinned quote-fee
deposit (gross-up) and withdraw (net-down), #42 pinned base-fee
deposit (gross spend, net vault receipt) and withdraw (gross vault
send, net user receipt), and 2nd #7 did the dual-leg combination
only for trades. Liquidity with both legs fee-bearing at once was
never measured: does deposit compose the two directions, which
side does each slippage bound check, which leg's overflow wins at
100%, and does each leg's fee cap bind independently?

## Cases

23 fresh-VM triples (original / #424 control / #427 candidate),
69 signed executions on the repository's own liquidity harness
(`scripts/pump_amm_liquidity_differential.py`), amount 10^9 LP in
every case. The clock is slot 100, epoch 0. `producer.py`
reproduces every receipt from the repository files. The base
transfer-fee extension is synthesized after the fact, as in #42
(a base mint cannot carry one at creation); the quote leg uses
the same synthesis on the quote mint.

| Case | User base | User quote | LP | Vault base | Vault quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| dep-dual-nofee | -160,619,895,224 | -29,312,410 | +10^9 | +160,619,895,224 | +29,312,410 |
| dep-dual-tf100 | -160,619,895,224 | -29,608,495 | +10^9 | +159,013,696,271 | +29,312,410 |
| dep-dual-tf5000 | -160,619,895,224 | -58,624,820 | +10^9 | +80,309,947,612 | +29,312,410 |
| dep-dual-tf10000 | 6023 Overflow | | | | |
| dep-dual-q10000-b100 | 6023 Overflow | | | | |
| dep-dual-q100-b10000 | -160,619,895,224 | -29,608,495 | +10^9 | 0 | +29,312,410 |
| dep-dual-tf100-maxbase-net | 6004 ExceededSlippage | | | | |
| dep-dual-tf100-maxbase-grossminus1 | 6004 ExceededSlippage | | | | |
| dep-dual-tf100-maxbase-gross | -160,619,895,224 | -29,608,495 | +10^9 | +159,013,696,271 | +29,312,410 |
| dep-dual-tf100-maxquote-net | 6004 ExceededSlippage | | | | |
| dep-dual-tf100-bothcaps-net | 6004 ExceededSlippage (base first) | | | | |
| dep-dual-qcap100-btf100 | -160,619,895,224 | -29,312,510 | +10^9 | +159,013,696,271 | +29,312,410 |
| dep-dual-q100-bcap100 | -160,619,895,224 | -29,608,495 | +10^9 | +160,619,895,124 | +29,312,410 |
| wd-dual-nofee | +160,619,895,223 | +29,312,409 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100 | +159,013,696,270 | +29,019,284 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf5000 | +80,309,947,611 | +14,656,204 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf10000 | 0 | 0 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100-minbase-gross | +159,013,696,270 | +29,019,284 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100-minbase-grossplus1 | 6004 ExceededSlippage | | | | |
| wd-dual-tf100-minquote-net | +159,013,696,270 | +29,019,284 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-tf100-minquote-netplus1 | 6004 ExceededSlippage | | | | |
| wd-dual-qcap100-bcap100 | +160,619,895,123 | +29,312,309 | -10^9 | -160,619,895,223 | -29,312,409 |
| wd-dual-qcap100-btf100 | +159,013,696,270 | +29,312,309 | -10^9 | -160,619,895,223 | -29,312,409 |

All three images agree on every case. `verify.py` rechecks
every receipt independently: signature validity, the user and
vault token deltas against the expected values, the error code
and log fragment, the recorded error site, rollback on
failures, and agreement across images. Receipts are stored as
parts (`runtime/raw-transactions-part1/2/3/4/5/6/7.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads
them in order.

## Result

- **Deposit composes exactly.** Quote spend is grossed up by
  the AMM (tf100: 29,608,495; tf5000: 58,624,820) while the base
  leg is withheld opaquely by the Token-2022 program (vault
  receives 159,013,696,271 at tf100, 80,309,947,612 at tf5000,
  0 at tf10000). LP minted is 10^9 in every successful deposit.
- **Deposit slippage is gross-side on both legs.** A max_base
  of the net vault receipt fails 6004, gross-1 fails, gross
  passes; a max_quote of the net spend fails 6004. With both
  caps net, the base check fires first.
- **The quote gross-up dominates at 100%.** tf10000 on both
  legs fails 6023, and quote-only 100% fails 6023 too, while
  base-only 100% succeeds with vault base 0: the quote
  gross-up divides by (10000 - bps), the base leg never
  divides.
- **Withdraw composes exactly.** Vault sends gross on both
  legs; user receives net (tf100: base 159,013,696,270, quote
  29,019,284; tf5000: base 80,309,947,611, quote 14,656,204;
  tf10000: 0 and 0). LP burned is 10^9 in every withdraw.
- **Withdraw slippage is asymmetric.** The base minimum is
  checked against the gross vault send (net, net+1, and gross
  all pass; gross+1 fails 6004), while the quote minimum is
  checked against the net receipt (net passes, net+1 fails
  6004).
- **Each leg's fee cap binds independently.** Deposit quote
  cap 100 spends net+100 with vault quote unchanged; deposit
  base cap 100 leaves vault base at gross-100; withdraw with
  both caps 100 pays gross-100 on both legs.

Error sites (log paths as emitted by each image):

- dep-dual-tf10000: original Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:35. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- dep-dual-q10000-b100: original Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:35. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- dep-dual-tf100-maxbase-net: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:79. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- dep-dual-tf100-maxbase-grossminus1: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:79. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- dep-dual-tf100-maxquote-net: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:100. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:23. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:23. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- dep-dual-tf100-bothcaps-net: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:79. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- wd-dual-tf100-minbase-grossplus1: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:86. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:16. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:16. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- wd-dual-tf100-minquote-netplus1: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:107. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:24. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:24. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.

## Limits

- No source change, no build, no whole-program identity claim.
  All executions are offline LiteSVM replays with normally
  signed transactions on the as-is fixture pool.
- The base transfer-fee extension is synthesized after the
  fact, as in #42: a legacy creation path cannot put a
  transfer fee on a base mint, so the base leg pins handler
  transfer behavior, not a reachable mainnet state. The quote
  leg uses the same synthesis.
- Amounts, caps, and slippage sides are exact for this
  fixture's pool state and fee settings and are not claimed
  for other pool states.
