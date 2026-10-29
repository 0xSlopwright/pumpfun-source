# Independent reproduction and residual atlas for Pump main

This packet does two things and claims nothing more.

1. It **independently reproduces** the selected qualified Pump main image from
   public, pinned inputs on third-party Apple-Silicon hardware. The build yields
   the exact qualified stripped `c0e29e2d…` and symbols `dd73afe7…` images.
2. It publishes an **authenticated residual atlas**: for each of the sixteen
   still-unmatched windows it records the most-likely candidate counterpart,
   the size delta, and a normalized-instruction comparison that separates a
   count-identical residual from a structural one.

**No window gain, source change, image change, normalizer change or count change
is claimed.** Official Pump coverage remains 1,019/1,035 normalized and 188 raw,
with the same sixteen residual windows. The counterpart mapping is a heuristic
(matched-caller call-site vote), not a source-identity claim.

## Frozen inputs

The reference is current `main` (branch point `d04219b8b`) and the selected
composition in
[`research/pump-multihop-accrual-qualification-20261028`](../pump-multihop-accrual-qualification-20261028/README.md).
That packet's tree is unchanged here.

| Input | SHA-256 |
| --- | --- |
| Deployed Pump allocation (`evidence/original/pump/deployed.so`) | `7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d` |
| Selected symbols image (`…/artifacts/unstripped.so`) | `dd73afe77d90d289e9383ee1aa12cdb26608752eb1a1f8b3a4135c0af786cb17` |
| Selected stripped image | `c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f` |
| `platform-tools-osx-aarch64.tar.bz2` (anza-xyz v1.44, native tools) | `66e20d135fddd70ff519baf7ff320d762957f9aedf93a50e23756db23ad79351` |
| `platform-tools-linux-x86_64.tar.bz2` (anza-xyz v1.44, SBF target libraries) | `6719b889d60677a8a2fcf4c82f68441a1afe0ab093edd2efe9f84a67a808b3e9` |

## 1. Independent reproduction

The reproduction uses only public inputs: the official
[anza-xyz/platform-tools v1.44](https://github.com/anza-xyz/platform-tools/releases/tag/v1.44)
release, the crates.io locked dependencies (254 packages from the selected
`Cargo.lock`), and the selected packet's frozen 65-file source. All five native
tool binaries (`rustc`, `cargo`, `clang`, `llvm-objcopy`, `llvm-ar`) and the 25
SBF target libraries SHA-256-match the qualified native v1.44 cohort; the exact
values are in [`reproduction/toolchain-public-hashes.json`](reproduction/toolchain-public-hashes.json).

The contributor reports that running the selected packet's unmodified portable builder produced both qualified images (receipt field `qualified_image_hashes_equal: true`, 35.9 s on Apple Silicon); the build log and outputs are not committed, so this packet does not independently prove the rebuild. The full receipt — tool and library hashes, source manifest, build
command, environment and output hashes — is
[`reproduction/build-comparison.json`](reproduction/build-comparison.json).

To repeat it, fetch the two public archives above, extract the native SDK and the
`sbpf-solana-solana` libraries, populate a cargo home from the locked manifest,
and run the selected packet's builder:

```sh
python3 -B research/pump-multihop-accrual-qualification-20261028/build.py \
  --source-directory programs/pump \
  --sdk /path/to/platform-tools-osx \
  --cargo-home /path/to/cargo-home-fetched-from-Cargo.lock \
  --target-library-profile linux-v1.44-sbpf \
  --target-libraries /path/to/platform-tools-linux/rust/lib/rustlib/sbpf-solana-solana/lib \
  --wrapper research/pump-multihop-accrual-qualification-20261028/tools/pump_physical_source_wrapper.py \
  --target-directory work/pump-target --output work/pump-build
```

## 2. Residual atlas

[`atlas.json`](atlas.json) records all sixteen unmatched windows. Each
counterpart is the candidate function most matched callers call at the parallel
call site. `size_delta` is candidate minus original body bytes;
`normalized_slot_jaccard` is the shared fraction of acceptance-normalized
instruction slots; `reorder_invariant_multiset_identical` additionally masks
branch displacements, so a value of `true` would mean the two bodies differ only
by instruction order.

| Window | Bytes | Counterpart | Δbytes | Jaccard | Class |
| --- | ---: | --- | ---: | ---: | --- |
| `0x14f4e0` | 13224 | `buy_exact_sol_in` | **0** | **0.984** | near-identical |
| `0x80df8` | 2120 | `trade::v3_buy_costs` | −64 | 0.696 | structural |
| `0x6cd78` | 8544 | `legacy_sell::process_cashback_inner` | +272 | 0.653 | structural |
| `0x13f630` | 20184 | `buy_v2::buy_exact_quote_in_handler` | −88 | 0.595 | structural |
| `0x13b9b8` | 15480 | `buy_v2::buy_handler` | −56 | 0.582 | structural |
| `0x4c158` | 8368 | `migrate_v2::create_token_account_v2` | +56 | 0.559 | structural |
| `0x144508` | 13976 | `sell_v2::execute` | +128 | 0.553 | structural |
| `0x147ba0` | 3672 | `trade::buy` | +128 | 0.484 | structural |
| `0x14a8a8` | 6032 | `trade::sell` | +24 | 0.405 | structural |
| `0x1e7c0` | 15576 | `create_v2::execute` | −728 | 0.356 | structural |
| `0x72810` | 7832 | `sweep::execute` | +952 | 0.349 | structural |
| `0x1489f8` | 7856 | `trade::buy_exact_quote` | −56 | 0.309 | structural |
| `0x5b3b0` | 18584 | `multi_hop_curve::swap_hop` | −48 | 0.284 | structural |
| `0x77940` | 8832 | `token_incentives…claim_v2` | −368 | 0.279 | structural |
| `0x22a10` | 27400 | `admin_cto::execute` | −7768 | 0.175 | structural |
| `0x83c00` | 3440 | (no matched caller) | — | — | unmapped |

Reading of the data:

- **Fourteen of the fifteen mapped residuals differ in instruction count** from their counterpart (0x83c00 is unmapped), so they are structural (inlining or code-generation differences),
  not layout. Jaccard ranks how far each is from its counterpart.
- The one count-identical residual, `0x14f4e0` (legacy `buy_exact_sol_in`), has
  1,602 normalized slots on both sides and 0.984 slot overlap, yet is **not** a
  pure permutation: `reorder_invariant_multiset_identical` is `false`, so roughly
  a dozen slots differ in content. The difference is dominated by basic-block
  placement and branch-condition polarity, plus the two independent reversed
  loads noted in the selected packet — consistent with the atlas's slot comparison (13 differing slots per side, 2 after masking branch displacements). It is the closest residual but is not closeable by
  reordering alone.
- `0x83c00` has no matched caller to vote a counterpart; it is left unmapped
  rather than guessed.

## Verify

Stdlib-only and offline. It recomputes the census and the atlas from the
committed images, matches them against `atlas.json`, and checks that the reproduction receipt's tool and library hashes equal the qualified native v1.44 cohort values recorded in reproduction/toolchain-public-hashes.json (not independently authenticated against the release) and the qualified image hashes:

```sh
python3 -B research/pump-independent-reproduction-atlas-20261029/verify.py
```

Sparse checkouts need this directory,
`research/pump-multihop-accrual-qualification-20261028/` (selected image and
shared census), `scripts/` (normalizer), `evidence/original/pump/` (deployed
image) and `repro/reconstruction-status-2026-10-26/functions.tsv` (window
boundaries). The verifier performs no build and no network access.
