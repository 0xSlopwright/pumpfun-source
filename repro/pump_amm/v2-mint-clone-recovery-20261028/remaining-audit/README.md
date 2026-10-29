# Remaining AMM work

All 125 unmatched ranges (330,664 bytes) are listed exactly once in
[remaining-audit.json](remaining-audit.json). This is 15.9% of original function
windows and 28.5% of executable bytes. The independently verified
[classification packet](../results/new-proofs/lineage/remaining-classification/README.md)
distinguishes 80 recognized source-immediate-only candidates from 45 remaining
instruction/shape gaps. Matching source metadata, complete calls/data/relocations,
original build provenance and uncovered runtime behavior remain separate requirements.

| Area | Unmatched windows | Original bytes |
| --- | ---: | ---: |
| Swap and route handlers | 24 | 122,424 |
| Liquidity, admin and incentives | 27 | 132,208 |
| Math, token and runtime helpers | 18 | 18,800 |
| State methods and serialization | 18 | 29,432 |
| Instruction error closures | 35 | 18,216 |
| Generated account validation | 3 | 9,584 |
| **Total** | **125** | **330,664** |

The largest open bodies are swap/route and liquidity/admin/incentive handlers.
The 80 source-immediate-only candidates still require authentic metadata and
call/data evidence; they are not counted as complete. Four current synthetic
CreatePool cases retain the default-budget discrepancy. Authentic successful
fixed-admin create_config replay and full historical build provenance also
remain open. See the checkpoint's observed resource boundary for the exact
scope of the signed local controls.

```sh
python -B verify.py --measurement ../results/measurement.json.gz
```
