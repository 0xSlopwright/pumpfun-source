# boost_buy_and_burn partial spends under transfer fee, and the accrued-fee gate

## Problem

2nd-run #26 drained the boost vault in full (and showed the
Token-2022 writable-mint gate fires only on a drain) and 1st-run #50
spent 10^9 of 10^12 without a fee; neither pinned what a partial
spend does under a quote transfer fee, nor the accrued-fee check in
`boost_burn.rs`. Three questions: is the burn computed on the gross
used amount or on the net quote after the fee? Does the writable
gate fire on a partial spend? And does accrued protocol/creator
fees change the burn, or only gate it?

## Cases

22 cases x 3 images (original / #424 control / #427 candidate),
66 signed receipts, parts [10, 10, 10, 10, 10, 10, 6].
Fixture: pool virtual quote reserves 10^9, boost vault funded with
10^12 quote tokens, pool quote vault 122,946,690,720, pool base
673,696,395,912,745, fixture creator fees 123,394. The no-fee 10^9
case is re-pinned as an anchor from 1st-run #50 (its numbers match
exactly); every other case is new.

## Result

- **Partial burns are computed on the NET quote.** tf100 on 10^9
  burns 5,338,379,201,831 -- exactly the no-fee burn of the net
  990,000,000 (the no-fee 10^9 burn is 5,391,870,655,895, pool
  quote +10^9). tf5000 on 10^9 burns 2,706,767,012,738, the
  no-fee burn of the net 500,000,000. tf100 on 10^11 burns
  299,156,461,930,852 (net 99,000,000,000, withheld 1,000,000,000,
  remaining 900,000,000,000); tf100 on 5*10^11 burns
  538,785,845,334,673 (net 495,000,000,000, withheld
  5,000,000,000, remaining 500,000,000,000). tf100 with maxfee 123
  on 10^9 nets 999,999,877 and burns 5,391,869,998,003
  (withheld exactly 123).
- **The bottom identity explains #26's tf100 amount-2 failure.**
  tf100 amount 3 nets 2 and burns 5,435, the no-fee burn of 2;
  tf100 amount 4 nets 3 and burns 10,870, the no-fee burn of 3;
  tf100 amount 10 nets 9 and burns 43,482; tf100 amount 100 nets
  99 and burns 532,666 (withheld 1 in all four). The burn is
  `base_for_quote(net) = floor(b*(net-1)/(q+net-1))`, so net 1
  burns 0 -- which is why #26's tf100 amount 2 fails 6001
  ZeroBaseAmount while amount 3 succeeds.
- **The vault stays open on every partial spend** (remaining =
  balance - used, gross): 10^9 leaves 999,000,000,000, 5*10^11
  leaves 500,000,000,000, and even 10^12-1 leaves exactly 1 token
  -- under tf5000 (net 499,999,999,999, burn 539,866,951,722,110,
  withheld 500,000,000,000) and under tf100 cap 123 (net
  999,999,999,876, burn 599,402,446,277,846, withheld 123).
  The payer pays only the 5,000 fee on every partial spend; no
  rent is returned, because nothing is closed.
- **The writable-mint gate does NOT fire on a partial spend.**
  tf100 and tf5000 partial spends of 10^9 with a non-writable
  quote mint succeed with byte-identical numbers to the
  writable case -- the 6088 QuoteMintNotWritable gate is a
  drain-only gate (#26).
- **The partial slippage floor is net-based, like the drain
  floor.** tf100 10^9 with limit exactly 5,338,379,201,831
  succeeds and limit +1 fails 6004 ExceededSlippage; no-fee 10^9
  with limit exactly 5,391,870,655,895 succeeds and +1 fails
  6004.
- **The accrued-fee gate is inert below its threshold and
  changes nothing about the burn.** Accrued protocol fees of
  10^11, and of exactly 122,946,567,326, both burn exactly the
  no-fee 10^9 amount (5,391,870,655,895). The gate is
  `old_quote.checked_sub(protocol_fees + creator_fees)` in
  `boost_burn.rs`: the vault quote holds 122,946,690,720 and the
  fixture creator fees are 123,394, so the last passing protocol
  value is 122,946,690,720 - 123,394 = 122,946,567,326 and +1
  fails 6023 Overflow. Raising creator fees by 1 at the
  threshold also fails 6023, proving the check is on the SUM,
  not on either field alone. #26's fees-overflow case
  (2*10^11) is the far side of this same gate.
- Every success case emits exactly 2 events (BuyEvent +
  BoostBuyAndBurnEvent, 208 bytes: requested @144, used @152,
  burned @160, vq i128 @168, quote_after @184, base_after @192,
  remaining @200). Every failure case rolls back fully, payer
  5,000 only, 0 events.
- All 3 images agree on every case.

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. Thresholds and burn amounts
are exact for this fixture (virtual quote reserves 10^9, pool
quote 122,946,690,720, pool base 673,696,395,912,745, creator
fees 123,394), not claims about other pool states or mainnet
settings. The tf cases use a post-hoc synthesized quote-mint fee
extension, as in #26.

## Portable review scope

The verifier selects its repository from its own path. The producer and raw
receipts remain unchanged. These 22 fixtures contain 66 fresh-VM image scenarios,
66 signed executions and 66 verified signature fields. The images are historical
#424 and #427 artifacts, not the maintained current-source selection; no matching
window or global coverage increase is claimed. The receipt `inner_instructions`
arrays are empty placeholders and supply no inner-instruction parity evidence.
`loaded_programs` is the producer's image-hash declaration, not an independently
captured loader-header or full ProgramData attestation. The finite state/event
and signature checks retain their stated scope.

The verifier also binds `image_sha256` to the original file and the decompressed
repository control/candidate artifacts, then checks each raw AMM declaration
against that image. These checks reject declaration drift while retaining the
loader-attestation limit above. In the burn formula, `q` is the effective quote
reserve: the fixture vault 122,946,690,720 plus virtual 1,000,000,000, or
123,946,690,720. Accrued fees gate admission separately.

The three images agree on the checked states, arithmetic and event fields. Full
ordered log equality is not claimed: the four failure fixtures retain original
Source sites (`instructions/boost.rs:274` or `state/pool.rs:417`) versus historical
reconstruction sites (`boost_burn.rs:51` or `:47`), producing eight non-compute
log differences across the two reconstructed images. Those raw logs remain
unchanged and each image's recorded site is checked separately.
