# PumpSwap event, decoder and creator-rent recovery

Candidate `0881a95dafe465623c7220fb3da84b3f9c7d9b0094d572f62487f05cbd80a07c` matches **647/785 normalized original windows
(82.4%)**, including **148 raw-equal bodies**, and **810,544/1,162,040 text bytes
(69.8%)**. It adds four normalized matches with no losses from the previous
native-quote checkpoint. **138 windows remain; whole ELF identity is false.**
These measure bounded binary recovery, not the percentage of engineering work finished.

The sell-event helper captures three public keys before its clock/arithmetic
work, matching the original 1,784-byte body and all three actual helper targets.
The optional-bool decoder binds the invalid byte in its error arm. Its 344-byte
body and both 1,856-byte legacy dispatch wrappers now match. The wrappers still
call unmatched business handlers; a matching wrapper does not close those handlers.

Creator-fee transfer computes destination rent deficit before fixed-account rent,
reads Rent at the two observed boundaries, and retains an explicit Overflow
error origin. This closes ten log differences in a 108-case synthetic high-rent
matrix. The error code and rollback already agreed; the fixture is not evidence
that these extreme rent values occur on the deployed network.

Two strict offline builds agree with **227 recorded source inputs**: 51 canonical,
52 materialized workspace and 175 registry inputs. Nine authenticated dependency
roots are bound, and **762 cached dependency artifacts remain unchanged**.
The earlier invalid first decoder strict attempt is retained in its separate
packet; it created 30 cache entries, then two properly invalidated strict
builds agreed. Historical complete source/toolchain provenance remains unresolved.

All **17,462 corpus cases**, **35,074 executions**, **35,418 signature fields**
and **17,537 identical signed-message pairs** pass. The retained supplemental
suites are rerun on this exact candidate. Additional controls cover 572 optional
byte/truncation cases, 375 creator-rent/transfer cases, 60 ATA cases, 160 resize
cases, 137 entrypoint/event/order/curve cases, and 71 InitBoost/claim/reserved/boost
cases. Counts overlap and are not a unique combined total. Individual packets
state their log normalization, fixture dependencies and comparison boundaries.

Full code, calls, data, relocations, original provenance, exhaustive runtime
behavior and authentic fixed-admin create_config success remain open. The
[remaining partition](remaining-work.json) records the current unmatched windows.

```sh
python -B repro/pump_amm/event-decoder-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Result manifest:
`812cd2b5d751d965789a41f620b9e0eef8491c66454344a536d594fb37460a91`.

## Known optional-u64 follow-up

A subsequent [264-case signed probe](followup/optional-u64/README.md) identifies
123 differences in this selected artifact: short optional-u64 tails are consumed
and zero-padded, while the original defaults the integer to zero without consuming
those short bytes. Ninety-one cases have different errors; 32 original successes
are rejected here, with differing final snapshots. This known decoder gap remains
open and is separate from the passing retained suites above. The next source
correction is under test; this sealed checkpoint has not incorporated it.
