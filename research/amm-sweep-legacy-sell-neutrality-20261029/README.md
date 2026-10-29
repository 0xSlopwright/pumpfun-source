# sweep leaves legacy sell prices unchanged

## Problem

3rd #6 chained sweeps into deposit, withdraw, and legacy buy and
showed a sweep is a pure relabeling for those downstream prices: it
debits the pool accrual by A, credits virtual quote reserves by A,
and drains the quote vault by A, so both available (raw - accrued)
and effective (raw + vq) are invariant. But 3rd #6's Limits
explicitly left legacy sell unchained -- and legacy sell is the one
path where the invariance is not obvious, because it differs from
v2 sell structurally: it transfers its fee legs straight to the
recipient ATAs and leaves the pool accrual fields untouched. That
raises two concrete questions this packet answers on three program
images (original, #424 control, #427 candidate): does a sweep
before a legacy sell leave its legs unchanged, and does a
legacy sell accrue anything for a later sweep to move?

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. The legacy variant pre-creates the protocol
and creator recipient ATAs with 0 tokens, so each sweep costs only
the 5,000 fee (as in 3rd #6 family G); a legacy sell step also costs
5,000 and creates no volume account. Legacy sell uses the `sell`
instruction (21 keys + remaining [pool-v2 PDA, buyback owner,
buyback dest]) with arguments (amount, minquote).

Event layouts (offsets as read from the receipts; verify.py decodes
only the fields named below, and for the second sell of the R
chains only quote and user output):
- SellEvent (legacy, shares the v2 sell disc), 449 bytes, disc
  `3e2f370aa503dc2a`: curve @64, lp_bps @72, lp_fee @80,
  protocol_bps @88, protocol_fee @96 (GROSS: net protocol 849 +
  buyback 849 = 1,698 for sell 10^9, as 2nd #44 pinned), quote
  @104, user output @112.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).

## Cases (14 cases, 34 steps per image, 102 receipts)

Family A -- fresh anchors:
- `a-lsell-1e9`: sell 10^9: user +180,212, vault base +10^9,
  vault quote -182,458, protocol 849, creator 548, buyback 849,
  pool (-125,882, 2,488, 123,394) unchanged. Event: curve
  182,495, lp 37, protocol gross 1,698, quote 182,458, out
  180,212.
- `a-lsell-1e10`: sell 10^10: user +1,802,115, vault
  -1,824,562, protocol 8,486, creator 5,475, buyback 8,486.
  Event: curve 1,824,927, lp 365, protocol gross 16,972, quote
  1,824,562, out 1,802,115.
- `a-lsell-1e6`: sell 10^6: user +178, vault -181, protocol 1,
  creator 1, buyback 1. Event: curve 182, lp 1, protocol gross
  2, quote 181, out 178.

Family S -- sweep -> sell (legs identical to anchors at every
scale; the sell never moves the pool fields):
- `s-both-lsell-1e9`: both sweeps, then sell 10^9: legs
  identical to `a-lsell-1e9`, pool (0, 0, 0).
- `s-creator-lsell-1e9`: creator sweep only, then sell 10^9:
  identical legs, pool (-2,488, 2,488, 0).
- `s-proto-lsell-1e9`: protocol sweep only, then sell 10^9:
  identical legs, pool (-123,394, 0, 123,394).
- `s-both-lsell-1e10` / `s-both-lsell-1e6`: both sweeps, then
  sell 10^10 / 10^6: legs identical to the matching anchors,
  pool (0, 0, 0). Partial sweeps move the leg by nothing: the
  leg tracks neither bucket.

Family L -- limit gates pin the post-sweep sell price to the unit
(all after both sweeps, so accrued is 0):
- `l-both-lsell-min-plus1`: sell 10^9 with minquote 180,213 ->
  6004 ExceededSlippage, full rollback, 0 events.
- `l-both-lsell-min-exact`: minquote 180,212 -> success with
  the anchor legs. The post-sweep sell price is exactly the
  fresh price, not a repricing off the drained vault.

Family R -- sweep between two sells is transparent:
- `r-sell-sell`: sell 10^9, then sell 10^9 again: the second
  sell pays +180,211 / vault -182,457 (one less than the
  first, because the first sell moved the vaults), legs
  849 / 548 / 849, pool unchanged.
- `r-sell-sweep-sell`: sell 10^9, both sweeps, sell 10^9: the
  second sell has the same legs and decoded event fields as
  `r-sell-sell`'s second sell (+180,211 / -182,457), pool
  (0, 0, 0). The sweep in the
  middle moved nothing -- not the price, not the legs.
- `r-sell-sell-1e10` / `r-sell-sweep-sell-1e10`: sell 10^9,
  then sell 10^10, with and without both sweeps in between:
  the second sell agrees in both cases (+1,802,110 /
  -1,824,557, legs 8,486 / 5,475 / 8,486).

## Result

- A sweep is price-neutral for legacy sell exactly as 3rd #6
  showed for deposit, withdraw, and legacy buy: sweep-first legs
  equal the fresh anchors' legs and decoded event fields at 10^6,
  10^9, and 10^10 (the raw sell events are NOT byte-identical:
  the pool quote reserve word @56 and some trailing words record
  the post-sweep pool state),
  after either partial sweep or both, and the post-sweep limit
  gate binds at the fresh price to the unit.
- Each recorded legacy sell preserves its incoming pool tuple
  (virtual_quote_reserves, protocol_fees, creator_fees): fresh
  anchors retain (-125,882, 2,488, 123,394); sells after both
  sweeps retain (0, 0, 0); sells after only the creator sweep
  retain (-2,488, 2,488, 0); and sells after only the protocol
  sweep retain (-123,394, 0, 123,394). The fee legs go straight
  to the recipient ATAs. With no preceding sweep, a sweep after
  a legacy sell still finds the original accruals (2,488 / 123,394)
  to move -- the opposite of a v2 trade, which accrues into the
  pool and is then swept (3rd #4).
- The two facts compose: because the sell neither reads the
  accrual buckets for pricing nor writes them, a sweep placed
  anywhere around legacy sells -- before, between, or after --
  changes no sell leg. The sell -> sweep -> sell second sell
  equals the sweep-free sell -> sell second sell to the unit,
  at both second-sell scales.

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole program
  equivalence claim.
- All amounts, error codes, and site lines are exact values for
  this fixture state, not claims about other pool states. Error
  site line numbers differ between the original and the rebuilt
  images (6004 at sell.rs:189 on the original); verify.py checks
  each image's recorded site line against that image's own logs
  and never compares site lines across images (2nd #36 lesson).
  The README cites error codes, which agree across images.
- Sweep -> legacy sell under a transfer fee was not executed
  here; the same lockstep arithmetic suggests the same
  invariance, but it is not measured in this packet.
- The legacy-variant recipient ATAs are pre-created with 0 tokens
  (as in 3rd #6 family G), so legacy-family sweeps cost 5,000
  rather than the fresh-ATA 2,044,280; token legs are unaffected.
- Legacy sell on a cashback or mayhem pool was not chained here;
  the mode gates for legacy sell were pinned in 2nd #44, and this
  packet covers the sweep dimension only.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-sweep-legacy-sell-neutrality-20261029/verify.py

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

