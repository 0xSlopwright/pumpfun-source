# Raw window-match attribution

The archived matcher reports the first normalized candidate's name while
setting `raw` if *any* normalized candidate has identical bytes. A later raw
witness can therefore lend its proof to an earlier, different function name.
The three retained, checksum-bound unstripped candidates require 190 reported
name corrections: Pump 45, AMM 87 and Mayhem 58. Additional rows have different
candidate function bodies sharing the same reported symbol name; those names
already have a valid raw witness and remain unchanged.

This source-bound successor chooses the first raw witness when one exists.
Otherwise it retains the first normalized match, or null for an unmatched
window. Matching criteria and every raw/normalized count remain unchanged.
Root helpers, existing binaries and earlier reports remain intact. Reviewed
LF/CRLF checkouts work and other source drift is rejected.

```sh
python research/window-raw-match-attribution/test_measure.py
python research/window-raw-match-attribution/measure.py --original evidence/original/mayhem/deployed.so --candidate research/mayhem-canonical-promotion-20261028/hosted/40770208958/symbols.so --output work/mayhem-raw-attribution.json
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

The output parent must exist and the output file must be new. Tests need the
three exact candidate paths recorded in `test_measure.py` (include them in a
sparse checkout). They verify every actual raw row against a same-name,
same-size, same-relocation-pattern, byte-identical candidate function and
retain all non-raw choices. `validation.json` records candidate bindings,
before/after report hashes and representative changed rows.

This repairs which candidate name supports an existing raw claim. It adds no
raw matches, injective correspondence, whole-program equality, source
provenance or runtime guarantee. Multiple possible raw witnesses remain
possible; choosing the first does not prove unique historical attribution.
