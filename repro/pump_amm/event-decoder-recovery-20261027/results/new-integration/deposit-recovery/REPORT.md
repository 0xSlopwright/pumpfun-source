# Deposit arithmetic and transfer-fee order recovery

`recovery.patch` changes only the liquidity function in `programs/pump-amm/src/lib.rs`. Apply it after the existing withdraw burn patch. The private base is the published `8e69bb1b...` source plus `work/amm-withdraw-transfer-recovery-20261027/recovery.patch`; the before/after hashes are in `patch-manifest.json`. No maintained source was edited.

The strict private SBPF build is `eb1e11198eb9c89ab71f61ff81be03d49bb4539406a727eeca50160bfae088ea`. Its complete build/source/dependency provenance and unstripped output are under `build/`. The target cache was cloned with preserved mtimes; only its root crate fingerprint was invalidated.

## Original ordering

The exact normalized deposit dispatch wrapper at original938616 has an aligned direct call at offset544 to the business handler `0x2fb38`, size7,128. The published counterpart is6,824 bytes. `anchor.json` records that mapping; `original.asm` retains the complete original handler.

The original computes available quote reserves at+200, the first ceiling ratio at+368, narrows it, and checks the maximum base input before the second ceiling ratio at+1,728. Quote mint AccountInfo cloning occurs at+2,096, decoded transfer fees at+2,208, and amount-before-fee at+2,608. It checks gross quote is at least net quote and then enforces the maximum quote input. Only afterward does it transfer base, transfer quote, and mint LP tokens. Its LP supply store occurs at+4,184, before can-boost at+4,208.

The reconstructed deposit now follows those boundaries: direct ceiling-ratio calls with caller-side narrowing; early base-limit validation; shared `from_mint` and `amount_before_fee`; checked gross-minus-net fee derivation; and LP supply storage before virtual-reserve adjustment. Existing withdraw behavior and the preceding burn recovery remain intact.

## Behavior and evidence

The44-case focused probe includes zero/one base and quote reserves, zero/one supply, zero/one/two/maximum amounts, transfer-fee caps and invalid basis points, frozen quote accounts, and failed base-input limits. The published candidate fails four cases: with maximum base input0, invalid or full quote fees produce Overflow6023 before the original's ExceededSlippage6004. The new candidate passes all44.

The existing680-case liquidity suite also passes. `verify_receipts.py` independently decodes and cryptographically verifies1,536 retained transactions, checks768 equal original/candidate signed-message pairs across the baseline/focused/regression reports, and rehashes all41 compiled source inputs. It preserves the baseline's four failures as negative evidence.

## Byte comparison and remaining gap

All785 original windows were reassessed under the unchanged reader and normalization:585 normalized,124 raw,200 unmatched. There are no losses. The sole new normalized window versus published8e69 is the included1,616-byte burn helper; deposit adds no complete-body match. Matched original text is644,232/1,162,040 bytes. Direct-call closure is523 windows, no-indirect closure272, and strict-boundary closure77.

Deposit's new business body is7,464 bytes versus original7,128. It remains unmatched; no exact-body claim is made. Its recovered fee helper calls are the existing1,312-byte decoder and688-byte amount-before-fee helper. The eight original520-byte error closures immediately following deposit have existing same-size candidate shapes differing only in source-line/filename-length immediate stores. `error-helper-gap.json` records that bounded comparison. The original source filename is `programs/pump-amm/src/instructions/liquidity/deposit.rs` (55 bytes); for example0x31710 records line91. This is a genuine source-organization lead already assigned to the other worker, not a reason to pad source or replace diagnostic coordinates.
