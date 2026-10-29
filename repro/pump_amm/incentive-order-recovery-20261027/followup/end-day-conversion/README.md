# End-day conversion shape diagnostics

The original232byte helper at0x6f3c8 rejects negative end/start/period values and shares one `SVM is 64-bit` panic source at state/volume_accumulator.rs:398:28. Current explicit conversions produce376bytes with three separate panic origins. The explicit small object exactly calibrates to the current linked function.

Seven natural shared-conversion/guard source forms reduce the body to232bytes but do not match original branch scheduling and cold-path placement. All remain unselected. No full crate build or runtime case was performed, and no padding, forced inline/noinline attribute, or executable patch was used. These controls explain a source-form contribution to the gap, not recovery of the original helper.

Run `python -B verify.py` to recheck the saved objects, baseline and original-byte constraints. No VM or compiler executes during verification.
