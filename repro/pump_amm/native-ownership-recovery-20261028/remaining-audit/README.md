# Remaining AMM work

All 127 unmatched ranges (332,008 bytes) are listed exactly once in
[remaining-audit.json](remaining-audit.json). This is 16.2% of original function
windows and 28.6% of executable bytes. The independently verified
[classification packet](../results/new-proofs/lineage/remaining-classification/README.md)
distinguishes 78 recognized source-immediate-only candidates from 49 remaining
instruction/shape gaps. Matching source metadata, complete calls/data/relocations,
original build provenance and uncovered runtime behavior remain separate requirements.

```sh
python -B verify.py --measurement ../results/measurement.json.gz
```
