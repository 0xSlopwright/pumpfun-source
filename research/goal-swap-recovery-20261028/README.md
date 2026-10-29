# Last PumpSwap window: rejected native source experiments

The current qualified selection remains **784/785 raw-equal windows**; sell
cashback at `0x4c750` (9,024 bytes) is still unmatched. This local screen adds
**zero accepted windows** and changes no maintained contract source or selected
recipe. The canonical 68-file standalone source is retained in
`canonical-source.tar.gz`; both temporary 69-file workspaces were restored and
checked byte for byte after the experiments.

110 candidate source variants were attempted. 107 native root recompiles
succeeded; three were rejected by rustc. Dependencies were reused. This is a
macOS v1.44 `sbpf-solana-solana` screening run, not a fresh Linux build, runtime
replay or promotion qualification. The native baseline has 779 normalized / 240
raw windows, including the previously documented five native sysroot TypeId
mismatches. No candidate closes the final sell window. Some rejected variants
also lose other normalized/raw matches; none is selected.

The base is `e38a8b97a`. The parent rechecked `cbdb770e08328c11a051395457fe4d5313ac530b`
and found no intervening maintained AMM source changes. The existing shared
`~/amm100-run/shared/tools/nbuild.sh` produced the builds. Controllers retain
its absolute path and are local execution records. Saved ELF measurement uses
an unmodified copy of the repository's existing stdlib matcher; normalization
and acceptance rules were not extended. The two explicit nightly-feature
screens enabled `try_trait_v2` / `try_blocks` on the existing first source line;
those features were removed after their runs.

A separate [machine-placement and intrinsic-hint investigation](phase2/README.md)
records four later targeted controls and the exact point where profile metadata
is lost. It also adds no window.

## Source groups rejected

| Controller / results | Variants | Hypothesis |
| --- | ---: | --- |
| `sweep.py`, `results.json` | 7 | Outer bool match, explicit borrow Result branches, map/assign/let-else |
| `sweep2.py`, `results-round2.json` | 6 | Initialization / validation closures and expression result scopes |
| `sweep3.py`, `results-round3.json` | 8 | Length-based outer condition, borrow local/map/identity/ref shapes |
| `trylane/sweep5.py`, `trylane/results-round5.json` | 6 | Explicit `Try::branch` / residual source forms |
| `sweep6.py`, `results-round6.json` | 8 | Owner check plus consuming tail/exit Result matches |
| `sweep7.py`, `results-round7.json` | 8 | ATA length match, boolean inversion and arm order |
| `sweep8.py`, `results-round8.json` | 8 | Owner/writable checks plus tail closure / forget / try block |
| `trylane/sweep9.py`, `trylane/results-round9.json` | 12 | Remaining combinations of four error-guard source forms |
| `sweep10.py`, `results-round10.json` | 10 | Disclosed stable cold/likely helper idioms |
| `trylane/sweep11.py`, `trylane/results-round11.json` | 5 | ATA conditional returning Result before `?` |
| `trylane/sweep12.py`, `trylane/results-round12.json` | 9 | Exit closure, lifetime scopes and private/public helpers |
| `sweep13.py`, `results-round13.json` | 8 | Persistent exit capture and final result/drop compositions |
| `sweep14.py`, `results-round14.json` | 8 | Both account constructors: named Result and explicit consuming matches |
| `trylane/sweep15.py`, `trylane/results-round15.json` | 7 | Initial missing-account match arm ordering |

Each trial retains `sell.rs` and `build-measure.log`; successful trials additionally
retain `symbols.so`, `rows.json` and the raw Cargo log. The producer JSON omitted
its final compile failures because its error branch continued before writing the
summary. `source-screen.json` independently inventories all 110 trial directories
and explicitly records those three failures. Their build-error text remains
unchanged. No saved result is represented as a runtime pass.

## Useful boundaries for the next reasoning phase

1. The native baseline independently repeats the current **77-block structural
   correspondence**: all 1,049 paired non-branch slots, including registers, and
   all 80 actual depth-two call-site identities agree. Only one predicate polarity
   and physical forwarding / block arrangement differ. `baseline-graph.json` keeps
   every compared instruction, edge and target. This is diagnostic evidence,
   not a relaxed matcher.
2. `if user_volume_accumulator.owner != &crate::ID { return err!(...); }` at line
   444 restores the exact original JEQ+JA bytes at relative `0xd00` without any
   non-branch or register difference. That partial is 9,032 bytes.
3. Adding the sibling buy helper's `if ata.is_writable == false { return
   err!(...); }` at line 467 also restores ATA-create / checked-constructor
   placement through relative `0x1cd0`. Its 9,040-byte body still has the same
   77 mapped blocks, 1,049 exact non-branch slots and 80 equal actual call-site
   identities, with zero predicate-polarity differences.
   `owner-atawrite-graph.json` and `graph-partial-sell.rs` retain this stronger
   structural partial. Its common reload/return block appears too early.
4. `best-partial.patch` / `best-partial-sell.rs` add a persistent tiny closure
   around `accumulator.exit`. This makes 1,094 of the original 1,128 normalized
   instruction slots equal **at their original offsets**, but shortens the body
   to 8,976 bytes. Remaining differences concentrate in the late reload/return
   tail. Its complete canonical graph does **not** have the baseline bijection;
   no behavioral equivalence or window gain is claimed. Moving the closure into
   a scope or a forced-inline helper reverts to the 9,040-byte shape.
5. An isolated `no_std` source probe for compiler-generated basic-block sections
   fails with `2-byte relocations not supported` (`bbsections/build.log`). This
   target cannot extend the existing legitimate input-section linker-order
   recipe using that compiler feature. No emitted IR, object or ELF was edited.

`position-results.json` is a local source-search diagnostic only. Its aligned-slot
counts never award matched windows and do not replace the official matcher.
The owner/writable source controls were built by the parallel analysis lane;
their parent artifacts remain under `../goal-swap-analysis-20261028/`.

## Recount saved compiler artifacts

From the repository root:

```sh
python3 -I -B research/goal-swap-recovery-20261028/verify_trials.py
```

It needs only the retained native images, stdlib, and captured original AMM ELF.
It recomputes all 785 official rows for all 107 retained candidates and checks the
producer rows, with an explicit final inventory count. `recount.json` is its saved
output. `source-screen.json` records source hashes and the canonical archive hash.
The full local targets remain disposable and are not proof inputs. Future work
should reason about the remaining common epilogue creation/survivor order before
starting another broad source sweep.
