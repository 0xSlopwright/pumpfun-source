# SBPF relocation type labels

The archived section analyzer calls type 8 `R_BPF_64_ABS64` and type 10
`R_BPF_64_ABS32`. The [SBPF loader's relocation enum](https://github.com/anza-xyz/sbpf/blob/232878a9effc3df9c8693bbb599eba794d1898c0/src/elf.rs#L187)
defines 8 as `R_Bpf_64_Relative` and 10 as `R_Bpf_64_32`. All 13,094
relocations in the three captured originals therefore receive misleading names.

This successor changes only the reviewed type-name table, including removing
the unsupported type-2 alias for relative relocation. Unknown types retain their
numeric identifier and `UNKNOWN_<id>` label. Every other field, resolved value,
numeric ID and classification remains unchanged. Both reviewed LF and CRLF
source forms work; other source drift is rejected. The root helper and earlier
packets remain intact.

```sh
python research/section-relocation-type-labels/test_generate.py
python research/section-relocation-type-labels/generate.py --program mayhem --output work/mayhem-correct-relocation-labels
python work/mayhem-correct-relocation-labels/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. `validation.json` records complete three-program
before/after report generation. Tests compare every relocation with the raw
table and require all non-label fields to remain identical. These are static
ELF labels; this does not execute the loader, validate relocation safety, or
establish runtime behavior or source equivalence. Other layers keep their
archived behavior.
