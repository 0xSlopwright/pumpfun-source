# Independent review of the combined AMM checkpoint

The reviewed candidate is `c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544`; unstripped symbols are `a2f2db4b8151c254b53fdbe8aedb3cc6791c3d0bc5d7574a60fa9e9191cdcd8c`. The comparison baseline is the accepted 656-window candidate `58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b`.

## Verified result

- All 785 original windows were recounted: **656 normalized**, **148 raw**, **826,112 normalized text bytes**. There are **zero normalized gains, losses, raw gains, or raw losses** against the 656 baseline.
- All **38 IDL instruction dispatch wrappers** retain complete normalized body and relocation-pattern matches. Wrapper equality alone does not establish body-target equality.
- Actual direct targets and recognized data references yield **592 bounded static closed windows**, or **585 including source-coordinate data**. These retain the limits of the checked first-level target/data model; neither count is whole-program identity.
- The retained H10 Disable/harvest/provider anchors preserve complete normalized bodies, relocation patterns and all **39 internal direct callees**. They are retained anchors, not new gains in this checkpoint.
- The new Deposit body has the original **7,128-byte extent and all 55 direct-call positions**. Its six differing instructions comprise four typed source-line immediates and a two-load ordering difference. Provided-token-program comparisons are present at the original relative offsets. Withdraw is **7,176 bytes versus 7,200 original**, with 56 direct calls. Both remain unmatched windows.

## Source and compiler binding

The three component patches and aggregate patch independently reproduce the same six-file source delta. The aggregate SHA-256 is `0afa1663f3367d126b65066f16b0548dcbc02261b16ec847edb570e9524a062d`. The buy module move retains `legacy_buy.rs` as a one-line re-export. There are **51 canonical inputs / 52 workspace inputs / 175 archived registry inputs = 227 compiler inputs**, not 226. The nine authenticated dependency archives provide 166 source files plus nine generated metadata markers. All **762 dependency artifacts** remain unchanged before and after both recorded builds. The strict repeat produces byte-identical stripped and unstripped output.

`source_check` re-applies both the aggregate and three constituent patches in temporary directories and verifies the exact standalone-to-workspace transform, compiler input hashes, archived dependency sources, toolchain/target/archive records and repeat artifact hashes. It performs no compiler execution.

## Conditional incentive correction

At original `0x6dbe8`, signed `current_timestamp < stored start_time` branches past the immediate finished-range comparison. The new `current_timestamp >= self.start_time` source guard preserves that conditional behavior. This audit checks the actual original and candidate instruction/register/field-offset sequences. It **does not assert global error dominance** or a global end-day reordering.

All **1,730 fresh signed offline boundary cases** were reverified against this exact joint artifact: **0 mismatches**, 3,460 original/candidate transactions, **3,462 verified signature fields**, and 275 original successes. Recorded transaction bytes, input fixtures, cleaned outputs, loaded-program hashes and dependency bytes are bound. The prior baseline's 128 error/log differences are historical evidence held in the baseline negative packet; the new zero result comes from the joint candidate's own receipts. This reviewer rechecks saved receipts and runs no new VM execution.

## Remaining work and limits

[remaining.md](remaining.md) and [remaining-audit.json](remaining-audit.json) enumerate every remaining window. The 21 math/helper identities include corrected source/type labels and explicitly retain unresolved source, ownership, allocator and link-boundary gaps. Seven prior source-coordinate-only pairs remain provenance-open; three exact natural micro-implementations still lack the original contextual boundary.

The coherent buy-module move improves the original-supported filename, while original derive line 133 versus reconstructed 49 remains unexplained. No declarations, padding, forced helper boundaries, or source-line fitting were added. Bounded equality and offline tests do not establish complete source provenance, deployment identity, or full ELF byte identity.

## Replay

Run `work/test-env/bin/python -B <packet>/verify.py --root <repository>` or import `verify(root=None)`. Verification uses only files inside this packet, accepts the repository argument for checkpoint-loader compatibility, and performs no build or VM run. The outer manifest covers all packet files; the counterexample and dependency subpackets retain their own independent manifests. The negative controls mutate actual instructions, callees, canonical source, remaining-window accounting and a re-sealed loaded-program observation.
