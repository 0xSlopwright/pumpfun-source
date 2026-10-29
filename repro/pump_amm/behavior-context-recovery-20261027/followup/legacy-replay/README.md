Fifth-candidate legacy replay kit
=================================

Includes candidate7f501a86, sealed original/dependency inputs, all1,568 saved cases and signatures, and an offline verifier.

Verify saved outputs: `python3 -B verify.py`

Run the captured original/candidate pair again: `python3 -B replay.py --output /absolute/new-directory`

Verification executes no VM. Replay executes local SBPF fixtures. Run from any directory; paths resolve relative to this packet. Requires the existing Python harness packages (solders, litesvm). No whole-program equivalence is claimed.
