# Liquidity at small amounts: ceil-in, floor-out, virtual drift, SeedLock, zero supply

## Problem

The 1st-run extremes packet pinned liquidity at the top end:
huge deposits (10^17 LP), the 2e17 Truncation ceiling, and the
full drain leaving exactly the 125,882 owed fees in the vault.
The small end was never measured, and it is where deposit and
withdraw disagree by construction: deposit computes its amounts
with `ceil_div` (`instructions/liquidity/deposit.rs`) while
withdraw computes them with the floor ratio
`liquidity_floor_ratio` (`curve/constant_product.rs`). The same
asymmetry repeats in the boost virtual-reserve update: deposit
divides with floor, withdraw with `ceil_div`. On top of that,
withdraw carries two gates deposit never sees: the SeedLock
check (`lp_supply >= lp_mint.supply`) and, at zero supply, a
division by zero at a different site per path.

## Cases

30 fresh-VM triples (original / #424 control / #427 candidate),
90 signed executions on the repository's own liquidity harness
(`scripts/pump_amm_liquidity_differential.py`). The clock is slot
100, epoch 0. Accrued protocol/creator fees are zeroed in every
case, so the quote reserve is the raw vault quote
122,946,690,720 (the owed-fee subtraction itself was pinned by
the extremes packet); base vault 673,696,395,912,745, LP supply
4,194,352,106,721, except where a case patches the pool or the
LP mint supply. `producer.py` regenerated these receipts on the author's machine: it hard-codes `~/workspace/pumpfun-sparse` and reads the control/candidate images from `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control and candidate are the gunzipped in-repo #424/#427 artifacts (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`, sha 7a300434..., and `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`, sha d17a657b...).

### Deposit small bands (ceil)

| Case | User base | User quote | LP | Vault base | Vault quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| dep-zero | 0 | 0 | 0 | 0 | 0 |
| dep-1 | -161 | -1 | +1 | +161 | +1 |
| dep-2 | -322 | -1 | +2 | +322 | +1 |
| dep-3 | -482 | -1 | +3 | +482 | +1 |
| dep-34 | -5,462 | -1 | +34 | +5,462 | +1 |
| dep-35 | -5,622 | -2 | +35 | +5,622 | +2 |
| dep-100 | -16,062 | -3 | +100 | +16,062 | +3 |
| dep-1000 | -160,620 | -30 | +1,000 | +160,620 | +30 |
| dep-1-maxbase-160 | 6004 ExceededSlippage | | | | |
| dep-1-maxquote-0 | 6004 ExceededSlippage | | | | |

Deposit 0 succeeds with all five token deltas and the vq delta equal to 0; it still runs a 0-amount Token-2022 MintTo CPI and emits the deposit event (wd-zero likewise runs a 0-amount Burn and emits its event). The quote leg
stays at 1 all the way through 34 LP and steps to 2 at 35 LP:
ceil(122,946,690,720 x 34 / 4,194,352,106,721) = 1, ceil at 35
= 2. The base leg is ceil(LP x 160.62...): 161, 322, 482 base for 1, 2, 3 LP (dep-1..dep-3), 5,462 at 34 LP and 5,622 at 35 LP.

### Withdraw small bands (floor)

| Case | User base | User quote | LP | Vault base | Vault quote |
| --- | ---: | ---: | ---: | ---: | ---: |
| wd-zero | 0 | 0 | 0 | 0 | 0 |
| wd-1 | +160 | 0 | -1 | -160 | 0 |
| wd-34 | +5,461 | 0 | -34 | -5,461 | 0 |
| wd-35 | +5,621 | +1 | -35 | -5,621 | -1 |
| wd-100 | +16,061 | +2 | -100 | -16,061 | -2 |
| wd-1000 | +160,619 | +29 | -1,000 | -160,619 | -29 |
| wd-35-minbase-5622 | 6004 ExceededSlippage | | | | |
| wd-35-minquote-2 | 6004 ExceededSlippage | | | | |
| wd-1-minquote-1 | 6004 ExceededSlippage | | | | |

Withdraw 1 LP burns the LP and returns 160 base but zero
quote: floor(122,946,690,720 x 1 / 4,194,352,106,721) = 0. The
first positive quote is also at 35 LP, but on the floor side
(34 LP still pays 0 quote). Note wd-100 returns 16,061 base
while dep-100 costs 16,062: the same 100 LP is 1 base cheaper
coming out than going in, and dep-1/wd-1 differ by 1 base and
1 quote — the round-trip dust is exactly the ceil/floor gap.

### Boost virtual-reserve drift (floor in, ceil out)

| Case | Token deltas | vq delta |
| --- | ---: | ---: |
| dep-boost-1 (vq 10^9) | -161 / -1 / +1 | 0 |
| dep-boost-1e9 (vq 10^9) | -160,619,895,224 / -29,312,440 / +10^9 | +238,415 |
| wd-boost-1 (vq 10^9) | +160 / 0 / -1 | -1 |
| wd-boost-1e9 (vq 10^9) | +160,619,895,223 / +29,312,439 / -10^9 | -238,416 |
| wd-boost-vq1-1 (vq 1) | +160 / 0 / -1 | -1 (1 to 0) |
| dep-boost-vqmax-1e9 (vq 2^127-1) | 6023 Overflow | |
| wd-boost-vqmax-1e9 (vq 2^127-1) | 6023 Overflow | |

A 1-LP deposit moves virtual reserves by 0 (floor of
10^9 / 4,194,352,106,721) while a 1-LP withdraw moves them by
-1 (ceil of the same fraction). At 10^9 LP the pair drifts by
-1: deposit adds 238,415, withdraw subtracts 238,416. A vq of 1 is taken to 0 by one 1-LP withdraw (wd-boost-vq1-1). No deposit at vq 1 was executed; the 1-LP deposit at vq 10^9 (dep-boost-1) moved vq by 0. At vq = 2^127-1 both paths fail 6023 Overflow in the
virtual update itself (after the transfers, so the failure
rolls everything back except the 5,000 fee).

### Withdraw-only gates

| Case | Result |
| --- | --- |
| wd-seedlock (mint supply = pool supply + 1) | 6067 SeedLockViolation |
| dep-seedlock (same mint supply) | succeeds: -161 / -1 / +1 |
| dep-supply0 (pool supply 0, mint supply 0) | 6025 DivisionByZero |
| wd-supply0 (pool supply 0, mint supply 0) | 6025 DivisionByZero |

The SeedLock check exists only in withdraw: the identical
mint-supply state deposits fine. Zero supply divides by zero
on both paths but at different sites (deposit in `ceil_div`,
withdraw in the floor ratio) — see the site table below.

All three images agree on every case. `verify.py` rechecks
every receipt independently: signature validity, the user and
vault token deltas and the pool virtual-reserve delta against
the expected values, the error code and log fragment, the
recorded error site, rollback on failures, and agreement
across images. Receipts are stored as parts
(`runtime/raw-transactions-part1..9.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **In every executed deposit/withdraw case, deposit amounts equal ceil and withdraw amounts equal floor of reserve x LP / supply.**
  Quote stays 1 through dep-34 and steps at dep-35; withdraw
  pays 0 quote through wd-34 and first pays at wd-35. The
  100-LP pair differs by exactly 1 base (16,062 in, 16,061
  out); the 1-LP pair differs by 1 base and 1 quote.
- **Withdraw can burn LP for nothing on the quote leg.**
  wd-1 and wd-34 (the only withdraws executed below 35 LP, plus the 1-LP boost withdraws) burn LP and return base only; intermediate amounts 2-33 are not executed; a
  min-quote of 1 on wd-1 fails 6004, so the dust is not
  hidden behind a limit default — it is the computed amount.
- **For the two pinned LP amounts at vq 10^9 (1 LP and 10^9 LP), the single-transaction deposit and withdraw vq deltas sum to -1 (0 vs -1; +238,415 vs -238,416); no deposit-then-withdraw round trip was executed.**
  Deposit floors, withdraw ceils; at 10^9 LP the drift is
  exactly 238,415 in vs 238,416 out, and at 1 LP it is 0 in
  vs -1 out. A vq of 1 is taken to 0 by one 1-LP withdraw (wd-boost-vq1-1).
- **SeedLock is withdraw-only, zero supply is a shared
  division gate at different sites.** Mint supply one above
  pool supply fails withdraw 6067 but deposits fine; pool
  supply 0 fails both paths with 6025.

Error sites (log paths as emitted by each image):

- dep-1-maxbase-160: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:79. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:15. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- dep-1-maxquote-0: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:100. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:23. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:23. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- wd-35-minbase-5622: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:86. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:16. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:16. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- wd-35-minquote-2: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:107. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:24. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:24. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- wd-1-minquote-1: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:107. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:24. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:24. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- dep-boost-vqmax-1e9: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:154. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:49. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/deposit.rs:49. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- wd-boost-vqmax-1e9: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:162. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:49. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:49. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- wd-seedlock: original Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:62. Error Code: SeedLockViolation. Error Number: 6067. Error Message: BOOST: lp_supply must never drop below the circulating LP mint supply.; control Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:6. Error Code: SeedLockViolation. Error Number: 6067. Error Message: BOOST: lp_supply must never drop below the circulating LP mint supply.; candidate Program log: AnchorError thrown in programs/pump-amm/src/instructions/liquidity/withdraw.rs:6. Error Code: SeedLockViolation. Error Number: 6067. Error Message: BOOST: lp_supply must never drop below the circulating LP mint supply.
- dep-supply0: original Program log: AnchorError thrown in programs/pump-amm/src/curve/fees.rs:21. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.; control Program log: AnchorError thrown in programs/pump-amm/src/curve/fees.rs:19. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.; candidate Program log: AnchorError thrown in programs/pump-amm/src/curve/fees.rs:19. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.
- wd-supply0: original Program log: AnchorError thrown in programs/pump-amm/src/curve/constant_product.rs:112. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.; control Program log: AnchorError thrown in programs/pump-amm/src/curve/constant_product.rs:31. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.; candidate Program log: AnchorError thrown in programs/pump-amm/src/curve/constant_product.rs:31. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.

## Limits

- `producer.py` regenerated these receipts on the author's machine: it hard-codes
  `~/workspace/pumpfun-sparse` and reads the control/candidate images from
  `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control
  and candidate are the gunzipped in-repo #424/#427 artifacts
  (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`,
  `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`), which
  `verify.py` reads directly.
- The `scope` text inside `runtime/report.json.gz` says the first positive quote is at 35 LP
  on both sides; the receipts show deposit quote is already 1 at 1 LP and steps to 2 at 35 LP,
  while withdraw quote first becomes positive (1) at 35 LP. The receipts and the Cases table are
  authoritative.

- No source change, no build, no whole-program identity claim.
  All executions are offline LiteSVM replays with normally
  signed transactions on the repository liquidity harness.
- Accrued fees are zeroed in every case to isolate rounding;
  the owed-fee subtraction on the as-is fixture was pinned by
  the 1st-run extremes packet (125,882 left after a full
  drain) and is not re-measured here.
- Amounts, steps, and drift values are exact for this
  fixture's pool state (base vault, quote vault, LP supply)
  and are not claimed for other pool states. The virtual
  drift is a single-transaction measurement per direction;
  the -1 round-trip drift is arithmetic on two pinned
  single-transaction cases, not a two-transaction execution.
