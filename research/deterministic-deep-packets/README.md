# Repeatable deep-disassembly packets

Identical Pump inputs produce different archived packets: per-window syscall and
external-symbol lists inherit Python set ordering, and gzip embeds wall-clock time
and an output filename. This successor sorts those unordered name sets and writes
UTF-8/LF gzip payloads with timestamp zero and no filename header.

```
python research/deterministic-deep-packets/test_generate.py
python research/deterministic-deep-packets/generate.py --program pump --output <new-directory>
```

Tests run four complete real Pump workflows: original and corrected under hash
seeds 1 and 2. The original window JSON differs; every corrected packet file,
including manifest and compressed disassembly, is byte-identical. Normalized name
lists and parsed full disassembly preserve the prior analysis. The resulting
packet verifier passes. A separate control uses different gzip output filenames.

The frozen helper is authenticated by its reviewed LF/CRLF hashes. Captures, root
scripts and historical packets remain unchanged; output directories must be new.
This establishes same-platform repeatability for these variations, not portability
across every platform/Python/zlib version, correct decoder semantics, runtime
coverage, source reconstruction or security clearance.
