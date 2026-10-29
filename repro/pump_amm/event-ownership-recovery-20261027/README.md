# PumpSwap event ownership and sweep Context recovery

Candidate `4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12` matches **653/785 normalized original windows
(83.2%)**, including **148 raw-equal bodies**, and **818,944/1,162,040 text bytes
(70.5%)**. It adds both sweep dispatch wrappers with no normalized or raw losses.
**132 windows remain; whole ELF identity is false.** These are bounded binary
recovery measurements, not an engineering-completion percentage.

All **38 instruction wrappers in the captured upstream IDL** now have complete
normalized body and relocation-pattern matches. Seven generated IDL-management
wrappers and fallback paths are a separate scope. Matching a dispatch wrapper
does not establish identity of its business handler, callees or referenced data.

The sweep handler moves to its evidenced instructions/sweep_fees.rs module with
a narrow public boundary. Both wrappers preserve the original40-byte Context,
passing selectors0/1 into the same shared handler. The handler body remains
unequal; the runtime-bool design itself is supported by the original.

Eight event emission sites now reuse the same event object for both Event::data
calls, as observed in the captured program. Unsupported event clones are removed
from V2, CreatePool, InitBoost, AdminCtoPool, ExtendAccount, legacy Sell, boost
and sweep paths. The V2 preparation call follows normal compiler inlining.
The quote selector borrows the pool mint instead of copying it to a stack local;
its13 actual callees and three mint literals remain verified. Complete selector
and business-handler body equality remain open.

Two strict offline builds agree. The recipe binds **51 canonical inputs**,
**52 workspace inputs**, **175 registry inputs**, **227 total**, across nine
authenticated dependency roots. **762 cached dependency artifacts remain
unchanged**. Complete historical source/toolchain provenance is unresolved.

All **17,462 core cases**, **35,074 executions** and **35,418 signature fields**
pass. Current focused/retained checks cover 1,616 legacy cases, 572 optional-bool
cases, 264 optional-u64 cases, 19 native-quote cases, 65 V2 cases, 254 sweep cases
and 21 event-site cases. They total 2,811 overlapping supplemental cases in the
worker packet. Root supplemental suites, ATA/resize/entrypoint/state controls
and24 optional-u64/cashback cases are separately verified. Counts overlap;
individual packets define their original/state/log/signature comparison scope.

The prior123 optional-u64 differences remain fixed. Remaining requirements include
all unmatched code, deeper call/data/relocation identity, full provenance,
exhaustive behavior and authentic fixed-admin create_config success. See the
[remaining-window partition](remaining-work.json) and the [review of every remaining window](remaining-audit/README.md).

```sh
python -B repro/pump_amm/event-ownership-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Result manifest:
`3f831ded38f23229ecec64c20f5d47d2f2622d5bf89b163fac0d74b3cbe5f76a`.
