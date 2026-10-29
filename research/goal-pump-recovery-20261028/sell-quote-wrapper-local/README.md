# Maintained Pump Main reconstruction

The [selected composed source](../../research/pump-program-creator-notice-qualification-20261028/README.md)
retains 1,019/1,035 normalized and 188 raw windows. Sixteen windows and whole
meaningful ELF identity remain unresolved. It preserves the used creation
boundaries, common admin wallet validation/CPI order, legacy payment/event
ownership, and multi-hop quote-fee snapshot/shared vault admission. It retains the two original
`BondingCurve::accrue_fees` calls and post-fill stores. The latest correction
restores the original program-creator notice in admin CTO.

Two actual source builds repeat both complete outputs: an ordinary build with
fresh local crates and an independent portable build from an empty target.
Their stripped output is
`d0377d7cef5b7378063f8bfabac5dc9c08d29eeaaaaa14022d36909688ff5e1b`
and symbols are
`0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6`.
The 65 standalone inputs map to 66 compiler-workspace inputs. The cold build took
62.437 seconds and authenticated 254 locked registry archives and 4,176 source
files, using native macOS v1.44 tools and authenticated Linux v1.44 SBPF libraries.
Inputs are checked before and after compilation.

Twelve synthetic counter fixtures provide 36 signed executions and captured
loader observations. Original and new images agree on state, errors and ordered
logs; the prior selected `199fd` image differs only on three Source lines. The
creator-counter overflow now reports the original `lib.rs:2554` location instead
of `multi_hop_curve_swap.rs:64`. These starting states are synthetic; their
mainnet reachability is unproven. This diagnostic correction adds no exact
function window.

A separate signed fixture uses the authentic Fees program as creator, with
executable program metadata and a distinct payer/admin. Original and new images
emit the same 45-byte notice before AdminCtoPool; the previous C0 image omits it.
All checked state, events, errors and return values agree. Three executions,
six signature fields, three literal captured Main loads and one distinct signed
wire are independently verified. This is finite synthetic evidence, with no
claim about reachable mainnet state or historical Rust spelling.

The selected image passes all 44 maintained suites: 10,468 paired cases,
18,343 serialized transaction fields and 27,875 signature fields. The strict
whole-log audit preserves every ordered line, including Source coordinates,
except complete runtime compute-meter lines. The public replay controller
applies this check to each fresh shard; the frozen broad diagnostic policy
remains unchanged. The strict focused corpus has 106 case records, 318 outcome
executions and 465 signature fields: 61 sibling cases, 14 creation cases,
18 admin cases and 13 multi-hop cases. Separate strict legacy284 and extension126
pairs also pass. These overlapping corpora and repeated fields are not unique
transaction counts.

The same fourteen creation fixtures also pass a separate unchanged-adapter replay
through the genuine captured Pump loader: 42 signed executions, 84 signature
fields and 42 captured allocations. This supplements the direct creation replay.
The [historical acc5 control](../../research/contract-completion-20261028/known-admin-wallet-guard-acc5.json.gz)
retains its eight failing admin witnesses; all 18 witnesses pass on the selected
image. The multi-hop admission counterexamples also retain the original
Source31/55/81/369 observations through the captured AMM.

Inherited deliberate blank-line Source alignment remains a reconstructed recipe
choice; historical Rust spelling is unproven. Diagnostic normalized CFG pairing
and callee attribution award no raw blocks or complete function matches. Full
meaningful ELF equality remains false.

```sh
python3 -O -B scripts/verify_current_checkpoint.py pump
python3 -B research/pump-program-creator-notice-qualification-20261028/build.py \
  --source-directory programs/pump --sdk /absolute/path/to/native-v1.44-sdk \
  --cargo-home /absolute/path/to/authenticated-cargo-home \
  --target-library-profile linux-v1.44-sbpf \
  --target-libraries /absolute/path/to/linux-v1.44-sbpf-libraries \
  --wrapper research/pump-program-creator-notice-qualification-20261028/tools/pump_physical_source_wrapper.py \
  --target-directory work/new-empty-pump-target --output work/new-pump-build
```

The published builder is byte-identical to the executed cold controller, with
explicit source/image expectations. Actual compiler receipts and compiled
workspace archives retain their executed path prefixes and bind the public
runtime controller. Precursor proofs keep their own source and image identities,
including the [previous composed selection](../../research/pump-final-composition-673-20261028/README.md).
The [prior maintained README](../../research/contract-completion-20261028/pump-readme-before-closure.md)
remains historical documentation.
