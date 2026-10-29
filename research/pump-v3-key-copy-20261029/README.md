# Pump V3 buy accumulator key-copy recovery (partial)

One safe Rust source-line change restores the original eight-instruction key-copy block in `v3_execute_buy` (original `0x83c00`). The sequence-aligned, narrow-normalized eight-byte-slot difference falls **126 -> 118**. The complete target remains unequal: original 3,440 bytes, parent and candidate 3,408. The full local Linux census remains **1,019/1,035 normalized and 183 raw**, with every parent's membership preserved.

## Source and mechanism

Apply `source.patch` to the maintained 66-file compiled workspace qualified by `research/pump-program-creator-notice-qualification-20261028`. Both exact input archives and readable before/after files are retained. Only `programs/pump/src/trade_v3.rs:701` changes:

```rust
if a.user_volume_accumulator.user==Pubkey::default(){a.user_volume_accumulator.user.as_mut().copy_from_slice(a.user.key.as_ref());}
```

The previous assignment obtained a copied `Pubkey` through `Signer::key()`. The qualified parent IR emitted a 32-byte `memmove`; its machine block loaded all four words before storing them. The new expression borrows the existing `AccountInfo.key` through `Signer`'s dereference and copies its byte slice directly into the destination key. Both slices are exactly 32 bytes, and the existing zero-key guard stays in place. This introduces no new arithmetic or possible slice-length mismatch and preserves the error-site physical line count. The same assignment in the other handler remains unchanged.

The candidate now emits the original backward interleaved load/store pairs at offsets 24, 16, 8 and 0. Candidate slots `[130,138)` are **raw-byte equal** to original slots `[133,141)`. These are the only raw differences between parent and candidate target bodies. Candidate IR was not captured; the actual machine instructions, source and normal build qualify this result. No assembly, IR, binary or compiler-flag edits were used.

The aligned slot count is a diagnostic (`SequenceMatcher`, `autojunk=False`) after unchanged official narrow normalization. It is neither a positional byte count nor a percentage of completion. There is no new full-function match.

## Reference and build checks

All 22 direct calls preserve original order through 18 distinct complete normalized-equivalent callees. Their full raw bodies remain identical between parent and candidate. All target call/data reference offsets and values are identical between parent and candidate, including eight data sites. The entire referenced `.rodata` and `.data.rel.ro` sections are byte-identical between those two builds. This does not claim original whole-data identity or recursive call/data closure.

Both actual normal Cargo builds of the candidate produce identical complete symbol and stripped files. Each contains one actual root compilation and unchanged input bytes. Dependency targets are reused, so these are not empty-cache builds. The unchanged maintained controller, exact Docker/Cargo arrays, source/tool hashes and compressed build logs are retained. Its historical Pump673 scope label is preserved; the actual input hashes bind the newer creator-notice workspace.

The parent source archive is the same qualified source used by `research/pump-v3-costs-source-20261029`, pinned at `49d07973846893ac42df69ef9008a54b17f5b5bd` and unchanged at `03bcf6a0b8162919a72b884869850abf342aa9d3`. That costs source patch is independent and is not included here. The published native Mac cohort has 188 raw matches; the Linux parent already has 183. This pre-existing host-cohort difference is not a candidate regression or a claim of native build identity.

## Focused local execution

The final retained run contains **28 original/parent/candidate triples, 84 verified signed executions**. Two successful SOL `buy_v3` cases use the existing signed captured-loader fixture with only the 32-byte accumulator user field explicitly set to zero or to the signer key. The observer asserts the initial field, success, and final account field equal to the verified transaction's signer. The zero case exercises initialization; the existing-key case preserves its value. Exact pre/post observations agree across all three images.

The other 26 cases reuse six cost-arithmetic boundaries and twenty V3 buyback/panic controls. Errors, accounts, CPI, events, return data and ordered logs agree; only complete compute-consumption log lines are excluded. The two post-complete controls end in Overflow and do not prove fit-helper execution. This is bounded execution evidence, not full program equivalence or deployment qualification.

Actual loader records bind the loaded ELF bytes, captured ProgramData header and zero allocation tail. There are 85 loader records in the final run, including one fixture-initialization load. Repeated signatures do not imply 84 distinct transaction wires. `verify.py` independently checks the stored wires, content hashes and comparisons; it does not attest VM execution.

Earlier import attempts are retained under `analysis/import-attempts/`. The first stopped before VM execution because a neighboring `inspect.py` shadowed Python's standard module. The second completed the two and six families before the twenty-family import lacked the scripts directory. The final run uses `PYTHONSAFEPATH=1` plus an explicit trusted scripts path, completed all three producers, and preserved every input hash.

## Reproduction

From the repository root, verify the retained packet without compiling or running a VM:

```sh
python -B research/pump-v3-key-copy-20261029/verify.py --repo-root .
python -B research/pump-v3-key-copy-20261029/audit_refs.py --repo-root . --compare-retained
```

Python 3.12 and `solders==0.27.1` suffice. The verifier rederives exact source changes, build input joins, identical repeat images, the eight raw copy slots, complete census memberships, signatures, loader allocations and both copy-state assertions.

For a fresh build, use the unchanged maintained recipe and supplied source archive. `build/*/launch.json` retains executed arguments and tool hashes; `controllers/local_build.py` and `pump_physical_source_wrapper.py` retain the controller. The image is pinned to `solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50`, platform-tools v1.44, offline locked dependencies and read-only source/SDK mounts. Map historical local paths to equivalent prepared SDK/cache/source locations. Build labels were `execute-key-slice` and `execute-key-slice-repeat`.

`runtime/execution.json` retains the exact local replay commands and input hashes. The two-state observer and unchanged producers are in `runtime/inputs`; the captured-loader implementation is retained with them. Use the repository's captured evidence and compatible solders runtime, with explicit trusted imports as recorded. No live RPC, production transaction or dependency download was used.

Remaining target differences include earlier account/argument setup, stack offsets, error paths and later transfer flow. No further source-variant sweep was performed.

## Qualification follow-up

The verifier now reuses the finite correspondence checks accepted in PR896 for the related V3 costs packet. It pins the independently qualified 66-file source parent, joins source maps to archives and build controllers to launch receipts, retains the exact executed script/fixture bytes, and checks all 26 runtime input hashes and sizes against their actual receipt. Every one of the 28 case definitions and 84 signed instruction/account layouts is reconstructed from those fixed inputs without importing a producer or VM. The two copy cases additionally bind the complete initial accumulator data and metadata to the fixed fixture's zero/signer variant; signed payer and resulting user bytes are checked together.

The saved suite retains all nine author controls and adds the six root-review controls and one independent peer control (16 coherently resealed semantic controls total), plus a clean positive and early optimized-mode refusals in all three checker entry points. The substitutions cover common source, complete case membership, signed wires, synthetic prestate/lamports/vault data, both copy-state obligations, complete accumulator prestate, actual image inputs, and coherent curve-owner replacement. Every mutation reseals all ten output receipts and the manifest before reaching the independent checks. The focused source-owned curve/global/fee-config metadata are now bound alongside user, base-vault and copy-accumulator metadata. The original nine author controls and the root six were independently accepted by their prior weaker verifier; the curve-owner substitution was accepted by the first root repair. Run them with:

```sh
python -B research/pump-v3-key-copy-20261029/test_verify.py --repo-root .
```

This follow-up changes no source patch, build, binary, or runtime observation. It performs no new compiler or VM run. Historical paths and original input copies stay intact; `runtime/executed-scripts` identifies the exact scripts actually used, distinct from the earlier retained input copies.

The reader integration preserves the externally published `63ace12e` fixture gzip container (SHA-256 `4c04dc8898a2bf83361f406d0360c39e8eb02677b2bf0775816157b8121cb3e6`). Its decompressed bytes are exactly the original executed input (SHA-256 `54d69dd4f11a61cc6cea3076e3e89fd4aa31ea6ff835f8ea316646a7b1642920`), equal to the earlier root-review container. The verifier also pins the reviewed literal Cargo arrays and tool hashes, checks all ten output receipts, and refuses optimized mode in all checker entry points. No historical producer, report, source archive, ELF, or runtime observation is changed by this integration.
