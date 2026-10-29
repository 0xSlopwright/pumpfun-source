# PumpSwap reserved-account and execution recovery

Candidate `7f501a865b83cf1dfbc4072191967162c700d3e7e487d2f6400e8d230f15ca62` retains **642/785 normalized original windows
(81.8%)**, including **129 raw-equal bodies**, with no losses from the prior
transfer-ABI checkpoint. Matched text remains **804,472/1,162,040 bytes (69.2%)**.
**143 windows remain; whole ELF identity is false.** These figures are bounded
binary-recovery metrics, not an engineering-completion percentage.

## Behavior and source recovery

Reserved fee recipients are validated in the original order: nonzero key,
non-executable account, and rent exemption, with the correct indexed account
name. Short-list errors retain their original compared values. The previous
checkpoint's 21-case probe had 11 differences; all 21 now agree, with 42
verified signatures. Duplicate recipients, extra accounts and sufficiently
funded accounts with other owners remain accepted as observed in the original.

Legacy buy arithmetic now follows the original separate fallible operations,
zero-fee branch and creator-fee guard. Events are borrowed rather than cloned.
These restore observed call and error boundaries, but the complete handler
bodies remain unequal. The private scalar-decoder and unused trait-path
experiments were not incorporated.

Claim uses the original 2,400-byte typed transfer helper. InitBoost now uses
its evidenced instructions/boost.rs module, typed transfer, pool predicate,
and the recovered arithmetic boundary. Field-read and PDA operands follow
the original pool/account dataflow. Its standalone 696-byte math helper has
the original filename and callees, while source-line and handler-layout gaps
remain explicitly unproved.

The prior ATA/payout recovery and all 17 entrypoint descriptors are retained.
Nine authenticated Solana source roots bind 166 archive members plus nine
Cargo markers. The source recipe maps **50 canonical inputs** to **51 workspace
inputs** and **175 registry inputs**, **226 total**. Two strict offline Linux
v1.44 builds reproduce identical stripped and unstripped artifacts, with
**762 cached dependency artifacts unchanged**. The complete historical lockfile,
toolchain and transitive source provenance remain unresolved.

## Verification and limits

All **17,462 corpus cases**, **35,074 executions**, **35,418 signature fields**
and **17,537 identical signed-message pairs** pass. All retained supplemental
suites were rerun. Additional acceptance includes 60 ATA cases, 160 resize-order
cases and the 56 InitBoost/claim/reserved cases. The separate legacy/arithmetic
[matrix](followup/legacy-replay/README.md) has 1,568 cases and 3,136 signatures. Counts overlap. Comparator-specific
source-coordinate and compute-log normalization, and inherited synthetic CPI
dependencies, remain documented in the sealed packets.

The separate [static-object audit](followup/static-objects/README.md) verifies nine complete Unicode/UTF-8 arrays (2,518 bytes) and 101 bounded reads. Alias, shifted-pointer and overlong-range negative controls are retained. These bounded comparisons do not establish the surrounding allocation or whole data-section identity.

The recognized static/call closure remains 585 windows. Unclassified data,
source-coordinate gaps, full code/call/relocation identity, exhaustive behavior
and authentic fixed-admin create_config success remain open. Inherited compiler
stack warnings are retained; successful samples are not a general stack-safety
proof. See the [remaining-window partition](remaining-work.json).

```sh
python -B repro/pump_amm/behavior-context-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Result manifest:
`93e534f04800a724b8c97f79ae3c0130c0b7a7ac98db77d798d0677161bd320d`.
