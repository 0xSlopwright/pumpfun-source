# Remaining AMM work

All 125 unmatched ranges (330,664 bytes) are listed exactly once in
[remaining-audit.json](remaining-audit.json). This is 15.9% of original function
windows and 28.5% of executable bytes. The independently verified
[classification packet](../results/new-proofs/lineage/remaining-classification/README.md)
distinguishes 80 recognized source-immediate-only candidates from 45 remaining
instruction/shape gaps. Matching source metadata, complete calls/data/relocations,
original build provenance and uncovered runtime behavior remain separate requirements.

```sh
python -B verify.py --measurement ../results/measurement.json.gz
```
