# Independent review of the inverse-fee and route checkpoint

Candidate `98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3` and symbols `be58b930eaa9689df7fa039620dd485df490aa1edd3ec6b76bfe3d7b2714376d` were independently checked against the captured original and the preceding ea14 checkpoint. This packet runs no compiler or VM.

## Current measurements

- 659/785 normalized windows, 159 raw windows, and 830,808/1,162,040 matched text bytes.
- One new normalized window: the complete 776-byte native inverse-fee method at original `0xf2ed0`. No normalized or raw losses.
- Eleven new raw matches contain 4,384 bytes. All were already normalized matches in ea14. Every body equals the original bytes, all 27 direct-call targets have matching complete bodies and relocation patterns, and the windows contain no data relocations. These are improvements in placement, not eleven additional semantic recoveries.
- 595 windows pass bounded call/data closure; 588 also close the checked source-coordinate fields. All 38 IDL wrappers match.
- The 126 remaining windows comprise 79 typed-source-immediate-only candidates, 7 with other instruction differences, and 40 with no same-size/relocation-pattern candidate. These candidate classifications are not proof of historical source ownership.

`measurement-full.json`, `raw-gain-review.json`, `direct-closure.json`, `descriptors.json`, `bounded-static.json`, `source-coordinate-closure.json` and `remaining-audit.json` are recomputed from the current binary. The raw-gain verifier checks exact bytes and actual callees instead of relying on the reported count.

## Source and native library

The inverse and route component patches reproduce the current source from frozen ea14, and agree with an independently generated aggregate patch. They change three Rust files. The version 3 recipe binds 56 canonical files, 57 workspace files and 175 unchanged registry files: 232 compiled inputs.

The native library was rebuilt after removing exactly ea14's three recorded native artifacts. Their hashes and retained bytes are checked against the previous sealed dependency record. The 762 framework artifacts remain identical. Native priming supplies three replacement artifacts; the whole-contract build and strict repeat preserve all 765 artifacts and produce identical binaries.

Both codegen methods extracted from the new rlib match the linked candidate and original: native fee 368 bytes and inverse fee 776 bytes. Their compiler-runtime callees match raw bytes. The inverse wrapper is 688 bytes and now differs only in a typed source-line field (67 versus 34); its five actual callees match. The source-level crate name and physical package arrangement remain reconstruction choices, not authenticated original provenance.

## Fresh signed evidence

Every retained current receipt names the 98ed candidate. The primary groups contain 17,462 core, 1,502 event/context, 254 sweep and 1,730 incentive observations. Their summed totals are 20,948 cases, 42,046 executions and 42,710 signature fields; the groups overlap. The 1,730 incentive cases still have zero mismatches, and their source is identical to the accepted conditional error-order fix that addressed the prior 128 counterexamples.

The additional 41 CTO cases have zero mismatches and 144 verified signature fields. They include 10 synthetic direct-AMM controls, 12 captured-Pump controls and 19 retained cases. Synthetic downstream tests do not establish public-network reachability.

The native supplement contains 216 original/ea14/current triples and 648 verified signatures. Fourteen raw source-coordinate differences remain. The verifier accepts only the two exact triples in `utils/transfer_fee.rs`: UnsupportedQuoteMint lines 32/30/12 and Overflow lines 67/52/34. All other checked fields agree. Its bounded amount/bps cases do not establish coverage for bps above 10000 or near-u64-maximum transaction amounts.

Seven mutation controls reject changed code, a wrong actual callee, incorrect source data or invalid event provenance. No whole-ELF identity is claimed. `verify(root=None)` accepts this packet's directory as `root`; it does not interpret that argument as a repository directory. Run `python -I -B verify.py` for the complete portable audit.
