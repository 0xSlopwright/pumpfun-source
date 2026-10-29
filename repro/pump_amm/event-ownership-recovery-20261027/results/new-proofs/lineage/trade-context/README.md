# TradeV2 context module candidate

Private candidate cf6dc4a70688f27d6b4a81a0cca78cd905062860bea1f9552722442a3c03f189 gains original initializer helper 0xbd3b0/8128 over the included 631-window control. It measures 632/785 normalized windows, 128 raw windows and 777048/1162040 matched normalized text bytes, with no normalized or raw losses. This is not full ELF identity and is separate from the parent's later selected checkpoint.

The patch moves the existing TradeV2 context, program marker and fee account aliases/IDs into instructions/swap/trade_v2.rs before its quote/event helpers. Existing callers use a re-export from trade.rs. Explicit imports are required by code or macro expansion. The original descriptor supports this module path and derive position; it does not prove historical imports, formatting or source text. The failed first import arrangement and its diagnostics are retained under alternates and attempt-1-build.

The saved direct v2 and multihop suites contain 1605 distinct fixture inputs: 870 direct v2 and 735 multihop. Original/base and original/candidate comparisons total 3210 cases, 6420 transactions and 6436 verified signatures. Compared fields cover errors, committed states, lamports and inner instructions; saved raw log hashes are bound separately. The transactions are normally signed synthetic fixtures using captured dependency binaries. This is bounded runtime evidence, not whole-program equivalence.

The measured base retains the token control's unused error import. This patch does not touch it. Applying this patch to a clean combined source requires that candidate's own build, measurement and replay evidence.

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B verify_packet.py` to verify the sealed file inventory, all 218 recorded source inputs, source transformation, build hashes, all 785 windows, no-loss delta, decoded signatures, paired messages, dependency hashes and observations without compiling or running a VM. The packet is a saved-evidence verifier rather than a standalone hermetic rebuild environment.
