# Fallible route direction extraction proposal

The original route handler retains a fallible extraction of its direction state. It initializes the byte-sized state to 2 at 0x3ddf8, preserves it through the hop loop, and selects the boolean values 1 or 0 at 0x3e338/0x3e350. After the final mint comparison it checks for state2 at 0x3e858. That edge calls a distinct 520-byte error closure at 0x40100, returning error6044 (`NotEnoughRemainingAccounts`), with original Source line307 in `instructions/swap/multi_hop_swap.rs`.

The current reconstruction stores direction in `Option<bool>` and calls `sell.unwrap()`. The proposed single-line change is `sell.ok_or_else(|| error!(PumpAmmError::NotEnoughRemainingAccounts))?`. The original 0/1/2 state behavior and fallible error edge support this ordinary Rust spelling. They do not authenticate the historical spelling. Existing initial validation may make the None state unreachable for valid public inputs, so no externally reachable bug or valid-input behavior change is claimed.

The packet is based on the immutable ea14 combined source. It changes no checks, route computation, fees, helper attributes or source padding. It has not been compiled or executed. It is a proposal for a separate controlled build, not part of the fixed current batch.

`python -I -B verify.py` validates the source binding and one-line patch; decodes the original state, spill, copy and branch instructions; verifies CFG dominance and the sole error-closure call; checks the original Source record and error6044; and matches all four actual direct callee bodies of the error closure. The packet does not claim new normalized matches, full data-reference closure, or whole-ELF identity.
