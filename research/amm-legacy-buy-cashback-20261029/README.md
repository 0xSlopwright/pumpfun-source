# Legacy buy on a cashback pool

## Problem

An earlier run by the author (external run numbers such as "#44", "#12",
"#16", "#17", "#36" and "#43" below refer to that run series, not to pull
requests in this repository) pinned the legacy *sell* cashback conversion and explicitly
left legacy buy out, because buy needs a separate remaining
layout. This packet fills that seat: what `buy` and
`buy_exact_quote_in` do on a pool with `is_cashback_coin` set
(pool byte 244), which remaining accounts they read, in which
order the gates fire, and how the creator-fee leg behaves under
a quote transfer fee.

Source anchor (`instructions/swap/buy.rs`, `execute` +
`distribute_cashback`): when `creator_fee > 0` and the pool is a
cashback pool, the handler calls `distribute_cashback(remaining,
...)` (on main through `pay_cashback` / `pay_cashback_exact`,
buy.rs:546 / :916) and then reads the buyback accounts from remaining index
2. `distribute_cashback` writes remaining[0] as the
user_volume accumulator's ATA (key mismatch or read-only ->
6061), creates it via the ATA program when absent, transfers
`creator_fee` into it with `transfer_checked`, adds `creator_fee`
to `user_volume.cashback_earned` (overflow -> 6023), then calls
`validate_pool_v2(remaining, base_mint, 1)`. The non-cashback
path instead validates pool-v2 at index 0 and reads buyback
accounts from index 1.

## Cases

42 labelled cases x 3 images (original / #424 control / #427
candidate) = 126 receipts. Two labels repeat another case's
transaction exactly (same transaction, pre-state, logs, events and
post-state on all three images): `cb-readonly-poolv2` =
`cb-fresh-buy` and `cb-del-uvata` = `cb-std-remaining`, so there are
40 distinct transactions per image. Families:

- **A — success anchors (10 cases).** Non-cashback buy anchor,
  cashback fresh / present buy at 10^10, fresh buy at 10^6 and
  at 1, fresh buy_exact at 10^7, limit-exact buy and buy_exact,
  track=1 with a pre-existing accumulator, and cashback_earned
  accumulation on top of a pre-existing 1000.
- **B — remaining ladder (13 labels, 11 distinct new
  transactions).** No remaining, standard remaining, substituted /
  read-only / deleted cashback ATA, truncated remainings (ATA only;
  ATA+pool-v2; ATA+pool-v2+owner), substituted pool-v2, substituted
  buyback owner / dest, read-only pool-v2, read-only buyback dest.
  "Deleted cashback ATA" is the standard 3-account remaining (same
  receipt), and "read-only pool-v2" is the same transaction as the
  fresh cashback buy, because pool-v2 is already read-only in every
  baseline transaction.
- **C — creator-0 window shift (5 cases).** Zero-creator-fee
  tier on non-cashback standard remaining, on cashback layout,
  and on cashback standard remaining (all 6053), plus the
  trimmed [owner, dest] remaining succeeding on both pool kinds.
- **D — gates and guards (8 cases).** Cashback buy with buy
  disabled, mayhem buy, cashback+mayhem buy, amount 0, unsigned
  user, cashback_earned overflow, buy limit -1, buy_exact
  limit +1.
- **E — transfer-fee overlays (6 cases).** Cashback buy at
  tf100 / tf5000 / tf100-max100 / tf10000, and cashback
  buy_exact at tf100 fresh / present (all via
  `adapt_sell_helper(legacy_transferfee(...))`, never a raw
  override, which would produce the 6062 harness artifact seen
  in 2nd #16).

## Result

### The cashback remaining layout is 4 accounts

`[cashback ATA, pool-v2 PDA, buyback owner, buyback dest]`,
versus the standard 3-account `[pool-v2 PDA, buyback owner,
buyback dest]`. The named coin-creator vault ATA is not the
cashback leg: on a cashback buy it is untouched (delta 0) and
the creator fee goes to the accumulator ATA instead.

### Success anchors (all 3 images identical)

Non-cashback buy, amount 10^10, limit 10^12: user base +10^10,
user quote -1,847,796, vault base -10^10, vault quote
+1,825,348, protocol ATA +8,487, creator ATA +5,475, buyback
+8,486, payer -1,849,400. Event (497-byte BuyEvent): curve
1,824,983, lp_fee 365, protocol_fee 16,973, quote_with_lp
1,825,348, user_quote_in 1,847,796, creator_bps 30,
creator_fee 5,475, cashback_bps 0, cashback 0, buyback_bps
5000, buyback_fee 8,486.

Cashback fresh buy, same amount: token deltas identical
except creator ATA 0 and the new accumulator ATA +5,475;
volume cashback_earned 0 -> 5,475; payer -3,888,680 (fee
5,000 + volume rent 1,844,400 + ATA rent 2,039,280); the new
ATA holds 2,044,755 lamports (rent + 5,475). Event: creator
0/0, cashback_bps 30, cashback 5,475, buyback 5000/8,486.
Present buy: same deltas, payer -1,849,400 (no ATA rent).

Small amounts, fresh: amount 10^6 -> spend 187, vault quote
+184, protocol +1, buyback +1, uvata +1, earned 1, event
(curve 183, lp 1, protocol 2, qwlp 184, uqin 187, cb 30/1,
bb 5000/1). Amount 1 -> spend 4, vault quote +2, protocol
+1, buyback 0, uvata +1, earned 1, event (curve 1, lp 1,
protocol 1, qwlp 2, uqin 4, cb 30/1, bb 5000/0).

Cashback buy_exact, amount 10^7, limit 1: user base
+54,115,018,303, spend 10,000,000, vault base
-54,115,018,303, vault quote +9,878,518, protocol +45,926,
buyback +45,926, uvata +29,630, earned 29,630, payer
-3,888,680, new ATA 2,068,910 lamports. Event (512 bytes):
quote_amount_in @64 = 10,000,000 (gross amount), lp 1,976,
protocol 91,852, qwlp 9,878,518, user_quote_in @112 =
9,876,542 (net curve), cb_bps @423 = 30, cb @431 = 29,630,
bb_bps @439 = 5000, bb @447 = 45,926. This is the #12/#36
inversion: buy_exact reports gross in `quote_amount_in`
and net in `user_quote_amount_in`, the reverse of buy_v2.

Limit inclusivity: buy limit exactly 1,847,796 succeeds,
1,847,795 -> 6004 ExceededSlippage. Buy_exact limit exactly
54,115,018,303 succeeds, +1 -> 6040
BuySlippageBelowMinBaseAmountOut.

Track flag: with a pre-existing accumulator (sol volume
1000) and track=1, current_sol_volume stays 1000 while
cashback_earned still += 5,475 and the event carries
track_volume=true. Legacy buy does not accumulate sol
volume; only the event flag and cashback_earned move.

Accumulation: pre-existing earned 1000 + present ATA with
1000 tokens -> earned 6,475, ATA 6,475, payer -5,000.

### Remaining ladder

- No remaining on a cashback pool -> 6059
  MissingCashbackAccounts (this is the only 6059 in the
  packet; a merely *wrong* first account gives 6061).
- Standard 3-account remaining on a cashback pool -> 6061
  InvalidCashbackAccumulatorAta. (The author's earlier legacy-sell
  run reported 6060 InvalidCashbackAccumulator for the same mistake
  on sell; that contrast is not re-tested in this packet.)
- Substituted or read-only cashback ATA -> 6061 (deleting the
  ATA from the cashback layout is the standard 3-account case
  above, same receipt).
- Cashback ATA alone (pool-v2 missing) -> 6062
  InvalidPoolV2; cashback ATA + pool-v2, or plus owner
  (dest missing) -> 6058 BuybackFeeRecipientMissing.
- Substituted pool-v2 -> 6062; substituted buyback owner
  or dest -> 6053 BuybackFeeRecipientNotAuthorized.
- Pool-v2 is read-only in every receipt, including all
  successes; that `validate_pool_v2` only checks the key is a
  source reading (sell.rs:520-526), not a separate receipt.
  Read-only buyback
  dest -> runtime PrivilegeEscalation (not an Anchor error),
  payer -5,000, full rollback, 0 events.

### The creator-0 window shift (sharpest pin)

When `creator_fee == 0` the handler skips both the cashback
conversion and `validate_pool_v2`, so `next` stays 0 and the
buyback accounts are read from remaining index 0. A standard
3-account remaining therefore fails 6053 on a non-cashback
pool, on a cashback pool with the cashback layout, and on a
cashback pool with the standard layout alike -- the pool-v2
PDA is not an authorized buyback recipient. Trimming the
remaining to `[owner, dest]` restores success on both pool
kinds at the no-creator-fee spend 1,842,321 (= 1,825,348 +
8,487 + 8,486, no creator leg), payer -1,849,400, event
creator 0/0, cashback 0/0, buyback 5000/8,486. Here
creator_fee == 0 comes from a custom (2, 93, 0) bps fee tier,
not from a whitelisted user; the shift is consistent with the
source's `whitelist_pda` branch (which zeroes the fees), but no
whitelisted-user case was executed, and family C covers `buy`
only, not `buy_exact_quote_in`.

### Gate order

Source order (buy.rs:317-327): disable_flags buy (6020) >
protocol-recipient validation (6013) > zero guards (6001/6002) >
cashback conversion > buyback validation. Each gate case has a
single fault, so no receipt orders two gates against each other,
and 6002 is not observed. Observed: cashback + flags 8 -> 6020;
mayhem buy -> 6013 (mayhem pools check the RESERVED list, and the
fixture recipient is not reserved); cashback+mayhem buy -> 6013;
amount 0 with a cashback layout -> 6001. In the 6013 and 6001
failures the logs show only a System Program invocation before
the error, with no associated-token or token-program call, so the
cashback conversion had not started. Unsigned user -> 3010 AccountNotSigner
(caused by account: user), payer delta 0 for the watched
payer key (the fee payer is the OUTSIDER signer, unwatched).
Cashback_earned at u64::MAX + present buy -> 6023 Overflow,
earned stays u64::MAX.

### Transfer-fee overlay

Cashback_earned always grows by the GROSS creator fee
(5,475 at buy 10^10; 29,334 at buy_exact 10^7), the event
reports gross creator / cashback / protocol figures, but
the event's buyback_fee field is NET of transfer fee, and
every destination receives net while the vault leg is
grossed up:

- tf100 buy: spend 1,866,234, vault +1,825,348, protocol net
  8,402 (withheld 85), buyback net 8,401 (withheld 85),
  uvata net 5,420 (withheld 55), earned 5,475, payer
  -4,007,000 (5,000 + volume 1,844,400 + TOKEN22 ATA rent
  2,157,600). Event buyback_fee 8,401; all other event
  figures identical to the nofee event.
- tf5000 buy: spend 3,673,144, vault +1,825,348, protocol
  net 4,243 (withheld 4,244), buyback net 4,243 (withheld
  4,243 -- nominal 8,486 is exactly half, so no ceiling
  round-up, unlike protocol's 8,487), uvata net 2,737
  (withheld 2,738), earned 5,475, event buyback_fee 4,243.
- tf100-max100 buy: spend 1,847,896 = nofee spend + 100.
  The cap binds on the pool leg only (vault withheld 100);
  protocol / buyback / uvata legs are unchanged from tf100
  (withheld 85 / 85 / 55), because their per-leg fees are
  already under the cap.
- tf10000 buy -> 6023 Overflow in transfer_fee.rs. (Legacy
  buy_exact at tf10000 gives 6039 in
  research/amm-legacy-buy-exact-transfer-fee-20261029/README.md:55;
  no buy_exact tf10000 case is in this packet.)
- buy_exact tf100 fresh: out 53,573,907,921, spend
  9,998,786 of 10,000,000 (exact-in spends only the computed
  gross total), vault +9,779,732, protocol net 45,012
  (withheld 455), buyback net 45,012 (withheld 455), uvata
  net 29,040 (withheld 294), earned 29,334, payer -4,007,000.
  Event: out 53,573,907,921, quote @64 = 10,000,000 (gross),
  lp 1,956, protocol 90,934, qwlp 9,779,732, uqin @112 =
  9,777,776 (net curve), cb 30/29,334, bb 5000/45,012.
  Present variant: same deltas, payer -1,849,400.
- TOKEN22 ATA lamports track gross (net + withheld): fresh
  uvata22 holds 2,157,600 + gross (tf100: 2,163,075;
  buy_exact tf100: 2,186,934). Plain TOKEN ATA lamports
  track amount + rent (fresh cashback ATA: 2,039,280 +
  amount), as in #44's sell observation.

### Error sites (original / control and candidate)

6059 buy.rs:44 / :499. 6061 ATA-key buy.rs:54 / :503,
read-only buy.rs:57 / :504. 6062 pool-v2-missing sell.rs:520
/ :8, pool-v2-mismatch sell.rs:526 / :10. 6058 owner-missing
buy.rs:116 / :477, dest-missing buy.rs:121 / :479. 6053
owner global_config.rs:326 / :43, dest :336 / :47. 6020
buy.rs:317 / :134. 6013 swap/mod.rs:164 / :23. 6001
buy.rs:326 / :150. 6004 buy.rs:405 / :272. 6040 buy.rs:776
/ :270. 6023 earned-overflow buy.rs:98 / :529, tf10000
transfer_fee.rs:67 / :35 (candidate matches original :67,
control :35). 3010 caused by account: user (all images).
Codes and names agree on all 3 images; only line numbers
differ. The second column comes from the #424/#427 images, which
were built from an older buy.rs (765f432b, 532 lines); main's
maintained buy.rs (993 lines) reproduces the original column.
These README line numbers are not machine-checked against
source: verify.py compares the report's recorded site strings
with the same receipts' logs.

## Limits

- Offline LiteSVM synthetic fixture only; no source change,
  build, or whole-program equivalence claim. All amounts,
  sites, and boundaries are exact for this fixture's state
  (single fee tier (2, 93, 30) bps via the Fees CPI, pool
  accrued fees 0, virtual quote reserves 0, supply 10^12),
  not claims about other pool states.
- The creator-0 mechanism is stated from the handler's
  control flow (`next` stays 0 when creator_fee == 0) plus
  the observed 6053 / trimmed-success pair, not from a
  source-level proof of intent.
- Token-account lamports tracking amount (+ withheld for
  TOKEN22) is a fixture/VM observation, reported as
  observed; token amounts are the primary assertions.
- Buyback-fee event semantics (gross protocol/cashback,
  net buyback) are pinned from the decoded events, not from
  the event struct's documentation.
- The read-only buyback dest failure is a runtime
  PrivilegeEscalation, not a program error; it is recorded
  as such rather than forced into an Anchor code.
- `producer.py` records the author's run: it hard-codes
  `~/workspace/pumpfun-sparse` and `~/workspace/slop-verify/{control,candidate}.so`,
  which are not in this repository, so it cannot be re-run from
  here as committed, and it writes empty `mismatches` /
  `divergent_cases` lists rather than computing them.
  `verify.py` checks the recorded receipts (manifest hashes,
  signatures, logs, events and the README figures) without
  re-executing the transactions, and its input hashes do not
  cover the control and candidate images.
