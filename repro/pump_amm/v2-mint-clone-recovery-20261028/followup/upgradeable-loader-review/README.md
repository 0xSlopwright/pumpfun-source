# Independent upgradeable-loader followup review

The frozen 3d56cc78 proof passed its verifier plus independent checks of every48 signature/message pair, the actual AMM program account passed at the caller's account17, all recorded loaded program hashes, captured upgrade authority/slot and four signed cache-selection canaries. The main observer forbids loading AMM through add_program_from_file, requires it to be absent before each executable insertion, and records ProgramData-derived payload identity. Cache controls distinguish ProgramData-only replacement from executable Program reinsertion.

All24 direct/canonical policy pairs match, and the four former legacy-loader failures succeed on both sides. The 36-byte executable Program and45-byte ProgramData metadata are checked against captured bytes. This validates the bounded AMM loader representation and cache-selection experiment. It does not prove captured-deployment-slot enforcement, upgrade lifecycle, loader fidelity for dependency programs/caller, live reachability, or broad compute parity. The synthetic Clock remains at slot100; LiteSVM inserts a cache entry at that current slot.

Run `python -B verify.py /absolute/path/to/upgradeable-proof/packet`. This small independent audit requires the explicit immutable evidence packet and executes no VM/compiler itself.
