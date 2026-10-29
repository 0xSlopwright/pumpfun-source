# InitBoost seed-borrow negative

The frozen656 handler binds `let p = &a.pool` before cloning the transfer program/authority AccountInfos. This trial removes that alias and reads each inline signer-seed field directly through `a.pool`, motivated by the original post-clone Pool field loads. It changes only that source file.

An ordinary contextual Rust build produced exactly the same stripped and unstripped artifact bytes as the frozen656 candidate. The alias spelling therefore does not explain the remaining24bytes in InitBoost. All762 dependency artifact hashes stayed unchanged and the227 build inputs were stable through compilation. No source change is selected, no new VM cases were needed, and no claim is made about other source forms. Original body3912bytes versus3888 remains open.

Run `python -B verify.py` to recheck the saved source delta, baseline equality, and build bindings without compiling or executing a VM. The compiler/cache and full SDK are not bundled.
