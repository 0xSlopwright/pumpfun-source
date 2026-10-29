# Pump exact-SOL load-order diagnostic

The four-byte residual in PR #743 is sensitive to the order of two independent
LLVM aggregate extracts. With the pinned SDK LLVM source and an unchanged
compiler, swapping just those two IR lines reverses exactly the two remaining
loads at original `0x151438` / `0x151440`. All 144 target relocation records stay
identical. This gives the remaining source/compiler investigation a precise
code-generation requirement.

**This is a diagnostic IR counterfactual, not recovered Rust source.** No
maintained source, selected image, reconstruction count or allocation image is
changed. No executable is promoted and no target program is executed. The
original private source and deployment compiler remain unknown.

## Qualified inputs

The source is the sealed PR #743 candidate based on maintained revision
`097c29aee55d0616df64260aa8635a536e759ec8`, with all 66 workspace hashes retained.
It is not relabeled as the later program-creator-notice composition.

A fresh Windows v1.44 build, with Linux v1.44 target libraries and 254 locked
registry archives, ran 210 rustc commands with no reused Cargo artifacts. Its
target has the same four normalized differences as the published Linux control.
A passive pass capture produces the identical complete ELF
`6c1dfdfb12e477f1b427ef4d581d2734306608053585ca62b895c5a075ec4119`.
The bitcode/object emission run preserves every section except `.symtab` and
`.strtab`, including literal target code and relocation contents. Its complete
ELF comparison fails; that failure and the strict producer assertion are retained.
These Windows builds do not reproduce the published Linux or macOS full ELF.

The diagnostic LLVM is built from SDK-declared Rust revision
`08b7341888ab480dfaaa0698300cbbbbb2d75b53`'s LLVM gitlink
`08aedd64bf3abe4f163407b7bcf680403b84b32d`. The unchanged source builds as LLVM
18.1.7 with assertions enabled, SBF only. Thirteen source files are checked
against independently obtained Git blob IDs; the complete staged source
inventory, archive receipt and actual build commands are retained. Diagnostic
binaries and the 206 MB source archive are not duplicated in this packet.

The correct invocation explicitly supplies `-mcpu=generic` and
`-mattr=+store-imm,+jmp-ext` from the stock target specification. This backend's
`getSubtargetImpl(const Function&)` returns its shared subtarget, so the function
attributes alone did not configure the required global features. Two initial
controls without those flags produced 13,784-byte targets and are retained as
failures. Correctly configured diagnostic LLVM reproduces the stock **13,224-byte
object body and all 144 relocation records exactly**; the whole module object
is not byte-identical and is not claimed to be.

## Observed scheduling mechanism

The stock pass capture has 392 snapshots. The last LLVM snapshot extracts the
error tag before the payload after the Source133 `with_values` call. The first
machine snapshot already loads payload before tag. The rebuilt diagnostic
compiler exposes the intervening bottom-up scheduler:

| Input | First export selected | Next selected load | Later selected load | Final load order |
| --- | --- | --- | --- | --- |
| Unchanged IR | tag | tag, step 3 | payload, step 5 | payload, tag |
| Two extracts swapped | payload | payload, step 3 | tag, step 5 | tag, payload |

The diagnostic log explicitly records a register-pressure difference of `-1`
for the first selected load versus `+1` for the other export. This is stronger
than inference from final disassembly. It does not identify the internal
tie-break that initially selects between the two export copies, nor establish
which IR the original deployment compiler received.

An unedited `llvm-extract` function retains identical instruction bytes. Its
relocations keep their sites, types and addends; 41 data symbol names lose their
`.L` local prefix. Internal call symbol names are unchanged. This extraction is
qualified only for the stated code-generation comparison, not linked data or
callee closure. Tracing leaves its complete object unchanged. A recorded
`llvm-dis` repeat reproduces the unmodified text control byte-for-byte.

Swapping the adjacent named `extractvalue` instructions changes exactly four
bytes in slots 1003/1004. The counterfactual has the captured original's complete
narrowly normalized function bytes, masking only the same 101 internal-call
immediates and 43 section-pointer LDDW operands. This result belongs to edited
diagnostic IR; it is **not an additional source-recovered function**. The next
step is a justified Rust/source-provenance route to the required extract order,
not a post-link patch or broad scheduler-flag sweep.

## Replay

With Python 3.11+ and this repository's original Pump image and PR #743 packet:

```sh
python -B research/pump-exact-sol-scheduler-20261029/verify.py --repo-root .
python -B -m unittest discover -s research/pump-exact-sol-scheduler-20261029/tests
```

The standard-library verifier checks saved source/tool bindings, compiler Git
blobs, object/relocation comparisons, the exact two-line mutation, observed
scheduler decisions and the original-byte comparison. It builds nothing and
executes no VM. Saved receipts are consistency evidence, not cryptographic
execution attestation. Exact local producers retain their original paths;
they are not a portable fresh-build command. A failed LF-only preflight on
Windows CRLF output is also retained; it ran no compiler command. An initial
disassembly repeat used an absolute input path and differed only in the
`ModuleID` comment. That failed byte comparison is retained; repeating the
original relative input spelling then reproduced the entire text exactly.

Compiler sources retain their upstream Apache-2.0-with-LLVM-exception license
in `compiler/LICENSE.TXT`. Reconstructed program inputs retain the repository's
existing attribution through the sealed source packet.
