# Printable section runs ending at EOF

The archived section analyzer flushes printable text only when a nonprintable
byte follows. A run ending exactly at the section boundary disappears. The
retained SPL Token capture reproduces this: a 34-byte run at file offset
`0x19b95` reaches the end of `.rodata` and is omitted.

This reviewed-source-bound successor flushes that final run with the same
four-byte threshold, address/length fields and 200-character display cap as
terminated runs. No original scripts, captures or historical packets change.
The small data-layout entrypoint accepts only the nine retained capture names
and emits a fresh UTF-8 JSON receipt bound to the input and reviewed source.

```sh
python research/section-trailing-printable-runs/test_generate.py
python research/section-trailing-printable-runs/generate.py --capture spl_token --output work/spl-token-complete-data-layout.json
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

The output parent must exist and the file must be new. Tests independently
extract all printable runs from both analyzed sections in every capture. Only
the one SPL Token tail changes; all other fields remain identical. Reviewed
LF/CRLF source hashes are accepted and other drift fails closed.

`validation.json` records the nine-capture before/after binding and actual CLI
receipt. A printable run may contain adjacent literals; this does not recover
source-level string boundaries, alter dependency program code or prove source
or runtime equivalence.
