# Curve-run lookahead owner validation

The original classifies every current hop and every lookahead hop by its pool account owner: AMM returns false, Pump returns true, other owners return AccountTypeNotSupported. The old reconstruction compared only whether the next owner was Pump; it could execute the current Pump batch before discovering an invalid following hop. The recovered classifier is now used at both original call positions, so an unsupported lookahead is rejected before Pump CPI.

All56 signed cases pass (112 signatures), eliminating12 original/baseline mismatches in logs, events, inner instructions and return data. Original and candidate account rollback states are retained. Both directions, four two-hop route shapes, and three unsupported-owner choices at each position are covered. Seven original cases succeed.

The752-byte classifier matches the original instruction/relocation structure except genuine source line/path-length fields560/568. Both actual owner Pubkeys and all seven actual callees match. Full measurement remains623/785 and128raw with zero gained/lost windows. Three admin frame warnings are inherited from the baseline; the affected wrapper is instruction/relocation-identical and is addressed by the parent's separate context recovery.

Run `python -B verify.py --directory .` or call `verify(directory,candidate)`. This authenticates saved evidence without running a VM. To replay against another artifact, use `runtime/kit/run.py --candidate CANDIDATE --output NEW_DIRECTORY --repo-root REPOSITORY`. The kit binds all five imported fixture inputs before and after execution. Baseline input/producer and original outputs are compared against the corrected run. Full regression against the parent's combined build remains an integration obligation.
