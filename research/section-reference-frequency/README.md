# Complete static data-reference frequencies

The archived `scripts/deep_section_analysis.py` counts references per window
correctly, but builds its hot-address rankings from lists capped at twenty
displayed addresses. References beyond that cap disappear from the ranking.

This source-bound successor aggregates complete reference lists before the
display cap. Per-window records, totals, display caps and all other layers stay
unchanged. Both reviewed LF and CRLF source forms are accepted; other source
drift fails closed. The archived helper and earlier evidence remain intact.

From the repository root:

```sh
python research/section-reference-frequency/test_generate.py
python research/section-reference-frequency/generate.py --program mayhem --output work/mayhem-complete-reference-frequency
python work/mayhem-complete-reference-frequency/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. The complete three-program regeneration and its
before/after hashes are recorded in `validation.json`. An independent walk over
all captured original instructions checks both rankings, including order and
counts, while requiring all other cross-section fields to remain identical.

This corrects static occurrence counts. It does not establish dynamic reference
frequency, runtime reachability, binary equivalence or reconstruction coverage.
The archived heuristic meaning of data references and other layers is unchanged.
