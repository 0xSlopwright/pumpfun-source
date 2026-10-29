## Summary

Counts the 25 `ProgramError` unit-variant Debug names on the qualified437 images. Original owner O0052 is `[38832, 39952)`; both active candidate owners `38832` and `552232` carry the same path offsets but different `.rodata` pointers. Each observed tag 1 through 25 loads one relocated `.rodata` pointer and one immediate length, then calls the shared `Formatter::write_str` writer. Tags 3, 6, 23 and 25 share the length move at owner offset 968. The 494 bytes were uncovered after the prior MayhemError Display packet.

The `Custom` tag 0 path at offsets 616 through 704 is excluded, as are the `TryFromIntError` name `[709224, 709239)` and the bare `"Custom"` literal `[709239, 709245)`. The counted intervals union to `[709245, 709739)` = 494 bytes.

Package: `research/mayhem-current437-programerror-debug-names-20261029/`.

Upstream review diff, against `lalalune/pumpfun-source` `main`:

https://github.com/lalalune/pumpfun-source/compare/main...harrywu666:pumpfun-source:opencode/mayhem-data-programerror-debug-names-20261029?expand=1

## Evidence

| Input | SHA-256 |
| --- | --- |
| `evidence/original/mayhem/deployed.so` | `a87fa9f866272514e6acb852b668c4a08aeb173d56c883039991d114d1199bdb` |
| `research/mayhem-current437-composition-20261028/builds/first/symbols.so.gz` | `9c8c50857bfe8b80ebf08ebb50c905c6582676cb8e572d39f45de8647f62fbae` |
| `source-context/solana-program-error-3.0.1.crate` | `4f04fa578707b3612b095f0c8e19b66a1233f7c42ca8082fcb3b745afcc0add6` |

The relation stays **437 normalized / 141 raw / 431 closed windows / 581 pairs**. Payload coverage moves from **18,745** to **19,239 / 26,180**. `.rodata` moves from **12,289** to **12,783 / 18,396**. `.data.rel.ro` stays **6,456 / 7,784**. No relocation-table bytes are added.

The reader admits only the unit-path grammar: tag load, binary-search jumps, formatter-argument move, one relocated pointer, one immediate length, jumps and the shared direct writer call. It stops before the unresolved writer call at `682176` / `615856`. It does not name the callback target beyond the checked writer helper, and it does not claim output or runtime behavior. Tag 0 and tags outside `1..=25` are rejected. No binary patch or whole-binary equivalence is claimed.

## Still open

`6,941` payload bytes remain. The largest `.rodata` gaps include `[722392, 723755)`, `[713022, 714341)`, and `[709739, 710440)`. Beside the new strings, `[710712, 710924)` and `[711407, 711412)` are open, as is the excluded `TryFromIntError` / `"Custom"` span `[709224, 709245)`. The `.data.rel.ro` gaps are unchanged, and relocation and section layout are unchanged.

## Test plan

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-programerror-debug-names-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-programerror-debug-names-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
cd scripts && PYTHONDONTWRITEBYTECODE=1 python3 -B test_tooling.py
```

provider=OpenCode (Zen) model=opencode/glm-5.3-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
