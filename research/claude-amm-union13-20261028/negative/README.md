# Incentive error-order controls for both union-781 images

These are the five synthetic stored-schedule controls of the PR434/PR464/PR494/PR500/PR525/PR548/PR558 packets (`producer.py` and `fixture.py` are
byte-identical to `research/claude-amm-union12-20261028/negative/`), re-run against this packet's source-only image
`a775c319…` and its separately linked layout image `6c9ae721…` with `PUMP_AMM_FRESH_VM=1` (a fresh VM per execution).

They guard the H11 incentive error-order fix carried since union-764. In this packet `state/volume_accumulator.rs` is
unchanged from union-780 (the fb3 delivery edits only `swap/buy.rs`), so it keeps the fz-A-vol-r3-01 guard form: `update_token_supply` returns through `set_token_supply_before_start` when
`current_timestamp < self.start_time`, and only after that returns `err!(PumpAmmError::SupplyUpdateForFinishedRange)` when
`current_timestamp > self.end_time`. It errors exactly when now >= start_time and now > end_time, as the earlier forms
did (union-764: `if now >= start_time { require!(now <= end_time) }`; union-774 to union-778:
`require!(now < start_time || now <= end_time, ..)`). `verify.py` checks this witness in its new form:
the before-start return comes first inside `update_token_supply`. **All five pairs agree for both images (0 mismatches,
10 pairs, 20 executions).**

This is ten pairs, not a full-corpus qualification. Synthetic AMM-owned state, locally owned admin, Clock set by the fixture;
no live state, no transaction submission. `verify.py` checks the saved receipts, image hashes, input hashes, paired
pre/post states and signed bytes; `verify.py --signatures` also checks the Ed25519 signatures and instruction arguments
(needs `solders`).
