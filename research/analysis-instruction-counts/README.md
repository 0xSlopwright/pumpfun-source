# Instruction counts distinct from bytecode slots

The archived program-analysis README calls `.text size / 8` an instruction
count, including in its largest-window table. Legacy `lddw` consumes two
eight-byte slots but is one decoded instruction. The real originals therefore
overstate instruction counts by 8,153 Pump, 5,731 AMM and 4,396 Mayhem `lddw`
continuation slots.

This reviewed-source-bound successor counts complete instructions per window,
adds explicit `instruction_count` and `instruction_slots` section totals, and
uses the decoded counts in both README locations. Other analysis fields and
raw inputs stay unchanged; original helpers and reports remain intact.
The archived `research/{pump,amm,mayhem}-window-analysis-20261028/README.md`
packets are not rewritten, so their "BPF instructions" figures (224,026,
145,255, 88,343) still denote eight-byte slots. Both
reviewed LF/CRLF source hashes are accepted and other drift is rejected.

```sh
python research/analysis-instruction-counts/test_generate.py
python research/analysis-instruction-counts/generate.py --program mayhem --output work/mayhem-instruction-counts
python work/mayhem-instruction-counts/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. Tests regenerate all three real program packets
and compare every window count with its slot total minus actual wide
continuations. `validation.json` retains before/after hashes and totals.
These are static decoded counts, not executed instruction or compute-unit
counts. No new reconstruction coverage or runtime equivalence is established.
