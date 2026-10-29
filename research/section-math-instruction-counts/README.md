# Math operation counters

The archived section analyzer omits arithmetic right shifts (`0xc7`, `0xcf`)
from its shift count, and divides arithmetic instruction counts by eight-byte
slots. LDDW has two slots but one instruction, understating density.

This reviewed-source-bound successor corrects both counters in the same math
report, exposes the two denominators, and keeps candidate selection, labels,
all other report fields, root helpers and historical evidence intact.
These remain static heuristics, not arithmetic semantics or runtime coverage.

```
python research/section-math-instruction-counts/test_analyze.py
python research/section-math-instruction-counts/analyze.py --program pump --output <new-directory>
```

`validation.json` compares every reported math window in all nine retained
captures, includes input hashes and before/after witnesses, and independently
counts signed shifts and LDDW continuation slots. Output directories must be new;
the CLI binds its UTF-8 report to the capture and reviewed helper SHA-256.
