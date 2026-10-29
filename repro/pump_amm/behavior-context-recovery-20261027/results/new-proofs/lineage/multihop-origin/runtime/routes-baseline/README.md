# Deep route boundary acceptance

Selected composite: e97b3900800d4378486d9b1f7df040e6b7a57d34b31a9470a5f5eb3a9d2fb24b. All328 cases match original full results, with656 verified transaction signatures. There are42 successful original transactions and286 expected program errors; none of this selected corpus exhausts its compute budget.

The152-case default-budget boundary suite is preserved alongside an otherwise-equivalent152-case suite whose transactions include a genuine signed ComputeBudget instruction requesting1,400,000 units. The24 vault cases use that signed budget and exercise two-/three-hop routes, readonly or malformed destinations, and aliasing. The corrected three-hop buy and three-hop sell both complete successfully. The unmutated two-hop sell fixture remains a matched ZeroQuoteAmount error. See completion-roster.json for each unmutated route and exact counts.

The three-hop sell fixture needed a buyback ATA matching its final quote mint; prior wrong-ATA and default-budget failures are preserved in the private research evidence. No existing report or selected artifact was relabeled. This packet is a fresh replay against the indicated composite and makes no source-change claim.

Call `verify.py::verify(directory,candidate)` or run `python -B verify.py --directory PACKET --candidate CANDIDATE`. The verifier redecodes signatures, checks exact ComputeBudget instruction bytes/order, pairs signed inputs/prestate, and compares full logs/state/events/return data. Only compute-consumption lines and genuine logged source coordinates use the preserved cleaner. All five imported fixtures and seven harness source files are hashed before/after and copied into the packet. Saved verification does not execute a VM.

`verify_completion.py::verify(directory,candidate)` also recomputes and checks every completion-roster field after verifying all receipts.
