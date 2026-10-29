# Remaining sixth-source coordinate and object-shape audit

This read-only audit leaves the original/source/executable files untouched and proposes no patch. It is pinned to sixth candidatebe10 and reuses no data count as program-byte completion.

The12 genuine SourceLocation differences are six distinct records, in six fully normalized-matching bodies. Filenames all agree. Seven references share the U128 macro's one original`math.rs:14:1` record (current8:1). Two are split_buyback's expect sites (`global_config.rs:388:45/391:14`, current60:10/63:14). The remaining three are BuyEvent's event macro (233:1/current3:1), GlobalVolumeAccumulator's account macro (8:1/current3:1) and UserVolumeAccumulator's account macro (25:1/current13:1). These are real metadata differences, not missing arithmetic implementations. The verifier rechecks every full body and actual descriptor and rejects a wrong filename as a coordinate-only explanation.

The present source confirms that BuyEvent lives alone in`instructions/swap/buy.rs`, while the account/legacy execution remains in`legacy_buy.rs`. This is a concrete logical-module hypothesis for a future source reconstruction; it does not establish which declarations preceded original line233. GlobalConfig declarations/serialization remain in`state.rs` while methods live in`state/global_config.rs`; consolidating that type is another plausible logical-module hypothesis, but the record positions alone do not prove the missing order. The volume macros' line gaps can be explained by imports, documentation or formatting because their complete generated bodies already match. U128's location belongs to the invocation, so another uint dependency version is not a justified fix. No blank-line, comment, column or origin fitting is proposed.

A complementary allocation-symbol pass checks1,320 flat candidate-object spans referenced by the remaining unclassified set. All corresponding original byte ranges agree, including string literals. There is no newly discovered constant-value mismatch. These are candidate-defined spans: they do not prove every original allocation boundary.280 reference observations lack a candidate object-start symbol; they include shared scalar/string pools and constants already covered by exact read extents. Their adjacent bytes often differ, so guessing a64-byte object from a pointer would be invalid. The earlier complete static arrays, StringError vtables and80-byte token enum proofs are not recounted as new recovery.

The verifier includes byte-tail and pointer-offset negative controls plus actual equal alias checks. Full ELF layout, allocation boundaries without symbols and source-coordinate identity remain open.

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-sixth-origin-shape-next-20261027/verify.py --root "$PWD"
```

Explicit candidate/symbol paths are accepted; default paths point to the immutable quote-guard checkpoint. The source snapshots are context evidence only and are not compiled.
