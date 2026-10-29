# Bounded review of the admin-incentive wrapper frame warning

This is a static comparison of user-owned artifacts. No compilation or target/VM
execution was performed. Offsets below are relative to the wrapper's current
frame pointer, with half-open byte ranges.

## Result

The warning is inherited from the incentive account-context unboxing. It is not
new in the pool-helper control. No overlap between the observed outgoing argument
stores and the identified still-live caller regions was found. This is narrower
than a proof of stack safety: the compiler's exact warning trigger and complete
callee memory effects remain unresolved.

The same three diagnostics occur in:

| Build | Wrapper start | Diagnostic lines |
| --- | --- | --- |
| `work/amm-incentive-context-20261027/build-corrected` | `0xb4730` | `build.log:126,128,130` |
| `work/amm-account-fee-final-20261027/build` (`336b4330...`) | `0xb49a8` | `build.log:138,140,142` |
| `work/amm-incentive-domain-integration-20261027/build` (`9445734f...`) | `0xb61a0` | `build.log:138,140,142` |
| `work/amm-pool-prepare-next-20261027/build` (`e483801d...`) | `0xb4cc0` | `build.log:138,140,142` |

Each 1,488-byte wrapper matches original `0xe5ce8` under the retained normalizer,
with the same relocation pattern. Every direct frame load/store has the same
instruction offset, width and displacement. The normalizer masks direct-call
targets and relocated address immediates; it does not mask stack displacements
or frame-pointer arithmetic (`elf_reader.py:25-35`). Raw body equality is false.

## Concrete call and frame map

The compiler diagnostic names a method but gives no instruction address. These
are the calls in that method relevant to its large aggregate and stack arguments;
the diagnostic cannot be assigned to one of them solely from the log text.

| Operation | Wrapper offset | Original | `336b4330` | `9445734f` |
| --- | ---: | --- | --- | --- |
| Account parser | 312 | `0xe5e20 -> 0x7d780` | `0xb4ae0 -> 0x6ee68` | `0xb62d8 -> 0x70660` |
| Aggregate copy | 632 | `0xe5f60` | `0xb4c20` | `0xb6418` |
| Admin business handler | 880 | `0xe6058 -> 0x16128` | `0xb4d18 -> 0xcaf10` | `0xb6510 -> 0xcc708` |
| Account exit | 952 | `0xe60a0 -> 0x80a00` | `0xb4d60 -> 0x720e8` | `0xb6558 -> 0x738e0` |

The account parser (7,616 bytes) and exit (1,464 bytes) have complete normalized
matches. The business handlers do not: original is 3,168 bytes, `336b4330` is
8,968 bytes, and `9445734f` is 3,288 bytes. Wrapper identity therefore does not
establish all child memory behavior.

The original and both candidates show this sequence:

1. Before the parser call, store a pointer to the three-byte bump area
   `[-3955,-3952)` in slot `[-4088,-4080)`. Pass the current frame pointer in
   `r5`. Original parser `0x7d780` saves `r5` and explicitly loads its argument
   from `[saved_r5-4088]` at `0x7d7d8`.
2. The parser result is consumed from `[-1968,0)`. On success, the wrapper copies
   exactly 1,944 bytes from `[-1944,0)` to `[-3912,-1968)`; the copy's source and
   destination do not overlap. These are observed copy/consumption ranges, not
   a claim that every parser write has been exhaustively bounded.
3. The wrapper places the retained aggregate prefix immediately below that
   destination, giving the handler/exit an aggregate pointer at `-3936`. It builds
   the indirect Context argument at `-1968`; its visible fields occupy
   `[-1968,-1928)`. This intentionally reuses part of the old parser-result
   storage after the needed account bytes have been copied.
4. Immediately before the business call, store:

   | Original store | Wrapper offset | Slot | Value |
   | --- | ---: | --- | --- |
   | `0xe5ff8` | 784 | `[-4088,-4080)` | day number |
   | `0xe6008` | 800 | `[-4080,-4072)` | token supply per day |
   | `0xe6018` | 816 | `[-4096,-4088)` | seconds in a day |

   `r1` points to the result at `-3976`, `r2` to Context at `-1968`, `r3` contains
   start time, `r4` end time, and `r5` the current frame pointer. Original handler
   `0x16128` saves `r5` and reads the three slots at `0x161d0`, `0x161d8`, and
   `0x161e0`. Both candidate handlers use the same three caller-relative offsets,
   although their instruction locations and internal bodies differ.
5. After a successful business call, the exit call uses a result slot
   `[-3992,-3976)` and the aggregate at `-3936`. The wrapper later performs the
   ordinary aggregate cleanup and returns through its separately retained result
   pointer.

## Overlap and liveness conclusions

At the business call, outgoing arguments `[-4096,-4072)` are disjoint from:

- retained parameter/result-pointer slots within `[-4064,-4008)`;
- business result `[-3976,-3960)` and exit result `[-3992,-3976)`;
- the retained aggregate beginning at `-3936` and ending at `-1968`;
- the Context fields beginning at `-1968`.

The reused `[-4088,-4080)` slot previously held the parser's bump pointer. The
parser has returned before the day-number store, and the wrapper does not read
that old pointer afterward. The actual bump bytes are elsewhere and are copied
before the business call. Thus that reuse is not an observed live-value overwrite.

The Context writes overlap old parser-result storage, but occur after the
1,944-byte copy. The later handler/exit consume the retained aggregate and new
Context, not the overwritten source copy. No direct access below `-4096` was
found in the wrapper. An eight-byte store starting at `-4096` occupies
`[-4096,-4088)`, not bytes below the frame's lower bound.

This is a caller-local analysis. It does not prove a callee cannot write through
an aliased pointer into a live region, nor does it recover the compiler's
pre-register-allocation frame objects or a complete path-sensitive memory proof.

## Locally available calling-convention evidence

The strongest binding is the machine code itself: the wrapper passes `r5=r10`
and its real callees load the matching negative offsets from the saved `r5`.
These are intentional caller-frame arguments, not callee-local accesses through
the callee's new `r10`.

Cached source at
`/Users/shawwalters/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/solana-sbpf-0.12.2/`
provides supporting VM mechanics:

- `src/ebpf.rs:31-36`: frame-pointer register 10; saved register range 6 through 9.
- `src/vm.rs:60-65,97-103`: default 4,096-byte frames and stack-frame gaps.
- `src/interpreter.rs:136-154`: save registers/frame pointer and advance `r10`
  for a fixed-frame internal call; the other argument registers remain available.
- `src/interpreter.rs:577-584`: restore the caller frame pointer and saved registers.
- `src/program.rs:28-32`: dynamic frames begin with SBPF version 1.
- `src/elf.rs:383-391`: flags zero select version 0 in this source version.
- `src/memory_region.rs:14-22,109-135`: mapped stack frames are separated by
  inaccessible gaps; mapping checks address bounds, not Rust object lifetimes.

Both reviewed candidate ELF headers have machine 263 and flags zero. However,
this cached crate has not been proven to be the exact implementation/configuration
inside the installed `solders 0.27.1` wheel or a current-chain runtime. Its source
is supporting convention evidence, not a runtime provenance certificate.

No LLVM backend source for the specific warning was located in the inspected
SDK/cache paths. The log does not include a call-site PC or frame-object dump.
The exact reason for the three warning emissions therefore remains unknown.

## Bounded execution evidence and remaining work

Previously saved evidence for `336b4330` passed 17,462 cases, 35,418 signature
fields and the full recorded-field comparison (`review-full-runtime.json`).
The `9445734f` saved full-corpus summary reports the same corpus totals, and its
sealed incentive packet records 700 selected focused cases plus 32 baseline
cases with 1,464 verified transaction records. These show successful loading and
agreement on those paths; they do not prove arbitrary stack/lifetime safety.

A stronger resolution would need the exact LLVM diagnostic/frame-object
provenance and bounded callee write footprints or path-sensitive stack tracing.
Do not discard the warning solely because the original wrapper has matching
instructions, and do not classify it as a newly introduced pool-helper defect.

## Artifact identities

- Original capture: `6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7`.
- `336b4330d7cceacc694fa208200afd07c970fbef73446066ed211406add30e21`.
- `9445734f9d3acd2ae48b1bd3ae1ef01a75b2227804bced8efbe401bf8ffc50ee`.
- Original wrapper raw-body SHA-256:
  `1ba581a0fb6dff4560d762af9cf969b1bfe3e38cfc452e44fe8d088b4fb72db3`.

Primary local evidence is the three named build directories, their
`build.log`, `build-comparison.json`, candidate and unstripped ELFs, the captured
original ELF, and
`repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py`.
