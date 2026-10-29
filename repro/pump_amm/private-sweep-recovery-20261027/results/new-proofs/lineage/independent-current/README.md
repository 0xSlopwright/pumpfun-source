# Independent private-event and sweep review

This saved review binds candidate `9278a52ae4fd93bb6159a72fa625f121394902a93f701d86931a7ec3778055fb` and symbols `62a5b6f3550813e4e5b792fb5060a70295e81292a5fe7c95905afbf6f6f27225`. It performs no compiler or VM execution.

The independent complete census remains **656/785 normalized windows (83.5669%)**, **148 raw windows**, and **826,112/1,162,040 normalized text bytes (71.0915%)**. All 38 instruction wrappers remain matched. There are **129 unmatched windows**, each included exactly once in `remaining-ledger.json`. The retained domains are structural routing labels, not claims that a particular cause has been proved. Whole-ELF identity remains false.

Bounded actual-call and recognized-data closure remains **592 original windows**, or **585 when source coordinates are included**. This relation verifies the actual paired direct-call targets and recognized text/code/vtable descriptors; it does not establish arbitrary indirect-call closure, all memory/data equivalence, external providers, original source provenance, or whole-program identity.

The aggregate patch and its two component patches independently reproduce the same complete source tree from H11/c200. Exactly three files change: `cashback.rs`, `creator_reassignment.rs`, and `instructions/sweep_fees.rs`. The canonical-to-workspace recipe authenticates all **227 compiler inputs**: 51 canonical inputs materialize as 52 workspace inputs plus 175 external source files from nine authenticated dependency roots. All **762 cached dependency artifacts** are unchanged. This packet includes one build record; it makes no strict-repeat claim.

The four private event serializers reuse the same first-Pubkey storage across both emissions, as the original does. Conservative CFG address propagation and four contiguous source-word stores establish these local witnesses. They do not prove aliasing of every event byte or the absence of every intervening write. SetCoinCreator has 25 direct calls and rederives the canonical PDA on the failed key-comparison path; the second result flows into the error's right pubkey. Its body remains 7,688 bytes against the original 7,632 and is unmatched.

Sweep is 4,456 bytes, matching the original size and all 31 call positions. Exactly two instructions differ, both separately identified as typed source-line fields: original lines 91/113 versus candidate lines 32/43. Those differences remain in the published window census. Identical instruction witnesses preserve the initial recipient snapshot, its later use in the event, and quote-mint loads from Pool. Of the 31 actual direct calls, 27 have full paired callee bodies; prepare_pool, validate_protocol_fee_recipient, available_quote_reserves and take_accrued_fees remain outside that closure.

All saved current-candidate observation groups were independently rechecked:

| Group | Cases | Executions | Signature fields |
| --- | ---: | ---: | ---: |
| Full core | 17,462 | 35,074 | 35,418 |
| Private-event controls | 1,502 | 3,004 | 3,322 |
| Sweep matrix | 254 | 508 | 508 |
| Incentive boundaries | 1,730 | 3,460 | 3,462 |
| Sum including overlaps | 20,948 | 42,046 | 42,710 |

These suites overlap; totals are observation counts rather than unique scenarios. All retained reported fields agree. The core binds 34,924 ordered error observations and 31,134 exact log observations to signed transactions. Reports without logs do not establish omitted log equality. Signature verification, program-file identity, serialized input equality, before/after state, events, inner calls and reported returns are checked according to each retained suite format. Only compute-consumption log messages and source coordinates are normalized.

The current 1,730 incentive-boundary cases have zero mismatches. `volume_accumulator.rs` is byte-identical to H11's manifest-authenticated joint source. The 128 pre-fix baseline counterexamples are retained as a reference to the sealed H11 independent proof (its manifest is stored as the authenticated `h11-incentive/prior-manifest.bytes` record, not a nested packet); their old VM executions are not repeated or counted as fresh observations here.

Seven independent negative controls reject a changed recipient instruction, a changed typed source line, a valid but wrong actual callee, an unknown discriminator, an inexact output field offset, unknown incoming pointer state and a noncontiguous source word. Wrapper tests additionally reject changed instructions, relocations, wrong aliases and shifted boundaries.

Run `python -B verify.py` using Python 3.11 and the existing `solders` package. `verify(root=None)` accepts the parent's repository argument but resolves all evidence from its own location. Compressed receipts are verified against their uncompressed hashes; external historical paths are evidence only and are not reopened.
