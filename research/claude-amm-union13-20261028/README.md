# PumpSwap AMM union composite 13: 784/785 normalized (+0x351a8 distribute_cashback; raw 267, layout layer raw 784)

Follow-up to [`research/claude-amm-union12-20261028`](../claude-amm-union12-20261028/README.md) (merged as #558,
Linux 783/785, 236 raw source-only, 259 raw with its layout layer). It adds the fleet-B lane delivery
`fb3-A-build-w5-01`, made on union-780, which closes window `0x351a8`, `buy::distribute_cashback` (8,104 bytes, whole
function normalized-equal). The **separately labeled layout layer**, a linker order **generated from the original
program's layout**, is regenerated.

This is a research packet: the maintained `programs/` tree and `repro/status.json` are untouched.

**Relation to main.** Main already holds 784/785 normalized with raw 267 source-only from
[buy cashback recovery](../amm-cashback-buy-recovery-20261028/README.md) (#617) and
[checked sell decoder](../amm-sell-checked-decoder-20261028/README.md) (#630). This packet's
source-only build matches that count (784/267); its new result is the generated layout layer,
where all 784 matched windows are raw-equal. Its archived `swap/sell.rs` (line 451) still calls
`Account::<UserVolumeAccumulator>::try_from_unchecked`; #630 restored the original's checked
`try_from`, which this composite does not include.

| Linux v1.44 build (authenticated recipe) | normalized | raw |
|---|---:|---:|
| parent `research/claude-amm-union12-20261028` (symbols `36a94b38…`) | 783/785 | 236 |
| **this candidate, source only** (symbols `314d26e6…`, stripped `a775c319…`) | **784/785** | **267** |
| this candidate **+ generated layout layer** (stripped `6c9ae721…`) | 784/785 | **784** |

- **Windows:** against the parent, +1 normalized window (`0x351a8`) and +31 raw windows, with 0 normalized and 0 raw
  losses.
  - The layout layer gains `0x351a8` and 525 raw windows against the parent's layout layer, with 0 losses. **Every one
    of the 784 matched windows is raw-equal in the layout image.** It loses no raw window of the source-only image.
  - The native macOS build goes from 778/225 to 779/240, with 0 losses. It reproduces the lane's recorded build
    (`ea3f034d…`).
- **Dropped delivery (`composition.json`, `dropped`):** the second fleet-B delivery, `fb3-A-sellcb-w8-01`, is not
  included. It was raw-only on union-780 and brings the still-unmatched `sell.rs` cashback helper (`0x4c750`) to the
  original's length.
  - Composed on top of `fb3-A-build-w5-01` it gains no window, normalized or raw. It costs 8 raw windows natively, 24 on
    Linux source-only and 462 in the layout layer (composite: 779/232, 784/243 and 784/322).
  - The cause: its tail `let result = validate_pool_v2(..); if let Err(e) = result { return Err(e); }` leaves one
    function the original does not have, `core::ptr::drop_in_place::<Result<(), anchor_lang::error::Error>>`. The
    layout report shows 786 candidate `.text` sections against 785 original windows, and that extra section moves the
    code after it.
  - The measured composite is recorded, not delivered. Its 25-suite replay also had 0 mismatches.
- **Runtime:** the 25 maintained suites report 17,462 cases and 0 mismatches for both images. The five incentive
  error-order controls in `negative/` agree 5/5 for both images, each run in a fresh VM.
- **Still open:** 1 window is unmatched: `0x4c750`, the `sell.rs` cashback helper. Whole-ELF identity is still false:
  `.text` differs in that window.

## What changed (`composition.json`, `source.patch`, `source-changes.json`)

Against the parent archive, 1 file is modified; none are added or removed. The lane patch was made on union-780 and
applies unchanged. The resulting file equals the lane's tree.

`instructions/swap/buy.rs` (`fb3-A-build-w5-01`, window `0x351a8`):

- `distribute_cashback` takes wrapper references: `payer: &Signer<'info>`,
  `quote_mint: &InterfaceAccount<'info, Mint>` and `quote_token_program: &Interface<'info, TokenInterface>` instead of
  `&AccountInfo<'info>`. The CPI account fields use `.to_account_info()`, and both callers pass `user`, `quote_mint` and
  `quote_token_program` instead of `.as_ref()`;
- `remaining_accounts.first()` instead of `remaining_accounts.get(0)`, with the same arms. `err!` stays on line 44;
- `let exists = !ata.data_is_empty();` and `if !exists {` instead of `if ata.data_is_empty() {`. According to the lane,
  rustc lowers a `!` condition by swapping the arms, which puts the create block before the join and gives the
  original's branch polarity;
- the tail is `validate_pool_v2(remaining_accounts, &base_mint.key(), 1)?; Ok(())` instead of returning the call.

The checks, error codes and lines, events, CPIs and CPI order are unchanged. The 25 runtime suites re-check the
behavior, including the cashback suite.

The composite was measured natively against the union-780 frontier (zero losses), then rebuilt twice with the Linux
recipe.

## Positioning devices (all of them, this step)

- **fb3-A-build-w5-01:** line-neutral. One blank line after `distribute_cashback` is removed because the tail became two
  lines, so `get_buyback_accounts` and all later lines keep their numbers. `let exists` takes the former blank line 58.
  The error lines 44 (`err!`), 54 (`require!`), 57 (`err!`) and 98 (`error!`) are unchanged.

There are no comment or doc lines, no `#[inline]` attributes and no file moves in this step. `buy.rs` keeps its 993
lines. Devices from earlier steps are listed in the parent packets. `source-changes.json` has per-file counts of blank,
comment, doc and `#[inline]` lines.

## Layout layer (`layout/`, mega-run rule 4b)

**`layout/ordered.ld` is generated from the original deployed program's layout. It is not evidence of historical build
provenance.** The method is the same as in the parent:

1. `tools/lbuild-raw.sh` builds the root crate through `lwrap-lin.sh`. The output is byte-identical to the source-only
   build, and the link map is saved.
2. `tools/lay.py --mode order` writes the order: `.text` input sections in original window order, `.rodata` and
   `.data.rel.ro` atoms in bound original-address order, no padding, and no address assignments.
3. The program is relinked with that script.

`verify.py` regenerates `ordered.ld` from the source-only build plus the saved link map and requires the same bytes.

## Builds, runtime, verify

- **Builds:** `builds/a`, `builds/b`, `layout/builds/a` and `layout/builds/b` use the parent recipe: the pinned
  `solana-verifiable-build` image with the recorded mounts and cargo command (`tools/lbuild.sh`, `tools/lbuild-raw.sh`).
  - Each pair is byte-identical. Only the two workspace crates recompile.
  - The existing `admin_update_token_incentives` stack-frame diagnostic remains, as in the parent, so this is not a
    warning-free build. There is no `Stack offset` warning, and the warning count is unchanged (30).
- **Runtime (reported):** `runtime/` and `layout/runtime/` each report 25 suites, **17,462 cases, 35,074 transactions,
  35,418 signatures and 0 mismatches**. Each summary is bound to its stripped image and to the repository harness
  hashes. As in the parent, the per-case receipts are not included, so the verifier checks only the reported totals and
  input hashes.
- **Error-order controls (`negative/`):** the PR434/PR464/PR494/PR500/PR525/PR548/PR558 producer and fixture,
  byte-identical, re-run for both images with `PUMP_AMM_FRESH_VM=1`. All 5 pairs agree for each image (20 signed
  executions). `negative/verify.py` checks the H11 guard witness in `state/volume_accumulator.rs`, which this step does
  not touch (see `negative/README.md`).

```sh
python3 -I -B research/claude-amm-union13-20261028/verify.py
python3 -I -B research/claude-amm-union13-20261028/negative/verify.py --signatures   # needs solders
python3 -I -B research/claude-amm-union13-20261028/test_verify.py
```

`verify.py` uses only the standard library. It checks:

- exact packet membership and hashes, rejecting symlinks and special files first;
- the source archive against the staged build inputs, and `source.patch` rebuilt from the parent archive;
- both build pairs;
- the source-only, layout and parent measurements, recomputed against `evidence/original/pump_amm/deployed.so`;
- the layout layer against the parent packet's layout layer (no raw loss), and its raw differences from the source-only
  image against the recorded lists;
- the regenerated `ordered.ld`;
- both reported runtime summaries against the repository harness hashes;
- the five-pair error-order record for each image.

## Limits

Still open:

- whole-ELF identity;
- 1 unmatched window: `0x4c750`. The dropped `fb3-A-sellcb-w8-01` form shows that a fix for it must not add the
  `drop_in_place` function.

Normalized equality masks address and call operands, so it is not raw identity. The positioning devices and the
generated layout reproduce original line numbers and addresses. They are not claims about the original file layout or
build process. The runtime evidence is synthetic local execution, not a whole-program equivalence proof.
