# trade -> sweep -> collect loops under transfer fee

## Problem

3rd #10 chained the full fee pipeline looped -- a v2 trade
accrues fees into the pool, sweep_creator_fee moves the creator
bucket to the creator vault ATA, collect_coin_creator_fee drains
it to the creator's token account, and the next trade prices off
the moved vaults -- but it ran without a transfer fee, and left
the fee case open in its Limits ("Trades under a transfer fee
inside the loop were not chained here; the sweep/collect legs
under tf were pinned in 3rd #5 and the sweep -> v2 trade legs
under tf in 3rd #9"). This packet chains the loop under quote
transfer fees of 100 and 5000 bps, plus a third buy iteration
and the tf10000 edges, in single VMs, one signed transaction
per step, on three program images (original, #424 control, #427
candidate). The question is sharp because every hop withholds:
a sweep withholds on the vault ATA, a collect withholds again
on the destination, and the next trade's gross-up has to price
off vaults whose withheld balances are never drained by
any collect (they stay withheld on the account; the mint's
withheld-withdraw path is not exercised here).

## Fixture

Shared fixture pool `GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`
(base vault 673,696,395,912,745, quote vault 122,946,690,720,
virtual quote reserves -125,882, protocol fees 2,488, creator
fees 123,394, fee tiers lp 2 / protocol 93 / creator 30 bps,
buyback 5000 bps). The quote mint carries a synthesized
transfer-fee extension (100, 5000, or 10000 bps, maxfee
u64::MAX) as in 3rd #8/#9; the vault, user, and fee-recipient
accounts are Token-2022 ATAs. Sweep recipients, the buyback
ATA, and the collect destination are pre-created Token-2022
ATAs (2,157,600 lamports, 182 bytes, withheld at offset 174);
the override-converted vault/user accounts are 178 bytes with
withheld at offset 170. Every case starts from the same
fixture state; each case runs in a fresh VM per image.

Event layouts (offsets as read from the receipts; verify.py
decodes only the fields its expectations name):
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`: curve
  @64, lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee
  @96, quote_with_lp @104, user_quote_in @112 (pre-tf curve
  amounts -- the event never reports the grossed spend).
- SellEvent (v2), 449 bytes, disc `3e2f370aa503dc2a`: curve
  @64, lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee
  @96 (gross), quote @104, user output @112 (gross receipt,
  not the net payout).
- BuyExactEvent (v2), 515 bytes, disc `67f4521f2cf57777`:
  asserted by discriminator and length only here.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176 (gross bucket),
  bucket @184 (0 protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48 (gross vault amount drained), vault ATA @56, token
  account @88.

## Cases (10 cases, 41 steps per image, 123 receipts)

Family A -- tf100 anchors, no sweep/collect (3 cases):
- `a-buy-tf100`: buy 10^10: spend 1,866,375, vault
  +1,839,310 (withheld 18,579), buyback ATA +8,401
  (withheld 85), pool (-139,844, 10,975, 128,869). Event:
  curve 1,824,983, lp 365, protocol gross 16,973, quote
  1,825,348, uin 1,847,796 (pre-tf).
- `a-sell-tf100`: sell 10^10: user +1,784,093 (gross
  1,802,115, withheld 18,022), vault -1,810,601, buyback
  +8,401 (withheld 85), pool (-139,843, 10,974, 128,869).
  Event: curve 1,824,927, lp 365, protocol gross 16,972,
  quote 1,824,562, uout 1,802,115 (gross).
- `a-exact-tf100`: exact 10^7: out 53,573,907,921, spend
  9,999,541, vault +9,854,533 (withheld 99,541), buyback
  +45,012 (withheld 455), pool (-200,683, 47,955,
  152,728).

Family B -- buy loop tf100 (buy -> swc -> col -> buy -> swc
-> col -> swp -> col-noop):
- First buy, sweep, and collect match the anchor exactly (the
  first buy's raw event is byte-identical to `a-buy-tf100`'s):
  sweep moves 128,869 gross to net 127,580 (withheld
  1,289), collect drains 127,580 to dest 126,304
  (withheld 1,276), and the vault ATA keeps its 1,289
  after the drain (amount 0, withheld 1,289).
- Second buy costs 1,866,432 -- 57 MORE than the anchor
  (nofee loop: +56, from 3rd #10, not re-measured here) --
  with vault +1,839,366 and the same
  buyback 8,401. Event: curve 1,825,037, lp 366, protocol
  gross 16,973, quote 1,825,403, uin 1,847,852.
- Second sweep moves exactly 5,476 gross to net 5,421
  (withheld 55), so the vault withheld climbs to 1,344;
  second collect drains 5,421 to dest +5,366 (withheld
  55), dest withheld 1,331, vault withheld still 1,344.
- Protocol sweep moves 19,462 gross to net 19,267
  (withheld 195), pool (0, 0, 0); the following collect
  is a silent no-op (0 events, payer 5,000 only),
  protocol ATA untouched -- protocol sweep output is not
  collected by collect_coin_creator_fee under tf either
  (observed here; verify.py checks that every watched
  account except the fee payer is unchanged).

Family C -- sell loop tf100 (sell -> swc -> col -> sell ->
swc -> col -> col-noop):
- First sell, sweep (127,580 net), and collect (126,304
  net) match the anchor exactly (the first sell's raw event
  is byte-identical to `a-sell-tf100`'s).
- Second sell pays 1,784,040 -- 53 LESS than the anchor
  (nofee loop: -54, from 3rd #10, not re-measured here) --
  with vault -1,810,547 and the same
  buyback 8,401. Event: curve 1,824,873, lp 365, protocol
  gross 16,972, quote 1,824,508, uout 1,802,061.
- Second sweep moves 5,475 gross to net 5,420 (withheld
  55), vault withheld 1,344; second collect drains 5,420
  to dest +5,365 (withheld 55), dest withheld 1,331. A
  third collect is a silent no-op (0 events).

Family D -- exact loop tf100 (exact -> swc -> col -> exact
-> swc -> col):
- First exact, sweep (152,728 gross to net 151,200,
  withheld 1,528), and collect (dest 149,688, withheld
  1,512) match the anchor exactly (the first exact's raw
  event is byte-identical to `a-exact-tf100`'s); vault
  withheld stays
  1,528 after the drain.
- Second exact lands 53,565,387,102 -- 8,520,819 BELOW
  its tf anchor -- at the same 9,999,541 spend, with
  vault +9,854,533 (withheld now 199,082) and buyback
  +45,012 (withheld now 910) unchanged in net terms.
- Second sweep moves 29,334 gross to net 29,040
  (withheld 294), vault withheld 1,822; second collect
  drains 29,040 to dest +28,749 (withheld 291), dest
  withheld 1,803.

Family E -- buy loop tf5000 (buy -> swc -> col -> buy ->
swc -> col):
- First buy costs 3,687,106 (vault +1,839,310, withheld
  1,839,310; buyback +4,243, withheld 4,243); sweep
  moves 128,869 gross to net 64,434 (withheld 64,435);
  collect drains 64,434 to dest 32,217 (withheld
  32,217); vault withheld stays 64,435.
- Second buy costs 3,687,218 -- 112 MORE than the first
  (nofee +56 from 3rd #10, not re-measured here; tf100
  +57) -- with vault +1,839,366 and
  buyback +4,243. Second sweep moves 5,476 gross to net
  2,738 (withheld 2,738), vault withheld 67,173; second
  collect drains 2,738 to dest +1,369 (withheld 1,369),
  dest withheld 33,586.

Family F -- third buy iteration tf100 (buy -> swc -> col
x3):
- Third buy costs 1,866,487 (+55 over the second, +112
  over the first), vault +1,839,420, buyback +8,402.
  Event: curve 1,825,091, lp 366, protocol gross 16,974,
  quote 1,825,457, uin 1,847,907. Pool (-33,425, 27,949,
  5,476).
- Third sweep moves 5,476 gross to net 5,421 (withheld
  55), vault withheld 1,399; third collect drains 5,421
  to dest +5,366 (withheld 55), dest withheld 1,386.
  The stranded vault withheld (1,289 -> 1,344 -> 1,399)
  is never cleared by any collect.

Family G -- tf10000 edges:
- `g-buy-tf10000`: buy 10^10 fails 6023 Overflow, full
  rollback, payer 5,000 only, 0 events -- the buy
  gross-up divides by (1 - 1.0).
- `h-sell-tf10000`: sell 10^10 succeeds with user net 0
  (gross 1,802,115 fully withheld, user withheld
  1,802,115; buyback net 0, withheld 8,486) while the
  vault still moves -1,810,601 gross. The decoded event
  fields (curve, lp, protocol, quote, uout 1,802,115 gross)
  equal the tf100 sell anchor's; the raw event differs from
  the anchor's at words @384 and @440.

## Result

- Double withholding compounds across loops and the first
  hop's withheld stays on the vault ATA: every collect drains
  exactly the swept net and never touches the vault ATA's
  accumulated withheld (tf100: 1,289 -> 1,344 -> 1,399;
  tf5000: 64,435 -> 67,173), while the destination's own
  withheld climbs alongside it (tf100: 1,276 -> 1,331 ->
  1,386). The gap between the pool's gross accrual and
  what the creator receives grows every iteration and is
  not reclaimed through collect. (Withheld Token-2022
  balances are normally recoverable through the mint's
  withheld-withdraw path; that path is not exercised here.)
- The loop does NOT reset the price, and the curve move
  grosses up with the fee rate: second-buy premium over
  the anchor is +56 nofee (3rd #10, not re-measured
  here), +57 at tf100, +112 at tf5000
  (exactly 56 / (1 - rate) rounded up); the sell premium
  runs the other way (-54 nofee from 3rd #10, -53
  tf100), because
  withholding shrinks the payout loss. The sweep/collect
  pair is price-neutral for a following trade (shown in
  3rd #6-#9, not re-measured here) but never rewinds the curve move the previous trade
  itself caused.
- What DOES reset is the fee plumbing: every sweep moves
  exactly the current pool creator bucket (gross) and
  every collect drains exactly that sweep's net, at every
  loop iteration, on all three images -- and the protocol
  bucket keeps accruing across loops (19,462 after the
  tf100 buy loop) while only the creator bucket is swept.
- tf10000 splits buy from sell: buy overflows (6023) and
  sells pay zero net while still moving the vault gross.
  Events never report the fee: buy uin and sell uout are
  pre-tf curve amounts at every rate measured (the tf5000
  first buy's raw event differs from the tf100 anchor's only
  at @432 and @488, so uin @112 is unchanged).

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
  error codes, which agree across images.
- The quote-mint transfer-fee extension is synthesized
  post-hoc (as in 3rd #8/#9); this pins handler transfer
  behavior, not a reachable mainnet state.
- The buy_exact event is asserted by discriminator and length
  only (515 bytes); its interior u64 slots are not decoded
  into named fields here, unlike the buy/sell events whose
  curve/lp/protocol/quote slots are pinned.
- The first v2 step of each VM applies the trade transfer-fee
  override, which re-seeds the Token-2022 buyback ATA from
  the fixture buyback ATA; later steps in the same VM use a
  light override (meta swap only) so the buyback ATA balance
  accumulates across chained trades (as in 3rd #9).
- The withheld-field offset depends on how the account was
  built: the liquidity harness `transferfee` override produces
  178-byte accounts with withheld at offset 170, while the
  packet's own `t22acct` helper produces 182-byte accounts
  with withheld at offset 174. verify.py reads each layout
  at its own offset; a reader that assumes one offset for
  both layouts will misread one side's withheld balance.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-trade-sweep-collect-loops-tf-20261029/verify.py

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
