# Remaining AMM work

All 126 unmatched ranges (331,232 bytes) are listed exactly once in
[remaining-audit.json](remaining-audit.json). This is 16.1% of original function
windows and 28.5% of executable bytes. The independently verified
[classification packet](../results/new-proofs/lineage/remaining-classification/README.md)
distinguishes 79 recognized source-immediate-only candidates from 47 remaining
instruction/shape gaps. Matching source metadata, complete calls/data/relocations,
original build provenance and uncovered runtime behavior remain separate requirements.

```sh
python -B verify.py --measurement ../results/measurement.json.gz
```
