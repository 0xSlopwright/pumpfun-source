# PumpSwap v2 fee-selection priority: which table wins, and which gate opens it

## Problem

`select_and_apply_v2` (programs/pump-amm/src/curve/fees.rs) picks one
fee table per trade from the pool's quote mint, the canonical flag,
and the fee config length. Run 1 measured each table in isolation
(#8 fee tiers, #9 quote routing and the stable 4073 gate, #10 exotic
flat fees and its 4097 gate) but never the priority between them:
does a set exotic table rescue a short stable config? Does the 4073
gate open anything besides the stable table? Is the exotic nonzero
test an AND or an OR over its three legs? Does NORMAL_QUOTE behave
like the native mint? This packet answers those questions at runtime.

## Cases

Thirteen fresh-VM triples (original / #424 control / #427 candidate),
39 signed executions: `buy_v2` with 10^10 base out (limit u64::MAX)
and `sell_v2` with 10^9 base in (limit 1) on the repository's own
trade-v2 differential harness
(`scripts/pump_amm_trade_v2_differential.py`), rekeyed with its
`rekey_pool` override to the STABLE quote
(EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v), an exotic quote
(0x5a x32), or NORMAL_QUOTE, with the exotic table patched at offset
2073 and the fee config truncated where noted. The clock is slot 100,
epoch 0. `producer.py` reproduces every receipt from the repository
files.

| Case | Quote | Exotic table | Config len | Result |
| --- | --- | --- | ---: | --- |
| buy-stable-exotic-4072 | STABLE | (30, 333, 0) | 4072 | 6082 FeeTiersEmpty |
| buy-stable-exotic-2512 | STABLE | (30, 333, 0) | 2512 | 6082 FeeTiersEmpty |
| buy-stable-exotic-4073 | STABLE | (30, 333, 0) | 4073 | spend 1,846,884 |
| buy-exotic-4073 | exotic | (30, 333, 0) | 4073 | spend 1,830,459 (flat) |
| buy-exotic-zero-4097 | exotic | (0, 0, 0) | 4097 | spend 1,830,459 (flat) |
| buy-exotic-creator-only-4097 | exotic | (0, 0, 333) | 4097 | spend 1,885,755 |
| buy-normal-exotic-4097 | NORMAL | (30, 333, 0) | 4097 | spend 1,847,796 (tier) |
| buy-native-exotic-4097 | native | (30, 333, 0) | 4097 | spend 1,847,796 (tier) |
| buy-stable-exotic-4097 | STABLE | (30, 333, 0) | 4097 | spend 1,846,884 (stable) |
| buy-exotic-exotic-4097 | exotic | (30, 333, 0) | 4097 | spend 1,891,230 (exotic) |
| sell-stable-exotic-4072 | STABLE | (30, 333, 0) | 4072 | 6082 FeeTiersEmpty |
| sell-exotic-exotic-4097 | exotic | (30, 333, 0) | 4097 | user +175,869 |
| sell-stable-exotic-4097 | STABLE | (30, 333, 0) | 4097 | user +180,304 |

All three images route identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the exotic
fees at offset 2073 and the truncated config length in the before
snapshot, the pool's quote mint for rekeyed pools, base gained
exactly 10^10 (buy) or spent exactly 10^9 (sell), the quote spend /
receipt against the expected route, the vault and buyback-recipient
deltas, and agreement of the amounts across images. Receipts are
stored as parts (`runtime/raw-transactions-part1/2/3/4.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads them
in order.

## Result

- **The stable branch never consults the exotic table**: a canonical
  STABLE pool with exotic (30, 333, 0) set fails 6082 FeeTiersEmpty
  at fee_config_len 4072 and at 2512, because the stable branch
  takes `tier([])` below 4073. The exotic table sitting at offset
  2073 does not rescue a short stable config. Error site: original
  fees.rs:160, control/candidate fees.rs:62.
- **The two gates are independent**: at exactly 4073 the stable pool
  pays its stable spend (buy 1,846,884, vault +1,846,428, buyback
  456; sell +180,304, vault -180,350, buyback 46) while the exotic
  pool at the same length still pays flat fees (buy 1,830,459,
  vault +1,830,003, buyback 456). 4073 opens the stable table only;
  4097 opens the exotic table only.
- **The exotic nonzero test is an OR over all three legs**:
  all-zero exotic at full length 4097 pays flat fees (buy 1,830,459),
  while creator-only (0, 0, 333) selects the table and charges the
  creator leg (buy 1,885,755, vault +1,885,755, buyback 0).
- **NORMAL_QUOTE routes exactly like the native mint**: with exotic
  set it pays the tier spend (buy 1,847,796, vault +1,839,310,
  buyback 8,486), never the exotic table. The native control with
  the same exotic table pays identically.
- **Control anchors from run 1 reproduced**: stable + exotic at 4097
  pays stable spend 1,846,884; exotic + exotic at 4097 pays
  1,891,230 (vault +1,860,844, buyback 30,386); sell exotic + exotic
  at 4097 pays +175,869 (vault -178,908, buyback 3,039). In every
  success, the quote spend equals the vault quote delta plus the
  buyback-recipient delta.
- **The 6082 gate is in the shared selector, not buy-specific**:
  sell_v2 on a stable pool with exotic set at 4072 fails 6082 too.
- Every success funds the user volume accumulator with exactly
  1,844,400 lamports (137 bytes, payer key at [8:40]), so the payer
  delta is -1,849,400 (rent + 5,000 fee). Every error rolls back
  everything except the payer's 5,000 fee.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The rekeyed quote mints reuse the fixture mint's data under a new
  address: the program routes on the address, so the path selection is
  genuine, but no live exotic/stable pool was used. No live transaction
  was submitted. All executions are offline LiteSVM replays with normally
  signed transactions.
- Fee-config truncation is a synthetic short account, not a state any
  on-chain config reaches; it pins the length gates, not a reachable
  misconfiguration.
