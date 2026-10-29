# Deserialization struct size

The archived section analyzer stores only the first 20 sorted load offsets,
then uses that truncated list as the struct size. Pump window `0xfbc0`,
base register 3, is reported as 215 bytes. The loads continue through offset
223, so the size is 231.

```
python3 -I -B research/deser-struct-size/test_correct.py
```

The successor checks the archived helper and changes only that size
expression. The 20-offset field list stays a display cap. `scripts/deep_section_analysis.py`
is not edited. These sizes are static load-offset bounds, not recovered
account layouts or runtime sizes.

`validation.json` is hand-written; `test_correct.py` recomputes its hashes,
witness and per-program counts through `correct.py`.
