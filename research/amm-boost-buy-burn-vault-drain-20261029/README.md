# boost_buy_and_burn: full vault drain

## Problem

1st run packet #50 pinned `boost_buy_and_burn` only for a *partial*
spend (10^9 out of a 10^12 vault): the quote/base fee split, the
net-based floor, and tf10000 -> 6002. Everything that happens only
when the vault is emptied was left open: the harvest-and-close
path, the quote-mint writable gate, and what a failed drain leaves
in the logs. This packet fills exactly that gap.

## Cases

Fixture (all cases, fresh VM per case per image): pool
virtual_quote_reserves set to 10^9, boost authority set to the
payer, boost enabled, boost vault ATA funded with 10^12 quote
tokens. Pool vaults before: quote 122,946,690,720, base
673,696,395,912,745. Three images: original, #424 control, #427
candidate. 20 cases x 3 images = 60 signed receipts.

Success (8):

- `drain-nofee` (requested 10^12): pool quote +10^12, base burned
  599,402,446,286,043, vault spent 10^12 and **closed**. Payer
  gains 2,034,280 lamports (closed-vault rent 2,039,280 minus the
  5,000 fee).
- `drain-nofee-over` (requested 10^12+1): byte-identical outcome
  to `drain-nofee` — used = min(requested, balance).
- `drain-tf100-write` (tf100, mint writable): pool quote net
  +990,000,000,000, base burned 598,735,502,793,632, vault spent
  10^12 and closed. Payer gains 999,995,000: the vault's 10^12
  lamports move to the pool quote ATA with the native tokens,
  leaving 10^9 rent lamports to the authority, minus 5,000. Pool
  quote ATA withheld tail (offset 170 u64) = 10,000,000,000.
- `drain-tf100-cap123` (tf100, maxfee 123, seeded withheld 123):
  the cap binds — pool quote net +999,999,999,877, base burned
  599,402,446,277,912, vault closed, payer +999,995,000, pool
  withheld tail = 123.
- `drain-tf5000-write`: pool quote net +500,000,000,000, base
  burned 539,866,951,722,324, vault closed, payer +999,995,000,
  pool withheld tail = 500,000,000,000.
- `partial-tf100-nowrite` (requested 10^12-1, mint NOT writable):
  succeeds — pool quote net +989,999,999,999, base burned
  598,735,502,793,565, vault keeps exactly 1 token and is NOT
  closed. The writable gate does not fire on a partial spend.
- `amount2-nofee`: pool quote +2, base burned 5,435, vault keeps
  999,999,999,998.
- `drain-tf100-write-min-exact` (limit = 598,735,502,793,632):
  succeeds with the same numbers as `drain-tf100-write`.

Errors (12), all with full rollback and payer fee 5,000:

- `drain-tf100-nowrite` (full drain, mint NOT writable): 6088
  QuoteMintNotWritable, original site
  `instructions/boost.rs:403` (control/candidate
  `boost_burn.rs:97`). **The logs still carry both events**
  (BuyEvent + BoostBuyAndBurnEvent, used 10^12, burned
  598,735,502,793,632) because the events are emitted before the
  writable gate runs — the logged burn never happened. State
  rolls back; only the logs differ from a clean failure.
- `drain-tf10000`: 6002 ZeroQuoteAmount, original
  `instructions/boost.rs:255` (control/candidate
  `boost_burn.rs:43`) — net is zero, so the drain fails before
  any close.
- `drain-tf100-write-min-plus1` (limit = burned + 1): 6004
  ExceededSlippage, original `instructions/boost.rs:274`
  (control/candidate `boost_burn.rs:51`) — the floor is net-based.
- `auth-mismatch`: 6005 InvalidAdmin, original
  `state/global_config.rs:297` (control/candidate `:92`).
- `boost-disabled`: 6066 BoostDisabled, original
  `instructions/boost.rs:238` (control/candidate
  `boost_burn.rs:33`).
- `disable-buy`: 6020 DisabledBuy, original
  `instructions/boost.rs:240` (control/candidate
  `boost_burn.rs:34`).
- `cannot-boost` (total virtual reserves zero): 6065
  PoolCannotBoost, original `instructions/boost.rs:245`
  (control/candidate `boost_burn.rs:35`).
- `q-zero` (curve quote zero): 6003
  TooLittlePoolTokenLiquidity, original
  `instructions/boost.rs:280` (control/candidate
  `boost_burn.rs:52`) — with q = 0 the burn would equal the whole
  base supply.
- `fees-overflow` (accrued protocol fees 200,000,000,000 >
  quote balance): 6023 Overflow, original `state/pool.rs:417`
  (control/candidate `boost_burn.rs:47`).
- `amount0`: 6002 ZeroQuoteAmount, original
  `instructions/boost.rs:250` (control/candidate
  `boost_burn.rs:38`).
- `amount1-nofee`: 6001 ZeroBaseAmount, original
  `instructions/boost.rs:273` (control/candidate
  `boost_burn.rs:50`) — the net-1 adjustment makes the burn zero.
- `amount2-tf100`: 6001 ZeroBaseAmount, same sites — net is 1
  after the 1% fee, same adjustment.

Every success case emits exactly 2 events. The BoostBuyAndBurnEvent
is the 208-byte event: requested u64 @144, used @152, burned @160,
virtual quote i128 @168, real quote after @184, base after @192,
remaining @200.

## Result

A full drain closes the boost vault and returns its rent; the
Token-2022 writable-mint gate fires only on a full drain, and its
failure is the one error case that still logs both events. The
drain floor is net-based, the cap binds the withheld amount only,
and used = min(requested, balance). All three images agree on
every case.

## Limits

- Synthetic fixtures only: pool virtual quote reserves, boost
  authority, and vault funding are set by the harness, not by a
  real pool lifecycle (no real Pump migrate_v2 CPI is run here;
  see 2nd #11 for the migrate path).
- The quote mint's supply field is 0 in this fixture, so no claim
  is made about supply changes from the withheld harvest; only
  that harvest + close succeed (the transaction succeeds and the
  vault is gone) and the pool quote ATA's withheld tail records
  exactly this transfer's fee.
- No claim about source changes, builds, or whole-program
  equivalence: this packet pins observed behavior on the three
  images listed in `runtime/report.json.gz`.
