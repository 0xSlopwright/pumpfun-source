# Joint 640 call/data audit

Read-only audit of candidate `e995d6a8211dcd3d05c07cdcb1a7147ec4f4e2b2a81b56c268fd1a3d76a01ce1` from `work/amm-abi-cpi-next-20261027`. It independently remeasures **640/785 normalized windows and 128 raw windows**. Internal direct-call closure contains 583 windows; the bounded recognized data/reference constraints retain those 583. This is not full indirect, data, runtime, or ELF identity.

The generated Pump return getter remains a complete normalized 344-byte match with both real descriptors at lib.rs:22:1. BuyEvent's 6088-byte serializer retains its complete normalized match and the correct instructions/swap/buy.rs filename. Its line is still 3 instead of 233. There are 29 unequal recognized source-coordinate uses across seven bodies: split_buyback2, BuyEvent1, accumulator derives2, U1287, entrypoint17.

The 14 previously unbound vtable observations and two direct formatter pointers still resolve through actual alternative targets. The extended scanner additionally handles zero-size vtables and valid short descriptors at section ends. It recognizes 195 vtable observations, 520 text descriptors and 95 direct-code references. All 34 newly recognized zero-size vtables have matching metadata and actual drop/first-method bodies, including the Any::type_id target. The nine newly recognized text observations add eight invalid generic cross-pairings, rather than true text differences. There are 28 unequal text cross-pairings with equal alternatives and zero true unequal recognized text/path values.

The three remaining data.rel.ro references omitted by that schema are fmt::Arguments piece arrays whose first string is empty. Their actual piece counts are confirmed by the original/candidate stack stores: ["", " (os error ", ")"], ["", ":", ":"], and ["", ": "]. Every bounded piece matches. The initial exploratory inventory includes raw prefixes solely to classify targets; adjacent prefix bytes are not identity requirements.

A separate non-string check recognizes the complete 186-byte bs58 Alphabet table (128-byte decode map plus 58-byte encode map). It occurs once in each ELF, has equal bytes, and has two relocated code references in each. Its digest is `3370ada652b3cd5cedaa4a80392884824c3264a1d38dd50267f04700bb1784d1`. The source type and constructor from bs58 0.5.1 are retained. Constant presence alone does not identify an unmatched caller's behavior.

No new unequal non-string object or source fix was established. Unclassified .rodata references and unmatched function bodies remain outside this bounded proof. The valid remaining source-coordinate differences are kept as obligations; the separate entrypoint dependency experiment is not selected by this packet.

`run_audit.py` accepts explicit root/candidate/symbols/template/output paths and recomputes measurement, call closure, extended descriptors and getter/event checks. It was exercised into joint-verified/. `verify.py --root .` checks this packet, the fixed joint artifact and the bounded array/table evidence without rebuilding or running transactions.

## Portable export

This copy is exported from the unchanged private packet with manifest `c92000ec83f6c5f6615b7852ed9d8d25012844988210bac5512e7388f707b274`. The verifier defaults to `repro/pump_amm/source-abi-recovery-20261027/results/build/candidate.so` and its sibling `unstripped.so`, or accepts explicit `--candidate` and `--symbols` paths. The exact e995d6a8 artifact hash remains mandatory. Informational historical paths in saved reports are not opened by verification.
