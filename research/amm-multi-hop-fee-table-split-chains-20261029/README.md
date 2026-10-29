# research: multi-hop fee-table split — hop 1 follows fee-tier cap selection, the tail creator accrual tracks the exotic flat fees

## Problem

`multi_hop_swap` executes each hop through the AMM's internal swap,
and each hop reads a fee table. Earlier packets pinned each half in
isolation but never asked whether the hops share one table:

- 3rd #16/#25/#26/#29 pinned multi-hop routing, buckets, and mode
  gates with the DEFAULT fee config: hop 1 accrues protocol only,
  the tail hop accrues the creator bucket (buy 10^9: tail creator
  +2,671,742,901).
- 3rd #35/#36 pinned v2 fee-tier selection: the tier is a function
  of the live cap (`cap = base_mint_supply * effective_quote /
  vault_base`, last tier whose threshold is `<= cap`, inclusive),
  and a chain crosses thresholds mid-sequence.

Questions this packet addresses: does hop 1 of a multi-hop route
follow the same cap-based tier selection as a v2 trade, and does
it cross mid-chain when the main cap moves? Does the tail hop
follow the fee tiers too, the stable tiers, or something else?
What happens to the tail fee when feeconfig is rebuilt with
fee_tiers only (stable and exotic zeroed, as the 3rd #35/#36
builders did)? And does the stable-count field itself matter?

## Cases

15 cases, 52 steps, 156 receipts (each step run on the original,
control (#424), and candidate (#427) images). All amounts are
token amounts unless noted. Pool state is
(virtual_quote_reserves i128, protocol_fees, creator_fees,
lp_supply). The fixture pools are main (-125,882, 2,488, 123,394,
4,194,352,106,721), POOL2 (-125,882, 2,488, 123,394, same supply),
P3 (-125,882, 2,488, 123,394, same supply). The main pool's
starting cap is exactly 182,350,153,971. The custom tiers are
A = (lp 10, protocol 111, creator 333), B = (lp 20, protocol
222, creator 444) and C = (lp 30, protocol 333, creator 555); feeconfig is patched in place (tiers replaced,
stable and exotic sections preserved) unless a case says
otherwise. The default exotic flat fees are (lp 20, protocol 5,
creator 5); the default flat fees are (25, 5, 0).

Family A -- hop-1 tier crossing inside a multi-hop chain:

- `a-buy-cross-swc`: tiers [(100, A), (cap0 + 10^9, B)]. buy1 pays
  A (out 5,305,797,837,698, buyback 5,489,071, main protocol
  5,491,560); buy2 pays B (out 5,058,267,896,137, buyback
  10,858,932, main protocol 16,350,492). One multi-hop buy moves
  the main cap by ~2.9B (vs ~5.4M per v2 buy in 3rd #35/#36;
  that figure is not re-measured here), so the threshold
  sits between the two chain caps. The full sweep-all drains
  exactly: tail creator 5,236,452,906, tail protocol 2,488,
  P2 creator 123,394, P2 protocol 2,488, main creator 123,394,
  main protocol 16,350,492.
- `a-buy-cross-exact`: threshold set exactly to the post-buy1 cap
  (185,295,721,063). buy2 still pays B (buyback 10,858,932) --
  the inclusive boundary holds for the multi-hop hop-1 selector
  too.
- `a-buy-cross-loop`: buy A, buy B, buy B (third out
  4,879,443,310,227, buyback 10,858,932, main protocol
  27,209,424); tail sweep/collect drain 7,739,937,932.
- `a-sell-cross`: threshold set midway between cap0 and the
  post-sell1 cap. sell1 pays B (receipt 177,996, buyback 2,021,
  tail creator 623,394); sell2 pays A (receipt 180,016, buyback
  1,010, tail creator 1,123,393). Tail sweep/collect drain
  1,123,393.
- `a-sell-cross-exact`: threshold set exactly to the post-sell1
  cap (182,349,613,986). sell2 still pays B (receipt 177,995,
  buyback 2,021) -- inclusive on the sell side too.
- `a-buy-cross-sell-stays-B`: buy A, buy B, then two sells. Both
  sells still pay B (buyback 2,175 each, receipts 191,613 /
  191,612): after the buy crossing the cap is far above the
  threshold, and one 10^9 sell moves the cap only ~540k, so the
  tier does not flip back within two sells.

Family B -- the tail hop follows the exotic flat fees, not the
tiers (all cases: one 10^9 buy, then tail sweep/collect):

- `b-default-tail`: default config. Out 5,315,084,721,958,
  buyback 4,607,153, tail creator 2,671,866,295 (seed 123,394 +
  accrual 2,671,742,901); sweep/collect drain 2,671,866,295.
- `b-exotic-zero`: exotic flat set to (0, 0, 0). Out
  5,315,084,721,959 (one more than default), tail creator stays
  at the seed 123,394; sweep/collect drain only 123,394. The
  creator accrual disappears but the user's tail output moves by
  only 1, so zeroing the whole exotic row did not remove a
  ~30 bps lp+protocol load from the output (compare
  `b-exotic-lp-proto`, where raising lp/protocol to (50, 10)
  cuts the output by ~13.2B). One reading consistent with this,
  not tested here, is that an all-zero exotic row falls back to
  a row with the same lp+protocol total (the flat fees
  (25, 5, 0) also total 30 bps); no mechanism is asserted.
- `b-exotic-creator333`: exotic flat set to (25, 5, 333). Out
  5,145,088,892,634, tail creator 172,217,658,022 (seed +
  172,217,534,628); sweep/collect drain the full amount. The
  tail accrual scales with the exotic creator parameter (no
  tier was changed in this case). 333 bps of this case's tail
  output would be ~171.3B, and of the default tail output
  ~177.0B; the observed 172.2B lies between them, and the exact
  rounding path is not pinned.
- `b-exotic-lp-proto`: exotic flat set to (50, 10, 0). Out
  5,301,933,218,234, tail creator stays at the seed 123,394:
  the lp/proto legs move the output while the zero creator leg
  leaves the bucket empty.
- `b-stable-allA` / `b-stable-allC`: all 25 stable tiers replaced
  with A (resp. C). Same transactions, logs and raw event bytes
  as `b-default-tail` (out 5,315,084,721,958, tail creator
  2,671,866,295); only the patched feeconfig account differs.
  Rewriting the stable tier rows did not change the tail hop
  in this fixture. (`b-stable-allC` runs the buy only.)
- `b-tiers-allA`: all 25 fee tiers replaced with A. Out
  5,305,797,837,698 (the hop-1 tier-A legs), tail creator
  2,667,173,140 (seed + 2,667,049,746). The tail accrual as a
  share of tail output is 2,667,049,746 / 5,305,797,837,698
  vs default 2,671,742,901 / 5,315,084,721,958 -- both about
  0.0503%, close to the exotic flat creator rate of 5 bps and
  far from the tier creator rate (333 bps would be ~66x
  larger). Replacing the tiers changed hop 1's legs; the tail
  creator rate stayed at about the same share.
- `b-stable-count0`: only the stable count field patched to 0
  (exotic untouched). Out 5,327,241,861,485, tail creator
  1,071,278,067 (seed + 1,071,154,673) -- neither the default
  nor zero. The count field itself feeds the tail fee path
  somehow; the mechanism is recorded as observed only.
- `b-tiers-rebuild-only`: feeconfig rebuilt with fee_tiers only
  [(100, A)] and stable + exotic zeroed (the 3rd #35/#36 builder
  shape). Out 5,305,797,837,699, tail creator stays at the seed
  123,394: rebuilding the config with tiers only silently
  zeroes the tail fee. A reimplementation that copies only the
  tier table does not reproduce the tail creator accrual.

## Result

- In every case measured, hop 1 of a multi-hop route paid the
  tier that the v2 cap rule selects: inclusive at the
  threshold, crossing up on buys and down on sells inside one
  chain, and staying on the upper tier across a buy-to-sell
  direction change while the cap stayed above the threshold.
  The tier is inferred from the buyback and pool protocol legs
  (B's ~2x A's); this packet does not recompute the cap from
  each receipt.
- The tail hop's creator accrual tracks the exotic flat-fee
  creator parameter, not the fee tiers or the stable tier rows:
  about 0.0503% of tail output under exotic creator 5, the
  seed only under exotic creator 0, ~64x under exotic creator
  333, unchanged when all fee tiers become A, and identical
  logs and events when all stable rows are rewritten. It is not
  the whole story: patching only the stable count to 0 (exotic
  untouched) changes the accrual to 1,071,154,673, and zeroing
  the whole exotic row leaves the tail output within 1 of the
  default (see `b-exotic-zero`).
- The feeconfig rebuild trap: a config with only fee_tiers
  (stable + exotic zeroed) gave hop 1 the same legs as
  `b-tiers-allA` and left the tail creator bucket at the seed.
- No original-vs-rebuilt divergence: all 15 cases agree across
  the original, control (#424), and candidate (#427) images
  (step, error, raw event bytes, and before/after snapshots
  with fee-payer lamports zeroed). No step in this packet
  fails, so no error path is compared.
- Every sweep/collect measured drained its bucket exactly: all
  six buckets in `a-buy-cross-swc` (tail creator, tail
  protocol, P2 buckets, main buckets) and the tail creator
  bucket in the other sweep cases, including the mixed two-tier main
  protocol bucket (16,350,492) and the exotic-driven tail
  bucket (172,217,658,022).

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-multi-hop-fee-table-split-chains-20261029/verify.py

`verify.py` needs only `solders` plus files in the repository:
this packet, `evidence/original/pump_amm/deployed.so`, and the
two retained rebuilt images
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
(control, #424) and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(candidate, #427), whose decompressed sha256 values match the
`images` block of `runtime/report.json.gz`. It re-checks the
recorded receipts; it does not re-execute any transaction. It
checks:

- MANIFEST.json lists every packet file with a matching sha256.
- runtime/report.json.gz: 15 cases, 156 receipts, 16 parts
  (15x10 + 6), part sha256/byte counts match the part files.
- Every receipt transaction parses (solders) and all signatures
  verify.
- Every receipt's recorded before/after snapshots reproduce the
  report's expected values: fee-payer lamport deltas, the
  token-leg deltas (every watched token account not listed
  moves by 0), the three pool states, volume accumulator
  state, and decoded event fields (multi-hop events by
  discriminator and length only).
- No step fails or is a silent no-op.
- The observed surface of every case (step, error, raw event
  bytes, snapshots with fee-payer lamports zeroed) is identical
  across the original, control, and candidate images.
- The three program images hash to the values recorded in the
  report.

The tier each trade paid and the cap values quoted above come
from the producer's setup and the buyback/protocol legs; verify.py
does not recompute the live cap.

`producer.py` is the script that generated the receipts and the
report and is kept as a provenance record. It is not runnable as
committed: it hard-codes a private workspace layout
(`~/workspace/pumpfun-sparse` for the harness scripts and
`~/workspace/slop-verify` for the control/candidate `.so` files)
and chdirs there on start. It does not write MANIFEST.json (it
prints a reminder to regenerate it); the manifest was sealed
separately.

## Limits

- The feeconfig patches are applied at setup: in-place tier,
  stable, exotic, and count patches preserve the rest of the
  config bytes; the rebuild case rewrites the config in the
  3rd #35/#36 shape (flat fees (25, 5, 0), tier count, tiers,
  stable count 0, padding to 4097 bytes).
- The stable-count-0 effect on the tail fee is recorded as
  observed behavior only: no mechanism is asserted for how the
  count field feeds the tail fee path.
- The tail fee rate is reported as an observed ratio (about
  0.0503% of tail output under the default exotic creator
  parameter 5), not as a claimed formula: the exact rounding
  path through the curve feedback is not pinned here.
- The intermediate (P2) hop accrues nothing in any case, as in
  3rd #16: only hop 1 accrues protocol and only the tail hop
  accrues creator.
- No source change is proposed: this packet pins behavior only.
