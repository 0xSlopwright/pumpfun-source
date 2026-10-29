# Bind discriminator comparisons to their load

The archived section analyzer treats any equality/inequality instruction directly
after LDDW as a discriminator candidate. Some comparisons read different registers;
the loaded constant does not participate in that comparison at all.

The successor authenticates the frozen analyzer and requires the loaded destination
to appear in the comparison's actual read operands. Immediate forms read only dst;
register forms read dst and src. All unrelated report fields remain identical,
including the independent heuristic limits of the archived IDL analysis.

```
python research/idl-comparison-register-binding/test_generate.py
python research/idl-comparison-register-binding/generate.py --program pump --output <new-directory>
```

`validation.json` records every input hash and representative raw load/comparison
witnesses. All reported candidates across all nine retained captures are checked;
99 unrelated comparisons are removed. This strengthens only a static candidate
predicate. A retained comparison still does not prove an Anchor selector, handler,
argument layout, executed path or source equivalence. Captures, root helpers and
historical reports are preserved, and output directories must be new.
