# PumpSwap native-quote and execution recovery

Candidate `be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6` matches **643/785 normalized original windows
(81.9%)**, including **148 raw-equal bodies**, with no losses from the prior
transfer-ABI checkpoint. Matched text is **804,704/1,162,040 bytes (69.2%)**.
**142 windows remain; whole ELF identity is false.** These figures are bounded
binary-recovery metrics, not an engineering-completion percentage.

## Behavior and source recovery

The recovered native-or-USDC predicate includes both SPL Token native mints.
Its 232-byte body, all three memcmp callees and all three mint constants match.
This closes all six differences found in nineteen creator-transfer cases with
Token-2022 native fixtures. All nineteen cases now match with 76 verified signatures.
The independent comparison against the intermediate fifth candidate finds one
new normalized window and nineteen raw-equal gains, with no losses.

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
Cargo markers. The source recipe maps **51 canonical inputs** to **52 workspace
inputs** and **175 registry inputs**, **227 total**. Two strict offline Linux
v1.44 builds reproduce identical stripped and unstripped artifacts, with
**762 cached dependency artifacts unchanged**. The complete historical lockfile,
toolchain and transitive source provenance remain unresolved.

## Verification and limits

All **17,462 corpus cases**, **35,074 executions**, **35,418 signature fields**
and **17,537 identical signed-message pairs** pass. All retained supplemental
suites were rerun. Additional acceptance includes 60 ATA cases, 160 resize-order
cases 137 entrypoint/event/curve/order cases and 71 InitBoost/claim/reserved/boost cases.
The separate legacy/arithmetic matrix has 1,616 cases and 3,232 signatures. Counts overlap. Comparator-specific
source-coordinate and compute-log normalization, and inherited synthetic CPI
dependencies, remain documented in the sealed packets.

The recognized static/call closure reaches 586 windows. Unclassified data,
source-coordinate gaps, full code/call/relocation identity, exhaustive behavior
and authentic fixed-admin create_config success remain open. Inherited compiler
stack warnings are retained; successful samples are not a general stack-safety
proof. See the [remaining-window partition](remaining-work.json).

```sh
python -B repro/pump_amm/quote-guard-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Result manifest:
`8ef5d5f28dc6be5b0b54cfa1ac1e35b4f36ea8470fdfceb2acde954d1777a69e`.

Additional independent evidence is indexed in [followup/README.md](followup/README.md).
