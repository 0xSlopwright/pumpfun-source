# Sweep state and transfer boundaries: qualified partial recovery

One exact source overlay restores original-backed state and transfer boundaries
in Pump Sweep `0x72810`. A fresh native CI build reduces the handler from 8,784 to
7,888 bytes, versus the original 7,832. The full 1,035-window census remains
**1,019 normalized/188 raw, with zero gains or losses**. The handler and whole ELF
remain unequal. `programs/pump` and the canonical selection are unchanged.

[The overlay](source/programs/pump/src/sweep_fees.rs) is exactly
`15dbbd46bdbe7af62c6b7bb436f657c45e290c080c185fc075b7a3c08e3df7e8`.
[Source before](source-before.rs), pinned to main
`1285b5e9e3a29c1e2cf32246d6046035e5d66fad`, is
`8735adba8b670c3b4ee63a6fd716d1d639be6efa56269a15365c15ff2f44ba0c`.
Publication base `a18e1e89b59bf9d734955550c92f321c97c95e62` has the same Pump
source. [source.patch](source.patch) is the exact one-file difference.

The original loads and clears only the selected fee bucket before its zero
amount test. It calls the existing Rent getter/minimum-balance operation and,
only on the creator-native path below rent, the existing native-payment helper
with the **full** zero-data rent minimum. Native and token paths join at the
existing owned-recipient quote transfer helper. The overlay restores these
used operations and boundaries. Both token ATA admissions, account declarations,
authorization/error order (including Source 123/145), and event construction remain
unchanged. Inherited deliberate blank-line Source alignment is disclosed and
retained; no new padding, helper, attribute, signature or comparison mask exists.

[ARGUMENT-LEDGER.json](ARGUMENT-LEDGER.json) and [PROPOSAL.json](PROPOSAL.json)
are frozen **prebuild** records. Their then-unbuilt statements do not describe
the later qualification. The earlier c77 proposal under [history](history/) was
never built; it is superseded, not a measured failure. The original
[static receipt](STATIC-VERIFIED.json) checks 130 raw original instruction rows,
source/patch hashes and the existing helper bodies/actual edges through depth 2.
The [new qualification](qualification/) retains the actual linked outputs,
compiler logs/inputs, measured-versus-tested section checks and signed replays.

## Actual build and remaining bytes

[Native CI 40793129553](https://github.com/shawkkkkk/pumpfun-source/actions/runs/40793129553)
used native macOS v1.44 tools with authenticated Linux v1.44 SBPF libraries and an
empty target. All 65 standalone/66 compiler-workspace inputs are archived and
hashed; only Sweep differs from composition 673. Both local crates have actual
`Compiling` lines. Inputs, tools, registry sources and target libraries remain
unchanged. The preceding native unchanged
[control 40791064153](https://github.com/shawkkkkk/pumpfun-source/actions/runs/40791064153)
reproduces both canonical outputs. The CI controller/tooling belongs to the
separately authored [PR720](https://github.com/lalalune/pumpfun-source/pull/720);
its raw build artifacts here bind this source measurement, with no duplicate
build-tooling contribution claim.

| Actual output | SHA256 |
| --- | --- |
| Stripped runtime image | `21b0de29ebc71c692715a6bb863adb0ed19f06419eb3afbca02027b101bf6049` |
| Symbols image | `a8d26376c23b30b751ed2a8535bc1117cb129d51293495849f7138fe51f8cd39` |

All 36 proposed direct callee identities pair with original callees through two
levels, versus 32/37 before. All four intended helper edges are actual used calls
with exact normalized helper bodies and paired depth 2 edges. Raw argument
prefixes and selected-field load/clear/zero-test rows are retained. The original
has one additional 64-byte `memcmp` call. Multiset capacity does not prove arbitrary
argument/order/data equivalence. The residual 56 handler bytes, comparison
provenance, complete callee/data closure and whole-program equivalence remain
unresolved. No speculative spelling/flag/compiler grid follows from the count.

## Finite runtime evidence

The unchanged maintained producer supplies 504 cases covering native/protocol/
creator, zero fees, token/WSOL/Token2022, ATA admission and authorization/owner/
length errors. Seven separate cases use its existing recipient-lamports patch
parameter and existing synthetic signers for creator rent boundaries, zero-fee
and protocol controls. They are not relabelled historical 504 cases.

All 511 fresh **original/canonical/proposal triples** pass: 1,533 actual signed
executions and 1,551 signature fields reverify. Errors, complete before/after
states, return data, inner CPIs, serialized transactions and every ordered log
line agree except complete compute-meter lines/the metadata compute counter.
Every Source coordinate remains literal. Captured Program/ProgramData headers
and unchanged ELF prefixes are checked. Separate original/canonical before-runs
are retained; repeated cases/fields are not unique transaction or coverage counts.

The real original System CPI pays 890,880 lamports when its recipient holds 1 or
890,879 lamports. With 1 lamport and a 12,345 fee sweep, it ends at 903,226. At/above
the minimum there is no stipend; the zero-fee and protocol controls have none.
Canonical already agrees, so this is no new observable behavior-fix claim.
The replay preserves an initial verifier-shape failure separately, followed by a
fresh corrected run; no failed receipt or prior image's runtime result transfers.

## Reproduce the checks

```sh
python3 -B research/pump-sweep-used-boundaries-20261029/verify.py
python3 -B research/pump-sweep-used-boundaries-20261029/test_controls.py
python3 -B research/pump-sweep-used-boundaries-20261029/qualification/verify.py
python3 -B research/pump-sweep-used-boundaries-20261029/qualification/runtime/test_replay.py
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```

The static gates have six controls, and eight controls drawn from actual Sweep
outcomes reject changed Source coordinates, log order, signatures, state and
return data while allowing only complete compute-meter lines. For a sparse
checkout, both verifiers accept `--selected /path/to/canonical-symbols.so
--inventory /path/to/canonical-inventory.json.gz`; the static controls accept
`PUMP_SWEEP_INVENTORY=/path/to/canonical-inventory.json.gz`.
The qualifier rechecks hashes, archived inputs, build logs, complete saved census,
actual helpers/state rows, all signed outcomes and literal logs without executing
a new VM. [The replay controller](qualification/runtime/replay.py) accepts an
explicit repository and candidate/control ELF paths. Original executed commands,
fixture hashes and before/after receipt boundaries are retained in
[COMMANDS.md](qualification/runtime/COMMANDS.md).

No full 44-suite replay, independent candidate repeat build, canonical promotion,
complete byte identity or security acceptance is claimed. Stopped token-incentive
handlers and crossing fixtures are outside scope. Original captures and prior
packages remain unchanged. Frozen patch/source/compiler-input whitespace is
retained in [WHITESPACE-AUDIT.json](WHITESPACE-AUDIT.json), not trimmed or hidden
by a policy change.
