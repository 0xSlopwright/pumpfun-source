# AMM native control and one rejected borrow-result hypothesis

This packet supplies a native Linux transport for the selected AMM container
recipe. One actual native control reproduces **both** published compiler outputs:

| Output | SHA-256 |
| --- | --- |
| stripped ELF | `86dbc2c64e81988dead173039b61fa01ba5f68a00fbb6f6dd49f2cda0afec37f` |
| symbols ELF | `7271aaf8afe13b6c8f13a6cf0e9534896a66650dda13a2aa1b32e41edd46426d` |

The control retains **784/785 raw-equal windows**. The sole unequal original body
is sell cashback `0x4c750`, 9,024 bytes. This contribution changes no maintained
Rust source, selected binary, source gate, build recipe, README coverage count or
captured evidence. It makes no function-recovery, behavior-change or security claim.

## Problem and fixed inputs

The qualified [layout-closure builder](../amm-layout-closure-20261028/build.py)
requires `podman`, an immutable Linux image and historical container paths. This
host lacked that runtime; pulling its compressed 1.44 GB image exceeded available
disk. The packet tests a disclosed native process transport with the already
available exact Linux v1.44 SDK and authenticated dependency cache.

The source/layout pin is `1285b5e9e3a29c1e2cf32246d6046035e5d66fad`.
The publication branch starts at `a18e1e89b59bf9d734955550c92f321c97c95e62`;
its 68 AMM source inputs were compared byte-for-byte to the canonical archive
(`base-source-binding.json`), with no differences. `canonical-source.tar.gz`
and `canonical-build-record.json` are the existing published 68 standalone inputs
and container-build record. The original workspace recipe converts those to 69
inputs without changing Rust bytes. The native control's complete 69-input map
agrees with that published workspace map, including checked UVA construction,
the typed returned key, and typed CPI authority already present in maintained sell.
No earlier independent correction is reapplied or claimed here.

`reference/` contains unchanged builder, workspace recipe, link wrappers, default
script, ordered script, compiler invocation and SDK manifest. The qualified
registry-source wrapper is retained separately, unchanged. All **2,775 SDK files**,
including actual host `rust-lld`
`f28db3647fcf67bd47f012a1c47fe679f5787a4e2bf9cd5b6fe4914b10622bda`,
were authenticated before and after each build. All 257 locked registry packages,
their archive checksums and 8,180 archive source files were checked against active
unpacked sources before and after. The seed's full file map was recorded and its
independent copy had no shared file inodes. The protected seed was unchanged.
Both `pump-amm-recovered` and `native-transfer-fee` were explicitly cleaned and
freshly compiled for **each** output pair; external dependencies were reused.
This is a warm-dependency native repeat, not another empty-target qualification.

## Exact transport changes

The recorded controller is preserved byte-for-byte at `recorded/controller.py`,
SHA-256 `c9c3138b657a280c4c371cdfeabdfc86636c77d3418d1291907c4e2c5e2a3aac`.
Its sealed preparation plan is `recorded/plan.json`, SHA-256
`8bd519212c091138c1dfd0e84f531a604dc4bf85d1d1496c44a4a0587d27f664`.

- Launch the authenticated SDK directly instead of launching it inside the image.
- Replace only `/out/` literals in frozen wrappers with owned output paths: two
  occurrences in the rustc wrapper and five in the linker wrapper. Reversing the
  replacement recovers each reference byte-for-byte.
- Dispatch the root crate to that unchanged path-adapted root wrapper. Dispatch
  other crates through the existing registry `.rs` symlink canonicalizer, which
  verifies equal source bytes before selecting the physical path.
- Use two Cargo jobs for scheduling, the same `-Zremap-cwd-prefix=` target flag,
  and both existing `cdylib`/`lib` crate types. Both actual original and effective
  root argument lists equal the container record after only SDK/target/output
  transport-path substitution; metadata, codegen flags and ordering are identical.

The **target-derived** `ordered.ld` is inherited unchanged, SHA-256
`b8a3588949d5721fb3c8ba42c68d3ae23d502dda0bed1d6cb37ce8e8f9ae1633`.
It explicitly orders compiler-emitted sections from the previous recovery recipe;
it does not establish a historical private linker recipe. No source, object,
instruction, relocation or output byte was patched. Ordinary `llvm-objcopy
--strip-all` is the sole output transformation. Inherited synthetic Source positions
and package provenance remain unresolved. Existing compiler warnings/stack-frame
diagnostics are retained in both logs; exit success and byte repetition do not
certify safety.

## One falsified source hypothesis

The exact-current read-only CFG rebind first found a concrete original branch
shape following `AccountInfo::try_borrow_data`, actual callee `0x109188`.
Original sell compares the returned Result tag with `JEQ`, then jumps to the error
conversion tail; the selected build uses inverse `JNE` and success fallthrough.
This is the borrow Result, **not** the later UVA discriminator comparison.

The frozen patch is losslessly compressed as `layout-frontier-reconcile/single-hypothesis.patch.gz`.
The sole experiment replaced the real `try_borrow_data()?` propagation with an
explicit `match { Ok(data) => data, Err(error) => return Err(error.into()) }`.
Both arms retain real used operations. It occupies the same original source line;
no subsequent Source position, blank padding, hint, flag or type was changed.
The candidate was gated on both exact control hashes and built exactly once.

| Actual result | Control | Rejected candidate |
| --- | ---: | ---: |
| normalized original windows | 784/785 | 784/785 |
| raw original windows | 784/785 | 257/785 |
| sell body bytes | 9,024 | 9,000 |
| meaningful stripped ELF bytes | 1,268,504 | 1,268,480 |

There are **no normalized gains or losses, no raw gains, and 527 raw losses**.
The new source did not restore the original borrow branch polarity. It changed
register/value allocation and shrank the body; following address operands and data
layout moved. This is not 527 independently changed source functions. The candidate
is rejected and is **not selected**. No runtime corpus was run for this unsuccessful
source-recovery experiment. No alternative spellings, flags, layout or type grid
followed it.

Both raw ELF pairs (losslessly compressed), full 785-window censuses, all 527 raw
loss memberships, both 69-input archives, commands, actual compiler/linker
arguments, preserved-input receipts and complete build logs are included.
`recorded/complete-byte-delta.json.gz` records every changed common-extent offset
as half-open runs, plus added/missing lengths, for all three meaningful-ELF
comparisons. The original-to-control delta is 3,323 bytes; original-to-rejected is
499,379 common-extent bytes plus 24 missing bytes. Control-to-rejected is 498,527
common-extent bytes plus 24 missing bytes. The captured 9,217,211-byte zero allocation
suffix is separate and is not emitted or appended.

Raw linker reproducer archives and maps remain preserved at their recorded private
paths and hashes; they are not duplicated in this packet. A rebuild generates new
reproducers. The completed disposable private target was removed only after the
outputs/source/receipts were sealed and no compiler was active. Its removal receipt
is included; SDK, registry and protected seed were preserved.

## Diagnostic CFG attribution and limits

The unchanged official AMM parser/normalizer and 785-window rule remain the only
acceptance comparison. Sell remains **officially UNEQUAL** in both images.
The read-only graph diagnostic separately forwards empty unconditional blocks,
joins unique straight-line blocks, and optionally inverts a conditional while
swapping edge roles. On the exact control that diagnostic maps all 77 rooted
blocks, with **1,049 identical normalized non-terminator words including register
bytes**, and **80 actual depth-two callee occurrences** agreeing. There is one
conditional polarity difference and both have 35 unconditional jumps.

This bounded attribution supports a block-order/fallthrough distinction in the
selected control. It does not prove full semantics, relocation pointees, indirect
call closure, exhaustive runtime behavior, source spelling or historical compiler
provenance. The rejected candidate retains a 77-block topology map only; its strict
instruction-value map fails. The existing ATA creation/admission/decoder tail
placement remains unresolved. No earlier rejected Result-join proposal is revived.

## Verification and optional repeat

From repository root:

```bash
python3 -B research/amm-native-control-20261029/verify.py --repo .
python3 -B research/amm-native-control-20261029/test_verifier.py
python3 -B research/amm-native-control-20261029/build.py --help
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```

`verify.py` authenticates the complete manifest, rederives the 68-to-69 workspace,
checks the sole source edit and actual compiler arguments/path-only wrappers,
recomputes both official censuses and membership differences, all meaningful-byte
runs and bounded CFG attribution. Mutation tests reject extra source edits, wrapper
logic changes, omitted raw losses, a fabricated sell match and compressed-ELF
modification. The byte-delta negative control includes a removed suffix.

`build.py` is a small configurable input-path preparer that delegates all compiler
execution and hard gates to the **unchanged actual recorded controller**. Its input
preparation was exercised with the authenticated SDK and registry plus an empty
seed under `--prepare-only` (zero compiler invocations, hash-bound receipt included); a second build using this configurable preparer
was intentionally not performed. Only the exact recorded native execution above
is compiler-qualified. A new output location/dependency seed remains unqualified
until both expected control hashes pass. A user may repeat the fixed control with
an exact SDK, locked offline Cargo home and an independently copied external seed:

```bash
python3 -B research/amm-native-control-20261029/build.py \
  --repo "$PWD" --sdk /path/to/exact-v1.44 \
  --cargo-home /path/to/locked-offline-cargo-home \
  --seed /path/to/protected-external-target \
  --output /path/to/new-owned-output
```

`--prepare-only` authenticates/copies without Cargo. The optional
`--reproduce-rejected-match` repeats only this frozen negative source change after
both exact control hashes; it is not a recovery recommendation. Any failed control
stops before the candidate. The CLI never deletes a seed or changes the maintained
repository source.

Attribution: the existing AMM layout/workspace recipe and official normalizer retain
their upstream authorship. The CFG attribution helper derives from the independent
lifecycle worker's rooted-call diagnostic and is preserved unchanged. The native
registry canonicalizer is the previously qualified shared helper. This packet adds
native transport evidence, exact-current rebind, bounded falsification and verification;
it claims no original private-source ownership or new behavior qualification.
