# PumpSwap account layouts and ordering recovery

Candidate `badc94982f2ae20adc2a6be7fd22bba9d900c289de7c3b9e7475847af960ca7d` matches **623/785 normalized original
windows (79.4%)**, including **128 raw-equal bodies**. It adds **24** matching
windows with none lost from the native-fee/CPI checkpoint. Matched text is
**727,352/1,162,040 bytes (62.6%)**. **162 windows remain; whole ELF identity
is false.** These percentages measure binary-window coverage, not total work
completion.

## Recovered behavior and structure

The source restores inline Anchor account storage and raw AccountInfo fields
across authority updates, creator-fee collection, incentives, cashback, creator
reassignment and reserved fee recipients. The shared cashback transfer helper
now matches its original 792-byte normalized body. Three generated IDL functions
also match after moving existing imports to recover the program macro's
observed source line. This does not establish historical source identity.

The integrated fixes restore fee-context error precedence, pool-creation mode
guard order, incentive index conversion order and creator-reassignment guards
before resizing. The preserved previous candidates demonstrate two fee-context,
166 mint-order, 20 incentive-domain and five creator-order discrepancies.
The incentive differences are 17 wrong successes and three wrong custom errors;
they do not demonstrate mutated account state. The creator-order differences are
three extra System CPI traces and two wrong errors, with no after-state differences.

Buyback validation, pool-v2 lookup and buy-result sum helpers more closely follow
the original function shapes and call targets. They remain partial where their
complete windows do not match.

## Verification

Two strict offline Linux v1.44 builds reproduce this candidate. The explicit
recipe binds **47 canonical inputs**, **48 workspace inputs** and **169
authenticated registry inputs**: **217 total**, with **732 dependency artifacts
unchanged**. The separate repository Fees workspace is preserved.

Fresh replay passes all **17,462 corpus cases**, **35,074 executions**,
**35,418 signature fields** and **17,537 identical signed-message pairs**.
All retained supplemental suites were rerun. Fresh continuation suites include
312 account-layout cases, 700 incentive cases, 656 mint-order cases,
313 creator/cashback cases, 315 swap-helper cases and 793 reserved/admin cases.
Counts overlap and are not a unique total.

Eight creator-order cases explicitly substitute a synthetic Pump CPI caller
with ordinary signatures and invoke_signed PDA rules. Their evidence concerns
AMM ordering under that caller, not reachability through the captured Pump binary.
The other named continuation groups use captured program dependencies.

The inherited incentive wrapper compiler warnings were reviewed against the
matching original wrapper, with no new live-range overlap found. This is not
a general proof of stack safety or historical runtime provenance.

The [expanded helper input binding](followup/swap-helper-inputs.md) repeats 315
helper cases with two additional import-time fixtures explicitly hashed. It
supersedes the first helper packet's incomplete explicit import list; the
original signed observations remain preserved.

## Remaining work

A [separately sealed follow-up probe](followup/migrate-constraint/README.md)
finds a missing canonical-pool constraint in MigratePoolCoinCreator. The selected
623-window candidate differs in 12 of 24 cases: three incorrect successes change
account data and nine cases return the wrong error. This newly identified gap
remains open in this checkpoint and is being fixed in the next source batch.

The [remaining-window partition](remaining-work.json) assigns all 162 unmatched
windows once. Complete code/data/call identity, historical toolchain and lockfile
provenance, exhaustive behavior, and authentic fixed-admin create_config success
remain open. Runtime comparisons retain each packet's documented source-coordinate
and compute-log exclusions.

```sh
python -B repro/pump_amm/account-context-recovery-20261027/verify_saved.py
```

Add `--current-source` to check the maintained AMM sources. The result seal is
`9f2a5d54ffee7afdc10e23eef10d3f0ec70c83417295d2ff2c33483e05766a9d`.
