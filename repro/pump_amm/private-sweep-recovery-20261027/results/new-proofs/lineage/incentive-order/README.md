# Independent incentive schedule error-order review

This packet independently qualifies the minimal incentive guard in the combined candidate `c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544`.

The captured original checks whether the current timestamp is before the stored start **before** checking whether the schedule has finished. At `0x6dbe8`, the signed `current < stored_start` branch goes directly to the `end_day` call at `0x6dee0`. Only its fallthrough loads the stored end and performs the signed `end < current` check at `0x6dc00`. This is a conditional path fact. It does not imply that `end_day` precedes every error or dominates the function.

The selected 656-window predecessor returned `SupplyUpdateForFinishedRange` (6035) too early for some synthetic malformed schedules. In all 128 recorded counterexamples:

- New start and end arguments are both zero, so the range update is disabled.
- Supply is positive, and `stored_end < now < stored_start`.
- The original reaches `end_day`: 112 cases panic while converting a negative end to `usize`; 16 panic on end-before-start subtraction.
- The predecessor instead returns 6035. Both transactions fail and roll back, so the final account snapshots agree despite the different error and log behavior.

The minimal fix gates the existing finished-range check with `current_timestamp >= self.start_time`. It uses the stored/effective start, including any earlier valid range update. It does not move `end_day` before the finished-range check globally, alter arithmetic, or change supply-zero handling.

The tests distinguish nearby incorrect fixes. Using strict `>` would break 88 equality-boundary cases. Comparing with the requested start argument rather than the stored start would leave 96 of the counterexamples unfixed. Running `end_day` unconditionally first would incorrectly panic for an existing finished-range case that must return 6035.

## Verification performed

The exact one-file patch and its compiler input hash are checked for the minimal candidate `c7f71e05fa3477dd78273ae3e5a0669a145ba800cd3b8365111163edfd93330f`. The combined candidate contains the identical corrected source bytes. Both candidate artifacts, signed execution records and captured program/dependency hashes are bound directly.

The fresh combined-candidate domain contains **1,730 case rows**, **3,460 executions** and **3,462 signature fields**, with **zero differences**. Those rows have 1,727 distinct input dictionaries; three deliberately repeated rows remain counted as executed cases. The original 128 mismatches are retained and reverified separately.

The review also rechecks the minimal candidate's 1,730 rows, the retained 700-row incentive suite and its 32 historical negative controls, and the retained 1,805-row volume suite. Altogether the packet audits **7,727 row observations, 15,454 executions and 15,468 signature fields**. These suites overlap and must not be reported as 7,727 unique scenarios. It compares full recorded states and logs, normalizing only the established source-coordinate and compute-consumption log fields.

All fixtures use ordinary verified local signatures and synthetic AMM-owned state/clock values. No live-state reachability or on-chain action is claimed. This verifier runs no VM or compiler. The corrected helper remains unmatched as a complete binary window; whole ELF and original-source identity remain open.

```sh
python -B verify.py
```

Use the repository's Python environment with `solders` installed. `verify(root=None)` derives every packet path from `__file__`, accepts the parent's repository-root argument, and returns the combined candidate hash, `cases=1730`, `mismatches=0`, `baseline_mismatches=128`, and the manifest seal.
