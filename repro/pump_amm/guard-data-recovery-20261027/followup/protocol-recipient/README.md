# Remaining malformed normal-recipient ordering gap

This9-case negative packet is bound to selected e97b3900800d4378486d9b1f7df040e6b7a57d34b31a9470a5f5eb3a9d2fb24b. It compares legacy buy, exact-quote buy and sell under sorted, reversed and rotated normal protocol-recipient arrays. All arrays contain the same eight unique keys and the selected recipient. The3 sorted controls succeed on both programs. In6 unsorted cases, the original rejects InvalidProtocolFeeRecipient6013 while the candidate succeeds and changes balances/events. All signed messages and before-state are identical within each pair.

Original helper0x58e08 uses binary search for the normal array; candidate legacy handlers use linear contains. Existing config setters enforce sorted, unique nonzero recipients. These tests deliberately supply a malformed account state; no reachable on-chain exploit or authentic accepted state is established. This packet records a remaining fidelity gap, not an approved source fix.

Run `python -B verify.py --candidate candidate.so` or call `verify(directory,candidate)`. The verifier checks all18 signatures, program/producer/observer hashes, actual array permutations, exact original/candidate outcomes, full normalized results and logs, complete signed-message account coverage, and unchanged extra harness-watched accounts. It does not execute a VM.
