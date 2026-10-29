# AMM fee caller: preserve the original value-copy boundary

One ordinary Rust change, `match data` to `match *data`, recovers the complete
**696-byte / 80-instruction** original `calculate_fee` caller at `0x74648`.
A normal full build goes **732 -> 733/785 normalized functions**, keeping all
**148 raw matches** and all previous normalized matches. The actual call at
+128 now connects this matched caller to the matched 368-byte native helper
from merged [PR405](https://github.com/lalalune/pumpfun-source/pull/405).

## Cause and source

The original first copies all 24 bytes of the native fee payload into a local
stack value, then passes that local value's address. PR405's caller borrowed the
payload directly and emitted 640 bytes. The older packed-SPL conversion also
emitted 696 bytes, but its copy loaded two u64 fields and one u16 field rather
than the original's three full words. Its complete body therefore did not match.

Matching the `Copy` option by value creates the native local copy using safe,
ordinary Rust. No new crate, dependency, error coordinate, arithmetic, flag,
assembly or binary patch is added by this follow-up. Only one of 54 source inputs
changes; the source archives and `source.patch` make the one-character edit
reviewable. The source uses PR405's existing actual dependency boundary. This
packet does not claim the historical spelling or organization of the source.

The compiler evidence is causal and tied to actual builds:

- Parent MIR borrows the `Some` payload. Candidate MIR copies it into a local
  `DecodedTransferFee`, then borrows the local for the call.
- Candidate optimized LLVM IR contains a 24-byte aligned `llvm.memcpy` into
  `%fee`; the parent's IR passes the payload pointer directly.
- The backend emits the original three 8-byte copy instructions at the original
  stack offsets, and the entire 696-byte body matches with the documented
  call/address normalization.
- Both IR-capture builds strip to their corresponding normal ELF exactly.
  Their diagnostic unstripped outputs are kept distinct from normal repeats.

## Actual calls and data

`analyze.py` recomputes the entire function and all five actual direct callee
body matches: the native fee method, error-name method, error Display method,
`unwrap_failed`, and Anchor error conversion. It validates all seven relocated
root references instead of silently masking them:

| Caller offset | Typed referent checked |
|---:|---|
|200,344|Overflow enum discriminant 23|
|248|48-byte vtable, size 24/alignment 8, all four actual method targets|
|392|55-byte Display panic message|
|416|32-byte vtable, size 0/alignment 1, both actual method targets|
|432|Panic Location's filename, length, line and column through its real pointer|
|552|43-byte `programs/pump-amm/src/utils/transfer_fee.rs` filename|

The adjacent Source construction retains line 49 and error 6023. The six vtable
method bodies also match. This closes the root references and immediate calls,
not every transitive data reference or indirect dispatch. Incoming caller counts
still differ (original 1, candidate 2), so no whole-program graph claim is made.

## Builds and measured artifacts

The baseline is the already retained normal repeat of PR405's 732 candidate,
not a newly relabeled731 artifact. `verify.py` joins the entire baseline source
archive to PR405's accepted source archive. The same archived Linux v1.44 SDK
recipe, SBPF target, flags, lock graph and 396 dependency artifacts are preserved.
Two new normal 733 builds compile the root and reproduce both complete ELF
outputs. The repeat also recompiles the unchanged native dependency.

| Artifact | SHA-256 |
|---|---|
|Original|`6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7`|
|Baseline732, stripped|`351d0d9adb40497790cd46fa992776cdeefa758041a1e50a6a29355525b4e471`|
|Candidate/repeat733, stripped|`f7c4850c6529bf40ffc490753b0a3470aed9b5d630023c8a7df5bd3992c6dee6`|
|Candidate/repeat733, with symbols|`fe66adb9f12e94851b19190d7bdff1f5849f802595d4feb24d280b6a983f496a`|

The only gained original window is 0x74648; normalized and raw loss sets are
empty. This is one complete normalized function gain, not raw target identity
or whole-ELF equality. Maintained checkpoint counts and this research recipe's
counts remain separate.

## New execution on these exact artifacts

All following receipts actually load original/732/733; none is a reused732 run
relabeled as733. Signed transaction bytes, loaded program hashes and full
non-executable message-account snapshots are retained and independently audited.

- 680 liquidity, 1,011 buy and 575 sell triples: 2,266 triples/6,798 signed
  executions, no functional differences or new log differences. These suites
  reuse VMs while restoring inputs. Existing non-compute log differences stay
  0/76/88 respectively.
- 216 fresh-VM triples/648 signed executions rerun the existing decoder,
  epoch and fee arithmetic matrix. No state, return, CPI or non-compute log
  differences. Classification is 182 success, 20 account-validation rejections,
  12 quote-mint 6007 rejections and 2 unchanged inverse-fee 6023 rejections.
- Seven additional fresh triples/21 signed executions exercise this caller's
  actual `transfer_fee.rs:49` Overflow 6023 path and six epoch controls. The
  overflow uses a **synthetic invalid** basis-point value 65535 and u64::MAX
  quote-vault amount; it is deliberately an error-path fixture, not a valid
  deployed Token-2022 configuration or an exploit claim. All three artifacts
  return the same error/logs and roll back all program account changes, charging
  only the verified 5,000-lamport payer fee. Six epoch controls succeed.

The seven-case run overlaps the 216-case matrix in its six controls; totals are
not independent coverage claims. Compute-unit differences are explicitly
excluded. The error path adds execution evidence for the recovered Source
reference rather than increasing a test-count objective.

## Replay and inspection

Audit the saved source, normal builds, compiler bindings, function inventory,
actual referents and signed receipts using the repository Python requirements:

```sh
python -I -B research/amm-fee-value-call-recovery/verify.py
```

The audit does not rebuild or execute the program. Materialize the complete
candidate into a new directory (`--baseline` selects the retained parent):

```sh
python research/amm-fee-value-call-recovery/materialize.py /tmp/fee-value-source
python research/amm-fee-value-call-recovery/rebuild.py --source /tmp/fee-value-source --sdk /path/to/v144/sdk --cargo-home /path/to/cargo-home --target-dir /path/to/target --output /tmp/fee-value-build
```

This uses the recorded offline/locked Docker recipe and existing SDK/cache;
network access is disabled. The script verifies input/tool hashes and requires
the reproduced complete ELF hashes. Original commands, mounted paths, build
logs and results remain in `builds/`; `compiler/` keeps qualified MIR/LLVM IR.

Run the fresh matrices against decompressed baseline and newly built candidate:

```sh
python -I -B research/amm-fee-value-call-recovery/focused.py --control /path/to/732.so --candidate /tmp/fee-value-build/candidate.so --output /tmp/fee-value-focused/report.json
python -I -B research/amm-fee-value-call-recovery/error_path.py --control /path/to/732.so --candidate /tmp/fee-value-build/candidate.so --output /tmp/fee-value-error/report.json
```

`runtime/commands.json` and each focused directory's `command.json` retain the
actual original commands. `controllers/` preserves their original local source
and historical absolute paths. The two public matrix entry points accept new
paths and record hashes at successful program-load calls.

## Limits

Existing unrelated `admin_update_token_incentives` stack-frame diagnostics remain
in normal build logs. The inherited non-compute buy/sell log differences remain.
The decoder, inverse-fee method, whole-ELF identity, historical build provenance
and complete transitive closure are unresolved. The arithmetic and its valid
runtime behavior are unchanged by this source copy-boundary correction. No
original binary, captured account or prior sealed evidence packet was modified.
