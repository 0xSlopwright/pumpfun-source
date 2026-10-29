# Generated Pump return helper through the original CPI branches

This is a private, unselected trial on frozen e97 (`e97b3900800d4378486d9b1f7df040e6b7a57d34b31a9470a5f5eb3a9d2fb24b`). Candidate `6975715089a6dee2125e3157a4c579176aa893a386ffa748ed478f886d59f53b` retains **638/785 normalized windows and 128 raw windows**, with no gains or losses against that base. The whole ELF remains unequal.

Original grouped-curve helper `0x45940/16912` dispatches a source descriptor: tag 0 selects the user; tag 1 selects a preceding pool. Its branch at `0x47938` distinguishes a retained pool pointer from zero. The two paths call the same generated Pump CPI at `0x482f8` and `0x48e08`, with respectively one and two signer-seed groups. Each calls return helper `0xd84b0/344` before merging, at `0x48330` and `0x48e40`. `verify_original.py` checks these instructions and destinations directly. The original Rust enum name and complete type are not recovered.

The patch prepares CPI program/accounts/remaining accounts once, then uses borrowed one- or two-element signer-seed slices in two normal branches, each followed by the generated return object's `.get()`. It removes the handwritten generic decoder. The existing IDL is unchanged: `CurveRunResult { amount_out: u64, buyback_fee: u64 }`. The local Anchor generator already supplies strict `get_return_data().unwrap()` and `try_from_slice(...).unwrap()` behavior.

This causes ordinary optimization to retain a generated `pump::cpi::Return<T>::get` body of exactly 344 bytes, with two callers. All normalized instructions and the relocation pattern equal original `0xd84b0`. Both real source descriptors now match original `programs/pump-amm/src/lib.rs:22:1`. No outlining attribute, source-coordinate substitution, raw patch, padding, or unused duplicate helper was introduced. Raw body bytes differ because addresses differ; the enclosing MultiHop handler structure remains incompletely recovered.

The earlier single-shared-CPI direct-getter trial is preserved separately at `../amm-generated-return-origin-20261027` (manifest `dbfec474fc8eae08fb2b940bb9c18fc832940a1630e5f85f44fb8d18910ab268`). That trial lost the helper window through inlining and remains rejected. This trial follows the additional original branch evidence instead.

Validation passed **155 cases, 310 signed transactions**, with no observable differences. The 91 return-data/balance/source cases explicitly substitute a synthetic CPI oracle; the 64 route cases load captured Pump. All 24 malformed curve-return logs match after removing only compute-unit lines, without source-coordinate normalization. Other comparisons include errors, account data, inner instructions, return data, events, and source/compute-normalized logs. Captured cases include 16 complete successes and exercise both signer branches. These are offline signed tests, not live-chain reachability or full-program equivalence proof.

Build `build/build-comparison.json` binds source before/after, strict dependency cache inventory, compiler, SDK and artifact hashes. The inherited admin call-frame diagnostics occur three times in both the e97 and trial build logs. No repeated build was needed. Focused replay did not exercise every admin handler; root integration acceptance remains separate.

Run saved checks from the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-curve-cpi-branches-20261027/verify.py --root .
```

For an integrated candidate, the focused runner accepts a fresh output directory:

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-curve-cpi-branches-20261027/run.py \
  --root . --candidate /absolute/path/pump_amm_recovered.so \
  --candidate-build-record /absolute/path/build-comparison.json \
  --output /absolute/path/new-focused-output
```

`run.py` checks the recorded harness/oracle input hashes first. Its generalized orchestration has been syntax/CLI checked; this packet's actual replay used the recorded `run_focused.py` commands. `verify_getter.py` also accepts `--candidate` and `--symbols` for direct static verification of a new artifact. `recovery.patch` changes only `programs/pump-amm/src/multi_hop.rs`; apply it before the independent logical-module relocation, or rebase its path afterward.
