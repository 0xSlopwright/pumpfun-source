# Historical Mayhem data attribution: PR #823

This packet independently bounds **304 new bytes** against the common reviewed,
merged #846 data baseline: **21,796 / 26,180 bytes**. Its own bounded historical
union with that baseline is **22,100 / 26,180**. Other open packets are not
included in this per-packet baseline. The separate batch review deduplicates all
eight additions; these figures are not a latest complete source footprint.

The original and qualified437 candidate payload/descriptor/argument/index paths
are checked. This adds finite historical data attribution only: no maintained
code, normalized window or current-native-ELF progress is credited. Text and
relocation-table bytes are proof evidence, not credited payload.

Descriptor records credit each differing eight-byte pointer half as mapped
bytes and its equal eight-byte length half as raw bytes. Classic text sites bind
the pointer argument register immediately before the length register.

## Retained attribution detail

# Qualified437 capacity/Display/bool-token strings, descriptors and text sites

This packet counts **17 static literal strings totaling 224 `.rodata` bytes**, their **5 counted 16-byte descriptors totaling 80 `.data.rel.ro` bytes**, and **12 classic text sites** that bind relocated pointers and immediate lengths. All three kinds are checked on both the original and candidate images. This packet adds data evidence, not a function match.

The prior obligations are preserved: **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**, with **0 rejected pairs**. No binary patch and no whole-binary equivalence is claimed.

## Source

Only static bytes are read. Each string is bounded by the immediate length carried by its descriptor or its text site. A NUL byte, the following byte, and adjacent strings are not bounds. No binary middle table, no digit table and no `[...]` placeholder is claimed.

The 16-byte descriptors live in `.data.rel.ro`. The layout is `u32 low = 0`, `u32 high = pointer`, `u64 length`, with exactly one type-8 relocation at the record start whose symbol index is 0. The candidate copies carry different `.rodata` pointers but the same lengths and the same bytes.

The twelve text sites decode the classic bounded pair grammar: `lddw` of a relocated `.rodata` pointer at `pc`, followed by a `mov` of the immediate length at `pc + 16`. There is no relocation on the continuation, the length `mov`, or the surrounding words. The pointed-to bytes must equal the counterpart and the recorded text. The sites stop at the immediate pair; no callee, callback target, output or runtime effect is claimed. Text sites are proof-only and add no payload credit.

The added `.rodata` union is `[708538, 708688) + [708716, 708724) + [708728, 708736) + [708748, 708752) + [708756, 708760) + [708768, 708772) + [708776, 708780) + [708792, 708834)`.

The added `.data.rel.ro` union is `[725480, 725512) + [725536, 725552) + [725688, 725704) + [732872, 732888)`.

## Still open

The 4-byte word `[708724, 708728)` between counted `code` and `Kind` stays open (no descriptor or classic text-site bound).

Leftover inside assigned gap `[708538,708840)`: `[708688,708716)` (false + padding), `[708724,708728)`, `[708736,708748)`, `[708752,708756)`, `[708760,708768)` (includes `true`), `[708772,708776)`, `[708780,708792)`, `[708834,708840)` — not claimed (no classic descriptor/text-site bound used here).
- The merged #779 and #783 ranges are already included in the common #846 baseline and add no new bytes here.
- Remaining larger gaps elsewhere unchanged except this bite.

Relocation and section layout are unchanged. None of the leftover binary or token content is claimed here.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-capacity-display-bool-tokens-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-capacity-display-bool-tokens-20261029/test_verify.py
```

## Exact intervals

Ends are exclusive. String pointers and descriptor offsets are original addresses unless labelled candidate. All 5 descriptors are 16 bytes.

### Strings

| # | Original interval | Length | Candidate pointer | Text |
| ---: | --- | ---: | ---: | --- |
| 1 | 708538–708555 | 17 | 688821 | `capacity overflow` |
| 2 | 708555–708604 | 49 | 688838 | `Unable to find a viable program address bump seed` |
| 3 | 708604–708631 | 27 | 688887 | `failed to fill whole buffer` |
| 4 | 708631–708633 | 2 | 688914 | `()` |
| 5 | 708633–708688 | 55 | 688916 | `a Display implementation returned an error unexpectedly` |
| 6 | 708716–708720 | 4 | 688996 | `pool` |
| 7 | 708720–708724 | 4 | 689000 | `code` |
| 8 | 708728–708732 | 4 | 689008 | `Kind` |
| 9 | 708732–708736 | 4 | 689012 | `kind` |
| 10 | 708748–708752 | 4 | 689028 | `Some` |
| 11 | 708756–708760 | 4 | 689036 | ` <= ` |
| 12 | 708768–708772 | 4 | 689048 | `Pool` |
| 13 | 708776–708780 | 4 | 689056 | `None` |
| 14 | 708792–708796 | 4 | 689072 | `    ` |
| 15 | 708796–708800 | 4 | 689076 | `mint` |
| 16 | 708800–708829 | 29 | 689080 | `Invalid bool representation: ` |
| 17 | 708829–708834 | 5 | 689109 | `Error` |


### Descriptors

| # | Original offset | Candidate offset | Pointer original → candidate | Length |
| ---: | ---: | ---: | --- | ---: |
| 1 | 725480 | 705920 | 708538 → 688821 | 17 |
| 2 | 725496 | 705936 | 708555 → 688838 | 49 |
| 3 | 725536 | 705976 | 708604 → 688887 | 27 |
| 4 | 725688 | 706128 | 708800 → 689080 | 29 |
| 5 | 732872 | 713312 | 708756 → 689036 | 4 |

### Text sites

| # | Original PC | Candidate PC | Pointer original → candidate | Length | Length register |
| ---: | ---: | ---: | --- | ---: | ---: |
| 1 | 32192 | 32192 | 708631 → 688914 | 2 | r3 |
| 2 | 15568 | 15568 | 708633 → 688916 | 55 | r2 |
| 3 | 36128 | 36128 | 708829 → 689109 | 5 | r3 |
| 4 | 647160 | 580840 | 708748 → 689028 | 4 | r3 |
| 5 | 647224 | 580904 | 708776 → 689056 | 4 | r3 |
| 6 | 585064 | 518744 | 708768 → 689048 | 4 | r4 |
| 7 | 668264 | 601944 | 708728 → 689008 | 4 | r4 |
| 8 | 667344 | 601024 | 708732 → 689012 | 4 | r3 |
| 9 | 291976 | 229712 | 708716 → 688996 | 4 | r4 |
| 10 | 667584 | 601264 | 708720 → 689000 | 4 | r3 |
| 11 | 235832 | 212512 | 708796 → 689076 | 4 | r4 |
| 12 | 675576 | 609256 | 708792 → 689072 | 4 | r3 |

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash


The original observations.json.gz is preserved byte-exact; only the derived
coverage baseline/classification report and checker/docs/input seals are updated.

Verification requires the already-merged #846 baseline at its pinned hash.
Use normal Python: public entrypoints refuse `-O` because the retained proof
chain uses assertions. Tests mutate in-memory analysis copies only; these are
never compiler inputs or replacement artifacts.
