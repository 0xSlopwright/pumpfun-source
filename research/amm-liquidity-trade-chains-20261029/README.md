# liquidity quote legs price off available reserves, and the can_boost drift trigger

## Problem

2nd #40 pinned deposit/withdraw rounding in isolation on a fixture
with accrued fees zeroed, so the quote leg always equalled the raw
vault quote; 2nd #38 pinned v2 trade pricing as accrued-blind on a
patched pool; 2nd #19 pinned dual transfer fees at one LP amount.
No packet ever chained liquidity and trades on the as-is fixture,
so three questions were open: do deposit/withdraw quote legs price
off the raw vault quote, the available quote (raw minus accrued
fees), or the effective quote (raw plus virtual reserves)? Does a
deposit move a later trade's price, and does a trade move a later
withdraw's payout? And what actually arms the deposit/withdraw
virtual-reserve update that 2nd #40 called the "boost" drift -- a
boost vault, or something in the pool fields alone? This packet
answers all three with single-step anchors and multi-step chains,
one signed transaction per step, on three program images
(original, #424 control, #427 candidate).

## Fixture

Per case, fresh VM per image: the repository liquidity fixture --
base vault 673,696,395,912,745, quote vault 122,946,690,720, LP
supply 4,194,352,106,721, pool protocol_fees 2,488, creator_fees
123,394 (total accrued 125,882), virtual_quote_reserves -125,882,
so on the as-is fixture available (raw - accrued) and effective
(raw + vq) coincide at 122,946,564,838. User base/quote funded
10^15, user LP funded half the supply, LP mint supply equals pool
supply, disable_flags 0, clock slot 100 / timestamp 1234567890.
Family D patches pool fields per case (vq, protocol_fees,
creator_fees) to separate the reserve definitions. Fee payer is
PAYER for every step: deposit/withdraw steps cost 5,000, the first
trade step in a case costs 1,849,400 (volume rent 1,844,400 + fee
5,000), later trade steps cost 5,000.

Event layouts (offsets as read from the receipts; verify.py decodes
only the discriminator, length, deposit/withdraw base and quote
legs, and the buy/sell curve / fee / user fields -- the other
offsets below are informational):
- DepositEvent / WithdrawEvent, 264 bytes, disc `78f83d531f8e6b90` /
  `1609851aa02c47c0`: timestamp @8, LP amount @16, limits @24/@32,
  user reserves @40/@48, pool reserves @56/@64, base leg @72,
  quote leg @80, LP supply @88.
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`: curve @64,
  lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96,
  quote_with_lp @104, user_quote_in @112.
- SellEvent (v2), 449 bytes, disc `3e2f370aa503dc2a`: curve @64,
  lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96,
  quote @104, user_quote_out @112.

## Cases (29 cases, 41 steps per image, 123 receipts)

Family A -- anchors, as-is fixture:
- `a-dep-1e9`: deposit 10^9 LP: user -160,619,895,224 base /
  -29,312,410 quote, vault +160,619,895,224 / +29,312,410, LP
  +10^9, supply 4,195,352,106,721. The quote leg is 30 less than
  2nd #40's zeroed-accrued fixture (29,312,440): it is
  ceil(10^9 * available / supply), available = raw - accrued.
- `a-wd-1e9`: withdraw 10^9 LP: user +160,619,895,223 /
  +29,312,409 (floor both legs), supply 4,193,352,106,721.
- `a-buy-1e6`: buy_v2 10^6: spend 187, vault +186, buyback +1,
  pool (vq -125,884, pf 2,489, cf 123,395), event (curve 183, lp 1,
  protocol 2, quote_with_lp 184, user_in 187).
- `a-sell-1e6`: sell_v2 10^6: user +178, vault -179, buyback +1,
  pool (vq -125,884, pf 2,489, cf 123,395), event (curve 182, lp 1,
  protocol 2, quote 181, user_out 178).
- `a-buy-1e10`: buy_v2 10^10: spend 1,847,796, vault +1,839,310,
  buyback +8,486, pool (vq -139,844, pf 10,975, cf 128,869), event
  (curve 1,824,983, lp 365, protocol 16,973, quote_with_lp
  1,825,348, user_in 1,847,796).
- `a-sell-1e10`: sell_v2 10^10: user +1,802,115, vault -1,810,601,
  buyback +8,486, pool (vq -139,843, pf 10,974, cf 128,869), event
  (curve 1,824,927, lp 365, protocol 16,972, quote 1,824,562,
  user_out 1,802,115).
- `a-dep-1e12`: deposit 10^12 LP: user -160,619,895,223,680 /
  -29,312,409,095, supply 5,194,352,106,721. Note the base leg is
  NOT 1000x the 10^9 leg (160,619,895,224,000): the ceil ratio at
  scale is 160,619,895,223,680.
- `a-wd-1e12`: withdraw 10^12 LP: user +160,619,895,223,679 /
  +29,312,409,094, supply 3,194,352,106,721.

Family B -- chains:
- `b-dep-buy-1e6` / `b-dep-sell-1e6`: a 10^9 LP deposit leaves a
  10^6 trade identical to its anchor in every measured token leg,
  every decoded event field, and the pool fee accruals (buy 187,
  sell 178). The raw trade events are NOT byte-identical: the
  reserve words @32..64 differ because the deposit enlarged the
  vaults.
- `b-dep12-buy-1e10`: after a 10^12 LP deposit (+24% vaults), buy
  10^10 spends 1,847,790 -- 6 less than the anchor -- vault
  +1,839,304, buyback +8,486, pool accruals identical to the
  anchor (vq -139,844, pf 10,975, cf 128,869), event curve
  1,824,977 (anchor 1,824,983).
- `b-dep12-sell-1e10`: after a 10^12 LP deposit, sell 10^10 pays
  1,802,121 -- 6 MORE than the anchor -- vault -1,810,607,
  buyback +8,486, pool accruals identical (vq -139,843, pf
  10,974, cf 128,869), event curve 1,824,933 (anchor 1,824,927).
- `b-buy-wd`: buy 10^10, then withdraw 10^9: the withdraw returns
  base 160,617,511,065 (2,384,158 less than fresh wd) and quote
  29,312,844 (435 more than fresh wd) -- both legs price off the
  POST-trade vaults and POST-trade accrued (available =
  122,948,530,030 - 139,844 = 122,948,390,186).
- `b-sell-wd`: sell 10^10, then withdraw 10^9: base 160,622,279,382
  (2,384,159 more than fresh wd), quote 29,311,974 (435 less;
  available = 122,944,880,119 - 139,843 = 122,944,740,276).
- `b-roundtrip-small`: dep-1e9 -> buy-1e6 -> sell-1e6 -> wd-1e9.
  Net user base -1, quote -10; vault base +1, quote +8; buyback
  +2; payer fees -1,864,400 (5,000 + 1,849,400 + 5,000 + 5,000);
  pool ends (vq -125,886, pf 2,490, cf 123,396, supply restored).
  The 10 quote lost by the user is exactly the 8 left in the
  vault plus the 2 paid to buyback.
- `b-roundtrip-1e9` / `b-roundtrip-1e12`: deposit then withdraw
  the same LP loses exactly 1 base + 1 quote (ceil in, floor
  out) at both scales, vaults gaining the 1/1.

Family C -- limit gates pin the available basis:
- `c-dep-maxquote-low`: dep-1e9 with maxquote 29,312,409 -> 6004
  ExceededSlippage (deposit.rs:100 original), full rollback.
- `c-dep-maxquote-exact`: maxquote 29,312,410 -> success.
- `c-wd-minquote-high`: wd-1e9 with minquote 29,312,410 -> 6004
  (withdraw.rs:107 original), full rollback.
- `c-wd-minquote-exact`: minquote 29,312,409 -> success.

Family D -- reserve-definition separation (pool patches):
- `d-vq0-dep`: vq patched to 0, accrued kept: dep-1e9 quote is
  STILL 29,312,410 -- vq is never consulted by the liquidity quote
  legs -- but vq drifts 0 -> +30 (floor of
  125,882 * 10^9 / supply, the can_boost branch firing on
  vq + accrued = 125,882 != 0).
- `d-vq0-wd`: vq 0, wd-1e9 quote still 29,312,409, vq drifts
  0 -> -31 (ceil of the same ratio).
- `d-vq1e9-dep`: vq 10^9, dep-1e9 quote still 29,312,410, vq
  drifts +238,445 (floor of (10^9 + 125,882) * 10^9 / supply).
- `d-vq0-roundtrip`: vq 0, dep-1e9 -> wd-1e9: vq 0 -> 30 -> -1,
  the same -1 floor/ceil round-trip drift 2nd #40 measured on a
  boost pool, here with no boost vault at all -- only accrued
  fees arming the branch.
- `d-vq0-buy` / `d-vq0-sell`: vq 0, trade pricing DOES consult vq
  (effective = raw + vq = raw): buy-1e10 spends 1,847,798 (+2 vs
  as-is), vault +1,839,312, pool (vq -13,962, pf 10,975,
  cf 128,869); sell-1e10 pays 1,802,117 (+2), vault -1,810,603,
  pool (vq -13,961, pf 10,974, cf 128,869). Fee accruals are
  identical to the as-is trades; only the curve moves.
- `d-negvq-acc0-dep` / `d-negvq-acc0-wd`: accrued zeroed with vq
  -125,882 left: dep and wd both fail 6023 Overflow
  (deposit.rs:152 / withdraw.rs:160 original; rebuilt lines in
  the report's error_sites), full rollback, payer -5,000 only.
  can_boost is true (vq + accrued = -125,882 != 0) but the
  virtual sum is negative; the Overflow site is consistent with a
  checked unsigned conversion of that sum failing (an inference
  from the site line, not observed directly). The as-is fixture escapes this only
  because vq + accrued is exactly 0.

## Result

- Liquidity quote legs use available reserves (raw - accrued),
  never virtual reserves: vq patches of 0 / +10^9 leave dep/wd
  legs and their raw Deposit/Withdraw events unchanged, while the limit gates pin the
  available value to the unit (29,312,410 / 29,312,409).
- Trade pricing uses effective reserves (raw + vq): the same vq
  patch that leaves liquidity untouched moves a 10^10 trade by
  exactly 2 quote units. The two reserve definitions coincide
  only when vq = -accrued, which is exactly the as-is fixture.
- The deposit/withdraw virtual update is armed by
  `total_virtual_quote_reserves() = vq + accrued != 0`, not by
  any boost state: deposit adds floor((vq + accrued) * lp / supply),
  withdraw subtracts ceil((vq + accrued) * lp / supply), so a
  round trip drifts vq by -1; a negative sum fails both paths
  with 6023.
- Deposit does not move small trades at all and moves a 10^10
  trade by 6 quote units after a 24% vault enlargement, with
  pool fee accruals unchanged; a trade moves a later withdraw
  by exactly the post-trade vault/accrued arithmetic.
- Deposit/withdraw never change vq on the as-is fixture (the
  branch is disarmed by vq + accrued = 0) and never change the
  volume accumulator; trades never change lp_supply.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only. No
  source change, no SBPF build, no whole-program equivalence
  claim. Numbers are exact for this fixture state (base vault
  673,696,395,912,745, quote vault 122,946,690,720, LP supply
  4,194,352,106,721, accrued 125,882, vq -125,882, fee table lp 2
  / protocol 93 / creator 30 bps, buyback 5000 bps), not claims
  about other pool states.
- Error sites are per-image: the original and rebuilt sources
  differ in line numbers, so `verify.py` checks each image's
  recorded site line against that image's own logs and never
  compares sites across images (2nd #36 lesson). The README
  cites original-image sites.
- The available-vs-effective separation is stated for the
  deposit/withdraw handlers (`liquidity_quote_reserves` ->
  `available_quote_reserves`) and the v2 trade curve
  (`effective_quote_reserves`); legacy buy/sell curve paths
  were not re-chained here.
- The buyback ATA lamport balance moves 1:1 with its token
  balance (native wSOL account); only token deltas are asserted
  for it.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-liquidity-trade-chains-20261029/verify.py

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

