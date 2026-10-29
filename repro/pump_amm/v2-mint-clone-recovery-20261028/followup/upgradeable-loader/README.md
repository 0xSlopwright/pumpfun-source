# Bounded upgradeable-loader policy replay

All 24 existing policy pairs agree when AMM is loaded through the captured upgradeable Program/ProgramData representation. The 12 canonical cases use the same signed synthetic Pump CPI caller; the other 12 call AMM directly. All 48 transaction signatures verify and the message bytes equal the retained baseline. The four original default-budget failures now succeed on both captured and reconstructed AMM code.

Every case starts with a fresh LiteSVM instance and no AMM executable account. The producer inserts the nonexecutable ProgramData account, then the captured 36-byte executable Program account with its captured owner and ProgramData pointer. The observer rejects any AMM legacy `add_program` load and independently checks fresh account absence, ProgramData bytes, payload hashes and unchanged loader accounts. Original ProgramData is the captured 10,485,760 bytes; candidate ProgramData is the exact captured 45-byte metadata plus the unchanged 1,294,536-byte dbb5 artifact. No code is padded or source rebuilt.

Pinned LiteSVM 0.8.0 source, identified in the retained native runtime, shows executable `set_account` loading the ProgramData payload and replenishing its cache. Three missing/truncated/invalid ProgramData controls reject loading. Four signed code-selection controls show that changing ProgramData alone keeps the cached code, while re-inserting the executable Program reloads the new payload. The main policy corpus uses fresh VMs, so no stale or legacy AMM cache is reused.

This verifies the bounded loader representation and code-selection path. LiteSVM uses the current Clock slot when constructing this cache entry rather than enforcing the captured ProgramData deployment slot. The existing synthetic Clock slot100, epoch0 and timestamp remain unchanged; deployment-slot rules, upgrade lifecycle, other loader validation and live reachability are not verified. Dependency programs and the synthetic caller retain their previous loader setup.

Both AMMs now enter the previously failing cases with the same compute budget. Their intrinsic execution still differs by14 units. Broad compute parity remains open. The unmodified prior raw failures and equal-allocation controls are retained in `prior-allocation`; none are relabeled or removed.

Run `python -B verify.py` with Python3.12+solders. The verifier reads the packet and validates signatures, source witnesses, account layouts, cache controls and retained proofs. It executes no VM, compiler or network call.
