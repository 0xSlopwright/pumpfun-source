# Remaining supported-mint scanner CFG gap

The selected bool-preserving outline has a1168-byte scanner versus1192original bytes. The actual combined candidatee33e6a matches the narrow object byte-for-byte for this scanner; the calibrated568-byte public wrapper matches both its object and the original. This is a real remaining scanner gap. The separate051562 ownership packet remains unchanged.

The original has149reachable instructions in65basic blocks; the outlined bool scanner has146reachable instructions in66blocks. Opcode deltas total three instructions: one additional move-immediate, one variable shift and one unconditional jump. Conditional branch opcodes differ in polarity/layout. Load and store counts are equal. The original spills the policy word and keeps the TLV base live; the reconstructed scanner keeps the policy live and spills the TLV base.

Original entry-length validation precedes kind-range validation. The current compiler moves the kind bound first. The original recomputes1<<kind after the allowed-extension/policy guard, while the current code preserves that value. Those differences are recorded by exact instruction offsets and successor edges in cfg.json; they do not themselves establish a semantic error.

A single source hypothesis replaced manual mask checks with ordinary Rust matching over the original allowed sets (1,4,6,12,14,16,25,26 require the policy;18,19 bypass it). It compiled to1408bytes,176instructions and73blocks. This trial is rejected and no corresponding production patch is proposed. The bool/u64 comparison is not repeated; neither identifies a u64 API. No padding, forced attributes, new full build or VM execution was used.

verify.py recomputes the CFG inventories, exact context/object relationship, original guard ordering and bit-shift counts. It is read-only and portable; build commands retain their historical paths as provenance rather than pretending those paths are portable.
