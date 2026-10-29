# Private event, error-PDA and shared sweep source recovery

This packet verifies candidate `9278a52ae4fd93bb6159a72fa625f121394902a93f701d86931a7ec3778055fb`, composed on immutable c200. The three changed files are `cashback.rs`, `creator_reassignment.rs` and `instructions/sweep_fees.rs`.

The source changes remove four unnecessary event clones where the original serializes the same local event storage twice, restore the original second PDA derivation used by SetCoinCreator's error value, preserve one recipient-key snapshot across the sweep guards/event, and read the sweep event's quote mint from Pool. No source-line fitting, forced inline attributes, assembly changes or dependency changes are introduced.

## Verification

- Both strict builds produce byte-identical stripped and unstripped artifacts. All 227 compiler inputs are bound: 51 canonical inputs, 52 workspace inputs and 175 archived registry inputs. All 762 dependency artifacts remain unchanged.
- All 785 original windows are recounted: 656 normalized (83.5669%), 148 raw, and 826,112 matching normalized text bytes. There are zero normalized/raw gains or losses. All 38 public instruction wrapper windows retain complete normalized body/relocation matches.
- Four event sites use the original local storage relation. SetCoinCreator preserves 25 direct calls and uses the second PDA result on its error path. Its 7,688-byte body remains unmatched against the 7,632-byte original.
- The shared sweep body is 4,456 bytes, matching the original extent. All 31 call positions match; 27 actual callee bodies match. Only Source line stores at offsets 1,208 and 1,688 differ: original lines 91/113 versus current 32/43. They remain open and are not hidden by the standard normalization.
- Fresh signed replays pass: core 17,462 cases; private event/PDA 1,502; incentive 1,730 with zero mismatches; and retained extras 2,811. The primary four suites total 20,948 suite-cases and 42,710 signature fields, including overlap. The retained count includes the same current-candidate 254-case sweep replay and must not be added as wholly new executions.
- Worker regression, expanded, liquidity, recovery, extra-control, admin-control and program-identity jobs all passed. This packet binds their final status and verification hashes. Their broad payloads remain in the worker and are separately rechecked by the root coordinator, rather than duplicated here.

## Contents and replay

`composition.json` and the two component patches reproduce the exact three-file delta, both as an aggregate and in sequence. The original macro source and symbolic error-path proof support evaluating the PDA expression again only on the failure branch. Source/registry/archive binding, runtime signatures, loaded-program hashes, logs and account results are rechecked from saved evidence.

Run `python -B verify.py --root <repository>` or import `verify(root=None)`. Verification opens only packet-local files and performs no build or VM execution. Compressed reports retain their uncompressed SHA-256 bindings. Every file is covered by the outer manifest, including any ignored cache file required by an inherited sealed packet.

The optional base-mint snapshot trial `d44c6f2c...` is unselected: it reproduced the original stack-seed relation but enlarged SetCoinCreator to 7,744 bytes and yielded no normalized gain. Its source, build and dataflow record remain in the worker sibling directories. Final source and receipts here stay on 9278.

There are still 129 unmatched windows. Complete source provenance, general indirect-call/data closure and whole-ELF byte identity remain unproved.
