# Pump L41 whitelist sync and multi-hop parity

This packet composes two previously recovered Pump Main behaviors into the
immutable L41 source candidate from PR #571. It does not claim either behavior
as a new discovery:

- PR #560, authored by `shawkkkkk`, established the original V2 whitelist
  reserve reload/synchronization behavior in `buy_v2.rs` and `sell_v2.rs`.
- PR #566, authored by `shawkkkkk`, established the original multi-hop
  crossing guard and its `NotEnoughTokensToBuy` (6021) precedence.
- PR #571, authored by `lalalune`, supplied the L41 parent used here.

The contribution is an additive research composition. It does not change
`programs/pump`, any historical packet, or the deployed ELF.

## Immutable inputs

| Input | SHA-256 |
|---|---|
| Deployed Pump Main | `7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d` |
| L41 stripped source build | `5e8314645d25c405291157c211de8b33148eb24ae8b26a995f1599a37af7f797` |
| L41 unstripped source build | `4e140892d0afd6fe3581d1543df776f6d4218d63db7f616c7ec3955f975f9389` |
| L41 merge | `d8e0bb3a4df3bbfb0701cbb4ce0dc65573ae5f44` |

The untouched local control reproduced both published L41 hashes exactly.
The build used the authenticated native v1.44 host tools with the recorded
Linux v1.44 SBPF target-library profile. The compiler, Cargo, objcopy, target
libraries, source wrapper, full source inventory, and build commands are bound
in `builds/`.

## Source composition

`source.patch.gz` contains the exact source patch and changes only:

- `src/buy_v2.rs`
- `src/sell_v2.rs`
- `src/multi_hop_curve_swap.rs`

The L41 V2 files were byte-identical to the L38 parent files used by #560, so
the qualified V2 source correction could be ported without conflict. The L41
multi-hop file was newer than L38; only the live crossing guard was inserted
into its current control flow. The complete L38 file was not copied over L41.

The V2 correction reloads the affected token accounts after the whitelisted
transfer path and synchronizes virtual quote reserves from actual balances.
The multi-hop correction rejects an ineligible whitelisted crossing buy before
post-completion estimation while retaining the existing Mayhem restriction.

Blank-line movement preserves the established physical Source location. It is
disclosed layout work, not a claim that the reconstructed text is historical
source.

## Stage matrix

| Stage | Stripped SHA-256 | Unstripped SHA-256 | Normalized | Raw |
|---|---|---|---:|---:|
| A: untouched L41 | `5e8314645d25c405291157c211de8b33148eb24ae8b26a995f1599a37af7f797` | `4e140892d0afd6fe3581d1543df776f6d4218d63db7f616c7ec3955f975f9389` | 1,019 | 168 |
| B: V2 only | `a5c51dac1c7421882974f9d349df5d043d337a28fea0d0b270107475313fda18` | `f6a4fc0bfc4d7ee2477b28762f2e62b0c951118a880e625528d96efc41902464` | 1,019 | 188 |
| C: combined | `47b5968f571e3d983ead2ff7545adcebb0e79b395566483c54a6f7594cb7c2e4` | `f61b4a398509cb2f21f5435e263488c2fda7e793fe38e87ad8b6746f2c4c0741` | 1,019 | 188 |

Two isolated Stage C builds produced byte-identical stripped and unstripped
ELFs. All 1,019 prior normalized memberships and all 168 prior raw memberships
survive. The 20 raw gains are linked-layout effects; no new function-window
recovery is claimed. The affected large handlers remain unmatched and
whole-ELF equality is false.

No new SBF stack-offset warning was emitted. The ordinary compiler warnings
are retained in each compressed build log.

## Fresh signed runtime qualification

The focused V2 replay executed 18 original/control/candidate triples (54
verified outer signatures). The untouched L41 control diverged in six active
whitelist/Mayhem cases across state, event bytes, and inner instructions. The
combined candidate matched the deployed program in all 18 cases. The same
candidate also passed the published 216-case buy/exact-quote corpus and
206-case sell corpus.

The focused crossing replay executed eight original/control/candidate triples
through the captured AMM's genuine CPI into Pump (24 verified transactions).
The untouched L41 control diverged in the two whitelisted crossing cases: it
succeeded where the original returned 6021. The combined candidate matched the
original error, rollback, event, CPI, state, return-data, and log outcomes in
all eight cases.

The final captured-upgradeable-loader run freshly executed all 44 suites and
10,468 paired cases against the exact combined ELF:

| Measurement | Result |
|---|---:|
| Suites | 44 |
| Paired cases | 10,468 |
| Log-bearing cases | 10,464 |
| Structured mismatches | 0 |
| Ordered diagnostic-log mismatches | 0 |

`runtime/full.json.gz` retains the complete suite results. The 44 exact loader
receipts are retained in `runtime/loader-receipts.tar.gz` and are individually
hash-bound by the full report.

## Failed controls

Two full-run attempts were deliberately not accepted. The first stopped after
42 clean suites because the sparse checkout omitted the immutable Tokenkeg
fixture. The second stopped at the same point because the runner was given the
equivalent pre-staging crate path while the Tokenkeg binding requires the exact
staged workspace path recorded by the build receipt. No comparator, source, or
fixture was weakened. The final run used the exact receipt-bound path and
completed all 44 suites.

The verifier also has 19 isolated mutation controls covering program hashes,
repeat-build consistency, source hunks, window membership, signed transaction
identity, account state, CPI order, event bytes, reserve values, errors,
rollback, ordered logs, loader receipts, compiler inputs, unexpected files,
symlinks, and optimized-Python execution.

## Verify

From a fresh checkout:

```sh
python3 -I -B research/pump-l41-v2-whitelist-multihop-parity-20261028/verify.py
python3 -I -B research/pump-l41-v2-whitelist-multihop-parity-20261028/test_negative_controls.py
```

See `REPRODUCE.md` for source materialization, build, census, and runtime
commands.

## Limits

- This is bounded offline evidence, not deployment or live-chain validation.
- The whitelist fixtures establish executable behavior, not production
  whitelist reachability.
- The corpus cannot prove behavior for every possible account state.
- Whole-ELF identity and historical source identity are not established.
- The 20 raw gains are not promoted to recovered-function claims.
