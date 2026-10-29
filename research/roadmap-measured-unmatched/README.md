# Roadmap bound to actual candidate misses

The archived roadmap equates unnamed windows with unmatched windows and uses
hard-coded frontier counts (823/660/438). Its priority lists therefore include
windows already matched by a supplied candidate, while excluding named misses.
With the retained candidate bindings here, actual normalized misses are 16
Pump, one AMM and zero Mayhem, rather than the old estimate of 340 in total.

The successor measures each checksum-bound unstripped candidate with the
reviewed window matcher, uses its actual matched-address set for priority
selection, retains the complete miss list before summaries, and saves
`candidate-bindings.json` in the generated packet's manifest. The report field
is `unmatched_windows_by_size`; legacy aggregate keys ending in `_estimate`
remain for compatibility but now describe this measured candidate comparison.
The archived source and earlier reports remain intact. Other instruction,
call-context and phase heuristics retain their archived meaning.

```sh
python research/roadmap-measured-unmatched/test_generate.py
python research/roadmap-measured-unmatched/generate.py --output work/measured-roadmap
python work/measured-roadmap/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. The default `candidates.json` names three exact
retained artifacts. `--candidates` may select another complete three-program
binding, with repository-contained paths and SHA-256 values. Sparse checkouts
must include those candidate files. An incorrect hash or incomplete program
set is rejected before generation. `validation.json` records the tested
revision, complete before/after report hashes and actual counts.

Normalized window matches do not prove whole-file equality, injective source
correspondence, source provenance or runtime acceptance. Zero Mayhem misses
here is only this window-matching result; it does not mean Mayhem is complete
or secure. The roadmap is specific to its recorded candidate hashes and does
not automatically follow later selected frontiers.
