# Native inverse-fee proposal on ea14

This unselected proposal moves `calculate_pre_fee_amount` onto the explicit native fee owner introduced in ea14. The inverse wrapper matches the copied optional value, then calls that method. The now-unused native-to-packed adapter is removed. No inlining attribute, line padding, invented stores or selected-source edits are used.

A fresh pinned Rust 1.79/SBPF object contains the complete original 776-byte inverse body. Its direct calls at +272 and +456 use `__multi3` and `__udivti3`, whose complete current and original bodies are already raw-identical. The existing native fee method remains exactly 368 bytes in the same object. This corroborates the earlier standalone diagnostic without its `no_mangle` declaration. The ordinary native method takes a reference to the 24-byte native struct; it is not a packed 18-byte SPL payload.

The independent caller trace is copied in `caller-evidence/`. Original `amount_before_fee` at `0x74b80` copies three 64-bit payload words into a 24-byte temporary and calls `0xf2ed0` at +120. The current packed conversion changes five instructions in that setup. `match *data` is proposed by the same ownership evidence that restored the native `calculate_fee` caller in the ea14 composition. The new inverse caller has not yet been contextually compiled.

The arithmetic follows the authenticated SPL 6.0.0 implementation. Only the pure cap load is delayed to the branch that uses it:

| Ordered condition | Result |
| --- | --- |
| bps = 0 | input amount, including u64 maximum |
| amount = 0 | zero, including bps > 10000 |
| bps = 10000 | checked amount + cap |
| bps > 10000 and amount > 0 | None from denominator subtraction |
| remaining bps | ceil(amount * 10000 / (10000 - bps)); cap branch uses checked amount + cap, otherwise checked conversion to u64 |

The zero-amount branch precedes the 10000-bps cap addition and the over-10000 subtraction failure. In the general branch, the excess is compared against the cap before attempting the final u64 conversion. These orders must remain in contextual and signed runtime validation. Native and original instruction equality supports the primitive; it does not establish whole-program identity or the historical crate name.

`recovery.patch` applies only to ea14 source. `verify.py` rechecks both primitive bodies, actual original runtime callees, source and patch bindings, and the fresh object build receipt. It does not execute a compiler or VM. One contextual build, all-window delta check, and fresh signed fee/inverse control cases remain required before selection.
