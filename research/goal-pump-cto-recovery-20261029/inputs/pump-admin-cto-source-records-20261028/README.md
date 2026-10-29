# Restore five deployed admin_cto Source records

The recovered `admin_cto` handler reports the correct validation errors at five incorrect source lines. This packet places the same genuine operations at the deployed positions by splitting existing compound lines and using existing blank lines. The Rust token sequence, evaluation order and file length stay unchanged. This is engineered source positioning inside the inherited synthetic layout; no executable padding or extra operations are introduced.

| Validation | Control line | Deployed line |
|---|---:|---:|
| HolderRewardCreatorImmutable | 284 | 289 |
| CtoNewCreatorNotAllowed | 306 | 298 |
| CreatorShouldNotBeZero | 312 | 307 |
| CreatorFeeNotConfigurable | 331 | 334 |
| CreatorFeeBpsOutOfRange | 332 | 338 |

All other error sites retain their existing positions. The control is the exact qualified candidate from PR #570, including the preceding cashback behavior corrections. This patch changes only `creator/admin_cto.rs` and composes independently with those corrections.

**This adds no matched window.** Both complete match memberships remain **1018/1035 normalized and 166 raw** against the pinned control. Window `0x22a10` and whole-ELF identity remain unmatched. These are control-relative counts, with no current-frontier claim.

Five focused original/control/candidate comparisons retain and independently reverify 15 signed transactions, proving each old and restored Source line. The existing **363-case admin_cto corpus** passes with zero structured differences. Every ordered `Program log` and `Program data` message, across all invocation depths, now equals the original in that corpus. Compute-use and runtime invocation bookkeeping are outside that message comparison. All runs use the captured upgradeable loader and genuine dependency CPIs; the pool authority stays a nonsigner at the transaction boundary.

The packet includes the precise source diff, complete control and candidate source archives, unchanged compiler receipts and control artifact binding, explicit clean receipt, actual compilation of both local crates, SDK and target-library hashes, ELFs, all 1035 census windows, signed runtime reports and loader receipts. No maintained source, global README, SDK or registry source changes.

```sh
python research/pump-admin-cto-source-records-20261028/verify.py
```

The verifier checks the unchanged Rust token sequence, the five Source moves and all remaining error positions, compiled source and ELF bindings, the complete normalized and raw memberships, retained signatures, ordered runtime messages, and clean/compiler/loader receipts. It does not rebuild or claim whole-ELF identity. The recorded producer and builder under `tools/` use session paths that need substitution for reproduction.
