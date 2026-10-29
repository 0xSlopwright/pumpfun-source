# 5-hop multi-hop trades chained into sweep -> collect

## Problem

3rd #16 chained 3-hop trades into sweep_creator_fee and
collect_coin_creator_fee and found the middle pool accrues
nothing: a 3-hop trade accrues fees into exactly TWO pools, the
first hop and the tail hop. This packet extends the route to
five hops and asks whether the finding generalizes -- the
natural guess being that each of the five hops accrues its own
fees into its own pool, so a 5-hop trade would leave five
sweepable buckets. It does not here: in every 5-hop trade
measured, fees accrued into exactly TWO pools, and the THREE
middle pool accounts were byte-identical before and after, in
both directions. The packet then chains
the 5-hop trades through sweep -> collect the way #16 did for
3-hop: loops, sweep-first neutrality, limit gates (including
the 5-hop buy panic from 2nd #39), protocol-sweep no-ops, and
a cross-direction (buy -> sell) chain, all in single VMs, one
signed transaction per step, on three program images
(original, #424 control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. The 5-hop route is built by the
multi-hop harness: hop1 is the main pool (base/quote), hop2 is
POOL2 (BASE2/base), hop3 is P3 (BASE3/BASE2), hop4 is P4
(BASE4/BASE3), hop5 is P5 (BASE5/BASE4); POOL2, P3, P4, and P5
are copies of the main pool's state with their own
pool-authority creators, vaults, and mints, and the same fee
fields (-125,882, 2,488, 123,394) and the same coin_creator.
A 5-hop buy pays userquote and lands BASE5 in U5; a 5-hop sell
pays U5 and lands quote in userquote. The protocol and creator
recipient ATAs and the collect destinations for all five pools
are pre-created with 0 tokens, so every sweep and collect
costs only the 5,000 fee. A trade step funds the user volume
accumulator on the first trade of a VM (1,844,400 lamports,
137 bytes); later trades in the same VM reuse it and cost
5,000 only. The P4/P5 vault ATAs and destinations use the
NON-native token layout (like userbase), because BASE3/BASE4
are SPL mints, not the native SOL mint (see Limits for the
native-flag probe artifact).

Event layouts (offsets as read from the receipts; verify.py
decodes only the sweep/collect fields its expectations name, and
asserts multi-hop trade events by discriminator and length
only, five per trade -- one per hop):
- Multi-hop buy event, 508 bytes, disc `67f4521f2cf57777`.
- Multi-hop sell event, 449 bytes, disc `3e2f370aa503dc2a`.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.

Pool states below are (virtual_quote_reserves, protocol_fees,
creator_fees); lp_supply is 4,194,352,106,721 throughout and is
asserted on every step.

## Cases (15 cases, 90 steps per image, 270 receipts)

Family A -- fresh 5-hop anchors:
- `a-mhbuy5-1e9`: buy 10^9: userquote -10^9, U5
  +5,259,040,470,738, buyback +4,607,153. Vault legs:
  vb1 -5,385,694,844,757 / vq1 +995,392,847, vb2
  -5,356,844,515,538 / vq2 +5,385,694,844,757, vb3
  -5,328,301,632,828 / vq3 +5,356,844,515,538, vb4
  -5,300,061,308,171 / vq4 +5,328,301,632,828, vb5
  -5,259,040,470,738 / vq5 +5,300,061,308,171. Pools:
  main (-4,733,036, 4,609,642, 123,394), P2/P3/P4 exactly
  (-125,882, 2,488, 123,394), P5 (-2,643,547,981, 2,488,
  2,643,545,493). The buyback equals the 3-hop and 4-hop
  packets' 10^9 buyback (+4,607,153).
- `a-mhsell5-1e9`: sell 10^9: userquote +180,345, U5
  -10^9, buyback +846. Vault legs: vb1 +997,496,013 /
  vq1 -181,191, vb2 +997,497,009 / vq2 -997,496,013, vb3
  +997,498,005 / vq3 -997,497,009, vb4 +997,499,001 /
  vq4 -997,498,005, vb5 +10^9 / vq5 -997,499,001. Pools:
  main (-126,729, 3,335, 123,394), P2/P3/P4 exactly
  (-125,882, 2,488, 123,394), P5 (-625,882, 2,488,
  623,394). The userquote (+180,345) and buyback (+846)
  equal the 3-hop and 4-hop packets' 10^9 sells; this packet
  does not isolate why the extra hops leave them unchanged.
- `a-mhbuy5-1e6`: buy 10^6: U5 +5,415,387,061, buyback
  +4,607. Pools: main (-130,490, 7,096, 123,394),
  P2/P3/P4 exactly (-125,882, 2,488, 123,394), P5
  (-2,833,591, 2,488, 2,831,103).
- `a-mhsell5-1e6`: sell 10^6: userquote +180, U5 -10^6,
  buyback +1. Pools: main (-125,883, 2,489, 123,394),
  P2/P3/P4 exactly (-125,882, 2,488, 123,394), P5
  (-126,382, 2,488, 123,894).

Family B -- buy loop:
- `b-mhbuy5-loop`: buy 10^9, sweep creator P5 (moves the
  full 2,643,545,493; P5 becomes (-2,488, 2,488, 0)),
  collect P5 (dest5 +2,643,545,493), sweep creator P4
  (moves only the 123,394 seed; P4 becomes (-2,488, 2,488,
  0)), collect P4 (dest4 +123,394), sweep creator main
  (moves 123,394; main becomes (-4,609,642, 4,609,642, 0)),
  collect main (dest +123,394), second buy 10^9 (payer
  -5,000 only; hop1 quote leg +995,392,847 and buyback
  +4,607,153 are equal to the first buy's while the other
  vault legs move (the raw hop events differ, e.g. at words
  @16, @48, @56, @448 and @488 of hop 1): U5 out 5,259,040,470,738 -> 4,963,540,456,839;
  pools main (-9,216,796, 9,216,796, 0), P2/P3 exactly
  (-125,882, 2,488, 123,394), P4 (-2,488, 2,488, 0), P5
  (-2,520,687,598, 2,488, 2,520,685,110)), sweep creator
  P5 (moves 2,520,685,110), collect P5 (dest5 total
  5,164,230,603).

Family C -- sell loop:
- `c-mhsell5-loop`: sell 10^9, sweep creator P5 (moves
  623,394; P5 becomes (-2,488, 2,488, 0)), collect P5
  (dest5 +623,394), second sell 10^9 (payer -5,000 only;
  userquote +180,343 -- two less than the first sell's
  180,345, vs one less at 3 hops -- buyback 846 unchanged;
  pools main (-127,576, 4,182, 123,394), P2/P3/P4 exactly
  (-125,882, 2,488, 123,394), P5 (-502,487, 2,488,
  499,999)), sweep creator P5 (moves 499,999 -- one less
  than the first sell's 500,000), collect P5 (dest5 total
  1,123,393), sweep protocol P5 (moves 2,488; P5 becomes
  (0, 0, 0)), collect P5 (silent no-op: 0 events, payer
  -5,000 only; verify.py checks that every watched account
  except the fee payer is unchanged -- the protocol sweep
  output was not collected here).

Family D -- sweep-first:
- `d-sweeps-all-mhbuy5`: sweep both buckets of all five
  pools (10 steps, each moving only its seed: creator
  123,394, protocol 2,488 per pool; all pools end (0, 0,
  0)), then buy 10^9: every token delta equals
  `a-mhbuy5-1e9`'s, and the pool deltas are equal too (the
  raw hop events differ at words @56, @448, @456, @464 and
  @488 on all five hops, which record post-sweep pool
  state) -- the pools end at
  main (-4,607,154, 4,607,154, 0), P2/P3/P4 (0, 0, 0), P5
  (-2,643,422,099, 0, 2,643,422,099), i.e. the fresh pools
  minus the swept seeds (P5 creator is 123,394 less than
  the fresh 2,643,545,493).
- `d-tail-sweeps-mhbuy5`: sweep only P5 (both buckets),
  then buy 10^9: token legs equal to the anchor's (hops 1-4
  raw events equal the anchor's; hop 5 differs at @56, @448,
  @456, @464 and @488); pools main
  (-4,733,036, 4,609,642, 123,394), P2/P3/P4 exactly
  (-125,882, 2,488, 123,394), P5 (-2,643,422,099, 0,
  2,643,422,099).
- `d-sweeps-all-mhsell5`: sweep all five pools, then sell
  10^9: token legs equal to the anchor's (raw events differ
  at @56, @392, @400 and @432 on every hop); pools main (-847,
  847, 0), P2/P3/P4 (0, 0, 0), P5 (-500,000, 0, 500,000).
- `d-sweeps-all-mhbuy5-limit-exact`: sweep all pools,
  then buy 10^9 with limit exactly the anchor out
  (5,259,040,470,738): success, token legs equal to the
  anchor's.
- `d-sweeps-all-mhbuy5-limit-plus1`: sweep all pools,
  then buy 10^9 with limit +1 (5,259,040,470,739): the
  transaction surfaces as ProgramFailedToComplete (SBF
  panic "memory allocation failed, out of memory") with
  all five hop events already in the logs (ghost events),
  full rollback, payer -5,000 only. From the sweep-first
  state the buy still hit the 5-hop buy panic from 2nd #39:
  the original image logs the 6004 AnchorError
  (multi_hop_swap.rs:389) before panicking, the rebuilt
  images panic without logging it (per-image site lines
  recorded in the report, never compared across images).
- `d-sweeps-all-mhsell5-limit-plus1`: sweep all pools,
  then sell 10^9 with limit 180,346: clean Tagged 6004
  ExceededSlippage, full rollback, five ghost hop events,
  payer -5,000 only. The sell side stays clean at five
  hops; only the buy side panics.

Family E -- protocol no-op + middle-pool independence:
- `e-mhbuy5-proto-noop`: buy 10^9, sweep protocol P5
  (moves 2,488; P5 becomes (-2,643,545,493, 0,
  2,643,545,493)), collect P5: silent no-op (0 events).
- `e-mhsell5-middle`: sell 10^9, sweep creator P4 (moves
  only the 123,394 seed; P4 becomes (-2,488, 2,488, 0)),
  collect P4 (dest4 +123,394). In this case the middle
  pool's only sweepable content after the 5-hop sell was its
  seed.

Family F -- cross-direction chain:
- `f-mhbuy5-mhsell5-cross`: buy 10^9, then sell 10^9 in
  one VM. The sell after the buy pays 191,240 quote (vs
  the fresh 180,345 anchor) after the buy had moved all five
  pools' vaults (and the main/P5 virtual quote reserves);
  this packet does not isolate which of those changes the
  higher output. The sell accrues 898 into the main protocol
  bucket (4,609,642 -> 4,610,540) and 505,306 into the P5
  creator bucket (2,643,545,493 -> 2,644,050,799) on top
  of the buy's buckets; the following P5 sweep moves the
  full 2,644,050,799 and the collect drains it. P2/P3/P4
  stay exactly (-125,882, 2,488, 123,394) through both
  trades.

## Result

- In every 5-hop trade measured (buy and sell, at 10^9
  and 10^6, fresh and after loops/sweeps), fees accrued
  into exactly TWO pools, main and P5. In every trade
  measured the main pool accrued protocol only and P5
  creator only, whatever the direction: on a buy (main is
  hop1) main pf +4,607,154 and P5 cf rises to 2,643,545,493
  (an accrual of 2,643,422,099 over the 123,394 seed); on a
  sell (P5 is hop1) P5 cf +500,000 and main pf +847. The
  POOL2, P3, and P4 accounts are byte-identical before and
  after every 5-hop trade in this packet (verify.py checks
  this); in the measured sweeps their only sweepable content
  was the 123,394 seed.
- In the three sweep-first cases measured (all-pools buy,
  P5-only buy, all-pools sell, each at 10^9), the trade's
  token deltas equalled the fresh anchor's (the raw hop
  events differ in the post-sweep pool-state words). In
  every sweep measured, the pool's vq rose by exactly the
  amount swept, so vq + pf + cf was unchanged by the sweep
  -- consistent with 3rd #6's arithmetic, now at five hops.
- In the one buy limit +1 case measured (after sweeping all
  pools), the 5-hop buy still panicked
  (ProgramFailedToComplete) with five ghost hop events,
  while the matching sell limit +1 failed with a clean
  6004. With the 3-hop/4-hop packets' clean buy-side 6004
  and 2nd #39's fresh-state 5-hop panic, this reads as a
  buy-side 5-hop behavior that the swept (empty-bucket)
  state does not remove.
- In both cases measured here (`c-mhsell5-loop`,
  `e-mhbuy5-proto-noop`), the collect following a P5
  protocol sweep was a silent no-op: protocol sweep output
  was not collected by collect_coin_creator_fee.
- Loops compose: the second buy's hop1 quote leg and
  buyback are equal to the first buy's, the second sell
  pays exactly 2 less with buyback unchanged, and the
  second sell's P5 creator accrual is 499,999 -- one less
  than the first sell's 500,000.

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole program
  equivalence claim.
- All amounts, error codes, and site lines are exact values for
  this fixture state, not claims about other pool states. Error
  site line numbers differ between the original and the rebuilt
  images (sell 6004 at multi_hop_swap.rs:389 on the original;
  the buy panic logs the same 6004 line on the original image
  only); verify.py checks each image's recorded site line
  against that image's own logs and never compares site lines
  across images (2nd #36 lesson). The README cites error
  codes, which agree across images. The panic's log-surface
  split is observed per image: verify.py checks that the
  original image's logs contain the recorded 6004 line; the
  absence of that line on the rebuilt images is observed in
  the receipts, not checked by verify.py.
- The P4/P5 creator/protocol vault ATAs and collect
  destinations use the NON-native token layout (like userbase),
  because BASE3/BASE4 are SPL mints, not the native SOL mint.
  An earlier probe that flagged those accounts native=True
  produced runtime-level collect failures
  (UnbalancedInstruction / InsufficientFundsForRent) that are
  a harness artifact, not program behavior; with the correct
  non-native layout every collect in this packet succeeds. Those artifact
  failures are NOT part of this packet.
- The multi-hop trade events are asserted by discriminator and
  length only (buy 508 bytes, sell 449 bytes, five per trade);
  their interior u64 slots are not decoded into named fields
  here, unlike the sweep/collect events whose amount, bucket,
  recipient, fee, vault ATA, and dest slots are pinned.
- 5-hop trades under a transfer fee, and 5-hop trades on
  cashback/mayhem pools, were not chained here; the tf
  dimension for sweep chains was pinned in 3rd #5/#8/#9/#11
  and the mode gates in 2nd #44.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-multi-hop-five-hop-sweep-collect-chains-20261029/verify.py

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
