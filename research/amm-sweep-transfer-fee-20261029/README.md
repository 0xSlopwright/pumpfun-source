# Fee sweeps under a matching Token-2022 transfer fee

## Problem

The #48 packet showed fee sweeps failing with `IncorrectProgramId`
for Token-2022 quote mints — but in that packet the caller passed
the Token program for Token-2022-owned accounts. Whether a sweep
succeeds when the caller passes the *matching* Token-2022 program,
and what the fee does to the vault, the recipient, the withheld
balance, and the emitted event in that case, was unmeasured. The
same program-meta question was already resolved for legacy
transfers in #14 (a mint rejection turned out to be a program-meta
mismatch); this packet resolves it for sweeps.

## Cases

21 fresh-VM triples (original / #424 control / #427 candidate),
63 signed executions on the repository's own sweep harness setup
(fixture protocol fees 2,488, creator fees 123,394). The clock is
slot 100, epoch varies only for the epoch cases. `producer.py`
reproduces every receipt from the repository files.

| Case | Recipient gains | Withheld | Vault spends | Pool fee left | Payer | Event amount |
| --- | --- | --- | --- | --- | --- | --- |
| proto-token-baseline | 2,488 | — (165-byte ATA) | 2,488 | 0 | 2,044,280 | 2,488 (bucket 0) |
| proto-token22-nofee | 2,488 | 0 (170-byte ATA) | 2,488 | 0 | 2,079,080 | 2,488 (bucket 0) |
| proto-tf100 | 2,463 | 25 | 2,488 | 0 | 2,162,600 | 2,488 (bucket 0) |
| proto-tf5000 | 1,244 | 1,244 | 2,488 | 0 | 2,162,600 | 2,488 (bucket 0) |
| proto-tf10000 | 0 | 2,488 | 2,488 | 0 | 2,162,600 | 2,488 (bucket 0) |
| proto-tf5000-max100 | 2,388 | 100 | 2,488 | 0 | 2,162,600 | 2,488 (bucket 0) |
| proto-tf100-preata-withheld | 7,463 (5,000 + 2,463) | 1,025 (1,000 + 25) | 2,488 | 0 | 5,000 | 2,488 (bucket 0) |
| proto-tf100-preata-noext | Token-2022 custom error 0xd | | | | 5,000 | — |
| proto-zero-fee | no-op (no ATA, no event) | | 0 | 0 | 5,000 | — |
| proto-epoch0 / epoch9 | 2,463 | 25 | 2,488 | 0 | 2,162,600 | 2,488 (bucket 0) |
| proto-epoch10 / epoch11 | 1,244 | 1,244 | 2,488 | 0 | 2,162,600 | 2,488 (bucket 0) |
| proto-token22prog-tokenaccounts | IncorrectProgramId | | | | 5,000 | — |
| creator-token-baseline | 123,394 | — (165-byte ATA) | 123,394 | 0 | 2,044,280 | 123,394 (bucket 1) |
| creator-token22-nofee | 123,394 | 0 (170-byte ATA) | 123,394 | 0 | 2,079,080 | 123,394 (bucket 1) |
| creator-tf100 | 122,160 | 1,234 | 123,394 | 0 | 2,162,600 | 123,394 (bucket 1) |
| creator-tf5000 | 61,697 | 61,697 | 123,394 | 0 | 2,162,600 | 123,394 (bucket 1) |
| creator-tf10000 | 0 | 123,394 | 123,394 | 0 | 2,162,600 | 123,394 (bucket 1) |
| creator-tf5000-max100 | 123,294 | 100 | 123,394 | 0 | 2,162,600 | 123,394 (bucket 1) |
| creator-zero-fee | no-op (no ATA, no event) | | 0 | 0 | 5,000 | — |

Payer deltas include ATA creation rent where an ATA is created:
Token ATA 2,039,280 + 5,000 fee = 2,044,280; Token-2022 ATA without
a withheld extension 2,074,080 + 5,000 = 2,079,080; Token-2022 ATA
with a withheld extension 2,157,600 + 5,000 = 2,162,600. A
pre-existing destination costs only the 5,000 fee. The withheld
amount is read from the recipient ATA's TransferFeeAmount
extension (u64 at offset 174 in the created 182-byte account
data); no-fee Token-2022 ATAs are 170 bytes with no withheld
extension, and Token ATAs are 165 bytes.

## Result

- **Sweeps can move Token-2022 quote fees.** With the matching
  Token-2022 program, both the protocol and the creator sweep
  succeed at 1%, 50%, and 100% fees. The #48 rejection is a
  program-meta mismatch, not a sweep limitation: passing the
  Token-2022 program for Token-owned accounts fails the mirror
  way (`IncorrectProgramId` from the associated-token program,
  before any funds move).
- **The vault always spends gross, the recipient gains net.**
  Protocol: vault −2,488 in every transfer case; creator: vault
  −123,394. The pool fee field is zeroed in every transfer case,
  including the 100% cases where the recipient gains nothing.
- **The event reports gross, not net.** `SweepPoolFeeEvent`
  carries amount 2,488 (bucket 0) / 123,394 (bucket 1) even when
  the recipient gains 2,463 / 122,160 (tf100) or 0 (tf10000).
  Consumers reading the event overstate the delivered amount
  whenever the quote mint has a transfer fee.
- **A 100% fee succeeds with zero delivery**, unlike the trade
  paths that error at 100% (buy_exact 6039, non-exact buy 6023).
  The full accrued amount is withheld into the recipient ATA
  and the fee field is still zeroed.
- **Caps bind the withheld amount only.** tf5000 with maxfee
  100 withholds exactly 100 (protocol gains 2,388, creator
  gains 123,294).
- **The fee schedule switches exactly at the newer epoch.**
  With older 100 bps and newer 5,000 bps at epoch 10, epochs 0
  and 9 apply 100 bps (gain 2,463) and epochs 10 and 11 apply
  5,000 bps (gain 1,244). The schedule order in the synthesized
  mint extension is older first, newer second.
- **A destination without extension space fails.** A
  pre-existing 165-byte destination (no TransferFeeAmount
  extension) fails with Token-2022 custom error 0xd when the
  mint has a transfer fee, while the same destination with
  extension space succeeds and accumulates withheld fees
  (5,000 + 2,463 gained, 1,000 + 25 withheld).
- **A zero fee bucket is a silent no-op.** No ATA is created,
  no event is emitted, only the 5,000 payer fee is charged.

All three images behave identically in every case.

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. The quote-mint transfer-fee
extension and the vault extension are synthesized post-hoc (the
legacy creation path cannot put a transfer fee on a quote mint
either); this pins handler transfer behavior, not a reachable
mainnet state. The epoch cases use a synthesized older/newer
schedule pair. The 0xd failure is reported as observed (Token-2022
custom error 0xd on a destination without extension space); the
packet does not name the internal Token-2022 error variant.
