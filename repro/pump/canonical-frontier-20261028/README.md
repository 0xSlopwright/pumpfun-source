# Maintained Pump frontier — 28 October 2026

The ordinary maintained source in `programs/pump` now composes the qualified semantic frontier. The final image retains **1,019/1,035 normalized windows, 188 raw bodies and 1,611,088/1,792,208 original text bytes**, with the same 16 residual windows as PR569. This integration adds no newly matched window. Whole meaningful-ELF and full-file identity remain false.

## Source and build mapping

`composition-final.json`, `from-semantic-union-final.patch` and `compose.py` bind the complete authenticated PR569 semantic union and the additive changes:

- Direct generated FeeConfig typing at the actual MultiHop and SellV3 account boundaries. The earlier eight-line L36 patch is adapted to nine active use-site lines: `select_fees` was already replaced by two `get_fees` calls. The local manual FeeConfig/read_config type remains distinct. No aggregate-conversion adapter is introduced.
- PR588 costs Overflow operations at Source371/375 and its real callback at382.
- PR570 recipient validation before quote-mint parsing.
- PR616 rejected create quote-mint Left/Right public-key payloads; its reconstructed Source70 versus original220 remains explicitly unresolved.
- PR595 admin Source records and PR619 holder destination/frozen-vault validation order.
- PR627 the actual shared buyback operation and original `lib.rs:1936:45`/`:1939:14` panic provenance. The composition preserves PR588's byte-valued mayhem boundary and converts its predicate to boolean within the existing branch.

PR569 already includes the checked cashback decoder/legacy sell boundary, quote-program/Clock admission, V2 whitelist synchronization, multi-hop crossing guard, sweep recipient validation and V3 sell ordering/event corrections. PR626 independently requalifies the V2/crossing behaviors on L41; those operations are already present here. Copying all of L41 would regress several independently qualified PR569 corrections, so its complete tree was not substituted.

`promotion.json` records the canonical transition and `627-promotion.json` its final shared-helper layer. The two obsolete unused canonical files `src/distribution.rs` and `src/set_creator.rs` are replaced by the already compiled creator-module paths; the nested `pump-token-ext` crate is added. `previous-primary.tar.gz` retains the 65 prior inputs. No shared AMM crate or global workspace file is changed.

`primary-source.tar.gz` binds all **65 canonical inputs**. The maintained standalone crate owns its release profile and empty Cargo workspace. Staging moves only that profile and lock to a parent workspace, producing **66 actual compiled inputs**; both complete staged source archives and genuine invocation receipts are retained. Rust, IDLs and local dependency source bytes are unchanged by staging. Inherited synthetic Source layout is explicitly retained, not claimed as recovered historical formatting.

Two fresh builds of both local crates, with unchanged reused external dependency artifacts, produce identical complete ELFs. A separate portable build starts from an **empty target**, authenticates **254 locked registry archive checksums and 4,176 actual registry source files**, freshly compiles dependencies and both local crates, and produces the same complete images. SDK tools, Rust libraries, the admitted Linux-v1.44 SBPF library profile, wrapper and source inputs are checked before/after. The first registry-authentication attempt rejected duplicate cache aliases before compilation; the corrected controller authenticates every alias against the same locked checksum. That rejected control is retained.

- Stripped: `1d031f64b9656ba572817c20a46e0bcb3d43716fee4c857d9b59447724a28904`
- Symbols: `c1ae752d631721c468191a8f49df9fbbde292a0e36a914e2788c89a11ac8bf73`

The measured compiler cohort is native Darwin v1.44 with the official Linux-v1.44 `sbpf-solana-solana` target libraries. This is not a native Linux-host rebuild. `portable-build/` preserves the exact portable controller and cold receipt. `builds/` preserves the exact earlier local-controller bytes and cached-build receipts; those are not relabeled as cold builds.

## Exact-image qualification

The unchanged captured-upgradeable-loader corpus passes **44 suites / 10,468 paired cases**, with zero structured mismatches and zero diagnostic mismatches in 10,464 log-bearing cases. The broad diagnostic audit excludes Source coordinates and compute usage. Its saved serialized observations contain **18,343 transaction fields / 27,875 signature fields**, independently reverified; these are not unique-transaction counts or total VM-execution counts.

The same exact image passes **65 additional focused cases / 195 outcome transactions / 258 independently reverified signature fields**: 20 shared-buyback panic cases, six cost overflow cases, 18 cashback precedence cases, five admin Source cases 12 shared-holder cases and four frozen signed create quote-key cases. These preserve their original stricter message comparisons, including the qualified Source/panic records and retained negative-control outcomes. The four create cases separately disclose and normalize only original Source220 versus reconstructed70; raw logs remain unchanged. Path-adapted historical producers change only import/baseline paths; their exact source replacements are recorded. The corpora can overlap.

Both actual generated FeeConfig paths are resolved in `direct-fee-config-chain.json`: MultiHop/SellV3 parsers reach the original-shaped 1,024-byte constructor, 744-byte checked decoder and 1,176-byte payload decoder. All **220 paired immediate call occurrences** from the bounded original/candidate graph are independently redecoded and checked. Arbitrary indirect calls, destructors and complete referenced-data identity are outside that proof.

## Verify and reproduce

Saved source, build, ELF, full census, actual call edges, runtime fields, captured-loader receipts and signatures:

```sh
python3 -B repro/pump/canonical-frontier-20261028/verify.py --signatures
```

The verifier API is `verify(repo, runtime=None, signatures=False, current_source=True)`. Current canonical input hashes are checked by default. The manifest authenticates every packet file. Verification neither compiles nor mutates maintained source.

Portable empty-target build, with explicit authenticated inputs and a new output directory:

```sh
python3 -B repro/pump/canonical-frontier-20261028/build.py \
  --source-directory programs/pump \
  --sdk /path/to/native-v1.44/platform-tools \
  --cargo-home /path/to/cargo-home \
  --target-library-profile linux-v1.44-sbpf \
  --target-libraries /path/to/linux-v1.44/sbpf-solana-solana/lib \
  --wrapper scripts/pump_physical_source_wrapper.py \
  --output work/pump-portable-rebuild
```

`--target-directory` can explicitly select a different nonexistent target directory. No cache seed, external research checkout, generated layout, SDK/registry patch, IR edit or postlink byte repair is used. The unchanged official profile helper creates a private SDK; the supplied SDK/registry remain unchanged.

Fresh corpus replay from the authenticated compiled-source archive, with a new output directory:

```sh
python3 -B repro/pump/canonical-frontier-20261028/replay.py \
  --output work/pump-frontier-replay --workers 4 --focused
```

It reconstructs the receipt's exact logical source path if absent and rejects conflicting existing files. It uses the genuine saved build report, not a fabricated historical receipt. Runtime Python dependencies remain pinned by the repository requirements.

Seven selector rejection controls cover optimized mode, source symlinks, ambient compiler overrides and Cargo configuration. Both published entry points reject optimized Python before relying on assertions.

The 16 residual windows are listed in `CHECKPOINT.json`. This is bounded offline integration evidence, not all-state equivalence, security acceptance, deployment or completion of the user's full reconstruction goal.
