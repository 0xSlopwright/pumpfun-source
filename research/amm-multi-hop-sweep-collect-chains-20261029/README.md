# multi-hop trades chained into sweep -> collect

## Problem

3rd #10 looped v2 trades through sweep -> collect, but multi-hop
was never chained. The gap matters because a multi-hop trade does
not pay its fees the way a legacy trade does: 2nd #48 showed a
1-hop multi-hop sell leaves protocol 849 / creator 548 accrued in
the pool (legacy sell pays the recipient ATAs directly), so a
sweep after a multi-hop trade should move a much larger creator
bucket -- and the loop question is open again: does the drained
state move the next multi-hop trade, and does a sweep placed
BEFORE a multi-hop trade reprice it? This packet chains 1-hop
multi-hop buy/sell trades into sweep_creator_fee and
collect_coin_creator_fee in single VMs, one signed transaction
per step, on three program images (original, #424 control, #427
candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. The protocol and creator recipient ATAs
and the collect destination DEST are pre-created with 0 tokens,
so every sweep and collect costs only the 5,000 fee. A trade
step funds the user volume accumulator on the first trade of a
VM (1,844,400 lamports, 137 bytes); later trades in the same VM
reuse it and cost 5,000 only. Sweep steps before any trade leave
the volume account unfunded (None). Multi-hop uses the tail hop
on the main pool with limit 1 (minimum output 1).

Event layouts (offsets as read from the receipts; verify.py
decodes only the sweep/collect fields its expectations name, and
asserts multi-hop trade events by discriminator and length
only):
- Multi-hop buy event, 508 bytes, disc `67f4521f2cf57777`
  (same disc as the v2 buy event, 8 bytes longer).
- Multi-hop sell event, 449 bytes, disc `3e2f370aa503dc2a`
  (same disc and length as the v2 sell event).
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.

## Cases (8 cases, 28 steps per image, 84 receipts)

Family A -- fresh 1-hop multi-hop anchors:
- `a-mhbuy-1e9`: buy 10^9 quote: user base +5,368,809,031,467,
  vault base -5,368,809,031,467, vault quote +995,407,407,
  buyback +4,592,593, pool (-7,681,438, 4,595,081, 3,086,357).
- `a-mhsell-1e9`: sell 10^9 base: user quote +180,212, vault
  base +10^9, vault quote -181,061, buyback +849, pool
  (-127,279, 3,337, 123,942).
- `a-mhbuy-1e6`: buy 10^6 quote: user base +5,411,881,565,
  vault quote +995,407, buyback +4,593, pool (-133,438, 7,081,
  126,357).

Family B -- buy loop (mhbuy -> swc -> col -> mhbuy -> swc ->
col):
- First buy, sweep, and collect match the anchor exactly (the
  first buy's raw event is byte-identical to `a-mhbuy-1e9`'s):
  sweep moves 3,086,357 (pool cf 0, vq -4,595,081), collect
  drains 3,086,357 to DEST, pool untouched by collect.
- Second buy lands 5,283,907,178,002 base -- 84,901,853,465
  less than the fresh anchor -- but its vault leg
  (+995,407,407), buyback (+4,592,593), and fee accruals
  (pf +4,592,593, cf +2,962,963) are equal to the first
  buy's (the raw events differ, at words @16, @32-@56, @448 and
  @488). The fee legs are size-determined, not
  price-determined; only the base out moves with the curve.
- Second sweep moves exactly 2,962,963, second collect
  drains exactly 2,962,963, pool pf 9,187,674 (4,595,081 +
  4,592,593) -- the protocol bucket accrued across both loops
  while only the creator bucket was swept.

Family C -- sell loop (mhsell -> swc -> col -> mhsell -> swc
-> col -> swp -> col-noop):
- First sell, sweep (123,942), and collect (123,942) match
  the anchor exactly (the first sell's raw event is
  byte-identical to `a-mhsell-1e9`'s).
- Second sell pays 180,211 -- exactly 1 less than the anchor
  -- with vault -181,060 (vs -181,061) and the same buyback
  849. Event disc/len equal to the anchor's (the raw event
  differs in several words, including @64, @104 and @112).
- Second sweep moves exactly 548, second collect drains
  exactly 548, pool pf 4,186. Protocol sweep moves 4,186 to
  the protocol ATA (pool (0, 0, 0)); the following collect is
  a silent no-op (0 events, payer 5,000 only), protocol ATA
  untouched -- protocol sweep output is not collected by
  collect_coin_creator_fee, observed here after multi-hop
  loops (verify.py checks that every watched account except
  the fee payer is unchanged).

Family D -- sweep-first multi-hop trades:
- `d-sweeps-mhbuy`: both sweeps (creator 123,394, protocol
  2,488, pool (0, 0, 0)), then buy 10^9: user base
  +5,368,809,031,467, vault +995,407,407, buyback +4,592,593
  -- token deltas equal to the fresh anchor's (the raw event
  differs at words @56, @448, @456, @464 and @488, which
  record post-sweep pool state). Pool deltas match
  the anchor's (pf +4,592,593, cf +2,962,963, vq -7,555,556).
- `d-sweeps-mhsell`: both sweeps, then sell 10^9: user
  +180,212, vault -181,061, buyback 849 -- token deltas
  equal to the fresh anchor's (the raw event differs at
  words @56, @392, @400 and @432). Pool deltas match (pf +849, cf +548,
  vq -1,397).
- The sweep's 1:1 accrual-to-vq conversion keeps the
  effective reserve invariant for multi-hop pricing too (the
  same arithmetic as 3rd #6, now for the multi-hop path).

Family E -- bucket independence (mhbuy -> swp -> col-noop ->
swc -> col):
- Buy matches the anchor; protocol sweep moves 4,595,081
  (pool (-3,086,357, 0, 3,086,357)); the following collect is
  a silent no-op (0 events); the creator sweep still moves
  exactly 3,086,357 (pool (0, 0, 0)) and the collect drains
  exactly 3,086,357. Sweeping one bucket never disturbs the
  other.

## Result

- A 1-hop multi-hop buy of 10^9 quote leaves a creator
  bucket of 3,086,357 (123,394 fixture + 2,962,963 accrued),
  versus 128,869 after the 3rd #10 v2 buy. The difference is
  trade size, not a different fee split: the accrual is
  about 30 bps of the trade in both cases (2,962,963 on
  10^9 quote here; 2,963 on the 10^6 buy in `a-mhbuy-1e6`;
  5,475 on the v2 buy's ~1.8M quote). The creator sweep moves exactly that bucket and the
  collect drains exactly that sweep's output, every time.
- The loop does NOT reset the price, but the fee legs do not
  move with it: second buy base out drops by 84,901,853,465
  while vault/buyback/accrual legs repeat exactly;
  second sell reprices by exactly 1 (180,212 -> 180,211).
- Sweep-first multi-hop trades are price-neutral in their
  token legs: both sweeps before the 10^9 buy or the 10^9
  sell leave every token delta equal to the fresh anchor's
  (the raw events differ in the words that record pool
  state). Only that one size per side was measured.
- Protocol sweep output is not collected by
  collect_coin_creator_fee: after v2 loops (3rd #10) and
  after the multi-hop loops here, the collect following a
  protocol sweep was a silent no-op in every case measured.
- The pool's protocol bucket is the running sum across
  loops (buy loop 9,187,674; sell loop 4,186 before the
  protocol sweep); only the creator bucket is swept, so the
  collect drains the vault ATA, never the pool.

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only; no
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
- Multi-hop trade events are asserted by discriminator and
  length only (buy 508 bytes, sell 449 bytes); their interior
  u64 slots are not decoded into named fields here, unlike
  the sweep/collect events whose amount/bucket/recipient/
  fee slots are pinned.
- Only 1-hop multi-hop routes are chained here; 3-hop and
  5-hop routes (2nd #5/#39) accrue per-hop fees into
  intermediate pools that this packet's sweep/collect keys
  do not address.
- Multi-hop trades under a transfer fee were not chained
  here (multi-hop+tf was a negative result in the hunt);
  this packet covers the no-fee multi-hop -> sweep ->
  collect chain only.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-multi-hop-sweep-collect-chains-20261029/verify.py

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
