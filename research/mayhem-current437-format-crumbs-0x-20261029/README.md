# Historical Mayhem data attribution: PR #889

This packet independently bounds **11 new bytes** against the common reviewed,
merged #846 data baseline: **21,796 / 26,180 bytes**. Its own bounded historical
union with that baseline is **21,807 / 26,180**. Other open packets are not
included in this per-packet baseline. The separate batch review deduplicates all
eight additions; these figures are not a latest complete source footprint.

The original and qualified437 candidate payload/descriptor/argument/index paths
are checked. This adds finite historical data attribution only: no maintained
code, normalized window or current-native-ELF progress is credited. Text and
relocation-table bytes are proof evidence, not credited payload.

## Retained attribution detail

# Qualified437 format-crumb / `0x` text-site remainder

This packet counts **7 static `.rodata` crumbs totaling 11 bytes** inside the assigned leftover gap `[723439, 723663)`, and proves **18 classic text sites** as proof sites only. All checks run on both the original and candidate images. This packet adds data evidence, not a function match.

The prior obligations are preserved: **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**, with **0 rejected pairs**. No binary patch, no whole-binary equivalence, and no NUL or adjacency bound is claimed.

## Source

Only static bytes are read. Each crumb is bounded by the classic text-site grammar established in `research/mayhem-current437-rust-panic-messages-20261029/`: relocated `lddw` of a `.rodata` pointer followed immediately by `mov` of the exact length immediate. NUL, the following byte, and adjacency are not bounds. No descriptor is claimed.

Counted texts: `,\n`, `}`, ` }`, `(`, `(\n`, `,`, `0x`.

## Still open

Inside the assigned leftovers `[723439, 723663)`:

- `[723439, 723447)` — early format crumbs without a classic `lddw`+immediate-length pair at `pc+16`.
- `[723458, 723663)` — digit table / `[...]` placeholder (indexed base pointer; no countable full-span length bound). Tiny hole `[723373, 723376)` remains outside this packet.

Do not reclaim OPEN #819/#823/#851/#852/#879/#881 intervals, rust-panic sealed neighbors, or Codex `719929–723279` / grapheme-ranges areas.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3.12 -B research/mayhem-current437-format-crumbs-0x-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3.12 -B research/mayhem-current437-format-crumbs-0x-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts python3.12 -B scripts/test_tooling.py
```

## Attribution

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5


The original observations.json.gz is preserved byte-exact; only the derived
coverage baseline/classification report and checker/docs/input seals are updated.

Verification requires the already-merged #846 baseline at its pinned hash.
Use normal Python: public entrypoints refuse `-O` because the retained proof
chain uses assertions. Tests mutate in-memory analysis copies only; these are
never compiler inputs or replacement artifacts.
