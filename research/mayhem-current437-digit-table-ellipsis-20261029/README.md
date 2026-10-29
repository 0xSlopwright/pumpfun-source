# Qualified437 decimal digit-table / ellipsis leftover

This packet counts **208 static `.rodata` bytes** inside the assigned leftover gap after format-crumbs (#889): one early format crumb, the `00`..`99` digit table, and the `[...]` placeholder. All checks run on both the original and candidate images. This packet adds data evidence, not a function match.

The prior obligations are preserved: **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**, with **0 rejected pairs**. No binary patch, no whole-binary equivalence, and no NUL or adjacency bound is claimed.

## Source

Only static bytes are read.

- `[723444, 723447)` — crumb ` {\n`, bounded by relocated `lddw` of the `.rodata` pointer plus `mov` of length immediate 3 at `pc+24` (equal rigor to classic text sites; length is not at `pc+16`).
- `[723458, 723658)` — 200-byte decimal digit table `00`..`99`. Length comes from index-table equal rigor: four matched sites compute `(n % 100) << 1` (div/mul 100, left-shift 1, and-mask 254 or 65534), add the base pointer, and load table bytes. Same discipline as `research/mayhem-current437-bounded-index-tables-20261029/`.
- `[723658, 723663)` — `[...]`, bounded by an exact conditional pointer/length record: the same unsigned comparison selects `(ellipsis,5)` or the empty `(1,0)` representation. Both branches, fallback assignments and final stack stores are checked; the length5 assignment is at`pc+32`.

NUL, the following byte, and adjacency are not bounds. No descriptor is claimed.

## Coverage

The baseline is the bounded-index-tables packet at **21,796 / 26,180** payload bytes (`.rodata` 14,972 / 18,396, `.data.rel.ro` 6,824 / 7,784).

These intervals were disjoint from that baseline. Payload coverage becomes **22,004 / 26,180 bytes**, leaving the remainder unproved. `.rodata` becomes **15,180 / 18,396** (+208). `.data.rel.ro` is unchanged. The added `.rodata` union is `[723444, 723447)` + `[723458, 723663)`.

## Still open

Inside the assigned leftovers:

- `[723439, 723444)` — early format crumbs with conditional length 2/3 (no single unconditional imm length).
- `#889` owns `[723447, 723458)` — not reclaimed here.

Do not reclaim OPEN #819/#823/#851/#852/#879/#881/#889/#890 intervals, rust-panic sealed neighbors, or Codex `720328` remainder areas.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3.12 -B research/mayhem-current437-digit-table-ellipsis-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3.12 -B research/mayhem-current437-digit-table-ellipsis-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3.12 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=scripts python3.12 -B scripts/test_tooling.py
```

## Attribution

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

## Independent decoder review

The checked arithmetic chains now bind every register, instruction and both byte loads through the base/index addition. For low8 or low16 input`u`, division/multiplication/subtraction gives`u-100*(u//100)` in`[0,99]`; shifting produces`[0,198]`, and loads at offsets0/1 stay within the200-byte table. The final masks remove higher input bits in the wider register. The crumb check binds its actualr2 pointer/r3 length arguments and the intervening move. The ellipsis record is conditional, with identical unsigned predicates selecting pointer and length together.

These checks close32 reproduced decoder false positives over both images; the original observations,208-byte attribution and21796-byte historical baseline remain byte exact. This packet's union is disjoint from the prior reviewed batch's1510-byte additions. These are static attribution checks on the historical437-function image; they do not change the current meaningful-ELF identity or function-completion counts.
