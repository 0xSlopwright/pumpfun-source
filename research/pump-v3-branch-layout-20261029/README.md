# V3 costs branch-layout source control

A one-line Rust change over the final V3 costs source from PR831/896 removes
the extra unconditional branch after the second `add3`. The original uses a
tag load followed by `JNE` to its error tail. The previous candidate uses
`JEQ` to success plus `JMP` to error; this candidate uses the original branch
polarity and fallthrough form.

```rust
let second;
if let Some(p) = post {
    second = add3(p.quote_in, p.fees.protocol_fee, p.fees.creator_fee)?;
} else {
    second = 0;
}
```

The actual patch keeps this on physical line373. It replaces the expression-form
`match`; arithmetic, `?` propagation, and physical error locations are retained.
Apply [source.patch](source.patch) to the archived final source in
`research/pump-v3-costs-source-20261029`, not to a different selected workspace.
The complete 66-file parent archive and candidate file are included here.
Compressed source and report files preserve their exact original bytes, including
line endings and pre-existing source whitespace.

| Image | Target bytes | Aligned differing slots | Normalized / raw windows |
| --- | ---: | ---: | ---: |
| Original `0x80df8` | 2,120 | 0 | reference |
| Same-recipe parent | 2,144 | 25 | 1,019 / 186 |
| Statement-form `if let`, two builds | 2,136 | 23 | 1,019 / 186 |
| Rejected `map`/`transpose` control | 2,136 | 61 | 1,019 / 186 |

The slot count is `SequenceMatcher(autojunk=False)` on eight-byte chunks after
the existing narrow CALL/LDDW normalization. It is an alignment diagnostic,
not completion credit. All 1,035 actual original-window memberships are
recomputed and unchanged. The two candidate symbol ELFs are byte identical:
`6c84199027e127ab72809f4b9b359609f0e30e1992af754a5b47ac96ce8ed229`.
Only the costs normalized symbol class changes between parent and candidate;
the verifier preserves multiplicities when grouping symbol variants. Their
complete `.rodata` sections are byte identical.

All 17 direct call sites retain original order through ten complete
normalized-equivalent callee classes. All 16 bounded data-reference sites retain
original classes/content and order, including source locations, bounded strings
and vtable fields. This is a one-hop audit; masked operands inside those callees
are not recursively closed.

## Compiler evidence and recipe qualification

The retained native final trace from PR909 has IR block95 branch to success110
or error113 while block103 is next. Its first saved machine state contains the
two-branch form. Later placement makes success110 adjacent but keeps both branches.
The pinned LLVM `08aedd64bf3abe4f163407b7bcf680403b84b32d` source explains a
constraint: `SelectionDAGBuilder::visitSwitchCase` initially inverts when the
true successor is next; `SBFInstrInfo::analyzeBranch` cannot analyze conditional
branches. `MachineBlockPlacement` gates terminator updates and inversion on
successful analysis. The packet checks the source blobs and saved transitions.
This is static source/trace correspondence, not a new internal compiler trace
or proof of a unique historical Rust spelling. No compiler was patched.

The actual controls use the existing Windows v1.44 compiler and qualified Linux
target libraries, with a reused dependency cache. The archived parent differs
from the earlier exact-SOL workspace only in three root-crate Rust files; Cargo
inputs and dependency-crate sources are unchanged. Source, tool and dependency
inventories were checked before/after each retained selected build. This is
neither a cold build nor a new native Mac qualification. The Windows raw cohort
of186 is not credited as a gain over the published Linux183 or Mac188 cohorts.

The initial data audit failed because Windows embedded backslashes in source
filenames. Its two original inputs, failed log and diagnostic report are retained.
A forward-slash root argument fixed `lib.rs` but left a mixed separator in the
module path. The final recipe uses `programs/pump/src/lib.rs` plus this exact-file
compiler remap in **parent, candidate and repeat**:

```text
--remap-path-prefix=programs/pump/src\trade_v3.rs=programs/pump/src/trade_v3.rs
```

These are explicit compiler inputs, not post-build edits or comparison masks.
They fix the bounded filename comparison; they do not establish original whole
ELF identity. The source-only body improvement was also observed and repeated
before these path controls. Eight local root compiler invocations were used:
baseline, rejected transpose, statement control/repeat, root-path control,
and final remapped baseline/control/repeat. This packet fully replays the final
three, the rejected body's diagnostic, and the original audit failure. Other
preparation receipts remain local. The independent native packet's two-build
allowance is untouched.

## Saved verification

From the repository root:

```sh
python -I -B research/pump-v3-branch-layout-20261029/verify.py --repo-root .
python -I -B research/pump-v3-branch-layout-20261029/tests/test_verify.py
```

Both entry points refuse optimized Python before importing retained assertion
readers. Verification uses only the original ELF and the pinned selected-window
catalog outside this packet. It checks the seal, exact source delta, literal
commands/environment, receipt/output/log bindings, repeat equality, census sets,
all symbol classes, branch bytes and the complete bounded operand audit. It
does not reopen historical private SDK/cache paths, execute a controller,
compile, or run SBF. Receipts establish stored-evidence consistency, not
cryptographic attestation of compiler execution.

No VM/transaction execution, behavioral qualification, complete-window gain,
canonical selection, allocation-image identity or security claim follows.
The remaining 23 aligned slots, including return-pointer lifetime and error-tail
differences, still prevent a complete match. This source candidate is independent
of the V3 key-copy and open fee-tuple wrapper proposals; no composed build is claimed.
