# Legacy reserve method-call recovery

Private candidate f6a0937d0fb2706f75f77dabee20e10f502c94907e5e65126a968ce7ff94a48d replaces inline reserve arithmetic with existing Pool methods in the original order, and reads event virtual reserves/can_boost late. Only legacy_buy.rs changes. The resize prefix, native-recipient call and fee calculation are unchanged.

All 640/785 normalized windows and 128 raw windows are retained; no windows are gained or lost. The shared legacy executor shrinks 18656→18256 bytes and has direct available/effective/can_boost calls. It remains unlike the two original specialized handlers; both 1880-byte wrappers and the separate resize boundary remain unresolved. This is not full ELF or historical-source identity.

The 1011 standard legacy cases, 184 new reserve/fee/virtual-boundary cases and 319 exact-quote cases pass on the base and candidate. These 1514 selected cases give 6056 transactions and 6056 verified signatures across both comparisons. Near-maximum native balances are synthetic guard fixtures; no live balance qualification is claimed. Original/candidate snapshots, events, CPIs and errors are checked. Raw logs are retained; the exact-quote packet normalizes only its documented diagnostic/compute fields.

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B verify_packet.py` to recheck the manifest, exact source change, build input hashes, all windows, linked function shapes, decoded signatures and saved observations. This does not build or execute the VM. Large runtime JSON files are gzip-compressed without changing their contents; the included exact-quote kit retains its own original seal. Read DESIGN.md and method-evidence.json for statement-order and numeric reasoning.
