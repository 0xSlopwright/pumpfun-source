# sweep leaves deposit, withdraw and legacy-buy prices unchanged

## Problem

Two earlier packets invite a wrong inference when combined. 3rd #3
pinned deposit/withdraw quote legs to AVAILABLE reserves (raw vault
quote minus accrued fees), and 3rd #4 pinned v2 trade prices to
EFFECTIVE reserves (raw vault quote plus virtual quote reserves) and
showed a sweep leaves v2 trade legs and decoded event fields
unchanged. But neither packet
chained a sweep into deposit, withdraw, or legacy buy -- and 3rd #3's
Limits explicitly left the legacy buy/sell curve paths unchained.
So the open question was concrete: 3rd #3's available formula says a
deposit leg is ceil(LP * (raw - accrued) / supply). Sweeping both
buckets zeroes accrued, so a naive reading predicts the leg must rise
to the raw vault quote -- dep-1e9 from 29,312,410 to 29,312,440.
This packet tests that prediction directly, with sweeps chained into
deposit, withdraw, and legacy buy, plus limit gates that pin the
post-sweep available value to the unit, on three program images
(original, #424 control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. On the as-is fixture, available
(raw - accrued) and effective (raw + vq) coincide at
122,946,564,838. Fee payer is PAYER for every step: a sweep to a
fresh ATA costs 2,044,280 (fee 5,000 + ATA rent 2,039,280); in the
legacy variant the recipient ATAs pre-exist with 0 tokens, so each
sweep costs only 5,000. Deposit/withdraw steps cost 5,000; the first
trade step in a case costs 1,849,400 (volume rent 1,844,400 + fee
5,000).

Event layouts (offsets as read from the receipts; verify.py decodes
only the fields named below plus the v2 buy/sell curve / fee / user
fields; for the legacy buy event it checks only disc and length):
- DepositEvent / WithdrawEvent, 264 bytes, disc `78f83d531f8e6b90` /
  `1609851aa02c47c0`: base leg @72, quote leg @80.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0 protocol,
  1 creator).
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`; SellEvent (v2),
  449 bytes, disc `3e2f370aa503dc2a`; legacy BuyEvent shares the v2
  buy disc but is 497 bytes.

## Cases (25 cases, 64 steps per image, 192 receipts)

Family A -- fresh anchors (3rd #3 values, re-measured here):
- `a-dep-1e9`: deposit 10^9 LP: user -160,619,895,224 base /
  -29,312,410 quote, LP +10^9, supply 4,195,352,106,721.
- `a-wd-1e9`: withdraw 10^9 LP: user +160,619,895,223 /
  +29,312,409, supply 4,193,352,106,721.
- `a-dep-1e12`: deposit 10^12 LP: -160,619,895,223,680 /
  -29,312,409,095, supply 5,194,352,106,721.
- `a-wd-1e12`: withdraw 10^12 LP: +160,619,895,223,679 /
  +29,312,409,094, supply 3,194,352,106,721.

Family S -- sweep -> deposit (legs identical to anchors at both
scales; the deposit never moves vq):
- `s-both-dep-1e9`: both sweeps, then dep-1e9: quote STILL
  29,312,410, base STILL 160,619,895,224, pool (vq 0, pf 0, cf 0).
- `s-creator-dep-1e9`: creator sweep only, then dep-1e9: quote
  STILL 29,312,410, pool (vq -2,488, pf 2,488, cf 0).
- `s-proto-dep-1e9`: protocol sweep only, then dep-1e9: quote
  STILL 29,312,410, pool (vq -123,394, pf 0, cf 123,394).
- `s-both-dep-1e12` / `s-creator-dep-1e12` / `s-proto-dep-1e12`:
  dep-1e12 quote STILL 29,312,409,095 and base STILL
  160,619,895,223,680 after every sweep combination. Partial sweeps
  move the leg by nothing: the leg tracks neither bucket.

Family W -- sweep -> withdraw (legs identical to anchors):
- `w-both-wd-1e9`: both sweeps, then wd-1e9: quote STILL
  29,312,409, base STILL 160,619,895,223.
- `w-creator-wd-1e9` / `w-proto-wd-1e9`: same legs after each
  single sweep.
- `w-both-wd-1e12`: both sweeps, then wd-1e12: quote STILL
  29,312,409,094, base STILL 160,619,895,223,679.

Family L -- limit gates pin the post-sweep available to the unit
(all after both sweeps, so accrued is 0 and the vault is drained):
- `l-both-dep-maxquote-low`: dep-1e9 with maxquote 29,312,409 ->
  6004 ExceededSlippage, full rollback. If available had risen to
  the raw vault quote, the leg would be 29,312,440 and this gate
  would be far too lax to bind -- it binds at the old value.
- `l-both-dep-maxquote-exact`: maxquote 29,312,410 -> success.
- `l-both-wd-minquote-high`: wd-1e9 with minquote 29,312,410 ->
  6004, full rollback.
- `l-both-wd-minquote-exact`: minquote 29,312,409 -> success.
  Post-sweep available is still 122,946,564,838, not the raw
  122,946,690,720.

Family R -- round trips with a sweep in the middle:
- `r-dep-sweep-wd`: dep-1e9 -> both sweeps -> wd-1e9: net user
  base -1, quote -1 -- exactly 3rd #3's sweep-free round trip.
  The sweep changes the round-trip accounting by nothing.
- `r-dep-sweep-sweep`: dep-1e9 -> both sweeps -> both sweeps
  again: the second sweeps are silent no-ops (0 events, "Nothing
  to sweep", payer 5,000 each). A deposit accrues nothing.
- `r-buy-sweep-wd`: buy-1e10 -> both sweeps -> wd-1e9: the
  withdraw returns base 160,617,511,065 / quote 29,312,844 --
  exactly 3rd #3's b-buy-wd legs, which priced off post-trade
  vaults and post-trade accrued. The sweep in the middle moved
  neither leg.

Family T -- trade control arms (3rd #4's result, re-measured):
- `t-both-buy-1e10`: both sweeps, then buy-1e10: spend 1,847,796,
  vault +1,839,310, buyback 8,486, pool (vq -13,962, pf 8,487,
  cf 5,475) -- the same legs and decoded event fields as 3rd #4's
  fresh anchor (the raw event bytes differ in reserve words).
- `t-both-sell-1e10`: both sweeps, then sell-1e10: user
  +1,802,115, vault -1,810,601, buyback 8,486, pool (vq -13,961,
  pf 8,486, cf 5,475) -- the same legs and decoded event fields
  as 3rd #4's fresh anchor (the raw event bytes differ in reserve
  words).

Family G -- legacy buy after a sweep (legacy variant, recipient
ATAs pre-exist so sweeps cost 5,000):
- `g-both-lbuy`: both sweeps, then legacy buy 10^10: spend
  1,847,796, vault quote +1,825,348, protocol 8,487, creator
  5,475, buyback 8,486, pool fields untouched -- identical to the
  as-is legacy buy (3rd #4 family D).
- `g-creator-lbuy`: creator sweep only, then legacy buy 10^10:
  identical legs again. The legacy curve prices off a
  sweep-invariant reserve, the same conclusion 3rd #4 drew for v2.

## Result

- A sweep is a pure relabeling for every downstream price measured
  here (deposit, withdraw, v2 buy/sell, legacy buy; legacy sell is
  not covered -- see Limits). One
  sweep step performs three moves in lockstep: it debits the pool
  accrual by A, credits virtual quote reserves by A, and drains
  the quote vault by A. Both reserve definitions are therefore
  invariant: available = (raw - A) - (accrued - A) = raw - accrued,
  and effective = (raw - A) + (vq + A) = raw + vq. Since deposit /
  withdraw price off available and trades (v2, and legacy buy) price
  off a sweep-invariant reserve, no downstream leg moves -- at
  either scale, after either partial sweep, or after both.
- The sharp form of the claim is the limit-gate family: after both
  sweeps, accrued is 0 but available is NOT the raw vault quote.
  Reading available off post-sweep pool fields alone (vault
  balance 122,946,690,720, accrued 0) predicts a dep-1e9 leg of
  29,312,440 -- wrong by 30, because the vault balance itself
  moved. The correct post-sweep available is 122,946,564,838.
- The deposit/withdraw virtual update stays disarmed across
  sweeps: a sweep preserves vq + accrued = 0 exactly, so no dep/wd
  step in this packet moves vq -- the contrast to 3rd #3 family D,
  where a patched vq + accrued != 0 drifted vq by +30 (deposit)
  and -31 (withdraw).
- Deposits accrue nothing: a second sweep after a deposit is a
  silent no-op, and round-trip accounting is identical with or
  without a sweep in the middle.

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole program
  equivalence claim.
- All amounts, error codes, and site lines are exact values for
  this fixture state, not claims about other pool states. Error
  site line numbers differ between the original and the rebuilt
  images; verify.py checks each image's recorded site line
  against that image's own logs and never compares site lines
  across images (2nd #36 lesson). The README cites error codes,
  which agree across images.
- Legacy SELL after a sweep was not chained here (only legacy
  buy); the legacy-sell curve's sweep behavior remains open.
- Sweep -> deposit/withdraw under a transfer fee was not executed
  here; the same lockstep arithmetic suggests the same invariance,
  but it is not measured in this packet.
- The legacy-variant recipient ATAs are pre-created with 0 tokens
  (as in 3rd #4 family D), so legacy-family sweeps cost 5,000
  rather than the fresh-ATA 2,044,280; token legs are unaffected.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-sweep-liquidity-legacy-neutrality-20261029/verify.py

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

