# Pump error-path integration on L39: 1019/1035, 264 paired cases

This packet integrates the source recoveries following [#569](https://github.com/lalalune/pumpfun-source/pull/569) and qualifies one final image, including cashback parse precedence, admin validation order and Source sites, rejected creation-key payloads, and shared buyback panic behavior. It preserves the earlier trade, sweep, and multi-hop recoveries in that image.

The result is **1019/1035 normalized windows, 183 raw bodies, 16 remaining**, covering **1,611,088 original text bytes**. Both normalized and raw matched membership are unchanged from #569: **no new window gain is claimed**. Whole-ELF equality remains false. This is an integration of credited recoveries, not their rediscovery.

## Source and attribution

The reconstruction starts with all 65 authenticated **L39** primary files from [#559](https://github.com/lalalune/pumpfun-source/pull/559), head `44697701d734c93a2e2321e850d62d368627c328`. This anchor is distinct from the newer **L41 / [#626](https://github.com/lalalune/pumpfun-source/pull/626)** line; this packet does not claim to replace or incorporate that separate frontier.

The verifier reconstructs all 67 workspace files from `composition/L39-primary.tar.gz`, its pinned upstream manifest, the ordinary workspace materialization, and the exact patch order in `RESULT.json`. After the first six patches, it also verifies the complete intermediate source against #569, head `709b56739aac757fca5b9c965454272e1a4f6893`.

| Ordered recovery | Original attribution retained |
| --- | --- |
| [#555](https://github.com/lalalune/pumpfun-source/pull/555) | Legacy sell mint-reference evaluation boundary; checked constructor selection credited there to [#539](https://github.com/lalalune/pumpfun-source/pull/539) |
| [#538](https://github.com/lalalune/pumpfun-source/pull/538) | V2 cashback quote-program admission and Clock selection |
| [#560](https://github.com/lalalune/pumpfun-source/pull/560) | Ordinary v2 buy/sell whitelist reserve synchronization and typed trade flow |
| [#566](https://github.com/lalalune/pumpfun-source/pull/566) | Mayhem/whitelist multi-hop completion-crossing rejection |
| [#563](https://github.com/lalalune/pumpfun-source/pull/563) | Sweep recipient validation at original Source line 123 |
| [#567](https://github.com/lalalune/pumpfun-source/pull/567) | V3 sell reserve/payment order, whitelist synchronization, volume event, and error precedence |
| [#570](https://github.com/lalalune/pumpfun-source/pull/570) | Cashback recipient validation before quote-mint parsing |
| [#595](https://github.com/lalalune/pumpfun-source/pull/595) | Admin CTO validation Source-site recovery |
| [#616](https://github.com/lalalune/pumpfun-source/pull/616) | Unsupported creation quote-key Left/Right payload |
| [#619](https://github.com/lalalune/pumpfun-source/pull/619) | Shared-holder admin vault checks and payment order |
| [#627](https://github.com/lalalune/pumpfun-source/pull/627) | Actual scalar shared buyback helper and v3 buy-cost call chain, including panic payload/site parity |

#627 is pinned to `b79152657b12576eafe690b7b38bd99d70d17e6a`; `composition/patches/shared-buyback.patch` is its frozen applied patch. Earlier source and data work remains attributed to the L39 packet and the individual PRs. The legacy sell window belongs to #555. The 17 raw-body gains relative to the L38 control were retained through #560's composition and depend on link placement; they are not new gains here.

L39's inherited blank lines, Source positioning, and layout devices remain disclosed reconstruction artifacts, not recovered historical formatting. The source patches contain actual operations and their recovered evaluation/validation boundaries. No SDK, registry, executable, binary instruction, normalizer, owner check, or signer check is patched. The build uses ordinary linking without a generated layout layer.

## Qualification of this final image

Stripped SHA256: `82f60200719314d63864b24397e4b7e0dc54589715609c9cdd338c6c9e6f6f36`.

Unstripped SHA256: `b58f8f267a52c4f2a07272fae5d1a60f08bbfbddaba0ac56929785b9fccab851`.

Every family below was freshly executed against this final stripped image:

| Family | Cases | Executed transaction outcomes | Independently verified Ed25519 signatures |
| --- | ---: | ---: | ---: |
| V2 whitelist/mayhem trades | 18 | 54 | 54 |
| Sweep recipient boundaries | 18 | 54 | 54 |
| V3 configured-fee sells, volume, precedence | 128 | 256 | 256 |
| Legacy sell constructor/payment boundaries | 25 | 50 | 50 |
| Cashback quote-program admission | 8 | 24 | 24 |
| AMM-to-Pump crossing/noncrossing controls | 8 | 16 | 16 |
| Cashback parse/recipient order | 18 | 54 | 54 |
| Admin validation Source sites | 5 | 15 | 30 |
| Admin shared-holder guards/payments | 12 | 36 | 72 |
| Creation literal-key rejection and controls | 4 | 12 | 24 |
| Buyback cost/panic boundaries | 20 | 60 | 60 |
| **Total** | **264** | **631** | **694** |

There are zero compared structured mismatches against the original. Counts include each executed appearance of transaction bytes on the original, baseline/control, and candidate images; they do not mean 631 unique transactions. Admin and creation transactions have two declared signers, so old producer fields named `signature_verifications` sometimes count transaction verification calls rather than individual signatures. `signature-audit.json` records the corrected actual signer counts. All 694 signatures were independently checked; the verifier can repeat those cryptographic checks with `--signatures`.

The saved comparisons cover each family's explicit fields: account state, errors, events, CPI instructions, and return data, with before/after snapshots where recorded. Admin families additionally compare ordered program messages; cost/panic cases compare ordered logs omitting only anchored compute-unit consumption lines. The creation-key rejection explicitly verifies the recovered Left/Right key payload and the **remaining Source-site discrepancy: original `create_v2.rs:220`, candidate `create_v2.rs:70`**. This discrepancy is retained and checked, not normalized away. Universal log parity is not claimed.

Main-program loads preserve the captured upgradeable-loader Program and ProgramData header, the unchanged ELF prefix, and the zero allocation tail. Loader receipts bind every candidate load to this image. Tests are isolated, normally signed local fixtures using captured dependencies; no live financial transaction is involved. The eight multi-hop replays also compare their fresh original outcomes to the saved original records. This is bounded final-image qualification, **not a replay of the full 44-suite corpus**. Larger results in the individual packets are not transferred to this image.

## Build and verification

Both local crates were explicitly cleaned for release and `sbpf-solana-solana`, then freshly compiled with the unmodified native Linux v1.44 SDK, locked dependencies, offline Cargo, and the pinned physical-source wrapper. Build receipts retain source hashes, actual compiler commands, SDK/target-library hashes, reused external dependency hashes, and compressed logs. External dependencies were reused; this is not a cold dependency rebuild.

The bundled `build.py` was separately executed on the frozen 67-file source and reproduced **both complete ELF hashes exactly**. `reproduction/` retains its receipt, log, and the two fresh compiler commands. Source, SDK tools, and target libraries remained unchanged. This is equality between the two reconstructed builds; it does not establish equality with the deployed original.

From a repository containing the original evidence and selected windows:

```sh
python3 -I -B research/pump-semantic-union-errors-20261028/verify.py
python3 -B research/pump-semantic-union-errors-20261028/verify.py --signatures
```

The default verifier requires only Python's standard library. It checks the sealed manifest, exact 65-to-67-file composition and #569 intermediate, both build receipts, tools, all 1,035 census entries, normalized and raw membership, loader bindings, serialized signer counts, and the actual saved comparisons for all 11 families. It performs no build or transaction execution. `--signatures` additionally requires `solders` and cryptographically rechecks all 694 signature appearances. Optimized Python is rejected. Use `--repo /path/to/full/repo` for a separate evidence checkout.

`build.py` accepts `--repo`, `--sdk`, `--cargo-home`, and a new `--output` directory. An optional `--dependency-seed` copies dependencies into a new owned target; both local crates still freshly compile. `runtime/producers/` preserves the actual producer and harness sources, pinned in `composition/runtime-producer-pins.json`. Some historical producers retain session-specific absolute paths and are evidence snapshots, not portable replay promises.
