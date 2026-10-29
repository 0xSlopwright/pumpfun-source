Fourth candidate legacy replay
==============================

Candidate 3fcae02128464717b29a0b3842fbba993d5d0befb4362c4094c8af8e32a8589d passed all1,514 sealed inputs:1,011 standard legacy cases,184 reserve boundaries and319 exact rounding/cap cases. Original and candidate recorded comparison fields agree. The saved original outcomes/messages agree with the sealed prior packet. All3,028 transactions have cryptographically reverified signatures and paired identical messages.

The offline verifier checks the sealed input packet, staged input inventory, scripts/observer/program/dependency hashes and saved result fields. No VM execution occurs during verification. This is bounded synthetic diagnostic evidence; it does not establish whole-program equivalence.
