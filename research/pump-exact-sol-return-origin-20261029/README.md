# Pump exact-SOL return origin and bounded error-helper references

PR #848, incorporated with the SDK-feature verifier correction in #872, locates
the remaining four-byte normalized `buy_exact_sol_in` difference at two reversed
error-return loads. This follow-up fills two evidence gaps: the initial Rust/MIR
and LLVM input before wrapper inlining, and the data references used by the
actual `with_values::<u64, u64>` callee.

This is diagnostic source/compiler provenance. No maintained Rust, canonical
image or function count changes. The captured deployment's historical source
and compiler remain unproven. No target program or VM is executed.

## Passive origin capture

One stock v1.44 root compilation reuses the qualified PR743 Windows source and
dependencies, adding only MIR/LLVM tracing. All 66 source inputs and four tool
hashes agree. Its complete ELF is byte-identical to the baseline:
`6c1dfdfb12e477f1b427ef4d581d2734306608053585ca62b895c5a075ec4119`.

The archive retains all 1,667 generated MIR-related files, including 104 MIR
snapshots each for the inner function and wrapper, plus the complete 512-snapshot
LLVM trace. Runtime-optimized inner MIR receives `with_values` in `_208` and
constructs `Result::Err(move _208)`. The wrapper still calls the inner function.
Before the first observed LLVM pass, the return is already extracted and stored
tag-first. All 144 observed inner-function states and 225 post-inlining wrapper
states preserve extract order 0,1. The 19 early inner states containing explicit
tag/payload store pairs also retain tag-first stores; optimized return/phi forms
are not counted as direct store pairs. The final wrapper IR equals the earlier #848
capture exactly. These are observations in this compiler configuration, not a
proof that every Rust formulation must produce that order.

Nine exact Git blobs authenticate the relevant Rust front-end, MIR-inliner,
LLVM object-writer, feature-table and linker sources. This Rust MIR inliner still
applies its cost threshold to `#[inline(always)]`; no attribute-only experiment
or global inliner-threshold change was run.

## Actual callee and data references

The call at byte offset 8,016 selects original `0x11b0` and candidate `0x2178`.
Both bodies are 1,336 bytes. Their narrow normalization agrees, but 26 raw bytes
differ. The final return stores are literally equal. Two other candidate bodies
also normalize to the original; this comparison uses the actual call operand.

All eight direct-call sites lead to three actual candidate bodies that match
the original bodies under the same normalization. Five data-pointer sites refer
to four objects; one vtable is used twice:

| Object | Original | Candidate | Checked bytes |
| --- | --- | --- | ---: |
| `String` formatting vtable | `0x1bd838` | `0x1bfa60` | 48 |
| Formatting-error message | `0x1b5fa4` | `0x1b8214` | 55 |
| `fmt::Error` debug vtable | `0x1bd868` | `0x1bfa90` | 32 |
| Panic location | `0x1bd888` | `0x1bfab0` | 24 |

The location additionally points to an 84-byte source-path string, identical
in both images, with line 2559 and column 14. The path is evidence of a recorded
path only; it does not identify the historical source revision.

For these legacy SBF images, the seven data pointer fields have a zero low word
and the link-time address in the high word. The verifier requires each exact
`R_SBF_64_RELATIVE` entry, symbol index zero, and the expected field positions.
The pinned object writer selects the legacy relocation without `reloc-abs64`;
the pinned linker writes the address at `loc+4`. It would be incorrect to treat
the stored eight bytes as an ordinary native pointer. No relocated or allocation
image is produced, and this parser does not claim support for other SBF formats.

The three structured records cover 104 bytes. Their non-pointer bytes agree;
all seven pointer fields are checked individually. Six vtable fields lead to
six corresponding function bodies. Together with the direct edges there are
nine unique child functions. Their bodies agree under normalization; this is
one edge of evidence. Their descendants, other indirect dispatch and behavior
remain unqualified. The message and source path contribute 139 raw-identical
bytes; no global data-credit total is changed.

## Retained negative control and limits

The preceding addressable `Some(error).take().unwrap()` control changes only
physical line 133. It loads the tag first but retains a tag-equals-2 branch and
an `unwrap_failed` tail, growing the target from 13,224 to 13,272 bytes. The
original membership of 1,019 normalized and 186 raw Windows-cohort windows stays
unchanged. It is rejected. Source delta, complete output, logs, measurements and
the original producer are retained. It is not behavioral qualification.

The initial local analysis compared a hash string to a receipt object instead
of its `sha256` field. The failed analyzer and error record are retained; the
input trace hash was correct. The local capture controller paths are retained
as executed and are not a portable fresh-build recipe. Saved verification is
portable and requires only Python 3.11+ and the pinned repository evidence.

Receipts and hash replay establish saved-evidence consistency, not cryptographic
execution attestation. A raw compiler image, a relocated/allocation image, a
normalized function match and runtime behavior are distinct claims. This packet
does not establish a recovered-source gain, recursive closure, security, or
whole-original-ELF identity.

## Replay

```sh
python -I -B research/pump-exact-sol-return-origin-20261029/verify.py --repo-root .
python -I -B -m unittest discover -s research/pump-exact-sol-return-origin-20261029/tests
```

The verifier recomputes both 1,035-window censuses from the retained images;
equal reported totals alone are insufficient. It also runs the reviewed #872 parent verifier and authenticates its
manifest. Tests reject changed relocation types, pointer encoding, vtable targets
and scalar fields, message/path bytes, panic coordinates, and initial extract
order, plus coherently resealed compiler-argument and environment changes. Two
additional controls coherently reseal an altered unmatched-window extent and a
later explicit payload-first store pair; both must reject. The complete 1,035
original-window map is bound to the pinned canonical selected-window TSV. Both
entrypoints refuse optimized Python before loading inherited assertion readers.
Compiler sources retain their upstream licenses; Rust is MIT/Apache-2.0,
and LLVM licensing is included under `compiler/`.
