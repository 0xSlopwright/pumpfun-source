# Read-only competition rules presentation

## Gap and scope

The existing `/leaderboard?category=competitions&competition=…` detail showed a
description/prize summary but no rules opener. Its developer-response adapter
validated and then discarded prize tiers and minimum/maximum squad sizes. This
unit preserves those supplied fields and mounts the captured read-only rules
presentation in that existing detail. It does not add another competition API,
calculate PnL, rank entrants, register anyone, accept terms, verify eligibility,
claim prizes, or enable login/wallet operations.

The original page's selected-competition hero passes an `onOpenRules` callback
through `e$` to `eL` in factory **590407**. The callback sets local `F` state; `tn`
mounts a labelled dialog, `tl` supplies sections, `ts` supplies ordered rules,
`tr` omits incomplete date ranges, and `ta` formats supplied prize tiers. This
is evidence of an actual reachable presentation, not an isolated label or an
invented roster drawer. The local page layout remains the existing developer-API
leaderboard, not a claim of original framework or pixel parity.

## Immutable source bindings

Checkpoint: `2026-10-28T10:48:45.546100+00:00`. Base source reviewed at main
`03bcf6a0b8162919a72b884869850abf342aa9d3`; its app tree is
`667ee19b0ac2ef091995950c1f88a8fda94ea045`, unchanged from `33826889`.
Ranges below are **UTF-16 code units** in decoded source. Captures were parsed
as inert text/JSON, never executed or imported as application code.

| Factory | Retained object | Whole object SHA-256 | Range / factory SHA-256 |
|---|---|---|---|
| 590407 | `2fe17dced92b840b.js` (117439 bytes) | `287cecc2183a9c0bbed6f7a7e77edca9fbbae4d4a9615d786fac4cc613e4ede5` | `[119,117418)` / `3f494070c58a6d7f0f70279887ef648107935b765fe849de3e9ec100cec45dda` |
| 36489 | `4da7a3f4580c8707.js` (77335 bytes) | `d3ac051dc8989b6c57dc72c1899117ccf12cfa274a91cb707ea2c53099de37f8` | `[53319,53628)` / `74dab3f8ec1cc9a308907b35744d1dd5da64e505faceb68dc65174634fa56126` |
| 706615 | `c3601a995a6b7f37.js` (45232 bytes) | `5a81dfd01983381981d1f5da23564f6426bf9ff3ff55a1265d8badf02290d231` | `[30963,31942)` / `e606b2e7f5ab2bfd5da0abb70db2de0560f01d4d131d156719d8623614219e74` |

Objects live under `app/evidence/web/objects/`. Original chunk URLs are,
respectively, `https://pump.fun/_next/static/immutable/chunks/3h-drub813nrm.js`,
`https://pump.fun/_next/static/immutable/chunks/2p2k-eoe7rs1_.js`, and
`https://pump.fun/_next/static/immutable/chunks/2vz-n_tbfq5w6.js`.
`recovered/modules.json` binds the imports: `E=36489`, `$=706615` in 590407.

The `/leaderboard` HTML object `d8e580782f84e190` has 365706 bytes and SHA-256
`1108d23f5f07255ac5e380359b4acc96aabd3b36fb4b6409d1d686bc468050d6`.
Its Flight **103**, `resources.web.leaderboard.cup`, supplies the 31 rule/prize
labels; Flight **c1**, `resources.common.close`, supplies Close. The extractor
authenticates manifest identity, timestamp, bytes and hash before JSON parsing.
Importantly, `kolscan.top_charts.cup.rules` in the same record has different
scoring/registration wording and is **not** used. No new capture is published.

36489 declares `/docs/app-competition-terms`, date fields (short month, day, hour,
two-digit minute), and locale-number formatting. 706615 declares plain unsigned
numeric prize-text currency formatting, supplied tier order and **maximum
rankTo**, not sum of tier lengths, as the paid-ranks count. The implementation
retains these presentation decisions, including description/prize-copy trimming,
group-only size/pro-rata rules, dated/undated variants, and no prize section when
the supplied tier array is empty. It does not infer prize entitlement from rank.

## Explicit local choices and boundaries

- English only, using the exact captured web copy. Times are explicitly labelled
  **UTC**, a local deterministic display policy; the captured helper does not fix
  a timezone. No claim of recovering its downstream locale/postprocessing stack.
- The terms link expands the captured path against its original `pump.fun`
  origin, opens only on user activation, and uses `noopener noreferrer`. It is
  not prefetched or fetched by the model/dialog. This does not reproduce legal
  documents, represent current legal terms, or accept anything on a user's behalf.
- The visible boundary calls this a read-only reconstruction. Captured scoring,
  KYC and registration statements are original presentation copy, **not** proof
  of current rules or any enforcement by this application/backend.
- The existing adapter's GET-only transport, configured server-side developer
  key boundary, size limits, unavailable default, list/detail request paths and
  ranked-row order are unchanged. This is not a native backend implementation.
  New output fields are cloned from already-validated input and bounded again
  at the browser-response boundary (100 tiers, finite nonnegative ranks/member
  sizes, 200-character tier amount). No credential is read by this component.
- A native `<dialog>` portals outside shell inert containers, opens only after
  mount, and refuses to stack over another open native dialog. It uses native
  modal focus/cancel behavior, stops Escape propagation without preventing the
  default cancel, restores a connected launcher on close, and closes on unmount.
  There is no global keyboard listener, body overflow write or shell mutation.
  The launcher is keyed by competition ID so another selected competition does
  not inherit an open rules dialog. These are local lifecycle choices.

## Validation and limits

From `app/` on Node 24:

```sh
node --test tests/competition-rules.test.mjs tests/leaderboard-contract.test.mjs
python3 scripts/extract-competition-rules-copy.py --check
python3 -m unittest discover -s tests -p test_competition_rules_copy.py
cd packages/frontend
node ../../node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/@playwright/test/cli.js test tests/competition-rules.spec.ts tests/leaderboard.spec.ts --list
```

Observed: **12 pure/adapter tests**, **4 locale tests**, exact extraction of
**32 labels**, and full frontend JSX typecheck pass. The same focused projection
assertion against unchanged source fails because `prizes` is absent; it passes
with the preserved projection. This demonstrates the missing display data, not
that discarding fields was previously an API-contract violation.

The two new synthetic browser cases cover 390/1280 widths, open/close/Escape,
focus cycling/restoration, section content, no input forms, no extra adapter
reads and rejected unexpected origins/methods. **They are collected, not run.**
Current browser sandbox/loopback access remains blocked; the sleeping Mac was
not used. No desktop/mobile screenshot, native dialog lifecycle, scroll behavior,
cross-modal interaction or visual parity qualification is claimed. Full Next
build was not retried because the known external advisory-fetch guard is blocked;
no guard was bypassed. Aggregate app/evidence/progress gates are not claimed and
no completion/compatibility milestone is increased.
