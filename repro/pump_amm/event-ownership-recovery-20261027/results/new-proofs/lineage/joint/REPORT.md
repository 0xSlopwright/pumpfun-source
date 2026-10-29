# Joint event, rent and decoder recovery

Candidate `0881a95dafe465623c7220fb3da84b3f9c7d9b0094d572f62487f05cbd80a07c` is immutable sixth `be10ca1a` plus three independently qualified patches: capture V2 event Pubkeys before fallible operations, restore the creator payout's rent/error expression, and bind the invalid optional-bool match value directly. The published event-capture transformation is credited to the original claude-amm-mid-20261027 authors. Exact-CFG and legacy event-input trial changes are excluded.

The candidate matches **647/785 normalized windows**, **148 raw windows**, and **810,544 original text bytes**. The four gains are `0x52c58/1784`, `0x6f4b0/344`, `0xe7648/1856` and `0xe7d88/1856`. No normalized or raw match is lost. Independent static checking verifies 19 matching actual immediate callees, five text descriptors, three formatter code pointers and both instruction-log strings. Two wrapper calls still target unmatched legacy business handlers; this is not a claim of recursive closure or whole-ELF identity.

Two strict builds produce identical stripped and unstripped artifacts, with 227 unchanged source inputs and 762 unchanged cached dependency artifacts. Source composition and all three patch hashes are checked independently of the build's recorded command.

Current signed runtime evidence covers:

- 25 core suites / 17,462 cases, 35,074 serialized transactions, 35,418 signature fields and 17,537 identical signed-message pairs.
- 65 impacted V2 event/context/buy-executor cases.
- 572 optional-bool/truncation cases.
- 108 rent-expression cases and 267 retained creator cases.
- 1,616 retained legacy cases and 19 CTO quote-predicate cases.

All compared outcomes pass. Across these deliberately overlapping suites there are 40,368 transaction executions and 40,750 verified signature fields. The rent matrix includes explicit synthetic high-Rent values: it does not claim a default-network-Rent discrepancy. The CTO matrix has six original successes and 14 original AMM invocations; five fixtures reject earlier. The comparators exclude source-coordinate and compute-usage log differences, while saved receipt checks verify exact log hashes where retained, program/dependency hashes, signed inputs and recorded state/results. No live-chain operations were performed.

`python3 -B packet/verify_packet.py` verifies the sealed source/build/static/runtime evidence offline and emits one JSON result. Runtime and individual proof scopes remain explicit; the packet does not establish exhaustive behavioral equivalence or full binary identity.
