# AMM sell: success adjacency changes at the first SimplifyCFG pass

The borrow-success block first becomes the next IR block **after the first
recorded SimplifyCFGPass**. This locates an earlier structural boundary within
the same passive capture published in [PR #727](https://github.com/lalalune/pumpfun-source/pull/727).
No new compilation is claimed by this packet. The merged parent packet, all
compiler outputs and its seal remain unchanged.

| Capture stage (zero-based) | Borrow block | Next block | Success block | Predicate form |
| --- | --- | --- | --- | --- |
| 16, before first SimplifyCFGPass | 337 | 341, forwarding to 313 | 342 | equality → select → switch |
| 17, after first SimplifyCFGPass | 335 | 338 | 338 | direct equality branch |
| 275, last captured IR | 225 | 232 | 232 | direct equality branch |

All 276 IR snapshots are classified. Success is non-adjacent in the first 17
and adjacent in the remaining 259. Before the transition, the intervening block
contains only `br label %313`. Labels are local to each snapshot and can be
renumbered by passes; this is not a claim that equal label numbers identify the
same block across passes.

The unchanged parent analysis establishes that snapshot 276, before Finalize
ISel, is the first captured machine stage and already contains the JNE error
branch. Every subsequent captured machine stage retains that polarity. Together
these observations make early IR successor ordering a concrete next
investigation target. They do not identify an individual instruction-selection
operation, prove causality for the deployed binary, or recover its original
source/compiler flags.

`analysis.json` records all IR snapshot byte spans/hashes, the inferred success
successor and next block, plus the exact before/after borrow and following blocks.
The parser follows both the early select/switch form and later direct branch,
checks that the switch consumes the selected discriminant, and accounts for
equality versus inequality. It does not rewrite IR or compiler output.

## Verify saved evidence

From the repository root, Python 3.12 or newer:

```sh
python -I -B research/amm-sell-ir-order-20261029/verify.py
python -I -B research/amm-sell-ir-order-20261029/test_analyze.py
```

Both directories must be materialized in sparse checkouts:
`research/amm-sell-ir-order-20261029` and
`research/amm-sell-compiler-boundary-20261029`.

Verification authenticates this complete packet and the exact parent seal before
loading its unchanged analyzer, then replays all 276 IR and 116 machine snapshots
from the original compressed capture. Four tests include removal of the
intervening block, a disconnected select/switch and a swapped post-pass successor.
No compiler, VM, network or target execution is involved.

Parent publication: `89483477bb04174240b6f33e7a3204af3f0a8658`, merged as
`3b46a03e4ec0a32406a79942162a302b46fba246`. This successor's base is
`b09067fc1cdabd0568e72e7461704ed1edb77282`. The parent retains the exact
68-maintained/69-workspace source binding and the unmodified output proving the
capture was passive. Its source/output verification remains separate and can be
run with its own `verify.py`.

There is no new window match, candidate promotion, runtime qualification or
completeness/security claim. The selected AMM recipe still has 784 raw windows,
and sell plus its relocation-offset rows remain unequal. Meaningful compiler
output and the separately allocated zero suffix remain distinct.
