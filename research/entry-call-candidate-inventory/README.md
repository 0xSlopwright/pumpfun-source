# Preserve bounded entry-call candidates

The archived dispatcher heuristic keys each scalar to one call target. Repeated
scalar/call sites overwrite earlier ones, including different targets in the real
Relay and Metaplex captures. Token-2022 also supplies named external relocations
that the heuristic reports as relative self-targets.

This reviewed-source-bound successor retains every candidate's scalar load, call
site, raw instruction bytes and target in an ordered list per scalar. Named type-10
external calls are excluded from relative-call attribution. It preserves the
archived entry/4,000-byte scan and adjacency heuristic, with explicit uncertainty:
neither the scalar nor its persistence through intervening instructions proves an
Anchor selector or dataflow to the call. Values with several targets stay ambiguous.

```
python research/entry-call-candidate-inventory/test_analyze.py
python research/entry-call-candidate-inventory/analyze.py --program donation_relay --output <new-directory>
```

`validation.json` binds all nine retained inputs and records repeated/excluded raw
witnesses. The full unfiltered inventory projects exactly back to the old final
rows; independent raw-word checks verify every retained physical site. Outputs are
UTF-8, require new directories and bind input/helper/generator/output hashes. Root
helpers, original captures and prior reports remain unchanged. No source rebuild,
executed path, recovered handler map or security clearance is claimed.
