# Legacy buy / sell / buy_exact under base transfer-fee

## Problem

Run 1 #44 pinned legacy buy/sell rejecting a Token-2022 mint with
InvalidAccountData, and #12/#13 pinned legacy buy_exact/sell QUOTE
transfer-fee. Neither pinned the legacy BASE leg under a transfer
fee -- and the base leg behaves differently from the quote leg in
two ways that matter: the legacy handlers do not pre-compute the
base fee at all, and the rejection in #44 turns out to be about
which token-program account is passed, not about the mint itself.
This packet pins the legacy base-fee numbers on the shared fixture
and records where they agree with v2 #43 (trade base tf) and where
they do not.

## Cases

All cases run on the shared v1/v2 fixture, 3 images each (original /
#424 control / #427 candidate). In tf cases the base mint carries a
Token-2022 transfer-fee extension and the base token-program meta is
TOKEN22 (the base token accounts are Token-2022 accounts at the same
fixture addresses); the quote mint has no fee.

- sell-nofee / sell-tf100 / sell-tf5000 / sell-tf10000 /
  sell-tf10001 / sell-tf65535: sell 10^9 base, limit 0, base fee at
  0%, 1%, 50%, 100%, 100.01%, 655.35% (maxfee u64max).
- sell-tf100-max100: sell 10^9 with 1% fee and maxfee cap 100.
- sell-tf100-limit-exact / sell-tf100-limit-plus1: sell 10^9 with
  1% fee and limit at the exact quote receipt (180,212) and +1.
- buy-nofee / buy-tf100 / buy-tf5000 / buy-tf10000 / buy-tf10001 /
  buy-tf65535: buy 10^10 base, limit 10^12, same fee grid.
- buy-tf100-max100: buy 10^10 with 1% fee and maxfee cap 100.
- buy-tf100-limit-exact / buy-tf100-limit-minus1: buy 10^10 with
  1% fee and limit at the exact quote spend (1,847,796) and -1.
- buy-exact-nofee / buy-exact-tf100 / buy-exact-tf10000 /
  buy-exact-tf10001: buy_exact 10^7 quote in, limit 1, base fee at
  0%, 1%, 100%, 100.01%.

## Result

The legacy handlers transfer through whichever token-program account
is passed in the metas: passing TOKEN22 with a Token-2022 base mint
succeeds, so #44's InvalidAccountData is a program-meta mismatch,
not a mint rejection. The fee is withheld by the Token-2022 program
during the transfer itself -- the AMM never pre-computes it:

- sell 10^9 base: the user always spends the full gross 10^9 and
  always receives 180,212 quote; only the vault's base receipt
  moves: nofee +10^9, tf100 +990,000,000, tf5000 +500,000,000,
  tf10000 +0 (100% withheld, still success). Quote legs are
  unchanged in every success case (protocol +849, creator +548,
  buyback +849) and the vault quote outflow stays -182,458
  (v2 #43 sell vault quote was -181,061 -- the legacy/v2 split
  difference persists under base tf).
- buy 10^10 base: the vault always sends the full gross -10^10 and
  the user always spends 1,847,796 quote; only the user's base
  receipt moves: nofee +10^10, tf100 +9,900,000,000, tf5000
  +5,000,000,000, tf10000 +0 (success). Quote legs unchanged
  (protocol +8,487, creator +5,475, buyback +8,486); vault quote
  +1,825,348 (v2 #43 buy vault quote was +1,839,310).
- buy_exact 10^7 quote in: gross base 54,115,018,303, vault quote
  +9,878,518, legs 45,926 / 29,630 / 45,926 in every success case
  (same gross/legs as #12's quote-tf packet, which had vault quote
  +9,878,518 vs v2's +9,954,074). tf100 user receipt is
  53,573,868,119 = gross - ceil(gross*100/10000): the odd gross
  pins ceiling rounding (floor would give 53,573,868,120).
  tf10000 is 0, still success.
- bps > 10000 on the base leg does NOT surface as the AMM's 6023
  Overflow (as quote tf does in #12/#13, where the AMM
  pre-computes amount_after_fee): the Token-2022 transfer CPI
  itself overflows, so the transaction fails with Token-2022
  program error 0xe and rolls everything back except the payer's
  5,000 fee. Identical for sell, buy, and buy_exact (tf10001 and
  tf65535).
- cap binding: tf100 with maxfee 100 withholds exactly 100, both
  directions (sell vault +999,999,900, buy user +9,999,999,900).
- limits are on the quote side and blind to the base fee: sell
  tf100 with limit = exact quote receipt 180,212 succeeds and +1
  fails 6004 ExceededSlippage; buy tf100 with limit = exact quote
  spend 1,847,796 succeeds and -1 fails 6004.
- payer cost: sell success/error = 5,000 only; buy/buy_exact
  success = 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee), error = 5,000 only.

All 3 images agree on every case. Error cases roll back everything
except the payer's 5,000 fee.

Error sites (log paths as emitted by each image):

- sell-tf10001: original Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; control Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; candidate Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe
- sell-tf65535: original Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; control Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; candidate Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe
- sell-tf100-limit-plus1: original programs/pump-amm/src/instructions/swap/sell.rs:189. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- buy-tf10001: original Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; control Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; candidate Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe
- buy-tf65535: original Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; control Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; candidate Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe
- buy-tf100-limit-minus1: original programs/pump-amm/src/instructions/swap/buy.rs:405. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- buy-exact-tf10001: original Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; control Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe; candidate Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb failed: custom program error: 0xe

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The v2 comparison numbers are cited from prior
packets #43 (trade base tf) and #12/#13 (legacy quote tf) on the
same fixture and images, not re-measured here. The Token-2022 base
mint is synthesized post-hoc (extension data + TOKEN22 owner on the
mint and base token accounts); a base mint created through the
legacy create path cannot carry a transfer fee, so this pins the
handler's transfer behavior, not a reachable mainnet state.
