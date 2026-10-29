# PumpSwap structural and transfer-fee recovery

This checkpoint fixes a transfer-fee decoding discrepancy and reconstructs
separate liquidity modules, Pool method interfaces, and event evaluation order.
Its selected candidate is
`5c1e8b18ead27d0b3c1840f37b24ef5044adb65e2a3a566d5be7694ff8737c05`.

It retains **586/785 normalized original windows (74.6%)**, with no normalized
windows lost. **124 bodies are raw-equal**: the recovered `Pool::can_boost`
method now matches all 224 original bytes, including its direct-call operand.
Matched original text remains **644,456/1,162,040 bytes**. There are still
**199 unmatched windows**, and complete ELF identity remains false.

## Restored behavior

The original transfer-fee path uses a bounded TLV scanner. The earlier
reconstruction used SPL's generic unpacker, which treated several extension
layouts differently. The recovered scanner preserves the original envelope,
record-length, duplicate-extension, unknown-extension and terminator handling,
then selects the applicable native fee record by epoch.

Two independent signed corpora retain the discrepancy and its correction:

| Corpus | Cases | Published 5cd baseline differences | This candidate |
| --- | ---: | ---: | ---: |
| Focused decoder cases | 58 | 20 | 0 |
| Independent TLV corpus | 876 | 430 | 0 |

The second corpus includes 80 log-only differences and 350 involving other
result fields; those categories are not added to the first corpus. Cases
include synthetic malformed layouts and are not a claim of live-chain
acceptance or exhaustive Token-2022 equivalence. Both packets verify signed
messages, full recorded logs and all non-executable transaction-account states.
The original results and input states agree across baseline and fixed runs.

## Source and build structure

- Deposit and withdrawal now have separate source modules, matching the paths
  in the original program. Their recovered arithmetic, fee and error ordering
  are preserved. Withdrawal narrows the virtual-reserve adjustment to `u64`
  before widening the validated result.
- Ceiling and floor helpers are restored to their observed curve modules.
- The Pool boost predicate uses its recovered receiver method. Buy and sell
  event builders preserve the observed evaluation and output-store order;
  remaining instruction motions and source-line differences remain open.
- A real isolated Cargo workspace restores the observed `programs/pump-amm/`
  source-path prefix. The maintained AMM stays a standalone crate; its manifest
  and lock are materialized by an explicit recipe. The repository's Fees
  workspace is not changed or used as an AMM build input.

`results/canonical-source` holds the **44 maintained inputs**. The recipe
produces the **45 exact local workspace inputs** in `results/source`; Rust,
IDL and retained vendor files are copied byte-for-byte, with profile placement
and lockfile location changed explicitly. The 169 active registry inputs are
verified against eight authentic crate archives. Both strict offline Linux
v1.44 SBPF builds bind all **214 inputs** and preserve **732 dependency artifacts**.
Their stripped and unstripped binaries are identical. Exact historical source,
workspace, dependency and compiler provenance are still unproved.

## Verification

Fresh execution passes the full **17,462-case corpus**: **35,074 executions**,
**35,418 verified signature fields**, and **17,537 identical signed-message
pairs**. All retained supplemental account, fee, CPI, boundary, square-root,
transfer, mint, context, decoder, event and error-order groups were rerun.
Another 1,350 focused cases and 76 Pool/predicate cases pass; these counts overlap
other suites and must not be summed as unique coverage.

The saved verifier rechecks the exact file inventory, workspace transformation,
dependency archives, repeat builds, complete window census, call/literal checks,
and signed evidence. It normalizes only diagnostic source coordinates and
compute-consumption log lines. Older fixtures without full logs retain that
limitation. No runtime transactions are sent to a live chain.

```sh
python -B repro/pump_amm/structural-tlv-recovery-20261027/verify_saved.py
```

Add `--current-source` to check the maintained AMM against the canonical source.
The saved proof works without private build caches. The manifest SHA-256 is
`e2c125883a298ce9219dd83c5dbdf89a1b585e805b193d2acabdb149ef71d269`.

The original 664-byte decoder boundary, native fee-copy ABI, remaining handler
instructions, referenced data/indirect calls, and authenticated fixed-admin
`create_config` success remain unresolved. This is an intermediate recovery.
