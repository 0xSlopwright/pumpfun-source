# PumpSwap admin and withheld-fee harvest recovery

Candidate `58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b` matches **656/785 normalized original windows
(83.6%)**, including **148 raw-equal bodies**, and **826,112/1,162,040 text bytes
(71.1%)**. **129 windows remain (16.4%)**, comprising **335,928 text bytes
(28.9%)**. Whole ELF identity is false. These percentages measure binary
coverage; they are not estimates of engineering effort remaining.

The three new complete normalized matches are Disable (3,024 bytes), the local
withheld-fee harvest helper (1,480 bytes), and the existing AnchorSPL harvest
provider (2,664 bytes). Their recovered call structure is independently checked.
No normalized or raw matches are lost. All 38 captured upstream-IDL instruction
wrappers remain matched; generated IDL-management wrappers and fallback paths
are a separate scope.

Disable performs the original five ordered flag-field writes and reuses one
event object for both emissions. The Token-2022 path uses the authenticated
AnchorSPL harvest API through a naturally compiled local helper. The writable
mint requirement remains in place. InitBoost restores temporary AccountInfo and
signer-seed lifetimes. CreatePool initializes the pool before checked subtraction
of its 100-unit minimum liquidity. The latter two complete business bodies still
differ from the original; their source and call-order improvements are bounded.

Two strict offline builds agree. The recipe binds **51 canonical inputs**,
**52 workspace inputs**, **175 registry inputs**, **227 total**, across nine
authenticated dependency roots. **762 cached dependency artifacts remain
unchanged**. Complete historical source/toolchain provenance is unresolved.

All **17,462 core cases**, **35,074 executions** and **35,418 signature fields**
pass. The worker additionally rechecks 2,811 retained edge cases, 181 InitBoost,
Disable and CreatePool cases, 506 boost-burn cases, and 24 optional-u64/cashback
cases. This is 20,984 case executions, 42,118 transactions and 42,512 checked
signature fields including deliberate repeats. Broad retained acceptance and
ATA/resize/entrypoint/state controls also pass. These overlapping counts must
not be summed as unique scenarios. Every packet retains exact candidate,
source, state, log and signature bindings.

An initial repeat-build launcher failed before compilation because its PATH
omitted Podman. The corrected strict repeat succeeds; the failed setup receipt
is preserved and is not counted as a build or runtime result.

The independent bounded static audit closes 592 windows, or 585 when source
coordinates are included. This does not certify full data or indirect-call identity.

Remaining requirements include unmatched code, complete call/data/relocation
identity, original provenance, exhaustive behavior and authentic fixed-admin
create_config success. See the [remaining-window partition](remaining-work.json)
and [independent review of the remaining work](remaining-audit/README.md).

```sh
python -B repro/pump_amm/admin-harvest-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Result manifest:
`a2f00d29efcb59a6dd3bcf27005d3311c93a1400fb5fe0fc769509ec01a88aa0`.

The [unselected follow-up controls](followup/README.md) retain negative results for the flags iterator and InitBoost alias spelling. Neither increases the recovery count.
