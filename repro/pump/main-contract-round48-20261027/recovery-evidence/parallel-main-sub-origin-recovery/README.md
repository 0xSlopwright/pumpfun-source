# Bounded subtraction-origin recovery

This unbuilt proposal uses the frozen R47 source and changes two files. It targets the 13 remaining route subtraction-origin mismatches without moving the generic `multi_hop_curve::sub` or `add` helpers.

Eleven rows report original `trade_v3.rs:502`. The original function at `0x82128` owns checked base subtraction, quote addition, and native-only migration-fee subtraction, followed by positive-balance guards. The current pool helper delegates arithmetic to generic helpers in the route file. The proposal puts those three checked operations directly inside the existing pool helper, preserving the observed order and conditional subtraction.

Two rows report original `trade_v3.rs:294`. The original function at `0x80488` performs two ordered checked subtractions with one shared error construction. Existing `trade::sub3` has the same complete 576-byte normalized instruction sequence, with only the source-line immediate differing. The proposal shares that existing helper with the route's two nested fee-subtraction expressions. Its current caller remains in place.

The original has four calls to `0x80488`, including two from the route function. One call from `0x83088` belongs to a broader helper not reconstructed in this proposal. Original spelling and names remain inferred. No source-line padding, binary patching, new fixture, compiler, or VM execution is included. A mapped build and the complete retained corpus remain required after independent review.

`EVIDENCE01.json` binds the original bytes, instruction checks, current 13-row log cohort, and callers. `STAGED01.json` binds all 65 source inputs. `bounded-arithmetic01.patch` contains the complete proposed change.
