# research: pin 4-hop multi-hop trades on cashback/mayhem pools into sweep -> collect (terminal-hop cashback gate on the original vs per-hop gate on the rebuilds, at four hops)

## Problem

3rd #25 pinned a genuine original-vs-rebuilt divergence at 3 hops and
3rd #26 at 5 hops: the original image gates cashback only at the
buy-direction tail pool, while the rebuilt images (#424 control, #427
candidate) gate cashback at every hop. Both prior hop counts are odd.
What was open: does the rule hold at an even hop count, with the tail
pool P4 -- and do the ghost-event counts, the both-flags precedence
split, and the loop persistence all carry over unchanged?

This packet answers with executed chains on the original, control, and
candidate images. The headline is the same divergence, now pinned at
four hops -- not a defect claim: the original image gates cashback
only at the route's tail pool (P4: the hop that delivers the user's
out-token on a buy, or spends the user's in-token on a sell), while
the rebuilt images gate cashback at every hop. Mayhem, by contrast,
gates every hop on all three images.

## Cases

Fixture pools (all cases): main pool (base/quote) plus POOL2
(BASE2/base), P3 (BASE3/BASE2), and P4 (BASE4/BASE3), each seeded
virtual_quote_reserves −125,882, protocol_fees 2,488,
creator_fees 123,394. Trade size 1e9 in both directions. Mode flags
are set on pool state bytes 243 (mayhem) and 244 (cashback) before
the trade. Each case chains the trade into creator sweep -> collect
on the tail pool (P4). 25 cases, 74 steps, 222 receipts (74 x 3
images), 23 parts (22 x 10 + 2).

- Family A (plain anchors): 4-hop buy and sell, no flags.
- Family B (non-terminal cashback): buy/sell with main, P2, or
  P3 pool flagged cashback. DIVERGENT.
- Family C (terminal cashback): buy/sell with tail pool P4
  flagged cashback. Agreement: all fail.
- Family D (mayhem every hop): buy/sell with main, P2, P3, or
  P4 pool flagged mayhem. Agreement: all fail.
- Family E (both-flags precedence): buy/sell with main or P4
  pool flagged both; plus cross combos (buy main cashback +
  P4 mayhem, sell main mayhem + P4 cashback). Divergent at
  non-terminal hops, agreement at terminal hops and in the sell
  cross combo where the first failing hop is the same on all
  images.
- Family F (loop persistence): buy -> sweep P4 -> collect
  P4 -> buy -> sweep P4 -> collect P4, main pool flagged
  cashback. DIVERGENT across the loop.

## Result

All 25 cases execute on all three images; control and candidate
agree on every case. The original agrees except on the 10 cases
flagged divergent in runtime/report.json.gz.

- Plain anchors (family A): buy 1e9 quote -> out
  5,286,914,075,404 BASE4, buyback 4,607,153; main protocol
  +4,607,154, tail creator +2,657,630,443, middle pools
  byte-identical. Sell 1e9 BASE4 -> out 180,345 quote,
  buyback 846; tail creator +500,000 exactly, main
  protocol +847, middle pools byte-identical.
- Non-terminal cashback (family B): on the ORIGINAL image,
  buy and sell through a cashback main, P2, or P3 pool
  settle byte-identically to the plain anchors (same
  legs, same buckets, same events) -- the flag is
  invisible. On CONTROL and CANDIDATE the same trades
  fail 6079 CashbackCoinNotSupported with full rollback
  and ghost events equal to the hops completed before
  the flagged hop (buy main 0, P2 1, P3 2; sell main 3,
  P2 2, P3 1). The following tail sweep/collect drain
  the accrued buckets on the original
  (buy 2,657,630,443; sell 623,394) but only the 123,394
  seed on the rebuilds.
- Terminal cashback (family C): all images fail 6079
  with full rollback -- buy tail-cashback with 3 ghost
  events, sell tail-cashback with 0 -- and the seed
  sweep/collect afterwards drain exactly 123,394.
- Mayhem (family D): all images fail 6080
  MayhemPoolNotSupported with full rollback, ghost
  events 0/1/2/3 for buy main/P2/P3/P4 and 3/2/1/0 for
  sell main/P2/P3/P4. Seed sweep/collect afterwards
  drain exactly 123,394.
- Both-flags precedence (family E): at a NON-terminal
  hop the original reports mayhem (6080) while the
  rebuilds report cashback (6079) -- cashback wins at
  every hop on the rebuilds, mayhem wins at
  non-terminal hops on the original. At the TERMINAL
  hop all images report cashback (6079): buy P4-both
  with 3 ghost events, sell P4-both with 0. Cross
  combos: buy main-cashback + P4-mayhem DIVERGES
  (original 6080 at the tail hop with 3 ghost events,
  rebuilds 6079 at the main hop with 0), while sell
  main-mayhem + P4-cashback agrees (6079, 0 events --
  the first hop P4 is the cashback terminal hop on
  every image).
- Loop (family F): on the original the second buy
  through a cashback main pool still succeeds (out
  5,041,513,990,535, buyback 4,607,153, tail bucket
  re-accrued to 2,560,628,922 and drained by
  sweep/collect). On the rebuilds every attempt fails
  6079; after the first failure's seed sweep/collect,
  the second sweep/collect are silent no-ops
  (0 events, payer fee 5,000 only).
- Error sites are recorded per image and are NOT
  compared across images: the original throws the
  multi-hop gates from trade_v2.rs (cashback :120,
  mayhem :124), while control/candidate throw them
  from multi_hop_swap.rs (cashback :500, mayhem
  :504). The site split is consistent with the gate
  living in a different code path on the original,
  but no source-level cause is claimed for the
  original image, whose source at that revision is
  not in this checkout.
- Volume account: the first successful multi-hop in
  a VM pays 1,844,400 rent + 5,000 fee and leaves a
  137-byte accumulator for the payer; later steps
  pay 5,000 only. Failed trades never init it.
- Every failed trade rolls back fully on every image;
  every seed sweep/collect after a failure drains
  exactly 123,394.

## Limits

- Only 4-hop AMM routes are covered; 3-hop routes were
  pinned in 3rd #25 and 5-hop routes in 3rd #26, and
  curve hops and mixed AMM/curve routes were not
  flagged here.
- Only the fixture pool state (seed buckets 2,488 /
  123,394) is used; pools with non-seed buckets were
  not flagged here.
- Only the cashback/mayhem flags are varied; disable
  flags, fee tiers, and transfer fees were not
  combined with mode flags in this packet.
- No source change, no build, and no whole-program
  equivalence is claimed: this packet pins executed
  behaviour on three images, including one deliberate
  original-vs-rebuilt divergence.

## Reproduction

```
python3 verify.py
```

Expected output:

```
PASS: 25 cases, 222 receipts, 23 parts, per-image expectations hold (signatures, deltas, events, error codes/sites, rollback); control == candidate everywhere; original diverges on 10 cases as pinned: b-buy-main-cb, b-buy-p2-cb, b-buy-p3-cb, b-sell-main-cb, b-sell-p2-cb, b-sell-p3-cb, e-buy-main-both, e-sell-main-both, e-buy-maincb-p4mayhem, f-buy-main-cb-loop
```
