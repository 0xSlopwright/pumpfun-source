# research: pin multi-hop trades on cashback/mayhem pools into sweep -> collect (terminal-hop cashback gate on the original vs per-hop gate on the rebuilds)

## Problem

3rd #16 pinned plain 3-hop multi-hop routes, and 3rd #22/#23/#24
pinned the v2 and legacy mode gates (cashback 6079, mayhem
6080/6013). What was open: multi-hop executes each hop through
the AMM's internal swap, so does it apply the mode gates per
hop -- and does the rebuilt program (#424 control, #427
candidate) match the original image there?

This packet answers with executed chains on the original,
control, and candidate images. The headline is a genuine
original-vs-rebuilt divergence, not a defect claim: in the
measured routes the original image rejects a cashback flag
only on the P3 (BASE3) hop, while the rebuilt images reject
it on every hop. Mayhem, by contrast, is rejected on every
hop on all three images.

"Terminal hop" in this packet means the user-facing hop that
also pays the creator fee: the P3 hop, which is the LAST hop
of a buy (quote -> base -> BASE2 -> BASE3) but the FIRST hop
of a sell (BASE3 -> BASE2 -> base -> quote). So a cashback
flag on the main pool is non-terminal here even on a sell,
where the main pool is the last hop executed. The receipts
cannot separate "user-facing hop" from "creator-fee hop" from
"the P3 pool", because in every 3-hop case they coincide.

## Cases

Fixture pools (all cases): main pool (base/quote) plus POOL2
(BASE2/base) and P3 (BASE3/BASE2), each seeded
virtual_quote_reserves −125,882, protocol_fees 2,488,
creator_fees 123,394. Trade size 1e9 in both directions.
Mode flags are set on pool state bytes 243 (mayhem) and 244
(cashback) before the trade. Each case chains the trade into
creator sweep -> collect on the tail pool (3-hop) or the main
pool (1-hop). 33 cases, 94 steps, 282 receipts (94 x 3
images), 29 parts (28 x 10 + 2).

- Family A (plain anchors): 3-hop buy and sell, no flags.
- Family B (non-terminal cashback): buy/sell with main or
  middle pool flagged cashback (main is hop 1 of a buy,
  hop 3 of a sell). DIVERGENT.
- Family C (terminal cashback): buy/sell with tail pool
  (P3) flagged cashback (hop 3 of a buy, hop 1 of a sell).
  Agreement: all fail.
- Family D (mayhem every hop): buy/sell with main, middle,
  or tail pool flagged mayhem. Agreement: all fail.
- Family E (both-flags precedence): buy/sell with main,
  middle, or tail pool flagged both; plus cross combos
  (main cashback + tail mayhem, main mayhem + tail
  cashback) in both directions. Divergent at non-terminal
  hops, agreement at terminal hops and in the cross combos
  where the first failing hop is the same on all images.
- Family F (loop persistence): buy -> sweep tail -> collect
  tail -> buy -> sweep tail -> collect tail, main pool
  flagged cashback. DIVERGENT across the loop.
- Family G (1-hop terminal rule): plain buy/sell anchors,
  plus buy/sell with the single pool flagged cashback,
  mayhem, or both. Agreement: the single hop IS the
  terminal hop.

## Result

All 33 cases execute on all three images; control and
candidate agree on every case. The original agrees except
on the 10 cases flagged divergent in runtime/report.json.gz.

- Plain anchors (family A): buy 1e9 quote -> out
  5,315,084,721,958 BASE3, buyback 4,607,153; main protocol
  +4,607,154, tail creator +2,671,742,901, middle pool
  byte-identical. Sell 1e9 BASE3 -> out 180,345 quote,
  buyback 846; tail creator +500,000 exactly, main
  protocol +847, middle pool byte-identical.
- Non-terminal cashback (family B): on the ORIGINAL image,
  buy and sell through a cashback main or middle pool
  match the plain anchors in every watched account after
  the trade except the flagged pool's own cashback byte
  (pool data offset 244), and their raw event bytes equal
  the anchors' (verify.py checks this) -- the flag has no
  observed effect. On CONTROL and CANDIDATE the same trades
  fail 6079 CashbackCoinNotSupported with full rollback
  and ghost events equal to the hops completed before
  the flagged hop (buy main 0, buy middle 1, sell main
  2, sell middle 1). The following tail sweep/collect
  drain the accrued buckets on the original
  (buy 2,671,866,295; sell 623,394) but only the 123,394
  seed on the rebuilds.
- Terminal cashback (family C): all images fail 6079
  with full rollback -- buy tail-cashback with 2 ghost
  events, sell tail-cashback with 0 -- and the seed
  sweep/collect afterwards drain exactly 123,394.
- Mayhem (family D): all images fail 6080
  MayhemPoolNotSupported with full rollback, ghost
  events 0/1/2 for buy main/middle/tail and 2/1/0 for
  sell main/middle/tail. Seed sweep/collect afterwards
  drain exactly 123,394.
- Both-flags precedence (family E): at a NON-terminal
  hop the original reports mayhem (6080) while the
  rebuilds report cashback (6079) -- cashback wins at
  every hop on the rebuilds, mayhem wins at
  non-terminal hops on the original. At the TERMINAL
  hop all images report cashback (6079): buy tail-both
  with 2 ghost events, sell tail-both with 0. Cross
  combos agree where the first failing hop is the
  same: buy main-cashback + tail-mayhem DIVERGES
  (original 6080 at the tail hop, rebuilds 6079 at
  the main hop), while sell main-cashback +
  tail-mayhem (6080, 0 events), buy main-mayhem +
  tail-cashback (6080, 0 events), and sell
  main-mayhem + tail-cashback (6079, 0 events) agree.
- Loop (family F): on the original the second buy
  through a cashback main pool still succeeds (out
  5,121,405,353,567, buyback 4,607,153, tail bucket
  re-accrued to 2,601,564,322 and drained by
  sweep/collect). On the rebuilds every attempt fails
  6079; after the first failure's seed sweep/collect,
  the second sweep/collect are silent no-ops
  (0 events, payer fee 5,000 only).
- 1-hop (family G): all images agree. Plain buy out
  5,368,809,031,467 (buyback 4,592,593, main creator
  +2,962,963); plain sell out 180,212 (buyback 849,
  main creator +548). Cashback 6079, mayhem 6080,
  both-flags 6079 (cashback wins at the terminal hop
  on every image), each with full rollback and seed
  sweep/collect afterwards.
- Error sites are recorded per image and are NOT
  compared across images: the original throws the
  multi-hop gates from trade_v2.rs (cashback :120,
  mayhem :124), while control/candidate throw them
  from multi_hop_swap.rs (cashback :500, mayhem
  :504). The site split is consistent with the gate
  living in a different code path on the original.
  Not re-run here, for context only: the current
  reconstructed source on main
  (programs/pump-amm/src/instructions/swap/trade_v2.rs,
  `validate_multi_hop_pool`, called per hop from
  multi_hop_swap.rs with the hop's creator-fee gate)
  has `require!(!charges_creator_fee ||
  !pool.is_cashback_coin, CashbackCoinNotSupported)` at
  line 120 and the mayhem require at line 124 -- the same
  file and lines the original image logs. That source is
  newer than the #424/#427 images measured here; no image
  built from it is measured in this packet.
- Volume account: the first successful multi-hop in
  a VM pays 1,844,400 rent + 5,000 fee and leaves a
  137-byte accumulator for the payer; later steps
  pay 5,000 only. Failed trades never init it.
- In these 33 cases, every failed trade rolls back fully
  on every image, and every first sweep/collect after a
  failure drains exactly the 123,394 seed.

## Limits

- Only 3-hop AMM routes and 1-hop routes are covered;
  4-hop/5-hop routes, curve hops, and mixed
  AMM/curve routes were not flagged here.
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

## Verify / provenance

verify.py checks the packet from its own files plus the three
program images retained in the repository
(evidence/original/pump_amm/deployed.so; the #424 control and
#427 candidate as the gzip `candidate.so.gz` artifacts under
research/amm-multi-hop-group-slice-recovery/ and
research/amm-transfer-fee-diagnostic-recovery/, hashed
decompressed). Event checks compare the decoded fields listed
in each step's expectation (plus the raw-byte anchor
comparison above); other raw event words are not checked.
producer.py is the script that generated the receipts; it
depends on a private workspace layout (`~/workspace/...`) and
is not runnable from this checkout as-is.

## Reproduction

From the repository root:

```
python3 -I -B research/amm-multi-hop-mode-pools-chains-20261029/verify.py
```

Expected output:

```
PASS: 33 cases, 282 receipts, 29 parts, per-image expectations hold (signatures, deltas, events, error codes/sites, rollback, silent no-ops); original non-terminal-cashback trades equal the plain anchors except byte 244; control == candidate everywhere; original diverges on 10 cases as pinned: b-buy-main-cb, b-buy-p2-cb, b-sell-main-cb, b-sell-p2-cb, e-buy-main-both, e-buy-p2-both, e-sell-main-both, e-sell-p2-both, e-buy-maincb-p3mayhem, f-buy-main-cb-loop
```
