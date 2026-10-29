# PumpSwap native fees, CPI and account recovery

Candidate `a4b978ee1ab15dd822a31bc42e85d55e409f4e777f7af671a3197ea175891101`
matches **599/785 normalized original windows (76.3%)**, including **125
raw-equal bodies**. It adds 13 normalized windows without losing any from the
preceding 586-window checkpoint. Matched original text is **663,840/1,162,040
bytes (57.1%)**. **186 windows and complete ELF identity remain unresolved.**

The [remaining-work partition](remaining-work.json) assigns every unmatched
window once: 30 math/dependency, 74 liquidity/admin/state, 46 swap/event/context
and 36 parser/binary windows. Three parallel workers and the coordinating agent
also cover the remaining data, call and build-provenance obligations.

## Behavior recovered

The native transfer-fee decoder now also serves Boost, legacy trades and
multihop trades. This fixes disagreements on long, unknown and malformed
Token-2022 extensions and preserves the original fee/error order. The expanded
214-case corpus has zero differences, versus 91 in the preceding candidate.

Buyback setters restore the original validation order and diagnostics,
including forward duplicate-recipient comparisons. All 24 focused cases now
match; the preceding candidate differed in 12.

Multihop sells enforce the original real-reserve limit before spending quote
tokens. The preceding candidate differed in 12/16 broad scenarios and 4/12
one-unit threshold cases; all 28 now match. Eight broad scenarios previously
succeeded while spending tokens reserved for accrued fees.

## Source and binary structure

Recovered Rust boundaries include the shared 376-byte fee-accrual helper,
224-byte reserve helper, 2,264-byte admin resize helper, 2,768-byte creator-fee
configuration handler and 168-byte legacy quote-preview closure. The latter
restores original structure; no behavioral discrepancy was demonstrated in
its 319 focused cases.

Generated Anchor account types replace manual replicas for FeeConfig,
SharingConfig and BondingCurve. Their declaration locations follow source
coordinates retained by the original binary. The Pump IDL is a reconstructed
fragment: it retains the captured nine-field BondingCurve layout and the
directly used multihop CPI interface. It is not asserted to be the historical
full IDL. Generated CPI account/data builders retain strict two-u64 return
decoding. Account-parser coverage includes 182 signed boundary cases.

The explicit workspace recipe binds **45 canonical inputs**, **46 materialized
workspace inputs** and **169 authenticated registry inputs**, for **215 total**.
Two strict offline Linux v1.44 builds agree and preserve all 732 dependency
artifacts. The separate repository Fees workspace is unchanged.

## Verification and limits

Fresh execution passes all **17,462 corpus cases**, with **35,074 executions**,
**35,418 verified signature fields** and **17,537 identical signed-message
pairs**. Retained supplemental suites were rerun, including 934 decoder/TLV
cases, 91 CPI probes and the new fee, cap, buyback, account and legacy-preview
cases. Counts overlap and must not be summed as unique coverage.

The verifier checks the sealed inventory, source/workspace transformation,
dependency archives, repeat builds, complete function census and saved signed
results. Diagnostic comparisons exclude source coordinates and consumed
compute where documented. These are local synthetic fixtures using captured
programs; current-chain acceptance and exhaustive behavior are not established.
Historical complete source, compiler provenance, remaining code/data/call
identity and authenticated fixed-admin `create_config` success remain open.

```sh
python -B repro/pump_amm/native-fee-cpi-recovery-20261027/verify_saved.py
```

Add `--current-source` to bind the maintained AMM. The result manifest is
`636dd30710af283405175d6d0662cdb44cbbe3ca5b3c81426f685f5641778cdd`.
