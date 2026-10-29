# sweep price neutrality under transfer fee

## Problem

3rd #6 proved a sweep is price-neutral for deposit, withdraw, and
legacy buy, and 3rd #7 proved it for legacy sell -- but both ran
without a transfer fee, and both left the fee case open in their
Limits (sweep -> deposit/withdraw under tf, sweep -> legacy sell
under tf). 3rd #5 proved the sweep itself moves quote tokens
under a fee (vault spends gross, recipient gains net, event
gross), so the neutrality could have broken in three places: the
sweep's own withholding, the downstream leg's gross-up/net-down,
or the limit gates' sides. This packet chains both sweeps into
deposit, withdraw, and legacy sell under quote transfer fees
(tf100 and tf5000) and pins all three places to the unit.

## Fixture

Shared fixture pool `GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`
(protocol fees 2,488, creator fees 123,394, virtual quote
reserves -125,882, base vault 673,696,395,912,745, quote vault
122,946,690,720). The quote mint carries a synthesized
Token-2022 transfer-fee extension (post-hoc, as in 3rd #5: the
legacy creation path cannot put a transfer fee on a quote mint
either); the mint, the user quote ATA, and the vault quote ATA
are converted by the liquidity harness `transferfee` override to
178-byte Token-2022 accounts, whose withheld field sits at
offset 170 (not 174 -- see Limits). The protocol, creator, and
buyback recipient ATAs are pre-created Token-2022 ATAs
(182 bytes, withheld at offset 174) funded at the 182-byte rent
(2,157,600 lamports), so every sweep costs only the 5,000 fee.
Each case runs as one signed transaction per step in a single
VM, on three program images (original, #424 control, #427
candidate).

## Cases (26 cases, 55 steps per image, 165 receipts)

Family A -- tf anchors, no sweep (6 cases):
- `a-dep-tf100`: deposit 10^9 LP: user base -160,619,895,224,
  user quote -29,608,495 (grossed up), LP +10^9, vault base
  +160,619,895,224, vault quote +29,312,410 (net receipt),
  vault withheld 296,085. Event base 160,619,895,224, quote
  29,312,410.
- `a-wd-tf100`: withdraw 10^9 LP: user base +160,619,895,223,
  user quote +29,019,284 (net), LP -10^9, vault base
  -160,619,895,223, vault quote -29,312,409 (gross send),
  user withheld 293,125. Event base 160,619,895,223, quote
  29,312,409 (gross).
- `a-lsell-tf100`: legacy sell 10^9: user base -10^9, user
  quote +178,409 (net of gross 180,212), vault base +10^9,
  vault quote -182,458 (gross, fee-blind), protocol +840
  (gross 849, withheld 9), creator +542 (gross 548, withheld
  6), buyback +840 (gross 849, withheld 9). The SellEvent
  reports gross throughout: curve 182,495, lp_fee 37,
  proto_fee 1,698, quote 182,458, uout 180,212. Pool fields
  unchanged (legacy sell accrues nothing).
- `a-dep-tf5000`: user quote -58,624,820, vault quote
  +29,312,410, vault withheld 29,312,410; base leg unchanged.
- `a-wd-tf5000`: user quote +14,656,204, vault quote
  -29,312,409, user withheld 14,656,205.
- `a-lsell-tf5000`: user quote +90,106 (gross 180,212,
  withheld 90,106), protocol +424 (withheld 425), creator +274
  (withheld 274), buyback +424 (withheld 425), vault quote
  -182,458, decoded event fields (curve, lp/protocol fees,
  quote, uout) equal to the tf100 anchor's (gross); the raw
  event bytes differ in two trailing words.

Family S -- sweep -> deposit tf100 (3 cases):
- `s-both-dep-tf100`: both sweeps, then deposit: sweep legs
  exactly as in 3rd #5 (protocol +2,463 net / withheld 25,
  vault -2,488, event gross 2,488; creator +122,160 net /
  withheld 1,234, vault -123,394, event gross 123,394), then
  the deposit settles with the same legs and decoded event
  fields as `a-dep-tf100`
  (user quote -29,608,495, vault quote +29,312,410, vault
  withheld 296,085), pool (0, 0, 0, supply +10^9).
- `s-proto-dep-tf100` / `s-creator-dep-tf100`: one sweep only,
  then deposit: legs identical to the anchor; the leg moves
  with neither bucket.

Family W -- sweep -> withdraw tf100 (3 cases):
- `w-both-wd-tf100` / `w-proto-wd-tf100` /
  `w-creator-wd-tf100`: the withdraw settles with the same
  legs and decoded event fields as `a-wd-tf100` (user quote +29,019,284, vault quote
  -29,312,409, user withheld 293,125) after both, protocol-
  only, or creator-only sweeps.

Family G -- sweep -> legacy sell (4 cases):
- `g-both-lsell-tf100`: both sweeps, then sell: legs
  and decoded event fields equal to `a-lsell-tf100`, with withheld
  accumulating additively (protocol 25 -> 34, creator
  1,234 -> 1,240, buyback 0 -> 9).
- `g-proto-lsell-tf100` / `g-creator-lsell-tf100`: one sweep
  only, then sell: legs identical to the anchor.
- `g-both-lsell-tf5000`: both sweeps (protocol +1,244 /
  withheld 1,244, creator +61,697 / withheld 61,697), then
  sell legs equal to `a-lsell-tf5000` (withheld protocol
  1,244 -> 1,669, creator 61,697 -> 61,971, buyback 0 -> 425).

Family L -- limit gates post-sweep tf100 (6 cases):
- `l-dep-maxquote-grossminus1`: after both sweeps, deposit
  with maxquote 29,608,494 (gross - 1) -> 6004
  ExceededSlippage (deposit.rs:100 original), full rollback.
- `l-dep-maxquote-gross`: maxquote 29,608,495 (gross exact)
  -> success, anchor legs. (The net receipt 29,312,410 as
  maxquote also fails 6004 -- probed, not cased.)
- `l-wd-minquote-netplus1`: after both sweeps, withdraw with
  minquote 29,019,285 (net + 1) -> 6004 (withdraw.rs:107
  original), full rollback.
- `l-wd-minquote-net`: minquote 29,019,284 (net exact) ->
  success, anchor legs. (The gross send 29,312,409 as
  minquote also fails 6004 -- probed, not cased.)
- `l-lsell-minquote-gross`: after both sweeps, sell with
  minquote 180,212 (the nofee anchor receipt) -> 6004
  (sell.rs:189 original), full rollback. A limit copied from
  a nofee anchor does not survive the fee.
- `l-lsell-minquote-net`: minquote 178,409 (net exact) ->
  success, anchor legs.

Family R -- round trip tf100 (1 case):
- `r-dep-sweeps-wd-tf100`: deposit, both sweeps, withdraw:
  nets exactly -1 base / -589,211 quote (deposit spend
  29,608,495 minus withdraw receipt 29,019,284); the vault
  nets +1 quote; withheld accumulates on both sides (vault
  296,085 from the deposit, user 293,125 from the withdraw);
  pool fields return to (0, 0, 0) and supply to the as-is
  value.

Family U -- underfunded 22 ATA rent asymmetry, tf100 (3 cases):
- `u-swp-underfunded-proto`: the protocol recipient ATA
  funded at the 165-byte rent (2,039,280) instead of the
  182-byte rent (2,157,600): the protocol sweep fails at the
  TRANSACTION level with InsufficientFundsForRent (no
  AnchorError, account_index = the ATA). The sweep event is
  still emitted in the logs, but all state rolls back -- a
  ghost event on a failed transaction.
- `u-swc-underfunded-creat`: the creator recipient ATA
  funded at the same 2,039,280: the creator sweep SUCCEEDS
  (+122,160, withheld 1,234, payer 5,000). The rent gate is
  not uniform across the two sweep handlers.
- `u-lsell-underfunded-proto`: legacy sell with the protocol
  recipient ATA at 2,039,280 -> 2005 ConstraintRentExempt
  (caused by account: protocol_fee_recipient_token_account),
  full rollback, payer 5,000.

## Result

- Sweep neutrality survives the transfer fee on every path
  measured: deposit, withdraw, and legacy sell after either
  or both sweeps settle with the same token legs, withheld
  amounts, and decoded event fields as their tf anchors.
  The raw events are NOT byte-identical: the deposit and
  withdraw events differ from the anchor in the word @64,
  and the legacy sell events in the pool quote reserve word
  @56 and some trailing words, which record the post-sweep
  pool state.
  The sweep's withholding is confined to the sweep step
  itself; it never leaks into the downstream leg. Inference
  (not separately checked by verify.py): this is because the
  sweep drains the vault by the gross swept amount while
  converting the accrual to virtual quote reserves 1:1, so
  both the available reserve (raw - accrued) and the
  effective reserve (raw + vq) are invariant -- the same
  arithmetic as 3rd #6, now observed under withholding.
- The gross/net split is fixed per direction: deposit
  grosses the user spend up and reports the vault receipt
  in the event; withdraw sends gross from the vault, nets
  the user down, and reports gross in the event; legacy sell
  moves the vault gross, nets every recipient leg by
  ceiling withholding, and reports gross in the event
  (uout is the gross receipt, not the net payout).
- Limit sides are direction-fixed, not fee-fixed: deposit
  maxquote is gross-side, withdraw minquote is net-side,
  legacy-sell minquote is net-side -- after a sweep, under
  tf, exactly as without either.
- The 182-byte rent matters: funding a Token-2022 ATA at the
  165-byte rent breaks the protocol sweep (transaction-level
  rent failure with a ghost event) and legacy sell (2005),
  but not the creator sweep. Any harness or client that
  funds a 22 ATA at 2,039,280 will see handler-dependent
  failures.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts, error codes, and site lines are exact values
  for this fixture state, not claims about other pool states.
  Error site line numbers differ between the original and the
  rebuilt images; verify.py checks each image's recorded site
  line against that image's own logs and never compares site
  lines across images (2nd #36 lesson). The README cites
  original-image sites (deposit 6004 deposit.rs:100,
  withdraw 6004 withdraw.rs:107, legacy sell 6004
  sell.rs:189).
- The withheld-field offset depends on how the account was
  built: the liquidity harness `transferfee` override produces
  178-byte accounts with withheld at offset 170, while the
  packet's own `t22acct` helper produces 182-byte accounts
  with withheld at offset 174. verify.py reads each layout
  at its own offset; a reader that assumes one offset for
  both layouts will misread one side's withheld balance.
- The underfunded-ATA rent asymmetry is reported as observed
  handler behavior (protocol sweep fails at transaction
  level, creator sweep succeeds, legacy sell fails 2005);
  the packet does not name the internal rent-check path that
  differs between the two sweep handlers.
- The quote-mint transfer-fee extension is synthesized
  post-hoc (as in 3rd #5); this pins handler transfer
  behavior, not a reachable mainnet state. v2 trades under
  tf after a sweep were not chained here (3rd #4 + 2nd #7
  cover the two halves separately).

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-sweep-transfer-fee-neutrality-20261029/verify.py

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
control/candidate `.so` files) and chdirs there on start.
