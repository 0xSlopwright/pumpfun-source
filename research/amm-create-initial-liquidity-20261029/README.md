# create_pool initial liquidity: floor(sqrt) minting and the 100 lock

## Problem

`create_pool` validation was pinned before (same-mint, zero
amounts, vault ownership, duplicate creation), and the
trailing creator args and the mayhem/cashback create gates
were pinned separately -- but what liquidity a fresh pool
actually mints was never measured. The handler transfers
first, reloads the vaults, and only then computes liquidity,
so the minted amount depends on post-transfer vault balances,
not on the instruction args alone, and the minimum-liquidity
failure lands after the transfers have already executed.

## Cases

19 fresh-VM triples (original / #424 control / #427
candidate), 57 signed executions built by producer.py's run_case() on the Harness from scripts/pump_amm_admin_differential.py, with fixtures and constants imported from `scripts/pump_amm_create_differential.py`.
The clock is slot 100, epoch 0. `producer.py` reproduces
every receipt once ~/workspace/pumpfun-sparse is a repo checkout and ~/workspace/slop-verify holds control.so (7a300434..., research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz) and candidate.so (d17a657b..., research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz); the error string format depends on the solders version. Parts: 6 files
(10 receipts x 5, plus 7).

Family A -- sqrt floor and the 100 lock, fresh vaults:

| Case | (base_in, quote_in) | init_liq | lp_out |
| --- | --- | --- | --- |
| liq-100-100 | (100, 100) | 100 | 0 |
| liq-101-101 | (101, 101) | 101 | 1 |
| liq-1-10000 | (1, 10000) | 100 | 0 |
| liq-10000-1 | (10000, 1) | 100 | 0 |
| liq-100-10200 | (100, 10200) | 1009 | 909 |
| liq-3-1e9 | (3, 10^9) | 54772 | 54672 |
| liq-1e9-1e9 | (10^9, 10^9) | 10^9 | 10^9 - 100 |
| liq-1e9-4e9 | (10^9, 4 x 10^9) | 2 x 10^9 | 2 x 10^9 - 100 |
| liq-1e15-1e15 | (10^15, 10^15) | 10^15 | 10^15 - 100 |

Family B -- pre-funded vaults (liquidity uses post-transfer
balances; the event echoes args and vault balances separately):

| Case | (base_in, quote_in) + pre-fund | pool_base / pool_quote | init_liq | lp_out |
| --- | --- | --- | --- | --- |
| liq-prebase | (10^9, 10^9) + base 10^9 | 2 x 10^9 / 10^9 | 1414213562 | 1414213462 |
| liq-prequote | (10^9, 10^9) + quote 3 x 10^9 | 10^9 / 4 x 10^9 | 2 x 10^9 | 2 x 10^9 - 100 |
| liq-preboth-tiny | (1, 1) + 10^9 / 10^9 | 1000000001 / 1000000001 | 1000000001 | 999999901 |
| liq-preboth-100 | (1, 1) + 99 / 99 | 100 / 100 | 100 | 0 |

Family C -- TooLittle failures (6003, transfers first, then
rollback):

| Case | Post-transfer balances | sqrt floor |
| --- | --- | --- |
| liq-fail-1-1 | 1 / 1 | 1 |
| liq-fail-99-99 | 99 / 99 | 99 |
| liq-fail-2-3 | 2 / 3 | 2 (sqrt(6) floors to 2) |
| liq-fail-99-100 | 99 / 100 | 99 (sqrt(9900) floors to 99) |
| liq-fail-pre-50 | 51 / 51 | 51 |
| liq-fail-pre-98 | 99 / 99 | 99 |

All three images agree on committed account state, event fields, error code and payer charge in every case; compute-unit consumption and the 6003 error-site line (290 vs 144) differ.
`verify.py` rechecks every receipt independently:
signature validity, the CreatePoolEvent fields, the
floor-sqrt identity, the pool account fields, the user LP
amount, the LP mint supply, the vault balances, the user
token deltas, the payer charge, the error code and log
fragment, the per-image error site line, rollback on
failures, and agreement across images.

## Result

- **Liquidity is floor(sqrt(pb x pq)) in u128.**
  liq-100-10200 pins the floor: sqrt(1,020,000) = 1009
  (1010^2 = 1,020,100 already exceeds it), so lp_out is
  909, not 910. liq-3-1e9 pins it again: sqrt(3 x 10^9) =
  54772, lp_out 54672. The (10^15, 10^15) case (product 10^30 > u64::MAX) mints 10^15 - 100 without error, so the product is computed wider than u64; by source reading (u128 product, u64::MAX^2 < 2^128) no Truncation should be reachable from amounts alone, but no near-u64::MAX case was executed.
- **The 100 minimum liquidity is never minted.**
  lp_supply == init_liq in the pool account, while the
  user LP account and the LP mint supply both equal
  init_liq - 100. At exactly init_liq == 100 the create
  still succeeds and mints 0 LP (liq-100-100,
  liq-1-10000, liq-10000-1, liq-preboth-100 all land user
  LP 0 with a live pool); every executed case below 100 (init_liq 1, 2, 51, 99) fails. The lock
  is unminted supply, not a burn to a lock account --
  no account ever holds the 100.
- **Liquidity reads post-transfer vault balances, not the
  args.** liq-prebase's event reports base_amount_in
  10^9 but pool_base_amount 2 x 10^9, and init_liq
  follows the vault figure (1414213562 =
  floor(sqrt(2 x 10^18))). The sharpest form is
  liq-preboth-tiny: inputs of 1 and 1 create a
  billion-LP pool because the vaults were already
  funded, and liq-preboth-100 shows the same mechanism
  at the boundary -- 1 + 99 on each side lands exactly
  on init_liq 100 and succeeds, while the same inputs
  over 98 / 98 vaults (99 / 99 post-transfer) fail.
- **The 6003 failure happens after the transfers and is
  only safe by rollback.** In program order the base and
  quote transfers execute before `initial_liquidity`
  and the checked_sub(100); on failure the transaction
  rolls everything back: no pool account, no LP mint,
  no user LP account, vaults at exactly their
  pre-transaction balances (50 / 50 and 98 / 98 in the
  pre-funded failure cases), user token accounts
  untouched, payer -5,000 only, 0 events.
- **Fresh-create payer cost is 10,507,640 lamports**
  (pool rent + LP mint rent + 3 ATA rents + 5,000 fee),
  and each pre-existing vault saves exactly its
  2,039,280 ATA rent: one pre-funded vault costs
  8,468,360, two cost 6,429,080.
- **The created pool is otherwise zeroed.**
  coin_creator is all zeros, mayhem / cashback flags 0,
  virtual quote reserves 0, creator fee bps 0, protocol
  and creator fees 0 -- the only nonzero pool field
  besides keys and bump is lp_supply.
- **Event layout (CreatePoolEvent, discriminator
  b1310cd2a076a774):** base_amount_in @116, quote_amount_in
  @124, pool_base_amount @132, pool_quote_amount @140,
  minimum_liquidity @148 (= 100 in every success),
  initial_liquidity @156, lp_token_amount_out @164.
  Exactly 1 `Program data:` CreatePoolEvent log (plus one emit_cpi self-invoke) on every success, 0 on every failure.

Error sites (original / rebuilt):

- liq-fail-1-1: original programs/pump-amm/src/instructions/create_pool.rs:290. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; control programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; candidate programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.
- liq-fail-99-99: original programs/pump-amm/src/instructions/create_pool.rs:290. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; control programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; candidate programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.
- liq-fail-2-3: original programs/pump-amm/src/instructions/create_pool.rs:290. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; control programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; candidate programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.
- liq-fail-99-100: original programs/pump-amm/src/instructions/create_pool.rs:290. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; control programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; candidate programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.
- liq-fail-pre-50: original programs/pump-amm/src/instructions/create_pool.rs:290. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; control programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; candidate programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.
- liq-fail-pre-98: original programs/pump-amm/src/instructions/create_pool.rs:290. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; control programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.; candidate programs/pump-amm/src/instructions/create_pool.rs:144. Error Code: TooLittlePoolTokenLiquidity. Error Number: 6003. Error Message: TooLittlePoolTokenLiquidity.

## Limits

- `producer.py` regenerated these receipts on the author's machine: it hard-codes
  `~/workspace/pumpfun-sparse` and reads the control/candidate images from
  `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control
  and candidate are the gunzipped in-repo #424/#427 artifacts
  (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`,
  `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`); `verify.py`
  checks the recorded receipts and does not load the images.

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. Numbers are exact
for these fixtures. The fixture mints carry no transfer fee,
so a transfer-fee mint's effect on post-transfer vault
balances (and therefore on initial liquidity) is not
measured here. The 10,507,640 payer figure is the sum of
the created accounts' rents plus the 5,000 fee for this
fixture's account sizes, not a protocol constant. No
Truncation case is claimed: with u64 inputs the u128
product and its integer square root always fit in u64.
