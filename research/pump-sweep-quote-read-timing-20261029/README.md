# Sweep quote read after the fee gate

This is only the later read-timing recovery after merged
[PR 713](https://github.com/lalalune/pumpfun-source/pull/713). Its sealed 15db
source, build, receipts, manifests and verifiers remain byte-identical.
[source.patch](source.patch) is the small 15db→3d336 delta: move the existing
quote-mint/default comparison from before authorization to after the selected
fee clear and zero-fee exit. No state operation, validation, predicate, helper,
argument, signature or arithmetic changes.

**All native/census/runtime results here use historical main
`1285b5e9e3a29c1e2cf32246d6046035e5d66fad` / composition 673. They do not
qualify the maintained 734 source or any later composition.** This publication
is based on main `5634890b9b7aa03dccb82b22ec0e1dc9f2e1eaa1` and changes only
this new research directory. Maintained program source and selection are untouched.

The exact full compiler input [source](source/programs/pump/src/sweep_fees.rs)
is `3d3363ddd7713999363bf950fb404fa4e35e42731d43806cb6ceeccda94985e9`;
[source before](source-before.rs) is the merged 713
`15dbbd46bdbe7af62c6b7bb436f657c45e290c080c185fc075b7a3c08e3df7e8`.
The full file includes 713's already recovered helper/state work solely to bind
the actual compiler input; this PR claims only the new read-timing delta.

## Used value and actual result

The original recipient comparisons are at `0x72918` (default-key guard) and
`0x72a98` (creator-PDA guard). Its separate protocol/creator quote comparisons at
`0x72ef0` / `0x73a60` read curve+`0x28` against 32 zero bytes after each selected
clear and nonzero gate. They are mutually exclusive, not two runtime predicates.
The 15db image instead reads early at `0x8da08`, stores the result at stack-`0x340`
and reuses it after both gates. There is no missing logical predicate.

In the actual 3d336 image, protocol clear/gate`0x8dfb0/0x8dfb8` and creator
clear/gate`0x8e198/0x8e1a0` join at `0x8e1a8`; curve reload`0x8e1b8` and quote
comparison `0x8e208` follow. Neither zero edge reaches the read. All intended
Rent/payment helpers and Clock have actual matching complete normalized bodies
and paired outgoing edges through depth 2. Transfer still dominates Clock and
both event-data calls. The raw argument/state rows and conservative
intraprocedural CFG proof are retained.

The handler shrinks **7888→7832 bytes**, matching original length but **not its
normalized bytes**. All 36 direct callee identities pair with 37 original calls
through depth 2; one original 64B `memcmp` remains as separate mutually exclusive
quote-branch code. The full 1035 census stays **1019 normalized/188 raw, zero gains
or losses** in this historical cohort. Equal length and callee capacity do not
establish complete argument/data/CFG equivalence. No further branch/flag/type/
ABI/spelling measurement is part of this unit.

## Native build and finite replays

[Native CI 40796286687](https://github.com/shawkkkkk/pumpfun-source/actions/runs/40796286687)
uses the same native macOS v1.44 tools/authenticated Linux v1.44 SBPF libraries and
empty-target recipe as the prior measurement. All 65 primary/66 workspace inputs
are bound before/after; only Sweep differs from frozen 673, and both local crates
have real `Compiling` lines. Native CI tooling remains separately credited to
[PR720](https://github.com/lalalune/pumpfun-source/pull/720).

| Actual linked output | SHA256 |
| --- | --- |
| Runtime ELF | `4e0e96a2b32b175cf576655063499f2d53974bcaa3a6280e6b9886f1805fa151` |
| Symbols ELF | `6680ce7a8834c233bb0d6dc6aa084560c462c561c6d46ec2aa608cc8c5f3826e` |

All 511 previously defined sweep cases are freshly run as original/historical
control/proposal triples: 1533 signed executions and 1551 signature fields pass.
They retain the 504 maintained cases and seven separately defined rent controls
from 713; there are no new fixture domains or coverage credits. Errors, complete
states, returns, CPIs, serialized transactions and all ordered logs/Source
coordinates agree except exact complete compute-meter lines/the metadata counter.
Captured loader headers and ELF prefixes are preserved. No prior receipt is
transferred to this new image.

The inherited deliberate Source positioning remains disclosed: vacated read
line 27 remains blank, and the existing else-block blank line 166 is reused.
All five bang-macro coordinates, ATA lines 167/168 and event line 178 stay exact.
No Source field, padding bytes, emitted instruction, SDK or comparison mask is
edited. Frozen source/patch whitespace is retained in
[WHITESPACE-AUDIT.json](WHITESPACE-AUDIT.json).

## Verify

```sh
python3 -B research/pump-sweep-quote-read-timing-20261029/verify.py
python3 -B research/pump-sweep-quote-read-timing-20261029/test_controls.py
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```

Sparse checkouts can supply `--inventory /path/to/authentic-673-inventory.json.gz`.
The verifier reuses only read-only 713 parsing/normalization/replay primitives,
with dependencies pinned in [PREREQUISITES.json](PREREQUISITES.json). No 713 checker
expected hash or sealed file is retargeted. It rechecks the actual 65/66 archive,
stripped/measured sections, all 1035 windows, call identities, field/zero gates,
Source coordinates and all signed outcomes. Eight actual-input controls reject
inverted zero gates, wrong clear/quote offsets or extent, Source changes and
signature mutations. No mutated ELF is written or executed.

The original replay producer/fixture hashes and exact new commands are in
[REPLAY.md](REPLAY.md). Whole-body/whole-ELF inequality remains. This is a bounded
source-order recovery, not a new observable behavior fix, full 44-suite replay,
independent candidate repeat build, current 734 qualification or security acceptance.
Stopped token-incentive and crossing scopes remain untouched.
