# Withdraw burn wrapper and mutation-order recovery

Stable two-file patch: `recovery.patch`, based on `work/amm-withdraw-recovery-20261027/source`. It preserves the preceding withdraw precedence fix. All edits remain in this private work directory; no maintained source or public proof tree was changed during the root task's publication.

Built SBPF candidate: `0c5fabaaedc7c1254051891edf7748d57ef6442282fb9b72334a171c617b8069`, under `build/artifacts/pump_amm_recovered.so`. Build source is `source/`, with authenticated strict-build provenance and archived unstripped output in `build/`. The compiler target cache is a private copy with only its root crate fingerprint invalidated.

## Exact recovered helper

Original burn wrapper `0x738a0`, size1,616 bytes, is now recovered across its complete normalized body and relocation pattern. Its ordinary Rust signature accepts `&Program<Token2022>`, `&InterfaceAccount<Mint>`, `&InterfaceAccount<TokenAccount>`, `&AccountInfo` authority, and amount u64. It constructs `CpiContext::new` with mint/source/authority account clones, then calls `token_interface::burn`.

There is no zero-amount shortcut. The original performs the burn CPI even for amount0, and the recovered source does likewise. The actual burn callee,1,896 bytes, also matches the original normalized body and relocation pattern. `burn-proof.json` records both levels, the exact helper hash, and the mapped withdraw call sites. No padding, representation attributes, source-coordinate substitutions, or executable patches were used.

## Other restored boundaries

Withdraw now explicitly clones the quote AccountInfo before decoding transfer fees, matching original clone→decode→amount-after-fee structure. The compiled clone and decode calls occur at handler offsets2,264 and2,296, followed by amount-after-fee at2,672.

After burning, withdraw writes the checked reduced pool LP supply before invoking can-boost and virtual-reserve adjustment. The compiled LP-supply store is at+4,144 and can-boost at+4,168. Their24-byte separation matches the original store+4,336 and predicate+4,360. Deposit retains its previous store timing. The full withdraw body remains structurally unmatched:7,480 bytes versus original7,200.

## Negative experiments and behavior boundary

Before any edits, an18-case signed audit of combined burn failure and virtual arithmetic conditions found no observable difference against the preceding source. It includes frozen burn/base/quote accounts, insufficient LP balance, zero and full burns, negative virtual reserves, product overflow, and effective-virtual predicate overflow. The fixture labelled `narrowing-overflow` reaches earlier product overflow6023 at its recorded parameters; it does not independently establish a post-division narrowing failure. Raw parameters and outcomes remain in the report.

The selected candidate passes the same18 cases. Thus the LP-store timing and clone/wrapper changes are supported as source/control-flow recovery, not claimed as a newly demonstrated behavior fix. Transaction rollback and the predicate's current field usage limit what these failure observations can distinguish.

## Verification and census

- New negative audit:18/18; preceding-source baseline18/18.
- Prior withdraw precedence probe:18/18, preserving all five repaired cases.
- Existing liquidity suite:680/680.
- Existing effective-virtual overflow suite:18/18.
- Candidate suites retain1,468 verified signed transactions. The independent liquidity verifier re-decodes and verifies the1,396 existing-suite transactions, checks identical original/candidate messages and logs, and verifies strict build provenance.
- All785 original windows:585 normalized,124 raw,200 unmatched. Exactly one gain, `0x738a0`; no losses against the preceding584-window source.
- Internal direct-call closure rises522→523 windows; no-indirect closure271→272; strict static/external-boundary-free closure remains77. The helper's abort boundary is retained rather than treated as closed.

`function-comparison.json`, `burn-proof.json`, `measurement.json`, `measurement-comparison.json`, `call-closure.json`, `independent-verification.json`, and `summary.json` preserve the evidence. No full17,462-case replay was repeated, and no promotion was performed by this worker.
