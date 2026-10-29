# Legacy exact-quote gross preview

The preserved original and the prior `dc6891e1` candidate agree on all 319 valid Token-2022 rounding/cap boundary cases. The reconstructed closure candidate `c77180df` also agrees. This is source and call-boundary recovery, not evidence of a prior behavioral mismatch.

The original first deducts the transfer fee from the whole user budget. It then estimates AMM fees, checks the gross pool quote plus protocol/creator fees, and recomputes the gross pool quote after any budget correction. A Rust closure borrowing the decoded transfer fee and LP fee recovers the complete original 168-byte helper at `0x3d828` after standard relocation/call-operand normalization. Transitive arithmetic helper identity remains incomplete.

`run.py --candidate /absolute/candidate.so --output /absolute/new-directory` replays the 319 cases with ordinary signed messages, records all non-executable message accounts before and after each transaction, and verifies every result field and log. Only existing source coordinates and compute-consumption lines are normalized. The baseline and fixed saved reports intentionally both have zero mismatches. `verify.py` checks the saved proof and its manifest without executing transactions.

The account fixtures and settings are synthetic. The tests run against the captured original programs and token dependencies in LiteSVM, not a live network. No private signing keys are retained in receipts.
