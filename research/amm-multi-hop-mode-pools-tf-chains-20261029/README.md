# Multi-hop trades on mode pools under transfer fee, chained into sweep → collect

## Problem

3rd #25/#26/#29 pinned an original-vs-rebuilt divergence for multi-hop
trades on mode-flagged pools with NO fee: the original program gates
cashback only at the terminal hop of a multi-hop route, while the
rebuilt programs (#424 control, #427 candidate) gate it at every hop.
3rd #23 pinned mode-pool liquidity under a transfer fee, but not
multi-hop. Open question: does the mode-gate divergence survive when
the quote mint carries a transfer fee, and do the fee legs — withheld
balances, the buyback TOKEN22 ATA, main-pool sweep/collect under tf —
behave identically on all three images?

## Method

One signed transaction per step, replayed on three program images
(original deployed image, control #424 rebuild, candidate #427
rebuild) in a LiteSVM harness with a fixed fixture: three pools
(main, p2, p3) at the INIT state (virtual_quote_reserves −125,882,
protocol_fees 2,488, creator_fees 123,394, lp_supply 4,194,352,106,721),
quote-mint transfer fee applied via the liquidity-harness override
(`transferfee(quote, bps, 2**64-1)`), buyback leg routed to a
TOKEN22 ATA (182 bytes, withheld at offset 174), main-pool
sweep/collect routed to fresh TOKEN22 ATAs. Trade size is 1e9 in both
directions. Each case runs trade → sweep → collect (Family G runs the
sequence twice). `verify.py` re-checks every receipt independently:
signatures, token deltas, withheld balances, pool states, volume
account, event fields, error codes/sites, rollback, and the
control == candidate surface identity.

## Cases (19 cases × 3 images = 180 receipts, 18 parts of 10)

- Family A — tf anchors, all images agree: `a-buy-tf100`,
  `a-sell-tf100`, `a-buy-tf5000`, `a-sell-tf5000`.
- Family B — non-terminal cashback under tf100, DIVERGENT:
  `b-buy-main-cb`, `b-buy-p2-cb`, `b-sell-main-cb`, `b-sell-p2-cb`.
- Family C — terminal cashback under tf100, all fail 6079:
  `c-buy-p3-cb` (2 ghost events), `c-sell-p3-cb` (0 ghosts).
- Family D — mayhem under tf100, all fail 6080: `d-buy-main-mayhem`,
  `d-sell-p3-mayhem` (0 ghosts each).
- Family E — both-flags precedence under tf100: `e-buy-main-both`
  (DIVERGENT), `e-sell-p3-both` (agree, 6079), `e-buy-maincb-p3mayhem`
  (DIVERGENT).
- Family F — main-pool sweep/collect under tf100, all images agree:
  `f-buy-main-swc`, `f-buy-main-swp`, `f-sell-main-swc`.
- Family G — loop persistence under tf100, DIVERGENT:
  `g-buy-main-cb-loop` (buy → tail sweep/collect, twice).

## Result

- The divergence SURVIVES tf100. Non-terminal cashback under tf100:
  the original settles byte-identically to the tf anchors (buy out
  5,262,910,281,902; sell out 178,541), while control/candidate fail
  6079 with full rollback (ghost events: buy main 0 / p2 1, sell
  main 2 / p2 1).
- Terminal cashback under tf100 fails 6079 on ALL images; mayhem
  under tf100 fails 6080 on ALL images. Both-flags precedence still
  splits under tf100: at a non-terminal both-flags hop the original
  fails 6080 (mayhem wins) while rebuilds fail 6079 (cashback wins);
  at the terminal both-flags hop all images fail 6079. With main-cb
  + p3-mayhem the original fails 6080 with 2 ghost events while
  rebuilds fail 6079 with 0.
- tf anchors (all images agree): buy tf100 out 5,262,910,281,902,
  vaultquote withheld 10,000,000, buyback22 amount 4,515,471 /
  withheld 45,611; sell tf100 out 178,541, userquote withheld 1,804,
  buyback22 837 / 9; buy tf5000 out 2,682,425,360,738, vaultquote
  withheld 500,000,000, buyback22 1,151,788 / 1,151,789; sell tf5000
  out 90,172, userquote withheld 90,173, buyback22 423 / 423.
- Main-pool sweep/collect under tf100 (all images agree): creator
  sweep moves 123,394 gross (122,160 net, 1,234 withheld at the
  creator TOKEN22 ATA); protocol sweep moves 4,563,570 gross
  (4,517,934 net, 45,636 withheld at the protocol TOKEN22 ATA);
  collect after a creator sweep moves 122,160 net (120,938 net,
  1,222 withheld at the destination); collect after a protocol
  sweep is a silent no-op (0 events, payer −5,000 only).
- Loop persistence under tf100: on the original, a second buy
  through a cashback main pool still succeeds (out
  5,072,980,706,277; vaultquote withheld accumulates to 20,000,000;
  buyback22 amount 9,030,942 / withheld 91,222) and re-accrues the
  tail bucket (2,576,568,271). On control/candidate every attempt
  fails 6079; the second sweep/collect are silent no-ops.
- Every failed trade rolls back fully on every image; the seed
  sweep/collect after a failure always drains exactly 123,394.
  First successful multi-hop pays payer −1,849,400 (1,844,400 rent
  + 5,000 fee) and leaves a 137-byte volume accumulator; later
  steps pay 5,000; failed trades never initialise it.
- Control == candidate on every case. Original diverges on 7 cases:
  the 4 Family B cases, `e-buy-main-both`,
  `e-buy-maincb-p3mayhem`, and `g-buy-main-cb-loop`.
- Error sites (recorded per image, never compared across images):
  original multi-hop gates throw from `trade_v2.rs` (cashback:120,
  mayhem:124); control/candidate throw from `multi_hop_swap.rs`
  (cashback:500, mayhem:504).

## Limits

- This packet pins observed behaviour on three program images in a
  synthetic harness; it does not claim a source-code change, a
  rebuild, or whole-program equivalence.
- Only tf100 and tf5000 on the quote mint, 1e9 trade size, and the
  fixed INIT pool fixture were measured. The no-fee multi-hop
  divergence itself is covered by 3rd #25/#26/#29; this packet adds
  only the tf combination.
- Fee math (ceil division, max-fee cap) is exercised only at the
  measured points above; no other bps values were probed.
