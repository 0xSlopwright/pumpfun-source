# Mayhem quote-ATA-named literals and their length call sites

This packet counts **three static `.rodata` literals totalling 50 bytes** whose
names share the `_quote_ata` suffix, and verifies **13 call sites per image**
that load each literal with a relocated `lddw r3` and pass its exact byte length
in `mov64 r4` before a call. The literals are uncredited in the merged
qualified437 ledger. No callee, seed derivation, allocation extent or
relocation-table byte is claimed.

## Claim

| Literal | Original interval | Bytes | Candidate pointer | Sites |
| --- | --- | ---: | ---: | ---: |
| `trader_quote_ata` | `[710648, 710664)` | 16 | `0xa8ca0` | 3 |
| `sol_vault_quote_ata` | `[711542, 711561)` | 19 | `0xa9509` | 4 |
| `admin_quote_ata` | `[711598, 711613)` | 15 | `0xa951c` | 6 |

Every selected site has the form `lddw r3, literal` (type-8 relocation, symbol
index zero), `mov64 r4, <exact length>`, `call` at `site + 24`. The packet
asserts that the complete set of pointer-matching type-8 sites in each image is
exactly the reported set and that each site carries the literal's exact length.
The immediate length is the bound, not adjacency.

## Qualified relation

The three literals form one `_quote_ata` naming family and share one call
shape: pointer in `r3`, immediate length in `r4`, then a call. The bound is
proved per literal by its own sites; the two candidate-adjacent literals
(`sol_vault_quote_ata` at `0xa9509` and `admin_quote_ata` at `0xa951c`) are
still verified against their own length immediates, and a test mutates the
second literal and checks that the first literal's site set is unchanged. In
the original image `sol_vault_quote_ata` is followed by unrelated bytes, not by
`admin_quote_ata`.

The candidate pointers differ from the original pointers; only the literal
bytes and the pointer/length relation are claimed.

## Coverage

The baseline is the sealed union of the 35 merged qualified437
`coverage-delta.json` files present at `65fe136fc`, recomputed from path +
SHA-256 rather than summed; `proof.py` reads the pinned set and totals from
`baseline/sources.json` and asserts the union equals the declared totals instead
of hardcoding them: **24,444 / 26,180 payload bytes** (`.rodata` 17,028 / 18,396;
`.data.rel.ro` 7,416 / 7,784).

After this packet:

- payload: **24,494 / 26,180 bytes**;
- `.rodata`: **17,078 / 18,396** (+50);
- `.data.rel.ro`: **7,416 / 7,784** (unchanged).

The new intervals are exactly `[710648, 710664)`, `[711542, 711561)` and
`[711598, 711613)`. They are disjoint from merged #956,
#1000/#1003/#1005/#1010/#1012/#1014/#1015/#1017, #1046, #1052 and the merged
shared-descriptor #1066.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-quote-ata-literals-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-quote-ata-literals-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

`observations.json.gz` records each literal's bytes and every site address in
both images. Tests mutate every literal byte, every site's pointer low word,
pointer high word, length immediate and call opcode, and a candidate length
immediate; each mutation is rejected. They also assert that the candidate-adjacent
literal is not a bound and that the following byte of `trader_quote_ata` is not
absorbed, and reject unlisted files, symlinks, FIFOs and resealed
observations/coverage/baseline/input edits.

## Limits

This proof is static. It does not establish that these literals are PDA seeds,
what the call target is, reachability, runtime behavior or a stable layout. It
does not claim any byte outside the three intervals, the callee, or a full
string table. The site set is an observed mapping for this image pair only. No
binary patch or whole-ELF identity is claimed.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
