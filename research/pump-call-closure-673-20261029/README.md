# Pump673 actual-call closure of the maintained window census

The maintained Pump inventory matches complete instruction windows after narrowly
normalizing CALL/LDDW address operands. Those matches alone do not identify the
actual callees or imported functions. This packet independently decodes the
captured and selected images, authenticates every published candidate match, and
retains the complete original/current call graphs and every match's actual call
bindings. It also computes conservative direct and depth-two filters, preserving
all failures, aliases and unknowns. **Official Pump coverage remains 1,019/1,035
normalized and 188 raw. No source, ELF, normalizer, compiler flag or layout changes.**

## Frozen inputs and prior work

The exact selected image is composition673 at repository commit
`1285b5e9e3a29c1e2cf32246d6046035e5d66fad`. This contribution branches from current
main `219e8502f012a379d86ce92bc602abfa081b8b3a`; the frozen packet is unchanged.

| Input | SHA256 |
| --- | --- |
| Captured Pump allocation | `7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d` |
| Selected symbols ELF | `49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680` |
| Selected complete inventory gzip | `c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d` |

The existing `research/pump-window-analysis-20261028/call-graph.json` records the
original image's 10,591 inter-window calls. It does not bind current candidate
callees, imported relocation names, call-site bytes or two-edge closure. The
selected composition's `analysis/analysis.json` contains a separate 101-call legacy
handler audit. Existing scoped round37 and later helper/caller proofs remain
unchanged and retain their recovery credit. This packet supplies the missing
whole-census cross-image qualification, rather than claiming those recoveries.

## What the complete graph contains

`call-closure.json.gz` retains all 1,035 original window records and 1,045 selected
function-entry records, including aliases, complete physical body sizes/hashes,
and every decoded call. Each of the 2,360 published normalized candidate records
has its original/candidate call sites, exact eight-byte instruction, signed target
or ELF relocation symbol, callee status and qualification filters.

There are 2,313 distinct original-to-candidate-address pairs: 47 extra symbol-alias
records name the same physical candidate entry. All 2,360 records are preserved.
Reuse of the physical graph requires identical complete edge/byte data; it does
not choose a symbol name as the original source identity. Of 246 windows with
multiple candidate records, 223 have multiple physical candidate addresses.

The original's 11,005 total call sites comprise 10,591 internal relative calls,
269 undefined-symbol imports,144 register-indirect calls and one defined-symbol
call relocation. The earlier 10,591-edge graph is therefore a subset of this
explicit call accounting.

For each published normalized match, the verifier:

1. Recomputes both complete body hashes, checks the actual named symbol's size,
   and recomputes the narrow official-normalization result. Registers, branch
   displacements and ordinary immediates remain unmasked.
2. Pairs calls at the identical physical instruction offset, without sequence
   alignment, block renaming or reordered-call assumptions.
3. Resolves each internal relative call as `PC+8+signed_immediate*8`. Complete-callee
   membership requires its actual original window boundary and actual selected
   entry to be an authenticated inventory pair. Raw equality is separate.
4. Reads each call relocation's actual symbol table and compares undefined import
   names. Equal placeholder call instructions are insufficient.
5. Preserves register-indirect calls and the defined `custom_panic` relocation as
   unqualified boundaries. The latter's actual symbol metadata is retained; this
   packet does not claim the runtime relocation/registration step was reproduced.

## Results and limits

These are **candidate-record edge counts**, not independent runtime observations
or additional matched functions. Aliases and ambiguous candidate alternatives can
repeat physical edges.

| Actual paired edge status | Records |
| --- | ---: |
| Actual target is a complete normalized callee member |11,124|
| Same named undefined import |266|
| Different complete callee |517|
| Different imported function name |14|
| Target belongs to a known unmatched original window |21|
| Same register-indirect encoding, unresolved target |152|
| Defined-symbol relocation remains unqualified |1|

Of the 11,124 complete-callee membership edges, 3,686 point to literally raw-equal
callee bodies. The rest use the same narrow normalization as the maintained
inventory; this does not close data objects, aliases or indirect targets.

A candidate record passes the **direct filter** only when every outgoing edge is
a complete-callee member or the same named undefined import. It passes the
**depth-two filter** when it passes directly and every called internal pair also
passes directly. This is a bounded two-edge check, including finite recursive
edges; it is not an unbounded proof, a uniqueness assignment, or semantic parity.

- 1,855 candidate records pass directly; 1,663 pass through depth two.
- 753 candidate records have no calls and pass these filters vacuously. Excluding
 those leaves, 1,102 pass directly and 910 pass through depth two.
- 920 matched original windows have at least one directly passing candidate;
 802 have at least one depth-two candidate. Alternatives and failing candidates
 remain present; a passing alternative is not selected as a recovered identity.

These filters do not replace or subtract from the existing 1,019 normalized
instruction matches. They qualify a different, explicitly narrower claim about
actual call bindings. Imported-name equality does not authenticate the runtime's
implementation of that import. Neither filter checks argument semantics, complete
memory effects, ABI contracts, pointed-to data, signer/owner policy, runtime
behavior, security acceptance or a historical linker order.

## Concrete reviewable boundaries

The uniquely matched setter original `0x6fef8` → selected `0x8b1f8` has an actual
callee difference at `+0x18a8`. The original calls `0xd300`, a 448-byte body whose
published selected match is `0xd450` (`alloc::fmt::format `). The selected setter
actually calls `0x1ad880`, a 576-byte `alloc::fmt::format::format_inner`. The parent
still satisfies the official narrow normalized instruction comparison. This
packet preserves that boundary and makes no wrong-behavior claim. Its ABI and
source cause require separate attribution; no formatting-source variant is tried.

Another concrete ambiguity: original `0x1a04f8` calls the undefined `sol_log_data`
import. An instruction-identical normalized alternative at selected `0x1a4780`
references `sol_set_return_data`. The relocation identity distinguishes these
records even though the eight-byte placeholder call is literally equal.

The 21 known-gap edges include matched dispatch wrappers pointing into unmatched
business handlers, fit-post-completion's calls to the unmatched cost helper, and
legacy sell's unmatched cashback helper. The full edge records retain actual
symbols and sites; names alone do not prove the unmatched implementations.

## Portable verification

No SDK, compiler, VM or network is needed. From a checkout containing the existing
frozen inputs:

```sh
python3 research/pump-call-closure-673-20261029/verify.py
python3 research/pump-call-closure-673-20261029/test_verify.py
```

Both accept `--original `, `--candidate`, and `--inventory` for sparse checkouts;
all three inputs still require the exact hashes above. The verifier compares the
entire regenerated structured graph with the retained proof. Optional `--output`
writes a separate compressed result. Comparisons use decompressed content so
platform gzip-header differences do not affect portable verification.

Fourteen tests use the actual frozen inputs and graph mutations. They reject input
corruption, a reduced inventory, missing child records, conflicting same-address
aliases, and false depth-two closure after a child edge fails. They also preserve
different actual targets/imports despite normalized or raw placeholder equality,
known unmatched targets, indirect calls and non-entry targets. Register and branch
mutations remain visible to normalization. Graph mutations stay in memory; no
captured or compiler ELF is edited.

`VALIDATION.json` and `COMMON-PYTHON-CHECKS.json` bind commands/tool hashes and local
results. No compilation or VM execution is part of this evidence-only unit, and
all stopped execution lanes remain untouched.

## Per-window alias identity correction

The physical-pair map shares edge qualification across same-address aliases. The
per-window candidate list now keeps each original inventory symbol while using
that shared physical edge result. This corrects duplicated representative symbols
in 23 window lists and preserves all 47 alias extras. The complete pair graph,
actual call edges, direct/depth-two qualification, counts and input hashes are
unchanged. A regression checks every per-window candidate identity against the
exact inventory. Earlier validation files remain records of their stated heads.
