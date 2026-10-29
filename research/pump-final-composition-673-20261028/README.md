# Qualified Pump source composition

This proposal composes the recovered create-v2 boundaries, legacy ownership/fee-call structure, admin common-wallet guard, and PR673 multi-hop quote-fee snapshot/admission fix. The source is a frozen 65-input Rust snapshot. It preserves all **1,019/1,035 normalized windows and 188 raw windows**, with no membership gains or losses. Sixteen windows remain unmatched; neither whole-function identity for the changed handlers nor whole-ELF identity is claimed.

The three-file [source patch](source.patch) is against the independently qualified acc5 create frontier. The legacy `buy.rs` change restores unconditional protocol-fee dispatch, creator-fee branches, and observed event copy ownership. The admin file is byte-identical to qualified admin27. The multi-hop file is byte-identical to PR673's qualified source: its retained parent file was byte-identical to the frozen legacy/admin composition, so no patch conflict or unreviewed merge was introduced. `SOURCE-FROZEN.json` records this construction and all 65 input hashes.

The existing reconstructed diagnostic layout is inherited, including deliberately aligned blank-line runs in create and other prior sources. PR673 preserves all 931 physical source lines. Signed strict replays observe matching diagnostics, including actual `line!()` sites; this does not establish historical Rust source or file-layout recovery.

Two actual ordinary Cargo builds freshly compile both local crates while explicitly reusing authenticated external dependencies. They repeat both complete outputs literally: stripped `199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473`, symbols `49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680`. Their actual source-before/after records, staging inputs, complete compiled workspace archives, executed controllers, Python mapper/tool bytes, physical source wrapper, compiler commands, and output images are retained. These warm dependency builds are not relabeled as cold builds. An independent empty-target portable successor reproduces both hashes in 54.954 seconds and is sealed separately at `research/pump-final-composition-cold-20261028` (manifest `df461b8b5fd3ca0be4c842de1e8ab84cbb150a7b5f5fd89de26056d7dd3ea1f1`). The published portable builder is byte-identical to that actual executed cold controller; only explicit input JSON supplies this source and the expected outputs.

The selected image passes the unchanged 44-suite captured-loader corpus, 10,468 case pairs and 10,464 broad diagnostic cases, with independently verified signatures. Broad diagnostic comparison excludes Source coordinates; focused diagnostics preserve them. The focused controller additionally runs 61 sibling cases, 14 create cases, 18 admin-wallet cases and 13 multi-hop cases: 106 strict case records, 318 outcome executions and 465 signature fields. It also runs the unchanged 284-case legacy corpus and 126-case Token-2022 extension corpus. Signature-field counts are serialized report fields, not unique transactions. The prior 65 focused cases contain four PR616 cases already included within the 14 create cases; they are not counted twice.

The legacy function remains unmatched at its original 13,224-byte size. Diagnostic CFG attribution pairs all 162 blocks injectively; 161 diagnostic normalized block bodies agree after CALL/LDDW normalization, and the remaining normalized body has two independent loads in reversed order. Physical block order also differs. This diagnostic is not the acceptance normalizer and receives no exact-window credit. The multi-hop function also remains unmatched despite its qualified behavioral correction.

All transactions are local, normally signed synthetic transactions using genuine captured dependencies. The broad44 and sibling/admin/legacy/multi-hop/extension replays use the captured Pump loader. The original create-only 14-case report used the direct LiteSVM loading API and is preserved unchanged. The separate `research/pump-create-captured-successor-20261028` supplement now reruns that unchanged adapter through the genuine captured loader: all 42 signed executions, 84 signature fields and 42 captured loads pass with zero strict Source/log or structured differences. No live transaction is submitted. Matcher rules, original images, compiler inputs and compiler outputs are not patched.

Use the pinned repository Python requirements. Static verification also accepts the selected maintained primary source path:

```sh
python -B research/pump-final-composition-673-20261028/verify.py \
  --source-directory programs/pump --signatures
```

Fresh focused replay and its independent checker accept explicit candidate/output paths:

```sh
python -B research/pump-final-composition-673-20261028/replay_focused.py \
  --candidate /path/to/selected.so --output work/pump-final-focused
python -B research/pump-final-composition-673-20261028/verify_focused.py \
  --candidate /path/to/selected.so --reports work/pump-final-focused
```

The self-contained [portable builder](build.py) accepts explicit native v1.44 SDK, official Linux-v1.44 target libraries, Cargo home, physical source wrapper, new empty target and new output paths. It authenticates locked registry archives and actual extracted sources, SDK tools/libraries, the source profile, the source staging, and both whole output hashes. Historical absolute paths in actual receipts describe those executions; they are not portable recipe prerequisites. `PUBLISH.json` provides the source, actual comparison receipt, compiled-workspace archive, selected images, census, runtime and controller paths for integration.

`CORRECTION.md` preserves the prior manifest identity and states the narrowly corrected loader scope. The supplemental captured-create controller/checker paths are included in `PUBLISH.json`; no earlier source, compiler or runtime proof is rewritten.
