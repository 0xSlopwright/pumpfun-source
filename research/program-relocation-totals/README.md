# Whole-ELF relocation totals

The archived program analyzer labels the sum of text-window relocations as
`total_relocations` and “Total relocations.” This omits the real data relocations.
The successor reports the whole `.rel.dyn` inventory and keeps the old quantity
explicitly as `text_window_relocations`; its generated README distinguishes both.

```
python research/program-relocation-totals/test_generate.py
python research/program-relocation-totals/generate.py --program pump --output <new-directory>
```

Both complete packet workflows run for all four original core programs. Tests
independently count raw relocation-table rows, preserve every other summary field,
compare the unchanged inventory/graph/index/section outputs, and run each new
packet verifier. The helper is bound to reviewed LF/CRLF hashes; existing output
directories, original captures and historical packets remain preserved.
These are static inventory counts, not newly recovered code or runtime coverage.
