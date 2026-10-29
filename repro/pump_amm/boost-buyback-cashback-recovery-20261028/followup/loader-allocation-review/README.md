# Independent allocation-cause review

The frozen allocation proof `426f15a989e62a83d789a085c2ee21ef951f4ecb241d88604641fd1af7bdfe01` passed its verifier and additional independent checks of all 96 fresh signatures, every loaded-image hash, the actual AMM account index forwarded by the signed caller, captured Program/ProgramData bytes, and the data-only intervention. Run `python -B verify.py /absolute/path/to/allocation-proof/packet`; this small review intentionally uses that explicitly supplied immutable evidence packet and does not duplicate it.

Both sets of 24 equal-allocation pairs agree. Original and candidate both succeed in the four relevant cases at the smaller allocation; both fail at the larger allocation. The four high-budget receipts independently show an entry-budget difference of 36767 and AMM execution differences of 14, giving outer-cost differences of 36781. The original AMM costs are 138164 or 138165; current costs are 138150 or 138151.

The captured executable is an upgradeable-loader 36-byte Program account, with the captured ProgramData address, slot and authority and a separate 10485760-byte ProgramData account. The legacy-loader fixture instead embeds the entire ELF dump in the executable account. No source or binary modification is warranted by these four failures. Raw failures remain part of H18. A loader-faithful full replay and broad compute parity remain unproved.

No compiler, VM or network execution was performed by this review.
