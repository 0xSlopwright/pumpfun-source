# Disable event borrowing: exact object body

The one-expression source change replaces `emit!(event.clone())` with `emit!(event)` inside Disable. All fields, state updates, checks and CPI emission remain unchanged.

The ordinary full-crate Rust baseline object matches the frozen `03b78a92…` linked Disable body in all 3,088 normalized bytes and all call/relocation positions. The changed object is 3,024 bytes and matches original `0x17960` in every normalized instruction and every call/relocation position, with no masks beyond the existing reader's relocation normalization. No source coordinates, attributes or padding were added.

This is an exact function-body object result, not a whole-program or linked-candidate result. The refined contextual build and signed runtime checks are separate. Earlier small objects remain in the parent work directory; the packet includes a note about the corrected diagnostic target-path invocation.

The packet contains both full objects and sources, build commands, the exact linked baseline and symbols, and offline verification. Historical target paths are metadata only; verification opens no private cache path. Run `python3 -B verify.py --root /absolute/repository`, or import `verify(root)`. The root supplies only the pinned original ELF.
