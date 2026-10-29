# Fees, Mayhem and Donation Relay completion audit

This packet keeps current-source integration separate from exact historical
research builds. `INITIAL-AUDIT.json` records the state before the Fees promotion
and remains unchanged. All three exact research ELFs were freshly compared with
their meaningful captured originals during this audit.

| Program | Current integration | Fresh work in this packet |
| --- | --- | --- |
| Fees | 69 canonical files installed; 65 explicitly staged compiler inputs; exact 873,256-byte meaningful ELF | Authenticated Linux build of both local crates; two maintained-source builds, current-source verifier and three mutation controls |
| Mayhem | Canonical source remains unchanged; exact source proposal has 67 compiler inputs | Staging, all 215 vendor-package preparations and five controls pass; new Windows build workflow awaits execution |
| Donation Relay | Existing 60 canonical inputs retained; exact 818,280-byte meaningful ELF and full 830,448-byte loader payload checked | Narrow portable scanner-transition bridge and four mutation controls; no new compiler or loader execution |

## Fees

`programs/pump-fees/build_exact.py` is the maintained exact builder. It stages
the current canonical Rust, local math and vendor bytes into the recorded Linux
layout. Both local crates are explicitly cleaned before compilation. The exact
candidate and symbols files in `fees-built/canonical-01/` were generated after
installation from the canonical source. Literal `.so` files equal their gzip
aliases. `fees-selection.json` binds all 69 canonical files, the source mapping,
controller, logs and output hashes. Its SHA-256 is
`a127a7a4e1771c2497e9340ce666dd0d48dce24686c2c401a5edf44d962200c4`.

The root Cargo manifest and lock proposals are under `fees-proposal/`, with
explicit patches in this packet. Ordinary `cargo metadata --offline --locked`
resolved the canonical local macro and the two workspace members. Root Cargo
files, selected status, global dispatchers and CI are integration-owner changes.

The first clean dependency build failed from disk exhaustion and produced no
ELF. Its failure log and launch record are preserved under `fees-failed-clean-01/`.
After space recovery, the authenticated partial dependency target was reused;
the retry compiled both local crates and produced the exact outputs. The later
canonical build again cleaned and rebuilt both local crates, with source,
registry, macro and SDK library hashes rechecked. This is fresh local compilation
with authenticated dependency reuse, not a claim that every dependency was
compiled during the canonical invocation. Saved broad runtime evidence remains
historical; the integration owner is performing a separate fresh runtime run.

```sh
python3 -O -B research/all-contract-completion-20261028/verify_current_fees.py --repo .
python3 -O -B research/all-contract-completion-20261028/test_current_fees.py
```

## Donation Relay

`relay/verify_current_bridge.py` is the durable current entry point. The sealed
Relay transition remains unchanged. Its source scanner pin predates exactly one
portable path serialization change: `str(relative_path)` became
`relative_path.as_posix()`. The bridge accepts only the reviewed old/new helper
hashes and literal diff, recomputes both the old 23-file and new 60-file source
maps with both helpers, and passes the original gate one adjusted in-memory
helper binding. All other sealed transition and loader/ELF bindings stay active.

The bridge uses normal Python because the historical gate requires assertions.
The four tests reuse the existing sealed fixture without modifying it and reject
a broader resealed scanner change, an extra canonical Rust file and changed
canonical Rust bytes.

```sh
python3 -B research/all-contract-completion-20261028/relay/verify_current_bridge.py --repo .
python3 -B research/all-contract-completion-20261028/relay/test_current_bridge.py
```

## Mayhem

[MAYHEM-WINDOWS.md](MAYHEM-WINDOWS.md) describes the exact hosted build handoff and
the missing qualification. Existing Windows research receipts are preserved;
they do not stand in for a new build of the proposed maintained source.
`programs/mayhem` has not been edited. The new workflow must produce actual
fresh host-and-target receipts before canonical promotion can be qualified.

No evidence in this packet attributes reconstructed source spelling or recipes
to the original private source. Exact meaningful ELF identity, zero allocation
tails, source promotion, compiler execution and runtime execution are separate
recorded claims.
